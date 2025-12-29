'use client';

import React from 'react';
import { Settings, Database, Key, Bell, Palette, ShieldCheck, Construction } from 'lucide-react';

export default function SettingsPage() {
    const settingsGroups = [
        { icon: <Database />, title: 'Banco de Dados', description: 'Conectar Supabase' },
        { icon: <Key />, title: 'Chaves de API', description: 'OpenRouter, Meta, Telegram' },
        { icon: <Bell />, title: 'Notificações', description: 'Alertas de Handoff' },
        { icon: <Palette />, title: 'Aparência', description: 'Tema e Cores' },
        { icon: <ShieldCheck />, title: 'Segurança', description: 'HMAC e Criptografia' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Settings className="w-7 h-7 text-slate-500" />
                    Configurações
                </h1>
                <p className="text-slate-400">Gerencie as integrações e preferências do sistema.</p>
            </div>

            {/* Under Construction Banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 flex items-center gap-4">
                <Construction className="w-10 h-10 text-amber-500" />
                <div>
                    <h3 className="text-lg font-bold text-amber-400">Área em Construção</h3>
                    <p className="text-sm text-amber-200/70">
                        Esta seção está sendo finalizada. Em breve você poderá configurar todas as integrações diretamente por aqui.
                    </p>
                </div>
            </div>

            {/* Preview of Settings Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {settingsGroups.map((item, i) => (
                    <div
                        key={i}
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 opacity-60 cursor-not-allowed hover:opacity-80 transition-opacity"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            {React.cloneElement(item.icon, { className: 'w-5 h-5 text-slate-500' })}
                            <h4 className="font-semibold text-slate-300">{item.title}</h4>
                        </div>
                        <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
