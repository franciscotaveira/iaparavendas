import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ============================================
// API: MÉTRICAS EM TEMPO REAL
// ============================================
// Endpoint para o dashboard buscar métricas

export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({
                success: false,
                error: 'Supabase não configurado'
            });
        }

        // Total de conversas
        const { count: totalConversations } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true });

        // Total de mensagens
        const { count: totalMessages } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true });

        // Total de leads
        const { count: totalLeads } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true });

        // Conversas por plataforma
        const { data: byPlatform } = await supabase
            .from('conversations')
            .select('platform')
            .not('platform', 'is', null);

        const platformCounts: Record<string, number> = {};
        byPlatform?.forEach(c => {
            const p = c.platform || 'web';
            platformCounts[p] = (platformCounts[p] || 0) + 1;
        });

        // Últimas 5 conversas
        const { data: recentConversations } = await supabase
            .from('conversations')
            .select('session_id, platform, status, created_at, message_count')
            .order('created_at', { ascending: false })
            .limit(5);

        // Mensagens das últimas 24h
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count: messagesLast24h } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', yesterday);

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            metrics: {
                total_conversations: totalConversations || 0,
                total_messages: totalMessages || 0,
                total_leads: totalLeads || 0,
                messages_last_24h: messagesLast24h || 0,
                by_platform: platformCounts,
            },
            recent_conversations: recentConversations || [],
        });

    } catch (error) {
        console.error('[METRICS API] Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Erro ao buscar métricas'
        }, { status: 500 });
    }
}
