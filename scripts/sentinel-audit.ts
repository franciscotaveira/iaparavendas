
const BASE_URL = 'http://localhost:3001';

async function runAudit() {
    console.log('🕵️ SENTINEL AUDIT INITIATED');
    console.log('=============================');

    // 1. Check Health Endpoint
    try {
        const start = Date.now();
        const health = await fetch(`${BASE_URL}/api/monitor/status`);
        const duration = Date.now() - start;

        if (health.status === 200) {
            console.log(`✅ [SYSTEM] Health Check OK (${duration}ms)`);
        } else {
            console.error(`❌ [SYSTEM] Health Check FAILED (${health.status})`);
            process.exit(1);
        }
    } catch (e) {
        console.error(`❌ [SYSTEM] Connection Refused. Is server running?`);
        process.exit(1);
    }

    // 2. Simulate User Chat
    console.log('\n💬 Testing Chat Intelligence...');
    const sessionId = `audit_${Date.now()}`;

    try {
        const startChat = Date.now();
        const chatRes = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Olá, gostaria de saber mais sobre automação.' }],
                sessionId,
                stream: false // Teste síncrono para validar JSON
            })
        });

        const chatDuration = Date.now() - startChat;
        const data: any = await chatRes.json();

        if (chatRes.status === 200 && data.text && data.text.length > 0) {
            console.log(`✅ [CHAT] Response received (${chatDuration}ms)`);
            console.log(`   Answer: "${data.text.substring(0, 50)}..."`);
        } else {
            console.error(`❌ [CHAT] Failed to generate response.`);
            console.error(data);
        }

    } catch (e) {
        console.error(`❌ [CHAT] Error during chat simulation:`, e);
    }

    console.log('\n=============================');
    console.log('🛡️ AUDIT COMPLETE.');
}

runAudit();
