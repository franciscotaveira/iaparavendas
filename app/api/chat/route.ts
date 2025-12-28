import { createOpenAI } from '@ai-sdk/openai';
import { streamText, generateText, convertToCoreMessages, Message } from 'ai';
import {
    INTRO_MESSAGE,
    ONBOARDING_PROMPT,
    DEMO_PROMPT,
    CONFIDENCE_PROMPT,
    CONVERSION_PROMPT,
    EXTRACTION_PROMPT,
    SMART_FALLBACK
} from '@/lib/prompts';

export const maxDuration = 30;

// Smart Fallback: Analyzes context to give a relevant response
function getSmartFallback(messages: Message[]): string {
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase());
    const allText = userMessages.join(' ');

    // Detect what we already know
    const nichePatterns = [
        { pattern: /advog|direito|jurídic/, niche: 'advocacia' },
        { pattern: /médic|clínic|saúde|consult/, niche: 'saúde' },
        { pattern: /imobili|corretor|imóve/, niche: 'imobiliária' },
        { pattern: /loja|e-?commerce|varejo/, niche: 'e-commerce' },
        { pattern: /restaurante|comida|delivery/, niche: 'alimentação' },
        { pattern: /academia|personal|fitness/, niche: 'fitness' },
        { pattern: /escola|curso|educaç/, niche: 'educação' },
    ];

    const goalPatterns = [
        { pattern: /qualific|filtrar lead|triar/, goal: 'qualificar leads' },
        { pattern: /agend|marcar|horár|consult/, goal: 'agendar consultas' },
        { pattern: /vend|convert|fechar/, goal: 'aumentar vendas' },
        { pattern: /atend|respond|suporte/, goal: 'automatizar atendimento' },
    ];

    const channelPatterns = [
        { pattern: /whats|zap|wpp/, channel: 'WhatsApp' },
        { pattern: /insta|instagram|dm/, channel: 'Instagram' },
        { pattern: /site|chat|web/, channel: 'Site' },
    ];

    let detectedNiche = '';
    let detectedGoal = '';
    let detectedChannel = '';

    for (const { pattern, niche } of nichePatterns) {
        if (pattern.test(allText)) { detectedNiche = niche; break; }
    }

    for (const { pattern, goal } of goalPatterns) {
        if (pattern.test(allText)) { detectedGoal = goal; break; }
    }

    for (const { pattern, channel } of channelPatterns) {
        if (pattern.test(allText)) { detectedChannel = channel; break; }
    }

    // Decision tree for smart response
    if (messages.length <= 1) {
        return INTRO_MESSAGE;
    }

    if (detectedNiche && detectedGoal && detectedChannel) {
        return SMART_FALLBACK.ready_for_demo;
    }

    if (detectedNiche && detectedGoal) {
        return SMART_FALLBACK.already_said_goal(detectedGoal);
    }

    if (detectedNiche) {
        return SMART_FALLBACK.already_said_niche(detectedNiche);
    }

    if (detectedChannel) {
        return SMART_FALLBACK.already_said_channel(detectedChannel);
    }

    return SMART_FALLBACK.greeting;
}

async function streamResponse(text: string) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const chunks = text.split(" ");
            for (const chunk of chunks) {
                controller.enqueue(encoder.encode(`0:"${chunk} "\n`));
                await new Promise(r => setTimeout(r, 40));
            }
            controller.close();
        }
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

// Fire-and-forget: Send to N8n
async function sendToN8n(payload: any) {
    if (!process.env.N8N_WEBHOOK_URL) return;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        await fetch(process.env.N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeout);
        console.log("N8n:", payload.event);
    } catch (err) {
        // Non-blocking
    }
}

export async function POST(req: Request) {
    const { messages } = await req.json();
    const lastUserMessage = messages.filter((m: Message) => m.role === 'user').pop();

    // Send every message to N8n
    sendToN8n({
        event: 'chat_message',
        timestamp: new Date().toISOString(),
        message_count: messages.length,
        last_user_message: lastUserMessage?.content || '',
        source: 'lx-demo-interface'
    });

    try {
        // Configure Provider
        let provider;
        let modelName;

        if (process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.includes('COLE_SUA_CHAVE')) {
            provider = createOpenAI({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY,
            });
            modelName = 'anthropic/claude-3.5-sonnet';
            console.log("Using OpenRouter (Claude 3.5 Sonnet - Premium)");
        } else if (process.env.LUX_API_URL) {
            provider = createOpenAI({
                baseURL: process.env.LUX_API_URL,
                apiKey: process.env.LUX_API_KEY || 'lux-local',
            });
            modelName = process.env.LUX_MODEL_ID || 'llama3';
            console.log("Using Local Ollama");
        } else {
            // No LLM configured - use smart fallback only
            console.log("No LLM configured - using smart fallback");
            return streamResponse(getSmartFallback(messages));
        }

        // Detect mode
        const lastAiMessage = messages.filter((m: Message) => m.role === 'assistant').pop()?.content || '';
        const onboardingFinished = lastAiMessage.includes("Perfeito. Já consigo te mostrar como");

        let systemPrompt = '';

        if (onboardingFinished || messages.length > 20) {
            // Demo Mode
            let contextSnapshot = {
                niche: "Genérico",
                goal: "Melhorar vendas",
                channel: "WhatsApp",
                products: "Serviços",
                tone: "Profissional",
                rules: "Nenhuma",
                human_handoff: "false"
            };

            try {
                const extraction = await generateText({
                    model: provider(modelName) as any,
                    system: EXTRACTION_PROMPT,
                    messages: convertToCoreMessages(messages),
                    temperature: 0,
                });

                const jsonStr = extraction.text.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(jsonStr);
                contextSnapshot = { ...contextSnapshot, ...parsed };

                sendToN8n({
                    event: 'onboarding_complete',
                    timestamp: new Date().toISOString(),
                    context: contextSnapshot,
                    source: 'lx-demo-interface'
                });

            } catch (err) {
                console.error("Context Extraction Failed:", err);
            }

            const filledDemoPrompt = DEMO_PROMPT
                .replace('{{context_snapshot.niche}}', contextSnapshot.niche)
                .replace('{{context_snapshot.goal}}', contextSnapshot.goal)
                .replace('{{context_snapshot.channel}}', contextSnapshot.channel)
                .replace('{{context_snapshot.products}}', contextSnapshot.products)
                .replace('{{context_snapshot.tone}}', contextSnapshot.tone)
                .replace('{{context_snapshot.rules}}', contextSnapshot.rules);

            systemPrompt = `${filledDemoPrompt}\n---\n${CONFIDENCE_PROMPT}\n---\n${CONVERSION_PROMPT}`;
        } else {
            systemPrompt = ONBOARDING_PROMPT;
        }

        // Call LLM with timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("AI_TIMEOUT")), 15000) // 15s timeout (OpenRouter is faster)
        );

        const result = await Promise.race([
            streamText({
                model: provider(modelName) as any,
                system: systemPrompt,
                messages: convertToCoreMessages(messages),
                temperature: 0.3,
                maxRetries: 0,
            }),
            timeoutPromise
        ]) as any;

        return result.toDataStreamResponse();

    } catch (error) {
        console.error("LUX CORE ERROR:", error);

        sendToN8n({
            event: 'fallback_activated',
            timestamp: new Date().toISOString(),
            reason: String(error),
            last_user_message: lastUserMessage?.content || '',
            source: 'lx-demo-interface'
        });

        // Use SMART fallback instead of generic one
        return streamResponse(getSmartFallback(messages));
    }
}
