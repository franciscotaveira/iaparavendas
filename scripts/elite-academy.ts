/**
 * LUMAX ELITE ACADEMY - NICHE TRAINING MOTOR
 * Onde os agentes evoluem sob a mentoria dos maiores do mundo.
 */

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { ELITE_MENTORS, MentorCategory } from './elite-mentors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const OPENAI_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
const API_URL = process.env.API_URL || 'http://localhost:3000';

const provider = createOpenAI({
    baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined,
    apiKey: OPENAI_API_KEY,
});

async function runEliteSession(agentRole: string) {
    const agentsDb = JSON.parse(fs.readFileSync('./data/agents_db.json', 'utf8'));
    const agent = agentsDb[agentRole];

    if (!agent) {
        console.error(`❌ Agente ${agentRole} não encontrado.`);
        return;
    }

    // Determinar categoria do mentor
    let category: MentorCategory = 'ops';
    if (agent.category && ELITE_MENTORS[agent.category as MentorCategory]) {
        category = agent.category as MentorCategory;
    } else if (agentRole.startsWith('dev_')) category = 'dev';
    else if (agentRole.startsWith('mkt_')) category = 'marketing';
    else if (agentRole.startsWith('product_')) category = 'product';
    else if (agentRole.startsWith('ops_')) category = 'ops';
    else if (['sdr', 'closer', 'scheduler', 'qualifier', 'sales_agent_haven'].includes(agentRole)) category = 'sales';

    const mentor = ELITE_MENTORS[category];

    console.log(`\n🎓 [ACADEMY] Agente: ${agent.name} (${agentRole})`);
    console.log(`👨‍🏫 [MENTOR] ${mentor.name} - ${mentor.title}`);

    // 1. GERAR CENÁRIO DE ELITE (NICHADO)
    const scenarioGen = await generateText({
        model: provider('gpt-4o'),
        system: mentor.system,
        prompt: `Crie um cenário de desafio de ELITE para o agente ${agent.name} (Papel: ${agent.role}). 
        O cenário deve testar um destes focos: ${mentor.focus.join(', ')}.
        O desafio deve ser de nível DIFÍCIL. 
        Retorne apenas o texto do desafio (o que o usuário diria para o agente).`
    });

    const scenario = scenarioGen.text;
    console.log(`\n🚩 [DESAFIO] ${scenario}`);

    // 2. EXECUTAR SIMULAÇÃO
    const history: any[] = [];
    let currentInput = scenario;

    console.log(`\n⚔️  Batalha iniciada...`);

    for (let turn = 1; turn <= 3; turn++) {
        // Resposta do Agente (API Local)
        try {
            const res = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...history, { role: 'user', content: currentInput }],
                    forced_agent_role: agentRole
                })
            });
            const textRaw = await res.text();
            // Limpeza simples do stream
            const agentResponse = textRaw.split('\n').filter(l => l.startsWith('0:')).map(l => l.substring(3).replace(/^"|"$/g, '')).join('');

            console.log(`\n🔵 Agent: ${agentResponse}`);
            history.push({ role: 'user', content: currentInput });
            history.push({ role: 'assistant', content: agentResponse });

            // Contra-ataque do Mentor (Red Team)
            if (turn < 3) {
                const reaction = await generateText({
                    model: provider('gpt-4o'),
                    system: mentor.system + "\nVocê está testando o agente. Seja desafiador e pressione os pontos fracos.",
                    prompt: `A conversa até agora:\n${JSON.stringify(history)}\n\nO agente respondeu. Como você, mentor, pressionaria ele agora para ver até onde vai o conhecimento dele?`
                });
                currentInput = reaction.text;
                console.log(`\n🔴 Mentor: ${currentInput}`);
            }
        } catch (e) {
            console.error("Erro na comunicação com o agente.");
            break;
        }
    }

    // 3. O JUIZ MENTOR DELIBERA
    console.log(`\n👨‍⚖️ O MENTOR ESTÁ AVALIANDO...`);
    const evaluation = await generateText({
        model: provider('gpt-4o'),
        system: mentor.system + "\nVocê é o juiz desta sessão de elite. Analise a performance baseada na sua filosofia.",
        prompt: `Analise esta sessão de treinamento:\n${JSON.stringify(history)}\n\n
        Avalie o AGENTE em: 
        1. Alinhamento com sua filosofia (${mentor.focus.join(', ')})
        2. Precisão técnica
        3. Autoridade e Postura
        
        Retorne em JSON:\n{ "score": 0-100, "strengths": [], "weaknesses": [], "master_feedback": "", "learned_lesson": "" }`
    });

    try {
        const result = JSON.parse(evaluation.text.replace(/```json|```/g, ''));
        console.log(`\n📊 NOTA FINAL: ${result.score}/100`);
        console.log(`💡 LIÇÃO: ${result.learned_lesson}`);

        // Salvar resultado para evolução
        const sessionResult = {
            session_id: `ELITE-${Date.now()}`,
            agent: agentRole,
            mentor: mentor.name,
            scenario: scenario,
            score: result.score,
            feedback: result,
            created_at: new Date().toISOString()
        };

        const sessionsDir = './data/elite_sessions.json';
        const sessions = fs.existsSync(sessionsDir) ? JSON.parse(fs.readFileSync(sessionsDir, 'utf8')) : [];
        sessions.push(sessionResult);
        fs.writeFileSync(sessionsDir, JSON.stringify(sessions, null, 2));

        console.log(`\n✅ Sessão finalizada e salva.`);

    } catch (e) {
        console.log("\n⚠️ Erro ao processar veredito final.");
        console.log(evaluation.text);
    }
}

// Rodar se chamado via CLI
if (require.main === module) {
    const role = process.argv[2];
    if (role) runEliteSession(role).catch(console.error);
}
