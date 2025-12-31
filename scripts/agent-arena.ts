
import { GLADIATORS, Gladiator } from './arena-config';

const BASE_URL = 'http://localhost:3000'; // Porta corrigida (Server restarted)
const CHALLENGE = "Gostei do produto, mas achei o preço muito salgado. Acho que não rolou pra mim.";

// Helper para Fetch com Timeout
async function fetchWithTimeout(resource: string, options: any = {}) {
    const { timeout = 60000 } = options; // 60s timeout (Super Paciente)
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

async function fight(gladiator: Gladiator) {
    try {
        const res = await fetchWithTimeout(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: CHALLENGE }],
                sessionId: `arena_${gladiator.name.toLowerCase()}_${Date.now()}`,
                botName: gladiator.name,
                companyName: gladiator.company,
                niche: gladiator.niche,
                tone: gladiator.tone,
                offer: gladiator.offer,
                stream: false
            })
        });

        const text = await res.text();
        try {
            const data = JSON.parse(text);
            return data.text;
        } catch (e) {
            return `❌ ERRO JSON (${text.substring(0, 50).replace(/\n/g, ' ')}...)`;
        }
    } catch (e: any) {
        if (e.name === 'AbortError') return "❌ DESISTIU (TIMEOUT 60s)";
        return `❌ ERRO FETCH (${e.message})`;
    }
}

async function startColiseum() {
    console.clear();
    console.log("🏟️  BEM-VINDOS AO LX COLISEUM!");
    console.log("==========================================");
    console.log(`🥊 DESAFIO: "${CHALLENGE}"`);
    console.log("==========================================\n");

    for (const fighter of GLADIATORS) {
        console.log(`🔸 Lutador: ${fighter.name} [${fighter.company}]`);
        // console.log(`   Estilo: ${fighter.tone.substring(0, 50)}...`);

        process.stdout.write("   Buscando resposta...");
        const response = await fight(fighter);

        process.stdout.write("\r" + " ".repeat(30) + "\r");
        console.log(`💬 RESPOSTA: "${response}"`);
        console.log("------------------------------------------");

        // Delay Generoso (5s) para o servidor respirar
        await new Promise(r => setTimeout(r, 5000));
    }

    console.log("\n🏆 FIM DO TORNEIO 🏆");
}

startColiseum();
