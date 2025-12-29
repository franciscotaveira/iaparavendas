// ============================================
// LX REPORT API v1.0
// ============================================
// Endpoint para gerar e visualizar relatórios

import { NextRequest, NextResponse } from 'next/server';
import { generateReport, reportToHTML, type ReportData } from '@/lib/report-generator';
import { calculateScoreFit } from '@/lib/humanization-engine';
import { detectNicheFromText } from '@/lib/niche-packs';

// In-memory store (em produção, usar Supabase)
const reportStore: Map<string, ReportData> = new Map();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            session_id,
            messages,
            lead_name,
            lead_company,
            lead_phone,
        } = body;

        if (!session_id) {
            return NextResponse.json(
                { success: false, error: 'session_id é obrigatório' },
                { status: 400 }
            );
        }

        // Extrair contexto das mensagens
        const userMessages = (messages || [])
            .filter((m: { role: string }) => m.role === 'user')
            .map((m: { content: string }) => m.content);

        const allText = userMessages.join(' ').toLowerCase();

        // Detectar informações do lead
        const niche = detectNicheFromText(allText);

        // Detectar objetivo
        let goal = 'Não detectado';
        if (/qualific|filtrar lead/.test(allText)) goal = 'Qualificar leads';
        else if (/agend|marcar|horár/.test(allText)) goal = 'Agendar consultas';
        else if (/vend|convert|fechar/.test(allText)) goal = 'Aumentar vendas';
        else if (/atend|respond|suporte/.test(allText)) goal = 'Automatizar atendimento';

        // Detectar canal
        let channel = 'Não detectado';
        if (/whats|zap|wpp/.test(allText)) channel = 'WhatsApp';
        else if (/insta/.test(allText)) channel = 'Instagram';
        else if (/site|chat|web/.test(allText)) channel = 'Site';

        // Detectar volume
        let volume = 'Não detectado';
        const volumeMatch = allText.match(/(\d+)\s*(mensagens?|contatos?|leads?|clientes?)/);
        if (volumeMatch) {
            volume = `${volumeMatch[1]} ${volumeMatch[2]}/dia`;
        }

        // Detectar dor
        let pain = 'Não detectado';
        if (/tempo|demora|lento/.test(allText)) pain = 'Falta de tempo para atender todos';
        else if (/perd|escap|fug/.test(allText)) pain = 'Perda de leads por demora';
        else if (/qualidade|filtrar|curioso/.test(allText)) pain = 'Leads desqualificados';
        else if (/agenda|horário|vazio/.test(allText)) pain = 'Agenda vazia ou mal aproveitada';

        // Detectar objeções
        const objections: string[] = [];
        if (/caro|preço|valor/.test(allText)) objections.push('Preço');
        if (/tempo|depois|agora não/.test(allText)) objections.push('Timing');
        if (/pensar|avaliar|ver/.test(allText)) objections.push('Decisão');

        // Detectar urgência
        const hasUrgency = /urgente|agora|hoje|imediato/.test(allText);

        // Calcular score
        const scoreFit = calculateScoreFit({
            niche,
            goal: goal !== 'Não detectado' ? goal : undefined,
            channel: channel !== 'Não detectado' ? channel : undefined,
            pain: pain !== 'Não detectado' ? pain : undefined,
            volume: volume !== 'Não detectado' ? volume : undefined,
            objections_count: objections.length,
        });

        // Gerar relatório
        const report = generateReport({
            sessionId: session_id,
            lead: {
                name: lead_name,
                company: lead_company,
                niche,
                goal,
                channel,
                pain,
                volume,
                objections,
            },
            scoreFit,
            messagesCount: messages?.length || 0,
            hasUrgency,
        });

        // Armazenar
        reportStore.set(report.id, report);

        // Log para N8n
        if (process.env.N8N_WEBHOOK_URL) {
            fetch(process.env.N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'report_generated',
                    timestamp: new Date().toISOString(),
                    report_id: report.id,
                    session_id,
                    score_fit: scoreFit,
                    qualification_level: report.analysis.qualification_level,
                    recommended_package: report.recommendations.package,
                    source: 'lx-demo-interface',
                }),
            }).catch(() => { });
        }

        return NextResponse.json({
            success: true,
            report,
            report_url: `/api/report?id=${report.id}`,
        });

    } catch (error) {
        console.error('[Report API Error]', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao gerar relatório' },
            { status: 500 }
        );
    }
}

// GET: Visualizar relatório
export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    const format = req.nextUrl.searchParams.get('format') || 'json';

    if (!id) {
        // Listar todos os relatórios
        const reports = Array.from(reportStore.values())
            .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())
            .slice(0, 20);

        return NextResponse.json({
            total: reportStore.size,
            reports: reports.map(r => ({
                id: r.id,
                niche: r.lead.niche,
                score_fit: r.analysis.score_fit,
                qualification: r.analysis.qualification_level,
                generated_at: r.generated_at,
            })),
        });
    }

    const report = reportStore.get(id);

    if (!report) {
        return NextResponse.json(
            { success: false, error: 'Relatório não encontrado' },
            { status: 404 }
        );
    }

    // Retornar HTML se solicitado
    if (format === 'html') {
        const html = reportToHTML(report);
        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        });
    }

    return NextResponse.json({ success: true, report });
}
