'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SingularityModal from '@/components/SingularityModal';
import WarRoomModal from '@/components/WarRoomModal';
import {
    LayoutDashboard,
    Users,
    BrainCircuit,
    Database,
    Settings,
    Activity,
    Zap,
    ShieldAlert,
    MessageSquare
} from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isWarRoomOpen, setIsWarRoomOpen] = useState(false);
    const [isSingularityOpen, setIsSingularityOpen] = useState(false);

    // Mock Data for the modals (until we fetch real data)
    const mockAgents = {
        agents: {
            sales: [{ role: 'sdr', name: 'Ana (SDR)', description: 'Lead Qualification', category: 'sales' }],
            dev: [{ role: 'tech_lead', name: 'Neo (Tech)', description: 'Architecture', category: 'dev' }]
        }
    };

    return (
        <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans relative">

            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-[#0B1120] flex flex-col z-20">
                <div className="p-6 flex items-center gap-2 border-b border-slate-800/50">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        LX AGENTS
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <NavItem href="/dashboard" icon={<LayoutDashboard />} label="Visão Geral" />
                    <NavItem href="/dashboard/simulator" icon={<MessageSquare />} label="Simulador WhatsApp" />

                    {/* War Room Action Button (Modal Trigger) */}
                    <button
                        onClick={() => setIsWarRoomOpen(true)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-2 mb-2 border border-dashed border-red-900/50 group"
                    >
                        <ShieldAlert className="w-4 h-4 group-hover:animate-pulse" />
                        War Room (Council)
                    </button>

                    <div className="pt-4 pb-2">
                        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Operações
                        </p>
                    </div>
                    <NavItem href="/dashboard/agents" icon={<Users />} label="Tropa de Agentes" />
                    <NavItem href="/dashboard/memory" icon={<Database />} label="Memória Corp." />
                    <NavItem href="/dashboard/workflows" icon={<Zap />} label="Automações" />

                    <div className="pt-4 pb-2">
                        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Sistema
                        </p>
                    </div>
                    <NavItem href="/dashboard/neural" icon={<BrainCircuit />} label="Neural Core" />
                    <NavItem href="/api/health" icon={<Activity />} label="Health Status" external />
                    <NavItem href="/settings" icon={<Settings />} label="Configurações" />
                </nav>

                <div className="p-4 border-t border-slate-800 bg-[#050B14]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-medium">Admin</p>
                            <p className="text-xs text-slate-500">online</p>
                        </div>
                    </div>
                    {/* Secret Trigger for OMEGA */}
                    <div className="mt-2 flex justify-center">
                        <button
                            onClick={() => setIsSingularityOpen(true)}
                            className="opacity-20 hover:opacity-100 hover:text-amber-500 transition-all text-[9px]"
                            title="Project OMEGA"
                        >
                            v2.4.9 Omega Core
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative">
                {/* Background Grid CSS Pattern */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #4f46e5 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}>
                </div>

                <div className="relative z-10 p-8 min-h-full">
                    {children}
                </div>
            </main>

            {/* Global Modals */}
            <SingularityModal
                isOpen={isSingularityOpen}
                onClose={() => setIsSingularityOpen(false)}
                agents={mockAgents}
            />
            <WarRoomModal
                isOpen={isWarRoomOpen}
                onClose={() => setIsWarRoomOpen(false)}
                agents={mockAgents}
            />
        </div>
    );
}

function NavItem({ href, icon, label, active, external }: any) {
    return (
        external ? (
            <a href={href} target="_blank" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${active
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-[0_0_10px_rgba(79,70,229,0.1)]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}>
                {React.cloneElement(icon, { size: 18 })}
                {label}
            </a>
        ) : (
            <Link href={href} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${active
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-[0_0_10px_rgba(79,70,229,0.1)]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}>
                {React.cloneElement(icon, { size: 18 })}
                {label}
            </Link>
        )
    );
}
