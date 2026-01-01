
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Command, Cpu, Zap, Brain, Shield, Activity,
    LayoutDashboard, Users, Terminal,
    Settings, Power, Bell, AlertTriangle, RefreshCcw,
    ShieldAlert, CheckCircle2, MoreHorizontal, Sun, Moon, Globe, PenTool
} from 'lucide-react';

import Link from 'next/link';
import AntigravityPortal from '@/components/AntigravityPortal';
import { useTheme } from '@/components/ThemeProvider';

export default function CEOCommandPortal() {
    const { theme, toggleTheme } = useTheme();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showPanicConfirm, setShowPanicConfirm] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const emergencyShutdown = () => {
        setShowPanicConfirm(true);
    };

    const confirmShutdown = () => {
        alert("🚨 PROTOCOLO DE PÂNICO ATIVADO. Todos os processos LX-Worker foram encerrados.");
        setShowPanicConfirm(false);
    };

    const rebootServer = () => {
        const confirm = window.confirm("🔄 Deseja reiniciar a instância do servidor MCT OS?");
        if (confirm) alert("Comando enviado. Aguardando reconexão do node...");
    };

    const pendingTasks = [
        { task: "Refatoração de Memória Fragmentada", status: "Em curso pelo Jules", priority: "Alta", icon: <Cpu className="w-3 h-3" /> },
        { task: "Auditoria de Prompt: SDR Haven", status: "Aguardando sua revisão", priority: "Crítica", icon: <ShieldAlert className="w-3 h-3" /> },
        { task: "Loop de Reinício Worker #502", status: "Resolvido por Antigravity", priority: "Média", icon: <CheckCircle2 className="w-3 h-3 text-accent" /> },
    ];

    const stats = [
        { label: "Agentes Ativos", value: "60/60", color: "text-accent" },
        { label: "Memória Fractal", value: "1.2 TB", color: "text-blue-500" },
        { label: "Uptime do Núcleo", value: "99.9%", color: "text-accent" },
        { label: "Créditos LLM", value: "$420.50", color: "text-amber-500" },
    ];

    return (
        <main className="min-h-screen p-6 md:p-10 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <AntigravityPortal />

            {/* PANIC MODAL */}
            <AnimatePresence>
                {showPanicConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-red-950/20 border border-red-500/30 p-12 rounded-[50px] max-w-sm text-center shadow-[0_0_100px_rgba(239,68,68,0.1)]"
                        >
                            <AlertTriangle className="text-red-500 w-16 h-16 mx-auto mb-6 animate-pulse" />
                            <h3 className="text-white text-2xl font-black tracking-tighter mb-4 uppercase italic">Protocolo de Pânico</h3>
                            <p className="text-red-400/80 text-xs font-mono leading-relaxed mb-10 uppercase tracking-widest">
                                Esta ação irá desligar imediatamente todos os agentes e desconectar o WhatsApp Business API.
                            </p>
                            <div className="flex flex-col gap-4">
                                <button onClick={confirmShutdown} className="w-full py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-500 transition-all">
                                    Confirmar Desligamento Total
                                </button>
                                <button onClick={() => setShowPanicConfirm(false)} className="w-full py-4 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                                    Cancelar Operação
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOP COMMAND BAR */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12 px-4 py-6 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-center shadow-inner">
                        <Command className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-white font-black tracking-tighter text-2xl italic">MCT NUCLEUS</h1>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest">Live_v2.1</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-600">Unified Business Intelligence & Control</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* FAST ACTIONS */}
                    <div className="flex items-center gap-2 p-1 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <button onClick={emergencyShutdown} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="Desligar Agentes (Pânico)">
                            <Power className="w-4 h-4" />
                        </button>
                        <button onClick={rebootServer} className="p-3 hover:bg-white/5 rounded-xl transition-all" style={{ color: 'var(--text-muted)' }} title="Reiniciar Servidor">
                            <RefreshCcw className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 mx-1" style={{ backgroundColor: 'var(--border)' }} />
                        <button className="p-3 hover:bg-white/5 rounded-xl transition-all" style={{ color: 'var(--text-muted)' }}>
                            <Settings className="w-4 h-4" />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-3 hover:bg-white/5 rounded-xl transition-all"
                            style={{ color: 'var(--accent)' }}
                            title={theme === 'dark' ? 'Modo Dia' : 'Modo Noite'}
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </div>


                    <div className="h-12 w-px bg-white/5 mx-4" />

                    <div className="text-right">
                        <div className="text-white font-mono text-xs font-bold">{currentTime.toLocaleTimeString()}</div>
                        <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{currentTime.toLocaleDateString('pt-BR')}</div>
                    </div>
                </div>
            </div>

            {/* DASHBOARD GRID */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 px-4 pb-20 relative">

                {/* 1. VISÃO GERAL (BIG PICTURE) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* STATS STRIP */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((s, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] hover:border-white/10 transition-all">
                                <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-600 mb-1">{s.label}</p>
                                <p className={`text-xl font-black italic tracking-tighter ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* NEURAL OFFICE PREVIEW (GATHER) */}
                    <Link href="/dashboard/neural-office">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="group relative bg-[#0a0a0a] border border-white/5 p-1 rounded-[40px] overflow-hidden cursor-pointer shadow-2xl"
                        >
                            <div className="aspect-video w-full rounded-[38px] overflow-hidden relative">
                                {/* Simulação Visual do Gather */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#10b98105_1px,_transparent_1px)] bg-[length:30px_30px]" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                                    <div className="w-20 h-20 bg-emerald-500 rounded-full blur-[60px] opacity-10 mx-auto" />
                                    <h3 className="text-white text-3xl font-black italic tracking-tighter mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">NEURAL OFFICE</h3>
                                    <p className="text-emerald-500 font-mono text-[9px] uppercase tracking-[0.5em] opacity-40">Ver Escritório Virtual (Gather Style)</p>
                                </div>
                                <div className="absolute bottom-8 right-8 flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center"><Cpu className="w-4 h-4 text-black" /></div>)}
                                    </div>
                                    <span className="text-[10px] font-mono text-emerald-500/60 uppercase">+56 Agentes On-line</span>
                                </div>
                            </div>
                            {/* Inner Glow */}
                            <div className="absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white/10 pointer-events-none" />
                        </motion.div>
                    </Link>

                    {/* QUICK TOOLS HUB */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Creative', icon: <PenTool className="w-5 h-5" />, color: 'text-purple-400', desc: 'Nexus Content Hub', link: '/dashboard/nexus-creative' },
                            { name: 'Dojo', icon: <Zap className="w-5 h-5" />, color: 'text-amber-400', desc: 'Agent Training', link: '#' },
                            { name: 'Council', icon: <Users className="w-5 h-5" />, color: 'text-pink-400', desc: 'Squad Leader Hub', link: '#' },
                            { name: 'Memory', icon: <Brain className="w-5 h-5" />, color: 'text-blue-400', desc: 'Fractal Persistence', link: '#' },
                        ].map((hub, i) => (
                            <Link key={i} href={hub.link}>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all cursor-pointer group h-full">
                                    <div className={`mb-4 p-3 w-fit rounded-xl bg-white/5 transition-transform group-hover:scale-110 ${hub.color}`}>
                                        {hub.icon}
                                    </div>
                                    <h4 className="text-white text-xs font-bold uppercase tracking-widest">{hub.name}</h4>
                                    <p className="text-[9px] text-slate-600 font-mono mt-1">{hub.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 2. SIDEBAR (PENDÊNCIAS & JULES) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* THE "WHAT'S HAPPENING" HUB */}
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                <Bell className="w-4 h-4 text-amber-500" /> Pendências Operacionais
                            </h3>
                            <span className="bg-amber-500/10 text-amber-500 text-[8px] font-mono px-2 py-0.5 rounded-full border border-amber-500/20">3 ALERTAS</span>
                        </div>

                        <div className="space-y-4">
                            {pendingTasks.map((t, i) => (
                                <div key={i} className="group p-5 bg-black/40 border border-white/5 rounded-[30px] hover:border-white/10 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-white/5 rounded-lg text-slate-500">{t.icon}</div>
                                            <span className="text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors uppercase italic tracking-tighter">{t.task}</span>
                                        </div>
                                        <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-widest ${t.priority === 'Crítica' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
                                            t.priority === 'Alta' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                                                'bg-blue-500/10 border-blue-500/30 text-blue-500'
                                            }`}>
                                            {t.priority}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest">{t.status}</p>
                                        <MoreHorizontal className="w-3 h-3 text-slate-800" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* JULES COMMAND OUTPUT (CLI STYLE) */}
                    <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[40px] font-mono overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <Terminal className="text-emerald-500 w-4 h-4" />
                            <h3 className="text-white text-[9px] font-black uppercase tracking-[0.3em]">Jules_Squad Internal</h3>
                        </div>
                        <div className="space-y-3 text-[9px] leading-relaxed">
                            <div className="flex gap-3 text-emerald-400/80">
                                <span className="opacity-40">04:30</span>
                                <span>[JULES] Sincronizando Tiled Map JSON v1.</span>
                            </div>
                            <div className="flex gap-3 text-blue-400/80">
                                <span className="opacity-40">04:28</span>
                                <span>[WATCHDOG] Node 3: Heartbeat OK (42ms).</span>
                            </div>
                            <div className="flex gap-3 text-white/30 italic">
                                <span className="opacity-40">PROMPT</span>
                                <span className="animate-pulse">_ Aguardando comando do CEO...</span>
                            </div>
                        </div>
                    </div>

                    {/* SYSTEM INTEGRITY */}
                    <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] overflow-hidden relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white text-[9px] font-black uppercase tracking-[0.3em]">Integridade</h3>
                            <Globe className="w-4 h-4 text-emerald-500 opacity-30" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }} animate={{ width: '92%' }}
                                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                />
                            </div>
                            <span className="text-[10px] font-mono text-emerald-500 font-bold">92%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* NOISE/TEXTURE */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015] mix-blend-overlay bg-[url('/noise.png')]" />
        </main>
    );
}
