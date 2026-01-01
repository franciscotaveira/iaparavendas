import React, { useState } from 'react';
import { HeartbeatMonitor } from './HeartbeatMonitor';
import { DojoArena } from './DojoArena';

/**
 * DASHBOARD CONTAINER (ANTIGRAVITY OS)
 * O layout principal que integra tudo.
 * Possui o botão secreto "Insta-Mode" para gerar conteúdo.
 */

export const AntigravityDashboard: React.FC = () => {
    const [instaMode, setInstaMode] = useState(false);

    // Toggle para modo de gravação (esconde dados sensíveis, aumenta UI)
    const toggleInstaMode = () => setInstaMode(!instaMode);

    return (
        <div className={`min-h-screen max-h-screen overflow-y-auto overflow-x-hidden bg-black text-white font-mono transition-all duration-500 ${instaMode ? 'p-0 overflow-hidden' : 'p-6'}`}>

            {/* Header / Top Bar */}
            <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${true ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_10px_#22c55e]`}></div>
                    <h1 className="text-xl font-bold tracking-tighter text-gray-200">
                        MCT<span className="text-green-500">_OS</span> v1.4
                    </h1>
                </div>

                {/* Botão Secreto para ativar Insta-Mode */}
                <button
                    onClick={toggleInstaMode}
                    className={`px-3 py-1 text-xs border rounded transition-colors ${instaMode ? 'bg-purple-600 border-purple-500 text-white' : 'border-gray-700 text-gray-500 hover:text-white'}`}
                >
                    {instaMode ? 'REC_MODE [ON]' : 'REC_MODE [OFF]'}
                </button>
            </header>

            {/* Grid Principal */}
            <div className={`grid gap-6 ${instaMode ? 'grid-cols-1 max-w-md mx-auto mt-20 scale-110' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>

                {/* Módulo 1: Heartbeat (Sinal de Vida) */}
                <div className="col-span-1">
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">System Vitality</div>
                    <HeartbeatMonitor bpm={72} active={true} />
                    <div className="mt-2 flex justify-between text-xs text-gray-600">
                        <span>UPTIME: 99.9%</span>
                        <span>MEMORY: 37 AGENTS</span>
                    </div>
                </div>

                {/* Módulo Especial: Soberania Digital (Novo) */}
                <div className="col-span-1 border border-green-900/30 bg-green-900/5 rounded p-4">
                    <div className="text-[10px] text-green-500 mb-2 uppercase tracking-widest flex justify-between">
                        <span>Sovereign Connection</span>
                        <span className="animate-pulse">● LIVE</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">📱</div>
                        <div>
                            <div className="text-sm font-bold text-gray-200">Evolution_API v1.8</div>
                            <div className="text-[10px] text-gray-500 font-mono">Instance: Antigravity_Main</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-green-900/20">
                        <div className="flex justify-between text-[10px] text-green-400">
                            <span>MESSAGES TODAY: 142</span>
                            <span>LATENCY: 42ms</span>
                        </div>
                    </div>
                </div>

                {/* Módulo 2: Dojô (Conflito Visual) */}
                <div className={`${instaMode ? 'col-span-1' : 'col-span-1 lg:col-span-2'}`}>
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Evolution Arena</div>
                    <DojoArena />
                </div>

                {/* Módulo 3: Dados Sensíveis (Somem no Insta-Mode) */}
                {!instaMode && (
                    <div className="col-span-1 border border-gray-800 rounded p-4 opacity-50">
                        <div className="mb-2 text-red-500 text-xs flex justify-between">
                            <span>PRIVATE_DATA_LAYER</span>
                            <span>[BLOCKED IN REC_MODE]</span>
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
                POWERED BY MCT CONSCIOUSNESS
            </footer>

            {/* Overlay Scanlines Global */}
            <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
        </div>
    );
};
