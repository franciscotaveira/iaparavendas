import { NextResponse } from 'next/server';
import { checkAllLeadsForInitiatives, logProactiveInitiative } from '@/core/consciousness';
import { notifyProactiveAction } from '@/core/integrations/telegram';

// Em produção, isso deve ser protegido por uma chave secreta
const CRON_SECRET = process.env.CRON_SECRET || 'dev_secret';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get('secret');

        if (secret !== CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('[Cron] Starting proactive initiatives check...');
        const initiatives = await checkAllLeadsForInitiatives();

        const results = [];

        for (const initiative of initiatives) {
            console.log(`[Cron] Initiative triggered for lead ${initiative.leadId}: ${initiative.triggerType}`);

            // Aqui conectaríamos com o disparador de mensagens (WhatsApp API)
            // Por enquanto, apenas logamos como "enviado"
            // TODO: Integrar com POST /api/chat/send ou função sendMessage direta

            await logProactiveInitiative(initiative);

            // Notificar Telegram
            await notifyProactiveAction(initiative.leadId, initiative.triggerType, initiative.content);

            results.push({
                leadId: initiative.leadId,
                type: initiative.triggerType,
                content: initiative.content
            });
        }

        return NextResponse.json({
            success: true,
            checked: true,
            initiatives: results
        });

    } catch (error) {
        console.error('[Cron] Failed:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
