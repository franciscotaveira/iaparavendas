// ============================================
// LX AGENT ORCHESTRATOR v1.0
// ============================================
// Motor de Orquestração Multi-Agente
// Coordena personas, fallback local e decisões de routing
// ============================================

import { AgentContext, AgentResponse, Intent, RiskLevel } from './types';
import {
    AgentPersona,
    AgentRole,
    AGENT_REGISTRY,
    selectAgent,
    shouldHandoffToAnotherAgent,
    formatAgentPrompt
} from './agents';
import {
    hybridGenerate,
    classifyMessageLocally,
    isOllamaAvailable,
    trackCost,
    getCostStats,
    getLocalLLMHealth
} from './local-llm';
import { classifyMessage } from './classifier';
import { HUMANIZATION_KERNEL, enforceKernelRules, removeForbiddenStarters } from './kernel';
import { dispatch, determineAction } from './dispatcher';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// ============================================
// CONFIGURAÇÃO
// ============================================
const ENABLE_LOCAL_FALLBACK = true;
const PREFER_LOCAL_FOR_SIMPLE = true; // Usar local para msgs simples
const ONLINE_TIMEOUT_MS = 8000;

// ============================================
// TIPOS
// ============================================
export interface OrchestratorResult {
    response: AgentResponse;
    metadata: {
        agent: {
            role: AgentRole;
            name: string;
        };
        source: 'online' | 'local' | 'fallback';
        latency_ms: number;
        handoff?: {
            from: AgentRole;
            to: AgentRole | 'human';
            reason: string;
        };
        classification: {
            intent: Intent;
            risk: RiskLevel;
            confidence: number;
        };
    };
}

export interface OrchestrationState {
    current_agent: AgentRole;
    agent_history: AgentRole[];
    handoff_count: number;
    escalated: boolean;
}

// ============================================
// ESTADO DA ORQUESTRAÇÃO (Por Sessão)
// ============================================
const orchestrationStates = new Map<string, OrchestrationState>();

function getOrCreateState(sessionId: string): OrchestrationState {
    if (!orchestrationStates.has(sessionId)) {
        orchestrationStates.set(sessionId, {
            current_agent: 'sdr',
            agent_history: ['sdr'],
            handoff_count: 0,
            escalated: false
        });
    }
    return orchestrationStates.get(sessionId)!;
}

function updateState(sessionId: string, newAgent: AgentRole): void {
    const state = getOrCreateState(sessionId);
    if (state.current_agent !== newAgent) {
        state.agent_history.push(newAgent);
        state.handoff_count++;
    }
    state.current_agent = newAgent;
}

// ============================================
// CLASSIFICAÇÃO HÍBRIDA (Online + Local)
// ============================================
async function classifyHybrid(context: AgentContext): Promise<{
    intent: Intent;
    risk: RiskLevel;
    confidence: number;
    source: 'online' | 'local' | 'fallback';
}> {
    // Tentar classificação local primeiro (mais rápido)
    if (ENABLE_LOCAL_FALLBACK && await isOllamaAvailable()) {
        const localResult = await classifyMessageLocally(context);
        if (localResult && localResult.confidence >= 70) {
            trackCost('local');
            return {
                ...localResult,
                source: 'local'
            };
        }
    }

    // Classificação online
    try {
        const result = await classifyMessage(context);
        trackCost('online');
        return {
            ...result,
            source: 'online'
        };
    } catch (error) {
        console.error('[Orchestrator] Classification failed:', error);
        // Fallback para classificação local
        const localResult = await classifyMessageLocally(context);
        if (localResult) {
            trackCost('local');
            return {
                ...localResult,
                source: 'local'
            };
        }
    }

    // Fallback estático
    trackCost('fallback');
    return {
        intent: 'outro',
        risk: 'baixo',
        confidence: 50,
        source: 'fallback'
    };
}

// ============================================
// GERAÇÃO DE RESPOSTA HÍBRIDA
// ============================================
async function generateHybridResponse(
    context: AgentContext,
    agent: AgentPersona
): Promise<{
    text: string;
    source: 'online' | 'local' | 'fallback';
    latency_ms: number;
}> {
    const startTime = Date.now();

    // Determinar se deve preferir local
    const isSimpleMessage = context.message.length < 50 &&
        ['outro', 'duvida'].includes(context.session.current_intent);

    const shouldPreferLocal = PREFER_LOCAL_FOR_SIMPLE && isSimpleMessage;

    // Gerador online com prompt do agente
    const onlineGenerator = async (): Promise<string> => {
        const provider = createOpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY || '',
        });

        const systemPrompt = `${formatAgentPrompt(agent, context)}

${HUMANIZATION_KERNEL}`;

        const result = await generateText({
            model: provider('anthropic/claude-3.5-sonnet') as any,
            system: systemPrompt,
            prompt: `Mensagem do lead: "${context.message}"

Responda como ${agent.name} (${agent.title}), seguindo a personalidade e regras definidas.`,
            temperature: 0.4,
            maxTokens: 150,
        });

        return result.text;
    };

    // Usar sistema híbrido
    const result = await hybridGenerate(
        onlineGenerator,
        context,
        {
            preferLocal: shouldPreferLocal,
            onlineTimeoutMs: ONLINE_TIMEOUT_MS
        }
    );

    // Aplicar regras do Kernel
    let finalText = enforceKernelRules(result.text);
    finalText = removeForbiddenStarters(finalText);

    // Ajustar tom baseado na personalidade do agente
    finalText = adjustToneForAgent(finalText, agent);

    // Tracking de custos
    trackCost(result.source);

    return {
        text: finalText,
        source: result.source,
        latency_ms: Date.now() - startTime
    };
}

// ============================================
// AJUSTE DE TOM POR AGENTE
// ============================================
function adjustToneForAgent(text: string, agent: AgentPersona): string {
    // Remover emojis se política for 'none'
    if (agent.personality.emoji_usage === 'none') {
        text = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
    }

    // Ajustar brevidade
    if (agent.personality.brevity === 1) {
        // Manter apenas as 2 primeiras frases
        const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
        if (sentences.length > 2) {
            text = sentences.slice(0, 2).join(' ');
        }
    }

    return text.trim();
}

// ============================================
// ORCHESTRATOR PRINCIPAL
// ============================================
export async function orchestrate(context: AgentContext): Promise<OrchestratorResult> {
    const startTime = Date.now();
    const sessionId = context.session.session_id;
    const state = getOrCreateState(sessionId);

    // 1. Classificar mensagem (híbrido)
    const classification = await classifyHybrid(context);

    // Atualizar contexto
    context.session.current_intent = classification.intent;
    context.session.risk_level = classification.risk;

    // 2. Selecionar agente apropriado
    let selectedAgent = selectAgent(context);

    // 3. Verificar se precisa de handoff entre agentes
    const currentAgent = AGENT_REGISTRY[state.current_agent];
    const handoffTo = shouldHandoffToAnotherAgent(currentAgent, context);

    let handoffInfo: OrchestratorResult['metadata']['handoff'] | undefined;

    if (handoffTo === null) {
        // Escalar para humano
        state.escalated = true;
        handoffInfo = {
            from: state.current_agent,
            to: 'human',
            reason: 'Trigger de escalação detectado'
        };

        // Resposta de handoff
        const response = dispatch('', 'REQUEST_HANDOFF', context);
        return {
            response,
            metadata: {
                agent: { role: state.current_agent, name: currentAgent.name },
                source: 'fallback',
                latency_ms: Date.now() - startTime,
                handoff: handoffInfo,
                classification
            }
        };
    }

    if (handoffTo !== undefined) {
        // Handoff para outro agente
        handoffInfo = {
            from: state.current_agent,
            to: handoffTo,
            reason: 'Trigger de handoff detectado'
        };
        selectedAgent = AGENT_REGISTRY[handoffTo];
        updateState(sessionId, handoffTo);
    } else {
        // Manter ou atualizar agente
        updateState(sessionId, selectedAgent.role);
    }

    // 4. Determinar ação especial
    const action = determineAction(context);

    if (action === 'REQUEST_HANDOFF') {
        const response = dispatch('', action, context);
        return {
            response,
            metadata: {
                agent: { role: selectedAgent.role, name: selectedAgent.name },
                source: 'fallback',
                latency_ms: Date.now() - startTime,
                classification
            }
        };
    }

    if (action === 'SEND_CALENDLY') {
        const response = dispatch('Te mando o link pra agendar:', action, context);
        return {
            response,
            metadata: {
                agent: { role: selectedAgent.role, name: selectedAgent.name },
                source: 'fallback',
                latency_ms: Date.now() - startTime,
                classification
            }
        };
    }

    // 5. Gerar resposta (híbrido)
    const generated = await generateHybridResponse(context, selectedAgent);

    // 6. Despachar resposta
    const response = dispatch(generated.text, 'RESPOND', context);

    return {
        response,
        metadata: {
            agent: {
                role: selectedAgent.role,
                name: selectedAgent.name
            },
            source: generated.source,
            latency_ms: Date.now() - startTime,
            handoff: handoffInfo,
            classification
        }
    };
}

// ============================================
// API DE DIAGNÓSTICO
// ============================================
export function getOrchestrationStats(): {
    sessions: number;
    cost_stats: ReturnType<typeof getCostStats>;
    agent_usage: Partial<Record<AgentRole, number>>;
} {
    const agentUsage: Partial<Record<AgentRole, number>> = {};

    for (const [_, state] of orchestrationStates) {
        for (const agent of state.agent_history) {
            agentUsage[agent] = (agentUsage[agent] || 0) + 1;
        }
    }

    return {
        sessions: orchestrationStates.size,
        cost_stats: getCostStats(),
        agent_usage: agentUsage
    };
}

export async function getOrchestrationHealth(): Promise<{
    healthy: boolean;
    local_llm: Awaited<ReturnType<typeof getLocalLLMHealth>>;
    agents_loaded: number;
    config: {
        local_fallback: boolean;
        prefer_local_simple: boolean;
        online_timeout_ms: number;
    };
}> {
    const localHealth = await getLocalLLMHealth();

    return {
        healthy: true,
        local_llm: localHealth,
        agents_loaded: Object.keys(AGENT_REGISTRY).length,
        config: {
            local_fallback: ENABLE_LOCAL_FALLBACK,
            prefer_local_simple: PREFER_LOCAL_FOR_SIMPLE,
            online_timeout_ms: ONLINE_TIMEOUT_MS
        }
    };
}

// ============================================
// LIMPAR ESTADO (Para testes)
// ============================================
export function clearOrchestrationState(sessionId?: string): void {
    if (sessionId) {
        orchestrationStates.delete(sessionId);
    } else {
        orchestrationStates.clear();
    }
}
