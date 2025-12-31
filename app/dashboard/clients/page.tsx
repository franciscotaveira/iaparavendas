'use client';

import React, { useState } from 'react';
import {
    Users,
    Search,
    Plus,
    MoreVertical,
    Phone,
    Mail,
    Building2,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import Link from 'next/link';

interface Client {
    id: string;
    name: string;
    clinic: string;
    specialty: string;
    phone: string;
    email: string;
    status: 'active' | 'onboarding' | 'pending' | 'inactive';
    messagesLast30d: number;
    leadsGenerated: number;
    createdAt: string;
}

// Mock data - será substituído por dados do Supabase
const mockClients: Client[] = [
    {
        id: '1',
        name: 'Dr. Carlos Mendes',
        clinic: 'Clínica Derma Plus',
        specialty: 'Dermatologia',
        phone: '+55 49 99999-1111',
        email: 'carlos@dermaplus.com',
        status: 'active',
        messagesLast30d: 1247,
        leadsGenerated: 89,
        createdAt: '2024-01-15'
    },
    {
        id: '2',
        name: 'Dra. Ana Souza',
        clinic: 'Odonto Sorrisos',
        specialty: 'Odontologia',
        phone: '+55 49 99999-2222',
        email: 'ana@odontosorrisos.com',
        status: 'active',
        messagesLast30d: 892,
        leadsGenerated: 56,
        createdAt: '2024-02-20'
    },
    {
        id: '3',
        name: 'Dr. Roberto Lima',
        clinic: 'Clínica Cardio Vida',
        specialty: 'Cardiologia',
        phone: '+55 49 99999-3333',
        email: 'roberto@cardiovida.com',
        status: 'onboarding',
        messagesLast30d: 0,
        leadsGenerated: 0,
        createdAt: '2024-12-28'
    },
    {
        id: '4',
        name: 'Dra. Maria Santos',
        clinic: 'Estética Premium',
        specialty: 'Estética',
        phone: '+55 49 99999-4444',
        email: 'maria@esteticapremium.com',
        status: 'pending',
        messagesLast30d: 0,
        leadsGenerated: 0,
        createdAt: '2024-12-30'
    }
];

const statusConfig = {
    active: { label: 'Ativo', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
    onboarding: { label: 'Em Setup', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Clock },
    pending: { label: 'Pendente', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: AlertCircle },
    inactive: { label: 'Inativo', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: AlertCircle }
};

export default function ClientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredClients = mockClients.filter(client => {
        const matchesSearch =
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.specialty.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || client.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Carteira de Clientes</h1>
                    <p className="text-slate-400 text-sm">Gerencie os clientes e seus assistentes</p>
                </div>

                <Link
                    href="/dashboard/onboarding"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Novo Cliente
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, clínica ou especialidade..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                    <option value="all">Todos os status</option>
                    <option value="active">Ativos</option>
                    <option value="onboarding">Em Setup</option>
                    <option value="pending">Pendentes</option>
                    <option value="inactive">Inativos</option>
                </select>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <p className="text-2xl font-bold text-white">{mockClients.length}</p>
                    <p className="text-xs text-slate-400">Total de Clientes</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <p className="text-2xl font-bold text-emerald-400">{mockClients.filter(c => c.status === 'active').length}</p>
                    <p className="text-xs text-slate-400">Ativos</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <p className="text-2xl font-bold text-blue-400">{mockClients.filter(c => c.status === 'onboarding').length}</p>
                    <p className="text-xs text-slate-400">Em Setup</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <p className="text-2xl font-bold text-white">
                        {mockClients.reduce((acc, c) => acc + c.leadsGenerated, 0)}
                    </p>
                    <p className="text-xs text-slate-400">Leads Gerados (Total)</p>
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Contato</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Msgs/30d</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Leads</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client, idx) => {
                                const StatusIcon = statusConfig[client.status].icon;
                                return (
                                    <tr
                                        key={client.id}
                                        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${idx === filteredClients.length - 1 ? 'border-b-0' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                    {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{client.name}</p>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Building2 className="w-3 h-3" />
                                                        {client.clinic} • {client.specialty}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="space-y-1 text-sm">
                                                <p className="text-slate-300 flex items-center gap-2">
                                                    <Phone className="w-3 h-3 text-slate-500" />
                                                    {client.phone}
                                                </p>
                                                <p className="text-slate-400 flex items-center gap-2">
                                                    <Mail className="w-3 h-3 text-slate-500" />
                                                    {client.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[client.status].color}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusConfig[client.status].label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right hidden lg:table-cell">
                                            <span className="text-white font-mono">{client.messagesLast30d.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right hidden lg:table-cell">
                                            <span className="text-emerald-400 font-mono">{client.leadsGenerated}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                                                    title="Ver conversas"
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                                                    title="Mais opções"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredClients.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">Nenhum cliente encontrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}
