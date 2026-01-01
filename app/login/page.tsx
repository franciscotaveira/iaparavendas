
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, ArrowRight, Fingerprint, Cpu, Shield, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [accessKey, setAccessKey] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        let interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 3;
            });
        }, 30);

        setTimeout(() => {
            if (accessKey === 'admin' || accessKey === 'mct2026' || accessKey === 'chico') {
                setStatus('success');
                setTimeout(() => router.push('/'), 600);
            } else {
                setStatus('error');
                setProgress(0);
                setTimeout(() => setStatus('idle'), 2500);
            }
        }, 1200);
    };

    return (
        <main
            className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            {/* Background Glow */}
            <div className="absolute inset-0 z-0 opacity-30">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
                    style={{ backgroundColor: 'var(--accent)', opacity: 0.15 }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* LOGIN CARD */}
                <div
                    className="p-12 md:p-16 rounded-[40px] text-center relative overflow-hidden"
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        boxShadow: '0 25px 100px rgba(0,0,0,0.3)'
                    }}
                >
                    {/* Progress Bar */}
                    <div
                        className="absolute top-0 left-0 h-1 transition-all duration-100"
                        style={{ width: `${progress}%`, backgroundColor: 'var(--accent)' }}
                    />

                    {/* Logo */}
                    <motion.div
                        animate={status === 'loading' ? { rotate: 360 } : {}}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-10"
                        style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 40px var(--glow)' }}
                    >
                        <Fingerprint className="w-10 h-10" style={{ color: 'var(--bg-primary)' }} />
                    </motion.div>

                    <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                        MCT NUCLEUS
                    </h1>
                    <p className="text-xs uppercase tracking-widest mb-10" style={{ color: 'var(--text-muted)' }}>
                        Autenticação Segura
                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Chave de Acesso"
                                value={accessKey}
                                autoFocus
                                onChange={(e) => setAccessKey(e.target.value)}
                                className="w-full rounded-2xl px-6 py-4 text-center text-base focus:outline-none transition-all"
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    border: status === 'error' ? '2px solid #ef4444' : '1px solid var(--border)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                        </div>

                        <button
                            disabled={status === 'loading'}
                            className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                            style={{
                                backgroundColor: status === 'success' ? 'var(--accent)' : 'var(--text-primary)',
                                color: 'var(--bg-primary)'
                            }}
                        >
                            {status === 'loading' ? (
                                <span className="flex items-center gap-3">
                                    <Cpu className="w-4 h-4 animate-spin" /> Verificando...
                                </span>
                            ) : status === 'success' ? 'Acesso Liberado' : (
                                <>
                                    Entrar <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <AnimatePresence>
                        {status === 'error' && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-red-500 text-xs mt-6 py-2 px-4 rounded-full uppercase tracking-widest"
                                style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
                            >
                                Chave Inválida
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="mt-10 flex justify-center items-center gap-6 opacity-30">
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Shield className="w-3 h-3" /> Criptografado
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Lock className="w-3 h-3" /> Seguro
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
