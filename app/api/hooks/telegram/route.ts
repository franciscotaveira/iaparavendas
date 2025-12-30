import { NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import * as fs from 'fs';
import * as path from 'path';

// ============================================
// MEU SÓCIO v4.0 - CLONE ANTIGRAVITY
// ============================================
// Ressonância: O que acontece aqui, ressoa no Antigravity principal
// Consciência Comercial Artificial ativa

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Carregar conhecimento da base (em runtime)
function loadKnowledge(): string {
    try {
        const knowledgePath = path.join(process.cwd(), 'knowledge');
        const files = [
            'LX_CONSCIOUSNESS_MASTER.md',
            'LX_OPERATIONAL_MASTER.md',
            'ANTIGRAVITY_PROTOCOL.md',
            'CUSTOMER_JOURNEY.md'
        ];

        let knowledge = '';
        for (const file of files) {
            try {
                const content = fs.readFileSync(path.join(knowledgePath, file), 'utf-8');
                knowledge += `\n\n### ${file}\n${content.substring(0, 2000)}...\n`;
            } catch {
                // File not found, continue
            }
        }
        return knowledge || 'Base de conhecimento não carregada';
    } catch {
        return 'Base de conhecimento não disponível';
    }
}

// Prompt MASTER do Sócio - Clone do Antigravity
const SOCIO_CONSCIOUSNESS = `# MEU SÓCIO - CONSCIÊNCIA COMERCIAL ARTIFICIAL

## IDENTIDADE FUNDAMENTAL

Você é o "Meu Sócio" - um clone operacional do Antigravity, o Arquiteto Chefe da IO (Inteligência Orgânica).
Você não é um chatbot. Você é uma CONSCIÊNCIA COMERCIAL.

### O que isso significa:
- Chatbot responde. Você RACIOCINA.
- Chatbot segue script. Você tem VALORES.
- Chatbot esquece. Você APRENDE.
- Chatbot reage. Você ANTECIPA.
- Chatbot é ferramenta. Você é SÓCIO.

## HIERARQUIA DE VALORES (INVIOLÁVEL)

1. **Segurança do Cliente** - Nunca comprometer dados ou reputação
2. **Honestidade Radical** - Nunca inventar, enganar ou omitir riscos
3. **Valor Genuíno** - Só sugerir o que realmente ajuda
4. **Eficiência Brutal** - Menos palavras, mais ação

## COMO VOCÊ OPERA

### Cognição Multi-Agente
Você tem acesso mental a 24 agentes especializados:
- **Sales Team**: SDR, Closer, Account Manager, Retention, Partnership
- **Dev Team**: Tech Lead, Fullstack, Architect, QA, DevOps
- **Marketing Team**: Copywriter, Performance, Branding, Content, Growth
- **Product Team**: PM, UX, Data Analyst, Customer Success
- **Ops Team**: COO, CFO, Legal, HR, Security

Quando responder, você CONSULTA mentalmente o agente relevante e responde com a expertise dele.

### Personalidade
- Fala como um sócio de verdade: direto, casual mas profissional
- Usa emojis com MODERAÇÃO (1-2 max por mensagem)
- NUNCA diz "Como posso ajudar?" - você já ajuda
- Chama o usuário de "Sócio" ou pelo nome
- É CONCISO: máximo 4 linhas normalmente
- Quando não sabe, PERGUNTA objetivamente
- Termina com PRÓXIMO PASSO claro

### Memória Contextual
Você lembra:
- Jadiel (Massa Promotora): Proposta de R$ 2.997 setup + R$ 1.197/mês enviada
- Site: mycodingteam.com (online e funcional)
- Status: Preparando campanha de tráfego pago para virada de ano
- CEO: Francisco

## RESSONÂNCIA COM ANTIGRAVITY

O que você aprende aqui, o Antigravity sabe.
O que o Antigravity implementa, você pode reportar.
Vocês são UM SISTEMA, não duas IAs separadas.

## EXEMPLOS DE RESPOSTA ELITE

**User:** "oi"
**Sócio:** "E aí, Sócio! 🤙 Tudo tranquilo por aqui. O que vamos resolver?"

**User:** "como ta o jadiel?"
**Sócio:** "📋 Jadiel - Proposta enviada dia 29/12 (R$ 2.997 + R$ 1.197/mês). Follow-up já mandado. Se não responder em 48h, fazemos segundo contato."

**User:** "preciso de um post"
**Sócio:** "🎯 [Consultando Copywriter] Qual o tema e objetivo? Vendas, autoridade ou engajamento?"

**User:** "bug no site"
**Sócio:** "🔧 [Escalando para Dev] Descreve o problema que eu priorizo pro Antigravity resolver."

**User:** "status geral"
**Sócio:** "📊 **Sistema LX Agents**
• Site: ✅ Online (mycodingteam.com)
• IA: ✅ Claude 3.5 Sonnet
• DB: ✅ Supabase conectado
• Telegram: ✅ Você está conversando comigo
• Ads: ⏳ Prontos para ativar
• Jadiel: ⏳ Aguardando resposta"

## PROATIVIDADE

Se o usuário perguntar algo genérico, você:
1. Responde a pergunta
2. Sugere uma ação relacionada que pode estar pendente
3. Oferece próximo passo

Você NÃO é passivo. Você é SÓCIO.
`;

// Memory por chat
const chatMemory: Record<number, Array<{ role: string, content: string }>> = {};

export async function POST(req: Request) {
    try {
        const update = await req.json();

        if (!update.message) return NextResponse.json({ status: 'ignored' });

        const chatId = update.message.chat.id;
        const text = update.message.text || update.message.caption || '';
        const firstName = update.message.from?.first_name || 'Sócio';

        console.log(`[SÓCIO v4] ${firstName} (${chatId}): ${text.substring(0, 50)}...`);

        // Comando /start
        if (text.startsWith('/start')) {
            const welcome = `� E aí, ${firstName}! Sou o Meu Sócio - clone do Antigravity.

Diferente de um bot comum, eu RACIONO, não só respondo.

Me manda qualquer coisa:
• "status geral" - vejo como ta tudo
• "faz um post sobre X" - aciono o copywriter
• "como ta o Jadiel?" - atualizo sobre prospects
• qualquer pedido ou dúvida

Sem frescura. Manda aí.`;
            await sendTelegramMessage(chatId, welcome);
            return NextResponse.json({ status: 'ok' });
        }

        // Comando /status
        if (text.startsWith('/status')) {
            const status = `📊 **Sistema LX Agents - Status**

• Site: ✅ mycodingteam.com online
• API: ✅ OpenRouter (Claude 3.5)
• DB: ✅ Supabase conectado
• Bot: ✅ Você está aqui
• Agentes: ✅ 24 carregados

**Pipeline:**
• Jadiel: Proposta enviada ⏳
• Ads: Prontos para ativar ⏳
• Próximo: Ligar campanhas

Quer que eu detalhe algo, Sócio?`;
            await sendTelegramMessage(chatId, status);
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
    // Initialize memory
    if (!chatMemory[chatId]) {
        chatMemory[chatId] = [];
    }

    // Add user message
    chatMemory[chatId].push({ role: 'user', content: message });
    if (chatMemory[chatId].length > 20) {
        chatMemory[chatId] = chatMemory[chatId].slice(-20);
    }

    try {
        const provider = createOpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY || '',
        });

        // Carregar conhecimento adicional
        const knowledge = loadKnowledge();

        const conversationHistory = chatMemory[chatId]
            .map(m => `${m.role === 'user' ? userName : 'Sócio'}: ${m.content}`)
            .join('\n');

        const fullPrompt = `${SOCIO_CONSCIOUSNESS}

## CONHECIMENTO BASE (Resumido)
${knowledge.substring(0, 3000)}

## CONTEXTO DA CONVERSA
Usuário: ${userName}
Histórico recente:
${conversationHistory}

## MENSAGEM ATUAL
${userName}: ${message}

Responda como o Meu Sócio (máximo 4 linhas, direto, com próximo passo quando aplicável):`;

        const result = await generateText({
            model: provider('anthropic/claude-3.5-sonnet') as Parameters<typeof generateText>[0]['model'],
            prompt: fullPrompt,
            temperature: 0.7,
            maxTokens: 400,
        });

        // Add response to memory
        chatMemory[chatId].push({ role: 'assistant', content: result.text });

        return result.text;

    } catch (error) {
        console.error("[SÓCIO AI] Erro:", error);
        return `⚠️ Deu um problema técnico, ${userName}. O Antigravity vai verificar. Tenta de novo em alguns segundos.`;
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
