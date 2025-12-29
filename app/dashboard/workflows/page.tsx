'use client';

import React, { useState, useEffect } from 'react';
import {
    GitBranch,
    CheckCircle2,
    Clock,
    Play,
    Pause,
    Settings,
    Zap,
    MessageSquare,
    Database,
    Phone,
    ArrowRight
} from 'lucide-react';

interface WorkflowStep {
    id: string;
    label: string;
    icon: any;
    status: 'pending' | 'processing' | 'completed' | 'error';
}

interface Workflow {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'paused';
    lastRun: string;
    steps: WorkflowStep[];
}

export default function WorkflowsPage() {
    // Mock Data simulating real workflows
    const [workflows, setWorkflows] = useState<Workflow[]>([
        {
            id: 'wf-01',
            name: 'Inbound Lead Qualification',
            description: 'Automatic triage of leads from website forms via WhatsApp',
            status: 'active',
            lastRun: 'Just now',
            steps: [
                { id: 's1', label: 'Form Submit', icon: MessageSquare, status: 'completed' },
                { id: 's2', label: 'Enrichment (Clearbit)', icon: Database, status: 'completed' },
                { id: 's3', label: 'AI Score', icon: Zap, status: 'processing' },
                { id: 's4', label: 'CRM Update', icon: GitBranch, status: 'pending' },
                { id: 's5', label: 'Notify Sales', icon: Phone, status: 'pending' }
            ]
        },
        {
            id: 'wf-02',
            name: 'Nurture Sequence Alpha',
            description: '30-day reactivation campaign for cold leads',
            status: 'active',
            lastRun: '12 min ago',
            steps: [
                { id: 's1', label: 'Audience Segment', icon: Database, status: 'completed' },
                { id: 's2', label: 'Content Gen (GPT-4)', icon: Zap, status: 'completed' },
                { id: 's3', label: 'Send Email', icon: MessageSquare, status: 'completed' },
                { id: 's4', label: 'Wait 3 Days', icon: Clock, status: 'pending' }
            ]
        },
        {
            id: 'wf-03',
            name: 'Competitor Watch',
            description: 'Daily scraping of top 5 competitors aiming for price changes',
            status: 'paused',
            lastRun: 'Yesterday',
            steps: [
                { id: 's1', label: 'Scrape Sites', icon: Database, status: 'pending' },
                { id: 's2', label: 'Diff Analysis', icon: Zap, status: 'pending' },
                { id: 's3', label: 'Report Gen', icon: MessageSquare, status: 'pending' }
            ]
        }
    ]);

    // Simulate "Live" processing
    useEffect(() => {
        const interval = setInterval(() => {
            setWorkflows(prev => prev.map(wf => {
                if (wf.status === 'paused') return wf;

                // Simple state rotation logic for demo visually
                const newSteps = [...wf.steps];
                const processingIdx = newSteps.findIndex(s => s.status === 'processing');

                if (processingIdx !== -1) {
                    // Move current to completed
                    newSteps[processingIdx] = { ...newSteps[processingIdx], status: 'completed' };
                    // Move next to processing (or reset if done)
                    if (processingIdx + 1 < newSteps.length) {
                        newSteps[processingIdx + 1] = { ...newSteps[processingIdx + 1], status: 'processing' };
                    } else {
                        // Reset for loop effect
                        newSteps.forEach((s, i) => s.status = i === 0 ? 'processing' : 'pending');
                    }
                } else {
                    // Check if all completed, restart
                    const allDone = newSteps.every(s => s.status === 'completed');
                    if (allDone || newSteps.every(s => s.status === 'pending')) {
                        newSteps.forEach((s, i) => s.status = i === 0 ? 'processing' : 'pending');
                    }
                }

                return { ...wf, steps: newSteps, lastRun: 'Just now' };
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Automações & Pipelines</h1>
                <p className="text-slate-400">Orquestração visual dos processos autônomos.</p>
            </div>

            <div className="grid gap-6">
                {workflows.map(wf => (
                    <div key={wf.id} className="bg-[#0B1120] border border-slate-800 rounded-lg p-6 relative overflow-hidden group hover:border-indigo-900/50 transition-all">
                        {/* Status Line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${wf.status === 'active' ? 'bg-emerald-500' : 'bg-slate-700'}`} />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pl-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold text-slate-100">{wf.name}</h3>
                                    <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${wf.status === 'active'
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                                        }`}>
                                        {wf.status}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500">{wf.description}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-xs text-slate-500">Last run</div>
                                    <div className="text-sm font-mono text-slate-300">{wf.lastRun}</div>
                                </div>
                                <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
                                    {wf.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                </button>
                                <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Visual Pipeline */}
                        <div className="pl-4 relative">
                            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                                {wf.steps.map((step, idx) => (
                                    <React.Fragment key={step.id}>
                                        {/* Connector Line */}
                                        {idx > 0 && (
                                            <div className={`h-0.5 w-8 shrink-0 transition-colors duration-500 ${step.status === 'pending' ? 'bg-slate-800' :
                                                    step.status === 'processing' ? 'bg-indigo-500/50 animate-pulse' : 'bg-indigo-900'
                                                }`} />
                                        )}

                                        {/* Step Node */}
                                        <div className={`relative shrink-0 flex flex-col items-center gap-2 p-3 rounded-lg border w-32 transition-all duration-500 ${step.status === 'processing'
                                                ? 'bg-indigo-950/30 border-indigo-500 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)] scale-105'
                                                : step.status === 'completed'
                                                    ? 'bg-slate-900 border-indigo-900/50 opacity-80'
                                                    : 'bg-slate-900/50 border-slate-800 opacity-50'
                                            }`}>
                                            <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors duration-300 ${step.status === 'processing' ? 'bg-indigo-600 text-white' :
                                                    step.status === 'completed' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-800 text-slate-500'
                                                }`}>
                                                {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                            </div>
                                            <span className={`text-xs font-medium text-center ${step.status === 'processing' ? 'text-indigo-300' : 'text-slate-400'
                                                }`}>
                                                {step.label}
                                            </span>

                                            {/* Processing Spinner */}
                                            {step.status === 'processing' && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping" />
                                            )}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
