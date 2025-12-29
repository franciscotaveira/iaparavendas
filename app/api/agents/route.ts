// ============================================
// API: Agent Endpoints
// GET /api/agents - Lista todos os agentes
// GET /api/agents/[role] - Detalhes de um agente
// POST /api/agents/ask - Perguntar a um agente específico
// ============================================

import { NextResponse } from 'next/server';
import {
    AGENT_REGISTRY,
    getRegistryStats,
    AgentRole,
    AGENT_CATEGORIES,
    AgentCategory
} from '@/core/agents';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category') as AgentCategory | null;
        const role = searchParams.get('role') as AgentRole | null;

        // Se pediu um agente específico
        if (role) {
            const agent = AGENT_REGISTRY[role];
            if (!agent) {
                return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
            }
            return NextResponse.json({
                success: true,
                agent: {
                    role: agent.role,
                    name: agent.name,
                    title: agent.title,
                    description: agent.description,
                    personality: agent.personality,
                    goals: agent.goals,
                    kpis: agent.kpis,
                    triggers: agent.triggers,
                    expertise: agent.expertise,
                    examples: agent.examples.slice(0, 3)
                }
            });
        }

        // Listar todos os agentes (resumido)
        const agents = Object.entries(AGENT_REGISTRY).map(([role, agent]) => ({
            role,
            name: agent.name,
            title: agent.title,
            description: agent.description,
            category: getCategoryForRole(role as AgentRole),
            triggers: agent.triggers.activate.slice(0, 3)
        }));

        // Filtrar por categoria se especificado
        const filteredAgents = category
            ? agents.filter(a => a.category === category)
            : agents;

        // Agrupar por categoria
        const grouped: Record<string, typeof agents> = {};
        for (const agent of filteredAgents) {
            const cat = agent.category;
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(agent);
        }

        return NextResponse.json({
            success: true,
            stats: getRegistryStats(),
            categories: AGENT_CATEGORIES,
            agents: grouped
        });

    } catch (error) {
        console.error('Error listing agents:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

function getCategoryForRole(role: AgentRole): AgentCategory {
    if (role.startsWith('dev_')) return 'dev';
    if (role.startsWith('mkt_')) return 'marketing';
    if (role.startsWith('product_')) return 'product';
    if (role.startsWith('ops_')) return 'ops';
    return 'sales';
}
