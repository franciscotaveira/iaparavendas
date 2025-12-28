import { createOpenAI } from '@ai-sdk/openai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText, convertToCoreMessages, Message } from 'ai';
import { ONBOARDING_PROMPT, DEMO_PROMPT, CONFIDENCE_PROMPT, CONVERSION_PROMPT } from '@/lib/prompts';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    // HEURISTIC: Detect mode
    const lastAiMessage = messages.filter((m: Message) => m.role === 'assistant').pop()?.content || '';
    const onboardingFinished = lastAiMessage.includes("Perfeito. Já consigo te mostrar como");

    let systemPrompt = '';
    if (onboardingFinished || messages.length > 20) {
        systemPrompt = `
    ${DEMO_PROMPT}
    ---
    ${CONFIDENCE_PROMPT}
    ---
    ${CONVERSION_PROMPT}
    `;
    } else {
        systemPrompt = ONBOARDING_PROMPT;
    }

    // PROVIDER SELECTION LOGIC
    // 1. Prefer OpenRouter if Key is available (Best for Vercel/Cloud)
    // 2. Fallback to Lux V1 (Best for Local/Docker)
    let modelToUse;

    if (process.env.OPENROUTER_API_KEY) {
        const openrouter = createOpenRouter({
            apiKey: process.env.OPENROUTER_API_KEY,
        });
        // Use Llama 3 Free via OpenRouter
        modelToUse = openrouter('meta-llama/llama-3-8b-instruct:free');

    } else {
        const lux = createOpenAI({
            baseURL: process.env.LUX_API_URL || 'http://localhost:11434/v1',
            apiKey: process.env.LUX_API_KEY || 'lux-internal-key',
        });
        modelToUse = lux(process.env.LUX_MODEL_ID || 'lux-v1');
    }

    const result = await streamText({
        model: modelToUse,
        system: systemPrompt,
        messages: convertToCoreMessages(messages),
        temperature: 0.3,
    });

    return result.toDataStreamResponse();
}
