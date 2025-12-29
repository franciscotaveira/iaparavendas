import { NextResponse } from 'next/server';
import { executeSalesWorkflow } from '@/core/workflows/sales-pipeline';

// ============================================
// API: MANYCHAT WEBHOOK (NATIVE)
// ============================================
// Endpoint para substituir o Webhook do N8N.
// Coloque esta URL no ManyChat: https://seu-app.com/api/hooks/manychat

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validação básica do Payload do ManyChat
        // Esperamos: { id, name, custom_fields: { last_message } }
        if (!body.id) {
            return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
        }

        const input = {
            contact: {
                id: body.id,
                name: body.first_name || 'Cliente',
                phone: body.phone
            },
            message: body.custom_fields?.last_user_message || body.last_input_text || "Olá",
            platform: 'whatsapp'
        };

        // Executar o Motor Interno (LX Cortex)
        console.log(`[HOOK] Recebido de ManyChat: ${input.contact.id}`);
        const result = await executeSalesWorkflow(input);

        // Retornar no formato que o ManyChat espera
        // Para "Dynamic Content" (External Request), retornamos JSON com campos para mapear
        return NextResponse.json({
            version: 'v2',
            content: {
                messages: [
                    {
                        type: 'text',
                        text: result.final_output.text
                    }
                ],
                actions: [], // Poderíamos adicionar tags aqui
                quick_replies: []
            },
            // Metadata para debugging no ManyChat
            lx_agent: result.final_output.agent.name,
            lx_latency: `${result.metrics.latency_ms}ms`
        });

    } catch (error) {
        console.error("[HOOK] Erro crítico:", error);
        // Fallback seguro para não travar o bot
        return NextResponse.json({
            content: {
                messages: [{ type: 'text', text: "Desculpe, tive um lapso momentâneo. Pode repetir?" }]
            }
        }, { status: 200 });
    }
}
