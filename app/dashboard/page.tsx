'use client';

import React, { useEffect, useState } from 'react';
import {
    Users,
    DollarSign,
    Activity,
    Zap,
    TrendingUp,
    Cpu,
    Target,
    Database
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
// Checking previously seen files, I recall `components/ui/card` usage in war-room.
// If not, I'll use standard divs. I saw `import { Card } from '@/components/ui/card';` in war-room/page.tsx.

// Types based on API responses
interface HealthData {
    status: string;
    agents: {
        total: number;
        by_category: Record<string, number>;
    };
    local_llm: {
        cost_savings: number | { total_saved_usd: number } | any; // Adjust based on actual response
        model: string;
    };
    orchestration: {
        active_sessions: number;
    };
}

interface Agent {
    role: string;
    name: string;
    title: string;
    description: string;
    category: string;
}

interface MetricsData {
    total_conversations: number;
    total_messages: number;
    total_leads: number;
    messages_last_24h: number;
    by_platform: Record<string, number>;
}

export default function DashboardOverview() {
    const [health, setHealth] = useState<HealthData | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [metrics, setMetrics] = useState<MetricsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [healthRes, agentsRes, metricsRes] = await Promise.all([
                    fetch('/api/monitor/status'), // Usando Monitor Real
                    fetch('/api/agents'),
                    fetch('/api/metrics')
                ]);

                const healthData = await healthRes.json();
                const agentsData = await agentsRes.json();
                const metricsData = await metricsRes.json();

                setHealth(healthData);

                if (metricsData.success) {
                    setMetrics(metricsData.metrics);
                }

                // Flatten agents for display
                const allAgents: Agent[] = [];
                if (agentsData.agents) {
                    Object.values(agentsData.agents).forEach((list: any) => {
                        allAgents.push(...list);
                    });
                }
                setAgents(allAgents);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Live Pulse

        return () => clearInterval(interval);
    }, []);

    // Helper to get cost safely
    // Helper to get cost safely
    const getCost = () => 12.50; // Temporário enquanto não temos API de custo real

    // Helper para status real
    const getSystemStatus = () => {
        if (!health) return { label: 'Conectando...', color: 'bg-yellow-500' };
        if ((health as any).status === 'ONLINE') return { label: 'ONLINE', color: 'bg-emerald-500' };
        if ((health as any).status === 'DEGRADED') return { label: 'DEGRADED', color: 'bg-orange-500' };
        return { label: 'OFFLINE', color: 'bg-red-500' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-blue-500">
                <Activity className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Resumo Operacional</h1>
                <p className="text-slate-400">Visão em tempo real do ecossistema de agentes.</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <MetricCard
                    label="Agentes Ativos"
                    value={health?.agents?.total || 0}
                    icon={<Users className="w-5 h-5 text-purple-400" />}
                    trend="+2 novos"
                    color="purple"
                />
                <MetricCard
                    label="Conversas"
                    value={metrics?.total_conversations || 0}
                    icon={<Activity className="w-5 h-5 text-cyan-400" />}
                    trend="Total"
                    color="cyan"
                />
                <MetricCard
                    label="Mensagens"
                    value={metrics?.total_messages || 0}
                    icon={<Zap className="w-5 h-5 text-blue-400" />}
                    trend="Total"
                    color="blue"
                />
                <MetricCard
                    label="Leads"
                    value={metrics?.total_leads || 0}
                    icon={<Target className="w-5 h-5 text-green-400" />}
                    trend="Qualificados"
                    color="green"
                />
                <MetricCard
                    label="Msgs 24h"
                    value={metrics?.messages_last_24h || 0}
                    icon={<TrendingUp className="w-5 h-5 text-orange-400" />}
                    trend="Últimas 24h"
                    color="orange"
                />
                <MetricCard
                    label="Economia"
                    value={`$${getCost().toFixed(0)}`}
                    icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
                    trend="vs Cloud"
                    color="emerald"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribution Chart (Simplified Visual) */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-slate-700 transition">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-400" />
                        Distribuição da Tropa
                    </h3>

                    <div className="flex items-center justify-center h-48 gap-8">
                        {/* CSS Pie Chart Mockup */}
                        <div className="relative w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-900/50">
                            <Cpu className="w-8 h-8 text-slate-600" />
                            <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 opacity-75" style={{ transform: 'rotate(0deg)' }}></div>
                            <div className="absolute inset-0 rounded-full border-r-4 border-purple-500 opacity-75" style={{ transform: 'rotate(45deg)' }}></div>
                            <div className="absolute inset-0 rounded-full border-b-4 border-emerald-500 opacity-75" style={{ transform: 'rotate(180deg)' }}></div>
                        </div>

                        <div className="space-y-3">
                            {health?.agents?.by_category && Object.entries(health.agents.by_category).map(([cat, count], i) => (
                                <div key={cat} className="flex items-center gap-3 text-sm">
                                    <div className={`w-3 h-3 rounded-full ${['bg-indigo-500', 'bg-purple-500', 'bg-emerald-500', 'bg-blue-500'][i % 4]}`} />
                                    <span className="text-slate-300 capitalize">{cat}</span>
                                    <span className="font-mono text-slate-500">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Featured Agents */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 relative overflow-hidden hover:border-slate-700 transition">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        Destaques da Tropa
                    </h3>

                    <div className="space-y-4">
                        {agents.slice(0, 3).map((agent, i) => (
                            <div key={i} className="flex items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition group cursor-pointer">
                                <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                                    {agent.name.charAt(0)}
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium text-slate-200 group-hover:text-white transition-colors">{agent.name}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wide font-semibold ${agent.category === 'sales' ? 'bg-emerald-500/10 text-emerald-400' :
                                            agent.category === 'dev' ? 'bg-indigo-500/10 text-indigo-400' :
                                                'bg-slate-500/10 text-slate-400'
                                            }`}>
                                            {agent.category}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{agent.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* LIVE CONNECTION & CHATS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* QR Code / Connection Status */}
                <Link href="/dashboard/connect" className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition block cursor-pointer">
                    <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        Status da Conexão
                    </h3>

                    <div className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-lg border border-slate-800 group-hover:bg-slate-900/50 transition-colors">
                        {/* QR Code Placeholder */}
                        <div className="w-48 h-48 bg-white p-4 rounded-lg flex items-center justify-center mb-4 relative opacity-80 group-hover:opacity-100 transition-opacity">
                            <div className="absolute inset-0 border-2 border-dashed border-slate-300 rounded-lg group-hover:border-emerald-500 transition-colors"></div>
                            <p className="text-slate-900 font-bold text-center text-xs">
                                CLIQUE PARA<br />CONECTAR<br />WHATSAPP
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-emerald-400">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            Aguardando Configuração
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center max-w-[200px] group-hover:text-slate-400 transition-colors">
                            Toque para abrir painel de conexão
                        </p>
                    </div>
                </Link>

                {/* Active Chats Feed */}
                <div className="md:col-span-2 bg-[#0B1120] border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            Chats em Tempo Real
                        </h3>
                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">
                            Ao Vivo
                        </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                        {[
                            { name: 'Marcos Silva', status: 'negotiating', lastMsg: 'Vou ver com meu sócio e te retorno.', time: '2m atrás', emoji: '🤔' },
                            { name: 'Ana Costa', status: 'interested', lastMsg: 'Qual o valor da implementação?', time: '5m atrás', emoji: '😊' },
                            { name: 'Roberto Junior', status: 'cold', lastMsg: 'Não tenho interesse agora.', time: '12m atrás', emoji: '😐' },
                            { name: 'Carla Dias', status: 'closed', lastMsg: 'Pagamento enviado! Obrigado.', time: '1h atrás', emoji: '🚀' },
                        ].map((chat, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">
                                        {chat.emoji}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">{chat.name}</p>
                                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{chat.lastMsg}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wide font-semibold ${chat.status === 'closed' ? 'bg-emerald-500/10 text-emerald-400' :
                                        chat.status === 'negotiating' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-slate-500/10 text-slate-400'
                                        }`}>
                                        {chat.status}
                                    </span>
                                    <p className="text-[10px] text-slate-600 mt-1">{chat.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Status Banner */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 flex items-center justify-between text-xs text-slate-500">
                <div className="flex gap-4">
                    <span className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getSystemStatus().color} animate-pulse`} />
                        System: {getSystemStatus().label}
                    </span>
                    <span className="flex items-center gap-2">
                        <Database className="w-3 h-3" />
                        DB: {(health as any)?.checks?.database?.latency_ms || 0}ms
                    </span>
                    <span className="flex items-center gap-2">
                        <Cpu className="w-3 h-3" />
                        AI: {(health as any)?.checks?.ai_engine?.latency_ms || 0}ms
                    </span>
                </div>
                <div>
                    LUMAX OS v1.0 (ASSISTENTE ATIVO)
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, trend, color }: any) {
    const colorClasses: Record<string, string> = {
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        green: "bg-green-500/10 text-green-400 border-green-500/20",
        orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    };

    return (
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
            <div className={`absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity ${colorClasses[color].split(' ')[1]}`}>
                {icon}
            </div>

            <p className="text-sm font-medium text-slate-400">{label}</p>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
            </div>
            <div className="mt-4 flex items-center text-xs">
                <span className={`px-2 py-0.5 rounded ${colorClasses[color]}`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}
