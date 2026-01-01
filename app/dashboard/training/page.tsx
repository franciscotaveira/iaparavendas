'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
    Sword,
    Shield,
    Award,
    Zap,
    Activity,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Brain
} from 'lucide-react';

// Supabase client (frontend) - safe initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

interface TrainingSession {
    id: number;
    session_id: string;
    persona_type: string;
    scenario: string;
    messages: any[];
    success: boolean;
    rating: number; // 1-5
    feedback: any; // JSON
    created_at: string;
    duration_ms: number;
}

export default function TrainingArenaPage() {
    const [sessions, setSessions] = useState<TrainingSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);

    // Fetch data
    useEffect(() => {
        fetchSessions();

        // Realtime subscription
        if (supabase) {
            const channel = supabase
                .channel('training_updates')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'training_sessions' }, (payload) => {
                    setSessions(prev => [payload.new as TrainingSession, ...prev]);
                })
                .subscribe();

            return () => { supabase.removeChannel(channel); };
        }
    }, []);

    async function fetchSessions() {
        setLoading(true);
        try {
            // Tenta buscar da API local primeiro (Prioridade Antigravity)
            const res = await fetch('/api/training/sessions');
            const data = await res.json();

            if (data.sessions && data.sessions.length > 0) {
                setSessions(data.sessions);
            } else {
                // Fallback: Tenta Supabase se API local vazia
                if (supabase) {
                    const { data: sbData } = await supabase
                        .from('training_sessions')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(50);
                    if (sbData) setSessions(sbData);
                }
            }
        } catch (e) {
            console.error("Erro ao buscar sessões:", e);
        } finally {
            setLoading(false);
        }
    }

    // Stats calculation
    const totalBattles = sessions.length;
    const wins = sessions.filter(s => s.success).length;
    const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;

    const avgScore = totalBattles > 0
        ? Math.round(sessions.reduce((acc, curr) => {
            // Se feedback tem score (0-100), usa. Se não, usa rating * 20
            const score = curr.feedback?.score || (curr.rating * 20) || 0;
            return acc + score;
        }, 0) / totalBattles)
        : 0;

    // Agentes mais ativos
    const agentCounts: Record<string, number> = {};
    sessions.forEach(s => { agentCounts[s.scenario] = (agentCounts[s.scenario] || 0) + 1; });
    const topAgent = Object.entries(agentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-3">
                        <Sword className="w-8 h-8 text-blue-500" />
                        LUMAX Training Arena
                    </h1>
                    <p className="text-slate-400 mt-1">Centro de Treinamento Adversarial e Evolução Contínua</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchSessions} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition flex items-center gap-2 text-sm font-medium">
                        <Activity className="w-4 h-4" /> Atualizar
                    </button>
                    {/* Botão de Start Simulador (Placeholder - Idealmente chamaria API para iniciar processo) */}
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Batalhas Registradas"
                    value={totalBattles.toString()}
                    icon={<Shield className="w-5 h-5 text-indigo-400" />}
                    trend="+12% hoje"
                />
                <MetricCard
                    title="Taxa de Vitória"
                    value={`${winRate}%`}
                    icon={<Award className="w-5 h-5 text-emerald-400" />}
                    color={winRate > 70 ? "text-emerald-400" : "text-yellow-400"}
                />
                <MetricCard
                    title="Score Médio (Juiz)"
                    value={avgScore.toString()}
                    icon={<Brain className="w-5 h-5 text-purple-400" />}
                    sub="/ 100"
                />
                <MetricCard
                    title="Agente Mais Ativo"
                    value={topAgent}
                    icon={<Zap className="w-5 h-5 text-amber-400" />}
                    className="capitalize"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Lista de Batalhas */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Activity className="w-5 h-5" /> Batalhas Recentes
                    </h2>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="text-center py-10 text-slate-500">Carregando arena...</div>
                        ) : sessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => setSelectedSession(session)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${selectedSession?.id === session.id
                                    ? 'bg-indigo-900/20 border-indigo-500/50 ring-1 ring-indigo-500/50'
                                    : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs px-2 py-1 rounded-full border ${session.success
                                        ? 'bg-emerald-950/30 border-emerald-900 text-emerald-400'
                                        : 'bg-red-950/30 border-red-900 text-red-400'
                                        }`}>
                                        {session.success ? 'VITÓRIA' : 'DERROTA'}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {new Date(session.created_at).toLocaleTimeString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-slate-200 capitalize">{session.scenario}</h3>
                                    <span className="text-xs text-slate-500">vs</span>
                                    <h3 className="font-medium text-slate-300 text-right truncate max-w-[100px]" title={session.persona_type}>
                                        {session.persona_type.replace('DOJO:', '').replace('Paciente', '')}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                                    <Award className="w-3 h-3" />
                                    <span>Score: {session.feedback?.score || (session.rating * 20) || '?'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detalhes da Batalha (Chat + Feedback) */}
                <div className="lg:col-span-2">
                    {selectedSession ? (
                        <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">

                            {/* Header Detalhes */}
                            <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            <span className="capitalize text-indigo-400">{selectedSession.scenario}</span>
                                            <span className="text-slate-600">vs</span>
                                            <span className="text-red-400">{selectedSession.persona_type.replace('DOJO:', '')}</span>
                                        </h2>
                                        <div className="flex gap-4 mt-2 text-sm text-slate-400">
                                            <span>ID: {selectedSession.session_id}</span>
                                            <span>Duração: {(selectedSession.duration_ms / 1000).toFixed(1)}s</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-black text-white/10">
                                            {selectedSession.feedback?.score || (selectedSession.rating * 20)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Conteúdo Principal */}
                            <div className="p-0 flex-1 flex flex-col md:flex-row h-[600px]">

                                {/* Chat Viewer */}
                                <div className="flex-1 border-r border-slate-800 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-slate-950/30">
                                    {Array.isArray(selectedSession.messages) && selectedSession.messages.map((msg: any, idx: number) => (
                                        <div key={idx} className={`flex gap-4 ${msg.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-indigo-600' : 'bg-red-900'
                                                }`}>
                                                {msg.role === 'assistant' ? 'AI' : 'R'}
                                            </div>
                                            <div className={`flex-1 p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'assistant'
                                                ? 'bg-slate-800 text-slate-200 rounded-tl-none'
                                                : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tr-none'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Analise do Juiz */}
                                <div className="w-full md:w-80 bg-slate-900 p-6 overflow-y-auto custom-scrollbar">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                                        <Brain className="w-4 h-4" /> Análise do Juiz
                                    </h3>

                                    {selectedSession.feedback ? (
                                        <div className="space-y-6">
                                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                                <p className="text-sm text-slate-300 italic">
                                                    "{selectedSession.feedback.feedback || 'Sem comentários detalhados.'}"
                                                </p>
                                            </div>

                                            {selectedSession.feedback.strengths && (
                                                <div>
                                                    <h4 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" /> PONTOS FORTES
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {selectedSession.feedback.strengths.map((s: string, i: number) => (
                                                            <li key={i} className="text-xs text-slate-400">• {s}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {selectedSession.feedback.weaknesses && (
                                                <div>
                                                    <h4 className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1">
                                                        <XCircle className="w-3 h-3" /> PONTOS FRACOS
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {selectedSession.feedback.weaknesses.map((w: string, i: number) => (
                                                            <li key={i} className="text-xs text-slate-400">• {w}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center text-slate-600 py-10">
                                            Sem análise detalhada disponível.
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 bg-[#111827] border border-slate-800 rounded-2xl border-dashed">
                            <Sword className="w-16 h-16 mb-4 opacity-20" />
                            <p>Selecione uma batalha para ver os detalhes</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, trend, sub, color = "text-white", className = "" }: any) {
    return (
        <div className="bg-[#111827] border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-sm font-medium">{title}</span>
                {icon}
            </div>
            <div className="flex items-baseline gap-1">
                <h3 className={`text-2xl font-bold ${color} ${className}`}>{value}</h3>
                {sub && <span className="text-slate-500 text-sm">{sub}</span>}
            </div>
            {trend && <p className="text-xs text-emerald-500 mt-2 font-medium">{trend}</p>}
        </div>
    );
}
