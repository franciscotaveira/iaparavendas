import { NextResponse } from 'next/server';
import { CouncilMeeting } from '@/core/council/meeting';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { notifyCouncilDecision } from '@/core/integrations/telegram';

// Lazy initialization - only create client when actually needed (runtime, not build time)
let _supabase: SupabaseClient | null = null;
function getSupabase() {
    if (!_supabase) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            throw new Error('Supabase credentials not configured');
        }
        _supabase = createClient(url, key);
    }
    return _supabase;
}

// Em produção, proteger com secret
const CRON_SECRET = process.env.CRON_SECRET || 'dev_secret';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get('secret');

        if (secret !== CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('[Council] Starting board meeting...');

        // 1. Buscar conversas ativas recentes (últimas 24h)
        const { data: conversations } = await getSupabase()
            .from('conversations')
            .select('id, lead_id, messages(content, role)')
            .eq('status', 'active')
            .order('updated_at', { ascending: false })
            .limit(5); // Limite de 5 para teste inicial

        if (!conversations || conversations.length === 0) {
            return NextResponse.json({ message: 'No active conversations to audit.' });
        }

        const council = new CouncilMeeting();
        const results = [];

        for (const conv of conversations) {
            // Formatar histórico para texto
            // @ts-ignore
            const history = conv.messages.map(m => `${m.role.toUpperCase()}: ${m.content}`);

            if (history.length < 4) continue; // Ignorar conversas mto curtas

            console.log(`[Council] Auditing conversation ${conv.id}...`);
            const summary = await council.auditConversation(conv.lead_id, history);

            results.push({
                conversationId: conv.id,
                leadId: conv.lead_id,
                score: summary.overallScore,
                consensus: summary.consensus
            });
        }

        return NextResponse.json({
            success: true,
            audited: results.length,
            results: results
        });

    } catch (error) {
        console.error('[Council] Meeting failed:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
