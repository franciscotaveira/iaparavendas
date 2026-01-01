'use client';
import { useState } from 'react';
import { Bot, Play, RefreshCcw } from 'lucide-react';

export default function SimulationPage() {
    console.log("[Simulation] Render started"); // Debug Trigger
    const [client, setClient] = useState<'haven' | 'sora'>('haven');
    const [chat, setChat] = useState<{ role: string, content: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const configs = {
        haven: {
            botName: 'Bella',
            companyName: 'Haven Escovaria',
            tone: 'Animada, Best Friend, usa emojis ✨',
            offer: 'Escova Modelada (R$ 80), Hidratação Glow (R$ 120)',
            rules: 'Focar em rapidez. Oferecer 2 horários.'
        },
        sora: {
            botName: 'Luna',
            companyName: 'Sora Ritual Spa',
            tone: 'Calma, Terapêutica, Premium, usa 🌿',
            offer: 'Ritual de Desconexão (R$ 500), Massagem Express (R$ 180)',
            rules: 'Vender a experiência de paz. Nunca dar desconto, justificar valor.'
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const newMsg = { role: 'user', content: input };
        const newChat = [...chat, newMsg];
        setChat(newChat);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newChat,
                    stream: false,
                    ...configs[client],
                    sessionId: `sim_${client}_${Date.now()}`
                })
            });
            const data = await res.json();
            setChat([...newChat, { role: 'assistant', content: data.text }]);
        } catch (e) {
            setChat([...newChat, { role: 'assistant', content: 'Erro na simulação.' }]);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Bot className="text-blue-500" /> Simulador de Implantação
            </h1>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => { setClient('haven'); setChat([]); }}
                    className={`px-6 py-3 rounded border ${client === 'haven' ? 'bg-pink-600 border-pink-500' : 'border-white/20 hover:bg-white/10'}`}
                >
                    💇‍♀️ Haven Escovaria
                </button>
                <button
                    onClick={() => { setClient('sora'); setChat([]); }}
                    className={`px-6 py-3 rounded border ${client === 'sora' ? 'bg-green-700 border-green-500' : 'border-white/20 hover:bg-white/10'}`}
                >
                    🌿 Sora Spa
                </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* CONFIG CARD */}
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold mb-4 text-gray-300">Configuração Ativa</h3>
                    <pre className="text-xs text-green-400 overflow-auto whitespace-pre-wrap">
                        {JSON.stringify(configs[client], null, 2)}
                    </pre>
                </div>

                {/* CHAT PREVIEW */}
                <div className="h-[500px] bg-gray-900 rounded-xl border border-white/10 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chat.map((m, i) => (
                            <div key={i} className={`p-3 rounded-lg max-w-[80%] text-sm ${m.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-700'}`}>
                                <strong>{m.role === 'user' ? 'Você' : configs[client].botName}:</strong> {m.content}
                            </div>
                        ))}
                        {loading && <div className="text-gray-500 text-xs animate-pulse">Digitando...</div>}
                    </div>
                    <div className="p-4 border-t border-white/10 flex gap-2">
                        <input
                            className="flex-1 bg-black border border-white/20 rounded px-3 py-2 text-sm"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Digite como um cliente..."
                        />
                        <button onClick={handleSend} className="p-2 bg-blue-600 rounded hover:bg-blue-500">
                            <Play size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
