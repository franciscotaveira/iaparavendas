import { AgentRole, AGENT_REGISTRY } from './agents';

// ============================================
// LX AGENT DISPATCHER (Central Command)
// ============================================
// Recebe um comando em linguagem natural e roteia para o agente especializado.

export type CommandCategory = 'marketing' | 'sales' | 'ops' | 'dev' | 'general';

interface DispatchResult {
    category: CommandCategory;
    agent: AgentRole;
    action: string;
    payload: Record<string, any>;
}

// Classificador de Intenção de Comando (Simples - v1)
// Em produção, isso seria feito por LLM.
export function classifyCommand(rawCommand: string): DispatchResult {
    const cmd = rawCommand.toLowerCase();

    // MARKETING
    if (cmd.includes('instagram') || cmd.includes('post') || cmd.includes('conteúdo') || cmd.includes('conteudo')) {
        return {
            category: 'marketing',
            agent: 'copywriter', // De agents.ts
            action: 'GENERATE_POST_IDEA',
            payload: { platform: 'instagram', request: rawCommand }
        };
    }

    // SALES
    if (cmd.includes('lead') || cmd.includes('formulário') || cmd.includes('briefing') || cmd.includes('orçamento') || cmd.includes('orcamento')) {
        return {
            category: 'sales',
            agent: 'sdr',
            action: 'SEND_BRIEFING_FORM',
            payload: { request: rawCommand }
        };
    }

    // OPS - Contrato
    if (cmd.includes('contrato') || cmd.includes('assinatura') || cmd.includes('cliente novo')) {
        return {
            category: 'ops',
            agent: 'onboarding_specialist',
            action: 'INITIATE_ONBOARDING',
            payload: { request: rawCommand }
        };
    }

    // OPS - Cobrança
    if (cmd.includes('boleto') || cmd.includes('pix') || cmd.includes('cobrança') || cmd.includes('pagamento')) {
        return {
            category: 'ops',
            agent: 'onboarding_specialist',
            action: 'GENERATE_INVOICE',
            payload: { request: rawCommand }
        };
    }

    // DEV
    if (cmd.includes('bug') || cmd.includes('erro') || cmd.includes('ajuste') || cmd.includes('corrigir') || cmd.includes('deploy')) {
        return {
            category: 'dev',
            agent: 'tech_lead',
            action: 'FIX_ISSUE',
            payload: { request: rawCommand }
        };
    }

    // FALLBACK
    return {
        category: 'general',
        agent: 'sdr', // Default
        action: 'CLARIFY',
        payload: { request: rawCommand }
    };
}

// Executa a ação do agente (Placeholder para v2)
export async function executeAgentAction(dispatch: DispatchResult): Promise<string> {
    const agentName = AGENT_REGISTRY[dispatch.agent]?.name || dispatch.agent;

    switch (dispatch.action) {
        case 'GENERATE_POST_IDEA':
            return `[${agentName}] 🎨 Entendido! Vou criar 3 opções de post para Instagram sobre o tema. Me dá 2 minutos... (LLM Call pendente)`;

        case 'SEND_BRIEFING_FORM':
            return `[${agentName}] 📋 Certo! Vou enviar o formulário de briefing para o lead. Qual o número de WhatsApp dele?`;

        case 'INITIATE_ONBOARDING':
            return `[${agentName}] 📝 Novo cliente! Para gerar o contrato, preciso:\n1. Nome completo ou Razão Social\n2. CPF ou CNPJ\n3. Email\n4. Valor do contrato\n\nMe passa esses dados.`;

        case 'GENERATE_INVOICE':
            return `[${agentName}] 💰 Para gerar a cobrança via Asaas, preciso:\n1. Valor\n2. Descrição\n3. Email do cliente\n\nQuando tiver, me manda.`;

        case 'FIX_ISSUE':
            return `[${agentName}] 🔧 Registrado. Vou analisar o problema e aplicar a correção. Te aviso quando estiver pronto.`;

        case 'CLARIFY':
        default:
            return `Não entendi 100%. Você quer que eu encaminhe para qual equipe?\n- Marketing (posts, conteúdo)\n- Vendas (leads, orçamentos)\n- Operações (contratos, cobranças)\n- Dev (bugs, ajustes)`;
    }
}
