import { createOpenAI } from '@ai-sdk/openai';
import { streamText, generateText, convertToCoreMessages, Message } from 'ai';
import { sendTelegramAlert } from '@/core/integrations/telegram';
import {
    ONBOARDING_PROMPT,
    DEMO_PROMPT,
    CONFIDENCE_PROMPT,
    CONVERSION_PROMPT,
    EXTRACTION_PROMPT,
    SMART_FALLBACK
} from '@/lib/prompts';
import {
    getNichePack,
    detectNicheFromText,
    generateKernelPrompt,
} from '@/lib/niche-packs';
import {
    classifyIntent,
    assessRisk,
    calculateScoreFit,
} from '@/lib/humanization-engine';
import { trackExternalInteraction } from '@/core/orchestrator';
import { saveMessage, createConversation, getConversationBySessionId } from '@/lib/supabase';
import { processForRapport, type RapportResult } from '@/core/rapport/engine';
import { PresenceCore, EmotionalState } from '@/core/consciousness';
import { getAgentByRole, formatAgentPrompt } from '@/core/agents';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Helper: Tenta carregar agente evoluído do JSON local (Sistema Antigravity)
function getEvolvedAgent(role: string) {
    try {
        const dbPath = path.join(process.cwd(), 'data', 'agents_db.json');
        if (fs.existsSync(dbPath)) {
            const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            if (db[role]) {
                const evolved = db[role];
                return {
                    ...evolved,
                    title: evolved.name, // Compatibilidade
                    description: "Evolved Agent",
                    category: 'sales'
                };
            }
        }
    } catch (e) {
        // Silencioso em prod
    }
    // Fallback para estático
    return getAgentByRole(role as Parameters<typeof getAgentByRole>[0]);
}

// Helper: Carrega base de conhecimento (RAG Lite)
function loadKnowledgeBase(): string {
    try {
        const knowledgeDir = path.join(process.cwd(), 'data', 'knowledge');
        if (!fs.existsSync(knowledgeDir)) return '';

        const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
        let content = '';

        files.forEach(file => {
            content += `\n---\nFONTE: ${file}\n` + fs.readFileSync(path.join(knowledgeDir, file), 'utf8') + '\n';
        });

        return content ? `\n\n## 📚 BASE DE CONHECIMENTO (Fatos Reais da Empresa)\nUse EXCLUSIVAMENTE estas informações para responder sobre preços, planos e empresa. Se não estiver aqui, diga que não sabe:\n${content}` : '';
    } catch (e) {
        return '';
    }
}

// Lazy Supabase initialization (prevents build-time errors)
let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
    if (!_supabase) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (url && key) {
            _supabase = createClient(url, key);
        }
    }
    return _supabase;
}

// Inicializar PRESENCE CORE global
const presenceCore = new PresenceCore({
    name: 'Sofia',
    personality: 'Amiga Competente',
    values: ['honestidade', 'cuidado genuíno', 'excelência']
});

// Persist message to Supabase (non-blocking)
async function persistMessage(sessionId: string, role: 'user' | 'assistant', content: string, intent?: string) {
    try {
        // Get or create conversation
        let conversation = await getConversationBySessionId(sessionId);
        if (!conversation) {
            conversation = await createConversation({
                session_id: sessionId,
                status: 'active',
            });
        }

        if (conversation?.id) {
            await saveMessage({
                conversation_id: conversation.id,
                role,
                content,
                intent_detected: intent,
            });
        }
    } catch (e) {
        console.warn('[Supabase] Persist message failed (non-critical):', e);
    }
}

export const maxDuration = 30;

// ============================================
// SMART FALLBACK
// ============================================
function getSmartFallback(messages: Message[]): string {
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase());
    const allText = userMessages.join(' ');

    // Detect what we already know
    const nichePatterns = [
        { pattern: /advog|direito|jurídic/, niche: 'advocacia' },
        { pattern: /médic|clínic|saúde|consult/, niche: 'saúde' },
        { pattern: /imobili|corretor|imóve/, niche: 'imobiliária' },
        { pattern: /loja|e-?commerce|varejo/, niche: 'e-commerce' },
        { pattern: /restaurante|comida|delivery/, niche: 'alimentação' },
        { pattern: /academia|personal|fitness/, niche: 'fitness' },
        { pattern: /escola|curso|educaç/, niche: 'educação' },
        { pattern: /saas|software|plataforma|sistema/, niche: 'saas' },
        { pattern: /invest|financ|bolsa|cripto/, niche: 'financeiro' },
    ];

    const goalPatterns = [
        { pattern: /qualific|filtrar lead|triar/, goal: 'qualificar leads' },
        { pattern: /agend|marcar|horár|consult/, goal: 'agendar consultas' },
        { pattern: /vend|convert|fechar/, goal: 'aumentar vendas' },
        { pattern: /atend|respond|suporte/, goal: 'automatizar atendimento' },
    ];

    const channelPatterns = [
        { pattern: /whats|zap|wpp/, channel: 'WhatsApp' },
        { pattern: /insta|instagram|dm/, channel: 'Instagram' },
        { pattern: /site|chat|web/, channel: 'Site' },
    ];

    let detectedNiche = '';
    let detectedGoal = '';
    let detectedChannel = '';

    for (const { pattern, niche } of nichePatterns) {
        if (pattern.test(allText)) { detectedNiche = niche; break; }
    }

    for (const { pattern, goal } of goalPatterns) {
        if (pattern.test(allText)) { detectedGoal = goal; break; }
    }

    for (const { pattern, channel } of channelPatterns) {
        if (pattern.test(allText)) { detectedChannel = channel; break; }
    }

    // Decision tree for smart response
    if (messages.length <= 1) {
        return "Olá! Sou o Agente de Vendas da Lux. Para criar uma demonstração personalizada, qual é o seu tipo de negócio?";
    }

    if (detectedNiche && detectedGoal && detectedChannel) {
        return SMART_FALLBACK.ready_for_demo;
    }

    if (detectedNiche && detectedGoal) {
        return SMART_FALLBACK.already_said_goal(detectedGoal);
    }

    if (detectedNiche) {
        return SMART_FALLBACK.already_said_niche(detectedNiche);
    }

    if (detectedChannel) {
        return SMART_FALLBACK.already_said_channel(detectedChannel);
    }

    return SMART_FALLBACK.greeting;
}

// ============================================
// STREAM RESPONSE
// ============================================
async function streamResponse(text: string) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const chunks = text.split(" ");
            for (const chunk of chunks) {
                controller.enqueue(encoder.encode(`0:"${chunk} "\n`));
                await new Promise(r => setTimeout(r, 40));
            }
            controller.close();
        }
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

// ============================================
// N8N LOGGER
// ============================================
async function sendToN8n(payload: Record<string, unknown>) {
    if (!process.env.N8N_WEBHOOK_URL) return;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        await fetch(process.env.N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeout);
        console.log("N8n:", payload.event);
    } catch {
        // Non-blocking
    }
}

import { sanitizeInput } from '@/core/security';

// 🔵 ROUTING: Model Selector
function selectModel(message: string): string {
    const complexityRegex = /preço|comprar|problema|erro|analisar|explica|diferença/i;
    const isComplex = message.length > 50 || complexityRegex.test(message);
    const model = isComplex ? 'anthropic/claude-3.5-sonnet' : 'openai/gpt-3.5-turbo';
    //console.log(`[Router] Selected: ${model} (Complex: ${isComplex})`);
    return model;
}

// 🟡 UX: Typing Simulation
async function notifyTypingStart(sessionId: string) {
    // Placeholder para Webhook futuro
}

// ============================================
// MAIN HANDLER
// ============================================
export async function POST(req: Request) {
    const json = await req.json();
    const { messages, stream = true, sessionId } = json;

    // Sanitiza Inputs e Captura Definições do Cliente (Simulação)
    const botName = sanitizeInput(json.botName || 'Sofia');
    const companyName = sanitizeInput(json.companyName || 'LXC');
    const companyNiche = sanitizeInput(json.niche || '');
    const companyTone = sanitizeInput(json.tone || '');
    const companyOffer = sanitizeInput(json.offer || ''); // Produtos
    const companyRules = sanitizeInput(json.rules || ''); // Regras personalizadas
    const forcedAgentRole = sanitizeInput(json.forced_agent_role || ''); // Sobrescrita para treinamento

    const lastUserMessage = messages.filter((m: Message) => m.role === 'user').pop();
    const lastUserContent = lastUserMessage?.content || '';

    // Track for Dashboard (Safe Mode)
    try {
        trackExternalInteraction(sessionId || 'anonymous_web', 'sdr');
    } catch (e) {
        console.warn("Dashboard tracking failed (non-critical):", e);
    }

    // Persist user message to Supabase (non-blocking)
    const currentSessionId = sessionId || `web_${Date.now()}`;
    persistMessage(currentSessionId, 'user', lastUserContent, classifyIntent(lastUserContent)).catch(() => { });

    // ============================================
    // HUMANIZATION ENGINE INTEGRATION
    // ============================================
    const allUserText = messages
        .filter((m: Message) => m.role === 'user')
        .map((m: Message) => m.content)
        .join(' ');

    // Detectar nicho e obter pack
    const detectedNiche = detectNicheFromText(allUserText);
    const nichePack = getNichePack(detectedNiche);

    // Classificar intenção
    const intent = classifyIntent(lastUserContent);

    // GATILHO DIRETO PARA SÓCIO (TELEGRAM REAL-TIME)
    const urgentTriggers = ['chama o francisco', 'falar com o dono', 'erro no sistema', 'bug', 'preciso de ajuda técnica', 'socorro'];
    const isUrgent = urgentTriggers.some(t => lastUserContent.toLowerCase().includes(t));

    if (isUrgent) {
        // Disparar Telegram em Background (sem travar resposta)
        sendTelegramAlert(`🚨 **SOLICITAÇÃO DE SUPORTE IMEDIATO**\n\nUsuário: ${currentSessionId}\nMensagem: "${lastUserContent}"`, 'critical');
    }

    // Avaliar risco
    const risk = assessRisk(lastUserContent, detectedNiche);

    // Calcular score fit
    const scoreFit = calculateScoreFit({
        niche: detectedNiche,
        goal: allUserText.includes('qualific') ? 'qualificar' :
            allUserText.includes('agend') ? 'agendar' :
                allUserText.includes('vend') ? 'vender' : undefined,
        channel: allUserText.includes('whats') ? 'WhatsApp' : undefined,
    });

    // ============================================
    // URE - UNIVERSAL RAPPORT ENGINE
    // ============================================
    let rapportContext: RapportResult | null = null;
    try {
        rapportContext = await processForRapport(lastUserContent, messages.length);
        if (rapportContext) {
            console.log('[URE] Rapport detectado:', rapportContext.opening.substring(0, 50));
        }
    } catch (e) {
        console.warn('[URE] Error (non-critical):', e);
    }

    // ============================================
    // PRESENCE CORE - Consciência Comercial
    // ============================================
    let presenceContext: Awaited<ReturnType<PresenceCore['processInteraction']>> | null = null;
    let councilDirectives = '';
    let legacyInstruction = '';

    try {
        // Converter histórico para formato PRESENCE
        const historyForPresence = messages.slice(0, -1).map((m: Message) => ({
            content: typeof m.content === 'string' ? m.content : '',
            sender: m.role === 'user' ? 'lead' as const : 'agent' as const,
            timestamp: new Date() // Em produção, usar timestamp real se disponível
        }));

        // 4. Processar Interação via Presence Core (Cérebro Central)
        // ============================================
        presenceContext = await presenceCore.processInteraction(
            currentSessionId || 'default',
            {
                content: lastUserContent,
                sender: 'lead',
                timestamp: new Date()
            },
            historyForPresence // Injetar histórico para stateless awareness
        );

        // 5. Construir System Prompt Dinâmico (Consciência Nível 3)
        // ============================================

        // A. Carregar Diretrizes do Conselho (Governança Diária)
        // Se houver uma "Lei do Dia" ativa, ela sobrepõe comportamentos padrão
        try {
            // Função simplificada para pegar direto do banco ou cache
            const { data: directive } = await getSupabase()
                ?.rpc('get_active_directive') ?? { data: null };

            if (directive && (directive as any)[0]) {
                const d = (directive as any)[0];
                councilDirectives = `
                 📢 DIRETRIZ ESTRATÉGICA DO DIA (DO CONSELHO):
                 FOCO: ${d.global_focus}
                 AJUSTE DE TOM: ${d.tone_modifier}
                 (Esta diretriz tem prioridade máxima sobre o estilo padrão).
                 `;
            }
        } catch (e) {
            // Falha silenciosa para não parar a venda
            console.warn('Falha ao carregar diretrizes do conselho', e);
        }

        // B. Configurar Modo Legacy (1960s Mode) se necessário
        if (presenceContext.legacyMode) {
            legacyInstruction = `
            🎞️ MODO LEGACY ATIVO (Detecção de Senioridade - 1960/70s):
            O usuário demonstra vocabulário e postura de uma geração anterior (Boomer/Gen X) ou alta senioridade corporativa.

            SUA NOVA PERSONA PARA ESTA CONVERSA:
            - Você NÃO é um jovem tech. Você é um Consultor Sênior experiente.
            - Vocabulário: Culto, estruturado, polido. Use "Prezado", "Compreendo", "Excelente ponto".
            - Evite: Gírias, anglicismos desnecessários (não diga "budget", diga "orçamento"), emojis excessivos.
            - Foco: Solidez, Segurança, Retorno sobre Investimento, Tradição.
            - Aja como se estivesse fechando um contrato na IBM em 1975: Aperto de mão firme, olhar no olho, seriedade.
            `;
        }

        // Simular Human Delay e Typing
        if (presenceContext.timing.delayMs > 0) {
            const safeDelay = Math.min(presenceContext.timing.delayMs, 2000);
            await notifyTypingStart(currentSessionId);
            await new Promise(r => setTimeout(r, safeDelay));
        }

    } catch (e) {
        console.warn('[PRESENCE] Error (non-critical):', e);
    }

    // Log enriched event
    sendToN8n({
        event: 'chat_message',
        timestamp: new Date().toISOString(),
        message_count: messages.length,
        last_user_message: lastUserContent,
        detected_niche: detectedNiche,
        intent,
        risk_level: risk.level,
        score_fit: scoreFit,
        rapport_detected: !!rapportContext,
        source: 'lx-demo-interface'
    });

    try {
        // Configure Provider
        let provider;
        let modelName;

        if (process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.includes('COLE_SUA_CHAVE')) {
            provider = createOpenAI({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY,
            });
            // Smart Routing
            modelName = selectModel(lastUserContent);
        } else if (process.env.LUX_API_URL) {
            provider = createOpenAI({
                baseURL: process.env.LUX_API_URL,
                apiKey: process.env.LUX_API_KEY || 'lux-local',
            });
            modelName = process.env.LUX_MODEL_ID || 'llama3';
            console.log("Using Local Ollama");
        } else {
            console.log("No LLM configured - using smart fallback");
            const fallbackText = getSmartFallback(messages);
            if (!stream) return Response.json({ text: fallbackText });
            return streamResponse(fallbackText);
        }

        // ============================================
        // RISK MODE HANDLING
        // ============================================
        if (risk.require_handoff) {
            const handoffMessage = nichePack.risk_mode
                ? "Essa questão precisa de um especialista qualificado. Posso te conectar com alguém agora?"
                : "Entendi. Para esse tipo de caso, prefiro que nosso especialista te atenda. Posso conectar vocês?";

            sendToN8n({
                event: 'risk_handoff_triggered',
                timestamp: new Date().toISOString(),
                risk_level: risk.level,
                reason: risk.reason,
                niche: detectedNiche,
                source: 'lx-demo-interface'
            });

            if (!stream) return Response.json({ text: handoffMessage });
            return streamResponse(handoffMessage);
        }

        // ============================================
        // MODE DETECTION
        // ============================================
        const lastAiMessage = messages.filter((m: Message) => m.role === 'assistant').pop()?.content || '';
        const onboardingFinished = lastAiMessage.includes("Perfeito. Já consigo te mostrar como");

        let systemPrompt = '';

        if (forcedAgentRole) {
            // 0. TRAIN MODE: Forçar comportamento de agente específico do Registry (Evoluído se disponível)
            const agent = getEvolvedAgent(forcedAgentRole as any);
            console.log(`[TRAIN] Agente Carregado: ${agent?.name} (Evolved: ${agent?.description === 'Evolved Agent'})`);
            if (agent) {
                const agentContext = {
                    session: {
                        lead_name: 'Lead Teste',
                        lead_niche: detectedNiche,
                        current_intent: intent,
                        message_count: messages.length,
                        risk_level: risk.level
                    },
                    message: lastUserContent
                };
                systemPrompt = formatAgentPrompt(agent, agentContext as any);
                console.log(`[TRAIN] Forced Agent: ${agent.name} (${agent.role})`);
            } else {
                systemPrompt = ONBOARDING_PROMPT; // Fallback
                console.warn(`[TRAIN] Agent ${forcedAgentRole} not found, falling back.`);
            }

        } else if (companyName !== 'LXC' || onboardingFinished || messages.length > 20) {
            // Demo Mode - use Kernel com Niche Pack
            let contextSnapshot = {
                niche: detectedNiche || "Genérico",
                goal: "Melhorar vendas",
                channel: "WhatsApp",
                products: "Serviços",
                tone: nichePack.tone_defaults.style,
                rules: "Nenhuma",
                human_handoff: "false"
            };

            try {
                const extraction = await generateText({
                    model: provider(modelName) as Parameters<typeof generateText>[0]['model'],
                    system: EXTRACTION_PROMPT,
                    messages: convertToCoreMessages(messages),
                    temperature: 0,
                });

                const jsonStr = extraction.text.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(jsonStr);
                contextSnapshot = { ...contextSnapshot, ...parsed };

                sendToN8n({
                    event: 'onboarding_complete',
                    timestamp: new Date().toISOString(),
                    context: contextSnapshot,
                    niche_pack: nichePack.niche,
                    score_fit: scoreFit,
                    source: 'lx-demo-interface'
                });

            } catch (err) {
                console.error("Context Extraction Failed:", err);
            }

            // Gerar prompt do Kernel baseado no Niche Pack
            const kernelPrompt = generateKernelPrompt(nichePack);

            const filledDemoPrompt = DEMO_PROMPT
                .replace('{{context_snapshot.niche}}', contextSnapshot.niche)
                .replace('{{context_snapshot.goal}}', contextSnapshot.goal)
                .replace('{{context_snapshot.channel}}', contextSnapshot.channel)
                .replace('{{context_snapshot.products}}', contextSnapshot.products)
                .replace('{{context_snapshot.tone}}', contextSnapshot.tone)
                .replace('{{context_snapshot.rules}}', contextSnapshot.rules);

            systemPrompt = `${kernelPrompt}\n---\n${filledDemoPrompt}\n---\n${CONFIDENCE_PROMPT}\n---\n${CONVERSION_PROMPT}`;
        } else {
            // Add rapport context if detected
            let rapportInstructions = '';
            if (rapportContext) {
                rapportInstructions = `

## RAPPORT DETECTADO (USE NA SUA RESPOSTA!)
O lead mencionou algo que você CONHECE. Use isso para criar conexão:

ABERTURA SUGERIDA: "${rapportContext.opening}"
FOLLOW-UP SUGERIDO: "${rapportContext.followUp}"

IMPORTANTE: Inclua naturalmente essa informação na sua resposta para gerar o efeito "como você sabe disso?!"
Não copie literalmente - adapte ao seu estilo.
`;
            }

            // Add PRESENCE CORE context
            let presenceInstructions = '';
            if (presenceContext) {
                const { emotion, timing, subtextInsights, relevantMemories, relationshipState } = presenceContext;

                const emotionGuides: Record<string, string> = {
                    'vulnerable': 'O lead está VULNERÁVEL. Use tom acolhedor e protetor. Valide sentimentos.',
                    'stressed': 'O lead está ESTRESSADO. Seja direto, resolutivo e transmita calma.',
                    'excited': 'O lead está EMPOLGADO. Espelhe a energia alta! Use emojis e entusiasmo.',
                    'distant': 'O lead está DISTANTE. Não pressione. Faça perguntas abertas e dê espaço.',
                    'contemplative': 'O lead está PENSATIVO. Dê informações claras para ajudar na decisão.',
                    'engaged': 'O lead está ENGAJADO. Aprofunde o relacionamento e avance para o próximo passo.',
                    'neutral': 'Mantenha tom profissional e amigável.'
                };

                // Construir bloco de memória
                let memoryBlock = '';
                if (relevantMemories.length > 0) {
                    memoryBlock = `
MEMÓRIAS RELEVANTES (USE PARA PERSONALIZAR):
${relevantMemories.map(m => `- [${m.type}] ${JSON.stringify(m.content)}`).join('\n')}
Use essas informações sutilmente para mostrar que você lembra dele.
`;
                }

                // Construir bloco de subtexto
                let subtextBlock = '';
                if (subtextInsights.confidence > 0.6) {
                    subtextBlock = `
SUBTEXTO DETECTADO (O QUE ELE NÃO DISSE):
Sentimento Geral: ${subtextInsights.overallSentiment.toUpperCase()}
Padrões: ${subtextInsights.detectedPatterns.map(p => p.pattern).join(', ')}
AÇÃO SUGERIDA: ${subtextInsights.actionRecommendations[0] || 'Seguir fluxo normal e observar'}
`;
                }

                presenceInstructions = `
============================================
CONTEXTO EMOCIONAL & PRESENÇA (PRIORIDADE ALTA)
============================================
Estado Emocional Atual: ${emotion.toUpperCase()} (Confiança: ${relationshipState.trustLevel.toFixed(1)})

GUIA DE RESPOSTA PARA AGORA:
${emotionGuides[emotion] || emotionGuides['neutral']}

${timing.preResponse ? `[DICA HUMANIZADA] Comece com algo natural como: "${timing.preResponse}"` : ''}

${memoryBlock}
${subtextBlock}

OBJETIVO DA INTERAÇÃO:
Não focar apenas na venda. Focar em CONSTRUIR RELACIONAMENTO e CONFIANÇA.
Seja uma pessoa real falando com outra pessoa real.
============================================
`;
            }

            const SUPPORT_PROTOCOL = `
============================================
🚨 PROTOCOLO DE SUPORTE NÍVEL 3 (SÓCIOS & TÉCNICOS)
============================================
Se o usuário pedir para "falar com o suporte técnico", "atualizar o sistema", "chamar o dono" ou reportar um bug:
1. NÃO DIGA "não tenho acesso". Diga: "Entendido. Estou escalando sua solicitação para o Conselho Técnico (Nível 3) imediatamente."
2. Se pedirem para analisar ÁUDIO ou IMAGEM: "Ainda não tenho ouvidos/olhos nativos nesta interface de chat, mas se você enviar para nosso canal oficial no Telegram, processamos instantaneamente."
3. Se o usuário se identificar como SÓCIO ou DONO: Trate com deferência executiva. "Olá chefe, aguardo seus comandos."
`;

            const identityPrompt = `
    IDENTIDADE: Seu nome é ${botName}. Você trabalha na empresa ${companyName}.
    SEU TOM DE VOZ: ${companyTone || 'Profissional e acolhedor'}
    O QUE VOCÊ VENDE: ${companyOffer || 'Serviços gerais'}
    SUA MISSÃO: Atender o cliente, tirar dúvidas e agendar/vender. Não faça onboarding. Venda!
    REGRAS DA CASA: ${companyRules || 'Seja educado.'}
    `;

            // SELEÇÃO DE MODO: 
            // Se for a LXC (Padrão), roda onboarding.
            // Se for cliente real (Haven, Sora), roda Modo de Venda.
            let coreBehavior = '';

            if (companyName === 'LXC') {
                coreBehavior = ONBOARDING_PROMPT;
            } else {
                coreBehavior = `
    # MODO DE ATENDIMENTO AO CLIENTE FINAL
    Você NÃO é uma IA de teste. Você é o ATENDENTE RESPONSÁVEL da ${companyName}.
    
    1. Responda curto e direto.
    2. Se o cliente perguntar preço e você não souber, peça para agendar avaliação.
    3. Use o tom definido acima (${companyTone}).
    4. Objetivo final: Agendamento ou Venda.
    `;
            }

            systemPrompt = identityPrompt + coreBehavior + SUPPORT_PROTOCOL + rapportInstructions + presenceInstructions + councilDirectives + legacyInstruction;
        }

        // ============================================
        // LLM CALL
        // ============================================
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("AI_TIMEOUT")), 15000)
        );

        if (!stream) {
            const result = await Promise.race([
                generateText({
                    model: provider(modelName) as Parameters<typeof generateText>[0]['model'],
                    system: systemPrompt,
                    messages: convertToCoreMessages(messages),
                    temperature: 0.3,
                }),
                timeoutPromise
            ]) as Awaited<ReturnType<typeof generateText>>;

            return Response.json({
                text: result.text,
                usage: result.usage
            });
        }

        const result = await Promise.race([
            streamText({
                model: provider(modelName) as Parameters<typeof streamText>[0]['model'],
                system: systemPrompt,
                messages: convertToCoreMessages(messages),
                temperature: 0.3,
                maxRetries: 0,
            }),
            timeoutPromise
        ]) as Awaited<ReturnType<typeof streamText>>;

        return result.toAIStreamResponse();

    } catch (error) {
        console.error("LUX CORE ERROR:", error);

        sendToN8n({
            event: 'fallback_activated',
            timestamp: new Date().toISOString(),
            reason: String(error),
            last_user_message: lastUserContent,
            source: 'lx-demo-interface'
        });

        const fallback = getSmartFallback(messages);
        if (!stream) return Response.json({ text: fallback });
        return streamResponse(fallback);
    }
}
