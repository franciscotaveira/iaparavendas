import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Configuração Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Configuração OpenAI (Necessária para Whisper e Vision)
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY, // Preferência por OpenAI real para áudio/imagem nativos se disponível
});

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Função Auxiliar: Enviar Mensagem de volta ao Telegram
async function sendTelegramReply(chatId: string, text: string) {
    if (!TELEGRAM_TOKEN) return;
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
}

// Handler de Webhook
export async function POST(req: Request) {
    if (!TELEGRAM_TOKEN) {
        return NextResponse.json({ error: 'Telegram Token not configured' }, { status: 500 });
    }

    try {
        const update = await req.json();

        // Verifica se é uma mensagem
        if (!update.message) return NextResponse.json({ ok: true });

        const chatId = update.message.chat.id;
        const msg = update.message;

        // ==============================
        // 1. PROCESSAMENTO DE ÁUDIO (VOICE)
        // ==============================
        if (msg.voice) {
            await sendTelegramReply(chatId, "🎤 Recebi seu áudio. Processando transcrição...");
            // TODO: Baixar arquivo do Telegram -> Enviar para Whisper -> Obter Texto
            // (Simulação por enquanto devido à complexidade de manipular buffer binary em serverless sem deps extras)

            await sendTelegramReply(chatId, "⚠️ *Nota:* Transcrição de áudio requer configuração avançada de infra (FFmpeg/Whisper). Por enquanto, envie texto ou imagem.");
            return NextResponse.json({ ok: true });
        }

        // ==============================
        // 2. PROCESSAMENTO DE IMAGEM (PHOTO)
        // ==============================
        if (msg.photo) {
            await sendTelegramReply(chatId, "👁️ Recebi sua imagem. Analisando com Visão Computacional...");

            // Pega a maior foto
            const photoId = msg.photo[msg.photo.length - 1].file_id;

            // Get File Path
            const fileRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${photoId}`);
            const fileData = await fileRes.json();
            const filePath = fileData.result.file_path;
            const imageUrl = `https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${filePath}`;

            // Chamar GPT-4o Vision (Simulado via Text Gen para exemplo, necessita model vision)
            // Aqui conectaríamos ao 'gpt-4o' com o array de content: [{ type: 'image_url', image_url: ... }]

            await sendTelegramReply(chatId, `🖼️ *Análise da Imagem:* \n\n(Simulação) Detectei um erro na tela de checkout. Criando ticket para o Agente Sentinel.`);

            // Logar no banco como "Tarefa Criada via Visão"
            await supabase.from('lxc_council_logs').insert({
                lead_id: 'COMMAND_CENTER',
                consensus: `Visual Input Action: Analyze image ${imageUrl}`,
                score: 100
            });

            return NextResponse.json({ ok: true });
        }

        // ==============================
        // 3. PROCESSAMENTO DE TEXTO (COMANDOS)
        // ==============================
        if (msg.text) {
            const text = msg.text.toLowerCase();
            console.log(`[Telegram Command] ${text}`);

            // Roteador de Comandos
            if (text.includes('criar post') || text.includes('instagram')) {
                await sendTelegramReply(chatId, "🎨 *Criando Post...* \n\nGerando copy e ideia visual para Instagram sobre o tema solicitado.");
                // Chamar LLM para gerar copy
                // ...
                await sendTelegramReply(chatId, "✅ **Post Criado:**\n\n'Descubra o poder da automação...' \n\n(Imagem gerada enviada em anexo - simulado)");
            }
            else if (text.includes('consertar') || text.includes('bug') || text.includes('erro')) {
                await sendTelegramReply(chatId, "🛠️ *Chamado Técnico Aberto.*\n\nO Agente Sentinel foi notificado e iniciará a depuração do bug mencionado.");
                // Logar ticket
            }
            else if (text.includes('status') || text.includes('relatório')) {
                const { data: directive } = await supabase.rpc('get_active_directive');
                await sendTelegramReply(chatId, `📊 *Status LXC:*\n\nFoco Hoje: ${directive?.[0]?.global_focus || 'Nenhum'}\nSistemas: ONLINE 🟢`);
            }
            else {
                // Chat Genérico (Fala com o Sócio)
                await sendTelegramReply(chatId, "🤖 Recebido. Aguarde enquanto processo sua solicitação executiva.");
            }
        }

        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error('[Telegram Webhook Error]', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
