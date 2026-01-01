import React from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicialização segura do Supabase (Client-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Interfaces
interface Directive {
    valid_date: string;
    global_focus: string;
    tone_modifier: string;
    yesterday_learnings: string;
    approved_by: string;
}

interface CouncilLog {
    id: string;
    created_at: string;
    consensus: string;
    score: number;
    lead_id: string;
}

// Fetch Data (Server Component Pattern simulado no Client para brevidade)
async function getCouncilData() {
    const today = new Date().toISOString().split('T')[0];

    // 1. Diretriz do Dia
    const { data: directives } = await supabase
        .from('lxc_daily_directives')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    // 2. Logs Recentes
    const { data: logs } = await supabase
        .from('lxc_council_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    return {
        activeDirective: directives?.[0] || null,
        recentLogs: logs || []
    };
}

export default async function CouncilDashboard() {
    // Nota: Em Next.js App Router, este componente seria async por padrão server-side.
    // Como estamos sem "use client", ele renderiza no servidor.

    const { activeDirective, recentLogs } = await getCouncilData();
    const averageScore = recentLogs.length
        ? Math.round(recentLogs.reduce((acc, log) => acc + (log.score || 0), 0) / recentLogs.length)
        : 0;

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-emerald-500/30">
            {/* Header Executivo */}
            <header className="border-b border-white/10 p-6 md:p-8 flex justify-between items-center bg-[#0a0a0a]">
                <div>
                    <h1 className="text-2xl font-light tracking-widest uppercase font-mono text-emerald-500">
                        LXC Supreme Council
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1 tracking-wider">
                        WAR ROOM // GOVERNANÇA AUTÔNOMA
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold font-mono">
                        {averageScore}<span className="text-sm text-neutral-600 font-normal">%</span>
                    </div>
                    <div className="text-[10px] uppercase text-neutral-500">Score de Humanidade (24h)</div>
                </div>
            </header>

            <main className="p-6 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUNA 1: A LEI DO DIA */}
                <section className="lg:col-span-2 space-y-8">
                    {/* Diretriz Ativa */}
                    <div className="bg-[#0f0f0f] border border-white/5 rounded-sm p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-sm font-mono text-emerald-400 uppercase tracking-widest">
                                Ordem do Dia ({activeDirective?.valid_date || 'N/A'})
                            </h2>
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-1 rounded border border-emerald-900">
                                APROVADO POR: {activeDirective?.approved_by || 'SYSTEM'}
                            </span>
                        </div>

                        {activeDirective ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-neutral-500 text-xs uppercase mb-1">Foco Estratégico</h3>
                                    <p className="text-xl md:text-2xl font-light text-white leading-relaxed">
                                        "{activeDirective.global_focus}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-black/30 p-4 rounded border border-white/5">
                                        <h3 className="text-neutral-500 text-xs uppercase mb-2">Ajuste de Tom (Prompt Injection)</h3>
                                        <p className="text-sm text-neutral-300 font-mono leading-relaxed">
                                            {activeDirective.tone_modifier}
                                        </p>
                                    </div>
                                    <div className="bg-black/30 p-4 rounded border border-white/5">
                                        <h3 className="text-neutral-500 text-xs uppercase mb-2">Aprendizado de Ontem</h3>
                                        <p className="text-sm text-neutral-400 italic">
                                            {activeDirective.yesterday_learnings}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-neutral-600">
                                <p>Nenhuma diretriz ativa. O Conselho ainda não se reuniu hoje.</p>
                                <p className="text-xs mt-2">Aguardando execução do Cron Job às 23:00.</p>
                            </div>
                        )}
                    </div>

                    {/* Logs de Auditoria Recentes */}
                    <div>
                        <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-4">
                            Últimas Auditorias (Tático)
                        </h3>
                        <div className="space-y-3">
                            {recentLogs.map((log) => (
                                <div key={log.id} className="bg-[#0f0f0f] border border-white/5 p-4 rounded-sm flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-[#141414] transition-colors">
                                    <div className={`text-xl font-bold font-mono ${(log.score || 0) >= 80 ? 'text-emerald-500' :
                                            (log.score || 0) >= 50 ? 'text-yellow-500' : 'text-red-500'
                                        }`}>
                                        {log.score || 0}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-neutral-300 line-clamp-2">
                                            {log.consensus || 'Sem consenso registrado.'}
                                        </p>
                                        <div className="flex gap-2 mt-2 text-[10px] text-neutral-600 font-mono">
                                            <span>LEAD: {log.lead_id.slice(0, 8)}...</span>
                                            <span>•</span>
                                            <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <button className="text-xs text-neutral-500 hover:text-white border border-white/10 px-3 py-1 rounded hover:bg-white/5 transition-all">
                                        VER ATA
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* COLUNA 2: KPI & CONTEXTO */}
                <aside className="space-y-6">
                    {/* Status do Sistema */}
                    <div className="bg-[#0f0f0f] p-6 rounded-sm border border-white/5">
                        <h3 className="text-xs font-mono text-neutral-500 uppercase mb-4">Status dos Agentes</h3>
                        <ul className="space-y-3">
                            <li className="flex justify-between text-sm">
                                <span className="text-neutral-400">The Closer</span>
                                <span className="text-emerald-500 font-mono">ONLINE</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-neutral-400">Psyche</span>
                                <span className="text-emerald-500 font-mono">ONLINE</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-neutral-400">Sentinel</span>
                                <span className="text-emerald-500 font-mono">ONLINE</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-neutral-400">Chronos (Proactive)</span>
                                <span className="text-emerald-500 font-mono">IDLE</span>
                            </li>
                            <li className="border-t border-white/5 pt-2 flex justify-between text-sm">
                                <span className="text-amber-500">Legacy Mode (1960s)</span>
                                <span className="text-white font-mono">ACTIVE</span>
                            </li>
                        </ul>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="bg-[#0f0f0f] p-6 rounded-sm border border-white/5">
                        <h3 className="text-xs font-mono text-neutral-500 uppercase mb-4">Comandos de Emergência</h3>
                        <div className="grid gap-3">
                            <a href="/api/cron/council-meeting?secret=dev_secret" target="_blank" className="block w-full text-center py-2 px-4 bg-white/5 hover:bg-white/10 text-xs font-mono border border-white/10 text-neutral-300">
                                FORÇAR REUNIÃO DE CONSELHO
                            </a>
                            <a href="/api/cron/proactive?secret=dev_secret" target="_blank" className="block w-full text-center py-2 px-4 bg-white/5 hover:bg-white/10 text-xs font-mono border border-white/10 text-neutral-300">
                                DISPARAR INITITATIVAS
                            </a>
                        </div>
                    </div>

                    {/* Cardada da Sabedoria */}
                    <div className="bg-gradient-to-br from-indigo-950/20 to-purple-950/20 p-6 rounded-sm border border-indigo-500/10">
                        <div className="mb-2 text-indigo-400 text-2xl">❝</div>
                        <p className="text-sm text-indigo-100/80 italic leading-relaxed">
                            "A verdadeira inteligência não é saber tudo, mas saber o que é relevante no momento certo."
                        </p>
                        <div className="mt-4 text-[10px] text-indigo-400 uppercase tracking-widest text-right">
                            — The Architect (LXC Memory)
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}

// Forçar revalidação a cada 60s
export const revalidate = 60;
