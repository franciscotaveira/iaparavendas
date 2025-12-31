'use client';
import { useState, useEffect } from 'react';
import { QrCode, Smartphone, CheckCircle2, Loader2, Wifi, RefreshCw } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function ConnectPage() {
    const [step, setStep] = useState<'generating' | 'scan' | 'connecting' | 'connected'>('generating');
    const [progress, setProgress] = useState(0);

    // Simulação do Ciclo de Vida do QR Code
    useEffect(() => {
        if (step === 'generating') {
            setTimeout(() => setStep('scan'), 2000);
        }
    }, [step]);

    const handleSimulateScan = () => {
        setStep('connecting');
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStep('connected');
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    return (
        <div className="min-h-screen bg-[#0B1120] text-white p-8 font-sans flex flex-col items-center justify-center">

            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Status Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                    <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${step === 'connected' ? 100 : step === 'connecting' ? progress : 0}%` }}
                    />
                </div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                        <Smartphone className={`w-8 h-8 ${step === 'connected' ? 'text-green-500' : 'text-blue-500'}`} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Conectar WhatsApp</h1>
                    <p className="text-slate-400 text-sm">
                        {step === 'generating' && "Gerando sessão segura..."}
                        {step === 'scan' && "Escaneie o QR Code com seu celular"}
                        {step === 'connecting' && "Sincronizando mensagens..."}
                        {step === 'connected' && "Dispositivo Conectado com Sucesso"}
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    {step === 'generating' && (
                        <div className="flex flex-col items-center gap-4 py-10">
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                            <span className="text-xs text-slate-500 animate-pulse">Criando túnel criptografado...</span>
                        </div>
                    )}

                    {step === 'scan' && (
                        <div className="relative group cursor-pointer" onClick={handleSimulateScan}>
                            <div className="p-4 bg-white rounded-xl">
                                <QRCode
                                    value="https://wa.me/qr/TEST_SIMULATION_LX_ENGINE"
                                    size={200}
                                    fgColor="#000000"
                                    bgColor="#ffffff"
                                />
                            </div>
                            {/* Overlay de Simulação (Para o Usuário clicar) */}
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                <span className="text-xs font-bold text-white flex items-center gap-2">
                                    <Wifi className="w-4 h-4" />
                                    Clique para Simular Scan
                                </span>
                            </div>
                            <p className="text-[10px] text-center text-slate-500 mt-4">
                                Abra o WhatsApp > Configurações > Dispositivos Conectados
                            </p>
                        </div>
                    )}

                    {step === 'connecting' && (
                        <div className="w-full py-10 px-4">
                            <div className="flex justify-between text-xs text-slate-400 mb-2">
                                <span>Baixando conversas...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {step === 'connected' && (
                        <div className="flex flex-col items-center py-6">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-white font-medium">Sessão: lx-engine-main</p>
                                <p className="text-slate-500 text-xs text-green-400 flex items-center justify-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Online e Operando
                                </p>
                            </div>
                            <button
                                onClick={() => setStep('scan')}
                                className="mt-8 text-xs text-slate-500 hover:text-red-400 flex items-center gap-2 transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" /> Desconectar
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-slate-950/50 rounded-lg p-4 text-xs text-slate-500 border border-slate-800/50">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 min-w-[4px] h-[4px] rounded-full bg-blue-500" />
                        <p>Mantenha seu celular conectado à internet para que o agente possa responder.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
