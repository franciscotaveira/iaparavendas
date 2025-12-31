
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
    const phoneId = process.env.META_PHONE_NUMBER_ID;
    if (!phoneId) {
        console.error("❌ No META_PHONE_NUMBER_ID in .env.local");
        return;
    }

    console.log(`Checking Tenant for Phone ID: ${phoneId}`);

    // 1. Check if exists
    const { data: existing } = await supabase.from('tenants').select('*').eq('phone_number_id', phoneId).single();

    if (existing) {
        console.log("✅ Tenant already exists:", existing);
        return;
    }

    // 2. Create if not
    console.log("Creating new tenant...");
    const { data, error } = await supabase.from('tenants').insert({
        name: 'LX Factory Test',
        phone_number_id: phoneId,
        // platform: 'whatsapp', // Depende do schema, vamos tentar o básico
    }).select().single();

    if (error) {
        console.error("❌ Error creating tenant:", error);
    } else {
        console.log("✅ Tenant Created:", data);
    }
}

main();
