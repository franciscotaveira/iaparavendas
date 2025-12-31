import { NextRequest, NextResponse } from 'next/server';

// Telegram Bot API helper
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // ID do grupo ou chat do sócio

interface TelegramMessage {
    type: 'new_lead' | 'onboarding_complete' | 'urgent' | 'system';
    title: string;
    message: string;
    data?: Record<string, any>;
}

async function sendTelegramMessage(msg: TelegramMessage): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('Telegram não configurado. Defina TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID');
        return false;
    }

    const emoji = {
        'new_lead': '🎯',
        'onboarding_complete': '✅',
        'urgent': '🚨',
        'system': '⚙️'
    }[msg.type] || '📢';

    const text = `${emoji} *${msg.title}*\n\n${msg.message}${msg.data ? '\n\n```json\n' + JSON.stringify(msg.data, null, 2) + '\n```' : ''
        }`;

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                })
            }
        );

        const result = await response.json();
        return result.ok;
    } catch (error) {
        console.error('Erro ao enviar para Telegram:', error);
        return false;
    }
}

// API Route para enviar notificações
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { type, title, message, data } = body;

        if (!type || !title || !message) {
            return NextResponse.json(
                { error: 'type, title e message são obrigatórios' },
                { status: 400 }
            );
        }

        const success = await sendTelegramMessage({ type, title, message, data });

        return NextResponse.json({
            success,
            message: success ? 'Notificação enviada' : 'Falha ao enviar (verifique configuração)'
        });

    } catch (error) {
        console.error('Erro na API de notificações:', error);
        return NextResponse.json(
            { error: 'Erro interno' },
            { status: 500 }
        );
    }
}

// GET para verificar status
export async function GET() {
    const configured = !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

    return NextResponse.json({
        service: 'telegram-notifications',
        configured,
        bot_token_set: !!TELEGRAM_BOT_TOKEN,
        chat_id_set: !!TELEGRAM_CHAT_ID
    });
}
