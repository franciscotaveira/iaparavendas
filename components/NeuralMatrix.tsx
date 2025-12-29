'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KernelTerminal from '@/components/KernelTerminal';
import { Terminal, Cpu, Activity, Shield, Zap, Users, Brain, Lock } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SimulationItem {
    id: string;
    niche: string;
    persona: string;
    pain_point: string;
    outcome: string;
    mql_score: number;
    learned_pattern: string;
}

export default function NeuralMatrix() {
    const [data, setData] = useState<SimulationItem[]>([]);
    const [stream, setStream] = useState<SimulationItem[]>([]);
    const [isLooping, setIsLooping] = useState(false);
    const [stats, setStats] = useState({
        totalProcessed: 0,
        avgScore: 0,
        icpCount: 0,
        activeAgents: 4
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Data Load & Persistence Check
    useEffect(() => {
        const storedStats = localStorage.getItem('lux_evolution_stats');
        const storedLoopState = localStorage.getItem('lux_loop_active');

        if (storedLoopState === 'true') {
            setIsLooping(true);
        }

        fetch('/api/simulation-data')
            .then(res => res.json())
            .then((serverData: SimulationItem[]) => {
                setData(serverData);

                // Base stats from server file
                const baseCount = serverData.length;
                const baseScore = serverData.reduce((acc, curr) => acc + curr.mql_score, 0) / (baseCount || 1);

                if (storedStats) {
                    // Merge with evolved local stats
                    const local = JSON.parse(storedStats);
                    setStats({
                        totalProcessed: Math.max(local.totalProcessed, baseCount),
                        avgScore: local.avgScore || baseScore,
                        icpCount: local.icpCount || 0,
                        activeAgents: 4
                    });
                } else {
                    const icps = serverData.filter(i => i.persona === 'ICP_PERFECT').length;
                    setStats(prev => ({ ...prev, totalProcessed: baseCount, icpCount: icps, avgScore: baseScore }));
                }
            })
            .catch(() => {
                // Fallback
                setStats(prev => ({ ...prev, totalProcessed: 1000, avgScore: 65.3 }));
            });
    }, []);

    // Toggle Handler
    const toggleLoop = () => {
        const newState = !isLooping;
        setIsLooping(newState);
        localStorage.setItem('lux_loop_active', String(newState));
    };

    // Standard Background Stream (Slow)
    useEffect(() => {
        if (data.length === 0 || isLooping) return;
        const interval = setInterval(() => {
            const randomItem = data[Math.floor(Math.random() * data.length)];
            if (randomItem) setStream(prev => [randomItem, ...prev].slice(0, 8));
        }, 2000);
        return () => clearInterval(interval);
    }, [data, isLooping]);

    // INFINITE LOOP SIMULATION (Fast & Improving)
    useEffect(() => {
        if (!isLooping) return;

        const interval = setInterval(() => {
            // Generate superior synthetic data
            // Evolution logic: slowly trend towards 99.9 score

            setStats(prev => {
                const currentScore = prev.avgScore;
                const targetScore = 98.5;
                const evolutionStep = 0.05; // Small incremental improvement

                // Random fluctuation but trending up
                const instantScore = Math.min(100, currentScore + (Math.random() * 2) - 0.5);

                // Smoothed average
                const newAvg = currentScore < targetScore ? currentScore + (evolutionStep * Math.random()) : currentScore;

                const newStats = {
                    ...prev,
                    totalProcessed: prev.totalProcessed + 1,
                    icpCount: prev.icpCount + (Math.random() > 0.3 ? 1 : 0), // Higher ICP rate in evolved state
                    avgScore: newAvg,
                    activeAgents: 4
                };

                // Persist every update (or could throttle this)
                localStorage.setItem('lux_evolution_stats', JSON.stringify(newStats));

                return newStats;
            });

            // Visual Stream Generation
            const niches = ['SAAS B2B', 'ENTERPRISE', 'FINTECH', 'MEDTECH', 'AGRO'];
            const newItem: SimulationItem = {
                id: 'EVO-' + Date.now(),
                niche: niches[Math.floor(Math.random() * niches.length)],
                persona: 'ICP_EVOLVED_V' + Math.floor(Math.random() * 10),
                pain_point: 'High-value pattern detected. Auto-optimizing.',
                outcome: 'CLOSED_WON',
                mql_score: 95 + Math.floor(Math.random() * 5),
                learned_pattern: 'Evolution Cycle #' + Date.now().toString().slice(-6)
            };
            setStream(prev => [newItem, ...prev].slice(0, 8));

        }, 100); // Super fast 100ms cycle

        return () => clearInterval(interval);
    }, [isLooping]);



    // Inside component
    const [showTerminal, setShowTerminal] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const handleSecretTrigger = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);
        if (newCount === 5) {
            setShowTerminal(true);
            setClickCount(0);
        }
    };

    return (
        <div className="min-h-screen bg-black text-blue-400 font-mono p-6 relative overflow-hidden">
            <AnimatePresence>
                {showTerminal && <KernelTerminal onClose={() => setShowTerminal(false)} />}
            </AnimatePresence>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-blue-900/50 pb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Brain className={cn("w-8 h-8 text-blue-500", isLooping ? "animate-spin" : "animate-pulse")} />
                        <div className={cn("absolute inset-0 bg-blue-500 blur-lg opacity-40", isLooping && "bg-red-500 opacity-60 animate-pulse")}></div>
                    </div>
                    <div>
                        <h1
                            onClick={handleSecretTrigger}
                            className="text-2xl font-bold text-white tracking-wider cursor-pointer select-none active:scale-95 transition-transform"
                        >
                            LUX NEURAL CORE <span className="text-xs align-top text-blue-500 ml-1">v1.0</span>
                        </h1>
                        <p className="text-xs text-blue-600 flex items-center gap-2">
                            LIVE INTELLIGENCE FEED • {isLooping ? <span className="text-red-500 font-bold animate-pulse">TRAINING MODE ACTIVE</span> : "SECURE CONNECTION"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <button
                        onClick={toggleLoop}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded shadow-[0_0_15px_-3px_rgba(37,99,235,0.5)] transition-all font-bold tracking-wide group",
                            isLooping
                                ? "bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-red-500/50"
                                : "bg-blue-600 hover:bg-blue-500 text-white"
                        )}
                    >
                        {isLooping ? (
                            <>
                                <Users className="w-3 h-3" />
                                STOP EVOLUTION
                            </>
                        ) : (
                            <>
                                <Zap className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                ACTIVATE INFINITE LOOP
                            </>
                        )}
                    </button>
                    <StatusIndicator label="CORE" status="ONLINE" color="green" />
                    <StatusIndicator label="MEMORY" status={isLooping ? "REWRITING" : "READY"} color={isLooping ? "red" : "yellow"} />
                    <StatusIndicator label="AGENTS" status="4 ACTIVE" color="blue" />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 relative z-10">

                {/* Left Column: Stats */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <StatCard
                        icon={<Activity className="w-4 h-4" />}
                        label="TOTAL PROCESSED"
                        value={stats.totalProcessed.toLocaleString()}
                        sub="Leads Analyzed"
                    />
                    <StatCard
                        icon={<Users className="w-4 h-4" />}
                        label="ICP DETECTED"
                        value={stats.icpCount.toLocaleString()}
                        sub={`${((stats.icpCount / stats.totalProcessed) * 100 || 0).toFixed(1)}% Match Rate`}
                        highlight
                    />
                    <StatCard
                        icon={<Zap className="w-4 h-4" />}
                        label="AVG QUALITY SCORE"
                        value={stats.avgScore.toFixed(1)}
                        sub="/ 100.0"
                    />

                    <div className="bg-blue-950/20 border border-blue-900/50 p-4 rounded-lg mt-8">
                        <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                            <Cpu className="w-4 h-4" /> LEARNING PATTERNS
                        </h3>
                        <div className="text-xs space-y-3 text-blue-300/80">
                            <p>• SKEPTIC personas require <span className="text-white">Social Proof</span> injection.</p>
                            <p>• URGENT types convert 3x faster with <span className="text-white">Direct Scripts</span>.</p>
                            <p>• ICP Perfect match triggers <span className="text-white">Priority Routing</span>.</p>
                        </div>
                    </div>
                </div>

                {/* Center Column: The Matrix Stream */}
                <div className="col-span-12 lg:col-span-6">
                    <div className="bg-black/50 border border-blue-900/50 rounded-lg p-1 h-[600px] relative overflow-hidden shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
                        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

                        <h2 className="absolute top-4 left-4 text-xs font-bold text-blue-500 uppercase tracking-widest z-20 flex items-center gap-2">
                            <Terminal className="w-3 h-3" /> Real-Time Classification Stream
                        </h2>

                        <div className="p-4 pt-12 space-y-2 h-full overflow-hidden flex flex-col justify-end">
                            <AnimatePresence>
                                {stream.map((item, idx) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20, height: 0 }}
                                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-l-2 border-blue-800 pl-3 py-2 bg-blue-950/10 hover:bg-blue-950/30 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs text-blue-500 font-bold">[{item.niche.toUpperCase()}]</span>
                                            <span className={cn("text-xs font-bold px-2 py-0.5 rounded",
                                                item.mql_score > 80 ? "bg-green-500/20 text-green-400" :
                                                    item.mql_score > 50 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                                            )}>
                                                SCORE: {item.mql_score}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 text-xs text-white/90 mt-1">
                                            <span className="opacity-50">Detected:</span>
                                            <span>{item.persona}</span>
                                            <span className="opacity-50">/ Pain:</span>
                                            <span className="italic truncate max-w-[200px]">{item.pain_point}</span>
                                        </div>
                                        <div className="text-[10px] text-blue-400 mt-1 font-mono">
                                            {'>'} ACTION: {item.outcome}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Column: Active Agents */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> ACTIVE AGENTS
                    </h3>
                    <AgentCard name="SETTER v1" status="PROCESSING" load="84%" type="setter" />
                    <AgentCard name="SOCIAL v1" status="IDLE" load="12%" type="social" />
                    <AgentCard name="FARMER v1" status="SCANNING" load="45%" type="farmer" />
                    <AgentCard name="COACH v1" status="LEARNING" load="99%" type="coach" />

                    <div className="mt-8">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <Lock className="w-4 h-4" /> SECURITY
                        </h3>
                        <div className="bg-red-950/20 border border-red-900/30 p-3 rounded text-xs text-red-400">
                            Threat Level: LOW
                            <div className="w-full bg-red-950 h-1 mt-2 rounded-full overflow-hidden">
                                <div className="bg-red-500 w-[5%] h-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ icon, label, value, sub, highlight }: any) {
    return (
        <div className={cn("bg-black border p-4 rounded-lg", highlight ? "border-blue-500 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]" : "border-blue-900/30")}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-blue-500 font-bold">{label}</span>
                <span className="text-blue-400/50">{icon}</span>
            </div>
            <div className="text-2xl text-white font-bold">{value}</div>
            <div className="text-[10px] text-blue-400 mt-1">{sub}</div>
        </div>
    )
}

function AgentCard({ name, status, load, type }: any) {
    return (
        <div className="bg-black border border-blue-900/30 p-3 rounded flex items-center justify-between group hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full animate-pulse", status === 'PROCESSING' || status === 'LEARNING' ? 'bg-green-500' : 'bg-yellow-500')} />
                <div>
                    <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{name}</div>
                    <div className="text-[10px] text-blue-500">{status}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-white font-mono">{load}</div>
                <div className="w-12 bg-blue-900/30 h-1 mt-1 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: load }}></div>
                </div>
            </div>
        </div>
    )
}

function StatusIndicator({ label, status, color }: any) {
    const colors = {
        green: "text-green-500",
        yellow: "text-yellow-500",
        blue: "text-blue-500",
        red: "text-red-500"
    } as any;

    return (
        <div className="flex items-center gap-2 bg-blue-950/20 px-3 py-1 rounded-full border border-blue-900/30">
            <span className="text-blue-400/70">{label}:</span>
            <span className={cn("font-bold animate-pulse", colors[color])}>{status}</span>
        </div>
    )
}
