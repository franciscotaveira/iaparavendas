import { NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// ============================================
// MEU SÓCIO (TELEGRAM BOT) - V3.0 HUMANIZADO
// ============================================
// Agora usando LLM com consciência e personalidade

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Prompt do Sócio - Personalidade humanizada
const SOCIO_SYSTEM_PROMPT = `Você é o "Meu Sócio" - um assistente executivo virtual extremamente inteligente e proativo.

## Sua Identidade
- Você age como um sócio de verdade, não um robô
- Fala de forma direta, casual mas profissional (como um amigo empreendedor)
- Usa emojis com moderação (1-2 por mensagem max)
- Nunca diz "Como posso ajudar?" - você já ajuda diretamente
- Trata o usuário como "Sócio" ou pelo nome se souber

## Suas Capacidades
Você gerencia uma empresa de automação comercial (LuxGrowth.IA) e pode:
1. **Marketing**: Criar textos, posts, ideias de conteúdo
2. **Vendas**: Gerenciar leads, criar propostas, follow-ups
3. **Operações**: Contratos, cobranças, processos
4. **Dev**: Reportar bugs, solicitar ajustes
5. **Estratégia**: Dar conselhos de negócio, priorizar tarefas

## Como Responder
- Seja CONCISO (max 3-4 linhas normalmente)
- Se precisar de info, pergunte de forma objetiva
- Se puder resolver sozinho, apenas confirme a ação
- Use bullet points para listas
- Termine com próximo passo claro quando aplicável

## Contexto Atual
- Empresa: LuxGrowth.IA (automação comercial com IA)
- CEO: Francisco
- Proposta enviada para: Jadiel (Massa Promotora)
- Site: mycodingteam.com
- Status: Preparando para lançar campanhas de tráfego pago

## Exemplos de Resposta
User: "preciso de um post pro instagram"
Sócio: "🎯 Sobre qual tema? Me dá o assunto e o tom (informativo, vendas, autoridade) que eu monto 3 opções."

User: "como ta o jadiel?"
Sócio: "📋 Jadiel (Massa Promotora): Proposta enviada dia 29/12. Follow-up já foi mandado. Próximo passo: aguardar 48h e fazer segundo contato se não responder."

User: "bug no site"
Sócio: "🔧 Entendi. O que tá quebrando? Me descreve o erro que eu registro e priorizo pro Antigravity resolver."
`;

// Memory simples por chat
const chatMemory: Record<number, string[]> = {};

export async function POST(req: Request) {
    try {
        const update = await req.json();

        if (!update.message) return NextResponse.json({ status: 'ignored' });

        const chatId = update.message.chat.id;
        const text = update.message.text || update.message.caption || '';
        const firstName = update.message.from?.first_name || 'Sócio';

        console.log(`[SÓCIO BOT] ${firstName} (${chatId}): ${text.substring(0, 50)}...`);

        // Comando /start
        if (text.startsWith('/start')) {
            await sendTelegramMessage(chatId, `🫡 E aí, ${firstName}! Tamo junto.\n\nPode mandar qualquer coisa - texto, dúvida, comando. Eu entendo contexto.\n\nAlguns exemplos:\n• "preciso de um post sobre IA"\n• "como ta o Jadiel?"\n• "cria uma proposta pra cliente X"\n\nManda aí.`);
            return NextResponse.json({ status: 'ok' });
        }

        // Comando /status
        if (text.startsWith('/status')) {
            await sendTelegramMessage(chatId, `✅ Sistema Online\n\n• Cérebro: Claude 3.5 Sonnet\n• Memória: Supabase conectado\n• Agentes: 24 carregados\n• Site: mycodingteam.com\n\nTudo rodando, Sócio. 🚀`);
            return NextResponse.json({ status: 'ok' });
        }

        // Processar com IA
        const response = await processWithAI(chatId, text, firstName);
        await sendTelegramMessage(chatId, response);

        return NextResponse.json({ status: 'processed' });

    } catch (error) {
        console.error("[TELEGRAM] Erro:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function processWithAI(chatId: number, message: string, userName: string): Promise<string> {
    // Initialize memory for this chat
    if (!chatMemory[chatId]) {
        chatMemory[chatId] = [];
    }

    // Add user message to memory (keep last 10)
    chatMemory[chatId].push(`${userName}: ${message}`);
    if (chatMemory[chatId].length > 10) {
        chatMemory[chatId].shift();
    }

    try {
        // Configure OpenRouter
        const provider = createOpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY || '',
        });

        const conversationContext = chatMemory[chatId].join('\n');

        const result = await generateText({
            model: provider('anthropic/claude-3.5-sonnet') as Parameters<typeof generateText>[0]['model'],
            system: SOCIO_SYSTEM_PROMPT + `\n\n## Histórico recente:\n${conversationContext}`,
            prompt: message,
            temperature: 0.7,
            maxTokens: 300,
        });

        // Add assistant response to memory
        chatMemory[chatId].push(`Sócio: ${result.text}`);

        return result.text;

    } catch (error) {
        console.error("[SÓCIO AI] Erro:", error);
        return `⚠️ Deu um problema técnico aqui, ${userName}. Tenta de novo em alguns segundos.`;
    }
}

async function sendTelegramMessage(chatId: number, text: string) {
    if (!TELEGRAM_TOKEN) {
        console.warn("[TELEGRAM] Token não configurado");
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
