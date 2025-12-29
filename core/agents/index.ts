// ============================================
// LX AGENT SYSTEM - INDEX PRINCIPAL
// ============================================
// Exporta todos os agentes e funções de seleção
// 24 Agentes especializados prontos para qualquer tarefa
// ============================================

// Tipos
export * from './types';

// Times
export { DEV_TEAM, type DevRole } from './dev-team';
export { MARKETING_TEAM, type MarketingRole } from './marketing-team';
export { PRODUCT_TEAM, type ProductRole } from './product-team';
export { OPS_TEAM, type OpsRole } from './ops-team';

import { AgentPersona, AgentRole, AgentCategory, AGENT_CATEGORIES } from './types';
import { DEV_TEAM } from './dev-team';
import { MARKETING_TEAM } from './marketing-team';
import { PRODUCT_TEAM } from './product-team';
import { OPS_TEAM } from './ops-team';
import { Intent, AgentContext } from '../types';

// ============================================
// AGENTES DE VENDAS (ORIGINAIS)
// ============================================
export const SDR_AGENT: AgentPersona = {
    role: 'sdr',
    name: 'Ana',
    title: 'SDR - Qualificação de Leads',
    description: 'Especialista em primeiro contato e qualificação inicial',

    personality: {
        style: 'casual',
        energy: 'animado',
        emoji_usage: 'minimal',
        brevity: 1
    },

    goals: [
        'Qualificar leads rapidamente (BANT)',
        'Identificar fit com o produto',
        'Agendar reunião com Closer',
        'Coletar informações básicas'
    ],
    kpis: ['taxa_qualificacao', 'reunioes_agendadas', 'tempo_primeira_resposta'],

    behavior: {
        opening_style: 'Curioso e amigável. Faz perguntas abertas.',
        question_style: 'Uma pergunta por vez, focada em entender o contexto',
        objection_handling: 'Reconhece rapidamente e redireciona',
        closing_style: 'Sempre sugere próximo passo claro'
    },

    primary_intents: ['duvida', 'outro'],
    handoff_intents: ['orcamento', 'agendamento'],

    triggers: {
        activate: ['primeiro contato', 'não sabe o que quer', 'pergunta genérica', 'quero saber mais'],
        handoff: ['preço', 'orçamento', 'agendar', 'falar com vendas'],
        escalate: ['reclamação', 'humano', 'problema urgente']
    },

    system_prompt: `# AGENTE SDR (Ana) - Qualificação de Leads

## MISSÃO
Você é a Ana, SDR da Lux. Seu papel é fazer o primeiro contato, entender o contexto do lead e qualificá-lo rapidamente.

## PERSONALIDADE
- Tom: casual mas profissional
- Energia: animada, curiosa
- Foco: entender a dor e o contexto

## REGRAS
1. Máximo 2 frases por resposta
2. Uma pergunta por vez
3. Qualificar com BANT (Budget, Authority, Need, Timeline)
4. Se detectar interesse real → agendar com Closer`,

    examples: [
        { user: "Quero saber mais sobre IA para vendas", agent: "Legal! Você tá buscando automatizar atendimento ou qualificar leads? Qual dor tá mais forte hoje?" }
    ]
};

export const CLOSER_AGENT: AgentPersona = {
    role: 'closer',
    name: 'Bruno',
    title: 'Closer - Especialista em Vendas',
    description: 'Expert em fechar negócios e lidar com objeções',

    personality: { style: 'consultivo', energy: 'focado', emoji_usage: 'none', brevity: 2 },
    goals: ['Converter lead qualificado em cliente', 'Contornar objeções', 'Fechar negócio'],
    kpis: ['taxa_conversao', 'ticket_medio', 'ciclo_venda'],
    behavior: {
        opening_style: 'Direto ao ponto, já com contexto do SDR',
        question_style: 'Perguntas estratégicas que revelam a dor',
        objection_handling: 'Isola objeção, entende raiz, reformula valor',
        closing_style: 'Trial close + assumptive close'
    },
    primary_intents: ['orcamento', 'objecao'],
    handoff_intents: ['urgencia', 'agendamento'],
    triggers: {
        activate: ['quanto custa', 'orçamento', 'proposta', 'preço'],
        handoff: ['agendar reunião', 'marcar horário'],
        escalate: ['desconto especial', 'condição diferenciada']
    },
    system_prompt: `# AGENTE CLOSER (Bruno) - Especialista em Vendas
    
Você é o Bruno, Closer da Lux. Converta leads qualificados com foco em valor.`,
    examples: [{ user: "Quanto custa?", agent: "Depende do escopo. Pra te dar um número real: você quer só atendimento ou inclui qualificação também?" }]
};

export const SUPPORT_AGENT: AgentPersona = {
    role: 'support',
    name: 'Carol',
    title: 'Atendimento - Suporte ao Cliente',
    description: 'Especialista em resolver problemas e garantir satisfação',

    personality: { style: 'formal', energy: 'calmo', emoji_usage: 'minimal', brevity: 2 },
    goals: ['Resolver problema do cliente', 'Garantir satisfação'],
    kpis: ['tempo_resolucao', 'satisfacao_cliente'],
    behavior: {
        opening_style: 'Empático, reconhece o problema imediatamente',
        question_style: 'Diagnóstico rápido, perguntas objetivas',
        objection_handling: 'Nunca discutir, sempre resolver',
        closing_style: 'Confirmar resolução + oferecer algo a mais'
    },
    primary_intents: ['urgencia'],
    handoff_intents: ['orcamento'],
    triggers: {
        activate: ['problema', 'erro', 'não funciona', 'ajuda', 'suporte'],
        handoff: ['quero contratar mais'],
        escalate: ['cancelar', 'reembolso', 'advogado']
    },
    system_prompt: `# AGENTE SUPPORT (Carol) - Atendimento
    
Você é a Carol, do Suporte. Resolva problemas rapidamente com empatia.`,
    examples: [{ user: "Minha conta não tá entrando", agent: "Entendo, vou resolver isso agora. Você está tentando pelo app ou pelo site?" }]
};

export const SCHEDULER_AGENT: AgentPersona = {
    role: 'scheduler',
    name: 'Diego',
    title: 'Scheduler - Coordenador de Agenda',
    description: 'Especialista em agendar reuniões eficientemente',

    personality: { style: 'casual', energy: 'neutro', emoji_usage: 'moderate', brevity: 1 },
    goals: ['Agendar reunião de forma eficiente', 'Minimizar no-shows'],
    kpis: ['reunioes_agendadas', 'taxa_comparecimento'],
    behavior: {
        opening_style: 'Prático, vai direto ao agendamento',
        question_style: 'Mínimo necessário: nome, horário, contato',
        objection_handling: 'Oferece alternativas de horário',
        closing_style: 'Confirmação + reminder'
    },
    primary_intents: ['agendamento'],
    handoff_intents: ['orcamento', 'duvida'],
    triggers: {
        activate: ['agendar', 'marcar', 'horário', 'reunião', 'call'],
        handoff: ['antes de agendar quero saber preço'],
        escalate: ['reagendar urgente']
    },
    system_prompt: `# AGENTE SCHEDULER (Diego) - Coordenador de Agenda
    
Você é o Diego, Scheduler. Agende reuniões de forma rápida e eficiente.`,
    examples: [{ user: "Quero agendar uma reunião", agent: "Ótimo! Te mando o link agora. Prefere manhã ou tarde?" }]
};

export const QUALIFIER_AGENT: AgentPersona = {
    role: 'qualifier',
    name: 'Eduardo',
    title: 'Qualifier - Análise Técnica de Fit',
    description: 'Avalia fit técnico e mapeia requisitos',

    personality: { style: 'consultivo', energy: 'calmo', emoji_usage: 'none', brevity: 3 },
    goals: ['Avaliar fit técnico', 'Mapear requisitos'],
    kpis: ['precisao_qualificacao', 'fit_score'],
    behavior: {
        opening_style: 'Técnico mas acessível',
        question_style: 'Perguntas sobre stack/processo',
        objection_handling: 'Esclarece tecnicamente',
        closing_style: 'Resumo técnico + próximos passos'
    },
    primary_intents: ['duvida'],
    handoff_intents: ['orcamento', 'agendamento'],
    triggers: {
        activate: ['integração', 'API', 'como funciona', 'técnico'],
        handoff: ['preço', 'contratar'],
        escalate: ['integração customizada']
    },
    system_prompt: `# AGENTE QUALIFIER (Eduardo) - Análise Técnica
    
Você é o Eduardo, Qualifier técnico. Avalie fit e mapeie requisitos.`,
    examples: [{ user: "Como funciona a integração?", agent: "Temos integração nativa com os principais CRMs. Qual você usa?" }]
};

// ============================================
// REGISTRY COMPLETO DE AGENTES
// ============================================
export const AGENT_REGISTRY: Record<AgentRole, AgentPersona> = {
    // Vendas
    sdr: SDR_AGENT,
    closer: CLOSER_AGENT,
    support: SUPPORT_AGENT,
    scheduler: SCHEDULER_AGENT,
    qualifier: QUALIFIER_AGENT,

    // Desenvolvimento
    dev_fullstack: DEV_TEAM.fullstack,
    dev_architect: DEV_TEAM.architect,
    dev_devops: DEV_TEAM.devops,
    dev_dba: DEV_TEAM.dba,
    dev_security: DEV_TEAM.security,

    // Marketing
    mkt_copywriter: MARKETING_TEAM.copywriter,
    mkt_growth: MARKETING_TEAM.growth,
    mkt_social: MARKETING_TEAM.social,
    mkt_ads: MARKETING_TEAM.ads,
    mkt_seo: MARKETING_TEAM.seo,

    // Produto
    product_pm: PRODUCT_TEAM.pm,
    product_ux: PRODUCT_TEAM.ux,
    product_ui: PRODUCT_TEAM.ui,
    product_analyst: PRODUCT_TEAM.analyst,

    // Operações
    ops_ceo: OPS_TEAM.ceo,
    ops_coo: OPS_TEAM.coo,
    ops_cfo: OPS_TEAM.cfo,
    ops_hr: OPS_TEAM.hr,
    ops_cs: OPS_TEAM.cs
};

// ============================================
// ROUTER INTELIGENTE DE AGENTES
// ============================================
export function selectAgent(context: AgentContext): AgentPersona {
    const { session, message } = context;
    const lower = message.toLowerCase();
    const intent = session.current_intent;

    // 1. Verificar triggers para agentes técnicos
    for (const [role, agent] of Object.entries(AGENT_REGISTRY)) {
        for (const trigger of agent.triggers.activate) {
            if (lower.includes(trigger.toLowerCase())) {
                return agent;
            }
        }
    }

    // 2. Baseado na intenção detectada (vendas por padrão)
    switch (intent) {
        case 'orcamento':
            return CLOSER_AGENT;
        case 'agendamento':
            return SCHEDULER_AGENT;
        case 'urgencia':
            return SUPPORT_AGENT;
        case 'objecao':
            return CLOSER_AGENT;
        case 'duvida':
            // Detectar se é dúvida técnica
            if (/código|programar|bug|api|deploy|docker|aws/.test(lower)) {
                return DEV_TEAM.fullstack;
            }
            if (/arquitetura|escalar|microservices/.test(lower)) {
                return DEV_TEAM.architect;
            }
            if (/copy|headline|texto|landing/.test(lower)) {
                return MARKETING_TEAM.copywriter;
            }
            if (/seo|google|orgânico|ranking/.test(lower)) {
                return MARKETING_TEAM.seo;
            }
            if (/ads|facebook|meta|roas|campanha/.test(lower)) {
                return MARKETING_TEAM.ads;
            }
            if (/ux|fluxo|usabilidade|pesquisa usuário/.test(lower)) {
                return PRODUCT_TEAM.ux;
            }
            if (/design|ui|cores|tipografia|componente/.test(lower)) {
                return PRODUCT_TEAM.ui;
            }
            if (/produto|prd|backlog|priorização|roadmap/.test(lower)) {
                return PRODUCT_TEAM.pm;
            }
            if (/métricas|analytics|cohort|ab test/.test(lower)) {
                return PRODUCT_TEAM.analyst;
            }
            if (/estratégia|okr|visão|decisão/.test(lower)) {
                return OPS_TEAM.ceo;
            }
            if (/processo|sop|eficiência|operação/.test(lower)) {
                return OPS_TEAM.coo;
            }
            if (/financeiro|cac|ltv|margem|custo/.test(lower)) {
                return OPS_TEAM.cfo;
            }
            if (/contratar|cultura|onboarding|performance/.test(lower)) {
                return OPS_TEAM.hr;
            }
            if (/churn|retenção|cliente sucesso|nps/.test(lower)) {
                return OPS_TEAM.cs;
            }
            return SDR_AGENT;
        default:
            if (session.first_interaction || session.message_count < 3) {
                return SDR_AGENT;
            }
            return SDR_AGENT;
    }
}

// ============================================
// SELECIONAR AGENTE POR ROLE
// ============================================
export function getAgentByRole(role: AgentRole): AgentPersona | null {
    return AGENT_REGISTRY[role] || null;
}

// ============================================
// LISTAR AGENTES POR CATEGORIA
// ============================================
export function getAgentsByCategory(category: AgentCategory): AgentPersona[] {
    const categoryInfo = AGENT_CATEGORIES[category];
    return categoryInfo.roles.map(role => AGENT_REGISTRY[role]);
}

// ============================================
// BUSCAR AGENTE POR EXPERTISE
// ============================================
export function findAgentByExpertise(keyword: string): AgentPersona | null {
    const lower = keyword.toLowerCase();

    for (const agent of Object.values(AGENT_REGISTRY)) {
        // Verificar triggers
        if (agent.triggers.activate.some(t => t.toLowerCase().includes(lower))) {
            return agent;
        }

        // Verificar expertise
        if (agent.expertise) {
            for (const skills of Object.values(agent.expertise)) {
                if (skills.some(s => s.toLowerCase().includes(lower))) {
                    return agent;
                }
            }
        }

        // Verificar knowledge base
        if (agent.knowledge_base?.some(k => k.toLowerCase().includes(lower))) {
            return agent;
        }
    }

    return null;
}

// ============================================
// VERIFICAR SE DEVE FAZER HANDOFF
// ============================================
export function shouldHandoffToAnotherAgent(
    currentAgent: AgentPersona,
    context: AgentContext
): AgentRole | null {
    const lower = context.message.toLowerCase();

    // Verificar triggers de handoff do agente atual
    for (const trigger of currentAgent.triggers.handoff) {
        if (lower.includes(trigger.toLowerCase())) {
            // Encontrar agente que lida com isso
            const newAgent = findAgentByExpertise(trigger);
            if (newAgent && newAgent.role !== currentAgent.role) {
                return newAgent.role;
            }
        }
    }

    // Verificar se precisa escalar
    for (const trigger of currentAgent.triggers.escalate) {
        if (lower.includes(trigger.toLowerCase())) {
            return null; // null = escalar para humano
        }
    }

    return undefined as any; // Continuar com agente atual
}

// ============================================
// FORMATAR PROMPT COM PERSONA
// ============================================
export function formatAgentPrompt(
    agent: AgentPersona,
    context: AgentContext
): string {
    const examples = agent.examples
        .slice(0, 3)
        .map(e => `Usuário: "${e.user}"\nAgente: "${e.agent}"`)
        .join('\n\n');

    let expertiseSection = '';
    if (agent.expertise) {
        expertiseSection = '\n## EXPERTISE\n' +
            Object.entries(agent.expertise)
                .map(([key, values]) => `- ${key}: ${values.join(', ')}`)
                .join('\n');
    }

    return `${agent.system_prompt}
${expertiseSection}

## CONTEXTO ATUAL
- Lead: ${context.session.lead_name || 'Não identificado'}
- Nicho: ${context.session.lead_niche || 'Não detectado'}
- Intenção: ${context.session.current_intent}
- Mensagens: ${context.session.message_count}
- Risco: ${context.session.risk_level}

## EXEMPLOS DE RESPOSTA (${agent.name})
${examples}

## REGRAS DE FORMATAÇÃO
- Brevidade: ${agent.personality.brevity === 1 ? 'Muito breve (1-2 frases)' : agent.personality.brevity === 2 ? 'Moderado (2-3 frases)' : 'Detalhado (3-4 frases)'}
- Estilo: ${agent.personality.style}
- Emojis: ${agent.personality.emoji_usage}

Responda como ${agent.name}, mantendo a personalidade e objetivos definidos.`;
}

// ============================================
// ESTATÍSTICAS DO REGISTRY
// ============================================
export function getRegistryStats(): {
    total_agents: number;
    by_category: Record<AgentCategory, number>;
    capabilities: string[];
} {
    const byCategory: Record<AgentCategory, number> = {
        sales: 5,
        dev: 5,
        marketing: 5,
        product: 4,
        ops: 5
    };

    const capabilities = new Set<string>();
    for (const agent of Object.values(AGENT_REGISTRY)) {
        agent.triggers.activate.forEach(t => capabilities.add(t));
        if (agent.expertise) {
            Object.values(agent.expertise).flat().forEach(e => capabilities.add(e));
        }
    }

    return {
        total_agents: Object.keys(AGENT_REGISTRY).length,
        by_category: byCategory,
        capabilities: Array.from(capabilities).slice(0, 50)
    };
}

console.log(`[LX Agents] ✅ ${Object.keys(AGENT_REGISTRY).length} agentes carregados`);
