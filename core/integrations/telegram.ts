/**
 * LXC TELEGRAM INTEGRATION
 * "O Pager do Executivo"
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramAlert(message: string, level: 'info' | 'warning' | 'critical' = 'info') {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('[Telegram] Tokens not configured. Skipping alert.');
        return;
    }

    const icons = {
        info: 'ℹ️',
        warning: '⚠️',
        critical: '🚨'
    };

    const formattedMessage = `${icons[level]} *LXC INTELLIGENCE ALERT*\n\n${message}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: formattedMessage,
                parse_mode: 'Markdown'
            })
        });

        if (!response.ok) {
            console.error('[Telegram] Failed to send message:', await response.text());
        }
    } catch (error) {
        console.error('[Telegram] Error:', error);
    }
}

export async function notifyCouncilDecision(directive: { focus: string; tone: string; yesterday: string }) {
    const msg = `
🏛️ *NOVA DIRETRIZ DO CONSELHO*

🗣️ *Aprendizado de Ontem:*
_${directive.yesterday}_

🎯 *Foco de Hoje:*
*${directive.focus}*

🎭 *Ajuste de Tom:*
${directive.tone}

_Status: APLICADO GLOBALMENTE_
`;
    await sendTelegramAlert(msg, 'info');
}

export async function notifyProactiveAction(leadName: string, actionType: string, content: string) {
    const msg = `
⚡️ *INICIATIVA PROATIVA TOMADA*

👤 *Lead:* ${leadName}
Gatilho: ${actionType}

💬 *Mensagem Enviada:*
"${content}"
`;
    await sendTelegramAlert(msg, 'info');
}
