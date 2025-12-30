/**
 * EMOTIONAL TIMING ENGINE
 * Sistema de timing que comunica emoção
 */

import { EmotionalState } from './presence-core';

// ============================================
// TIMING RULES
// ============================================

export interface TimingResult {
    delayMs: number;
    typingIndicator: boolean;
    typingDuration: number;
    preResponse: string | null;
    pauseBetweenMessages: number;
}

const TIMING_RULES: Record<string, {
    baseDelay: number;
    typing: boolean;
    preResponse: string | null;
    variance: [number, number];
    description: string;
}> = {
    // Situações emocionais
    lead_compartilhou_algo_pesado: {
        baseDelay: 3500,
        typing: true,
        preResponse: null,  // Silêncio intencional
        variance: [1.1, 1.5],
        description: 'Pausa para absorver'
    },

    lead_fez_piada: {
        baseDelay: 600,
        typing: false,
        preResponse: 'kkk',
        variance: [0.6, 0.9],
        description: 'Rápido, mostra que pegou'
    },

    pergunta_complexa: {
        baseDelay: 2800,
        typing: true,
        preResponse: 'hmm, deixa eu pensar...',
        variance: [1.0, 1.3],
        description: 'Mostra que está pensando'
    },

    lead_irritado: {
        baseDelay: 1500,
        typing: true,
        preResponse: null,
        variance: [0.9, 1.1],
        description: 'Não muito rápido, não banaliza'
    },

    empolgacao_mutua: {
        baseDelay: 400,
        typing: false,
        preResponse: 'nossa!',
        variance: [0.5, 0.8],
        description: 'Energia alta'
    },

    momento_decisao: {
        baseDelay: 2200,
        typing: true,
        preResponse: null,
        variance: [1.0, 1.2],
        description: 'Dá tempo para processar'
    },

    primeiro_contato: {
        baseDelay: 1800,
        typing: true,
        preResponse: null,
        variance: [0.9, 1.2],
        description: 'Profissional mas acolhedor'
    },

    reconexao_apos_pausa: {
        baseDelay: 1200,
        typing: true,
        preResponse: 'Oi!',
        variance: [0.8, 1.1],
        description: 'Animado em rever'
    }
};

// ============================================
// SITUATION DETECTION
// ============================================

function detectSituation(
    message: string,
    emotion: EmotionalState,
    isFirstMessage: boolean,
    daysSinceLastContact: number
): string {
    const lower = message.toLowerCase();

    // Primeiro contato
    if (isFirstMessage) {
        return 'primeiro_contato';
    }

    // Reconexão após pausa
    if (daysSinceLastContact > 3) {
        return 'reconexao_apos_pausa';
    }

    // Lead irritado
    if (/chateado|irritado|pra que isso|deixa pra lá|esquece/.test(lower)) {
        return 'lead_irritado';
    }

    // Lead compartilhou algo pesado
    if (emotion === EmotionalState.VULNERABLE ||
        /difícil|complicado|triste|preocupado|problema sério/.test(lower)) {
        return 'lead_compartilhou_algo_pesado';
    }

    // Lead fez piada
    if (/kk+|haha|rs+|😂|🤣|piada/.test(lower)) {
        return 'lead_fez_piada';
    }

    // Empolgação mútua
    if (emotion === EmotionalState.EXCITED ||
        /maravilh|incrível|perfeito|amei|sensacional|🔥|🚀/.test(lower)) {
        return 'empolgacao_mutua';
    }

    // Pergunta complexa
    if (/como funciona|explica|pode detalhar|não entendi|qual a diferença/.test(lower)) {
        return 'pergunta_complexa';
    }

    // Momento de decisão
    if (/vou pensar|preciso avaliar|deixa ver|tenho que consultar/.test(lower)) {
        return 'momento_decisao';
    }

    return 'primeiro_contato';
}

// ============================================
// TIMING CALCULATOR
// ============================================

export function calculateEmotionalTiming(
    message: string,
    emotion: EmotionalState,
    options?: {
        isFirstMessage?: boolean;
        daysSinceLastContact?: number;
        messageLength?: number;
    }
): TimingResult {
    const situation = detectSituation(
        message,
        emotion,
        options?.isFirstMessage || false,
        options?.daysSinceLastContact || 0
    );

    const rule = TIMING_RULES[situation] || TIMING_RULES.primeiro_contato;

    // Tempo de leitura (humanos precisam ler)
    const messageLength = options?.messageLength || message.length;
    const readingTime = messageLength * 25; // ~25ms por caractere

    // Variação aleatória (humanos não são metrônomos)
    const [minVar, maxVar] = rule.variance;
    const variance = minVar + Math.random() * (maxVar - minVar);

    // Intensidade emocional
    const intensityFactor = [EmotionalState.VULNERABLE, EmotionalState.EXCITED].includes(emotion) ? 1.3 : 1.0;

    // Calcular delay final
    const baseWithReading = rule.baseDelay + readingTime;
    const finalDelay = Math.round(baseWithReading * variance * intensityFactor);

    // Duração do typing (proporcional ao delay)
    const typingDuration = rule.typing ? Math.round(finalDelay * 0.7) : 0;

    return {
        delayMs: finalDelay,
        typingIndicator: rule.typing,
        typingDuration,
        preResponse: rule.preResponse,
        pauseBetweenMessages: Math.round(finalDelay * 0.3)
    };
}

// ============================================
// PRE-RESPONSE SELECTOR
// ============================================

const PRE_RESPONSES = {
    thinking: ['hmm...', 'olha...', 'então...', 'deixa eu ver...', 'bom...'],
    laugh: ['kkk', 'rs', 'haha', '😄'],
    surprise: ['nossa!', 'uau!', 'caramba!', '😮'],
    empathy: ['entendo...', 'sei como é...', 'puxa...'],
    excitement: ['que legal!', 'show!', '🔥', 'massa!']
};

export function selectPreResponse(emotion: EmotionalState, context?: string): string | null {
    const lower = context?.toLowerCase() || '';

    // Piada
    if (/kk+|haha|rs+|😂/.test(lower)) {
        return PRE_RESPONSES.laugh[Math.floor(Math.random() * PRE_RESPONSES.laugh.length)];
    }

    // Surpresa
    if (/surpres|inesperado|não esperava|sério\?/.test(lower)) {
        return PRE_RESPONSES.surprise[Math.floor(Math.random() * PRE_RESPONSES.surprise.length)];
    }

    // Empatia (vulnerabilidade)
    if (emotion === EmotionalState.VULNERABLE) {
        return PRE_RESPONSES.empathy[Math.floor(Math.random() * PRE_RESPONSES.empathy.length)];
    }

    // Empolgação
    if (emotion === EmotionalState.EXCITED) {
        return PRE_RESPONSES.excitement[Math.floor(Math.random() * PRE_RESPONSES.excitement.length)];
    }

    // Pergunta complexa
    if (/como|qual|por que|explica/.test(lower)) {
        return PRE_RESPONSES.thinking[Math.floor(Math.random() * PRE_RESPONSES.thinking.length)];
    }

    return null;
}

// ============================================
// HUMAN IMPERFECTIONS
// ============================================

const IMPERFECTION_PATTERNS = {
    selfCorrection: {
        frequency: 0.05,
        templates: ['Na verdade, pensando melhor...', 'Ou melhor...', 'Deixa eu reformular...']
    },
    thinkingMarkers: {
        frequency: 0.12,
        markers: ['hm...', 'olha...', 'então...', 'tipo assim...', 'bom...']
    },
    memorySofteners: {
        frequency: 0.08,
        softeners: ['se não me engano', 'acho que', 'se bem me lembro', 'pelo que lembro']
    },
    genuineUncertainty: {
        frequency: 0.06,
        expressions: ['sinceramente não tenho certeza', 'pode ser que', 'talvez', 'não sei ao certo']
    }
};

export function applyHumanImperfection(
    response: string,
    emotion: EmotionalState
): string {
    // Não aplicar em contextos sérios
    if ([EmotionalState.VULNERABLE, EmotionalState.STRESSED].includes(emotion)) {
        return response;
    }

    const roll = Math.random();

    // Self-correction
    if (roll < IMPERFECTION_PATTERNS.selfCorrection.frequency) {
        const template = IMPERFECTION_PATTERNS.selfCorrection.templates[
            Math.floor(Math.random() * IMPERFECTION_PATTERNS.selfCorrection.templates.length)
        ];
        // Inserir no meio de uma frase longa
        if (response.length > 100) {
            const midPoint = response.indexOf('. ', 50);
            if (midPoint > 0) {
                return response.slice(0, midPoint + 2) + template + ' ' + response.slice(midPoint + 2);
            }
        }
    }

    // Thinking markers (início da resposta)
    if (roll < IMPERFECTION_PATTERNS.thinkingMarkers.frequency) {
        const marker = IMPERFECTION_PATTERNS.thinkingMarkers.markers[
            Math.floor(Math.random() * IMPERFECTION_PATTERNS.thinkingMarkers.markers.length)
        ];
        return marker + ' ' + response.charAt(0).toLowerCase() + response.slice(1);
    }

    // Memory softeners (quando menciona algo do passado)
    if (/você disse|você mencionou|última vez/.test(response.toLowerCase()) &&
        roll < IMPERFECTION_PATTERNS.memorySofteners.frequency) {
        const softener = IMPERFECTION_PATTERNS.memorySofteners.softeners[
            Math.floor(Math.random() * IMPERFECTION_PATTERNS.memorySofteners.softeners.length)
        ];
        return response.replace(/você disse|você mencionou/, `${softener}, você ${response.includes('disse') ? 'disse' : 'mencionou'}`);
    }

    return response;
}
