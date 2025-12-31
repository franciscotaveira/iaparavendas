import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkAndSetup() {
    // 1. Verificar se coluna evolution_instance existe
    console.log('Checking tenant schema...');
    const { data, error } = await supabase.from('tenants').select('id, name, evolution_instance').limit(1);

    if (error && error.message.includes('evolution_instance')) {
        console.log('❌ Column evolution_instance does not exist. Need to run migration.');
        console.log('Run this SQL in Supabase:');
        console.log(`
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS evolution_instance TEXT,
ADD COLUMN IF NOT EXISTS evolution_connected BOOLEAN DEFAULT false;
        `);
        return;
    }

    console.log('✅ Schema OK');
    console.log('Current tenants:', data);

    // 2. Criar/atualizar tenant para Evolution
    console.log('\nSetting up lx-test tenant for Evolution...');

    const { data: existingTenant } = await supabase
        .from('tenants')
        .select('*')
        .eq('evolution_instance', 'lx-test')
        .single();

    if (existingTenant) {
        console.log('✅ Tenant lx-test already exists:', existingTenant.id);
    } else {
        // Atualizar tenant existente ou criar novo
        const { data: anyTenant } = await supabase.from('tenants').select('id').limit(1).single();

        if (anyTenant) {
            await supabase
                .from('tenants')
                .update({ evolution_instance: 'lx-test', evolution_connected: true })
                .eq('id', anyTenant.id);
            console.log('✅ Updated existing tenant with evolution_instance: lx-test');
        } else {
            const { data: newTenant } = await supabase
                .from('tenants')
                .insert({
                    name: 'LX Test',
                    slug: 'lx-test',
                    evolution_instance: 'lx-test',
                    evolution_connected: true
                })
                .select()
                .single();
            console.log('✅ Created new tenant:', newTenant?.id);
        }
    }

    console.log('\n✅ Setup complete!');
}

checkAndSetup();
