import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { CLINIC_ASSISTANT_PROMPT, CLINIC_CONTEXT } from '@/lib/clinic-prompts';

export async function POST(request: NextRequest) {
    try {
        const { messages, clinicConfig } = await request.json();

        // Usa configuração custom ou a padrão
        const config = clinicConfig || CLINIC_CONTEXT;

        // Monta o prompt com contexto dinâmico
        const systemPrompt = CLINIC_ASSISTANT_PROMPT
            .replace('[Clínica]', config.clinicName || 'Clínica')
            .replace('Sofia', config.assistantName || 'Assistente');

        // Configure Provider similar to main chat
        let provider;
        let modelName = 'gpt-4o-mini';

        if (process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.includes('COLE_SUA_CHAVE')) {
            provider = createOpenAI({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY,
            });
            modelName = 'openai/gpt-4o-mini'; // Model mapping for OpenRouter
        } else if (process.env.LUX_API_URL) {
            provider = createOpenAI({
                baseURL: process.env.LUX_API_URL,
                apiKey: process.env.LUX_API_KEY || 'lux-local',
            });
            modelName = process.env.LUX_MODEL_ID || 'llama3';
        } else {
            // Default to standard OpenAI if keys exist, or init generic
            provider = createOpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
        }

        const result = await streamText({
            model: provider(modelName),
            system: systemPrompt,
            messages: messages.map((m: any) => ({
                role: m.role,
                content: m.content
            })),
            temperature: 0.7,
            maxTokens: 500
        });

        return result.toAIStreamResponse();

    } catch (error: any) {
        console.error('Erro no chat da clínica:', error);
        return NextResponse.json(
            { error: error.message || 'Erro desconhecido' },
            { status: 500 }
        );
    }
}

// GET para verificar status
export async function GET() {
    return NextResponse.json({
        service: 'clinic-chat',
        status: 'online',
        defaultClinic: CLINIC_CONTEXT.clinicName,
        assistantName: CLINIC_CONTEXT.assistantName
    });
}
