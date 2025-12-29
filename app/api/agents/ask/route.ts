// ============================================
// API: Ask Agent
// POST /api/agents/ask
// Perguntar a um agente específico ou ao council
// ============================================

import { NextResponse } from 'next/server';
import {
    AGENT_REGISTRY,
    AgentRole,
    formatAgentPrompt
} from '@/core/agents';
import { askCouncil, askAgent, brainstorm } from '@/core/council';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const maxDuration = 60;

interface AskRequest {
    question: string;
    mode: 'single' | 'council' | 'brainstorm';
    agent?: AgentRole;
    context?: string;
    agents?: AgentRole[];
}

export async function POST(req: Request) {
    try {
        const body: AskRequest = await req.json();

        if (!body.question) {
            return NextResponse.json({ error: 'Question is required' }, { status: 400 });
        }

        // Modo: Perguntar a um agente específico
        if (body.mode === 'single') {
            if (!body.agent) {
                return NextResponse.json({ error: 'Agent role is required for single mode' }, { status: 400 });
            }

            const agent = AGENT_REGISTRY[body.agent];
            if (!agent) {
                return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
            }

            const startTime = Date.now();

            const provider = createOpenAI({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY || '',
            });

            const prompt = `${agent.system_prompt}

${body.context ? `## CONTEXTO\n${body.context}\n` : ''}

## PERGUNTA
${body.question}

Responda de forma clara e acionável, seguindo sua personalidade e expertise.`;

            const result = await generateText({
                model: provider('anthropic/claude-3.5-sonnet') as any,
                prompt,
                temperature: 0.4,
                maxTokens: 500,
            });

            return NextResponse.json({
                success: true,
                mode: 'single',
                agent: {
                    role: agent.role,
                    name: agent.name,
                    title: agent.title
                },
                response: result.text,
                latency_ms: Date.now() - startTime
            });
        }

        // Modo: Consultar o Council (múltiplos agentes)
        if (body.mode === 'council') {
            const result = await askCouncil(body.question, {
                context: body.context,
                required_perspectives: body.agents,
                include_synthesis: true
            });

            return NextResponse.json({
                success: true,
                mode: 'council',
                ...result
            });
        }

        // Modo: Brainstorm
        if (body.mode === 'brainstorm') {
            const ideas = await brainstorm(body.question);

            return NextResponse.json({
                success: true,
                mode: 'brainstorm',
                topic: body.question,
                ideas
            });
        }

        return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });

    } catch (error) {
        console.error('Error asking agent:', error);
        return NextResponse.json({
            error: 'Internal error',
            details: String(error)
        }, { status: 500 });
    }
}
