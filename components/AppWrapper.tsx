
'use client';

import React from 'react';
import NeuralBackground from '@/components/MCT_OS/NeuralBackground';
import AntigravityPortal from '@/components/AntigravityPortal';

interface AppWrapperProps {
    children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
    return (
        <div className="relative min-h-screen selection:bg-blue-500/30">
            {/* O NeuralBackground agora é a base de tudo */}
            <NeuralBackground />

            {/* O Antigravity Portal agora é global - Te acompanha em tudo */}
            <AntigravityPortal />

            {/* O conteúdo flutua sobre o cérebro do sistema */}
            <div className="relative z-10 w-full min-h-screen">
                {children}
            </div>

            {/* Overlay de Grão para textura premium */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015] mix-blend-overlay bg-[url('/noise.png')]" />
        </div>
    );
}
