'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile, Mic, CheckCheck } from 'lucide-react';

export default function WhatsAppSimulatorPage() {
    const sessionId = useRef(`WPP-SIM-${Math.floor(Math.random() * 9000) + 1000}`).current;

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        body: { sessionId },
        initialMessages: [
            {
                id: 'welcome',
                role: 'assistant',
                content: 'Olá! Sou o Assistente Virtual da sua empresa. Como posso ajudar hoje?'
            }
        ]
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4">

            {/* Phone Container */}
            <div className="w-[380px] h-[750px] bg-black rounded-[40px] border-[8px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">

                {/* Notch/Status Bar */}
                <div className="h-8 bg-black w-full flex justify-between items-center px-6 text-white text-xs font-medium z-20">
                    <span>9:41</span>
                    <div className="flex gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-black border border-white/20 flex items-center justify-center text-[8px]">5G</div>
                        <div className="w-4 h-2.5 border border-white/30 rounded-[2px] relative">
                            <div className="absolute inset-0.5 bg-white w-3/4"></div>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Header */}
                <div className="bg-[#075E54] p-3 text-white flex items-center justify-between shadow-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-[#075E54] font-bold text-sm relative">
                            LX
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#075E54] rounded-full"></span>
                        </div>
                        <div>
                            <h1 className="font-semibold text-sm">LX Assistant</h1>
                            <p className="text-[10px] text-white/80">online agora</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/80">
                        <Video size={18} />
                        <Phone size={18} />
                        <MoreVertical size={18} />
                    </div>
                </div>

                {/* Chat Background & Messages */}
                <div className="flex-1 bg-[#ECE5DD] relative overflow-hidden flex flex-col">
                    {/* Doodle Background Pattern (css pattern simulation) */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(#4a4a4a 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 z-10 custom-scrollbar">
                        {/* Day Divider */}
                        <div className="flex justify-center mb-4">
                            <span className="bg-[#E1F3FB] text-slate-600 text-[10px] py-1 px-3 rounded-lg shadow-sm font-medium">
                                Hoje
                            </span>
                        </div>

                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                                        max-w-[80%] rounded-lg p-2 text-sm shadow-sm relative group
                                        ${m.role === 'user'
                                            ? 'bg-[#DCF8C6] text-black rounded-tr-none'
                                            : 'bg-white text-black rounded-tl-none'}
                                    `}
                                >
                                    <p className="leading-relaxed whitespace-pre-wrap text-[13px]">{m.content}</p>
                                    <div className="flex justify-end items-center gap-1 mt-1 -mb-1">
                                        <span className="text-[9px] text-slate-400">
                                            {getCurrentTime()}
                                        </span>
                                        {m.role === 'user' && (
                                            <CheckCheck size={12} className="text-blue-500" />
                                        )}
                                    </div>

                                    {/* Triangle Tail */}
                                    <div className={`
                                        absolute top-0 w-3 h-3 
                                        ${m.role === 'user'
                                            ? '-right-1.5 bg-[#DCF8C6] [clip-path:polygon(0_0,100%_0,0_100%)]'
                                            : '-left-1.5 bg-white [clip-path:polygon(0_0,100%_0,100%_100%)]'}
                                    `}></div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-lg p-3 rounded-tl-none shadow-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-[#f0f0f0] p-2 flex items-center gap-2 z-20">
                        <button className="text-slate-500 hover:text-slate-700">
                            <Smile size={20} />
                        </button>
                        <button className="text-slate-500 hover:text-slate-700">
                            <Paperclip size={20} />
                        </button>

                        <form onSubmit={handleSubmit} className="flex-1">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Mensagem"
                                className="w-full py-2 px-4 rounded-full border-none focus:outline-none focus:ring-1 focus:ring-slate-300 text-sm bg-white shadow-sm placeholder:text-slate-400 text-black"
                            />
                        </form>

                        {input.trim() ? (
                            <button
                                onClick={(e) => handleSubmit(e as any)}
                                className="w-10 h-10 bg-[#075E54] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#064e46] transition-colors"
                            >
                                <Send size={18} className="translate-x-0.5 translate-y-0.5" />
                            </button>
                        ) : (
                            <button className="w-10 h-10 bg-[#075E54] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#064e46] transition-colors">
                                <Mic size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Home Indicator */}
                <div className="h-1 w-32 bg-white/20 rounded-full mx-auto my-2 mb-4"></div>
            </div>

            {/* Side Info */}
            <div className="hidden lg:flex flex-col ml-12 max-w-sm">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 mb-4">
                    WhatsApp Simulator
                </h2>
                <div className="space-y-4">
                    <p className="text-slate-400 leading-relaxed">
                        Este é o ambiente de teste de homologação. O que você vê aqui é
                        <span className="text-white font-bold"> exatamente </span>
                        como o cliente verá no WhatsApp.
                    </p>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                            <CheckCheck size={16} /> Status da Conexão
                        </h3>
                        <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                            <span>API Latency</span>
                            <span className="text-green-400 font-mono">124ms</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                            <span>Knowledge Base</span>
                            <span className="text-amber-400 font-mono">Active</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-300">
                            <span>ManyChat Hook</span>
                            <span className="text-blue-400 font-mono">Ready</span>
                        </div>
                    </div>

                    <div className="text-xs text-slate-600 font-mono">
                        ID: {sessionId}
                        <br />
                        Build: v2.4.9 (Stable)
                    </div>
                </div>
            </div>
        </div>
    );
}
