import { NextResponse } from 'next/server';

export async function GET() {
    // Mock Monitor Data matching Dashboard expectations
    const data = {
        status: 'ONLINE',
        agents: {
            total: 12,
            by_category: {
                sales: 5,
                support: 3,
                dev: 4
            }
        },
        local_llm: {
            cost_savings: 125.50,
            model: 'llama-3-8b-instruct'
        },
        orchestration: {
            active_sessions: 8
        },
        checks: {
            database: { latency_ms: 45 },
            ai_engine: { latency_ms: 120 }
        }
    };

    return NextResponse.json(data);
}
