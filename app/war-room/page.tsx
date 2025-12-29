'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, CheckCircle, Users } from 'lucide-react';

export default function WarRoomPage() {
    const [scenario, setScenario] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const predefinedScenarios = [
        "Lançar novo SaaS B2B sem budget de marketing",
        "Churn aumentou 15% no último mês",
        "Site caiu na Black Friday e clientes estão furiosos",
        "Migrar de monolito para microservices"
    ];

    const handleRunSimulation = async () => {
        if (!scenario) return;
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/agents/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'council',
                    question: scenario
                })
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            LX War Room
                        </h1>
                        <p className="text-gray-400">Inteligência Coletiva Multi-Agente em Ação</p>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-800 bg-green-950/30 px-4 py-1">
                        <Users className="w-4 h-4 mr-2" />
                        24 Agentes Disponíveis
                    </Badge>
                </div>

                {/* Input Section */}
                <Card className="p-6 bg-gray-900 border-gray-800 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        Defina o Desafio
                    </h2>

                    <div className="flex gap-2 flex-wrap">
                        {predefinedScenarios.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setScenario(s)}
                                className="text-xs px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 transition"
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <Input
                            value={scenario}
                            onChange={(e) => setScenario(e.target.value)}
                            placeholder="Ex: Como dobrar as vendas em 3 meses?"
                            className="bg-gray-950 border-gray-800 text-lg"
                        />
                        <Button
                            onClick={handleRunSimulation}
                            disabled={loading || !scenario}

                            className="bg-purple-600 hover:bg-purple-700 min-w-[200px]"
                        >
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Pensando...</>
                            ) : (
                                'Convocar Conselho'
                            )}
                        </Button>
                    </div>
                </Card>

                {/* Results Section */}
                {result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Synthesis */}
                        <Card className="p-6 bg-blue-950/20 border-blue-900/50">
                            <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Consenso Estratégico
                            </h3>
                            <div className="prose prose-invert max-w-none">
                                <p className="whitespace-pre-wrap leading-relaxed text-gray-200">
                                    {result.synthesis}
                                </p>
                            </div>
                        </Card>

                        {/* Individual Opinions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.opinions.map((op: any, i: number) => (
                                <Card key={i} className="p-5 bg-gray-900 border-gray-800 hover:border-gray-700 transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-bold text-gray-100">{op.agent.name}</h4>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider">{op.agent.title}</p>
                                        </div>
                                        <Badge className="bg-gray-800 text-gray-300 border-0">
                                            {op.confidence}% Confiança
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-300 mb-4 h-[100px] overflow-y-auto pr-2 custom-scrollbar">
                                        {op.opinion}
                                    </p>
                                    <div className="bg-gray-950 p-3 rounded text-xs text-gray-400">
                                        <strong className="text-purple-400 block mb-1">Ação Sugerida:</strong>
                                        {op.suggested_actions?.[0]}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Action Plan */}
                        <Card className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700">
                            <h3 className="text-lg font-semibold mb-4 text-white">🚀 Plano de Ação Imediato</h3>
                            <div className="space-y-2">
                                {result.recommended_actions.map((action: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-950/50 rounded border border-gray-800">
                                        <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">
                                            {i + 1}
                                        </div>
                                        <span className="text-gray-200">{action}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                    </div>
                )}
            </div>
        </div>
    );
}
