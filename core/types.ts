// ============================================
// Lx Humanized Agent Engine - Types v1.0
// ============================================

// Intenções possíveis (UMA por mensagem)
export type Intent =
    | 'duvida'
    | 'orcamento'
    | 'agendamento'
    | 'objecao'
    | 'urgencia'
    | 'outro';

// Níveis de risco
export type RiskLevel = 'baixo' | 'medio' | 'alto';

// Ações possíveis do dispatcher
export type ActionType = 'RESPOND' | 'SEND_CALENDLY' | 'REQUEST_HANDOFF';

// Estado da sessão
export interface SessionState {
    session_id: string;
    lead_id: string;
    subscriber_id: string;

    // Histórico resumido
    session_summary: string;

    // Classificação atual
    current_intent: Intent;
    risk_level: RiskLevel;

    // Contadores
    message_count: number;
    objection_count: number;
    same_objection_count: number;
    last_objection: string | null;

    // Metadados
    first_interaction: boolean;
    last_interaction_at: string | null;
    days_since_last: number;

    // Contexto extraído
    lead_name: string | null;
    lead_niche: string | null;
    lead_goal: string | null;

    // Último opener usado
    last_opener_id: string | null;
    last_opener_date: string | null;
}

// Contexto completo para processamento
export interface AgentContext {
    session: SessionState;
    message: string;
    channel: 'whatsapp' | 'site';
    source: string;
    timestamp: string;
}

// Resultado da classificação
export interface ClassificationResult {
    intent: Intent;
    risk: RiskLevel;
    confidence: number;
    reasoning: string;
}

// Resposta do agente
export interface AgentResponse {
    text: string;
    action: ActionType;
    metadata: {
        intent: Intent;
        risk: RiskLevel;
        calendly_url?: string;
        handoff_reason?: string;
        tags_to_add?: string[];
        custom_fields?: Record<string, string>;
    };
}

// Payload ManyChat (Inbound)
export interface ManyChatInbound {
    subscriber_id: string;
    text: string;
    custom_fields: {
        session_id?: string;
        lead_id?: string;
        last_intent?: Intent;
        risk_level?: RiskLevel;
    };
}

// Payload ManyChat (Outbound)
export interface ManyChatOutbound {
    text: string;
    actions: {
        type: 'add_tag' | 'set_custom_field';
        value: string;
        field_name?: string;
    }[];
}

// Opener da biblioteca
export interface Opener {
    id: string;
    text: string;
    context: {
        first_interaction?: boolean;
        returning_recent?: boolean;  // < 7 dias
        returning_long?: boolean;    // > 14 dias
        channel?: 'whatsapp' | 'site' | 'any';
        stage?: 'cold' | 'warm' | 'hot';
    };
    weight: number; // 1-10, para seleção ponderada
}
