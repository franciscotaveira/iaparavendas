'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Settings, Save, Eye, EyeOff, RefreshCw, LogOut,
    Database, Bot, Zap, Bell, Shield, Globe
} from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const [settings, setSettings] = useState({
        companyName: 'Lux Growth IA',
        whatsappNumber: '+55 49 98844-7562',
        calendlyUrl: 'https://calendly.com/mycodingteam/reuniao-agente-humanizado',
        notificationsEnabled: true,
        darkMode: true,
    });

    const handleSave = async () => {
        setLoading(true);
        // Simulate save
        await new Promise(r => setTimeout(r, 1000));
        setSaved(true);
        setLoading(false);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
                    <p className="text-slate-400">Gerencie as configurações do sistema.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sair
                </button>
            </div>

            {/* Settings Sections */}
            <div className="grid gap-6">
                {/* General */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Geral</h2>
                            <p className="text-sm text-slate-500">Configurações básicas da empresa</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Nome da Empresa</label>
                            <input
                                type="text"
                                value={settings.companyName}
                                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                className="w-full px-4 py-3 bg-black/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">WhatsApp</label>
                            <input
                                type="text"
                                value={settings.whatsappNumber}
                                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-black/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Calendly URL</label>
                            <input
                                type="text"
                                value={settings.calendlyUrl}
                                onChange={(e) => setSettings({ ...settings, calendlyUrl: e.target.value })}
                                className="w-full px-4 py-3 bg-black/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Database className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Status do Sistema</h2>
                            <p className="text-sm text-slate-500">Conexões e integrações ativas</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <StatusCard label="Supabase" status="connected" />
                        <StatusCard label="OpenRouter API" status="connected" />
                        <StatusCard label="Telegram Bot" status="connected" />
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <Bell className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Notificações</h2>
                            <p className="text-sm text-slate-500">Alertas e avisos do sistema</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                        <div>
                            <p className="text-white font-medium">Notificações ativas</p>
                            <p className="text-sm text-slate-500">Receber alertas de novos leads</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })}
                            className={`w-12 h-6 rounded-full transition-colors ${settings.notificationsEnabled ? 'bg-green-500' : 'bg-slate-600'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-semibold rounded-xl transition-all"
                >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Salvo!' : 'Salvar Configurações'}
                </button>
            </div>
        </div>
    );
}

function StatusCard({ label, status }: { label: string, status: 'connected' | 'disconnected' }) {
    return (
        <div className={`p-4 rounded-lg border ${status === 'connected'
            ? 'bg-green-950/20 border-green-500/30'
            : 'bg-red-950/20 border-red-500/30'}`}>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="text-sm font-medium text-white">{label}</span>
            </div>
            <p className={`text-xs mt-1 ${status === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                {status === 'connected' ? 'Conectado' : 'Desconectado'}
            </p>
        </div>
    );
}
