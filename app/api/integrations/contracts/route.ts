import { NextResponse } from 'next/server';

// ============================================
// INTEGRAÇÃO CONTRATOS DIGITAIS
// ============================================
// Endpoint para gerar contratos via Clicksign ou Autentique.
// Escolha a plataforma que preferir e configure a API Key.

const CONTRACT_API_KEY = process.env.CONTRACT_API_KEY; // Clicksign ou Autentique
const CONTRACT_PROVIDER = process.env.CONTRACT_PROVIDER || 'autentique'; // 'clicksign' ou 'autentique'

interface CreateContractPayload {
    template_id?: string; // ID do template de contrato
    client_name: string;
    client_email: string;
    client_document: string; // CPF ou CNPJ
    contract_value: number;
    custom_fields?: Record<string, string>;
}

export async function POST(req: Request) {
    try {
        if (!CONTRACT_API_KEY) {
            return NextResponse.json({
                error: 'API Key de contratos não configurada.',
                hint: 'Configure CONTRACT_API_KEY e CONTRACT_PROVIDER no .env'
            }, { status: 500 });
        }

        const body: CreateContractPayload = await req.json();

        // Validação
        if (!body.client_name || !body.client_email || !body.client_document) {
            return NextResponse.json({
                error: 'Campos obrigatórios: client_name, client_email, client_document'
            }, { status: 400 });
        }

        // Simular criação de contrato (placeholder para integração real)
        // Em produção, chamar a API da Clicksign ou Autentique aqui.

        console.log(`[CONTRACTS] Gerando contrato para: ${body.client_name}`);

        // Mock Response
        const mockContractId = `ctr_${Date.now()}`;
        const mockSignUrl = `https://app.autentique.com.br/sign/${mockContractId}`;

        // TODO: Implementar chamada real para Autentique/Clicksign
        /*
        const response = await fetch('https://api.autentique.com.br/v2/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONTRACT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `mutation { createDocument(...) { id } }`
            })
        });
        */

        return NextResponse.json({
            success: true,
            contract_id: mockContractId,
            sign_url: mockSignUrl,
            status: 'PENDING_SIGNATURE',
            message: `Contrato gerado. Envie o link para ${body.client_email} assinar.`
        });

    } catch (error: any) {
        console.error('[CONTRACTS] Erro:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Webhook para receber confirmação de assinatura
export async function PUT(req: Request) {
    try {
        const webhook = await req.json();

        console.log('[CONTRACTS WEBHOOK] Evento:', webhook.event || webhook.type);

        // Eventos comuns:
        // document.signed - Documento assinado
        // document.rejected - Documento rejeitado

        if (webhook.event === 'document.signed' || webhook.type === 'SIGNED') {
            const contractId = webhook.document?.id || webhook.contract_id;

            // TODO: Atualizar status no Supabase
            // TODO: Disparar workflow de cobrança (Asaas)
            // TODO: Notificar CEO via Telegram

            console.log(`[CONTRACTS] Contrato ${contractId} ASSINADO!`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('[CONTRACTS WEBHOOK] Erro:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
