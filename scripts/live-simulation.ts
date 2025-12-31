
import { HAVEN_ESCOVARIA } from './clients-config';
const BASE_URL = 'http://localhost:3001';

// Função auxiliar para delay dramático
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function simulateChat(message: string) {
    console.log(`\n📱 WHATSAPP: Cliente enviou: "${message}"`);
    await sleep(1000);
    console.log(`⚙️  SISTEMA: Recebido. Encaminhando para Agente [${HAVEN_ESCOVARIA.botName}]...`);

    const start = Date.now();
    try {
        const res = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: message }],
                sessionId: `live_sim_${Date.now()}`,
                botName: HAVEN_ESCOVARIA.botName,
                companyName: HAVEN_ESCOVARIA.companyName,
                niche: HAVEN_ESCOVARIA.niche,
                tone: HAVEN_ESCOVARIA.tone,
                offer: HAVEN_ESCOVARIA.offer,
                stream: false
            })
        });

        const data: any = await res.json();
        const duration = Date.now() - start;

        console.log(`🧠 CÉREBRO: Processado em ${duration}ms.`);
        console.log(`💬 ${HAVEN_ESCOVARIA.botName.toUpperCase()} RESPONDE:`);
        console.log(`   "${data.text}"`);

    } catch (e) {
        console.log("❌ ERRO NA SIMULAÇÃO:", e);
    }
}

async function runTheater() {
    console.clear();
    console.log("==============================================");
    console.log("🎭  SIMULAÇÃO AO VIVO: JORNADA DO CLIENTE HAVEN");
    console.log("==============================================");
    console.log(`🏢 Empresa: ${HAVEN_ESCOVARIA.companyName}`);
    console.log(`🤖 Agente: ${HAVEN_ESCOVARIA.botName}`);
    console.log(`🎯 Missão: ${HAVEN_ESCOVARIA.tone}`);
    console.log("==============================================\n");

    await sleep(2000);

    // CENA 1: Cliente curioso
    await simulateChat("Oi, vocês fazem escova progressiva? Quanto tá?");

    await sleep(3000);

    // CENA 2: Cliente com pressa (Objeção)
    console.log("\n--- Cliente visualiza a resposta e lança objeção ---");
    await simulateChat("Nossa, achei meio caro. E demora muito? Tenho só 1h de almoço.");

    console.log("\n==============================================");
    console.log("🏁  FIM DA SIMULAÇÃO");
    console.log("==============================================");
}

runTheater();
