'use client';

import React, { useEffect, useState } from 'react';
import {
    Database,
    Search,
    Filter,
    BrainCircuit,
    CheckCircle2,
    XCircle
} from 'lucide-react';

interface MemoryItem {
    id: string;
    niche: string;
    persona: string;
    pain_point: string;
    outcome: string;
    mql_score: number;
    learned_pattern: string;
    timestamp?: string; // Simulation data might not have it, but we can mock it
}

export default function MemoryPage() {
    const [memories, setMemories] = useState<MemoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [supabaseStatus, setSupabaseStatus] = useState<boolean | null>(null);

    useEffect(() => {
        // Fetch Supabase status
        fetch('/api/health')
            .then(res => res.json())
            .then(data => {
                setSupabaseStatus(data.environment?.has_supabase || false);
            })
            .catch(() => setSupabaseStatus(false));

        // Fetch "Memories" (Simulation Data representing stored leads)
        fetch('/api/simulation-data')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setMemories(data.slice(0, 50)); // Limit to 50 for performance
                }
            })
            .catch(err => console.error("Failed to fetch memories", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Memória Corporativa</h1>
                    <p className="text-slate-400">Banco de dados central de leads e conhecimento adquirido.</p>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${supabaseStatus
                        ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400'
                        : 'bg-red-950/30 border-red-900/50 text-red-400'
                    }`}>
                    <Database className="w-4 h-4" />
                    <span className="text-xs font-bold">
                        SUPABASE: {supabaseStatus === null ? 'CHECKING...' : supabaseStatus ? 'LEITURA/ESCRITA' : 'OFFLINE'}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-4 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nicho, score ou ID..."
                        className="w-full bg-slate-900 border border-slate-700 rounded pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition">
                    <Filter className="w-4 h-4" />
                    Filtros
                </button>
            </div>

            {/* Table */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-3">ID / Fonte</th>
                                <th className="px-6 py-3">Nicho & Persona</th>
                                <th className="px-6 py-3">Padrão Identificado</th>
                                <th className="px-6 py-3 text-center">MQL Score</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Carregando memórias do núcleo...
                                    </td>
                                </tr>
                            ) : memories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Nenhuma memória encontrada.
                                    </td>
                                </tr>
                            ) : (
                                memories.map((item, i) => (
                                    <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {item.id || `MEM-${i}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-200 font-medium">{item.niche}</div>
                                            <div className="text-xs text-slate-500">{item.persona}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 max-w-sm">
                                                <BrainCircuit className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                                                <span className="italic text-slate-400">{item.learned_pattern || item.pain_point}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.mql_score >= 80 ? 'bg-emerald-500/10 text-emerald-400' :
                                                    item.mql_score >= 50 ? 'bg-yellow-500/10 text-yellow-400' :
                                                        'bg-red-500/10 text-red-400'
                                                }`}>
                                                {item.mql_score}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.outcome === 'CLOSED_WON' ? (
                                                <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    CONVERTIDO
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-slate-500 text-xs">
                                                    <XCircle className="w-3 h-3" />
                                                    {item.outcome}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
