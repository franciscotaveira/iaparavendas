/**
 * LXC Memória Relacional
 * Lembra histórias compartilhadas, não só fatos
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// ============================================
// TYPES
// ============================================

export interface SharedMoment {
    id: string;
    sessionId: string;
    leadId?: string;
    momentType: 'humor' | 'vulnerability' | 'achievement' | 'struggle' | 'preference' | 'story';
    context: string;
    emotionalPeak: number;  // 0-1
    canReference: boolean;
    appropriateOpening?: string;
    followUpNeeded: boolean;
    createdAt: string;
}

export interface LeadMemory {
    leadId: string;
    name?: string;
    city?: string;
    profession?: string;
    sharedMoments: SharedMoment[];
    insideJokes: string[];
    storiesKnown: string[];
    preferences: {
        makesThemLaugh: string[];
        toAvoid: string[];
        communicationStyle: string;
    };
    lastInteraction: string;
    relationshipDepth: number;  // 0-10
}

// ============================================
// MOMENT DETECTION
// ============================================

const MOMENT_PATTERNS = {
    humor: [
        { pattern: /kk+|rs+|haha|😂|🤣|kkkkk/i, weight: 0.7 },
        { pattern: /piada|engraçado|rir|hilário/i, weight: 0.8 },
    ],
    vulnerability: [
        { pattern: /difícil|complicado|estou passando|não sei o que fazer/i, weight: 0.85 },
        { pattern: /preocupado|ansioso|medo|inseguro/i, weight: 0.9 },
        { pattern: /problema|crise|desafio pesado/i, weight: 0.8 },
    ],
    achievement: [
        { pattern: /consegui|ganhei|fechei|conquistei|passei/i, weight: 0.85 },
        { pattern: /orgulho|vitória|sucesso|realização/i, weight: 0.8 },
    ],
    struggle: [
        { pattern: /lutando|tentando|esforço|sacrifício/i, weight: 0.75 },
        { pattern: /não está fácil|tá difícil|complicado/i, weight: 0.7 },
    ],
    preference: [
        { pattern: /gosto de|prefiro|adoro|amo|curto/i, weight: 0.6 },
        { pattern: /não gosto|odeio|detesto|nem pensar/i, weight: 0.65 },
    ],
    story: [
        { pattern: /quando eu era|uma vez|aconteceu que|lembro quando/i, weight: 0.8 },
        { pattern: /minha história|meu caso|comigo foi/i, weight: 0.75 },
    ],
};

export function detectMomentType(message: string): { type: string; weight: number } | null {
    let bestMatch: { type: string; weight: number } | null = null;

    for (const [type, patterns] of Object.entries(MOMENT_PATTERNS)) {
        for (const { pattern, weight } of patterns) {
            if (pattern.test(message)) {
                if (!bestMatch || weight > bestMatch.weight) {
                    bestMatch = { type, weight };
                }
            }
        }
    }

    return bestMatch;
}

// ============================================
// MEMORY STORAGE
// ============================================

export async function saveSharedMoment(moment: Omit<SharedMoment, 'id' | 'createdAt'>): Promise<string | null> {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('lxc_shared_moments')
            .insert({
                session_id: moment.sessionId,
                lead_id: moment.leadId,
                moment_type: moment.momentType,
                context: moment.context,
                emotional_peak: moment.emotionalPeak,
                can_reference: moment.canReference,
                appropriate_opening: moment.appropriateOpening,
                follow_up_needed: moment.followUpNeeded,
            })
            .select('id')
            .single();

        if (error) throw error;
        return data?.id || null;
    } catch (e) {
        console.warn('[LXC Memory] Save moment failed:', e);
        return null;
    }
}

export async function getLeadMemory(leadId: string): Promise<LeadMemory | null> {
    if (!supabase) return null;

    try {
        // Buscar momentos compartilhados
        const { data: moments } = await supabase
            .from('lxc_shared_moments')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false })
            .limit(20);

        // Buscar dados do lead
        const { data: leadData } = await supabase
            .from('leads')
            .select('name, city, profession')
            .eq('id', leadId)
            .single();

        // Buscar preferências
        const { data: prefsData } = await supabase
            .from('lxc_lead_preferences')
            .select('*')
            .eq('lead_id', leadId)
            .single();

        const sharedMoments: SharedMoment[] = (moments || []).map(m => ({
            id: m.id,
            sessionId: m.session_id,
            leadId: m.lead_id,
            momentType: m.moment_type,
            context: m.context,
            emotionalPeak: m.emotional_peak,
            canReference: m.can_reference,
            appropriateOpening: m.appropriate_opening,
            followUpNeeded: m.follow_up_needed,
            createdAt: m.created_at,
        }));

        // Calcular profundidade do relacionamento
        const depth = calculateRelationshipDepth(sharedMoments);

        return {
            leadId,
            name: leadData?.name,
            city: leadData?.city,
            profession: leadData?.profession,
            sharedMoments,
            insideJokes: prefsData?.inside_jokes || [],
            storiesKnown: prefsData?.stories_known || [],
            preferences: {
                makesThemLaugh: prefsData?.makes_them_laugh || [],
                toAvoid: prefsData?.to_avoid || [],
                communicationStyle: prefsData?.communication_style || 'balanced',
            },
            lastInteraction: moments?.[0]?.created_at || '',
            relationshipDepth: depth,
        };
    } catch (e) {
        console.warn('[LXC Memory] Get memory failed:', e);
        return null;
    }
}

function calculateRelationshipDepth(moments: SharedMoment[]): number {
    if (moments.length === 0) return 0;

    let score = 0;

    // Pontos por quantidade de momentos
    score += Math.min(moments.length * 0.5, 3);

    // Pontos por tipos de momentos
    const types = new Set(moments.map(m => m.momentType));
    if (types.has('vulnerability')) score += 2;
    if (types.has('humor')) score += 1;
    if (types.has('achievement')) score += 1;
    if (types.has('story')) score += 1.5;

    // Pontos por pico emocional
    const maxPeak = Math.max(...moments.map(m => m.emotionalPeak));
    score += maxPeak * 2;

    return Math.min(score, 10);
}

// ============================================
// CONTEXTUAL OPENINGS
// ============================================

export function generateRelationalOpening(memory: LeadMemory): string | null {
    if (memory.relationshipDepth < 2) return null;

    // Priorizar follow-ups pendentes
    const pendingFollowUp = memory.sharedMoments.find(m => m.followUpNeeded && m.appropriateOpening);
    if (pendingFollowUp) {
        return pendingFollowUp.appropriateOpening!;
    }

    // Referenciar momento de vulnerabilidade (com cuidado)
    const vulnerability = memory.sharedMoments.find(m => m.momentType === 'vulnerability' && m.canReference);
    if (vulnerability && memory.relationshipDepth >= 5) {
        return vulnerability.appropriateOpening || `E aí, como estão as coisas? Da última vez você mencionou...`;
    }

    // Referenciar conquista
    const achievement = memory.sharedMoments.find(m => m.momentType === 'achievement');
    if (achievement) {
        return `Fala! Lembrei de você... como está aquele projeto que você tinha fechado?`;
    }

    // Referência leve
    if (memory.insideJokes.length > 0) {
        return `E aí! ${memory.insideJokes[0]}... como você está?`;
    }

    return null;
}

// ============================================
// MOMENT EXTRACTION FROM CONVERSATION
// ============================================

export function extractMomentFromMessage(
    message: string,
    sessionId: string,
    leadId?: string
): Omit<SharedMoment, 'id' | 'createdAt'> | null {
    const detected = detectMomentType(message);
    if (!detected || detected.weight < 0.7) return null;

    // Extrair contexto relevante (simplificado)
    const context = message.slice(0, 200);

    // Gerar abertura apropriada
    let appropriateOpening: string | undefined;
    let followUpNeeded = false;

    switch (detected.type) {
        case 'vulnerability':
            appropriateOpening = `Como você está? Da última vez você tinha mencionado algo desafiador...`;
            followUpNeeded = true;
            break;
        case 'achievement':
            appropriateOpening = `E aí, como está aquela conquista que você compartilhou?`;
            break;
        case 'struggle':
            appropriateOpening = `Lembrei de você... como está a situação que você mencionou?`;
            followUpNeeded = true;
            break;
    }

    return {
        sessionId,
        leadId,
        momentType: detected.type as SharedMoment['momentType'],
        context,
        emotionalPeak: detected.weight,
        canReference: detected.weight >= 0.8,
        appropriateOpening,
        followUpNeeded,
    };
}
