'use client';

import React from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    MessageSquare,
    Target,
    Zap,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

export default function MarketingPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Marketing Ops</h1>
                <p className="text-slate-400 text-sm">Métricas e performance das campanhas</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    label="Visitantes Site"
                    value="2,847"
                    change="+12%"
                    trend="up"
                    icon={<Users className="w-5 h-5" />}
                />
                <KPICard
                    label="Demos Iniciadas"
                    value="156"
                    change="+28%"
                    trend="up"
                    icon={<MessageSquare className="w-5 h-5" />}
                />
                <KPICard
                    label="Leads Qualificados"
                    value="43"
                    change="+8%"
                    trend="up"
                    icon={<Target className="w-5 h-5" />}
                />
                <KPICard
                    label="Taxa Conversão"
                    value="27.5%"
                    change="-2%"
                    trend="down"
                    icon={<TrendingUp className="w-5 h-5" />}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Funnel */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        Funil de Conversão
                    </h3>

                    <div className="space-y-4">
                        <FunnelStep
                            label="Visitantes"
                            value={2847}
                            percentage={100}
                            color="bg-slate-600"
                        />
                        <FunnelStep
                            label="Iniciaram Demo"
                            value={156}
                            percentage={5.5}
                            color="bg-blue-500"
                        />
                        <FunnelStep
                            label="Completaram Demo"
                            value={89}
                            percentage={57}
                            color="bg-teal-500"
                        />
                        <FunnelStep
                            label="Solicitaram Contato"
                            value={43}
                            percentage={48}
                            color="bg-emerald-500"
                        />
                        <FunnelStep
                            label="Fecharam"
                            value={12}
                            percentage={28}
                            color="bg-green-400"
                        />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Atividade Recente
                    </h3>

                    <div className="space-y-4">
                        {[
                            { type: 'lead', name: 'Dr. Paulo Freitas', action: 'Solicitou contato', time: '5 min', specialty: 'Ortopedia' },
                            { type: 'demo', name: 'Clínica Bem Estar', action: 'Iniciou demo', time: '12 min', specialty: 'Estética' },
                            { type: 'visit', name: 'Anônimo', action: 'Visitou página de preços', time: '18 min', specialty: '-' },
                            { type: 'demo', name: 'Dra. Carla Nunes', action: 'Completou demo', time: '25 min', specialty: 'Dermatologia' },
                            { type: 'lead', name: 'Centro Médico ABC', action: 'Enviou formulário', time: '1h', specialty: 'Multi-especialidade' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                                <div className={`w-2 h-2 rounded-full ${item.type === 'lead' ? 'bg-emerald-400' :
                                        item.type === 'demo' ? 'bg-blue-400' : 'bg-slate-400'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm text-white">{item.name}</p>
                                    <p className="text-xs text-slate-400">{item.action} • {item.specialty}</p>
                                </div>
                                <span className="text-xs text-slate-500">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-colors text-left">
                        <Calendar className="w-5 h-5 text-blue-400 mb-2" />
                        <p className="text-sm font-medium text-white">Agendar Post</p>
                        <p className="text-xs text-slate-400">Redes sociais</p>
                    </button>
                    <button className="p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-teal-500/50 transition-colors text-left">
                        <MessageSquare className="w-5 h-5 text-teal-400 mb-2" />
                        <p className="text-sm font-medium text-white">Enviar Campanha</p>
                        <p className="text-xs text-slate-400">E-mail marketing</p>
                    </button>
                    <button className="p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-purple-500/50 transition-colors text-left">
                        <Target className="w-5 h-5 text-purple-400 mb-2" />
                        <p className="text-sm font-medium text-white">Criar Audiência</p>
                        <p className="text-xs text-slate-400">Facebook/Google Ads</p>
                    </button>
                    <button className="p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-yellow-500/50 transition-colors text-left">
                        <BarChart3 className="w-5 h-5 text-yellow-400 mb-2" />
                        <p className="text-sm font-medium text-white">Ver Relatório</p>
                        <p className="text-xs text-slate-400">Analytics completo</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

function KPICard({ label, value, change, trend, icon }: {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ReactNode;
}) {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">{icon}</span>
                <span className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {change}
                </span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
        </div>
    );
}

function FunnelStep({ label, value, percentage, color }: {
    label: string;
    value: number;
    percentage: number;
    color: string;
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-slate-300">{label}</span>
                <span className="text-white font-mono">{value.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
            <p className="text-xs text-slate-500 text-right">{percentage}%</p>
        </div>
    );
}
