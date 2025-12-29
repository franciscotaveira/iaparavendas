// ============================================
// Lx Humanized Agent Engine - Session Memory v1.0
// ============================================

import { SessionState, AgentContext } from './types';

const SUMMARY_INTERVAL = 5; // Resumir a cada N mensagens

interface MessageEntry {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

// Gerar resumo humano da sessão
export function generateSessionSummary(
    messages: MessageEntry[],
    currentSession: SessionState
): string {
    if (messages.length === 0) {
        return 'Primeira interação. Nenhum contexto anterior.';
    }

    const parts: string[] = [];

    // Nome se conhecido
    if (currentSession.lead_name) {
        parts.push(`Lead: ${currentSession.lead_name}`);
    }

    // Nicho/área
    if (currentSession.lead_niche) {
        parts.push(`Área: ${currentSession.lead_niche}`);
    }

    // Objetivo
    if (currentSession.lead_goal) {
        parts.push(`Busca: ${currentSession.lead_goal}`);
    }

    // Intenção principal
    parts.push(`Intenção: ${currentSession.current_intent}`);

    // Objeções se houver
    if (currentSession.objection_count > 0) {
        parts.push(`Objeções: ${currentSession.objection_count}`);
        if (currentSession.last_objection) {
            parts.push(`Última: "${currentSession.last_objection.slice(0, 50)}..."`);
        }
    }

    // Estágio
    const stage = determineStage(currentSession);
    parts.push(`Estágio: ${stage}`);

    // Número de mensagens
    parts.push(`Msgs: ${currentSession.message_count}`);

    return parts.join('. ');
}

// Determinar estágio do lead
function determineStage(session: SessionState): 'cold' | 'warm' | 'hot' {
    // Hot: mencionou agendamento ou orçamento
    if (session.current_intent === 'agendamento' || session.current_intent === 'orcamento') {
        return 'hot';
    }

    // Cold: primeira interação ou poucas mensagens
    if (session.first_interaction || session.message_count < 3) {
        return 'cold';
    }

    // Warm: conversando mas sem intenção clara de compra
    return 'warm';
}

// Verificar se precisa gerar novo resumo
export function shouldSummarize(session: SessionState): boolean {
    return session.message_count % SUMMARY_INTERVAL === 0;
}

// Extrair informações do contexto da mensagem
export function extractContextFromMessage(
    message: string,
    session: SessionState
): Partial<SessionState> {
    const updates: Partial<SessionState> = {};
    const lower = message.toLowerCase();

    // Tentar extrair nome
    const nameMatch = message.match(/(?:meu nome [eé]|me chamo|sou o|sou a)\s+(\w+)/i);
    if (nameMatch && !session.lead_name) {
        updates.lead_name = nameMatch[1];
    }

    // Tentar extrair nicho/área
    const nichePatterns = [
        { pattern: /advog|jurídic|direito/, niche: 'Advocacia' },
        { pattern: /médic|clínic|saúde|consult/, niche: 'Saúde' },
        { pattern: /imobili|corretor|imóve/, niche: 'Imobiliária' },
        { pattern: /loja|e-?commerce|varejo/, niche: 'E-commerce' },
        { pattern: /restaurante|comida|delivery/, niche: 'Alimentação' },
        { pattern: /academia|personal|fitness/, niche: 'Fitness' },
        { pattern: /escola|curso|educaç/, niche: 'Educação' },
        { pattern: /contabil|contador/, niche: 'Contabilidade' },
        { pattern: /dentist|odonto/, niche: 'Odontologia' },
    ];

    for (const { pattern, niche } of nichePatterns) {
        if (pattern.test(lower) && !session.lead_niche) {
            updates.lead_niche = niche;
            break;
        }
    }

    // Tentar extrair objetivo
    const goalPatterns = [
        { pattern: /qualificar|filtrar lead/, goal: 'Qualificar leads' },
        { pattern: /agendar|marcar|agenda/, goal: 'Automatizar agendamento' },
        { pattern: /vender|converter|fechar/, goal: 'Aumentar vendas' },
        { pattern: /atender|responder|suporte/, goal: 'Automatizar atendimento' },
        { pattern: /economizar tempo/, goal: 'Ganhar tempo' },
    ];

    for (const { pattern, goal } of goalPatterns) {
        if (pattern.test(lower) && !session.lead_goal) {
            updates.lead_goal = goal;
            break;
        }
    }

    return updates;
}

// Criar sessão inicial
export function createInitialSession(
    subscriberId: string,
    leadId?: string
): SessionState {
    return {
        session_id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        lead_id: leadId || `lead_${subscriberId}`,
        subscriber_id: subscriberId,
        session_summary: '',
        current_intent: 'outro',
        risk_level: 'baixo',
        message_count: 0,
        objection_count: 0,
        same_objection_count: 0,
        last_objection: null,
        first_interaction: true,
        last_interaction_at: null,
        days_since_last: 0,
        lead_name: null,
        lead_niche: null,
        lead_goal: null,
        last_opener_id: null,
        last_opener_date: null,
    };
}
