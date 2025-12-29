// ============================================
// LX AGENT WEBHOOK - Automação Externa
// ============================================
// Endpoint para ser chamado por n8n/Zapier/Make
// Permite que sistemas externos "contratem" os agentes
// ============================================

import { NextResponse } from 'next/server';
import { askAgent } from '@/core/council';
import { AgentRole } from '@/core/agents';

// Segurança básica (Token fixo no Header)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'lx-secret-123';

export async function POST(req: Request) {
    try {
        // Validar Auth
        const authHeader = req.headers.get('x-webhook-secret');
        if (authHeader !== WEBHOOK_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { task, agent, context } = body;

        if (!task || !agent) {
            return NextResponse.json({ error: 'Missing task or agent' }, { status: 400 });
        }

        console.log(`[Webhook] Nova tarefa para ${agent}: ${task.slice(0, 50)}...`);

        // Executar a tarefa usando o "cérebro" existente
        const response = await askAgent(agent as AgentRole, task, context);

        return NextResponse.json({
            success: true,
            agent: agent,
            result: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('[Webhook] Error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
