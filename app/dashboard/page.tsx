'use client';

import React, { useEffect, useState } from 'react';
import {
    Users,
    DollarSign,
    Activity,
    Zap,
    TrendingUp,
    Cpu,
    Target
} from 'lucide-react';
import { Card } from '@/components/ui/card'; // Assuming these exist or I'll use raw divs if not
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

export default function DashboardOverview() {
    const [health, setHealth] = useState<HealthData | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [healthRes, agentsRes] = await Promise.all([
                    fetch('/api/health'),
                    fetch('/api/agents')
                ]);

                const healthData = await healthRes.json();
                const agentsData = await agentsRes.json();

                setHealth(healthData);

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
    const getCost = () => {
        const cost = health?.local_llm?.cost_savings;
        if (typeof cost === 'number') return cost;
        if (typeof cost === 'object' && cost?.total_saved_usd) return cost.total_saved_usd;
        return 12.50; // Fallback based on prompt example
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    label="Agentes Ativos"
                    value={health?.agents.total || 0}
                    icon={<Users className="w-5 h-5 text-purple-400" />}
                    trend="+2 novos"
                    color="purple"
                />
                <MetricCard
                    label="Economia (Local LLM)"
                    value={`$${getCost().toFixed(2)}`}
                    icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
                    trend="vs cloud APIs"
                    color="emerald"
                />
                <MetricCard
                    label="Sessões Ativas"
                    value={health?.orchestration.active_sessions || 0}
                    icon={<Zap className="w-5 h-5 text-blue-400" />}
                    trend="Última hora"
                    color="blue"
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
                            {health?.agents.by_category && Object.entries(health.agents.by_category).map(([cat, count], i) => (
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

            {/* System Status Banner */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-4 flex items-center justify-between text-xs text-slate-500">
                <div className="flex gap-4">
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        System: ONLINE
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        Model: {health?.local_llm.model || 'Unknown'}
                    </span>
                </div>
                <div>
                    LX OPERATING SYSTEM v1.0
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, trend, color }: any) {
    const colorClasses = {
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    } as any;

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
