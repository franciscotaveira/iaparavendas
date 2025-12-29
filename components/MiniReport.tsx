'use client';

import { motion } from 'framer-motion';
import {
    FileText,
    TrendingUp,
    Target,
    AlertTriangle,
    CheckCircle,
    Clock,
    Package,
    ExternalLink,
    Download
} from 'lucide-react';

interface ReportData {
    id: string;
    generated_at: string;
    lead: {
        name?: string;
        company?: string;
        niche: string;
        goal?: string;
        channel?: string;
        pain?: string;
        volume?: string;
        objections: string[];
    };
    analysis: {
        score_fit: number;
        score_label: string;
        qualification_level: string;
        priority: string;
    };
    insights: {
        strengths: string[];
        concerns: string[];
        next_steps: string[];
    };
    recommendations: {
        package: string;
        reason: string;
        estimated_value?: string;
    };
    conversation_summary: string;
}

interface MiniReportProps {
    report: ReportData;
    onClose?: () => void;
}

export default function MiniReport({ report, onClose }: MiniReportProps) {
    const scoreColor = report.analysis.score_fit >= 70 ? 'text-green-400' :
        report.analysis.score_fit >= 50 ? 'text-yellow-400' : 'text-red-400';

    const priorityStyles = {
        'Alta': 'bg-red-500/20 text-red-400 border-red-500/30',
        'Média': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'Baixa': 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
    };

    const packageStyles = {
        'Starter': 'from-zinc-600 to-zinc-700',
        'Pro': 'from-blue-600 to-blue-700',
        'Full': 'from-purple-600 to-purple-700',
    };

    const handleViewHTML = () => {
        window.open(`/api/report?id=${report.id}&format=html`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 px-5 py-4 border-b border-zinc-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Relatório de Qualificação</h3>
                            <p className="text-[10px] text-zinc-400">ID: {report.id.slice(-12)}</p>
                        </div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded border ${priorityStyles[report.analysis.priority as keyof typeof priorityStyles] || priorityStyles['Baixa']}`}>
                        {report.analysis.priority}
                    </span>
                </div>
            </div>

            {/* Score Section */}
            <div className="px-5 py-4 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Score de Fit</p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-bold ${scoreColor}`}>{report.analysis.score_fit}</span>
                            <span className="text-zinc-500 text-sm">/100</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Qualificação</p>
                        <p className="text-sm font-semibold text-white">{report.analysis.qualification_level}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${report.analysis.score_fit}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${report.analysis.score_fit >= 70 ? 'bg-green-500' :
                                report.analysis.score_fit >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                    />
                </div>
            </div>

            {/* Lead Info */}
            <div className="px-5 py-4 border-b border-zinc-800">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-3">Perfil do Lead</p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-[10px] text-zinc-500">Nicho</p>
                        <p className="text-sm font-medium text-white truncate">{report.lead.niche}</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-[10px] text-zinc-500">Canal</p>
                        <p className="text-sm font-medium text-white truncate">{report.lead.channel || '-'}</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-[10px] text-zinc-500">Objetivo</p>
                        <p className="text-sm font-medium text-white truncate">{report.lead.goal || '-'}</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-[10px] text-zinc-500">Volume</p>
                        <p className="text-sm font-medium text-white truncate">{report.lead.volume || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Insights */}
            <div className="px-5 py-4 border-b border-zinc-800">
                <div className="grid grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <p className="text-[10px] text-green-400 font-semibold uppercase">Pontos Fortes</p>
                        </div>
                        <ul className="space-y-1">
                            {report.insights.strengths.slice(0, 3).map((s, i) => (
                                <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                                    <span className="text-green-500 mt-0.5">•</span>
                                    <span className="line-clamp-2">{s}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Concerns */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <AlertTriangle className="w-3 h-3 text-yellow-400" />
                            <p className="text-[10px] text-yellow-400 font-semibold uppercase">Atenção</p>
                        </div>
                        <ul className="space-y-1">
                            {report.insights.concerns.length > 0 ? (
                                report.insights.concerns.slice(0, 3).map((c, i) => (
                                    <li key={i} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                                        <span className="text-yellow-500 mt-0.5">•</span>
                                        <span className="line-clamp-2">{c}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-[11px] text-zinc-500 italic">Nenhum ponto crítico</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Recommendation */}
            <div className="px-5 py-4 border-b border-zinc-800">
                <div className="flex items-center gap-1.5 mb-3">
                    <Package className="w-3 h-3 text-blue-400" />
                    <p className="text-[10px] text-blue-400 font-semibold uppercase">Recomendação</p>
                </div>
                <div className={`bg-gradient-to-r ${packageStyles[report.recommendations.package as keyof typeof packageStyles] || packageStyles['Starter']} rounded-lg p-4`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-bold">Pacote {report.recommendations.package}</p>
                            <p className="text-[11px] text-white/70 mt-1">{report.recommendations.reason}</p>
                        </div>
                        {report.recommendations.estimated_value && (
                            <div className="text-right">
                                <p className="text-[10px] text-white/50 uppercase">Estimativa</p>
                                <p className="text-sm font-bold text-white">{report.recommendations.estimated_value}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="px-5 py-4 border-b border-zinc-800">
                <div className="flex items-center gap-1.5 mb-3">
                    <Target className="w-3 h-3 text-purple-400" />
                    <p className="text-[10px] text-purple-400 font-semibold uppercase">Próximos Passos</p>
                </div>
                <div className="space-y-2">
                    {report.insights.next_steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-zinc-300">
                            <span className="w-4 h-4 bg-purple-500/20 rounded-full flex items-center justify-center text-[9px] text-purple-400 font-bold">
                                {i + 1}
                            </span>
                            {step}
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-4 flex gap-2">
                <button
                    onClick={handleViewHTML}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Ver Completo
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                    <Clock className="w-3.5 h-3.5" />
                    Agendar Call
                </button>
            </div>

            {/* Footer */}
            <div className="px-5 py-2 bg-zinc-950 text-center">
                <p className="text-[9px] text-zinc-600">
                    Gerado em {new Date(report.generated_at).toLocaleString('pt-BR')}
                </p>
            </div>
        </motion.div>
    );
}
