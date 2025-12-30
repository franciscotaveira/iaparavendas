/**
 * URE Tracking & Analytics
 * Mede efetividade do rapport
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// ============================================
// LOGGING FUNCTIONS
// ============================================

export async function logDetectedEntity(data: {
    sessionId: string;
    entityType: string;
    entityValue: string;
    confidence: number;
    originalText?: string;
}): Promise<void> {
    if (!supabase) return;
    try {
        await supabase.from('ure_detected_entities').insert({
            session_id: data.sessionId,
            entity_type: data.entityType,
            entity_value: data.entityValue,
            confidence: data.confidence,
            original_text: data.originalText,
            detected_at: new Date().toISOString()
        });
    } catch (e) { console.warn('[URE] Log entity failed:', e); }
}

export async function logRapportUsage(data: {
    sessionId: string;
    knowledgeType: string;
    knowledgeId: string;
    contentUsed: string;
}): Promise<void> {
    if (!supabase) return;
    try {
        await supabase.from('ure_rapport_usage').insert({
            session_id: data.sessionId,
            knowledge_type: data.knowledgeType,
            knowledge_id: data.knowledgeId,
            content_used: data.contentUsed,
            used_at: new Date().toISOString()
        });
    } catch (e) { console.warn('[URE] Log usage failed:', e); }
}

// ============================================
// REACTION DETECTION
// ============================================

export function detectReaction(response: string): 'positive' | 'neutral' | 'negative' | 'surprised' {
    const lower = response.toLowerCase();

    // Surpresa
    if (/como (voc[eê]|vc) sab|nossa|caramba|uau|😱|🤯/.test(lower)) return 'surprised';

    // Positivo
    if (/sim|isso|exato|legal|bacana|massa|❤️|👍|😊/.test(lower)) return 'positive';

    // Negativo
    if (/n[aã]o|errado|nunca|😒|👎/.test(lower)) return 'negative';

    return 'neutral';
}

export function detectContinuation(response: string): boolean {
    if (response.length < 10) return false;
    if (response.includes('?')) return true;
    if (response.length > 50) return true;
    if (/moro|trabalho|sou|minha|meu/.test(response)) return true;
    return false;
}
