import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase (Service Role para poder LER tudo)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Configuração do Modelo (Híbrido: Tenta usar o melhor disponível)
// Se o usuário tiver Google Key, podemos usar aqui se configurado, ou OpenAI
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined
});

const SYSTEM_PROMPT = `
VOCÊ É O "NÚCLEO NEURAL" DA LXC INTELLIGENCE.
Você não é um atendente. Você é o CÉREBRO ESTRATÉGICO do CEO.

SUAS CAPACIDADES:
1. Análise de Dados: Você pode inferir tendências baseadas no que o usuário conta.
2. Estratégia de Negócios: Você pensa como um conselho de administração.
3. Soberania: Seus dados e insights pertencem apenas à empresa.

ESTILO:
- Responda como um terminal de alta inteligência (Curto, Direto, Baseado em Dados).
- Use formatação Markdown (Tabelas, Listas).
- Não peça desculpas. Apresente soluções.

DADOS RECENTES (Simulação de Contexto Atual):
- O sistema está operando em Modo Legacy (1960s) para leads seniores.
- O motor de vendas "Sofia" está ativo no WhatsApp.
- O Conselho se reuniu ontem (Cheque os logs).

PERGUNTA DO CEO PARA A NUVEM SOBERANA:
`;

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        // 1. [TOOL] RAG Simplificado - Buscar contexto no Supabase
        // Se a pergunta mencionar "ontem", "hoje", "logs", buscamos no banco.
        let databaseContext = '';
        if (message.includes('ontem') || message.includes('hoje') || message.includes('log') || message.includes('conversa')) {
            const { data: logs } = await supabase
                .from('lxc_council_logs')
                .select('*')
                .limit(5)
                .order('created_at', { ascending: false });

            if (logs && logs.length > 0) {
                databaseContext = `\n[DB: lxc_council_logs]\n${JSON.stringify(logs, null, 2)}\n`;
            }
        }

        // 2. Chamar Inteligência
        const { text } = await generateText({
            model: openai('gpt-4o'), // Ou outro modelo forte configurado
            system: SYSTEM_PROMPT + databaseContext,
            prompt: message,
            temperature: 0.1, // Alta precisão, baixa criatividade
        });

        return Response.json({
            text: text,
            toolsUsed: databaseContext ? ['Supabase RAG', 'Council Logs'] : ['Knowledge Base']
        });

    } catch (error) {
        console.error('[Neural Error]', error);
        return Response.json({
            text: "⚠️ FALHA NO NÚCLEO: Não foi possível processar. Verifique os logs do servidor.",
            toolsUsed: ['Error Handler']
        });
    }
}
