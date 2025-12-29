import { NextResponse } from 'next/server';
import { PythonShell } from 'python-shell';
import path from 'path';
import fs from 'fs';

// ============================================
// API: EVOLUTION BRIDGE (NEXT.JS <-> PYTHON GENIUS)
// ============================================
// Conecta o frontend à "Alma" Python do sistema.

const GENIUS_PATH = path.resolve(process.cwd(), '../GENIUM-LX/src/evolution/dream_engine.py');

export async function POST(req: Request) {
    try {
        const { agentId } = await req.json();

        console.log(`[EVOLUTION] Solicitando Ciclo REM para agente: ${agentId}`);

        // Verificação de Segurança: O Cérebro Python existe?
        if (!fs.existsSync(GENIUS_PATH)) {
            console.warn('[EVOLUTION] GENIUM-LX não encontrado. Usando simulação.');
            return NextResponse.json({
                success: true,
                mode: 'simulation',
                message: 'Núcleo Python offline. Executando heurística de fallback TS.',
                updates: [
                    "Ajuste de Tom: +15% Empatia",
                    "Novo Padrão Detectado: 'Preço' -> 'Investimento'"
                ]
            });
        }

        // Executar o Cérebro Real (Python)
        // Isso roda o script dream_engine.py que lê memórias e evolui patterns.json
        const options = {
            mode: 'text' as const,
            pythonPath: 'python3',
            scriptPath: path.dirname(GENIUS_PATH),
            args: ['--agent', agentId]
        };

        const result = await new Promise<string[]>((resolve, reject) => {
            PythonShell.run('dream_engine.py', options).then(messages => {
                resolve(messages);
            }).catch(err => {
                reject(err);
            });
        });

        console.log('[EVOLUTION] Resultado Python:', result);

        return NextResponse.json({
            success: true,
            mode: 'genius_lx',
            message: 'Ciclo REM concluído com sucesso.',
            evolution_log: result
        });

    } catch (error: any) {
        console.error('[EVOLUTION] Falha crítica:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
