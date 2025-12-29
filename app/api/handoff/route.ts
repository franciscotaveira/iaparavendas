// ============================================
// LX HANDOFF API v1.0
// ============================================
// Endpoint para disparar handoff para WhatsApp/Calendly

import { NextRequest, NextResponse } from 'next/server';
import { executeHandoff, buildCalendlyUrl } from '@/lib/handoff';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            lead_id,
            lead_name,
            lead_phone,
            lead_company,
            segment,
            session_id,
            returning_user,
            entry_point,
            messages_count,
            opening_line,
            intent,
            risk_mode,
            summary,
            cta,
            report_url,
            score_fit,
        } = body;

        // Validação mínima
        if (!session_id) {
            return NextResponse.json(
                { success: false, error: 'session_id é obrigatório' },
                { status: 400 }
            );
        }

        // Executar handoff
        const result = await executeHandoff({
            leadId: lead_id || `lead_${Date.now()}`,
            leadName: lead_name || 'Visitante',
            leadPhone: lead_phone || '',
            leadCompany: lead_company,
            segment: segment || 'servicos',
            sessionId: session_id,
            returningUser: returning_user || false,
            entryPoint: entry_point || 'landing',
            messagesCount: messages_count || 0,
            openingLine: opening_line || '',
            intent: intent || 'outros',
            riskMode: risk_mode || false,
            summary: summary || '',
            cta: cta || 'calendly',
            reportUrl: report_url,
            scoreFit: score_fit || 0,
        });

        // Log para analytics
        console.log('[Handoff API]', {
            session_id,
            segment,
            cta,
            result: result.success ? 'success' : 'failed',
            channel: result.channel,
        });

        // Enviar para N8n (fire-and-forget)
        if (process.env.N8N_WEBHOOK_URL) {
            fetch(process.env.N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'handoff_executed',
                    timestamp: new Date().toISOString(),
                    session_id,
                    segment,
                    cta,
                    channel: result.channel,
                    success: result.success,
                    score_fit,
                    source: 'lx-demo-interface',
                }),
            }).catch(() => { });
        }

        return NextResponse.json({
            success: result.success,
            channel: result.channel,
            url: result.url,
            message: result.message,
        });

    } catch (error) {
        console.error('[Handoff API Error]', error);
        return NextResponse.json(
            { success: false, error: 'Erro interno no handoff' },
            { status: 500 }
        );
    }
}

// GET: Gerar URL do Calendly
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id') || `session_${Date.now()}`;
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';

    const calendlyUrl = buildCalendlyUrl({
        sessionId,
        leadName: name,
        leadEmail: email,
        source: 'lx_demo',
    });

    return NextResponse.json({
        url: calendlyUrl,
    });
}
