
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { AGENT_REGISTRY } from '../core/agents/index'; // Importa agentes estáticos (fix ESM)
import fs from 'fs';

// Carrega .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug
console.log(`🔑 Keys found: URL=${!!supabaseUrl}, KEY=${!!supabaseKey} (Service: ${!!process.env.SUPABASE_SERVICE_KEY})`);

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

async function deployAgents() {
    if (!supabase) {
        console.error("❌ Erro: Nenhuma chave Supabase encontrada. Verifique .env.local");
        return;
    }

    console.log("🧠 Iniciando migração de Inteligência para a Nuvem (Supabase)...");

    // Lendo SQL de schema
    const sqlPath = path.join(process.cwd(), 'scripts', 'evolution-schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Tentar executar SQL (Hack usando RPC se existir, ou aviso manual)
    console.log("ℹ️ Certifique-se de ter rodado 'scripts/evolution-schema.sql' no seu SQL Editor do Supabase.");
    console.log("⏳ Tentando inserir agentes assumindo que a tabela existe...");

    let successCount = 0;
    let failCount = 0;

    for (const [role, agent] of Object.entries(AGENT_REGISTRY)) {

        // Prepara dados
        const payload = {
            role: agent.role,
            name: agent.name,
            current_version: 1,
            system_prompt: agent.system_prompt,
            base_prompt: agent.system_prompt,
            personality: agent.personality,
            memories: [],
            wins: 0,
            losses: 0
        };

        // Upsert (Inserir ou Atualizar)
        const { error } = await supabase
            .from('agents')
            .upsert(payload, { onConflict: 'role' });

        if (error) {
            console.error(`❌ Falha ao migrar ${agent.name}:`, error.message);
            failCount++;

            // Se erro for "relation does not exist", paramos
            if (error.message.includes('relation "public.agents" does not exist')) {
                console.error("\n🛑 A TABELA 'agents' NÃO EXISTE!");
                console.error("👉 Por favor, vá no painel do Supabase, SQL Editor, e cole o conteúdo de: scripts/evolution-schema.sql");
                process.exit(1);
            }
        } else {
            console.log(`✅ ${agent.name} migrado com sucesso.`);
            successCount++;
        }
    }

    console.log(`\n🏁 Migração concluída: ${successCount} sucessos, ${failCount} falhas.`);
}

deployAgents().catch(console.error);
