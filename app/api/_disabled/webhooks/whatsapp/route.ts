import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Configuração Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'lx_secure_token_2025';

// [GET] Verificação do Webhook (Meta Challenge)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const verifyToken = process.env.META_VERIFY_TOKEN;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === verifyToken) {
        return new NextResponse(challenge, { status: 200 });
    }
    return new NextResponse('Forbidden', { status: 403 });
}

// [POST] Recebimento de Eventos (Async Queue Pattern)
export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // 1. Extração Básica (Validação de Estrutura)
        const entry = payload.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (!message) {
            // Se for status update (sent/delivered), loga e ignora por enquanto
            return new NextResponse('Event Received', { status: 200 });
        }

        const metaMessageId = message.id;
        const phoneNumberId = value.metadata?.phone_number_id;

        // 2. Resolução de Tenant (Quem é o dono desse número?)
        // Consulta rápida no Supabase
        let { data: tenant, error: tenantError } = await supabase
            .from('tenants')
            .select('id')
            .eq('phone_number_id', phoneNumberId)
            .single();

        if (tenantError || !tenant) {
            console.log(`[Webhook] Tenant não encontrado para PhoneID: ${phoneNumberId}. Criando auto-cadastro...`);

            const { data: newTenant, error: createError } = await supabase
                .from('tenants')
                .insert({
                    name: `Auto Tenant ${phoneNumberId}`,
                    slug: `auto-tenant-${phoneNumberId}`,
                    phone_number_id: phoneNumberId
                })
                .select('id')
                .single();

            if (createError || !newTenant) {
                console.error("❌ Falha ao criar Auto Tenant:", createError);
                return new NextResponse(JSON.stringify({ error: 'Tenant Creation Failed', details: createError }), { status: 200 });
            }

            // Usa o novo tenant
            tenant = newTenant;
        }

        // 3. Ingestão Idempotente (Tenta salvar evento)
        // Se já existir (conflito no meta_message_id), o banco rejeita e nós ignoramos
        const { data: event, error: insertError } = await supabase
            .from('webhook_events')
            .insert({
                tenant_id: tenant.id,
                meta_message_id: metaMessageId,
                payload: payload,
                status: 'pending'
            })
            .select()
            .single();

        if (insertError) {
            if (insertError.code === '23505') { // Unique Violation
                console.warn(`[Webhook] Evento duplicado ignorado: ${metaMessageId}`);
                return new NextResponse('Duplicate Event', { status: 200 });
            }
            throw insertError;
        }

        // 4. Enfileiramento (Async Job)
        // Coloca na fila para o Worker processar
        const { error: queueError } = await supabase
            .from('message_queue')
            .insert({
                webhook_event_id: event.id,
                tenant_id: tenant.id,
                conversation_id: null, // Será preenchido pelo worker na análise do payload
                status: 'queued'
            });

        if (queueError) {
            console.error("Erro ao enfileirar job:", queueError);
            // Aqui poderíamos retornar 500 para a Meta tentar de novo, 
            // mas como já salvamos no webhook_events, melhor não duplicar.
            // Monitoramento deve pegar isso.
        }

        // 5. Ack Imediato (< 200ms)
        return new NextResponse('Event Queued', { status: 200 });

    } catch (error: any) {
        console.error('🔥 [CRITICAL WEBHOOK ERROR] 🔥');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        if (error.cause) console.error('Cause:', error.cause);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
