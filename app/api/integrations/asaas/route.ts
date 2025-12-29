import { NextResponse } from 'next/server';

// ============================================
// INTEGRAÇÃO ASAAS (PAGAMENTOS)
// ============================================
// Endpoint para gerar cobranças via Asaas API.
// Docs: https://docs.asaas.com/reference/criar-nova-cobranca

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_BASE_URL = process.env.ASAAS_SANDBOX === 'true'
    ? 'https://sandbox.asaas.com/api/v3'
    : 'https://www.asaas.com/api/v3';

interface CreateChargePayload {
    customer: string; // ID do cliente no Asaas ou criar um novo
    billingType: 'BOLETO' | 'PIX' | 'CREDIT_CARD';
    value: number;
    dueDate: string; // YYYY-MM-DD
    description: string;
}

// POST: Criar uma nova cobrança
export async function POST(req: Request) {
    try {
        if (!ASAAS_API_KEY) {
            return NextResponse.json({
                error: 'Asaas API Key não configurada. Adicione ASAAS_API_KEY no .env'
            }, { status: 500 });
        }

        const body: CreateChargePayload = await req.json();

        // Validação básica
        if (!body.customer || !body.value || !body.billingType) {
            return NextResponse.json({
                error: 'Campos obrigatórios: customer, value, billingType'
            }, { status: 400 });
        }

        // Criar cobrança no Asaas
        const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access_token': ASAAS_API_KEY
            },
            body: JSON.stringify({
                customer: body.customer,
                billingType: body.billingType,
                value: body.value,
                dueDate: body.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias
                description: body.description || 'Cobrança gerada por LX Agents'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[ASAAS] Erro ao criar cobrança:', data);
            return NextResponse.json({ error: 'Falha ao criar cobrança', details: data }, { status: 500 });
        }

        console.log('[ASAAS] Cobrança criada:', data.id);

        return NextResponse.json({
            success: true,
            payment_id: data.id,
            invoice_url: data.invoiceUrl,
            pix_qrcode: data.pixQrCodeUrl || null,
            boleto_url: data.bankSlipUrl || null,
            status: data.status
        });

    } catch (error: any) {
        console.error('[ASAAS] Erro:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Webhook Handler (para receber confirmações de pagamento)
// O Asaas envia para este endpoint quando o status muda
export async function PUT(req: Request) {
    try {
        const webhook = await req.json();

        console.log('[ASAAS WEBHOOK] Evento recebido:', webhook.event);

        // Eventos importantes:
        // PAYMENT_RECEIVED - Pagamento confirmado
        // PAYMENT_OVERDUE - Pagamento atrasado
        // PAYMENT_CONFIRMED - Confirmação de PIX

        if (webhook.event === 'PAYMENT_RECEIVED' || webhook.event === 'PAYMENT_CONFIRMED') {
            const paymentId = webhook.payment?.id;
            const customerEmail = webhook.payment?.customer;

            // TODO: Atualizar status no Supabase
            // TODO: Disparar notificação para o CEO via Telegram
            // TODO: Iniciar workflow de produção

            console.log(`[ASAAS] Pagamento ${paymentId} CONFIRMADO!`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('[ASAAS WEBHOOK] Erro:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
