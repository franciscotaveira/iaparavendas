/**
 * LUMAX Training Simulator
 * 
 * Script de treinamento real que simula conversas de leads com DIFERENTES AGENTES
 * para melhorar a qualidade das respostas do sistema.
 * 
 * Uso: npx ts-node scripts/training-simulator.ts
 * 
 * Flags:
 *   --infinite     Roda em loop infinito
 *   --delay=5000   Delay entre conversas (ms)
 *   --scenarios=10 Número de cenários por ciclo
 *   --agent=sdr    Foca em um agente específico (opcional)
 */

import { createClient } from '@supabase/supabase-js';

// Configuração
const API_URL = process.env.API_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Argumentos
const args = process.argv.slice(2);
const isInfinite = args.includes('--infinite');
const delayMs = parseInt(args.find(a => a.startsWith('--delay='))?.split('=')[1] || '3000');
const scenariosPerCycle = parseInt(args.find(a => a.startsWith('--scenarios='))?.split('=')[1] || '5');
const targetAgent = args.find(a => a.startsWith('--agent='))?.split('=')[1]; // Ex: --agent=sdr

interface Agent {
    role: string;
    name: string;
    title: string;
    personality: string;
}

let availableAgents: Agent[] = [];

async function fetchAgents() {
    try {
        const res = await fetch(`${API_URL}/api/agents`);
        const data: any = await res.json();
        // Flatten agents structure e extrair todos
        if (data.agents) {
            Object.values(data.agents).forEach((list: any) => {
                availableAgents.push(...list);
            });
        }

        if (targetAgent) {
            const filtered = availableAgents.filter(a => a.role === targetAgent);
            if (filtered.length === 0) {
                console.error(`❌ Agente '${targetAgent}' não encontrado. Disponíveis: ${availableAgents.map(a => a.role).join(', ')}`);
                process.exit(1);
            }
            availableAgents = filtered;
            console.log(`🎯 Focando treinamento no agente: ${filtered[0].name} (${filtered[0].role})`);
        } else {
            console.log(`🤖 ${availableAgents.length} agentes carregados para rodízio de treinamento.`);
        }

    } catch (e) {
        console.error('Erro ao buscar agentes (usando fallback):', e);
        // Fallback mock se API falhar
        availableAgents = [
            { role: 'sdr', name: 'Ana', title: 'SDR', personality: 'casual' },
            { role: 'closer', name: 'Bruno', title: 'Closer', personality: 'focado' }
        ];
    }
}

// ============== PERSONAS DE PACIENTES / LEADS ==============
const patientPersonas = [
    {
        name: 'Lead Decidido',
        traits: ['direto', 'quer comprar rápido'],
        openings: [
            'Oi, quero contratar o serviço',
            'Olá! Vocês tem vaga?',
            'Preciso de solução urgente'
        ],
        followUps: [
            'Pode ser hoje?',
            'Qual o preço?',
            'Aceita cartão?',
            'Perfeito, vamos fechar'
        ]
    },
    {
        name: 'Lead Curioso',
        traits: ['faz muitas perguntas', 'quer entender tudo'],
        openings: [
            'Oi, queria saber mais sobre como funciona',
            'Olá! Tenho algumas dúvidas',
            'Boa tarde'
        ],
        followUps: [
            'E como é a entrega?',
            'Demora muito?',
            'Tem garantia?',
            'E o suporte?'
        ]
    },
    {
        name: 'Lead Cético',
        traits: ['preocupado com preço', 'desconfiado'],
        openings: [
            'Oi, qual o valor?',
            'Olá, é confiável?',
            'Vi preços menores por aí'
        ],
        followUps: [
            'Achei caro',
            'Tem desconto?',
            'Vou pensar',
            'Não sei não...'
        ]
    }
];

// ============== CENÁRIOS ==============
const clinicScenarios = [
    { specialty: 'Vendas', services: ['SDR', 'Closer'], commonQuestions: ['preço', 'prazo'] },
    { specialty: 'Suporte', services: ['Helpdesk', 'SAC'], commonQuestions: ['erro', 'problema'] }
];

// ============== FUNÇÕES AUXILIARES ==============

function randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateSessionId(): string {
    return `TRAIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function sendMessage(sessionId: string, message: string, agentRole: string, history: Array<{ role: string; content: string }> = []): Promise<string> {
    try {
        const allMessages = [...history, { role: 'user', content: message }];

        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: allMessages,
                sessionId,
                forced_agent_role: agentRole // Injeta o agente selecionado
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status} - ${errText}`);
        }

        // Parse AI Stream Response (compatível com 'ai' SDK)
        const text = await response.text();

        // Tenta limpar formato de stream (ex: 0:"Olá")
        const lines = text.split('\n');
        const content = lines
            .filter(l => l.startsWith('0:') || (!l.startsWith('0:') && l.length > 5)) // Pega linhas de texto
            .map(l => {
                if (l.startsWith('0:')) {
                    try {
                        return JSON.parse(l.substring(2));
                    } catch {
                        return l.substring(3).replace(/^"|"$/g, '');
                    }
                }
                return l;
            })
            .join('');

        return content || 'Sem resposta legível';
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        return 'ERRO: ' + (error as Error).message;
    }
}

async function saveTrainingData(data: {
    sessionId: string;
    persona: string;
    scenario: string;
    messages: Array<{ role: string; content: string }>;
    success: boolean;
    duration: number;
    agentRole: string;
}) {
    if (!supabase) {
        console.log('⚠️  Supabase não configurado - dados não salvos');
        return;
    }

    try {
        await supabase.from('training_sessions').insert({
            session_id: data.sessionId,
            persona_type: data.persona,
            scenario: data.agentRole, // Usando o role do agente como cenário
            messages: data.messages,
            success: data.success,
            duration_ms: data.duration,
            created_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao salvar no Supabase:', error);
    }
}

// ============== SIMULAÇÃO DE CONVERSA ==============

async function simulateConversation(): Promise<void> {
    // Se não tiver agentes carregados, tenta carregar
    if (availableAgents.length === 0) await fetchAgents();

    const persona = randomChoice(patientPersonas);
    const agent = randomChoice(availableAgents); // Escolhe um agente da lista carregada

    const sessionId = generateSessionId();
    const messages: Array<{ role: string; content: string }> = [];
    const startTime = Date.now();

    console.log('\n' + '='.repeat(60));
    console.log(`🤖 Agente: ${agent.name} (${agent.role}) | ${agent.title}`);
    console.log(`🎭 Lead: ${persona.name}`);
    console.log(`🆔 Session: ${sessionId}`);
    console.log('='.repeat(60));

    // Mensagem inicial
    const opening = randomChoice(persona.openings);
    console.log(`\n👤 Lead: ${opening}`);

    // Envia mensagem (histórico vazio e role do agente)
    const response1 = await sendMessage(sessionId, opening, agent.role, []);
    console.log(`🤖 ${agent.name}: ${response1.substring(0, 200)}${response1.length > 200 ? '...' : ''}`);

    // Atualiza histórico local
    messages.push({ role: 'user', content: opening });
    messages.push({ role: 'assistant', content: response1 });

    // Follow-ups (2-4 mensagens)
    const numFollowUps = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numFollowUps && i < persona.followUps.length; i++) {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000)); // Delay humano

        const followUp = persona.followUps[i];
        console.log(`\n👤 Lead: ${followUp}`);

        // Envia mensagem com histórico atual e role do agente
        const response = await sendMessage(sessionId, followUp, agent.role, messages);
        console.log(`🤖 ${agent.name}: ${response.substring(0, 200)}${response.length > 200 ? '...' : ''}`);

        // Atualiza histórico local
        messages.push({ role: 'user', content: followUp });
        messages.push({ role: 'assistant', content: response });
    }

    const duration = Date.now() - startTime;
    const success = !messages.some(m => m.content.includes('ERRO'));

    console.log(`\n✅ Conversa concluída em ${(duration / 1000).toFixed(1)}s`);

    // Salvar dados de treinamento
    await saveTrainingData({
        sessionId,
        persona: persona.name,
        scenario: 'training',
        messages,
        success,
        duration,
        agentRole: agent.role
    });
}

// ============== LOOP PRINCIPAL ==============

async function runTraining() {
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║           LUMAX MULTI-AGENT TRAINER v2.0                 ║');
    console.log('║           Treinamento de Enxame de Agentes               ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║  Modo: ${isInfinite ? 'INFINITO' : 'CICLO ÚNICO'}                                      ║`);
    console.log(`║  Agente Focado: ${targetAgent || 'TODOS (Random)'}                             ║`);
    console.log(`║  Cenários por ciclo: ${scenariosPerCycle}                                  ║`);
    console.log(`║  API: ${API_URL.substring(0, 40)}                      ║`);
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('\n🚀 Iniciando simulação...\n');

    let cycle = 1;
    let totalConversations = 0;

    do {
        console.log(`\n📊 === CICLO ${cycle} ===`);

        for (let i = 0; i < scenariosPerCycle; i++) {
            await simulateConversation();
            totalConversations++;

            if (i < scenariosPerCycle - 1) {
                console.log(`\n⏳ Aguardando ${delayMs / 1000}s antes da próxima conversa...`);
                await new Promise(r => setTimeout(r, delayMs));
            }
        }

        console.log(`\n📈 Ciclo ${cycle} concluído. Total de conversas: ${totalConversations}`);
        cycle++;

        if (isInfinite) {
            console.log('\n🔄 Modo infinito ativo. Próximo ciclo em 5s... (Ctrl+C para parar)');
            await new Promise(r => setTimeout(r, 5000));
        }

    } while (isInfinite);

    console.log('\n✨ Treinamento concluído!');
    console.log(`📊 Total de conversas simuladas: ${totalConversations}`);
}

// Executar
runTraining().catch(console.error);
