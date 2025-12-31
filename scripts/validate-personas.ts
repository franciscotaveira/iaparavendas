
import { HAVEN_ESCOVARIA, SORA_SPA } from './clients-config';

const BASE_URL = 'http://localhost:3001';

async function testPersona(clientConfig: any, userMessage: string) {
    console.log(`\nTesting Client: [${clientConfig.companyName}] as Agent [${clientConfig.botName}]`);
    console.log(`User says: "${userMessage}"`);

    try {
        const res = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: userMessage }],
                sessionId: `test_${clientConfig.botName.toLowerCase()}_${Date.now()}`,
                botName: clientConfig.botName,
                companyName: clientConfig.companyName,
                stream: false
            })
        });

        const data: any = await res.json();
        console.log(`Agent says: "${data.text}"`);
        return data.text;
    } catch (e) {
        console.error("Error:", e);
    }
}

async function runValidation() {
    console.log("🏁 INITIATING CLIENT IMPLANTATION TEST...");

    // 1. Teste Haven (Escovaria) - Deve ser rápido
    await testPersona(HAVEN_ESCOVARIA, "Oi, quanto tá a escova? Tenho pressa.");

    // 2. Teste Sora (Spa) - Deve ser calmo
    await testPersona(SORA_SPA, "Oi, estou precisando relaxar, o que sugere?");

    console.log("\n✅ VALIDATION COMPLETE.");
}

runValidation();
