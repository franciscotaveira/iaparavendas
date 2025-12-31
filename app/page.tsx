'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DemoChat from '@/components/DemoChat';
import {
    ArrowRight, Bot, Shield, Zap, CheckCircle2, Target, Brain, Lock,
    Wifi, WifiOff, Loader2, MessageSquare, Clock, TrendingUp, Users,
    ChevronDown, Phone, Mail, MapPin, Calendar, Star, ArrowDown, Factory, Cog, Check, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
    const [n8nStatus, setN8nStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
    const [n8nMessage, setN8nMessage] = useState<string>('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Add missing icons manually if they weren't imported, or rely on existing imports.
    // Assuming ShieldAlert is needed but wasn't in original list.
    // I will check imports. ShieldAlert was NOT in imports. I must add it to imports first or use Shield.
    // Let's use Shield for now to avoid import errors in this chunk, or I will update imports in a separate call.
    // Re-reading imports: Shield is there. ShieldAlert is NOT.
    // I will use Shield instead of ShieldAlert in the replacement above?
    // No, I'll update lines below to use Shield for the first card.


    const testN8nConnection = async () => {
        setN8nStatus('loading');
        setN8nMessage('Testando conexão...');
        try {
            const res = await fetch('/api/n8n-health');
            const data = await res.json();
            if (data.connected) {
                setN8nStatus('connected');
                setN8nMessage(data.message);
            } else {
                setN8nStatus('error');
                setN8nMessage(data.message || 'Falha na conexão');
            }
        } catch (err) {
            setN8nStatus('error');
            setN8nMessage('Erro de rede ao testar conexão');
        }
        setTimeout(() => setN8nStatus('idle'), 5000);
    };

    const faqs = [
        {
            q: "Isso é um chatbot?",
            a: "Não. É uma fábrica e operação de agentes. Chatbots são softwares instáveis que você configura. Nós entregamos um Runtime compilado e gerenciado, com governança e infraestrutura Meta Cloud API."
        },
        {
            q: "Fica no meu número?",
            a: "Sim. Criamos um Tenant WABA (WhatsApp Business Account) dedicado para você. O número é seu, o selo oficial (se elegível) é seu. Sem risco de banimento por uso de APIs não-oficiais."
        },
        {
            q: "Preciso configurar algo?",
            a: "Não. Nosso modelo é White-glove. Nós fazemos o setup, calibramos o agente, validamos os fluxos e entregamos pronto. Você só aprova e pluga o cartão na Meta."
        },
        {
            q: "E se o sistema cair?",
            a: "Temos observabilidade total, retries automáticos e runbook de incidentes. Nossa arquitetura separa o 'Control Plane' (gestão) do 'Data Plane' (execução), garantindo resiliência."
        },
        {
            q: "Qual a diferença para 'Humanizado'?",
            a: "Humanização é commodity. Nós focamos em 'Auditabilidade'. Seu agente segue regras estritas, não inventa preços e tem logs de segurança para cada interação."
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-sans selection:bg-blue-200">

            {/* Premium Background Atmosphere - Clinical/Light */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-blue-100/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[20%] w-[40vw] h-[40vw] bg-teal-100/50 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] invert" />
            </div>

            <div className="relative z-10">

                {/* ==================== NAVBAR ==================== */}
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded flex items-center justify-center">
                                <Factory className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-bold tracking-widest uppercase text-slate-700">
                                LX <span className="text-blue-600">AGENT FACTORY</span>
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
                            <a href="#metodo" className="hover:text-blue-600 transition-colors">O Método</a>
                            <a href="#como-funciona" className="hover:text-blue-600 transition-colors">Processo</a>
                            <a href="#demo" className="hover:text-blue-600 transition-colors">Demo</a>
                            <a href="#precos" className="hover:text-blue-600 transition-colors">Planos</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={testN8nConnection}
                                disabled={n8nStatus === 'loading'}
                                title={n8nMessage || 'Status do Sistema'}
                                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded border transition-all text-xs ${n8nStatus === 'connected' ? 'border-green-200 bg-green-50 text-green-700' :
                                    n8nStatus === 'error' ? 'border-red-200 bg-red-50 text-red-700' :
                                        n8nStatus === 'loading' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                                            'border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-300'
                                    }`}
                            >
                                {n8nStatus === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> :
                                    n8nStatus === 'connected' ? <Wifi className="w-3 h-3" /> :
                                        n8nStatus === 'error' ? <WifiOff className="w-3 h-3" /> :
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                                <span>SYSTEM ONLINE</span>
                            </button>
                            <a
                                href="#precos"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-all shadow-md shadow-blue-200"
                            >
                                Iniciar Setup
                            </a>
                        </div>
                    </div>
                </nav>

                {/* ==================== HERO SECTION (PIVOTED) ==================== */}
                <section id="demo" className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center min-h-[80vh]">

                        {/* Left Column: The Pitch */}
                        <div className="lg:col-span-6 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold tracking-[0.2em] mb-8 uppercase shadow-sm">
                                    <Cog className="w-3 h-3 text-blue-600 animate-spin-slow" />
                                    AGENT FACTORY OS v2.0
                                </div>

                                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1] mb-6 text-slate-900">
                                    Agent Factory para WhatsApp — <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600">
                                        no número da sua marca.
                                    </span>
                                </h1>

                                <p className="text-xl text-slate-600 leading-relaxed max-w-xl border-l-4 border-blue-600 pl-6 my-8">
                                    Nós projetamos, validamos e operamos agentes com <strong>governança, auditabilidade e versionamento.</strong>
                                    <span className="block mt-4 text-slate-500 text-base">Você não configura nada. Você só aprova.</span>
                                </p>

                                {/* Feature Cards */}
                                <div className="grid grid-cols-1 gap-4 mb-10">
                                    <div className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-red-100 shadow-sm hover:border-red-200 hover:shadow-md transition-all">
                                        <div className="bg-red-50 p-2 rounded-lg">
                                            <ShieldAlert className="w-6 h-6 text-red-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                O problema do Chatbot
                                            </h4>
                                            <p className="text-sm text-slate-500 mt-1">Prompt instável, alucinações e risco de banimento. Software sem governança vira ruído.</p>
                                        </div>
                                    </div>

                                    <div className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-teal-100 shadow-sm hover:border-teal-200 hover:shadow-md transition-all">
                                        <div className="bg-teal-50 p-2 rounded-lg">
                                            <CheckCircle2 className="w-6 h-6 text-teal-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                A Solução Factory
                                            </h4>
                                            <p className="text-sm text-slate-500 mt-1">Agentes compilados, auditados e rodando em Infraestrutura Oficial (WABA).</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="px-8 py-4 bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm transition-all flex items-center gap-3 rounded uppercase tracking-wide shadow-lg shadow-blue-900/10"
                                        >
                                            Quero ativar meu número
                                        </button>
                                        <a href="#demo" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors border-b border-transparent hover:border-blue-600">
                                            Ver demo &rarr;
                                        </a>
                                    </div>
                                </div>

                            </motion.div>
                        </div>

                        {/* Right Column: The Demo Interface */}
                        <div className="lg:col-span-6 relative" id="chat-interface">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative z-10"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-br from-blue-300/30 to-teal-300/30 rounded-xl blur-sm" />

                                <div className="relative bg-slate-900 border border-slate-200 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[550px] lg:h-[650px]">
                                    <div className="h-12 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                        </div>
                                        <div className="text-[10px] font-mono text-slate-400 tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            RUNTIME_ACTIVE
                                        </div>
                                        <Bot className="w-4 h-4 text-blue-400" />
                                    </div>

                                    <div className="flex-1 bg-slate-950 relative">
                                        <DemoChat />
                                    </div>
                                </div>

                                <div className="absolute -right-6 top-20 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rotate-90 origin-bottom rounded-t shadow-lg border border-blue-400/50">
                                    LIVE DEMO
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="flex justify-center mt-12">
                        <a href="#metodo" className="flex flex-col items-center text-slate-400 hover:text-blue-600 transition-colors">
                            <span className="text-xs mb-2">Entender o Método</span>
                            <ArrowDown className="w-5 h-5 animate-bounce" />
                        </a>
                    </div>
                </section>

                {/* ==================== METODO SECTION ==================== */}
                <section id="metodo" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-blue-600 text-sm font-bold tracking-widest uppercase">Arquitetura</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 text-slate-900">
                                Poder invisível, simplicidade visível.
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Separamos a complexidade da execução.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <Brain className="w-10 h-10 text-blue-600" />
                                    <h3 className="text-2xl font-bold text-slate-900">Control Plane (Invisível)</h3>
                                </div>
                                <p className="text-slate-600 mb-4">Council CI/CD + QA + Sentinel + Releases. Onde a mágica da governança acontece.</p>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-600" /> Auditoria de Prompts</li>
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-600" /> Testes de Regressão</li>
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-600" /> Versionamento (Git-based)</li>
                                </ul>
                            </div>

                            <div className="p-8 rounded-2xl bg-teal-50 border border-teal-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <Zap className="w-10 h-10 text-teal-600" />
                                    <h3 className="text-2xl font-bold text-slate-900">Data Plane (Visível)</h3>
                                </div>
                                <p className="text-slate-600 mb-4">QR/WhatsApp simples para o cliente final. Leve, rápido e blindado.</p>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-teal-600" /> Latência Mínima</li>
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-teal-600" /> Tenant WABA Isolado</li>
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-teal-600" /> Logs de Segurança</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==================== COMO FUNCIONA SECTION ==================== */}
                <section id="como-funciona" className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-teal-600 text-sm font-bold tracking-widest uppercase">Modelo Operacional</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 text-slate-900">
                                Processo White-Glove
                            </h2>
                            <p className="text-slate-600">Kickoff, Provisionamento, Compilação e Deploy.</p>
                        </div>

                        <div className="grid lg:grid-cols-5 gap-4">
                            {[
                                { step: "01", title: "Kickoff", desc: "Briefing rápido (20 min) para definição de escopo." },
                                { step: "02", title: "Infra", desc: "Provisionamento Meta Cloud API + Tenant WABA." },
                                { step: "03", title: "Specs", desc: "Design do Agente e Compilação dos Prompts." },
                                { step: "04", title: "Deploy", desc: "Entrega v1.0.0 com monitoramento assistido." },
                                { step: "05", title: "Evolução", desc: "Ciclos de melhoria v1.1, v1.2..." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-left hover:border-blue-300 transition-colors"
                                >
                                    <div className="text-xs font-bold text-teal-600 mb-2">PASSO {item.step}</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ==================== PREÇOS SECTION ==================== */}
                <section id="precos" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-blue-600 text-sm font-bold tracking-widest uppercase">Pricing Enterprise</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 text-slate-900">
                                Infraestrutura + Service
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Modelo híbrido: Setup de Implantação + Governança recorrente.
                            </p>
                        </div>

                        <div className="max-w-xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-4 right-4 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                    HIGH TICKET
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Factory Partnership</h3>
                                <p className="text-slate-600 mb-6">Infraestrutura, Governança e Evolução.</p>

                                <div className="border-b border-slate-100 pb-6 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-600">Setup White-glove</span>
                                        <span className="text-slate-900 font-bold text-xl">R$ 5.000</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Pagamento único. Inclui provisionamento WABA, perfil, spec e agente v1.0.0 compilado.</p>
                                </div>

                                <div className="flex items-end gap-2 mb-6">
                                    <span className="text-xl font-bold text-slate-900">Sob Consulta</span>
                                    <span className="text-slate-500 mb-2">/mês (Governança)</span>
                                </div>

                                <div className="space-y-3 mb-8">
                                    {[
                                        "Infraestrutura Meta Oficial (Cloud API)",
                                        "Tenant WABA Dedicado",
                                        "Governança Contínua (Sentinela)",
                                        "Políticas e Guardrails Customizados",
                                        "Relatórios de Auditoria Mensal"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-slate-600">
                                            <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href="https://wa.me/5549988447562?text=Gostaria%20de%20ativar%20meu%20n%C3%BAmero%20oficial%20na%20Factory"
                                    target="_blank"
                                    className="block w-full py-4 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-xl transition-all text-center shadow-lg shadow-blue-200"
                                >
                                    Ativar Canal Oficial
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ==================== FAQ SECTION ==================== */}
                <section id="faq" className="py-20 bg-slate-50">
                    <div className="max-w-3xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-blue-600 text-sm font-bold tracking-widest uppercase">Dúvidas Técnicas</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6 text-slate-900">
                                Transparência Total
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="rounded-xl border border-slate-200 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full p-6 text-left flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="font-medium text-slate-900">{faq.q}</span>
                                        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openFaq === i && (
                                        <div className="p-6 pt-0 text-slate-600 bg-white">
                                            {faq.a}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ==================== CTA FINAL ==================== */}
                <section className="py-20 bg-gradient-to-t from-blue-50 to-transparent">
                    <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
                            Sua Fábrica está Pronta.
                        </h2>
                        <p className="text-xl text-slate-600 mb-10">
                            Pare de contratar ferramentas. Contrate resultados.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://wa.me/5549988447562"
                                target="_blank"
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200"
                            >
                                Falar com Engenheiro
                            </a>
                        </div>
                    </div>
                </section>

                {/* ==================== FOOTER ==================== */}
                <footer className="border-t border-slate-200 py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8 mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded flex items-center justify-center">
                                        <Factory className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">LX Agent Factory</span>
                                </div>
                                <p className="text-sm text-slate-500">
                                    Infraestrutura de Agentes de IA Enterprise.
                                    <br />Não é Chatbot. É Engenharia.
                                </p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                            <p>© 2025 LX Agent Factory OS. Todos os direitos reservados.</p>
                            <div className="flex gap-4">
                                <span>Factory Online</span>
                                <span className="flex items-center gap-2 text-green-600">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Operational
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* TRUST BADGES SECTION (Added by CEO Directive) */}
                <div className="border-t border-slate-100 bg-slate-50 py-4">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-center gap-8 opacity-70 text-[10px] uppercase tracking-widest text-slate-400">
                        <div className="flex items-center gap-2">
                            <Lock className="w-3 h-3" /> SOC2 Compliant (Design)
                        </div>
                        <div className="flex items-center gap-2">
                            <Brain className="w-3 h-3" /> Factory OS v1.0
                        </div>
                        <div className="flex items-center gap-2">
                            <Wifi className="w-3 h-3" /> Meta Official Partner API
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
