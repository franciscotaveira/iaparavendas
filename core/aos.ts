// ============================================
// Lx Humanized Agent Engine - Adaptive Opener System v1.0
// ============================================

import { SessionState, Opener, AgentContext } from './types';
import openers from '../data/openers.json';

const OPENER_COOLDOWN_DAYS = 14;

export function getOpener(context: AgentContext): string {
    const { session, channel } = context;

    // 1. Determinar tipo de interação
    const interactionType = getInteractionType(session);

    // 2. Filtrar openers válidos
    const validOpeners = filterOpeners(openers as Opener[], interactionType, channel, session);

    // 3. Se não há openers válidos, gerar dinamicamente
    if (validOpeners.length === 0) {
        return generateDynamicOpener(interactionType, session);
    }

    // 4. Selecionar opener com peso
    const selected = selectWeightedOpener(validOpeners);

    // 5. Marcar como usado (será persistido pela camada de sessão)
    session.last_opener_id = selected.id;
    session.last_opener_date = new Date().toISOString();

    // 6. Personalizar se tiver nome
    return personalizeOpener(selected.text, session);
}

function getInteractionType(session: SessionState): 'first' | 'returning_recent' | 'returning_long' {
    if (session.first_interaction) {
        return 'first';
    }

    if (session.days_since_last <= 7) {
        return 'returning_recent';
    }

    return 'returning_long';
}

function filterOpeners(
    allOpeners: Opener[],
    interactionType: 'first' | 'returning_recent' | 'returning_long',
    channel: 'whatsapp' | 'site',
    session: SessionState
): Opener[] {
    return allOpeners.filter(opener => {
        // Verificar contexto de interação
        if (interactionType === 'first' && opener.context.first_interaction === false) return false;
        if (interactionType === 'returning_recent' && opener.context.returning_recent === false) return false;
        if (interactionType === 'returning_long' && opener.context.returning_long === false) return false;

        // Verificar canal
        if (opener.context.channel && opener.context.channel !== 'any' && opener.context.channel !== channel) {
            return false;
        }

        // Verificar cooldown (não repetir em 14 dias)
        if (opener.id === session.last_opener_id) {
            const daysSinceUsed = session.last_opener_date
                ? Math.floor((Date.now() - new Date(session.last_opener_date).getTime()) / (1000 * 60 * 60 * 24))
                : Infinity;

            if (daysSinceUsed < OPENER_COOLDOWN_DAYS) {
                return false;
            }
        }

        return true;
    });
}

function selectWeightedOpener(openers: Opener[]): Opener {
    // Soma total dos pesos
    const totalWeight = openers.reduce((sum, o) => sum + o.weight, 0);

    // Número aleatório entre 0 e totalWeight
    let random = Math.random() * totalWeight;

    // Selecionar baseado no peso
    for (const opener of openers) {
        random -= opener.weight;
        if (random <= 0) {
            return opener;
        }
    }

    // Fallback
    return openers[0];
}

function generateDynamicOpener(
    interactionType: 'first' | 'returning_recent' | 'returning_long',
    session: SessionState
): string {
    const name = session.lead_name ? `, ${session.lead_name}` : '';

    const templates = {
        first: [
            `Olá${name}! Em que posso te ajudar hoje?`,
            `Oi${name}! Como posso te ajudar?`,
            `E aí${name}! Tudo bem? O que te traz aqui?`,
        ],
        returning_recent: [
            `Oi${name}! Bom te ver de novo. Como posso ajudar?`,
            `Olá${name}! Que bom que voltou. Em que posso ajudar?`,
            `E aí${name}! Tudo certo? No que posso te ajudar agora?`,
        ],
        returning_long: [
            `Olá${name}! Faz um tempo que não nos falamos. Como posso ajudar?`,
            `Oi${name}! Bom te ver por aqui de novo. Em que posso ajudar hoje?`,
            `E aí${name}! Quanto tempo! O que te traz de volta?`,
        ]
    };

    const options = templates[interactionType];
    return options[Math.floor(Math.random() * options.length)];
}

function personalizeOpener(text: string, session: SessionState): string {
    if (session.lead_name) {
        // Evitar dupla personalização se já tem nome no template
        if (!text.includes(session.lead_name)) {
            text = text.replace('Olá!', `Olá, ${session.lead_name}!`);
            text = text.replace('Oi!', `Oi, ${session.lead_name}!`);
        }
    }
    return text;
}
