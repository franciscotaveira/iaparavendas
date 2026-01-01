
import { AGENT_REGISTRY } from '../core/agents/index';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'agents_db.json');
const DATA_DIR = path.join(process.cwd(), 'data');

async function initLocalDb() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR);
    }

    const db: Record<string, any> = {};

    console.log("💿 Inicializando banco de dados local de Agentes...");

    for (const [role, agent] of Object.entries(AGENT_REGISTRY)) {
        db[role] = {
            id: role, // role as ID for simplicity
            role: agent.role,
            name: agent.name,
            current_version: 1,
            system_prompt: agent.system_prompt,
            base_prompt: agent.system_prompt,
            personality: agent.personality,
            memories: [],
            wins: 0,
            losses: 0,
            last_evolution_at: new Date().toISOString()
        };
    }

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    console.log(`✅ ${Object.keys(db).length} agentes persistidos em ${DB_PATH}`);
}

initLocalDb().catch(console.error);
