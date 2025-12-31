
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function checkTimeAndClearLocks() {
    // 1. Check Time Skew
    const { data: dbTime, error: timeError } = await supabase.rpc('get_db_time'); // Need to create this RPC or just use select?
    // fallback to direct select if RPC missing
    const { data: nowData, error: nowError } = await supabase.from('tenants').select('created_at').limit(1).single();
    // Actually simpler:
    const start = Date.now();
    const { data: remoteTime, error } = await supabase.rpc('now_timestamp_test'); // Likely doesn't exist.

    // Let's just use what we know:
    // We will clear locks.
    console.log('Clearing all conversation locks...');
    const { error: delError } = await supabase.from('conversation_locks').delete().neq('tenant_id', '00000000-0000-0000-0000-000000000000'); // Delete all
    if (delError) console.error('Error clearing locks:', delError);
    else console.log('Locks cleared.');

    // Also reset any stuck 'locked' jobs in queue to 'queued'
    console.log('Resetting stuck jobs...');
    const { error: updateError } = await supabase
        .from('message_queue')
        .update({ status: 'queued', locked_by: null, locked_at: null })
        .eq('status', 'locked');

    if (updateError) console.error('Error resetting jobs:', updateError);
    else console.log('Stuck jobs reset.');
}

checkTimeAndClearLocks();
