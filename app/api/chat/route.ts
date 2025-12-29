import { createOpenAI } from '@ai-sdk/openai';
import { streamText, generateText, convertToCoreMessages, Message } from 'ai';
import {
    ONBOARDING_PROMPT,
    DEMO_PROMPT,
    CONFIDENCE_PROMPT,
    CONVERSION_PROMPT,
    EXTRACTION_PROMPT,
    SMART_FALLBACK
} from '@/lib/prompts';
import {
    getNichePack,
    detectNicheFromText,
    generateKernelPrompt,
} from '@/lib/niche-packs';
import {
    classifyIntent,
    assessRisk,
    calculateScoreFit,
} from '@/lib/humanization-engine';
import { trackExternalInteraction } from '@/core/orchestrator';

export const maxDuration = 30;

// ============================================
// SMART FALLBACK
// ============================================
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
        { pattern: /saas|software|plataforma|sistema/, niche: 'saas' },
        { pattern: /invest|financ|bolsa|cripto/, niche: 'financeiro' },
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
        return "Olá! Sou o Agente de Vendas da Lux. Para criar uma demonstração personalizada, qual é o seu tipo de negócio?";
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

// ============================================
// STREAM RESPONSE
// ============================================
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

// ============================================
// N8N LOGGER
// ============================================
async function sendToN8n(payload: Record<string, unknown>) {
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
    } catch {
        // Non-blocking
    }
}

// ============================================
// MAIN HANDLER
// ============================================
export async function POST(req: Request) {
    const { messages, stream = true, sessionId } = await req.json();
    const lastUserMessage = messages.filter((m: Message) => m.role === 'user').pop();
    const lastUserContent = lastUserMessage?.content || '';

    // Track for Dashboard (Safe Mode)
    try {
        trackExternalInteraction(sessionId || 'anonymous_web', 'sdr');
    } catch (e) {
        console.warn("Dashboard tracking failed (non-critical):", e);
    }

    // ============================================
    // HUMANIZATION ENGINE INTEGRATION
    // ============================================
    const allUserText = messages
        .filter((m: Message) => m.role === 'user')
        .map((m: Message) => m.content)
        .join(' ');

    // Detectar nicho e obter pack
    const detectedNiche = detectNicheFromText(allUserText);
    const nichePack = getNichePack(detectedNiche);

    // Classificar intenção
    const intent = classifyIntent(lastUserContent);

    // Avaliar risco
    const risk = assessRisk(lastUserContent, detectedNiche);

    // Calcular score fit
    const scoreFit = calculateScoreFit({
        niche: detectedNiche,
        goal: allUserText.includes('qualific') ? 'qualificar' :
            allUserText.includes('agend') ? 'agendar' :
                allUserText.includes('vend') ? 'vender' : undefined,
        channel: allUserText.includes('whats') ? 'WhatsApp' : undefined,
    });

    // Log enriched event
    sendToN8n({
        event: 'chat_message',
        timestamp: new Date().toISOString(),
        message_count: messages.length,
        last_user_message: lastUserContent,
        detected_niche: detectedNiche,
        intent,
        risk_level: risk.level,
        score_fit: scoreFit,
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
            console.log("Using OpenRouter (Claude 3.5 Sonnet)");
        } else if (process.env.LUX_API_URL) {
            provider = createOpenAI({
                baseURL: process.env.LUX_API_URL,
                apiKey: process.env.LUX_API_KEY || 'lux-local',
            });
            modelName = process.env.LUX_MODEL_ID || 'llama3';
            console.log("Using Local Ollama");
        } else {
            console.log("No LLM configured - using smart fallback");
            const fallbackText = getSmartFallback(messages);
            if (!stream) return Response.json({ text: fallbackText });
            return streamResponse(fallbackText);
        }

        // ============================================
        // RISK MODE HANDLING
        // ============================================
        if (risk.require_handoff) {
            const handoffMessage = nichePack.risk_mode
                ? "Essa questão precisa de um especialista qualificado. Posso te conectar com alguém agora?"
                : "Entendi. Para esse tipo de caso, prefiro que nosso especialista te atenda. Posso conectar vocês?";

            sendToN8n({
                event: 'risk_handoff_triggered',
                timestamp: new Date().toISOString(),
                risk_level: risk.level,
                reason: risk.reason,
                niche: detectedNiche,
                source: 'lx-demo-interface'
            });

            if (!stream) return Response.json({ text: handoffMessage });
            return streamResponse(handoffMessage);
        }

        // ============================================
        // MODE DETECTION
        // ============================================
        const lastAiMessage = messages.filter((m: Message) => m.role === 'assistant').pop()?.content || '';
        const onboardingFinished = lastAiMessage.includes("Perfeito. Já consigo te mostrar como");

        let systemPrompt = '';

        if (onboardingFinished || messages.length > 20) {
            // Demo Mode - use Kernel com Niche Pack
            let contextSnapshot = {
                niche: detectedNiche || "Genérico",
                goal: "Melhorar vendas",
                channel: "WhatsApp",
                products: "Serviços",
                tone: nichePack.tone_defaults.style,
                rules: "Nenhuma",
                human_handoff: "false"
            };

            try {
                const extraction = await generateText({
                    model: provider(modelName) as Parameters<typeof generateText>[0]['model'],
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
                    niche_pack: nichePack.niche,
                    score_fit: scoreFit,
                    source: 'lx-demo-interface'
                });

            } catch (err) {
                console.error("Context Extraction Failed:", err);
            }

            // Gerar prompt do Kernel baseado no Niche Pack
            const kernelPrompt = generateKernelPrompt(nichePack);

            const filledDemoPrompt = DEMO_PROMPT
                .replace('{{context_snapshot.niche}}', contextSnapshot.niche)
                .replace('{{context_snapshot.goal}}', contextSnapshot.goal)
                .replace('{{context_snapshot.channel}}', contextSnapshot.channel)
                .replace('{{context_snapshot.products}}', contextSnapshot.products)
                .replace('{{context_snapshot.tone}}', contextSnapshot.tone)
                .replace('{{context_snapshot.rules}}', contextSnapshot.rules);

            systemPrompt = `${kernelPrompt}\n---\n${filledDemoPrompt}\n---\n${CONFIDENCE_PROMPT}\n---\n${CONVERSION_PROMPT}`;
        } else {
            systemPrompt = ONBOARDING_PROMPT;
        }

        // ============================================
        // LLM CALL
        // ============================================
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("AI_TIMEOUT")), 15000)
        );

        if (!stream) {
            const result = await Promise.race([
                generateText({
                    model: provider(modelName) as Parameters<typeof generateText>[0]['model'],
                    system: systemPrompt,
                    messages: convertToCoreMessages(messages),
                    temperature: 0.3,
                }),
                timeoutPromise
            ]) as Awaited<ReturnType<typeof generateText>>;

            return Response.json({
                text: result.text,
                usage: result.usage
            });
        }

        const result = await Promise.race([
            streamText({
                model: provider(modelName) as Parameters<typeof streamText>[0]['model'],
                system: systemPrompt,
                messages: convertToCoreMessages(messages),
                temperature: 0.3,
                maxRetries: 0,
            }),
            timeoutPromise
        ]) as Awaited<ReturnType<typeof streamText>>;

        return result.toDataStreamResponse();

    } catch (error) {
        console.error("LUX CORE ERROR:", error);

        sendToN8n({
            event: 'fallback_activated',
            timestamp: new Date().toISOString(),
            reason: String(error),
            last_user_message: lastUserContent,
            source: 'lx-demo-interface'
        });

        const fallback = getSmartFallback(messages);
        if (!stream) return Response.json({ text: fallback });
        return streamResponse(fallback);
    }
}
