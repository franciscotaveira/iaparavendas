// ============================================
// Lx Humanized Agent Engine - Action Dispatcher v1.0
// ============================================

import { ActionType, AgentResponse, SessionState, AgentContext } from './types';

// Configuração do Calendly (será substituída por empresa)
const CALENDLY_BASE_URL = process.env.CALENDLY_BASE_URL || 'https://calendly.com/lux-sales';

export function dispatch(
    responseText: string,
    action: ActionType,
    context: AgentContext
): AgentResponse {
    const { session } = context;

    switch (action) {
        case 'RESPOND':
            return respondAction(responseText, session);

        case 'SEND_CALENDLY':
            return calendlyAction(responseText, session);

        case 'REQUEST_HANDOFF':
            return handoffAction(session);

        default:
            return respondAction(responseText, session);
    }
}

function respondAction(text: string, session: SessionState): AgentResponse {
    return {
        text,
        action: 'RESPOND',
        metadata: {
            intent: session.current_intent,
            risk: session.risk_level,
            custom_fields: {
                last_intent: session.current_intent,
                risk_level: session.risk_level,
            }
        }
    };
}

function calendlyAction(text: string, session: SessionState): AgentResponse {
    // Construir URL com tracking
    const calendlyUrl = buildCalendlyUrl(session);

    // Mensagem + link
    const fullText = `${text}\n\n📅 ${calendlyUrl}`;

    return {
        text: fullText,
        action: 'SEND_CALENDLY',
        metadata: {
            intent: session.current_intent,
            risk: session.risk_level,
            calendly_url: calendlyUrl,
            tags_to_add: ['calendly_sent'],
            custom_fields: {
                last_intent: 'agendamento',
                calendly_sent: 'true',
            }
        }
    };
}

function buildCalendlyUrl(session: SessionState): string {
    const params = new URLSearchParams({
        lead_id: session.lead_id,
        session_id: session.session_id,
        source: 'agent',
    });

    if (session.lead_name) {
        params.set('name', session.lead_name);
    }

    return `${CALENDLY_BASE_URL}?${params.toString()}`;
}

function handoffAction(session: SessionState): AgentResponse {
    const handoffReasons: string[] = [];

    if (session.risk_level === 'alto') {
        handoffReasons.push('risco_alto');
    }
    if (session.same_objection_count >= 2) {
        handoffReasons.push('objecao_repetida');
    }

    const reason = handoffReasons.join(', ') || 'solicitado_pelo_lead';

    return {
        text: 'Entendi. Vou passar sua conversa pro nosso especialista. Ele vai te chamar em breve, ok?',
        action: 'REQUEST_HANDOFF',
        metadata: {
            intent: session.current_intent,
            risk: session.risk_level,
            handoff_reason: reason,
            tags_to_add: ['handoff_requested', `handoff_${reason}`],
            custom_fields: {
                handoff_reason: reason,
                handoff_at: new Date().toISOString(),
            }
        }
    };
}

// Determinar qual ação tomar baseado no contexto
export function determineAction(context: AgentContext): ActionType {
    const { session, message } = context;
    const lower = message.toLowerCase();

    // 1. Handoff obrigatório
    if (shouldHandoff(session, lower)) {
        return 'REQUEST_HANDOFF';
    }

    // 2. Usuário quer agendar
    if (wantsToSchedule(lower)) {
        return 'SEND_CALENDLY';
    }

    // 3. Resposta normal
    return 'RESPOND';
}

function shouldHandoff(session: SessionState, message: string): boolean {
    // Pediu humano explicitamente
    if (/humano|pessoa real|atendente|falar com algu[eé]m/.test(message)) {
        return true;
    }

    // Risco alto
    if (session.risk_level === 'alto') {
        return true;
    }

    // Mesma objeção 2x
    if (session.same_objection_count >= 2) {
        return true;
    }

    return false;
}

function wantsToSchedule(message: string): boolean {
    return /agendar|marcar|horário|reunião|calendly|disponibilidade|quando pode/.test(message);
}
