'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function DemoChat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-[600px] w-full max-w-md bg-zinc-950 border-2 border-zinc-700/80 rounded-2xl shadow-[0_0_50px_-15px_rgba(59,130,246,0.3)] overflow-hidden relative ring-1 ring-white/10">
            {/* Premium Glass Header */}
            <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-zinc-900/90 to-transparent z-20 pointer-events-none" />

            <header className="flex items-center justify-between px-6 py-4 bg-zinc-900/50 backdrop-blur-md z-30 border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-zinc-100 tracking-wide">Agente de Vendas</h1>
                        <p className="text-[10px] text-blue-400 font-mono uppercase tracking-wider">I.A. Cognitiva Ativa</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-green-500 tracking-wide">ON</span>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pt-6">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-6 opacity-60">
                        <div className="w-20 h-20 rounded-full bg-zinc-900/50 flex items-center justify-center border border-zinc-800/50">
                            <Bot className="w-10 h-10 text-zinc-700" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-sm font-medium text-zinc-300">Adaptável a qualquer negócio</p>
                            <p className="text-xs max-w-[220px] mx-auto text-zinc-500">
                                A I.A. entende regras de Varejo, Serviços, B2B e mais. Escolha um cenário ou digite o seu:
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 w-full max-w-[240px]">
                            <button
                                onClick={() => append({ role: 'user', content: "Tenho uma imobiliária e quero qualificar leads automaticamente." })}
                                className="text-xs bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 p-2.5 rounded-lg text-zinc-400 transition-colors text-left hover:text-blue-400 hover:border-blue-500/30 flex items-center gap-2"
                            >
                                <span>🏢</span> Simular Imobiliária
                            </button>
                            <button
                                onClick={() => append({ role: 'user', content: "Sou médico e quero preencher minha agenda." })}
                                className="text-xs bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 p-2.5 rounded-lg text-zinc-400 transition-colors text-left hover:text-blue-400 hover:border-blue-500/30 flex items-center gap-2"
                            >
                                <span>⚕️</span> Simular Clínica/Consultório
                            </button>
                            <button
                                onClick={() => append({ role: 'user', content: "Tenho um negócio de serviços e quero vender mais." })}
                                className="text-xs bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 p-2.5 rounded-lg text-zinc-400 transition-colors text-left hover:text-green-400 hover:border-green-500/30 flex items-center gap-2"
                            >
                                <span>🚀</span> Outro Segmento (Testar)
                            </button>
                        </div>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={clsx(
                                "flex gap-3 text-sm leading-relaxed",
                                m.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div
                                className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-lg",
                                    m.role === 'user'
                                        ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                                        : "bg-blue-600/20 border-blue-500/30 text-blue-400"
                                )}
                            >
                                {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>

                            <div
                                className={clsx(
                                    "px-4 py-3 rounded-2xl max-w-[85%] shadow-md",
                                    m.role === 'user'
                                        ? "bg-zinc-800 text-zinc-100 rounded-tr-sm"
                                        : "bg-gradient-to-br from-zinc-900 to-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm"
                                )}
                            >
                                {m.content.split('\n').map((line, i) => (
                                    <p key={i} className={clsx(i > 0 && "mt-2")}>{line}</p>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-3 text-sm leading-relaxed"
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border bg-blue-600/20 border-blue-500/30 text-blue-400">
                            <Bot size={14} />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-tl-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce"></span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 relative z-30">
                <form onSubmit={handleSubmit} className="relative flex items-center group">
                    <input
                        className="w-full bg-zinc-900/50 text-zinc-100 border border-zinc-800 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-zinc-600 text-sm shadow-inner"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Converse com a IA..."
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-0 disabled:scale-75 shadow-lg shadow-blue-600/20"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
