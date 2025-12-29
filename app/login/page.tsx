'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push('/dashboard');
            } else {
                setError('Senha incorreta');
            }
        } catch (err) {
            setError('Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">LX Agents</h1>
                        <p className="text-xs text-gray-500">Painel de Controle</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Lock className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Acesso Restrito</h2>
                            <p className="text-sm text-gray-400">Digite a senha para continuar</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="relative mb-4">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha de acesso"
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors pr-12"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm mb-4 flex items-center gap-2">
                                ⚠️ {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                        >
                            {loading ? 'Verificando...' : 'Entrar no Painel'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-600 text-xs mt-6">
                    Acesso exclusivo para administradores
                </p>
            </div>
        </div>
    );
}
