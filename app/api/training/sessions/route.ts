
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'training_sessions.json');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ sessions: [] });
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        const sessions = JSON.parse(fileContent);

        // Retorna ordenado por mais recente
        return NextResponse.json({
            sessions: sessions.reverse().slice(0, 100)
        });
    } catch (error) {
        console.error('Erro ao ler sessões locais:', error);
        return NextResponse.json({ sessions: [] }, { status: 500 });
    }
}
