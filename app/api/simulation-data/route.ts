import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'knowledge/dynamic/simulations/batch_1000_results.json');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Simulation data not found' }, { status: 404 });
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load simulation data' }, { status: 500 });
    }
}
