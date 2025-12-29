// ============================================
// Lx Humanized Agent Engine - Payload Schemas v1.0
// ============================================

import { ManyChatInbound, ManyChatOutbound } from '@/core/types';

// Schema de validação do payload ManyChat (inbound)
export function validateInbound(body: any): ManyChatInbound | null {
    // Campos obrigatórios
    if (!body.subscriber_id || typeof body.subscriber_id !== 'string') {
        console.error('Missing or invalid subscriber_id');
        return null;
    }

    if (!body.text || typeof body.text !== 'string') {
        console.error('Missing or invalid text');
        return null;
    }

    // Mensagem vazia ou só espaços
    if (body.text.trim().length === 0) {
        console.error('Empty message');
        return null;
    }

    // Construir objeto validado
    const inbound: ManyChatInbound = {
        subscriber_id: body.subscriber_id.trim(),
        text: body.text.trim(),
        custom_fields: {
            session_id: body.custom_fields?.session_id || undefined,
            lead_id: body.custom_fields?.lead_id || undefined,
            last_intent: body.custom_fields?.last_intent || undefined,
            risk_level: body.custom_fields?.risk_level || undefined,
        }
    };

    return inbound;
}

// Schema de validação do payload de saída (outbound)
export function validateOutbound(response: ManyChatOutbound): boolean {
    // Texto obrigatório
    if (!response.text || typeof response.text !== 'string') {
        return false;
    }

    // Actions deve ser array
    if (!Array.isArray(response.actions)) {
        return false;
    }

    // Validar cada action
    for (const action of response.actions) {
        if (!['add_tag', 'set_custom_field'].includes(action.type)) {
            return false;
        }
        if (!action.value || typeof action.value !== 'string') {
            return false;
        }
    }

    return true;
}

// JSON Schema para documentação
export const INBOUND_SCHEMA = {
    type: 'object',
    required: ['subscriber_id', 'text'],
    properties: {
        subscriber_id: {
            type: 'string',
            description: 'ID único do subscriber no ManyChat'
        },
        text: {
            type: 'string',
            description: 'Mensagem enviada pelo usuário'
        },
        custom_fields: {
            type: 'object',
            properties: {
                session_id: { type: 'string' },
                lead_id: { type: 'string' },
                last_intent: {
                    type: 'string',
                    enum: ['duvida', 'orcamento', 'agendamento', 'objecao', 'urgencia', 'outro']
                },
                risk_level: {
                    type: 'string',
                    enum: ['baixo', 'medio', 'alto']
                }
            }
        }
    }
};

export const OUTBOUND_SCHEMA = {
    type: 'object',
    required: ['text', 'actions'],
    properties: {
        text: {
            type: 'string',
            description: 'Resposta do agente'
        },
        actions: {
            type: 'array',
            items: {
                type: 'object',
                required: ['type', 'value'],
                properties: {
                    type: {
                        type: 'string',
                        enum: ['add_tag', 'set_custom_field']
                    },
                    value: { type: 'string' },
                    field_name: { type: 'string' }
                }
            }
        }
    }
};
