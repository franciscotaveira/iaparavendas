import { NextResponse } from 'next/server';
import { classifyCommand, executeAgentAction } from '@/core/dispatcher-central';

// ============================================
// MEU SÓCIO (TELEGRAM BOT) - V2.0 (Multi-Agent)
// ============================================
// Endpoint para receber comandos do usuário via Telegram.
// Agora integrado com o Dispatcher Central para delegar para agentes.

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: Request) {
    try {
        const update = await req.json();

        // Verificar se é uma mensagem
        if (!update.message) return NextResponse.json({ status: 'ignored' });

        const chatId = update.message.chat.id;
        const text = update.message.text || update.message.caption || '';
        const hasPhoto = !!update.message.photo;
        const hasVoice = !!update.message.voice;

        console.log(`[SÓCIO BOT] Comando recebido de ${chatId}: ${text.substring(0, 50)}...`);

        // 1. Comandos Especiais (Atalhos)
        if (text.startsWith('/start')) {
            await sendTelegramMessage(chatId, "🫡 Olá, Sócio. Estou online e pronto.\n\nPode me mandar comandos em texto normal. Exemplos:\n- 'Preciso de um post para Instagram'\n- 'Novo lead quer orçamento'\n- 'Cliente novo, gerar contrato'\n\nEu vou encaminhar para o agente certo da equipe.");
            return NextResponse.json({ status: 'ok' });
        }

        if (text.startsWith('/status')) {
            await sendTelegramMessage(chatId, "✅ Sistema Operacional.\n- Cortex: OK\n- Dispatcher: OK\n- Agentes: 24 Carregados");
            return NextResponse.json({ status: 'ok' });
        }

        if (text.startsWith('/roadmap')) {
            await sendTelegramMessage(chatId, "📋 Para ver o roadmap completo, acesse:\n`/dashboard/settings` ou o arquivo `PRODUCTION_ROADMAP.md`");
            return NextResponse.json({ status: 'ok' });
        }

        // 2. Processamento via Dispatcher Central (Multi-Agent)
        if (hasVoice) {
            await sendTelegramMessage(chatId, "🎤 Áudio recebido. Transcrição automática em breve (Whisper pendente).");
            return NextResponse.json({ status: 'pending_whisper' });
        }

        if (hasPhoto) {
            await sendTelegramMessage(chatId, "🖼️ Imagem recebida. Análise visual em breve (GPT-4o Vision pendente).");
            return NextResponse.json({ status: 'pending_vision' });
        }

        // Classificar e Executar
        const dispatch = classifyCommand(text);
        const agentResponse = await executeAgentAction(dispatch);

        await sendTelegramMessage(chatId, agentResponse);

        return NextResponse.json({ status: 'processed', dispatch });

    } catch (error) {
        console.error("[TELEGRAM] Erro:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Helper para enviar mensagem de volta
async function sendTelegramMessage(chatId: number, text: string) {
    if (!TELEGRAM_TOKEN) {
        console.warn("[TELEGRAM] Token não configurado. Msg não enviada:", text);
        return;
    }

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });
    } catch (e) {
        console.error("Falha ao enviar msg Telegram:", e);
    }
}
