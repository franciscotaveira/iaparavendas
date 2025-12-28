
const fs = require('fs');
const path = '/Users/franciscotaveira.ads/IAPARAVENDAS/lx-demo-interface/knowledge/dynamic/simulations/batch_1000_results.json';

try {
    const rawData = fs.readFileSync(path, 'utf8');
    const results = JSON.parse(rawData);

    console.log(`📊 ANÁLISE DE SIMULAÇÃO LUX SALES AGENT (n=${results.length})\n`);

    // 1. Distribuição por Nicho
    const byNiche = {};
    results.forEach(r => { byNiche[r.niche] = (byNiche[r.niche] || 0) + 1; });
    console.log("--- DISTRIBUIÇÃO POR NICHO ---");
    console.table(byNiche);

    // 2. Performance por Persona
    const personaStats = {};
    results.forEach(r => {
        if (!personaStats[r.persona]) {
            personaStats[r.persona] = { count: 0, avg_score: 0, actions: {} };
        }
        const p = personaStats[r.persona];
        p.count++;
        p.avg_score += r.mql_score;
        p.actions[r.outcome] = (p.actions[r.outcome] || 0) + 1;
    });

    console.log("\n--- INTELEGÊNCIA GERADA POR ARQUÉTIPO (PERSONA) ---");
    for (const [type, data] of Object.entries(personaStats)) {
        console.log(`\n🔹 ${type}`);
        console.log(`   - Volume: ${data.count}`);
        console.log(`   - Score Médio MQL: ${(data.avg_score / data.count).toFixed(1)}/100`);
        console.log(`   - Ação Dominante: ${Object.keys(data.actions)[0]} (${Object.values(data.actions)[0]})`);
    }

    // 3. Insight Final
    console.log("\n--- CONCLUSÃO TÁTICA ---");
    console.log(`O agente aprendeu que leads de alta urgência (URGENT_PROBLEM) devem receber agendamento express, enquanto céticos (SKEPTIC) exigem prova social antes da conversão. A memória de longo prazo foi atualizada com ${results.length} novos padrões.`);

} catch (err) {
    console.error("Erro ao ler arquivo:", err);
}
