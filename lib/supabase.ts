// ============================================
// LX SUPABASE CLIENT v1.0
// ============================================
// Cliente Supabase para persistência de leads, sessões e relatórios

import { createClient } from '@supabase/supabase-js';

// ============================================
// SUPABASE CLIENT
// ============================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ============================================
// TIPOS DO DATABASE
// ============================================
export interface DBLead {
    id?: string;
    external_id?: string;
    name?: string;
    phone?: string;
    company?: string;
    niche: string;
    goal?: string;
    channel?: string;
    volume_estimate?: string;
    pain?: string;
    rules?: string;
    quality_score?: number;
    created_at?: string;
    updated_at?: string;
}

export interface DBConversation {
    id?: string;
    lead_id?: string;
    session_id: string;
    status: 'active' | 'completed' | 'abandoned';
    started_at?: string;
    ended_at?: string;
    total_messages?: number;
    outcome?: 'converted' | 'not_converted' | 'handoff';
    conversion_score?: number;
    context_snapshot?: Record<string, unknown>;
}

export interface DBMessage {
    id?: string;
    conversation_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    confidence_score?: number;
    response_time_ms?: number;
    was_fallback?: boolean;
    intent_detected?: string;
    created_at?: string;
}

export interface DBReport {
    id: string;
    conversation_id: string;
    lead_id?: string;
    score_fit: number;
    qualification_level: string;
    recommended_package: string;
    report_data: Record<string, unknown>;
    created_at?: string;
}

export interface DBEvent {
    id?: string;
    session_id: string;
    event_type: string;
    event_data?: Record<string, unknown>;
    created_at?: string;
}

// ============================================
// LEAD OPERATIONS
// ============================================
export async function createLead(lead: DBLead): Promise<DBLead | null> {
    if (!supabase) {
        console.log('[Supabase] Not configured, skipping createLead');
        return { ...lead, id: `local_${Date.now()}` };
    }

    const { data, error } = await supabase
        .from('leads')
        .insert(lead)
        .select()
        .single();

    if (error) {
        console.error('[Supabase] createLead error:', error);
        return null;
    }

    return data;
}

export async function updateLead(id: string, updates: Partial<DBLead>): Promise<DBLead | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('leads')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('[Supabase] updateLead error:', error);
        return null;
    }

    return data;
}

export async function getLeadByExternalId(externalId: string): Promise<DBLead | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('leads')
        .select()
        .eq('external_id', externalId)
        .single();

    if (error) return null;
    return data;
}

// ============================================
// CONVERSATION OPERATIONS
// ============================================
export async function createConversation(conversation: DBConversation): Promise<DBConversation | null> {
    if (!supabase) {
        console.log('[Supabase] Not configured, skipping createConversation');
        return { ...conversation, id: `local_${Date.now()}` };
    }

    const { data, error } = await supabase
        .from('conversations')
        .insert(conversation)
        .select()
        .single();

    if (error) {
        console.error('[Supabase] createConversation error:', error);
        return null;
    }

    return data;
}

export async function updateConversation(
    sessionId: string,
    updates: Partial<DBConversation>
): Promise<DBConversation | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('session_id', sessionId)
        .select()
        .single();

    if (error) {
        console.error('[Supabase] updateConversation error:', error);
        return null;
    }

    return data;
}

export async function getConversationBySessionId(sessionId: string): Promise<DBConversation | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('conversations')
        .select()
        .eq('session_id', sessionId)
        .single();

    if (error) return null;
    return data;
}

// ============================================
// MESSAGE OPERATIONS
// ============================================
export async function saveMessage(message: DBMessage): Promise<DBMessage | null> {
    if (!supabase) {
        console.log('[Supabase] Not configured, skipping saveMessage');
        return { ...message, id: `local_${Date.now()}` };
    }

    const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();

    if (error) {
        console.error('[Supabase] saveMessage error:', error);
        return null;
    }

    return data;
}

export async function getMessagesByConversation(conversationId: string): Promise<DBMessage[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('messages')
        .select()
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('[Supabase] getMessagesByConversation error:', error);
        return [];
    }

    return data || [];
}

// ============================================
// REPORT OPERATIONS
// ============================================
export async function saveReport(report: DBReport): Promise<DBReport | null> {
    if (!supabase) {
        console.log('[Supabase] Not configured, skipping saveReport');
        return report;
    }

    // First check if reports table exists (it may not be in original schema)
    const { data, error } = await supabase
        .from('reports')
        .insert(report)
        .select()
        .single();

    if (error) {
        // Table might not exist, just log
        console.log('[Supabase] saveReport: reports table may not exist');
        return report;
    }

    return data;
}

export async function getReportById(id: string): Promise<DBReport | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('reports')
        .select()
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

// ============================================
// EVENT TRACKING
// ============================================
export async function trackEvent(event: DBEvent): Promise<void> {
    if (!supabase) {
        console.log('[Supabase] Not configured, skipping trackEvent:', event.event_type);
        return;
    }

    // Try to insert into events table if it exists
    const { error } = await supabase
        .from('events')
        .insert(event);

    if (error) {
        // Table might not exist, just log
        console.log('[Supabase] trackEvent: events table may not exist');
    }
}

// ============================================
// ANALYTICS
// ============================================
export async function getDashboardSummary(): Promise<{
    total_conversations: number;
    total_leads: number;
    avg_conversion_score: number;
    total_converted: number;
} | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('dashboard_summary')
        .select()
        .single();

    if (error) {
        console.error('[Supabase] getDashboardSummary error:', error);
        return null;
    }

    return data;
}

export async function getRecentConversations(limit: number = 10): Promise<DBConversation[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('conversations')
        .select(`
      *,
      leads (id, niche, goal, company)
    `)
        .order('started_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('[Supabase] getRecentConversations error:', error);
        return [];
    }

    return data || [];
}

// ============================================
// BATCH OPERATIONS
// ============================================
export async function saveConversationWithMessages(
    sessionId: string,
    leadData: DBLead,
    messages: Omit<DBMessage, 'conversation_id'>[],
    outcome?: 'converted' | 'not_converted' | 'handoff',
    scoreFit?: number
): Promise<void> {
    if (!supabase) {
        console.log('[Supabase] Not configured, skipping batch save');
        return;
    }

    try {
        // 1. Upsert lead
        const { data: lead } = await supabase
            .from('leads')
            .upsert(leadData, { onConflict: 'external_id' })
            .select()
            .single();

        // 2. Upsert conversation
        const { data: conversation } = await supabase
            .from('conversations')
            .upsert({
                session_id: sessionId,
                lead_id: lead?.id,
                status: outcome ? 'completed' : 'active',
                outcome,
                conversion_score: scoreFit,
                total_messages: messages.length,
                ended_at: outcome ? new Date().toISOString() : undefined,
            }, { onConflict: 'session_id' })
            .select()
            .single();

        // 3. Insert messages
        if (conversation?.id && messages.length > 0) {
            await supabase
                .from('messages')
                .insert(
                    messages.map(m => ({
                        ...m,
                        conversation_id: conversation.id,
                    }))
                );
        }

        console.log('[Supabase] Batch save completed for session:', sessionId);
    } catch (error) {
        console.error('[Supabase] Batch save error:', error);
    }
}

// ============================================
// HEALTH CHECK
// ============================================
export async function checkSupabaseConnection(): Promise<boolean> {
    if (!supabase) return false;

    try {
        const { error } = await supabase.from('leads').select('id').limit(1);
        return !error;
    } catch {
        return false;
    }
}
