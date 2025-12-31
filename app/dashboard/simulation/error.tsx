'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-4">Algo deu errado na simulação</h2>
            <div className="bg-red-900/50 p-4 rounded mb-4 text-left font-mono text-sm overflow-auto max-w-lg mx-auto border border-red-500/30">
                {error.message || "Erro desconhecido"}
            </div>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors"
            >
                Tentar novamente
            </button>
        </div>
    );
}
