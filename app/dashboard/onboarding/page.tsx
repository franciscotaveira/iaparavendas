'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Phone,
    Mail,
    MessageSquare,
    Clock,
    Users,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Sparkles
} from 'lucide-react';

interface OnboardingData {
    // Dados da Empresa
    nomeClinica: string;
    especialidade: string;
    telefoneComercial: string;
    emailContato: string;
    website: string;

    // Atendimento
    horarioFuncionamento: string;
    diasFuncionamento: string[];
    tempoMedioConsulta: string;

    // Sobre o Agente
    nomeAgente: string;
    tomDeVoz: string;
    servicosOferecidos: string;
    perguntasFrequentes: string;
    restricoes: string;

    // Técnico
    calendarioLink: string;
    whatsappNumero: string;
}

const initialData: OnboardingData = {
    nomeClinica: '',
    especialidade: '',
    telefoneComercial: '',
    emailContato: '',
    website: '',
    horarioFuncionamento: '',
    diasFuncionamento: [],
    tempoMedioConsulta: '',
    nomeAgente: '',
    tomDeVoz: 'profissional',
    servicosOferecidos: '',
    perguntasFrequentes: '',
    restricoes: '',
    calendarioLink: '',
    whatsappNumero: '',
};

const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const updateField = (field: keyof OnboardingData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleDia = (dia: string) => {
        setData(prev => ({
            ...prev,
            diasFuncionamento: prev.diasFuncionamento.includes(dia)
                ? prev.diasFuncionamento.filter(d => d !== dia)
                : [...prev.diasFuncionamento, dia]
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Simulando envio para API
        await new Promise(resolve => setTimeout(resolve, 2000));

        // TODO: Enviar para /api/onboarding
        console.log('Onboarding Data:', data);

        setIsSubmitting(false);
        setIsComplete(true);
    };

    if (isComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Onboarding Completo!
                    </h1>
                    <p className="text-slate-400 mb-8">
                        Recebemos suas informações. Nossa equipe vai configurar seu agente
                        e entrar em contato em até 24h.
                    </p>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <p className="text-sm text-slate-300">
                            <strong>Próximos passos:</strong>
                        </p>
                        <ul className="text-sm text-slate-400 mt-2 space-y-1 text-left">
                            <li>✓ Análise das informações</li>
                            <li>✓ Configuração do agente personalizado</li>
                            <li>✓ Teste de homologação</li>
                            <li>✓ Ativação no seu WhatsApp</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Onboarding LUMAX</h1>
                        <p className="text-sm text-slate-400">Configure o assistente da sua clínica</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(s => (
                        <div
                            key={s}
                            className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? 'bg-blue-500' : 'bg-slate-700'
                                }`}
                        />
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">Etapa {step} de 4</p>
            </div>

            {/* Step 1: Dados da Empresa */}
            {step === 1 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-400" />
                            Dados da Clínica
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Nome da Clínica *</label>
                                <input
                                    type="text"
                                    value={data.nomeClinica}
                                    onChange={e => updateField('nomeClinica', e.target.value)}
                                    placeholder="Ex: Clínica São Lucas"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Especialidade *</label>
                                <input
                                    type="text"
                                    value={data.especialidade}
                                    onChange={e => updateField('especialidade', e.target.value)}
                                    placeholder="Ex: Dermatologia, Odontologia"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Telefone Comercial</label>
                                <input
                                    type="tel"
                                    value={data.telefoneComercial}
                                    onChange={e => updateField('telefoneComercial', e.target.value)}
                                    placeholder="(49) 99999-9999"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-300 mb-2">E-mail de Contato *</label>
                                <input
                                    type="email"
                                    value={data.emailContato}
                                    onChange={e => updateField('emailContato', e.target.value)}
                                    placeholder="contato@clinica.com.br"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-slate-300 mb-2">Website (opcional)</label>
                                <input
                                    type="url"
                                    value={data.website}
                                    onChange={e => updateField('website', e.target.value)}
                                    placeholder="https://clinica.com.br"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Step 2: Horários */}
            {step === 2 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-teal-400" />
                            Horário de Funcionamento
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Horário de Atendimento *</label>
                                <input
                                    type="text"
                                    value={data.horarioFuncionamento}
                                    onChange={e => updateField('horarioFuncionamento', e.target.value)}
                                    placeholder="Ex: 08:00 às 18:00"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Dias de Funcionamento *</label>
                                <div className="flex flex-wrap gap-2">
                                    {diasSemana.map(dia => (
                                        <button
                                            key={dia}
                                            type="button"
                                            onClick={() => toggleDia(dia)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${data.diasFuncionamento.includes(dia)
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                }`}
                                        >
                                            {dia}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Tempo Médio de Consulta</label>
                                <select
                                    value={data.tempoMedioConsulta}
                                    onChange={e => updateField('tempoMedioConsulta', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="15">15 minutos</option>
                                    <option value="30">30 minutos</option>
                                    <option value="45">45 minutos</option>
                                    <option value="60">1 hora</option>
                                    <option value="90">1h30</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Step 3: Personalidade do Agente */}
            {step === 3 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-purple-400" />
                            Personalidade do Assistente
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Nome do Assistente *</label>
                                <input
                                    type="text"
                                    value={data.nomeAgente}
                                    onChange={e => updateField('nomeAgente', e.target.value)}
                                    placeholder="Ex: Sofia, Dr. Assistente"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Tom de Voz</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'profissional', label: 'Profissional', emoji: '👔' },
                                        { value: 'amigavel', label: 'Amigável', emoji: '😊' },
                                        { value: 'formal', label: 'Formal', emoji: '📋' },
                                    ].map(tom => (
                                        <button
                                            key={tom.value}
                                            type="button"
                                            onClick={() => updateField('tomDeVoz', tom.value)}
                                            className={`p-4 rounded-lg border text-center transition-colors ${data.tomDeVoz === tom.value
                                                    ? 'bg-blue-500/20 border-blue-500 text-white'
                                                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                                                }`}
                                        >
                                            <span className="text-2xl block mb-1">{tom.emoji}</span>
                                            <span className="text-sm">{tom.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Serviços Oferecidos *</label>
                                <textarea
                                    value={data.servicosOferecidos}
                                    onChange={e => updateField('servicosOferecidos', e.target.value)}
                                    placeholder="Liste os principais serviços da clínica, um por linha..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Perguntas Frequentes</label>
                                <textarea
                                    value={data.perguntasFrequentes}
                                    onChange={e => updateField('perguntasFrequentes', e.target.value)}
                                    placeholder="O que pacientes costumam perguntar? (preços, convênios, localização, etc)"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Step 4: Configurações Técnicas */}
            {step === 4 && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-emerald-400" />
                            Configurações Técnicas
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Número do WhatsApp *</label>
                                <input
                                    type="tel"
                                    value={data.whatsappNumero}
                                    onChange={e => updateField('whatsappNumero', e.target.value)}
                                    placeholder="+55 (49) 99999-9999"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Este será o número onde o assistente irá atender.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Link do Calendário (opcional)</label>
                                <input
                                    type="url"
                                    value={data.calendarioLink}
                                    onChange={e => updateField('calendarioLink', e.target.value)}
                                    placeholder="https://calendly.com/sua-clinica"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Calendly, Google Calendar ou outro sistema de agendamento.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Restrições ou Observações</label>
                                <textarea
                                    value={data.restricoes}
                                    onChange={e => updateField('restricoes', e.target.value)}
                                    placeholder="Algo que o assistente NÃO deve fazer ou dizer? Informações sensíveis?"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resumo */}
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-emerald-400 mb-3">Resumo do Onboarding</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="text-slate-300">
                                <strong>Clínica:</strong> {data.nomeClinica || '-'}
                            </div>
                            <div className="text-slate-300">
                                <strong>Especialidade:</strong> {data.especialidade || '-'}
                            </div>
                            <div className="text-slate-300">
                                <strong>Assistente:</strong> {data.nomeAgente || '-'}
                            </div>
                            <div className="text-slate-300">
                                <strong>WhatsApp:</strong> {data.whatsappNumero || '-'}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Voltar
                </button>

                {step < 4 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        Próximo
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Finalizar Onboarding
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
