
import { Telegraf } from 'telegraf';
import { supabase } from '@/lib/supabase'; // Importando do local correto

// Config
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_ID = process.env.TELEGRAM_ADMIN_ID; // Seu ID numérico para segurança

export async function startTelegramBot() {
    if (!BOT_TOKEN) {
        console.warn("⚠️ Telegram Bot Token not found. Skipping...");
        return;
    }

    const bot = new Telegraf(BOT_TOKEN);

    // Middleware de Segurança: Só você pode mandar comandos
    bot.use(async (ctx, next) => {
        const userId = String(ctx.from?.id);
        console.log(`[Telegram] Mensagem recebida de: ${userId} (${ctx.from?.first_name})`);

        if (userId !== ADMIN_ID) {
            console.log(`⛔ Acesso negado: ${userId} tentou acessar.`);
            if (ctx.message && 'text' in ctx.message && ctx.message.text === '/meuid') {
                return ctx.reply(`Seu ID é: ${userId}`);
            }
            return; // Ignora estranhos
        }
        await next();
    });

    // --- COMANDOS ---

    // 1. Comando: /status
    bot.command('status', async (ctx) => {
        ctx.reply("✅ Antigravity System Online\n🔋 Worker: Running\n📡 Server: Active");
    });

    // 2. Comando: /novo_cliente [Nome] [Telefone]
    bot.command('novo_cliente', async (ctx) => {
        const text = ctx.message.text.replace('/novo_cliente', '').trim();
        const [nome, telefone] = text.split(' ');

        if (!nome || !telefone) {
            return ctx.reply("❌ Formato: /novo_cliente Nome 5511999999999");
        }

        ctx.reply(`🚀 Iniciando Onboarding para ${nome}...`);

        // Aqui chamamos a automação interna
        try {
            // Exemplo de inserção direta ou disparo de trigger
            if (!supabase) {
                return ctx.reply("⚠️ Erro: Banco de dados não conectado.");
            }
            await supabase.from('leads').insert({ name: nome, phone: telefone, status: 'new' });
            ctx.reply("✅ Cliente cadastrado no DB. Iniciando fluxo de boas-vindas...");
            // TODO: Chamar Evolution API para mandar "Oi"
        } catch (e: any) {
            ctx.reply(`❌ Erro: ${e.message}`);
        }
    });

    // 3. Comando: /automacao [prompt]
    // Ex: /automacao Quero enviar um email para todos os leads amanhã
    bot.command('automacao', async (ctx) => {
        const prompt = ctx.message.text.replace('/automacao', '').trim();
        ctx.reply(`🧠 Pensando em como automatizar: "${prompt}"...`);
        // Futuro: Integrar com LLM para gerar código ou workflow n8n
    });

    // Inicia o bot
    bot.launch(() => {
        console.log("🤖 Telegram Command Center Launched!");
    });

    // Graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
