// ============================================
// Lx Humanized Agent Engine - Main API v1.0
// POST /api/agent/message
// ============================================

import { NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';

// Core modules
import { getOpener } from '@/core/aos';
import { classifyMessage, detectRepeatedObjection } from '@/core/classifier';
import { HUMANIZATION_KERNEL, enforceKernelRules, removeForbiddenStarters } from '@/core/kernel';
import {
    createInitialSession,
    generateSessionSummary,
    extractContextFromMessage,
    shouldSummarize
} from '@/core/memory';
import { dispatch, determineAction } from '@/core/dispatcher';
import { AgentContext, ManyChatInbound, ManyChatOutbound, SessionState } from '@/core/types';

// Validação de schema
import { validateInbound, validateOutbound } from './schemas';

export const maxDuration = 30;

// Store temporário (produção usaria Redis/Postgres)
const sessionStore = new Map<string, SessionState>();

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Validar payload ManyChat
        const inbound = validateInbound(body);
        if (!inbound) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // 2. Recuperar ou criar sessão
        const session = getOrCreateSession(inbound);

        // 3. Construir contexto
        const context: AgentContext = {
            session,
            message: inbound.text,
            channel: detectChannel(body),
            source: 'manychat',
            timestamp: new Date().toISOString(),
        };

        // 4. Se é primeira mensagem, usar Opener
        if (session.message_count === 0) {
            const opener = getOpener(context);
            session.message_count = 1;
            session.first_interaction = false;
            session.last_interaction_at = context.timestamp;

            const response = dispatch(opener, 'RESPOND', context);
            saveSession(session);

            return NextResponse.json(formatOutbound(response));
        }

        // 5. Classificar mensagem (invisível)
        const classification = await classifyMessage(context);
        session.current_intent = classification.intent;
        session.risk_level = classification.risk;

        // 6. Atualizar contadores de objeção
        if (classification.intent === 'objecao') {
            session.objection_count++;
            if (detectRepeatedObjection(inbound.text, session.last_objection)) {
                session.same_objection_count++;
            } else {
                session.same_objection_count = 1;
            }
            session.last_objection = inbound.text;
        }

        // 7. Extrair contexto da mensagem
        const contextUpdates = extractContextFromMessage(inbound.text, session);
        Object.assign(session, contextUpdates);

        // 8. Determinar ação
        const action = determineAction(context);

        // 9. Se handoff, retornar imediatamente
        if (action === 'REQUEST_HANDOFF') {
            session.message_count++;
            const response = dispatch('', action, context);
            saveSession(session);
            return NextResponse.json(formatOutbound(response));
        }

        // 10. Se calendly, enviar link
        if (action === 'SEND_CALENDLY') {
            session.message_count++;
            const response = dispatch('Aqui está o link para agendar:', action, context);
            saveSession(session);
            return NextResponse.json(formatOutbound(response));
        }

        // 11. Gerar resposta com LLM
        const llmResponse = await generateResponse(context);

        // 12. Aplicar regras do Kernel
        let finalText = enforceKernelRules(llmResponse);
        finalText = removeForbiddenStarters(finalText);

        // 13. Atualizar sessão
        session.message_count++;
        session.last_interaction_at = context.timestamp;

        // 14. Resumir se necessário
        if (shouldSummarize(session)) {
            session.session_summary = generateSessionSummary([], session);
        }

        // 15. Salvar e responder
        saveSession(session);
        const response = dispatch(finalText, 'RESPOND', context);

        return NextResponse.json(formatOutbound(response));

    } catch (error) {
        console.error('Agent Error:', error);
        return NextResponse.json({
            error: 'Internal error',
            text: 'Desculpa, tive um problema técnico. Pode repetir?'
        }, { status: 500 });
    }
}

async function generateResponse(context: AgentContext): Promise<string> {
    try {
        const provider = createOpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY || '',
        });

        const systemPrompt = `${HUMANIZATION_KERNEL}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## CONTEXTO ATUAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${context.session.session_summary || 'Primeira interação.'}

Intenção detectada: ${context.session.current_intent}
Risco: ${context.session.risk_level}
Nome do lead: ${context.session.lead_name || 'Não informado'}
Área: ${context.session.lead_niche || 'Não informada'}
Objetivo: ${context.session.lead_goal || 'Não informado'}
`;

        const result = await generateText({
            model: provider('anthropic/claude-3.5-sonnet') as any,
            system: systemPrompt,
            prompt: `Mensagem do lead: "${context.message}"

Responda em no máximo 2 frases, seguindo as regras do Kernel.`,
            temperature: 0.4,
            maxTokens: 150,
        });

        return result.text;

    } catch (error) {
        console.error('LLM Error:', error);
        return getFallbackResponse(context);
    }
}

function getFallbackResponse(context: AgentContext): string {
    const { session, message } = context;
    const lower = message.toLowerCase();

    // Fallbacks baseados em intenção
    if (session.current_intent === 'orcamento') {
        return 'Sobre valores, depende do escopo. Quer agendar 10 min pra gente detalhar?';
    }
    if (session.current_intent === 'agendamento') {
        return 'Te mando o link do calendário pra você escolher o melhor horário?';
    }
    if (session.current_intent === 'objecao') {
        return 'Entendo. Posso te enviar mais informações pra você avaliar com calma?';
    }

    return 'Entendi. Em que mais posso te ajudar?';
}

function getOrCreateSession(inbound: ManyChatInbound): SessionState {
    const key = inbound.subscriber_id;

    if (sessionStore.has(key)) {
        const existing = sessionStore.get(key)!;

        // Calcular dias desde última interação
        if (existing.last_interaction_at) {
            const lastDate = new Date(existing.last_interaction_at);
            const now = new Date();
            existing.days_since_last = Math.floor(
                (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
            );
        }

        return existing;
    }

    return createInitialSession(
        inbound.subscriber_id,
        inbound.custom_fields?.lead_id
    );
}

function saveSession(session: SessionState): void {
    sessionStore.set(session.subscriber_id, session);
    // TODO: Persist to Postgres in production
}

function detectChannel(body: any): 'whatsapp' | 'site' {
    // ManyChat geralmente é WhatsApp
    if (body.platform === 'whatsapp' || body.channel === 'whatsapp') {
        return 'whatsapp';
    }
    return 'site';
}

function formatOutbound(response: any): ManyChatOutbound {
    const actions: ManyChatOutbound['actions'] = [];

    // Tags
    if (response.metadata?.tags_to_add) {
        for (const tag of response.metadata.tags_to_add) {
            actions.push({ type: 'add_tag', value: tag });
        }
    }

    // Custom fields
    if (response.metadata?.custom_fields) {
        for (const [field, value] of Object.entries(response.metadata.custom_fields)) {
            actions.push({
                type: 'set_custom_field',
                field_name: field,
                value: String(value)
            });
        }
    }

    return {
        text: response.text,
        actions
    };
}
