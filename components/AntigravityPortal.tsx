
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, Command, ChevronUp, Maximize2, Headphones
} from 'lucide-react';

export default function AntigravityPortal() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: 'Sim, Comandante? O núcleo MCT OS está estabilizado. O Squad Jules está finalizando a montagem do HQ Virtual. Como posso ajudar agora?' }
    ]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const handleSend = () => {
        if (!input) return;
        const userText = input;
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInput('');
        setIsThinking(true);

        setTimeout(() => {
            setIsThinking(false);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: `Comando "${userText}" recebido. Estou orquestrando o Jules para priorizar essa tarefa.`
            }]);
        }, 1500);
    };

    return (
        <div className="fixed bottom-12 right-12 z-[300]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="absolute bottom-24 right-0 w-[400px] h-[600px] bg-black/80 border border-emerald-500/20 rounded-[48px] shadow-2xl backdrop-blur-3xl flex flex-col overflow-hidden"
                    >
                        <div className="p-8 border-b border-white/5 flex gap-4 items-center">
                            <div className="w-14 h-14 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-lg">
                                <Command className="text-black w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-white text-lg font-black tracking-tighter italic uppercase">Antigravity</h4>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <p className="text-[9px] font-mono text-emerald-500/80 uppercase tracking-widest">Active</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="ml-auto p-3 text-slate-500 hover:text-white">
                                <ChevronUp className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {messages.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-5 rounded-3xl text-[13px] leading-relaxed ${m.role === 'user'
                                            ? 'bg-white text-black font-bold'
                                            : 'bg-emerald-500/5 border border-emerald-500/10 text-slate-300'
                                        }`}>
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-3xl">
                                        <div className="flex gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-8 border-t border-white/5 bg-black/40">
                            <div className="relative">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Comando Central..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-8 py-5 text-sm text-white focus:outline-none focus:border-emerald-500/30"
                                />
                                <button onClick={handleSend} className="absolute right-3 top-3 p-2.5 bg-emerald-500 text-black rounded-2xl hover:bg-emerald-400">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-24 h-24 rounded-[40px] flex items-center justify-center shadow-2xl transition-all relative ${isOpen ? 'bg-black border border-white/10 text-white' : 'bg-emerald-500 text-black'
                    }`}
            >
                {isOpen ? <X className="w-8 h-8" /> : <Command className="w-10 h-10" />}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1">
                        <span className="animate-ping absolute h-4 w-4 rounded-full bg-red-400 opacity-75"></span>
                        <div className="relative h-4 w-4 rounded-full bg-red-500 border-4 border-black"></div>
                    </div>
                )}
            </motion.button>
        </div>
    );
}
