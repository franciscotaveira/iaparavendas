import { NextResponse } from 'next/server';

export async function GET() {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        return NextResponse.json({
            status: 'error',
            message: 'N8N_WEBHOOK_URL não configurada no .env.local',
            connected: false
        }, { status: 500 });
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'health_check',
                timestamp: new Date().toISOString(),
                source: 'lx-demo-interface'
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json().catch(() => ({}));
            return NextResponse.json({
                status: 'success',
                message: 'Conexão com N8n estabelecida!',
                connected: true,
                webhookUrl: webhookUrl.replace(/\/webhook.*/, '/webhook/***'), // Mask for security
                responseData: data
            });
        } else {
            return NextResponse.json({
                status: 'error',
                message: `N8n respondeu com status ${response.status}`,
                connected: false
            }, { status: 502 });
        }

    } catch (error: any) {
        const isTimeout = error.name === 'AbortError';
        return NextResponse.json({
            status: 'error',
            message: isTimeout
                ? 'Timeout: N8n não respondeu em 5 segundos. Verifique se está em "Listen for test event".'
                : `Falha na conexão: ${error.message}`,
            connected: false,
            hint: 'Certifique-se de que o n8n está rodando e o webhook está ativo.'
        }, { status: 503 });
    }
}
