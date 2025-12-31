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
    MessageSquare,
    CheckSquare,
    BarChart3,
    Smartphone
} from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isWarRoomOpen, setIsWarRoomOpen] = useState(false);
    const [isSingularityOpen, setIsSingularityOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock Data for the modals (until we fetch real data)
    const mockAgents = {
        agents: {
            sales: [{ role: 'sdr', name: 'Ana (SDR)', description: 'Lead Qualification', category: 'sales' }],
            dev: [{ role: 'tech_lead', name: 'Neo (Tech)', description: 'Architecture', category: 'dev' }]
        }
    };

    return (
        <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans relative">

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-14 bg-[#0B1120] border-b border-slate-800 flex items-center justify-between px-4 z-40 md:hidden">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="font-bold text-sm tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                    LUMAX
                </span>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed md:relative
                w-64 h-full
                border-r border-slate-800 bg-[#0B1120] 
                flex flex-col z-40
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 flex items-center gap-2 border-b border-slate-800/50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">L</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                        LUMAX
                    </span>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="ml-auto p-1.5 hover:bg-slate-800 rounded-lg md:hidden"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="pb-2">
                        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Clientes & Produção
                        </p>
                        <NavItem href="/dashboard" icon={<LayoutDashboard />} label="Visão Geral" onClick={() => setIsSidebarOpen(false)} />
                        <NavItem href="/dashboard/clients" icon={<Users />} label="Carteira de Clientes" onClick={() => setIsSidebarOpen(false)} />
                        <NavItem href="/dashboard/connect" icon={<Smartphone />} label="Conexões WABA" onClick={() => setIsSidebarOpen(false)} />
                    </div>

                    <div className="pt-4 pb-2 border-t border-slate-800/50">
                        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Staff Interno (Council)
                        </p>
                        {/* War Room agora é ferramenta interna de gestão */}
                        <button
                            onClick={() => { setIsWarRoomOpen(true); setIsSidebarOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors mb-2 border border-dashed border-indigo-900/50 group"
                        >
                            <BrainCircuit className="w-4 h-4 group-hover:animate-pulse" />
                            Consultar o Conselho
                        </button>
                        <NavItem href="/dashboard/marketing" icon={<BarChart3 />} label="Marketing Ops" onClick={() => setIsSidebarOpen(false)} />
                        <NavItem href="/dashboard/tasks" icon={<CheckSquare />} label="Tarefas Internas" onClick={() => setIsSidebarOpen(false)} />
                    </div>

                    <div className="pt-4 pb-2 border-t border-slate-800/50">
                        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Admin
                        </p>
                        <NavItem href="/settings" icon={<Settings />} label="Configurações" onClick={() => setIsSidebarOpen(false)} />
                        <NavItem href="/api/health" icon={<Activity />} label="System Status" external onClick={() => setIsSidebarOpen(false)} />
                    </div>
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
            <main className="flex-1 overflow-auto relative pt-14 md:pt-0">
                {/* Background Grid CSS Pattern */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #4f46e5 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}>
                </div>

                <div className="relative z-10 p-4 md:p-8 min-h-full">
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

function NavItem({ href, icon, label, active, external, onClick }: any) {
    return (
        external ? (
            <a href={href} target="_blank" onClick={onClick} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${active
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-[0_0_10px_rgba(79,70,229,0.1)]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}>
                {React.cloneElement(icon, { size: 18 })}
                {label}
            </a>
        ) : (
            <Link href={href} onClick={onClick} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${active
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-[0_0_10px_rgba(79,70,229,0.1)]'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}>
                {React.cloneElement(icon, { size: 18 })}
                {label}
            </Link>
        )
    );
}
