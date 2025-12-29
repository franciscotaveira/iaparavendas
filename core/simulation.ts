// ============================================
// LX WAR ROOM - SIMULATION RUNNER
// ============================================
// Simula uma "Sala de Guerra" onde múltiplos agentes
// resolvem um problema complexo de negócio juntos.
// ============================================

import { council } from './council';
import { AgentRole } from './agents';

async function runSimulation(scenario: string) {
    console.log('\n🔴 INICIANDO WAR ROOM...');
    console.log(`📝 CENÁRIO: "${scenario}"\n`);

    // 1. O CEO define a estratégia inicial
    console.log('👤 CEO (Ricardo) está analisando o cenário...');
    const strategy = await council.askAgent('ops_ceo',
        `Defina a estratégia de alto nível para resolver: "${scenario}". Seja direto.`);
    console.log(`\n🗣️ CEO:\n${strategy}\n`);

    // 2. O Council se reúne para táticas específicas
    console.log('👥 Convocando o conselho de especialistas...');
    const discussion = await council.consult({
        question: `Com base na estratégia do CEO: "${strategy}", o que sua área deve fazer para resolver o cenário: "${scenario}"?`,
        max_agents: 4,
        include_synthesis: true
    });

    // 3. Exibir opiniões dos especialistas
    console.log('\n📊 OPINIÕES DOS ESPECIALISTAS:\n');
    discussion.opinions.forEach(op => {
        console.log(`👤 ${op.agent.name} (${op.agent.title}):`);
        console.log(`"${op.opinion.slice(0, 150)}..."`);
        console.log(`👉 Ação sugerida: ${op.suggested_actions?.[0] || 'Analisar mais dados'}\n`);
    });

    // 4. Síntese final e Plano de Ação
    console.log('\n✅ PLANO DE AÇÃO CONSOLIDADO:');
    console.log(discussion.synthesis);

    console.log('\n🚀 PRÓXIMOS PASSOS IMEDIATOS:');
    discussion.recommended_actions.slice(0, 3).forEach((action, i) => {
        console.log(`${i + 1}. ${action}`);
    });

    console.log('\n🏁 WAR ROOM ENCERRADA\n');
}

// Executar se chamado diretamente
if (require.main === module) {
    const scenario = process.argv[2] || "Lançar um novo SaaS de IA para advogados, com pouco budget de marketing.";
    runSimulation(scenario).catch(console.error);
}

export { runSimulation };
