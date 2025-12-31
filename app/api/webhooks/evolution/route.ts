// ============================================
// EVOLUTION API WEBHOOK HANDLER
// ============================================
// Recebe eventos do Evolution API e normaliza
// para o mesmo formato que usamos com Meta
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Tipos de eventos do Evolution
interface EvolutionWebhookEvent {
    event: string;
    instance: string;
    data: any;
    destination?: string;
    date_time?: string;
    sender?: string;
    server_url?: string;
    apikey?: string;
}

// ============================================
// GET - Health Check
// ============================================
export async function GET(request: NextRequest) {
    return NextResponse.json({
        status: 'ok',
        provider: 'evolution',
        message: 'Evolution API Webhook is active'
    });
}

// ============================================
// POST - Recebe Eventos do Evolution
// ============================================
export async function POST(request: NextRequest) {
    try {
        const event: EvolutionWebhookEvent = await request.json();

        console.log(`[Evolution Webhook] Event: ${event.event} from ${event.instance}`);

        // Processar baseado no tipo de evento
        switch (event.event) {
            case 'messages.upsert':
                return await handleIncomingMessage(event);

            case 'connection.update':
                return await handleConnectionUpdate(event);

            case 'qrcode.updated':
                return await handleQRCodeUpdate(event);

            case 'send.message':
                // Confirmação de envio
                console.log(`[Evolution] Message sent: ${event.data?.key?.id}`);
                return NextResponse.json({ status: 'received' });

            default:
                console.log(`[Evolution] Unhandled event: ${event.event}`);
                return NextResponse.json({ status: 'ignored' });
        }
    } catch (error: any) {
        console.error('[Evolution Webhook] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ============================================
// HANDLERS
// ============================================

async function handleIncomingMessage(event: EvolutionWebhookEvent) {
    const message = event.data;

    // Ignorar mensagens enviadas por nós
    if (message.key?.fromMe) {
        return NextResponse.json({ status: 'ignored', reason: 'fromMe' });
    }

    // Extrair dados
    const remoteJid = message.key?.remoteJid || '';
    const phoneNumber = remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '');
    const messageId = message.key?.id;
    const instanceName = event.instance;

    // Extrair texto (pode vir de diferentes lugares)
    let text = '';
    if (message.message?.conversation) {
        text = message.message.conversation;
    } else if (message.message?.extendedTextMessage?.text) {
        text = message.message.extendedTextMessage.text;
    } else if (message.message?.imageMessage?.caption) {
        text = message.message.imageMessage.caption;
    }

    if (!text) {
        console.log('[Evolution] Non-text message received, ignoring');
        return NextResponse.json({ status: 'ignored', reason: 'non-text' });
    }

    console.log(`[Evolution] Message from ${phoneNumber}: "${text}"`);

    // 1. Resolver Tenant pela instância
    const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id')
        .eq('evolution_instance', instanceName)
        .single();

    if (tenantError || !tenant) {
        console.error('[Evolution] Tenant not found for instance:', instanceName);
        return NextResponse.json({ error: 'Tenant not found' }, { status: 200 });
    }

    // 2. Verificar duplicata (idempotência)
    const { data: existingEvent } = await supabase
        .from('webhook_events')
        .select('id')
        .eq('tenant_id', tenant.id)
        .eq('meta_message_id', messageId)
        .single();

    if (existingEvent) {
        console.log('[Evolution] Duplicate event, ignoring');
        return NextResponse.json({ status: 'duplicate' });
    }

    // 3. Criar payload normalizado (mesmo formato do Meta)
    const normalizedPayload = {
        object: 'whatsapp_business_account',
        entry: [{
            id: instanceName,
            changes: [{
                value: {
                    messaging_product: 'whatsapp',
                    metadata: {
                        display_phone_number: instanceName,
                        phone_number_id: instanceName,
                    },
                    contacts: [{
                        profile: { name: message.pushName || phoneNumber },
                        wa_id: phoneNumber,
                    }],
                    messages: [{
                        from: phoneNumber,
                        id: messageId,
                        timestamp: Math.floor(Date.now() / 1000).toString(),
                        text: { body: text },
                        type: 'text',
                    }],
                },
                field: 'messages',
            }],
        }],
        // Metadado extra para saber a origem
        _provider: 'evolution',
        _instance: instanceName,
    };

    // 4. Salvar evento
    const { data: webhookEvent, error: insertError } = await supabase
        .from('webhook_events')
        .insert({
            tenant_id: tenant.id,
            meta_message_id: messageId,
            payload: normalizedPayload,
            status: 'pending',
        })
        .select('id')
        .single();

    if (insertError) {
        console.error('[Evolution] Failed to save event:', insertError);
        return NextResponse.json({ error: 'Failed to save' }, { status: 200 });
    }

    // 5. Enfileirar para processamento
    await supabase.from('message_queue').insert({
        webhook_event_id: webhookEvent.id,
        tenant_id: tenant.id,
        priority: 0,
        status: 'queued',
    });

    console.log(`[Evolution] Event queued: ${webhookEvent.id}`);
    return NextResponse.json({ status: 'queued' });
}

async function handleConnectionUpdate(event: EvolutionWebhookEvent) {
    const state = event.data?.state;
    const instanceName = event.instance;

    console.log(`[Evolution] Connection update for ${instanceName}: ${state}`);

    // Atualizar status no tenant
    const connected = state === 'open';

    await supabase
        .from('tenants')
        .update({
            evolution_connected: connected,
            evolution_last_check: new Date().toISOString(),
        })
        .eq('evolution_instance', instanceName);

    return NextResponse.json({ status: 'updated' });
}

async function handleQRCodeUpdate(event: EvolutionWebhookEvent) {
    const qrcode = event.data?.qrcode;
    const instanceName = event.instance;

    console.log(`[Evolution] QR Code updated for ${instanceName}`);

    // Salvar QR code no tenant para exibir na dashboard
    if (qrcode) {
        await supabase
            .from('tenants')
            .update({
                evolution_qrcode: qrcode,
                evolution_connected: false,
            })
            .eq('evolution_instance', instanceName);
    }

    return NextResponse.json({ status: 'qr_saved' });
}
