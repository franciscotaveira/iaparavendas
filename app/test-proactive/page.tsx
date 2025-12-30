import React from 'react'; // Ensure React is imported
import { INITIATIVE_TRIGGERS, LeadContext } from '@/core/consciousness/proactive-initiative';

export default function TestProactivePage() {
    // 1. Simular Lead "Sumido" (10 dias sem contato)
    const leadSumido: LeadContext = {
        id: '1',
        name: 'Marcos Silva',
        city: 'São Paulo',
        profession: 'Advogado',
        lastInteraction: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
        pendingFollowUps: [],
        upcomingDates: [],
        conversationStage: 'active',
        relationshipDepth: 0.6
    };

    // 2. Simular Aniversariante
    const leadAniversario: LeadContext = {
        id: '2',
        name: 'Ana Costa',
        lastInteraction: new Date(),
        pendingFollowUps: [],
        upcomingDates: [{ type: 'birthday', date: new Date() }], // Hoje
        conversationStage: 'qualified',
        relationshipDepth: 0.8
    };

    // 3. Simular Follow-up Pendente
    const leadFollowUp: LeadContext = {
        id: '3',
        name: 'Roberto',
        lastInteraction: new Date(),
        pendingFollowUps: [{ type: 'memory', content: 'o link do vídeo explicativo' }],
        upcomingDates: [],
        conversationStage: 'active',
        relationshipDepth: 0.5
    };

    // Executar testes
    const results = [
        { scenario: 'Lead Sumido (Reengajamento)', lead: leadSumido, result: runTest(leadSumido) },
        { scenario: 'Aniversariante', lead: leadAniversario, result: runTest(leadAniversario) },
        { scenario: 'Follow-up Prometido', lead: leadFollowUp, result: runTest(leadFollowUp) },
    ];

    function runTest(lead: LeadContext) {
        // Ordenar triggers por prioridade
        const triggers = [...INITIATIVE_TRIGGERS].sort((a, b) => b.priority - a.priority);

        for (const trigger of triggers) {
            if (trigger.check(lead)) {
                return {
                    triggered: true,
                    type: trigger.name,
                    message: trigger.generate(lead)
                };
            }
        }
        return { triggered: false, message: 'Nenhuma iniciativa gerada.' };
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
            <h1 className="text-3xl font-bold mb-8 text-neutral-100 border-b border-neutral-800 pb-4">
                Simulação: Iniciativas Proativas (Presence Core)
            </h1>

            <div className="grid gap-6">
                {results.map((item, i) => (
                    <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-emerald-400 mb-4">{item.scenario}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-neutral-950 p-4 rounded border border-neutral-800">
                                <h3 className="text-sm text-neutral-500 uppercase mb-2">Contexto do Lead</h3>
                                <pre className="text-xs text-neutral-300 overflow-auto">
                                    {JSON.stringify({
                                        name: item.lead.name,
                                        lastInteraction: item.lead.lastInteraction.toLocaleDateString(),
                                        pending: item.lead.pendingFollowUps,
                                        dates: item.lead.upcomingDates
                                    }, null, 2)}
                                </pre>
                            </div>

                            <div className={`p-4 rounded border ${item.result.triggered ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-red-500/30 bg-red-950/20'}`}>
                                <h3 className="text-sm text-neutral-500 uppercase mb-2">Resultado da IA</h3>
                                {item.result.triggered ? (
                                    <>
                                        <div className="mb-2">
                                            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                                                Gatilho: {item.result.type}
                                            </span>
                                        </div>
                                        <p className="text-lg text-white font-medium">
                                            "{item.result.message}"
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-neutral-400 italic">Nenhuma ação necessária.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-blue-950/30 border border-blue-800/50 rounded-lg">
                <p className="text-blue-200 text-sm">
                    ℹ️ Esta página simula a lógica do <strong>Presence Core</strong> sem acessar o banco de dados real.
                    Para ver isso em produção, o Job (Cron) irá processar dados reais do Supabase diariamente.
                </p>
            </div>
        </div>
    );
}
