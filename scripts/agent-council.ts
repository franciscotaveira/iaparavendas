/**
 * 🏛️ LUMAX AGENT COUNCIL - Sala de Bate-Papo dos Agentes
 * 
 * Os agentes conversam entre si para:
 * 1. Compartilhar conhecimento
 * 2. Resolver problemas em conjunto
 * 3. Melhorar assertividade e interação
 * 4. Elite Training com líderes (CEO, COO, CFO)
 * 
 * Uso: npx tsx scripts/agent-council.ts [--topic="tema"] [--infinite]
 */

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const OPENAI_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("❌ ERRO: Necessário configurar OPENAI_API_KEY ou OPENROUTER_API_KEY");
    process.exit(1);
}

const provider = createOpenAI({
    baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined,
    apiKey: OPENAI_API_KEY,
});

const MODEL = 'gpt-4o';

// Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Carregar agentes do DB
const DB_PATH = path.join(process.cwd(), 'data', 'agents_db.json');

interface AgentInfo {
    id: string;
    role: string;
    name: string;
    system_prompt: string;
    personality: {
        style: string;
        energy: string;
    };
}

// Hierarquia de mentoria
const MENTOR_HIERARCHY: Record<string, string[]> = {
    // Líderes treinam todos
    'ops_ceo': ['sdr', 'closer', 'support', 'scheduler', 'qualifier'],
    'ops_coo': ['dev_fullstack', 'dev_architect', 'dev_devops', 'dev_dba', 'dev_security'],
    'ops_cfo': ['mkt_copywriter', 'mkt_growth', 'mkt_social', 'mkt_ads', 'mkt_seo'],

    // Seniores treinam juniores
    'dev_architect': ['dev_fullstack', 'dev_devops'],
    'product_pm': ['product_ux', 'product_ui', 'product_analyst'],
    'mkt_growth': ['mkt_social', 'mkt_ads', 'mkt_seo'],
    'closer': ['sdr', 'scheduler'],
    'ops_cs': ['support', 'qualifier'],
};

// Temas de discussão
const COUNCIL_TOPICS = [
    {
        theme: "Melhoria de Conversão",
        description: "Como podemos melhorar a taxa de conversão de leads?",
        participants: ['sdr', 'closer', 'mkt_copywriter', 'ops_ceo']
    },
    {
        theme: "Experiência do Cliente",
        description: "Como criar uma experiência excepcional para nossos clientes?",
        participants: ['support', 'ops_cs', 'product_ux', 'closer']
    },
    {
        theme: "Escalabilidade Técnica",
        description: "Como garantir que nossa infraestrutura escale com o crescimento?",
        participants: ['dev_architect', 'dev_devops', 'dev_dba', 'ops_coo']
    },
    {
        theme: "Growth e Aquisição",
        description: "Estratégias para crescimento acelerado e aquisição de clientes",
        participants: ['mkt_growth', 'mkt_ads', 'mkt_seo', 'ops_ceo']
    },
    {
        theme: "Alinhamento de Equipe",
        description: "Como manter todos os agentes alinhados com os objetivos da empresa?",
        participants: ['ops_ceo', 'ops_coo', 'ops_hr', 'product_pm']
    },
    {
        theme: "Inovação de Produto",
        description: "Quais features devemos priorizar para o próximo trimestre?",
        participants: ['product_pm', 'product_ux', 'dev_fullstack', 'ops_ceo']
    },
    {
        theme: "Segurança e Compliance",
        description: "Como garantir segurança máxima sem prejudicar a experiência?",
        participants: ['dev_security', 'dev_architect', 'ops_coo', 'ops_cfo']
    },
    {
        theme: "Content Strategy",
        description: "Como criar conteúdo que converte e engaja?",
        participants: ['mkt_copywriter', 'mkt_social', 'mkt_seo', 'product_analyst']
    }
];

// Sessões de mentoria
const MENTORSHIP_SCENARIOS = [
    {
        title: "Lidar com objeções de preço",
        mentor: 'closer',
        mentees: ['sdr', 'scheduler'],
        challenge: "O cliente disse que achou caro. Como contornar?"
    },
    {
        title: "Arquitetura para escala",
        mentor: 'dev_architect',
        mentees: ['dev_fullstack', 'dev_devops'],
        challenge: "Precisamos suportar 100x mais usuários. Como redesenhar?"
    },
    {
        title: "Liderança estratégica",
        mentor: 'ops_ceo',
        mentees: ['sdr', 'closer', 'mkt_growth'],
        challenge: "Como priorizar quando tudo parece urgente?"
    },
    {
        title: "Copy que converte",
        mentor: 'mkt_copywriter',
        mentees: ['mkt_social', 'sdr'],
        challenge: "Como escrever uma mensagem de abertura irresistível?"
    },
    {
        title: "Customer Success",
        mentor: 'ops_cs',
        mentees: ['support', 'qualifier'],
        challenge: "Cliente está insatisfeito e quer cancelar. O que fazer?"
    },
    {
        title: "Métricas que importam",
        mentor: 'ops_cfo',
        mentees: ['product_analyst', 'mkt_growth', 'mkt_ads'],
        challenge: "Quais métricas realmente indicam saúde do negócio?"
    },
    {
        title: "Design centrado no usuário",
        mentor: 'product_ux',
        mentees: ['product_ui', 'dev_fullstack'],
        challenge: "Como validar se o design realmente resolve o problema?"
    }
];

function loadAgents(): Record<string, AgentInfo> {
    if (!fs.existsSync(DB_PATH)) {
        console.error("❌ agents_db.json não encontrado");
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

async function agentSpeak(agent: AgentInfo, context: string, conversation: string[]): Promise<string> {
    const { text } = await generateText({
        model: provider(MODEL),
        system: `${agent.system_prompt}

## MODO COUNCIL (Reunião de Equipe)
Você está em uma reunião com outros agentes da empresa.
- Seja colaborativo e construtivo
- Compartilhe seu conhecimento específico
- Ouça os outros e construa em cima das ideias
- Seja objetivo (máximo 2-3 frases)
- Use sua expertise única para contribuir`,
        prompt: `CONTEXTO DA REUNIÃO: ${context}

CONVERSA ATÉ AGORA:
${conversation.join('\n')}

Agora é sua vez de contribuir como ${agent.name} (${agent.role}). 
Sua resposta:`
    });

    return text;
}

async function mentorTeach(mentor: AgentInfo, mentees: AgentInfo[], scenario: string): Promise<string[]> {
    const conversation: string[] = [];

    // Mentor apresenta o desafio
    const intro = await generateText({
        model: provider(MODEL),
        system: `${mentor.system_prompt}

## MODO MENTORIA
Você é o mentor desta sessão. Seu papel é:
- Apresentar o desafio de forma clara
- Guiar os mentees com perguntas socráticas
- Compartilhar frameworks e técnicas
- Dar feedback construtivo
Seja conciso e prático.`,
        prompt: `Você vai ensinar sobre este desafio: "${scenario}"
Inicie a sessão de mentoria apresentando o problema e perguntando aos mentees como eles abordariam:`
    });

    conversation.push(`🎓 ${mentor.name} (Mentor): ${intro.text}`);

    // Cada mentee responde
    for (const mentee of mentees) {
        const response = await generateText({
            model: provider(MODEL),
            system: `${mentee.system_prompt}

## MODO APRENDIZADO
Você está sendo mentorado por ${mentor.name}. Seu papel é:
- Mostrar como você abordaria o problema
- Fazer perguntas quando não souber
- Absorver os ensinamentos
- Ser humilde e aberto a aprender`,
            prompt: `O mentor ${mentor.name} perguntou sobre: "${scenario}"

${conversation.join('\n')}

Como ${mentee.name}, responda ao mentor mostrando sua abordagem:`
        });

        conversation.push(`📚 ${mentee.name}: ${response.text}`);
    }

    // Mentor dá feedback e ensina
    const teaching = await generateText({
        model: provider(MODEL),
        system: `${mentor.system_prompt}

## MODO FEEDBACK
Analise as respostas dos mentees e:
- Elogie o que foi bom
- Corrija com gentileza o que pode melhorar
- Compartilhe uma técnica ou framework poderoso
- Dê um insight que eles possam usar imediatamente`,
        prompt: `Respostas dos mentees sobre "${scenario}":

${conversation.join('\n')}

Dê seu feedback e ensine algo valioso:`
    });

    conversation.push(`💡 ${mentor.name} (Ensino): ${teaching.text}`);

    return conversation;
}

async function runCouncilMeeting(topic: typeof COUNCIL_TOPICS[0], agents: Record<string, AgentInfo>) {
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log(`║  🏛️  COUNCIL MEETING: ${topic.theme.padEnd(42)}║`);
    console.log('╠══════════════════════════════════════════════════════════════════╣');
    console.log(`║  📋 Tema: ${topic.description.substring(0, 54).padEnd(54)}║`);
    console.log('╚══════════════════════════════════════════════════════════════════╝');

    const participants = topic.participants
        .filter(role => agents[role])
        .map(role => agents[role]);

    console.log(`\n👥 Participantes: ${participants.map(p => p.name).join(', ')}\n`);

    const conversation: string[] = [];
    const context = `${topic.theme}: ${topic.description}`;

    // 3 rodadas de discussão
    for (let round = 1; round <= 3; round++) {
        console.log(`\n--- Rodada ${round} ---\n`);

        for (const agent of participants) {
            const response = await agentSpeak(agent, context, conversation);
            const entry = `${agent.name}: ${response}`;
            conversation.push(entry);

            console.log(`🗣️  ${agent.name}: ${response}`);
            await new Promise(r => setTimeout(r, 500));
        }
    }

    // Síntese final
    const synthesizer = participants.find(p =>
        ['ops_ceo', 'ops_coo', 'product_pm'].includes(p.role)
    ) || participants[0];

    const synthesis = await generateText({
        model: provider(MODEL),
        system: `${synthesizer.system_prompt}

Como líder desta reunião, faça uma síntese executiva dos principais pontos discutidos.
Liste 3 action items concretos.`,
        prompt: `Discussão sobre "${topic.theme}":

${conversation.join('\n')}

Faça a síntese e defina próximos passos:`
    });

    console.log(`\n📝 SÍNTESE (${synthesizer.name}):`);
    console.log(synthesis.text);

    // Salvar no histórico
    const sessionData = {
        type: 'council_meeting',
        topic: topic.theme,
        participants: participants.map(p => p.role),
        conversation,
        synthesis: synthesis.text,
        created_at: new Date().toISOString()
    };

    // Salvar localmente
    const councilLogPath = path.join(process.cwd(), 'data', 'council_sessions.json');
    let sessions = [];
    if (fs.existsSync(councilLogPath)) {
        sessions = JSON.parse(fs.readFileSync(councilLogPath, 'utf8'));
    }
    sessions.push(sessionData);
    fs.writeFileSync(councilLogPath, JSON.stringify(sessions, null, 2));

    console.log('\n💾 Sessão salva no histórico.');

    return sessionData;
}

async function runMentorshipSession(scenario: typeof MENTORSHIP_SCENARIOS[0], agents: Record<string, AgentInfo>) {
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log(`║  🎓 MENTORSHIP SESSION: ${scenario.title.padEnd(39)}║`);
    console.log('╚══════════════════════════════════════════════════════════════════╝');

    const mentor = agents[scenario.mentor];
    const mentees = scenario.mentees
        .filter(role => agents[role])
        .map(role => agents[role]);

    if (!mentor) {
        console.log('❌ Mentor não encontrado');
        return;
    }

    console.log(`\n🎓 Mentor: ${mentor.name} (${mentor.role})`);
    console.log(`📚 Mentees: ${mentees.map(m => m.name).join(', ')}`);
    console.log(`💡 Desafio: ${scenario.challenge}\n`);

    const conversation = await mentorTeach(mentor, mentees, scenario.challenge);

    console.log('\n--- Transcrição ---\n');
    conversation.forEach(line => console.log(line));

    // Salvar aprendizados nos agentes
    const learningPath = path.join(process.cwd(), 'data', 'mentorship_learnings.json');
    let learnings = [];
    if (fs.existsSync(learningPath)) {
        learnings = JSON.parse(fs.readFileSync(learningPath, 'utf8'));
    }

    learnings.push({
        session: scenario.title,
        mentor: scenario.mentor,
        mentees: scenario.mentees,
        challenge: scenario.challenge,
        conversation,
        created_at: new Date().toISOString()
    });

    fs.writeFileSync(learningPath, JSON.stringify(learnings, null, 2));

    console.log('\n💾 Aprendizados salvos!');

    return conversation;
}

async function runEliteTraining(agents: Record<string, AgentInfo>) {
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║  👑 ELITE TRAINING - CEO & COO treinam a equipe toda            ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');

    const ceo = agents['ops_ceo'];
    const coo = agents['ops_coo'];

    if (!ceo || !coo) {
        console.log('❌ Líderes não encontrados');
        return;
    }

    // Elite challenge
    const eliteChallenges = [
        "Um cliente VIP está insatisfeito e ameaça cancelar publicamente. Temos 1 hora para resolver. Como cada um de vocês age?",
        "Acabamos de receber um investimento de R$10M. Como priorizamos o crescimento sem perder qualidade?",
        "Um concorrente lançou uma feature que pode nos tirar 30% do mercado. Qual é o plano de guerra?",
        "Precisamos dobrar a receita em 6 meses mantendo a margem. Qual a estratégia integrada?"
    ];

    const challenge = eliteChallenges[Math.floor(Math.random() * eliteChallenges.length)];

    console.log(`\n👑 ${ceo.name} (CEO) apresenta o DESAFIO ELITE:`);
    console.log(`\n"${challenge}"\n`);

    // Cada departamento responde
    const departments = [
        { name: 'Vendas', agents: ['sdr', 'closer'] },
        { name: 'Produto', agents: ['product_pm', 'dev_fullstack'] },
        { name: 'Marketing', agents: ['mkt_growth', 'mkt_copywriter'] },
        { name: 'Operações', agents: ['ops_cs', 'support'] }
    ];

    const responses: string[] = [];

    for (const dept of departments) {
        const deptAgents = dept.agents
            .filter(role => agents[role])
            .map(role => agents[role]);

        if (deptAgents.length === 0) continue;

        const lead = deptAgents[0];

        const response = await generateText({
            model: provider(MODEL),
            system: `${lead.system_prompt}

## MODO ELITE TRAINING
O CEO e COO estão avaliando sua resposta.
Seja estratégico, prático e mostre liderança.
Responda em nome do seu departamento.`,
            prompt: `DESAFIO DO CEO: "${challenge}"

Como líder do departamento de ${dept.name}, qual é seu plano de ação?
Seja específico e mencione como seu time contribuiria.`
        });

        console.log(`\n📊 ${dept.name} (${lead.name}):`);
        console.log(response.text);
        responses.push(`${dept.name}: ${response.text}`);
    }

    // CEO e COO avaliam
    const evaluation = await generateText({
        model: provider(MODEL),
        system: `${ceo.system_prompt}

Você é o CEO avaliando as respostas da sua equipe.
Dê uma avaliação construtiva e identifique:
1. Melhores insights
2. Gaps no pensamento
3. Como integrar as respostas em um plano único`,
        prompt: `DESAFIO: "${challenge}"

RESPOSTAS DOS DEPARTAMENTOS:
${responses.join('\n\n')}

Avalie e integre em um plano executivo:`
    });

    console.log(`\n\n👑 AVALIAÇÃO DO CEO (${ceo.name}):`);
    console.log(evaluation.text);

    // Salvar
    const elitePath = path.join(process.cwd(), 'data', 'elite_training.json');
    let eliteSessions = [];
    if (fs.existsSync(elitePath)) {
        eliteSessions = JSON.parse(fs.readFileSync(elitePath, 'utf8'));
    }

    eliteSessions.push({
        challenge,
        responses,
        ceo_evaluation: evaluation.text,
        created_at: new Date().toISOString()
    });

    fs.writeFileSync(elitePath, JSON.stringify(eliteSessions, null, 2));

    console.log('\n💾 Elite Training session salva!');
}

// ============== MAIN ==============

async function main() {
    const args = process.argv.slice(2);
    const isInfinite = args.includes('--infinite');
    const specificTopic = args.find(a => a.startsWith('--topic='))?.split('=')[1];

    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                  ║');
    console.log('║   🏛️  LUMAX AGENT COUNCIL - Sala de Treinamento Coletivo        ║');
    console.log('║                                                                  ║');
    console.log('║   Onde agentes conversam, aprendem e evoluem juntos             ║');
    console.log('║                                                                  ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log('\n');

    const agents = loadAgents();
    console.log(`✅ ${Object.keys(agents).length} agentes carregados\n`);

    let cycle = 0;

    do {
        cycle++;
        console.log(`\n\n${'═'.repeat(70)}`);
        console.log(`📍 CICLO DE TREINAMENTO #${cycle}`);
        console.log(`${'═'.repeat(70)}\n`);

        // 1. Council Meeting (discussão em grupo)
        const topic = specificTopic
            ? COUNCIL_TOPICS.find(t => t.theme.toLowerCase().includes(specificTopic.toLowerCase())) || COUNCIL_TOPICS[0]
            : COUNCIL_TOPICS[Math.floor(Math.random() * COUNCIL_TOPICS.length)];

        await runCouncilMeeting(topic, agents);

        await new Promise(r => setTimeout(r, 3000));

        // 2. Mentorship Session
        const mentorScenario = MENTORSHIP_SCENARIOS[Math.floor(Math.random() * MENTORSHIP_SCENARIOS.length)];
        await runMentorshipSession(mentorScenario, agents);

        await new Promise(r => setTimeout(r, 3000));

        // 3. Elite Training (a cada 3 ciclos)
        if (cycle % 3 === 0) {
            await runEliteTraining(agents);
        }

        if (isInfinite) {
            console.log('\n\n⏳ Próximo ciclo em 30s... (Ctrl+C para parar)\n');
            await new Promise(r => setTimeout(r, 30000));
        }

    } while (isInfinite);

    console.log('\n\n✨ Sessão do Council encerrada!');
    console.log('📊 Dados salvos em data/council_sessions.json');
    console.log('🎓 Mentoria salva em data/mentorship_learnings.json');
    console.log('👑 Elite training em data/elite_training.json\n');
}

main().catch(console.error);
