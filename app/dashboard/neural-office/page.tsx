
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Cpu, Shield, Brain, Terminal,
    GraduationCap, MessageSquare, ArrowLeft, Activity
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface AgentData {
    id: string;
    service_id: string;
    service_name: string;
    service_type: string;
    status: string;
    current_task: string;
    x?: number;
    y?: number;
}

// Fallback Mock (enquanto conecta)
const MOCK_AGENTS: AgentData[] = [
    { id: '1', service_id: 'jules', service_name: 'Jules', service_type: 'dev', status: 'coding', current_task: 'System Refactor' },
    { id: '2', service_id: 'sdr', service_name: 'SDR Haven', service_type: 'sales', status: 'active', current_task: 'WhatsApp Qualify' },
];

export default function NeuralOffice() {
    const [agents, setAgents] = useState<AgentData[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // 1. CARREGAR DADOS DO SUPABASE
    useEffect(() => {
        const fetchAgents = async () => {
            const { data, error } = await supabase.from('service_heartbeats').select('*');
            if (data) {
                // Adiciona posições aleatórias estáveis se for o primeiro load
                const positionedAgents = data.map((agent, i) => ({
                    ...agent,
                    id: agent.service_id, // Usar service_id como ID único
                    x: agent.service_type === 'dev' ? 180 : agent.service_type === 'sales' ? 520 : 350 + (i * 20),
                    y: agent.service_type === 'dev' ? 140 : agent.service_type === 'sales' ? 180 : 350 + (i * 20)
                }));
                setAgents(positionedAgents);
                setIsConnected(true);
            } else {
                // Fallback se não tiver dados ou conexão falhar
                setAgents(MOCK_AGENTS.map((a, i) => ({ ...a, x: 200 + i * 50, y: 200 + i * 30 })));
            }
        };

        fetchAgents();

        // Realtime Subscription
        const channel = supabase
            .channel('neural-office-live')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'service_heartbeats' }, (payload) => {
                fetchAgents(); // Recarrega tudo por simplicidade (poderia ser otimizado)
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // 2. MOVIMENTO ORGÂNICO (GATHER STYLE)
    useEffect(() => {
        const interval = setInterval(() => {
            setAgents(prev => prev.map(agent => ({
                ...agent,
                x: (agent.x || 0) + (Math.random() - 0.5) * 10,
                y: (agent.y || 0) + (Math.random() - 0.5) * 10,
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const sectors = [
        { id: "dev", name: "Engenharia", x: 40, y: 60, w: 280, h: 220, icon: <Terminal className="w-4 h-4" /> },
        { id: "sales", name: "Vendas (WABA)", x: 460, y: 60, w: 320, h: 260, icon: <MessageSquare className="w-4 h-4" /> },
        { id: "school", name: "Academia Elite", x: 260, y: 340, w: 300, h: 240, icon: <GraduationCap className="w-4 h-4" /> },
        { id: "ops", name: "Operações", x: 620, y: 340, w: 180, h: 240, icon: <Shield className="w-4 h-4" /> },
    ];

    // Helpers
    const getSector = (type: string) => {
        if (type.includes('dev')) return 'Engenharia';
        if (type.includes('sale') || type.includes('sdr')) return 'Vendas';
        if (type.includes('educ') || type.includes('school')) return 'Academia';
        return 'Operações';
    }

    return (
        <main
            className="min-h-screen overflow-hidden relative font-sans"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            {/* Grid Background */}
            <div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle, var(--accent) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Header */}
            <div className="absolute top-6 left-6 z-50 flex items-center gap-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)'
                    }}
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Link>
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                        Neural Office
                        {isConnected && <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                    </h1>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Escritório Virtual • {agents.length} agentes online
                    </p>
                </div>
            </div>

            {/* Mapa do Escritório */}
            <div className="relative w-full h-screen p-16 pt-24">

                {/* Setores */}
                {sectors.map(sector => (
                    <div
                        key={sector.id}
                        className="absolute rounded-3xl p-6 transition-all hover:scale-[1.01]"
                        style={{
                            left: sector.x,
                            top: sector.y,
                            width: sector.w,
                            height: sector.h,
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border)'
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2 opacity-50">
                            <span style={{ color: 'var(--accent)' }}>{sector.icon}</span>
                            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                                {sector.name}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Agentes (Renderizados como 'Personagens') */}
                {agents.map(agent => (
                    <motion.div
                        key={agent.service_id}
                        animate={{ x: agent.x, y: agent.y }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="absolute cursor-pointer z-40 group"
                        onClick={() => setSelectedAgent(agent)}
                    >
                        {/* Avatar */}
                        <div className="relative">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                                style={{
                                    backgroundColor: agent.status === 'error' ? '#ef4444' : 'var(--accent)',
                                    boxShadow: '0 0 20px var(--glow)'
                                }}
                            >
                                <Cpu className="w-6 h-6" style={{ color: 'var(--bg-primary)' }} />
                            </div>

                            {/* Balão de Status */}
                            <div
                                className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl text-[10px] font-medium whitespace-nowrap shadow-sm"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                {agent.current_task ? agent.current_task.substring(0, 15) + '...' : 'Idle'}
                            </div>

                            {/* Nome */}
                            <div
                                className="absolute top-14 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                {agent.service_name}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Painel Lateral de Detalhes */}
            <AnimatePresence>
                {selectedAgent && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        className="fixed top-0 right-0 w-96 h-full z-[100] p-8 shadow-2xl"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderLeft: '1px solid var(--border)'
                        }}
                    >
                        <button
                            onClick={() => setSelectedAgent(null)}
                            className="mb-8 text-xs font-medium uppercase tracking-widest hover:text-white transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            [ Fechar Perfil ]
                        </button>

                        <div className="space-y-8">
                            <div
                                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl"
                                style={{ backgroundColor: 'var(--accent)' }}
                            >
                                <Brain className="w-10 h-10" style={{ color: 'var(--bg-primary)' }} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                                    {selectedAgent.service_name}
                                </h2>
                                <p className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--accent)' }}>
                                    {getSector(selectedAgent.service_type)} Agent • ID: {selectedAgent.service_id}
                                </p>
                            </div>

                            <div
                                className="p-6 rounded-2xl space-y-4"
                                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                            >
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest mb-1 opacity-50" style={{ color: 'var(--text-muted)' }}>
                                        Status Atual
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${selectedAgent.status === 'working' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <p className="text-sm font-bold capitalize" style={{ color: 'var(--text-primary)' }}>
                                            {selectedAgent.status}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-widest mb-1 opacity-50" style={{ color: 'var(--text-muted)' }}>
                                        Processando
                                    </p>
                                    <div className="font-mono text-xs p-2 rounded bg-black/20 text-emerald-400 border border-emerald-500/10">
                                        {selectedAgent.current_task || 'Aguardando inputs...'}
                                    </div>
                                </div>
                            </div>

                            <button
                                className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-transform hover:scale-[1.02]"
                                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                            >
                                Inspecionar Memória
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
