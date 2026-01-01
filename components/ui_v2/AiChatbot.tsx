"use client";

import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { chatWithAssistant } from './services/ai';

export const AiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Olá! Sou o assistente Lx OPS. Posso ajudar com configurações de agentes ou governança?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await chatWithAssistant(userMsg, messages);

    setMessages(prev => [...prev, { role: 'model', text: response || "Erro ao conectar." }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 flex items-center justify-center transition-transform hover:scale-105"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-indigo-900 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <Bot size={20} />
              <span className="font-bold">Lx Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-slate-100 border-none rounded-full px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Pergunte algo..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};