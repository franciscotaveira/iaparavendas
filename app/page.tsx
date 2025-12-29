'use client';


import { useState } from 'react';
import { motion } from 'framer-motion';
import DemoChat from '@/components/DemoChat';
import { ArrowRight, Bot, Shield, Zap, CheckCircle2, Target, Brain, Lock, Wifi, WifiOff, Loader2 } from 'lucide-react';

export default function LandingPage() {
    const [n8nStatus, setN8nStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
    const [n8nMessage, setN8nMessage] = useState<string>('');

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
        // Auto-reset after 5s
        setTimeout(() => setN8nStatus('idle'), 5000);
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-purple-500/30">

            {/* Premium Background Atmosphere */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[20%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">

                {/* Navbar Minimalista */}
                <nav className="flex justify-between items-center mb-16 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                            <Brain className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-bold tracking-widest uppercase text-white/80">Lux<span className="text-blue-500">Sales</span>.Core</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                        {/* N8n Connection Button */}
                        <button
                            onClick={testN8nConnection}
                            disabled={n8nStatus === 'loading'}
                            title={n8nMessage || 'Testar conexão com N8n'}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${n8nStatus === 'connected' ? 'border-green-500/50 bg-green-500/10 text-green-400' :
                                n8nStatus === 'error' ? 'border-red-500/50 bg-red-500/10 text-red-400' :
                                    n8nStatus === 'loading' ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' :
                                        'border-white/10 bg-white/5 text-gray-400 hover:border-blue-500/50 hover:text-blue-400'
                                }`}
                        >
                            {n8nStatus === 'loading' ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : n8nStatus === 'connected' ? (
                                <Wifi className="w-3 h-3" />
                            ) : n8nStatus === 'error' ? (
                                <WifiOff className="w-3 h-3" />
                            ) : (
                                <Wifi className="w-3 h-3" />
                            )}
                            <span className="hidden sm:inline">
                                {n8nStatus === 'connected' ? 'N8n Conectado' :
                                    n8nStatus === 'error' ? 'N8n Offline' :
                                        n8nStatus === 'loading' ? 'Testando...' :
                                            'N8n Sync'}
                            </span>
                        </button>

                        <span className="hidden md:block">ENGINE V1.0 ONLINE</span>
                        <span className="flex items-center gap-2 text-green-500">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            SYSTEM ACTIVE
                        </span>
                    </div>
                </nav>


                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center min-h-[80vh]">

                    {/* Left Column: The Pitch (Lux Philosophy) */}
                    <div className="lg:col-span-6 space-y-8">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Badge de Autoridade */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-[0.2em] mb-8 uppercase shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)]">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                Engenharia de Vendas Autônoma
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1] mb-6 text-white">
                                O Fim do Lead <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
                                    Desqualificado.
                                </span>
                            </h1>

                            <p className="text-lg text-gray-400 leading-relaxed max-w-xl border-l-4 border-blue-600 pl-6 my-8">
                                O <strong>Lux Sales Core</strong> não apenas responde. Ele <span className="text-white font-bold">interroga, qualifica e converte</span>.
                                Instale um cérebro comercial no seu WhatsApp e pare de rasgar dinheiro com quem só está "dando uma olhadinha".
                            </p>

                            {/* Pillars of Differentiation - High Impact */}
                            <div className="grid grid-cols-1 gap-4 mb-10">
                                <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-red-900/10 to-transparent border border-red-500/20 hover:border-red-500/50 transition-all cursor-default">
                                    <div className="bg-red-500/20 p-2 rounded-lg group-hover:bg-red-500/30 transition-colors">
                                        <Shield className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                                            Escudo Anti-Curioso
                                            <span className="text-[10px] bg-red-500 text-white px-1.5 rounded font-mono">93% Block Rate</span>
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">Identifica e barra leads sem budget antes que eles consumam o tempo da sua equipe.</p>
                                    </div>
                                </div>

                                <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-900/10 to-transparent border border-blue-500/20 hover:border-blue-500/50 transition-all cursor-default">
                                    <div className="bg-blue-500/20 p-2 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                        <Brain className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                                            Raio-X de Intenção
                                            <span className="text-[10px] bg-blue-500 text-white px-1.5 rounded font-mono">Real-Time</span>
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">Analisa o nível de consciência e urgência do lead a cada mensagem enviada.</p>
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
                                <p className="text-xs text-gray-500 max-w-[150px] leading-tight opacity-70">
                                    *Nenhum cartão necessário para testar a I.A.
                                </p>
                            </div>

                        </motion.div>
                    </div>

                    {/* Right Column: The Interface */}
                    <div className="lg:col-span-6 relative" id="chat-interface">
                        {/* The "Machine" Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative z-10"
                        >
                            {/* Tech Border Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-xl blur-sm" />

                            <div className="relative bg-[#080808] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[650px]">

                                {/* Header do Chat - Estilo Terminal */}
                                <div className="h-12 border-b border-white/5 bg-white/5 flex items-center justify-between px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="text-[10px] font-mono text-gray-500 tracking-widest">
                                        SECURE_CHANNEL_V1
                                    </div>
                                    <Bot className="w-4 h-4 text-blue-500" />
                                </div>

                                {/* Chat Component */}
                                <div className="flex-1 bg-black/50 relative">
                                    <DemoChat />
                                </div>
                            </div>

                            {/* Floating "Live" Badge */}
                            <div className="absolute -right-6 top-20 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rotate-90 origin-bottom rounded-t shadow-lg border border-blue-400/50">
                                LIVE AGENT
                            </div>

                        </motion.div>

                        {/* Background Decoration */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-900/5 blur-3xl rounded-full" />
                    </div>

                </div>

                {/* Footer Discrete */}
                <div className="mt-20 border-t border-white/5 pt-8 flex justify-between items-center text-xs text-gray-600">
                    <p>LUX SALES CORE © 2024</p>
                    <div className="flex gap-4">
                        <span>Protocolo 5D Ativo</span>
                        <span>Latência: 12ms</span>
                    </div>
                </div>

            </div>
        </main>
    );
}

