// ============================================
// LX CORPORATE MEMORY
// ============================================
// Interface para o Cérebro de Longo Prazo (Supabase)
// Permite que agentes lembrem de leads e leiam documentos
// ============================================

import { createClient } from '@supabase/supabase-js';
import { AgentRole } from '../agents';

// Configuração (será lida do .env)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role para backend

const hasSupabase = !!(SUPABASE_URL && SUPABASE_KEY);

const supabase = hasSupabase
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

// ============================================
// TYPES
// ============================================
export interface CorporateMemory {
    lead_context?: {
        name: string;
        company: string;
        history_summary: string;
    };
    relevant_knowledge: string[];
}

// ============================================
// ACTIONS
// ============================================

// 1. Lembrar de um Lead (Get Context)
export async function recallLeadContext(leadIdentifier: string): Promise<CorporateMemory['lead_context'] | null> {
    if (!supabase) return null;

    try {
        // Tenta buscar por email ou telefone
        const { data, error } = await supabase
            .from('leads')
            .select('name, company_name, metadata')
            .or(`email.eq.${leadIdentifier},phone.eq.${leadIdentifier}`)
            .single();

        if (error || !data) return null;

        return {
            name: data.name,
            company: data.company_name,
            history_summary: data.metadata?.summary || 'Cliente recorrente.'
        };
    } catch (e) {
        console.error('[Memory] Erro ao buscar lead:', e);
        return null;
    }
}

// 2. Salvar Fato Importante (Update Memory)
export async function saveImportantFact(
    leadIdentifier: string,
    fact: string
): Promise<void> {
    if (!supabase) {
        console.log(`[Memory-Mock] Fato salvo sobre ${leadIdentifier}: "${fact}"`);
        return;
    }

    // Em produção: Atualizaria o campo de metadata/resumo do lead
    console.log(`[Memory] Salvando fato para ${leadIdentifier}: ${fact}`);
}

// 3. Buscar Conhecimento da Empresa (RAG Search)
export async function queryCorporateKnowledge(
    query: string,
    limit: number = 3
): Promise<string[]> {
    if (!supabase) {
        // Fallback para o knowledge base estático que criamos antes
        const { searchKnowledge } = require('../knowledge/base');
        const results = searchKnowledge(query);
        return results.map((r: any) => `[${r.category}] ${r.content}`).slice(0, limit);
    }

    try {
        // Gerar embedding da query (precisa de API da OpenAI)
        // const embedding = await openai.embeddings.create({ input: query, model: 'text-embedding-3-small' });

        // Chamar a função RPC do Supabase
        // const { data } = await supabase.rpc('match_knowledge', { 
        //    query_embedding: embedding.data[0].embedding, 
        //    match_threshold: 0.7, 
        //    match_count: limit 
        // });

        // return data.map(d => d.content);
        return [];
    } catch (e) {
        console.error('[Memory] Erro no RAG:', e);
        return [];
    }
}

// 4. Registrar Sessão
export async function logInteraction(
    sessionId: string,
    role: 'user' | 'agent',
    content: string,
    agentRole?: AgentRole
): Promise<void> {
    if (!supabase) return;

    await supabase.from('messages').insert({
        session_id: sessionId,
        role,
        agent_role: agentRole,
        content
    });
}
