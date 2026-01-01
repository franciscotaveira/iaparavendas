
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const DB_PATH = path.join(process.cwd(), 'data', 'agents_db.json');
const ELITE_SESSIONS_PATH = path.join(process.cwd(), 'data', 'elite_sessions.json');
const NORMAL_SESSIONS_PATH = path.join(process.cwd(), 'data', 'training_sessions.json');

async function evolveAgents() {
    if (!fs.existsSync(DB_PATH)) {
        console.error("❌ Agents DB local não encontrado.");
        return;
    }

    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const sessionsByAgent: Record<string, any[]> = {};

    // 1. CARREGAR LIÇÕES DE ELITE (PRIORIDADE MÁXIMA)
    if (fs.existsSync(ELITE_SESSIONS_PATH)) {
        console.log("🎓 Carregando lições da Academia de Elite...");
        try {
            const eliteSessions = JSON.parse(fs.readFileSync(ELITE_SESSIONS_PATH, 'utf8'));
            eliteSessions.forEach((s: any) => {
                const role = s.agent || s.scenario; // Suporte a múltiplos formatos
                if (!sessionsByAgent[role]) sessionsByAgent[role] = [];
                sessionsByAgent[role].push({ ...s, is_elite: true });
            });
        } catch (e) { console.error("Erro ao ler sessões de elite."); }
    }

    // 2. CARREGAR TREINOS NORMAIS
    if (fs.existsSync(NORMAL_SESSIONS_PATH)) {
        console.log("📂 Carregando treinos cotidianos...");
        try {
            const normalSessions = JSON.parse(fs.readFileSync(NORMAL_SESSIONS_PATH, 'utf8'));
            normalSessions.forEach((s: any) => {
                const role = s.scenario || s.agent;
                if (!sessionsByAgent[role]) sessionsByAgent[role] = [];
                sessionsByAgent[role].push({ ...s, is_elite: false });
            });
        } catch (e) { console.error("Erro ao ler treinos normais."); }
    }

    let evolutionCount = 0;

    for (const [role, agentSessions] of Object.entries(sessionsByAgent)) {
        if (!db[role]) continue;

        const agent = db[role];
        const newMemories: string[] = [];

        agentSessions.forEach(session => {
            const feedback = session.feedback;
            if (!feedback) return;

            // ELITE: Aprende SEMPRE, pois o erro é a maior lição do mestre
            if (session.is_elite && feedback.learned_lesson) {
                const lesson = `[ELITE LESSON] ${feedback.learned_lesson}`;
                if (!agent.memories.includes(lesson) && !newMemories.includes(lesson)) {
                    newMemories.push(lesson);
                }
            }
            // NORMAL: Só aprende com vitórias (score >= 80)
            else if (!session.is_elite && feedback.score >= 80 && feedback.strengths) {
                feedback.strengths.forEach((s: string) => {
                    if (!agent.memories.includes(s) && !newMemories.includes(s)) {
                        newMemories.push(s);
                    }
                });
            }
        });

        if (newMemories.length > 0) {
            console.log(`\n🚀 EVOLUINDO: ${agent.name} (${role})`);
            newMemories.forEach(m => console.log(`   + Nova Memória: ${m.substring(0, 80)}...`));

            agent.memories.push(...newMemories);
            // Limitar a 20 memórias para não explodir o prompt
            if (agent.memories.length > 20) {
                agent.memories = agent.memories.slice(-20);
            }

            agent.current_version++;
            agent.last_evolution_at = new Date().toISOString();

            // RECONSTRUIR SYSTEM PROMPT
            const memoryBlock = agent.memories.length > 0
                ? `\n\n## 🧠 CONHECIMENTO ADQUIRIDO (FRACTAL MEMORY)\nUse estas lições de mentores de elite e experiências passadas:\n${agent.memories.map((m: string) => `- ${m}`).join('\n')}`
                : '';

            agent.system_prompt = agent.base_prompt + memoryBlock;
            evolutionCount++;
        }
    }

    if (evolutionCount > 0) {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        console.log(`\n✅ ${evolutionCount} agentes evoluíram com sucesso!`);
    } else {
        console.log("\n💤 Nenhuma evolução pendente.");
    }
}

evolveAgents().catch(console.error);
