// ============================================
// LX HUMANIZATION ENGINE v1.0
// ============================================
// Motor de humanização com routers de intenção, risco, abertura e handoff

import { getNichePack, detectNicheFromText, generateKernelPrompt, type NichePack } from './niche-packs';

// ============================================
// TIPOS
// ============================================
export interface SessionContext {
    session_id: string;
    lead_id?: string;
    session_count: number;
    first_message_at: string;
    last_message_at: string;
    entry_point: 'landing' | 'ads' | 'referral' | 'direct';
    messages_count: number;
}

export interface LeadSnapshot {
    name?: string;
    phone?: string;
    company?: string;
    niche: string;
    goal?: string;
    channel?: string;
    pain?: string;
    volume?: string;
    tone?: string;
    last_intent?: string;
    last_objection?: string;
    objections_count: number;
    score_fit: number;
}

export interface MemoryState {
    summary: string; // <= 300 chars
    facts: {
        name?: string;
        objective?: string;
        restrictions?: string[];
        objections?: string[];
        next_step?: string;
    };
}

export interface EngineState {
    session: SessionContext;
    lead: LeadSnapshot;
    memory: MemoryState;
    niche_pack: NichePack;
}

// ============================================
// ROUTER 1: INTENÇÃO
// ============================================
export type IntentType =
    | 'duvida'
    | 'orcamento'
    | 'agendamento'
    | 'comparacao'
    | 'objecao'
    | 'suporte'
    | 'urgencia'
    | 'qualificacao'
    | 'demo'
    | 'perfil'
    | 'outros';

const INTENT_PATTERNS: [RegExp, IntentType][] = [
    [/quanto custa|preço|valor|orçamento|investimento necessário/, 'orcamento'],
    [/agendar|marcar|horário|quando|disponibilidade|consulta/, 'agendamento'],
    [/diferença|comparar|melhor|versus|vs|outro|concorrente/, 'comparacao'],
    [/caro|não tenho|sem tempo|vou pensar|depois|não agora/, 'objecao'],
    [/problema|erro|não funciona|ajuda|suporte|bug/, 'suporte'],
    [/urgente|agora|hoje|imediato|emergência/, 'urgencia'],
    [/como funciona|o que é|explica|entender|dúvida/, 'duvida'],
    [/demonstração|demo|ver funcionando|testar/, 'demo'],
    [/perfil|conservador|moderado|arrojado|risco/, 'perfil'],
];

export function classifyIntent(message: string): IntentType {
    const normalized = message.toLowerCase();

    for (const [pattern, intent] of INTENT_PATTERNS) {
        if (pattern.test(normalized)) {
            return intent;
        }
    }

    return 'outros';
}

// ============================================
// ROUTER 2: RISCO
// ============================================
export interface RiskAssessment {
    level: 'low' | 'medium' | 'high' | 'critical';
    reason?: string;
    require_handoff: boolean;
}

const HIGH_RISK_PATTERNS = [
    // Financeiro
    { pattern: /recomenda.*ativo|qual.*investir|melhor.*ação|comprar.*fundo/, sector: 'financeiro', reason: 'Solicitação de recomendação de investimento' },
    { pattern: /garanti.*retorno|quanto.*ganhar|rentabilidade/, sector: 'financeiro', reason: 'Expectativa de garantia de retorno' },
    // Saúde
    { pattern: /diagnóstico|medicamento|receita|sintoma.*grave/, sector: 'saude', reason: 'Solicitação médica' },
    // Jurídico & Ameaças (CRITICAL)
    { pattern: /processo.*ganhar|judicial|liminar|intimação|audiência/, sector: 'juridico', reason: 'Assunto jurídico complexo' },
    { pattern: /advogado|procon|justiça|vou processar|meus direitos|pequenas causas/, sector: 'todos', reason: 'Ameaça legal ou menção a órgãos de defesa' },
    // Fraude/Emergência
    { pattern: /fraude|golpe|perdi.*acesso|roubaram|hackearam/, sector: 'todos', reason: 'Possível fraude ou emergência' },
];

export function assessRisk(message: string, niche: string): RiskAssessment {
    const normalized = message.toLowerCase();
    const pack = getNichePack(niche);

    // Se o pack tem modo risco, verificar termos proibidos
    if (pack.risk_mode) {
        for (const forbidden of pack.forbidden || []) {
            if (normalized.includes(forbidden.toLowerCase())) {
                return {
                    level: 'critical',
                    reason: `Termo proibido detectado: "${forbidden}"`,
                    require_handoff: true
                };
            }
        }
    }

    // Verificar padrões de alto risco
    for (const { pattern, sector, reason } of HIGH_RISK_PATTERNS) {
        if (pattern.test(normalized)) {
            if (sector === 'todos' || niche.includes(sector)) {
                return {
                    level: 'high',
                    reason,
                    require_handoff: true
                };
            }
        }
    }

    // Verificar handoff triggers do pack
    for (const trigger of pack.handoff_triggers) {
        if (normalized.includes(trigger.toLowerCase())) {
            return {
                level: 'medium',
                reason: `Handoff trigger: "${trigger}"`,
                require_handoff: true
            };
        }
    }

    return { level: 'low', require_handoff: false };
}

// ============================================
// ROUTER 3: ABERTURA (VARIAÇÃO CONTROLADA)
// ============================================
export interface OpeningContext {
    is_first_time: boolean;
    is_returning: boolean;
    abandoned_before: boolean;
    last_intent?: string;
    last_objection?: string;
    entry_point: string;
    session_count: number;
}

const OPENING_LINES = {
    first_time: {
        default: "Em que posso te ajudar hoje?",
        landing: "Vi que você está explorando o Lux. O que te trouxe aqui?",
        ads: "Vi seu interesse. Qual problema você quer resolver agora?",
    },
    returning: {
        default: (lastIntent: string) => `Da última vez você perguntou sobre ${lastIntent}. Quer continuar de onde parou?`,
        with_objection: (objection: string) => `Você mencionou "${objection}" antes. Algo mudou ou quer que eu esclareça?`,
    },
    abandoned: {
        default: "Você tinha começado uma conversa antes. Quer retomar de onde parou?",
        after_price: "Você tinha perguntado sobre valores. Posso te ajudar a entender melhor?",
    },
    risk_mode: {
        default: "Posso te ajudar a entender e organizar informações, sem recomendar investimento. Você quer conceito ou decisão operacional?",
    }
};

export function generateOpening(context: OpeningContext, pack: NichePack): string {
    // Modo risco tem abertura específica
    if (pack.risk_mode) {
        return OPENING_LINES.risk_mode.default;
    }

    // Returning user com objeção anterior
    if (context.is_returning && context.last_objection) {
        return OPENING_LINES.returning.with_objection(context.last_objection);
    }

    // Returning user com intent anterior
    if (context.is_returning && context.last_intent) {
        return OPENING_LINES.returning.default(context.last_intent);
    }

    // Abandoned session
    if (context.abandoned_before) {
        return OPENING_LINES.abandoned.default;
    }

    // First time por entry point
    if (context.is_first_time) {
        const entryKey = context.entry_point as keyof typeof OPENING_LINES.first_time;
        return OPENING_LINES.first_time[entryKey] || OPENING_LINES.first_time.default;
    }

    return OPENING_LINES.first_time.default;
}

// ============================================
// ROUTER 4: HANDOFF
// ============================================
export interface HandoffDecision {
    should_handoff: boolean;
    reason: string;
    urgency: 'low' | 'medium' | 'high';
    channel: 'whatsapp' | 'calendly' | 'human';
}

export function evaluateHandoff(
    message: string,
    state: EngineState
): HandoffDecision {
    const normalized = message.toLowerCase();
    const pack = state.niche_pack;

    // Pedido explícito de humano
    if (/humano|pessoa|atendente|falar com algu[eé]m/.test(normalized)) {
        return {
            should_handoff: true,
            reason: 'Pedido explícito de humano',
            urgency: 'high',
            channel: 'human'
        };
    }

    // Risco alto
    const risk = assessRisk(message, state.lead.niche);
    if (risk.require_handoff) {
        return {
            should_handoff: true,
            reason: risk.reason || 'Risco detectado',
            urgency: 'high',
            channel: 'human'
        };
    }

    // Objeções repetidas (2x)
    if (state.lead.objections_count >= 2) {
        return {
            should_handoff: true,
            reason: 'Objeções repetidas (2x)',
            urgency: 'medium',
            channel: 'whatsapp'
        };
    }

    // Intenção de agendamento
    if (/agenda|marcar|reunião|call|conversar/.test(normalized)) {
        return {
            should_handoff: true,
            reason: 'Intenção de agendamento',
            urgency: 'medium',
            channel: 'calendly'
        };
    }

    // Score fit alto (>= 70)
    if (state.lead.score_fit >= 70) {
        return {
            should_handoff: true,
            reason: 'Lead qualificado (score >= 70)',
            urgency: 'low',
            channel: 'calendly'
        };
    }

    return {
        should_handoff: false,
        reason: 'Continuar conversa',
        urgency: 'low',
        channel: 'whatsapp'
    };
}

// ============================================
// SCORE FIT CALCULATOR
// ============================================
export function calculateScoreFit(lead: Partial<LeadSnapshot>): number {
    let score = 0;

    // Clareza do nicho (+20)
    if (lead.niche && lead.niche !== 'Não detectado') score += 20;

    // Objetivo definido (+20)
    if (lead.goal && lead.goal !== 'Não detectado') score += 20;

    // Canal informado (+15)
    if (lead.channel && lead.channel !== 'Não detectado') score += 15;

    // Dor identificada (+15)
    if (lead.pain && lead.pain !== 'Não detectado') score += 15;

    // Volume informado (+10)
    if (lead.volume && lead.volume !== 'Não detectado') score += 10;

    // Penalidades
    // Muitas objeções (-10 por objeção após a primeira)
    const objections = lead.objections_count || 0;
    if (objections > 1) score -= (objections - 1) * 10;

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, score));
}

// ============================================
// MEMORY MANAGER
// ============================================
export function updateMemory(
    current: MemoryState,
    newMessage: string,
    intent: IntentType,
    extractedFacts: Partial<MemoryState['facts']>
): MemoryState {
    // Atualizar resumo (manter <= 300 chars)
    const newSummaryPart = `${intent}: ${newMessage.slice(0, 50)}...`;
    let summary = current.summary
        ? `${current.summary} | ${newSummaryPart}`.slice(-300)
        : newSummaryPart.slice(0, 300);

    // Merge facts
    const facts = {
        ...current.facts,
        ...extractedFacts,
        objections: [
            ...(current.facts.objections || []),
            ...(extractedFacts.objections || [])
        ].slice(-3) // manter últimas 3 objeções
    };

    return { summary, facts };
}

// ============================================
// ENGINE PRINCIPAL
// ============================================
export function createEngineState(
    sessionId: string,
    initialNiche: string = 'servicos'
): EngineState {
    const niche_pack = getNichePack(initialNiche);

    return {
        session: {
            session_id: sessionId,
            session_count: 1,
            first_message_at: new Date().toISOString(),
            last_message_at: new Date().toISOString(),
            entry_point: 'landing',
            messages_count: 0
        },
        lead: {
            niche: initialNiche,
            objections_count: 0,
            score_fit: 0
        },
        memory: {
            summary: '',
            facts: {}
        },
        niche_pack
    };
}

export function processMessage(
    state: EngineState,
    message: string
): {
    intent: IntentType;
    risk: RiskAssessment;
    handoff: HandoffDecision;
    updated_state: EngineState;
    kernel_prompt: string;
} {
    // Detectar nicho do texto se ainda não definido
    if (!state.lead.niche || state.lead.niche === 'servicos') {
        const detectedNiche = detectNicheFromText(message);
        if (detectedNiche !== 'servicos') {
            state.lead.niche = detectedNiche;
            state.niche_pack = getNichePack(detectedNiche);
        }
    }

    // Classificar intenção
    const intent = classifyIntent(message);

    // Avaliar risco
    const risk = assessRisk(message, state.lead.niche);

    // Verificar se é objeção
    if (intent === 'objecao') {
        state.lead.objections_count++;
        state.lead.last_objection = message.slice(0, 50);
    }

    // Atualizar last_intent
    state.lead.last_intent = intent;

    // Recalcular score fit
    state.lead.score_fit = calculateScoreFit(state.lead);

    // Avaliar handoff
    const handoff = evaluateHandoff(message, state);

    // Atualizar session
    state.session.messages_count++;
    state.session.last_message_at = new Date().toISOString();

    // Gerar kernel prompt
    const kernel_prompt = generateKernelPrompt(state.niche_pack);

    return {
        intent,
        risk,
        handoff,
        updated_state: state,
        kernel_prompt
    };
}
