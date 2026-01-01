'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Database, Cpu, Terminal, Shield } from 'lucide-react';

export default function NeuralDeck() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/neural', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.content,
                    history: messages
                })
            });

            const data = await res.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.text,
                toolsUsed: data.toolsUsed
            }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'system', content: '❌ Erro de conexão com o Núcleo Neural.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-[#050505] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {/* Header Neural */}
            <div className="bg-[#0a0a0a] border-b border-green-500/20 p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30">
                        <Cpu className="w-6 h-6 text-green-500 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-lg font-mono font-bold text-green-500 tracking-wider">NEURAL DECK</h2>
                        <p className="text-[10px] text-green-800 uppercase">Sovereign Intelligence Module v1.0</p>
                    </div>
                </div>
                <div className="flex gap-4 text-xs font-mono text-neutral-500">
                    <span className="flex items-center gap-1"><Database className="w-3 h-3" /> DATA: CONNECTED</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SECURITY: MAX</span>
                    <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> MODE: ROOT</span>
                </div>
            </div>

            {/* Terminal Screen */}
            <div className="flex-1 bg-black p-6 overflow-y-auto font-mono text-sm space-y-6" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-700 space-y-4 opacity-50">
                        <Cpu className="w-24 h-24" />
                        <p className="text-center max-w-md">
                            "Eu sou a Inteligência Soberana da sua empresa.
                            Tenho acesso total aos dados, logs e diretrizes.
                            Me dê uma ordem estratégica."
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <span className="bg-white/5 px-3 py-1 rounded border border-white/5">"Analise a performance de ontem"</span>
                            <span className="bg-white/5 px-3 py-1 rounded border border-white/5">"Reescreva o prompt de vendas"</span>
                            <span className="bg-white/5 px-3 py-1 rounded border border-white/5">"Busque tendências de mercado"</span>
                            <span className="bg-white/5 px-3 py-1 rounded border border-white/5">"Audite a conversa do Lead X"</span>
                        </div>
                    </div>
                )}

                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-neutral-800' :
                                m.role === 'system' ? 'bg-red-900/20 text-red-500' : 'bg-green-900/20 text-green-500'
                            }`}>
                            {m.role === 'user' ? <User className="w-4 h-4" /> : m.role === 'system' ? <Shield className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        <div className={`max-w-[80%] p-4 rounded border ${m.role === 'user'
                                ? 'bg-neutral-900 border-neutral-800 text-neutral-200'
                                : m.role === 'system'
                                    ? 'bg-red-950/10 border-red-900/30 text-red-400'
                                    : 'bg-[#0f1510] border-green-500/20 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                            }`}>
                            <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                            {m.toolsUsed && (
                                <div className="mt-3 pt-3 border-t border-green-500/20 text-[10px] text-green-700 font-mono">
                                    🛠️ FERRAMENTAS: {m.toolsUsed.join(', ')}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded bg-green-900/20 flex items-center justify-center text-green-500">
                            <Bot className="w-4 h-4 animate-bounce" />
                        </div>
                        <div className="flex items-center gap-1 text-green-800 font-mono text-xs mt-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                            PROCESSANDO DADOS CORPORATIVOS...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Command Line */}
            <div className="p-4 bg-[#0a0a0a] border-t border-white/10">
                <div className="flex gap-2 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 font-mono">{'>'}</div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Digite um comando para o Núcleo..."
                        className="w-full bg-[#050505] text-green-400 font-mono pl-8 pr-12 py-3 rounded border border-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 outline-none transition-all placeholder:text-green-900"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-500 hover:text-green-500 disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center mt-2 text-[10px] text-neutral-600 font-mono">
                    LXC PROPRIETARY INTELLIGENCE SYSTEM • ACCESS LEVEL: OWNER
                </div>
            </div>
        </div>
    );
}
