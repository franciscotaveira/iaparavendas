/**
 * URE Auto-Enrichment Service
 * Enriquece automaticamente cidades/profissões usando LLM
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function callClaude(prompt: string): Promise<string | null> {
    if (!ANTHROPIC_API_KEY) return null;
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                max_tokens: 1000,
                messages: [{ role: 'user', content: prompt }]
            })
        });
        const data = await response.json();
        return data.content?.[0]?.text || null;
    } catch (e) {
        console.error('[Claude API]', e);
        return null;
    }
}

// ============================================
// CITY ENRICHMENT
// ============================================

export async function enrichCity(city: string, state: string): Promise<number> {
    if (!supabase) return 0;

    const prompt = `Analise a cidade "${city}" (${state}, Brasil) e extraia conhecimento útil para CRIAR RAPPORT em conversas comerciais.

Gere no máximo 4 itens nas categorias:
- nickname: Apelidos da cidade
- landmark: Pontos turísticos conhecidos  
- culture: Festas, comidas, tradições
- pride: Orgulho local

Para cada item, forneça JSON:
{
  "items": [
    {
      "knowledge_type": "nickname",
      "content": "máximo 20 palavras",
      "conversation_hooks": ["forma de introduzir"],
      "follow_up_questions": ["pergunta natural"],
      "emotional_weight": 0.8
    }
  ]
}

REGRAS:
- Apenas fatos VERIFICÁVEIS
- Preferir orgulho local
- Evitar informações negativas`;

    try {
        const text = await callClaude(prompt);
        if (!text) return 0;

        const match = text.match(/\{[\s\S]*\}/);
        if (!match) return 0;

        const data = JSON.parse(match[0]);
        let saved = 0;

        for (const item of data.items || []) {
            const { error } = await supabase.from('geo_knowledge').insert({
                city,
                state,
                knowledge_type: item.knowledge_type,
                content: item.content,
                conversation_hooks: JSON.stringify(item.conversation_hooks || []),
                follow_up_questions: JSON.stringify(item.follow_up_questions || []),
                emotional_weight: item.emotional_weight || 0.5
            });
            if (!error) saved++;
        }

        return saved;
    } catch (e) {
        console.error('[URE Enrichment] City failed:', e);
        return 0;
    }
}

// ============================================
// PROFESSION ENRICHMENT
// ============================================

export async function enrichProfession(profession: string): Promise<number> {
    if (!supabase) return 0;

    const prompt = `Analise a profissão "${profession}" e extraia conhecimento útil para CRIAR RAPPORT.

Gere no máximo 3 itens nas categorias:
- daily_challenge: Desafios do dia-a-dia
- pain_point: Dores conhecidas
- jargon: Termos que só quem é da área conhece

Para cada item, forneça JSON:
{
  "items": [
    {
      "knowledge_type": "daily_challenge",
      "content": "máximo 15 palavras",
      "conversation_hooks": ["forma de introduzir"],
      "follow_up_questions": ["pergunta natural"],
      "emotional_weight": 0.8
    }
  ]
}

REGRAS:
- Ser GENUÍNO (profissionais detectam genericidade)
- Focar em CONEXÃO`;

    try {
        const text = await callClaude(prompt);
        if (!text) return 0;

        const match = text.match(/\{[\s\S]*\}/);
        if (!match) return 0;

        const data = JSON.parse(match[0]);
        let saved = 0;

        for (const item of data.items || []) {
            const { error } = await supabase.from('professional_knowledge').insert({
                profession,
                knowledge_type: item.knowledge_type,
                content: item.content,
                conversation_hooks: JSON.stringify(item.conversation_hooks || []),
                follow_up_questions: JSON.stringify(item.follow_up_questions || []),
                emotional_weight: item.emotional_weight || 0.5
            });
            if (!error) saved++;
        }

        return saved;
    } catch (e) {
        console.error('[URE Enrichment] Profession failed:', e);
        return 0;
    }
}

// ============================================
// AUTO-ENRICH UNKNOWN ENTITIES
// ============================================

export async function autoEnrichUnknown(
    entityType: 'city' | 'profession',
    value: string,
    state?: string
): Promise<boolean> {
    if (entityType === 'city' && state) {
        const count = await enrichCity(value, state);
        return count > 0;
    }

    if (entityType === 'profession') {
        const count = await enrichProfession(value);
        return count > 0;
    }

    return false;
}
