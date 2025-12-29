// ============================================
// LX EVENTS TRACKING API v1.0
// ============================================
// Endpoint para rastrear eventos de conversão e métricas

import { NextRequest, NextResponse } from 'next/server';

interface TrackingEvent {
    event: string;
    session_id: string;
    timestamp: string;
    properties?: Record<string, unknown>;
}

// In-memory store para sessão (em produção, usar Redis ou Supabase)
const eventStore: Map<string, TrackingEvent[]> = new Map();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const event: TrackingEvent = {
            event: body.event,
            session_id: body.session_id || 'unknown',
            timestamp: body.timestamp || new Date().toISOString(),
            properties: {
                segment: body.segment,
                intent: body.intent,
                risk_level: body.risk_level,
                score_fit: body.score_fit,
                messages_count: body.messages_count,
                ...body.properties,
            },
        };

        // Store event
        const sessionEvents = eventStore.get(event.session_id) || [];
        sessionEvents.push(event);
        eventStore.set(event.session_id, sessionEvents);

        // Log for debugging
        console.log(`[Event] ${event.event}`, {
            session: event.session_id.slice(-8),
            ...event.properties,
        });

        // Forward to N8n if configured
        if (process.env.N8N_WEBHOOK_URL) {
            fetch(process.env.N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...event,
                    source: 'lx-events-api',
                }),
            }).catch(() => { });
        }

        return NextResponse.json({ success: true, event_id: `${event.session_id}_${Date.now()}` });

    } catch (error) {
        console.error('[Events API Error]', error);
        return NextResponse.json({ success: false, error: 'Failed to track event' }, { status: 500 });
    }
}

// GET: Obter eventos de uma sessão (para debug/admin)
export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
        // Return summary of all sessions
        const summary = Array.from(eventStore.entries()).map(([id, events]) => ({
            session_id: id,
            event_count: events.length,
            last_event: events[events.length - 1]?.event,
            last_timestamp: events[events.length - 1]?.timestamp,
        }));

        return NextResponse.json({
            total_sessions: summary.length,
            sessions: summary.slice(-20), // últimas 20
        });
    }

    const events = eventStore.get(sessionId) || [];
    return NextResponse.json({
        session_id: sessionId,
        event_count: events.length,
        events,
    });
}
