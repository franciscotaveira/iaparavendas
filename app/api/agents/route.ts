import { NextResponse } from 'next/server';
import { AGENT_REGISTRY } from '@/core/agents';

export async function GET() {
    // Transforma o AGENT_REGISTRY (objeto) em array para o Frontend consumir
    // Como CEO, quero ver meus "funcionários" digitais listados

    const agentsList = Object.values(AGENT_REGISTRY).map(agent => ({
        role: agent.role,
        name: agent.name,
        title: agent.title,
        description: agent.description,
        personality: agent.personality.style,
        category: getCategory(agent.role)
    }));

    // Agrupar por função para o gráfico
    const agents = {
        sales: agentsList.filter(a => a.category === 'sales'),
        dev: agentsList.filter(a => a.category === 'dev'),
        marketing: agentsList.filter(a => a.category === 'marketing'),
        product: agentsList.filter(a => a.category === 'product'),
        ops: agentsList.filter(a => a.category === 'ops')
    };

    return NextResponse.json({
        success: true,
        count: agentsList.length,
        agents
    });
}

function getCategory(role: string): string {
    if (role.startsWith('sdr') || role.startsWith('closer') || role.startsWith('support') || role.startsWith('scheduler') || role.startsWith('qualifier')) return 'sales';
    if (role.startsWith('dev_')) return 'dev';
    if (role.startsWith('mkt_')) return 'marketing';
    if (role.startsWith('product_')) return 'product';
    if (role.startsWith('ops_')) return 'ops';
    return 'other';
}
