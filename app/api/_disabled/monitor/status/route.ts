import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Instâncias
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = createOpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined
});

export async function GET() {
    const report = {
        timestamp: new Date().toISOString(),
        status: 'ONLINE', // Optimistic initialization
        checks: {
            database: { status: 'PENDING', latency_ms: 0, message: '' },
            ai_engine: { status: 'PENDING', latency_ms: 0, message: '' },
            env_vars: { status: 'PENDING', missing: [] as string[] }
        }
    };

    const startTotal = performance.now();

    // 1. Check Environment Variables
    const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'TELEGRAM_BOT_TOKEN'];
    const missing = requiredVars.filter(v => !process.env[v]);

    if (missing.length > 0) {
        report.checks.env_vars = { status: 'FAIL', missing };
        report.status = 'DEGRADED';
    } else {
        report.checks.env_vars = { status: 'OK', missing: [] };
    }

    // 2. Check Database (Supabase)
    const dbStart = performance.now();
    try {
        const { data, error } = await supabase.from('lxc_council_logs').select('count').limit(1).single();
        if (error) throw error;
        report.checks.database = {
            status: 'OK',
            latency_ms: Math.round(performance.now() - dbStart),
            message: 'Connection established'
        };
    } catch (e) {
        report.checks.database = {
            status: 'FAIL',
            latency_ms: Math.round(performance.now() - dbStart),
            message: String(e)
        };
        report.status = 'CRITICAL';
    }

    // 3. Check AI Engine (Ping LLM)
    const aiStart = performance.now();
    try {
        // Gera apenas 1 token para ser rápido e barato
        await generateText({
            model: openai('gpt-3.5-turbo'), // Modelo mais barato para ping
            prompt: 'ping',
            maxTokens: 1
        });
        report.checks.ai_engine = {
            status: 'OK',
            latency_ms: Math.round(performance.now() - aiStart),
            message: 'LLM responding'
        };
    } catch (e) {
        report.checks.ai_engine = {
            status: 'FAIL',
            latency_ms: Math.round(performance.now() - aiStart),
            message: String(e)
        };
        report.status = 'DEGRADED'; // AI fora do ar é ruim, mas o app carrega
    }

    // Final Verdict
    const totalLatency = Math.round(performance.now() - startTotal);

    return NextResponse.json({
        ...report,
        performance: { total_check_time_ms: totalLatency }
    }, { status: report.status === 'CRITICAL' ? 503 : 200 });
}
