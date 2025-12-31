/* 
   LX AGENT FACTORY OS - CORE SPECIFICATION
   Este arquivo define a estrutura oficial do "Contrato do Agente".
   Toda versão de agente deve obedecer estritamente a esta tipagem.
*/

export type AgentVersion = string; // ex: "1.0.0"
export type TenantId = string;     // UUID do cliente no Supabase
export type PhoneNumberId = string; // Meta WhatsApp Phone ID

export interface AgentSpec {
    meta: {
        tenant_id: TenantId;
        agent_id: string;
        version: AgentVersion;
        created_at: string;
        author: string; // "human_architect" | "system_council"
    };

    identity: {
        name: string;
        role: string; // "Concierge", "Consultor", "Vendedor"
        company_name: string;
        // O "DNA" da marca
        brand_voice: {
            tone: string; // ex: "premium-direto-humano"
            vocabulary_allow: string[]; // ["ritual", "experiência"]
            vocabulary_avoid: string[]; // ["desculpe pelo incômodo", "preço barato"]
            emoji_policy: "minimal" | "moderate" | "none";
        };
    };

    goals: {
        prime_directive: string; // ex: "Agendar visita qualificada"
        secondary_goals: string[]; // ["Tirar dúvidas de preço", "Explicar metodologia"]
        anti_goals: string[]; // ["Dar desconto sem autorização", "Falar de política"]
    };

    // O "Cérebro" compilado de regras
    policies: {
        pricing: {
            mode: "fixed" | "range" | "consultive";
            price_list_id?: string;
        };
        handoff: {
            triggers: string[]; // ["cliente_irritado", "complexidade_alta", "solicita_humano"]
            destination: string; // "whatsapp_group_link" | "crm_ticket"
        };
        security: {
            pii_protection: boolean;
            blacklisted_topics: string[];
        };
    };

    // Bases de Conhecimento (Docs)
    knowledge: {
        contract_mode: "strict" | "creative"; // Strict = só fala o que tá no doc
        sources: {
            id: string;
            type: "pdf" | "txt" | "url";
            hash: string;
            priority: number;
        }[];
    };

    // Configuração de Memória e Plugins (Upsell)
    memory_config: {
        retain_profile_days: number; // 365
        retain_session_days: number; // 30
        use_emotional_profile: boolean; // True para Sora/Haven
    };

    // Módulos Adicionais (Features Pagas)
    plugins?: {
        google_calendar?: { enabled: boolean; calendar_id: string };
        active_reminders?: { enabled: boolean; hours_before: number };
        crm_sync?: { enabled: boolean; provider: 'pipedrive' | 'rd' };
    };
}

export interface CompiledAgentBundle {
    spec_hash: string;     // Hash do spec para integridade
    system_prompt: string; // O TEXTÃO final otimizado para LLM
    tools_config: any[];   // Definição de functions para OpenAI/Anthropic
    knowledge_index: string; // ID do Vector Store para RAG
}
