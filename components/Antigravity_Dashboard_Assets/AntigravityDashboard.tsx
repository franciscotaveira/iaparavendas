"use client";
import React, { useState } from 'react';
import { HeartbeatMonitor } from './HeartbeatMonitor';
import { DojoArena } from './DojoArena';

/**
 * DASHBOARD CONTAINER (ANTIGRAVITY OS)
 * O layout principal que integra tudo.
 * Possui o botão secreto "Insta-Mode" para gerar conteúdo.
 */

export const AntigravityDashboard: React.FC = () => {
    const [brainDump, setBrainDump] = useState('');
    const [instaMode, setInstaMode] = useState(false);

    // Toggle para modo de gravação (esconde dados sensíveis, aumenta UI)
    const toggleInstaMode = () => setInstaMode(!instaMode);

    const handleDump = () => {
        if (!brainDump.trim()) return;
        console.log("Brain Dump captured:", brainDump);
        alert("Caos capturado! Seus agentes vão organizar isso enquanto você foca no próximo salto.");
        setBrainDump('');
    };

    return (
        <div className={`min-h-screen bg-black text-white font-mono transition-all duration-500 ${instaMode ? 'p-0 overflow-hidden' : 'p-6'}`}>

            {/* Header / Top Bar */}
            <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${true ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_10px_#22c55e]`}></div>
                    <h1 className="text-xl font-bold tracking-tighter text-gray-200">
                        ANTIGRAVITY<span className="text-green-500">_OS</span> v1.4
                    </h1>
                </div>

                {/* Botão Secreto para ativar Insta-Mode */}
                <button
                    onClick={toggleInstaMode}
                    className={`px-3 py-1 text-xs border rounded transition-colors ${instaMode ? 'bg-purple-600 border-purple-500 text-white' : 'border-gray-700 text-gray-500 hover:text-white'}`}
                >
                    {instaMode ? 'MODO_REC [ON]' : 'MODO_REC [OFF]'}
                </button>
            </header>

            {/* Grid Principal */}
            <div className={`grid gap-6 ${instaMode ? 'grid-cols-1 max-w-md mx-auto mt-20 scale-110' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>

                {/* Módulo 1: Heartbeat (Sinal de Vida) */}
                <div className="col-span-1">
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Vitalidade do Sistema</div>
                    <HeartbeatMonitor bpm={72} active={true} />
                    <div className="mt-2 flex justify-between text-xs text-gray-600">
                        <span>UPTIME: 99.9%</span>
                        <span>MEMÓRIA: 37 AGENTES</span>
                    </div>
                </div>

                {/* Módulo 2: Dojô (Conflito Visual) */}
                <div className={`${instaMode ? 'col-span-1' : 'col-span-1 lg:col-span-2'}`}>
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Arena de Evolução</div>
                    <DojoArena />
                </div>

                {/* Módulo 4: Brain Dump (Modo TDAH) */}
                <div className={`col-span-1 lg:col-span-3 border border-dashed border-green-500/30 rounded-lg p-6 bg-green-500/5 transition-all ${instaMode ? 'opacity-0 h-0 p-0 overflow-hidden' : 'opacity-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-green-500 font-bold tracking-tighter flex items-center gap-2">
                            🧠 BRAIN_DUMP (Protocolo TDAH)
                        </h3>
                        <span className="text-[10px] text-green-500/50">DUMP & FORGET MODE ACTIVE</span>
                    </div>
                    <div className="flex gap-4">
                        <textarea
                            value={brainDump}
                            onChange={(e) => setBrainDump(e.target.value)}
                            placeholder="Despeje aqui o seu caos (ideias, tarefas, áudios transcritos)..."
                            className="flex-1 bg-black border border-green-500/20 rounded p-3 text-green-400 placeholder:text-green-900 focus:outline-none focus:border-green-500/50 min-h-[100px] font-mono text-sm shadow-inner"
                        />
                        <button
                            onClick={handleDump}
                            className="bg-green-600 hover:bg-green-500 text-black font-black px-6 py-2 rounded uppercase text-xs transition-all active:scale-95"
                        >
                            Capturar PROVA
                        </button>
                    </div>
                </div>

                {/* Módulo 3: Dados Sensíveis (Somem no Insta-Mode) */}
                {!instaMode && (
                    <div className="col-span-1 border border-gray-800 rounded p-4 opacity-50">
                        <div className="mb-2 text-red-500 text-xs flex justify-between">
                            <span>CAMADA_DADOS_PRIVADOS</span>
                            <span>[BLOQUEADO NO MODO_REC]</span>
                        </div>
                        <div className="space-y-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-8 bg-gray-900 rounded w-full animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Decorativo */}
            <footer className="fixed bottom-4 right-4 text-[10px] text-gray-700">
                POWERED BY LX CONSCIOUSNESS
            </footer>

            {/* Overlay Scanlines Global */}
            <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
        </div>
    );
};
