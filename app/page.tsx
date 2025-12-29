'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DemoChat from '@/components/DemoChat';
import {
    ArrowRight, Bot, Shield, Zap, CheckCircle2, Target, Brain, Lock,
    Wifi, WifiOff, Loader2, MessageSquare, Clock, TrendingUp, Users,
    ChevronDown, Phone, Mail, MapPin, Calendar, Star, ArrowDown
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
    const [n8nStatus, setN8nStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
    const [n8nMessage, setN8nMessage] = useState<string>('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            q: "Funciona para qualquer tipo de negócio?",
            a: "Sim. O sistema se adapta a diferentes nichos: serviços, SaaS, clínicas, imobiliárias, mercado financeiro e mais. Personalizamos o agente para seu segmento específico."
        },
        {
            q: "Preciso contratar API do WhatsApp separado?",
            a: "Você precisa ter acesso à Meta WhatsApp Cloud API. Ajudamos na configuração e a integração é inclusa no setup."
        },
        {
            q: "Quanto tempo leva para implementar?",
            a: "7 dias úteis do kickoff ao go-live. Incluindo configuração, personalização, testes e treinamento."
        },
        {
            q: "E se o lead fizer uma pergunta que o robô não sabe?",
            a: "O sistema tem handoff inteligente: identifica quando precisa de humano e transfere a conversa automaticamente, com todo o contexto."
        },
        {
            q: "Vou precisar de uma equipe técnica?",
            a: "Não. Nós cuidamos de toda a parte técnica. Você só precisa responder aos leads qualificados que o sistema filtrar para você."
        }
    ];

    return (
        <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-purple-500/30">

            {/* Premium Background Atmosphere */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[20%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <div className="relative z-10">

                {/* ==================== NAVBAR ==================== */}
                <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                                <Brain className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="text-sm font-bold tracking-widest uppercase text-white/80">
                                Lux<span className="text-blue-500">Growth</span>.IA
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
                            <a href="#problema" className="hover:text-white transition-colors">O Problema</a>
                            <a href="#solucao" className="hover:text-white transition-colors">Solução</a>
                            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
                            <a href="#precos" className="hover:text-white transition-colors">Investimento</a>
                            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={testN8nConnection}
                                disabled={n8nStatus === 'loading'}
                                title={n8nMessage || 'Status do Sistema'}
                                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded border transition-all text-xs ${n8nStatus === 'connected' ? 'border-green-500/50 bg-green-500/10 text-green-400' :
                                    n8nStatus === 'error' ? 'border-red-500/50 bg-red-500/10 text-red-400' :
                                        n8nStatus === 'loading' ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' :
                                            'border-white/10 bg-white/5 text-gray-300 hover:border-blue-500/50'
                                    }`}
                            >
                                {n8nStatus === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> :
                                    n8nStatus === 'connected' ? <Wifi className="w-3 h-3" /> :
                                        n8nStatus === 'error' ? <WifiOff className="w-3 h-3" /> :
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                                <span>ONLINE</span>
                            </button>
                            <a
                                href="#demo"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded transition-all"
                            >
                                Testar Agora
                            </a>
                        </div>
                    </div>
                </nav>

                {/* ==================== HERO SECTION ==================== */}
                <section id="demo" className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center min-h-[80vh]">

                        {/* Left Column: The Pitch */}
                        <div className="lg:col-span-6 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/40 text-blue-400 text-[10px] font-bold tracking-[0.2em] mb-8 uppercase shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)]">
                                    <Zap className="w-3 h-3 text-yellow-500" />
                                    Engenharia de Vendas Autônoma
                                </div>

                                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1] mb-6 text-white">
                                    O Fim do Lead <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
                                        Desqualificado.
                                    </span>
                                </h1>

                                <p className="text-lg text-gray-200 leading-relaxed max-w-xl border-l-4 border-blue-500 pl-6 my-8">
                                    O <strong className="text-white">Lux Sales Core</strong> não apenas responde. Ele <span className="text-blue-400 font-bold">interroga, qualifica e converte</span>.
                                    Instale um cérebro comercial no seu WhatsApp e pare de rasgar dinheiro com quem só está "dando uma olhadinha".
                                </p>

                                {/* Feature Cards */}
                                <div className="grid grid-cols-1 gap-4 mb-10">
                                    <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-red-950/30 to-transparent border border-red-500/40 hover:border-red-500/50 transition-all">
                                        <div className="bg-red-500/20 p-2 rounded-lg">
                                            <Shield className="w-6 h-6 text-red-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                                                Escudo Anti-Curioso
                                                <span className="text-[10px] bg-red-500 text-white px-1.5 rounded font-mono">93% Block Rate</span>
                                            </h4>
                                            <p className="text-sm text-gray-300 mt-1">Identifica e barra leads sem budget antes que eles consumam o tempo da sua equipe.</p>
                                        </div>
                                    </div>

                                    <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-transparent border border-blue-500/40 hover:border-blue-500/50 transition-all">
                                        <div className="bg-blue-500/20 p-2 rounded-lg">
                                            <Brain className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                                                Raio-X de Intenção
                                                <span className="text-[10px] bg-blue-500 text-white px-1.5 rounded font-mono">Real-Time</span>
                                            </h4>
                                            <p className="text-sm text-gray-300 mt-1">Analisa o nível de consciência e urgência do lead a cada mensagem enviada.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => document.getElementById('chat-interface')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] hover:shadow-[0_0_50px_-10px_rgba(37,99,235,0.8)] flex items-center gap-3 rounded uppercase tracking-wide"
                                    >
                                        Testar Filtro ao Vivo ⚡
                                    </button>
                                    <p className="text-xs text-gray-400 max-w-[150px] leading-tight opacity-70">
                                        *Nenhum cartão necessário para testar a I.A.
                                    </p>
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
                                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-xl blur-sm" />

                                <div className="relative bg-[#080808] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[650px]">
                                    <div className="h-12 border-b border-white/5 bg-white/5 flex items-center justify-between px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                        </div>
                                        <div className="text-[10px] font-mono text-gray-400 tracking-widest">
                                            SECURE_CHANNEL_V1
                                        </div>
                                        <Bot className="w-4 h-4 text-blue-500" />
                                    </div>

                                    <div className="flex-1 bg-black/50 relative">
                                        <DemoChat />
                                    </div>
                                </div>

                                <div className="absolute -right-6 top-20 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rotate-90 origin-bottom rounded-t shadow-lg border border-blue-400/50">
                                    LIVE AGENT
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="flex justify-center mt-12">
                        <a href="#problema" className="flex flex-col items-center text-gray-400 hover:text-white transition-colors">
                            <span className="text-xs mb-2">Ver mais</span>
                            <ArrowDown className="w-5 h-5 animate-bounce" />
                        </a>
                    </div>
                </section>

                {/* ==================== PROBLEMA SECTION ==================== */}
                <section id="problema" className="py-20 bg-gradient-to-b from-transparent to-red-950/10">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-red-500 text-sm font-bold tracking-widest uppercase">O Problema</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
                                Você reconhece algum desses cenários?
                            </h2>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Se você gasta mais tempo com curiosos do que fechando negócios, o problema não é seu produto — é seu filtro.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Clock, title: "Tempo Desperdiçado", desc: "Horas respondendo leads que nunca vão comprar" },
                                { icon: MessageSquare, title: "Respostas Lentas", desc: "Lead esfria enquanto você está ocupado com outros" },
                                { icon: Users, title: "Equipe Saturada", desc: "Time comercial afogado em atendimentos improdutivos" },
                                { icon: TrendingUp, title: "Escala Impossível", desc: "Crescer = contratar mais gente. Não escala." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-xl bg-red-950/20 border border-red-500/40 hover:border-red-500/40 transition-all"
                                >
                                    <item.icon className="w-10 h-10 text-red-500 mb-4" />
                                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-300">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ==================== SOLUÇÃO SECTION ==================== */}
                <section id="solucao" className="py-20 bg-gradient-to-b from-red-950/10 to-blue-950/10">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-blue-500 text-sm font-bold tracking-widest uppercase">A Solução</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
                                IA que <span className="text-blue-500">qualifica</span>, não só responde
                            </h2>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Diferente de bots genéricos, nosso sistema entende intenção, aplica políticas comerciais e só passa para você quem realmente quer comprar.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Shield,
                                    title: "Filtro Inteligente",
                                    desc: "Bloqueia curiosos automaticamente. Você só fala com quem tem budget e intenção real.",
                                    color: "red"
                                },
                                {
                                    icon: Brain,
                                    title: "Qualificação em Tempo Real",
                                    desc: "Cada mensagem é analisada. O sistema entende onde o lead está no funil e age de acordo.",
                                    color: "blue"
                                },
                                {
                                    icon: Target,
                                    title: "Handoff Perfeito",
                                    desc: "Quando é hora de humano, transfere a conversa com todo o contexto. Zero retrabalho.",
                                    color: "green"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-8 rounded-2xl bg-gradient-to-br from-${item.color}-950/30 to-transparent border border-${item.color}-500/20 hover:border-${item.color}-500/50 transition-all`}
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-${item.color}-500/20 flex items-center justify-center mb-6`}>
                                        <item.icon className={`w-7 h-7 text-${item.color}-500`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-300">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ==================== COMO FUNCIONA SECTION ==================== */}
                <section id="como-funciona" className="py-20">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-purple-500 text-sm font-bold tracking-widest uppercase">Como Funciona</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
                                3 passos para vendas no automático
                            </h2>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {[
                                { step: "01", title: "Conectamos", desc: "Integramos com seu WhatsApp via API oficial do Meta. Zero risco de banimento." },
                                { step: "02", title: "Configuramos", desc: "Personalizamos o agente para seu nicho, tom de voz e regras comerciais." },
                                { step: "03", title: "Você Vende", desc: "O sistema filtra e qualifica 24/7. Você só fecha os negócios." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mt-6 mb-3">{item.title}</h3>
                                    <p className="text-gray-300">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ==================== PREÇOS SECTION ==================== */}
                <section id="precos" className="py-20 bg-gradient-to-b from-transparent to-blue-950/10">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-green-500 text-sm font-bold tracking-widest uppercase">Investimento</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
                                Quanto custa <span className="text-green-500">não ter</span> isso?
                            </h2>
                            <p className="text-gray-300 max-w-2xl mx-auto">
                                Menos que um SDR. Mais resultado que uma equipe inteira de atendimento.
                            </p>
                        </div>

                        <div className="max-w-xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-2xl bg-gradient-to-br from-blue-950/50 to-purple-950/50 border border-blue-500/30 relative overflow-hidden"
                            >
                                <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded">
                                    MAIS POPULAR
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">Lux Sales Core</h3>
                                <p className="text-gray-300 mb-6">Sistema completo de automação comercial</p>

                                <div className="flex items-end gap-2 mb-6">
                                    <span className="text-5xl font-bold text-white">R$ 1.197</span>
                                    <span className="text-gray-300 mb-2">/mês</span>
                                </div>

                                <div className="space-y-3 mb-8">
                                    {[
                                        "Integração nativa com Meta WhatsApp API",
                                        "IA de qualificação 24/7",
                                        "Triagem e filtro automático",
                                        "Handoff inteligente para humano",
                                        "Painel de controle em português",
                                        "Relatórios de conversão",
                                        "Suporte via WhatsApp"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-300">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Setup + Implantação</span>
                                        <span className="text-white font-bold">R$ 2.997</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Pagamento único. Inclui configuração, personalização e treinamento.</p>
                                </div>

                                <a
                                    href="https://wa.me/5599999999999?text=Ol%C3%A1!%20Tenho%20interesse%20no%20Lux%20Sales%20Core"
                                    target="_blank"
                                    className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-center font-bold rounded-xl transition-all"
                                >
                                    Falar com Especialista
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ==================== FAQ SECTION ==================== */}
                <section id="faq" className="py-20">
                    <div className="max-w-3xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-yellow-500 text-sm font-bold tracking-widest uppercase">Dúvidas Frequentes</span>
                            <h2 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
                                Perguntas que você pode ter
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
                                    className="rounded-xl border border-white/10 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full p-6 text-left flex justify-between items-center bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <span className="font-medium text-white">{faq.q}</span>
                                        <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openFaq === i && (
                                        <div className="p-6 pt-0 text-gray-300">
                                            {faq.a}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ==================== CTA FINAL ==================== */}
                <section className="py-20 bg-gradient-to-t from-blue-950/20 to-transparent">
                    <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Pronto para parar de perder leads?
                        </h2>
                        <p className="text-xl text-gray-300 mb-10">
                            Teste o agente agora mesmo. Sem cartão, sem compromisso.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#demo"
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)]"
                            >
                                Testar Agente ao Vivo
                            </a>
                            <a
                                href="https://wa.me/5599999999999?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20o%20Lux%20Sales%20Core"
                                target="_blank"
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
                            >
                                Falar pelo WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                {/* ==================== FOOTER ==================== */}
                <footer className="border-t border-white/5 py-12">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8 mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                                        <Brain className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-sm font-bold text-white">LuxGrowth.IA</span>
                                </div>
                                <p className="text-sm text-gray-400">
                                    Automação comercial inteligente para empresas que querem escalar sem aumentar equipe.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-4">Navegação</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li><a href="#problema" className="hover:text-white transition-colors">O Problema</a></li>
                                    <li><a href="#solucao" className="hover:text-white transition-colors">Solução</a></li>
                                    <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
                                    <li><a href="#precos" className="hover:text-white transition-colors">Investimento</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-4">Legal</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li><a href="/privacy" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                                    <li><a href="/terms" className="hover:text-white transition-colors">Termos de Uso</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-4">Contato</h4>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>contato@luxgrowth.ia</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <span>+55 (99) 99999-9999</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                            <p>© 2024 Lux Growth IA. Todos os direitos reservados.</p>
                            <div className="flex gap-4">
                                <span>Sistema Online</span>
                                <span className="flex items-center gap-2 text-green-500">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Operacional
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </main>
    );
}
