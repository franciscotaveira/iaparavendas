'use client';

import React, { useEffect, useState } from 'react';
import {
    CheckCircle,
    Circle,
    Clock,
    AlertTriangle,
    Plus,
    Filter
} from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'done' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    source: string;
    created_at: string;
}

const priorityColors = {
    low: 'text-slate-400 bg-slate-400/10',
    medium: 'text-blue-400 bg-blue-400/10',
    high: 'text-orange-400 bg-orange-400/10',
    urgent: 'text-red-400 bg-red-400/10 animate-pulse'
};

const statusIcons = {
    pending: <Circle className="w-4 h-4 text-slate-400" />,
    in_progress: <Clock className="w-4 h-4 text-blue-400" />,
    done: <CheckCircle className="w-4 h-4 text-green-400" />,
    cancelled: <AlertTriangle className="w-4 h-4 text-red-400" />
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/tasks');
            const data = await res.json();
            if (data.success) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async () => {
        if (!newTask.trim()) return;

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTask,
                    priority: 'medium',
                    source: 'dashboard'
                })
            });
            const data = await res.json();
            if (data.success) {
                setTasks([data.task, ...tasks]);
                setNewTask('');
            }
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Tarefas</h1>
                <p className="text-slate-400">Backlog do CEO - Solicitações e pendências</p>
            </div>

            {/* Add Task */}
            <div className="flex gap-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createTask()}
                    placeholder="Nova tarefa..."
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                />
                <button
                    onClick={createTask}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium flex items-center gap-2 transition"
                >
                    <Plus className="w-5 h-5" />
                    Adicionar
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['all', 'pending', 'in_progress', 'done'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === status
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        {status === 'all' ? 'Todas' :
                            status === 'pending' ? 'Pendentes' :
                                status === 'in_progress' ? 'Em andamento' : 'Concluídas'}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma tarefa encontrada</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    {statusIcons[task.status]}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">{task.title}</h3>
                                    {task.description && (
                                        <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                                    )}
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>
                                            {task.priority}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            via {task.source}
                                        </span>
                                        <span className="text-xs text-slate-600">
                                            {new Date(task.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
