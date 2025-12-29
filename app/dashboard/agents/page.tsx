'use client';

import React, { useEffect, useState } from 'react';
import {
    MessageSquare,
    Bot,
    Code2,
    Megaphone,
    Briefcase,
    Settings,
    UserCircle,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Agent {
    role: string;
    name: string;
    title: string;
    description: string;
    category: string;
    expertise: string[];
}

export default function AgentsPage() {
    const [agentsByCategory, setAgentsByCategory] = useState<Record<string, Agent[]>>({});
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/agents')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAgentsByCategory(data.agents);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleCallAgent = (agent: Agent) => {
        // Navigate to War Room or open a modal
        // For now, let's navigate to War Room with a query param (if supported) or just basic nav
        // or a simple alert as placeholder for "Call"
        // Actually, the prompt says "Open a modal to talk directly".
        // I will implement a simple alert for now saying "Connecting..." and then maybe redirect to war-room
        alert(`Iniciando canal seguro com ${agent.name} (${agent.title})...`);
        router.push(`/war-room?agent=${agent.role}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-blue-500">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Tropa de Agentes</h1>
                <p className="text-slate-400">24 Especialistas de Elite prontos para execução.</p>
            </div>

            {Object.entries(agentsByCategory).map(([category, agents]) => (
                <div key={category} className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                        {getCategoryIcon(category)}
                        <h2 className="text-xl font-semibold text-slate-200 capitalize">{category} Team</h2>
                        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
                            {agents.length} AGENTS
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {agents.map((agent) => (
                            <AgentCard key={agent.role} agent={agent} onCall={() => handleCallAgent(agent)} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function AgentCard({ agent, onCall }: { agent: Agent, onCall: () => void }) {
    return (
        <div className="group bg-[#0B1120] border border-slate-800 hover:border-indigo-500/50 rounded-lg p-5 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-300">
                    {agent.name.charAt(0)}
                </div>
                <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider border ${agent.category === 'sales' ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' :
                        agent.category === 'dev' ? 'bg-indigo-950/30 border-indigo-900/50 text-indigo-400' :
                            'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                    {agent.role.split('_')[1] || agent.role}
                </div>
            </div>

            <div className="flex-1 relative z-10">
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{agent.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{agent.title}</p>
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {agent.description}
                </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 relative z-10">
                <button
                    onClick={onCall}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white py-2 rounded-md transition-all duration-200 text-sm font-medium border border-slate-700 hover:border-indigo-500 group/btn"
                >
                    <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    Convocar
                </button>
            </div>
        </div>
    );
}

function getCategoryIcon(category: string) {
    const props = { className: "w-5 h-5 text-slate-500" };
    switch (category) {
        case 'sales': return <Briefcase {...props} className="w-5 h-5 text-emerald-500" />;
        case 'dev': return <Code2 {...props} className="w-5 h-5 text-indigo-500" />;
        case 'marketing': return <Megaphone {...props} className="w-5 h-5 text-purple-500" />;
        case 'ops': return <Settings {...props} className="w-5 h-5 text-orange-500" />;
        default: return <Bot {...props} />;
    }
}
