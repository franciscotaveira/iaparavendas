// ============================================
// API: Health Check
// GET /api/health
// Status do sistema de agentes e LLM
// ============================================

import { NextResponse } from 'next/server';
import { getLocalLLMHealth } from '@/core/local-llm';
import { getRegistryStats } from '@/core/agents';
import { getOrchestrationHealth, getOrchestrationStats } from '@/core/orchestrator';

export async function GET() {
    try {
        const [localLLM, orchestration] = await Promise.all([
            getLocalLLMHealth(),
            getOrchestrationHealth()
        ]);

        const agentStats = getRegistryStats();
        const orchestrationStats = getOrchestrationStats();

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',

            // Sistema de agentes
            agents: {
                total: agentStats.total_agents,
                by_category: agentStats.by_category,
                capabilities_sample: agentStats.capabilities.slice(0, 10)
            },

            // LLM Local (Ollama)
            local_llm: {
                available: localLLM.available,
                model: localLLM.model,
                cache_size: localLLM.cache_size,
                cost_savings: localLLM.cost_stats
            },

            // Orquestração
            orchestration: {
                healthy: orchestration.healthy,
                active_sessions: orchestrationStats.sessions,
                agent_usage: orchestrationStats.agent_usage,
                config: orchestration.config
            },

            // Environment
            environment: {
                has_openrouter_key: !!process.env.OPENROUTER_API_KEY,
                has_supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                ollama_url: process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
            }
        });

    } catch (error) {
        console.error('Health check error:', error);
        return NextResponse.json({
            status: 'degraded',
            error: String(error),
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
