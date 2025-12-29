// ============================================
// LX AGENT TYPES - Definições unificadas
// ============================================

import { Intent, RiskLevel } from '../types';

// ============================================
// TIPOS DE AGENTES (Extensão)
// ============================================
export type AgentRole =
    // Vendas (original)
    | 'sdr'
    | 'closer'
    | 'support'
    | 'scheduler'
    | 'qualifier'
    // Desenvolvimento
    | 'dev_fullstack'
    | 'dev_architect'
    | 'dev_devops'
    | 'dev_dba'
    | 'dev_security'
    // Marketing
    | 'mkt_copywriter'
    | 'mkt_growth'
    | 'mkt_social'
    | 'mkt_ads'
    | 'mkt_seo'
    // Produto
    | 'product_pm'
    | 'product_ux'
    | 'product_ui'
    | 'product_analyst'
    // Operações
    | 'ops_ceo'
    | 'ops_coo'
    | 'ops_cfo'
    | 'ops_hr'
    | 'ops_cs';

// ============================================
// PERSONA COMPLETA
// ============================================
export interface AgentPersona {
    role: AgentRole;
    name: string;
    title: string;
    description: string;

    // Personalidade
    personality: {
        style: 'formal' | 'casual' | 'consultivo' | 'urgente';
        energy: 'calmo' | 'animado' | 'neutro' | 'focado';
        emoji_usage: 'none' | 'minimal' | 'moderate';
        brevity: 1 | 2 | 3; // 1=muito breve, 3=mais detalhado
    };

    // Objetivos
    goals: string[];
    kpis: string[];

    // Comportamento
    behavior: {
        opening_style: string;
        question_style: string;
        objection_handling: string;
        closing_style: string;
    };

    // Intents que este agente domina
    primary_intents: Intent[];
    handoff_intents: Intent[]; // Passar para outro agente

    // Gatilhos
    triggers: {
        activate: string[];   // Quando assumir a conversa
        handoff: string[];    // Quando passar para outro
        escalate: string[];   // Quando escalar (humano)
    };

    // Expertise específica (opcional, para agentes técnicos)
    expertise?: Record<string, string[]>;

    // Prompts específicos
    system_prompt: string;
    examples: {
        user: string;
        agent: string;
    }[];

    // Base de conhecimento (opcional)
    knowledge_base?: string[];
}

// ============================================
// CATEGORIAS DE AGENTES
// ============================================
export type AgentCategory = 'sales' | 'dev' | 'marketing' | 'product' | 'ops';

export interface AgentCategoryInfo {
    name: string;
    description: string;
    roles: AgentRole[];
    icon: string;
}

export const AGENT_CATEGORIES: Record<AgentCategory, AgentCategoryInfo> = {
    sales: {
        name: 'Vendas & Atendimento',
        description: 'Agentes focados em vendas, qualificação e suporte ao cliente',
        roles: ['sdr', 'closer', 'support', 'scheduler', 'qualifier'],
        icon: '💼'
    },
    dev: {
        name: 'Desenvolvimento',
        description: 'Agentes técnicos de programação, arquitetura e infraestrutura',
        roles: ['dev_fullstack', 'dev_architect', 'dev_devops', 'dev_dba', 'dev_security'],
        icon: '💻'
    },
    marketing: {
        name: 'Marketing & Growth',
        description: 'Agentes de marketing, conteúdo e crescimento',
        roles: ['mkt_copywriter', 'mkt_growth', 'mkt_social', 'mkt_ads', 'mkt_seo'],
        icon: '📈'
    },
    product: {
        name: 'Produto & Design',
        description: 'Agentes de produto, UX/UI e análise de dados',
        roles: ['product_pm', 'product_ux', 'product_ui', 'product_analyst'],
        icon: '🎨'
    },
    ops: {
        name: 'Operações & Gestão',
        description: 'Agentes de gestão, finanças e operações',
        roles: ['ops_ceo', 'ops_coo', 'ops_cfo', 'ops_hr', 'ops_cs'],
        icon: '⚙️'
    }
};

// ============================================
// CONTEXTO DE CONVERSA COM AGENTE
// ============================================
export interface AgentConversationContext {
    agent: AgentPersona;
    session_id: string;
    messages: {
        role: 'user' | 'agent';
        content: string;
        timestamp: string;
    }[];
    facts_extracted: Record<string, string>;
    handoff_history: {
        from: AgentRole;
        to: AgentRole;
        reason: string;
        timestamp: string;
    }[];
}

// ============================================
// RESULTADO DE PROCESSAMENTO
// ============================================
export interface AgentProcessingResult {
    response: string;
    agent: {
        role: AgentRole;
        name: string;
    };
    metadata: {
        source: 'online' | 'local' | 'fallback';
        latency_ms: number;
        tokens_used?: number;
        cost_usd?: number;
    };
    actions?: {
        type: 'handoff' | 'escalate' | 'send_resource' | 'tag';
        value: string;
    }[];
    suggested_followups?: string[];
}
