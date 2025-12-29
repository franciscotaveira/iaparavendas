// ============================================
// Lx Humanized Agent Engine - Intent + Risk Classifier v1.0
// ============================================

import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { ClassificationResult, Intent, RiskLevel, AgentContext } from './types';

const CLASSIFIER_PROMPT = `Você é um classificador invisível de mensagens.
Analise a mensagem do usuário e classifique:

1. INTENÇÃO (escolha UMA):
- duvida: pergunta sobre produto/serviço
- orcamento: pergunta sobre preço/custo
- agendamento: quer marcar horário/reunião
- objecao: resistência, desculpa, "vou pensar"
- urgencia: precisa resolver AGORA
- outro: não se encaixa

2. RISCO (escolha UM):
- baixo: conversa normal, sem sinais de problema
- medio: alguma hesitação ou confusão
- alto: cliente irritado, pedindo humano, ou assunto sensível

Responda APENAS com o JSON, sem explicações.`;

const ClassificationSchema = z.object({
    intent: z.enum(['duvida', 'orcamento', 'agendamento', 'objecao', 'urgencia', 'outro']),
    risk: z.enum(['baixo', 'medio', 'alto']),
    confidence: z.number().min(0).max(100),
    reasoning: z.string().max(100)
});

export async function classifyMessage(context: AgentContext): Promise<ClassificationResult> {
    try {
        const provider = createOpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY || '',
        });

        const result = await generateObject({
            model: provider('anthropic/claude-3.5-sonnet') as any,
            schema: ClassificationSchema,
            prompt: `${CLASSIFIER_PROMPT}

Histórico resumido: ${context.session.session_summary || 'Primeira interação'}
Mensagem do usuário: "${context.message}"`,
            temperature: 0,
        });

        return result.object as ClassificationResult;

    } catch (error) {
        console.error('Classification failed, using fallback:', error);
        return fallbackClassification(context.message);
    }
}

function fallbackClassification(message: string): ClassificationResult {
    const lower = message.toLowerCase();

    // Detecção básica de intenção
    let intent: Intent = 'outro';
    if (/quanto|pre[çc]o|valor|custo|investimento/.test(lower)) {
        intent = 'orcamento';
    } else if (/agendar|marcar|horár|reuni[ãa]o|calendly/.test(lower)) {
        intent = 'agendamento';
    } else if (/como|funciona|qual|pode|o que|quero saber/.test(lower)) {
        intent = 'duvida';
    } else if (/n[ãa]o sei|vou pensar|depois|agora n[ãa]o|caro|difícil/.test(lower)) {
        intent = 'objecao';
    } else if (/urgente|hoje|agora|r[áa]pido|emergência/.test(lower)) {
        intent = 'urgencia';
    }

    // Detecção básica de risco
    let risk: RiskLevel = 'baixo';
    if (/humano|pessoa real|atendente|cancelar|reclamar/.test(lower)) {
        risk = 'alto';
    } else if (/n[ãa]o entendi|confuso|complicado/.test(lower)) {
        risk = 'medio';
    }

    return {
        intent,
        risk,
        confidence: 60,
        reasoning: 'Fallback classification (LLM unavailable)'
    };
}

// Função para detectar objeção repetida
export function detectRepeatedObjection(
    message: string,
    lastObjection: string | null
): boolean {
    if (!lastObjection) return false;

    const currentLower = message.toLowerCase();
    const lastLower = lastObjection.toLowerCase();

    // Se 50%+ das palavras são iguais, considera repetida
    const currentWords = new Set(currentLower.split(/\s+/));
    const lastWords = new Set(lastLower.split(/\s+/));

    let matches = 0;
    for (const word of currentWords) {
        if (lastWords.has(word) && word.length > 3) {
            matches++;
        }
    }

    const similarity = matches / Math.max(currentWords.size, lastWords.size);
    return similarity > 0.5;
}
