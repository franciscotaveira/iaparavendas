
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PenTool, Lightbulb, Share2, Layers, Image as ImageIcon,
    MessageSquare, Hash, Wand2, Calendar, ArrowLeft, Send
} from 'lucide-react';
import Link from 'next/link';
import AntigravityPortal from '@/components/AntigravityPortal';

export default function NexusCreativeHub() {
    const [activeTab, setActiveTab] = useState<'ideation' | 'editor' | 'schedule'>('ideation');
    const [ideaInput, setIdeaInput] = useState('');
    const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock de geração de ideias
    const generateIdeas = () => {
        if (!ideaInput) return;
        setIsGenerating(true);
        setTimeout(() => {
            setGeneratedIdeas([
                `Como a IA está mudando o mercado de vendas em 2026? Foco em ${ideaInput}`,
                `3 Dicas para otimizar ${ideaInput} usando automação inteligente.`,
                `Case de Sucesso: Aumentando conversão com ${ideaInput} e Agentes Autônomos.`,
                `O futuro do trabalho: Humanos + ${ideaInput} colaborando.`
            ]);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <main
            className="min-h-screen p-6 font-sans relative overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            <AntigravityPortal />

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] pointer-events-none" />

            {/* Header */}
            <header className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-3 rounded-xl transition-all hover:brightness-110"
                        style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}
                    >
                        <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                            Nexus Creative Hub <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border" style={{ borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'var(--accent-soft)' }}>Beta</span>
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Motor de Criação e Distribuição de Conteúdo</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                {/* SIDEBAR NAVIGATION */}
                <nav className="lg:col-span-3 space-y-2">
                    {[
                        { id: 'ideation', label: 'Laboratório de Ideias', icon: <Lightbulb className="w-4 h-4" /> },
                        { id: 'editor', label: 'Estúdio de Criação', icon: <PenTool className="w-4 h-4" /> },
                        { id: 'schedule', label: 'Agendamento', icon: <Calendar className="w-4 h-4" /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all text-sm font-medium border`}
                            style={{
                                backgroundColor: activeTab === tab.id ? 'var(--accent-soft)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                                borderColor: activeTab === tab.id ? 'var(--accent)' : 'transparent'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}

                    <div className="mt-8 p-6 rounded-2xl border border-dashed" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50" style={{ color: 'var(--text-muted)' }}>Insights Recentes</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-xs opacity-70" style={{ color: 'var(--text-secondary)' }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Post sobre "Vendas IA" performou +15%
                            </div>
                            <div className="flex items-center gap-3 text-xs opacity-70" style={{ color: 'var(--text-secondary)' }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Melhor horário: 10:00 AM
                            </div>
                        </div>
                    </div>
                </nav>

                {/* MAIN CONTENT AREA */}
                <section className="lg:col-span-9">

                    {/* IDEATION MODULE */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'ideation' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="p-8 rounded-[32px] border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                                        <Wand2 className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                                        O que vamos criar hoje?
                                    </h2>
                                    <div className="relative">
                                        <input
                                            value={ideaInput}
                                            onChange={(e) => setIdeaInput(e.target.value)}
                                            placeholder="Ex: Automação de WhatsApp para Clínicas..."
                                            className="w-full border rounded-2xl px-6 py-4 text-base focus:outline-none transition-all"
                                            style={{
                                                backgroundColor: 'var(--bg-secondary)',
                                                borderColor: 'var(--border)',
                                                color: 'var(--text-primary)'
                                            }}
                                            onKeyDown={(e) => e.key === 'Enter' && generateIdeas()}
                                        />
                                        <button
                                            onClick={generateIdeas}
                                            disabled={isGenerating}
                                            className="absolute right-2 top-2 bottom-2 px-6 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                                        >
                                            {isGenerating ? <Cpu className="w-4 h-4 animate-spin" /> : 'Gerar'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {generatedIdeas.map((idea, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-6 rounded-3xl border transition-all cursor-pointer group"
                                            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                                            onClick={() => { setActiveTab('editor'); }}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] uppercase font-mono px-2 py-1 rounded" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-soft)' }}>Ideia #{i + 1}</span>
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" style={{ color: 'var(--text-primary)' }} />
                                            </div>
                                            <p className="font-medium leading-relaxed group-hover:opacity-100 opacity-80 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                                                "{idea}"
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* EDITOR MODULE (PLACEHOLDER) */}
                        {activeTab === 'editor' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                                <div className="flex-1 border rounded-[32px] p-8 min-h-[500px] flex flex-col" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                                    <div className="flex items-center justify-between mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
                                        <div className="flex gap-4">
                                            <button className="p-2 hover:bg-white/5 rounded-lg transition-all"><ImageIcon className="w-5 h-5 opacity-50" style={{ color: 'var(--text-muted)' }} /></button>
                                            <button className="p-2 hover:bg-white/5 rounded-lg transition-all"><Hash className="w-5 h-5 opacity-50" style={{ color: 'var(--text-muted)' }} /></button>
                                            <button className="p-2 hover:bg-white/5 rounded-lg transition-all"><Layers className="w-5 h-5 opacity-50" style={{ color: 'var(--text-muted)' }} /></button>
                                        </div>
                                        <button className="px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all" style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}>
                                            <Share2 className="w-4 h-4" /> Publicar Agora
                                        </button>
                                    </div>
                                    <textarea
                                        className="w-full flex-1 bg-transparent border-none resize-none focus:outline-none text-lg leading-relaxed Placeholder-opacity-50"
                                        style={{ color: 'var(--text-primary)' }}
                                        placeholder="Comece a escrever sua obra prima..."
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* SCHEDULE MODULE (PLACEHOLDER) */}
                        {activeTab === 'schedule' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-[500px]">
                                <div className="text-center opacity-40" style={{ color: 'var(--text-muted)' }}>
                                    <Calendar className="w-16 h-16 mx-auto mb-4" />
                                    <p>Calendário de Publicação em Desenvolvimento</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </section>
            </div>
        </main>
    );
}
