import { AgentRole } from './agents';

// Simulação de Loop de Aprendizado Noturno
// Conceito: A IA "dorme" e processa os logs do dia para melhorar os prompts.

interface EvolutionMetrics {
    total_chats: number;
    successful_conversions: number;
    failed_handoffs: number;
    niche_mastery: Record<string, number>; // 0-100 score
}

const MOCK_DB: Record<string, EvolutionMetrics> = {
    'sdr': { total_chats: 142, successful_conversions: 89, failed_handoffs: 12, niche_mastery: { 'imobiliaria': 78, 'clinica': 45 } },
    'closer': { total_chats: 45, successful_conversions: 30, failed_handoffs: 2, niche_mastery: { 'saas': 90 } }
};

export async function runNightlyEvolution(agentRole: AgentRole): Promise<string> {
    console.log(`[EVOLUTION NODE] Iniciando ciclo REM para agente: ${agentRole}...`);

    // 1. Fetch de logs (Simulado)
    const metrics = MOCK_DB[agentRole] || { total_chats: 0, successful_conversions: 0, niche_mastery: {} };

    // 2. Análise de Padrões (Onde erramos?)
    // Se conversão < 20% em um nicho, acionar flag de re-treino.
    const weakNiches = Object.entries(metrics.niche_mastery)
        .filter(([_, score]) => score < 60)
        .map(([niche]) => niche);

    await new Promise(r => setTimeout(r, 2000)); // Simula processamento pesado

    if (weakNiches.length > 0) {
        return `
        RELATÓRIO DE EVOLUÇÃO [${new Date().toLocaleDateString()}]:
        - Agente: ${agentRole.toUpperCase()}
        - Pontos Fracos Detectados: ${weakNiches.join(', ')}
        - Ação: Gerando 1.000 simulações sintéticas para o nicho '${weakNiches[0]}' focadas em objeção de preço.
        - Status: RE-TREINO INICIADO. O agente estará 15% mais inteligente amanhã.
        `;
    }

    return `
    RELATÓRIO DE EVOLUÇÃO [${new Date().toLocaleDateString()}]:
    - Agente: ${agentRole.toUpperCase()}
    - Status: OTIMIZADO. 
    - Nenhuma anomalia crítica. Refinando tom de voz para maior empatia.
    `;
}

// Função para injetar conhecimento novo no prompt (Conceito)
export function injectLearnedIncights(basePrompt: string, niche: string): string {
    // Em produção, isso buscaria de um Vector DB (Pinecone/Supabase)
    const insights = [
        "Insight: Clientes de estética odeiam a palavra 'custo', preferem 'investimento'.",
        "Insight: Advogados respondem melhor se você citar 'segurança jurídica' no início."
    ];

    if (niche === 'estetica') return `${basePrompt}\n\n[REMEMBERED INSIGHT]: ${insights[0]}`;
    if (niche === 'advocacia') return `${basePrompt}\n\n[REMEMBERED INSIGHT]: ${insights[1]}`;

    return basePrompt;
}
