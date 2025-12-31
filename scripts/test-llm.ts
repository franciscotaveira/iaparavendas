
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testOpenRouter() {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
        console.error('❌ No OPENROUTER_API_KEY found in .env.local');
        return;
    }

    console.log('Testing OpenRouter with model: meta-llama/llama-3.3-70b-instruct');

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://lux-demo.com",
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.3-70b-instruct", // A solid, likely available model
                "messages": [
                    { "role": "user", "content": "Say 'Hello from OpenRouter' if you can hear me." }
                ],
                "temperature": 0.3,
                "max_tokens": 50
            })
        });

        if (!res.ok) {
            console.error(`❌ API Error: ${res.status} ${res.statusText}`);
            const errBody = await res.text();
            console.error('Body:', errBody);
            return;
        }

        const json = await res.json();
        console.log('✅ Success!');
        console.log('Response:', json.choices?.[0]?.message?.content);
    } catch (e: any) {
        console.error('❌ Network/Code Error:', e.message);
    }
}

testOpenRouter();
