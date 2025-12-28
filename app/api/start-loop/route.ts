
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
    try {
        const { domain, count } = await req.json();

        // Safety check
        if (!['sales', 'dev', 'hacker', 'architect'].includes(domain)) {
            return NextResponse.json({ error: 'Invalid domain' }, { status: 400 });
        }

        // In a real environment, this would spawn a background worker.
        // Here we trigger the node script directly (non-blocking).
        // Note: We are re-using the simulation script but passing arguments would be the next step.
        // For this demo, we re-run the batch script to simulate activity.

        execPromise(`node /Users/franciscotaveira.ads/IAPARAVENDAS/lx-demo-interface/scripts/simulate_training.js`);

        return NextResponse.json({ status: 'started', message: `Infinite Loop initiated for ${domain}` });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to start simulation' }, { status: 500 });
    }
}
