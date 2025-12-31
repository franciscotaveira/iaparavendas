
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function testLock() {
    const tenantId = '07d8c592-1a71-4c9c-b0c8-bd817fc793c4'; // Retrieved from previous error log
    const conversationId = '5511999999999'; // String
    const workerId = 'debug-script';

    console.log('Testing lock with:', { tenantId, conversationId });

    const { data, error } = await supabase.rpc("acquire_conversation_lock", {
        p_tenant_id: tenantId,
        p_conversation_id: conversationId,
        p_locked_until: new Date(Date.now() + 30000).toISOString(),
        p_worker_id: workerId,
    });

    if (error) {
        console.error('RPC Error:', error);
    } else {
        console.log('RPC Success:', data);
    }
}

testLock();
