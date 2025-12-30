// ============================================
// UNIVERSAL RAPPORT ENGINE (URE)
// Sistema de criação de rapport contextual
// ============================================

import { supabase } from '@/lib/supabase';

export interface DetectedEntity {
    type: 'city' | 'state' | 'profession' | 'age';
    value: string;
    confidence: number;
    originalText: string;
}

export interface RapportInsight {
    content: string;
    knowledgeType: string;
    emotionalWeight: number;
    conversationHook: string;
    followUpQuestion: string | null;
}

export interface RapportResult {
    opening: string;
    followUp: string;
    insightsUsed: RapportInsight[];
}

// Padrões de detecção
const LOCATION_PATTERNS = [
    /(?:sou|moro|estou|vim|venho)\s+(?:de|em|do|da)\s+([A-Za-zÀ-ÿ\s]+?)(?:\.|,|!|\?|$)/i,
    /aqui\s+(?:em|no|na)\s+([A-Za-zÀ-ÿ\s]+?)(?:\.|,|!|\?|$)/i,
    /([A-Za-zÀ-ÿ\s]+?)\s+(?:é|eh)\s+minha\s+cidade/i,
];

const PROFESSION_PATTERNS = [
    /(?:sou|trabalho\s+como)\s+([A-Za-zÀ-ÿ\s]+?)(?:\.|,|!|\?|$)/i,
    /(?:atuo|trabalho)\s+(?:na|no|com)\s+(?:área\s+de\s+)?([A-Za-zÀ-ÿ\s]+?)(?:\.|,|!|\?|$)/i,
];

// ============================================
// ENTITY DETECTOR
// ============================================

export async function detectEntities(message: string): Promise<DetectedEntity[]> {
    const entities: DetectedEntity[] = [];
    const messageLower = message.toLowerCase();

    // Detectar localização
    for (const pattern of LOCATION_PATTERNS) {
        const match = messageLower.match(pattern);
        if (match && match[1]) {
            const cityText = match[1].trim();
            // Filtrar palavras muito curtas ou comuns
            if (cityText.length > 3 && !['aqui', 'casa', 'hoje', 'agora'].includes(cityText)) {
                entities.push({
                    type: 'city',
                    value: cityText.charAt(0).toUpperCase() + cityText.slice(1),
                    confidence: 0.85,
                    originalText: match[0]
                });
                break;
            }
        }
    }

    // Detectar profissão
    for (const pattern of PROFESSION_PATTERNS) {
        const match = messageLower.match(pattern);
        if (match && match[1]) {
            const professionText = match[1].trim();
            if (professionText.length > 3) {
                entities.push({
                    type: 'profession',
                    value: professionText,
                    confidence: 0.8,
                    originalText: match[0]
                });
                break;
            }
        }
    }

    return entities;
}

// ============================================
// CONTEXT ENRICHER
// ============================================

export async function enrichContext(entities: DetectedEntity[]): Promise<RapportInsight[]> {
    if (!supabase || entities.length === 0) return [];

    const insights: RapportInsight[] = [];

    for (const entity of entities) {
        if (entity.type === 'city') {
            const { data } = await supabase
                .from('geo_knowledge')
                .select('*')
                .ilike('city', `%${entity.value}%`)
                .order('emotional_weight', { ascending: false })
                .limit(3);

            if (data) {
                for (const item of data) {
                    insights.push({
                        content: item.content,
                        knowledgeType: item.knowledge_type,
                        emotionalWeight: item.emotional_weight || 0.5,
                        conversationHook: item.conversation_hooks?.[0] || '',
                        followUpQuestion: item.follow_up_questions?.[0] || null
                    });
                }
            }
        }

        if (entity.type === 'profession') {
            const { data } = await supabase
                .from('professional_knowledge')
                .select('*')
                .ilike('profession', `%${entity.value}%`)
                .order('emotional_weight', { ascending: false })
                .limit(2);

            if (data) {
                for (const item of data) {
                    insights.push({
                        content: item.content,
                        knowledgeType: item.knowledge_type,
                        emotionalWeight: item.emotional_weight || 0.5,
                        conversationHook: item.conversation_hooks?.[0] || '',
                        followUpQuestion: item.follow_up_questions?.[0] || null
                    });
                }
            }
        }
    }

    // Ordenar por peso emocional
    insights.sort((a, b) => b.emotionalWeight - a.emotionalWeight);

    return insights;
}

// ============================================
// RAPPORT SELECTOR
// ============================================

export async function selectRapport(
    insights: RapportInsight[],
    turnCount: number = 0
): Promise<RapportResult | null> {
    if (insights.length === 0) return null;

    // Limitar insights baseado no turno
    const maxInsights = turnCount <= 1 ? 1 : 2;
    const selected = insights.slice(0, maxInsights);

    // Construir opening
    let opening = '';
    if (selected.length === 1) {
        const insight = selected[0];
        opening = `${insight.conversationHook}${insight.content}`;
    } else if (selected.length >= 2) {
        opening = `${selected[0].conversationHook}${selected[0].content}. ${selected[1].content}!`;
    }

    // Encontrar follow-up
    const followUp = selected.find(i => i.followUpQuestion)?.followUpQuestion || 'Como está por aí?';

    return {
        opening: opening.trim(),
        followUp,
        insightsUsed: selected
    };
}

// ============================================
// MAIN FUNCTION - Processar mensagem para rapport
// ============================================

export async function processForRapport(message: string, turnCount: number = 0): Promise<RapportResult | null> {
    try {
        // 1. Detectar entidades
        const entities = await detectEntities(message);
        if (entities.length === 0) return null;

        // 2. Enriquecer com contexto
        const insights = await enrichContext(entities);
        if (insights.length === 0) return null;

        // 3. Selecionar rapport apropriado
        const rapport = await selectRapport(insights, turnCount);

        return rapport;
    } catch (error) {
        console.error('[URE] Erro:', error);
        return null;
    }
}

// ============================================
// GOLDEN QUESTIONS - Perguntas de ouro
// ============================================

export interface GoldenQuestion {
    order: number;
    text: string;
    purpose: string;
    expectedEntity: string;
}

export async function getGoldenQuestions(): Promise<GoldenQuestion[]> {
    if (!supabase) {
        // Fallback hardcoded
        return [
            { order: 1, text: 'De onde você está falando? Qual cidade?', purpose: 'rapport', expectedEntity: 'city' },
            { order: 2, text: 'E qual é o seu negócio? O que você faz?', purpose: 'qualification', expectedEntity: 'profession' },
            { order: 3, text: 'Qual o seu maior desafio com vendas hoje?', purpose: 'pain', expectedEntity: 'pain_point' },
            { order: 4, text: 'Se você pudesse resolver isso essa semana, quanto isso valeria pra você?', purpose: 'urgency', expectedEntity: 'urgency_level' },
        ];
    }

    const { data } = await supabase
        .from('golden_questions')
        .select('*')
        .eq('active', true)
        .order('question_order', { ascending: true });

    return data?.map(q => ({
        order: q.question_order,
        text: q.question_text,
        purpose: q.question_purpose,
        expectedEntity: q.expected_entity
    })) || [];
}
