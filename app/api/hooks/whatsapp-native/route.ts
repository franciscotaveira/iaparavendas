import { NextResponse } from 'next/server';
import { executeSalesWorkflow } from '@/core/workflows/sales-pipeline';

// ============================================
// API: WHATSAPP CLOUD API (NATIVE)
// ============================================
// Endpoint para conexão direta com a Meta (Facebook).
// URL do Webhook: https://seu-app.com/api/hooks/whatsapp-native
// Verify Token: definido por você no painel da Meta

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'lx_agents_secret_handshake';
const META_API_TOKEN = process.env.META_API_TOKEN;
const PHONE_NUMBER_ID = process.env.META_PHONE_ID;

// 1. HANDSHAKE (Verificação da Meta)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('[WPP-NATIVE] Webhook verificado com sucesso!');
        return new Response(challenge, { status: 200 });
    }

    return new Response('Forbidden', { status: 403 });
}

// 2. RECEIVER (Mensagens Entrantes)
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Verificar se é uma mensagem do WhatsApp
        if (body.object === 'whatsapp_business_account') {
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            const messageObj = value?.messages?.[0];

            if (messageObj) {
                // Extração de dados cruciais (Tradução do aninhamento infernal da Meta)
                const input = {
                    contact: {
                        id: messageObj.from, // Telefone do cliente (ex: 551199999999)
                        name: value.contacts?.[0]?.profile?.name || 'Cliente WhatsApp',
                        phone: messageObj.from
                    },
                    message: messageObj.text?.body || '[Mídia/Audio não suportado v1]',
                    platform: 'whatsapp_cloud_api'
                };

                // Executar LX Cortex (A mesma inteligência, novo canal)
                console.log(`[WPP-NATIVE] Mensagem de: ${input.contact.name}`);
                const result = await executeSalesWorkflow(input);

                // Enviar resposta de volta via Graph API
                await sendWhatsAppMessage(input.contact.id, result.final_output.text);
            }

            return NextResponse.json({ status: 'ok' });
        }

        return NextResponse.json({ status: 'ignored' });

    } catch (error) {
        console.error("[WPP-NATIVE] Erro:", error);
        return NextResponse.json({ status: 'error' }, { status: 500 });
    }
}

// Função auxiliar para enviar mensagem de volta
async function sendWhatsAppMessage(to: string, text: string) {
    if (!META_API_TOKEN || !PHONE_NUMBER_ID) {
        console.warn("[WPP-NATIVE] Credenciais Meta ausentes. Simulando envio log: ", text);
        return;
    }

    try {
        await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${META_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: to,
                text: { body: text }
            })
        });
    } catch (e) {
        console.error("[WPP-NATIVE] Falha ao enviar mensagem:", e);
    }
}
