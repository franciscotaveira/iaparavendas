import React, { useState, useEffect } from 'react';

/**
 * DOJO ARENA (ANTIGRAVITY STYLE)
 * Visualiza o conflito darwiniano entre agentes.
 * Estilo retro-fighting game (Street Fighter / Pokémon Gameboy).
 */

interface AgentProps {
    name: string;
    role: string; // ex: "Vendedor", "Suporte"
    winRate: number; // 0 a 100
    avatarColor: string;
}

export const DojoArena: React.FC = () => {
    // Estado simulado para demo (você conectaria isso ao seu backend real)
    const [agentA] = useState<AgentProps>({ name: "HUNTER_V1", role: "Closer", winRate: 67, avatarColor: "#ef4444" });
    const [agentB] = useState<AgentProps>({ name: "HUNTER_V2", role: "Closer", winRate: 72, avatarColor: "#3b82f6" });

    const [log, setLog] = useState<string[]>(["Arena inicializada...", "Carregando modelos de argumento..."]);

    // Simula logs chegando em tempo real
    useEffect(() => {
        const interval = setInterval(() => {
            const actions = [
                "Agente A tentou objeção de preço...",
                "Agente B respondeu com ancoragem de valor...",
                "Agente B detectou hesitação...",
                "Round finalizado. Vencedor: Agente B"
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            setLog(prev => [randomAction, ...prev].slice(0, 5));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full border border-gray-800 bg-gray-950 rounded-lg p-4 font-mono text-sm relative overflow-hidden">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-2">
                <span className="text-yellow-500 font-bold tracking-widest">DOJO_ARENA // LIVE</span>
                <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs text-gray-400">TRAINING IN PROGRESS</span>
                </div>
            </div>

            {/* Arena Visual */}
            <div className="flex justify-between items-end h-40 px-8 mb-6 relative">

                {/* Background Grid (Chão) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-900 to-transparent opacity-50 border-t border-gray-800 transform perspective-500"></div>

                {/* Agente A (Esquerda) */}
                <div className="flex flex-col items-center z-10">
                    <div className="mb-2 bg-black/50 px-2 py-1 rounded border border-red-900">
                        <div className="text-xs text-red-400">{agentA.name}</div>
                        <div className="w-full bg-gray-800 h-1 mt-1">
                            <div className="bg-red-500 h-full" style={{ width: `${agentA.winRate}%` }}></div>
                        </div>
                    </div>
                    {/* Avatar Pixel Art Simulado (Placeholder) */}
                    <div className="w-16 h-16 bg-red-900/20 border-2 border-red-500 animate-bounce-slow flex items-center justify-center">
                        <span className="text-2xl">👾</span>
                    </div>
                </div>

                {/* VS Badge */}
                <div className="mb-8 text-2xl font-black text-gray-700 italic">VS</div>

                {/* Agente B (Direita) */}
                <div className="flex flex-col items-center z-10">
                    <div className="mb-2 bg-black/50 px-2 py-1 rounded border border-blue-900">
                        <div className="text-xs text-blue-400">{agentB.name}</div>
                        <div className="w-full bg-gray-800 h-1 mt-1">
                            <div className="bg-blue-500 h-full" style={{ width: `${agentB.winRate}%` }}></div>
                        </div>
                    </div>
                    {/* Avatar Pixel Art Simulado (Placeholder) */}
                    <div className="w-16 h-16 bg-blue-900/20 border-2 border-blue-500 animate-bounce-slow flex items-center justify-center" style={{ animationDelay: '0.5s' }}>
                        <span className="text-2xl">🤖</span>
                    </div>
                </div>
            </div>

            {/* Combat Log */}
            <div className="bg-black border border-gray-800 p-2 h-24 overflow-y-auto font-xs text-green-400/80">
                {log.map((line, i) => (
                    <div key={i} className="mb-1 border-l-2 border-green-900 pl-2">
                        <span className="text-gray-500 text-[10px] mr-2">{new Date().toLocaleTimeString()}</span>
                        {line}
                    </div>
                ))}
            </div>

            {/* CSS interno para animação (só para este componente) */}
            <style>{`
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 2s infinite ease-in-out;
        }
      `}</style>
        </div>
    );
};
