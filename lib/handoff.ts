// ============================================
// LX HANDOFF ENGINE v1.0
// ============================================
// Gerencia handoff para WhatsApp (ManyChat) e Calendly

import crypto from 'crypto';

// ============================================
// TIPOS
// ============================================
export interface HandoffPayload {
    lead: {
        id: string;
        name: string;
        phone: string;
        company?: string;
        segment: string;
    };
    session: {
        id: string;
        returning_user: boolean;
        entry_point: string;
        messages_count: number;
    };
    agent: {
        opening_line: string;
        intent: string;
        risk_mode: boolean;
        summary: string;
        cta: 'calendly' | 'whatsapp' | 'human';
    };
    report?: {
        url: string;
        score_fit: number;
    };
    signature: string;
    timestamp: string;
}

export interface ManyChatResponse {
    success: boolean;
    subscriber_id?: string;
    error?: string;
}

// ============================================
// CONFIGURAÇÃO
// ============================================
const CALENDLY_URL = process.env.CALENDLY_URL || 'https://calendly.com/lux-demo/15min';
const MANYCHAT_API_URL = process.env.MANYCHAT_API_URL || '';
const MANYCHAT_API_KEY = process.env.MANYCHAT_API_KEY || '';
const HMAC_SECRET = process.env.HMAC_SECRET || 'lx-demo-secret-key';

// ============================================
// ASSINATURA HMAC
// ============================================
export function signPayload(payload: Omit<HandoffPayload, 'signature'>): string {
    const data = JSON.stringify(payload);
    return crypto
        .createHmac('sha256', HMAC_SECRET)
        .update(data)
        .digest('hex');
}

export function verifySignature(payload: HandoffPayload): boolean {
    const { signature, ...rest } = payload;
    const expected = signPayload(rest as Omit<HandoffPayload, 'signature'>);
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
    );
}

// ============================================
// GERADOR DE PAYLOAD
// ============================================
export function createHandoffPayload(params: {
    leadId: string;
    leadName: string;
    leadPhone: string;
    leadCompany?: string;
    segment: string;
    sessionId: string;
    returningUser: boolean;
    entryPoint: string;
    messagesCount: number;
    openingLine: string;
    intent: string;
    riskMode: boolean;
    summary: string;
    cta: 'calendly' | 'whatsapp' | 'human';
    reportUrl?: string;
    scoreFit?: number;
}): HandoffPayload {
    const timestamp = new Date().toISOString();

    const payloadWithoutSignature = {
        lead: {
            id: params.leadId,
            name: params.leadName,
            phone: params.leadPhone,
            company: params.leadCompany,
            segment: params.segment,
        },
        session: {
            id: params.sessionId,
            returning_user: params.returningUser,
            entry_point: params.entryPoint,
            messages_count: params.messagesCount,
        },
        agent: {
            opening_line: params.openingLine,
            intent: params.intent,
            risk_mode: params.riskMode,
            summary: params.summary,
            cta: params.cta,
        },
        report: params.reportUrl ? {
            url: params.reportUrl,
            score_fit: params.scoreFit || 0,
        } : undefined,
        timestamp,
    };

    const signature = signPayload(payloadWithoutSignature as Omit<HandoffPayload, 'signature'>);

    return {
        ...payloadWithoutSignature,
        signature,
    } as HandoffPayload;
}

// ============================================
// CALENDLY URL BUILDER
// ============================================
export function buildCalendlyUrl(params: {
    sessionId: string;
    leadName?: string;
    leadEmail?: string;
    source?: string;
}): string {
    const url = new URL(CALENDLY_URL);

    // UTM params para tracking
    url.searchParams.set('utm_source', params.source || 'whatsapp');
    url.searchParams.set('utm_campaign', 'lx_handoff');
    url.searchParams.set('utm_content', params.sessionId);

    // Prefill info
    if (params.leadName) {
        url.searchParams.set('name', params.leadName);
    }
    if (params.leadEmail) {
        url.searchParams.set('email', params.leadEmail);
    }

    return url.toString();
}

// ============================================
// MANYCHAT DISPATCHER
// ============================================
export async function dispatchToManyChat(
    payload: HandoffPayload
): Promise<ManyChatResponse> {
    if (!MANYCHAT_API_URL || !MANYCHAT_API_KEY) {
        console.log('[Handoff] ManyChat não configurado, simulando sucesso');
        return {
            success: true,
            subscriber_id: `mock_${payload.lead.id}`,
        };
    }

    try {
        const response = await fetch(MANYCHAT_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MANYCHAT_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: payload.lead.phone,
                custom_fields: {
                    lx_session_id: payload.session.id,
                    lx_segment: payload.lead.segment,
                    lx_summary: payload.agent.summary,
                    lx_opening_line: payload.agent.opening_line,
                    lx_intent: payload.agent.intent,
                    lx_cta: payload.agent.cta,
                    lx_score_fit: payload.report?.score_fit || 0,
                },
                tags: [
                    'lx_lead',
                    `lx_segment_${payload.lead.segment}`,
                    payload.agent.risk_mode ? 'lx_risk_mode' : 'lx_normal_mode',
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`ManyChat API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            subscriber_id: data.subscriber_id,
        };
    } catch (error) {
        console.error('[Handoff] ManyChat dispatch failed:', error);
        return {
            success: false,
            error: String(error),
        };
    }
}

// ============================================
// WHATSAPP FALLBACK (link direto)
// ============================================
export function buildWhatsAppLink(params: {
    phone: string;
    message: string;
}): string {
    // Normalizar telefone para formato internacional
    let phone = params.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) {
        phone = '55' + phone.slice(1);
    } else if (!phone.startsWith('55')) {
        phone = '55' + phone;
    }

    const encodedMessage = encodeURIComponent(params.message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
}

// ============================================
// MENSAGENS DE HANDOFF
// ============================================
export const HANDOFF_MESSAGES = {
    calendly: (name: string, calendlyUrl: string) =>
        `${name}, para não perder tempo, agenda aqui: ${calendlyUrl}`,

    whatsapp_summary: (summary: string) =>
        `Vi seu contexto. ${summary}. Quer que eu vá direto ao ponto ou prefere um resumo rápido?`,

    human: (name: string) =>
        `${name}, vou te conectar com um especialista agora. Só um momento.`,

    risk_mode: (name: string) =>
        `${name}, essa questão precisa de um especialista qualificado. Vou te conectar agora.`,
};

// ============================================
// HANDOFF COMPLETO
// ============================================
export async function executeHandoff(params: {
    leadId: string;
    leadName: string;
    leadPhone: string;
    leadCompany?: string;
    segment: string;
    sessionId: string;
    returningUser: boolean;
    entryPoint: string;
    messagesCount: number;
    openingLine: string;
    intent: string;
    riskMode: boolean;
    summary: string;
    cta: 'calendly' | 'whatsapp' | 'human';
    reportUrl?: string;
    scoreFit?: number;
}): Promise<{
    success: boolean;
    channel: string;
    url?: string;
    message?: string;
    error?: string;
}> {
    // Criar payload
    const payload = createHandoffPayload(params);

    // Tentar ManyChat primeiro
    const manyChatResult = await dispatchToManyChat(payload);

    if (manyChatResult.success) {
        // ManyChat vai cuidar do resto
        return {
            success: true,
            channel: 'manychat',
            message: 'Te enviei uma mensagem no WhatsApp. Veja lá!',
        };
    }

    // Fallback: gerar link direto
    const calendlyUrl = buildCalendlyUrl({
        sessionId: params.sessionId,
        leadName: params.leadName,
        source: 'lx_demo',
    });

    switch (params.cta) {
        case 'calendly':
            return {
                success: true,
                channel: 'calendly',
                url: calendlyUrl,
                message: HANDOFF_MESSAGES.calendly(params.leadName || 'Olá', calendlyUrl),
            };

        case 'human':
            return {
                success: true,
                channel: 'human',
                message: params.riskMode
                    ? HANDOFF_MESSAGES.risk_mode(params.leadName || 'Olá')
                    : HANDOFF_MESSAGES.human(params.leadName || 'Olá'),
            };

        case 'whatsapp':
        default:
            const whatsappMessage = buildWhatsAppLink({
                phone: params.leadPhone || '',
                message: HANDOFF_MESSAGES.whatsapp_summary(params.summary),
            });
            return {
                success: true,
                channel: 'whatsapp',
                url: whatsappMessage,
                message: 'Acesse o WhatsApp para continuar.',
            };
    }
}
