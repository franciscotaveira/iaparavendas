
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const provider = createOpenAI({
    baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined,
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
});

const DATA_PATH = path.join(process.cwd(), 'data', 'training_sessions.json');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'playbooks');

async function generatePlaybook() {
    if (!fs.existsSync(DATA_PATH)) {
        console.error("❌ Nenhum dado de treino encontrado para gerar playbook.");
        return;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log("📚 Iniciando LUMAX KNOWLEDGE HARVESTER...");

    // 1. Carregar dados brutos
    const sessions = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const wins = sessions.filter((s: any) => s.success);

    console.log(`🔍 Analisando ${wins.length} vitórias registradas no Dojo...`);

    if (wins.length < 3) {
        console.log("⚠️ Poucas vitórias para gerar um padrão confiável. Recomendo deixar o Dojo rodar mais.");
        return;
    }

    // 2. Sintetizar Aprendizados com LLM
    // Enviamos um resumo das interações para uma IA "Ghostwriter" criar o documento
    const summaryData = wins.map((w: any) => ({
        scenario: w.scenario,
        opponent: w.persona_type,
        strengths: w.feedback?.strengths || [],
        winning_tactic: w.feedback?.feedback || "Tática não identificada"
    })).slice(0, 20); // Limite para não estourar contexto

    console.log("✍️  Escrevendo Playbook (isso pode levar alguns segundos)...");

    const { text: playbookContent } = await generateText({
        model: provider('gpt-4o'),
        system: `Você é um Consultor de Vendas Sênior e Estrategista de IA.
        Sua função é analisar logs de treinamento de agentes e criar um PLAYBOOK DE VENDAS tático.
        
        Você receberá dados de batalhas ganhas. Identifique padrões:
        - O que funciona contra clientes Céticos?
        - O que funciona contra clientes Agressivos?
        - Quais argumentos convertem mais?
        
        Saída: Um documento MARKDOWN profissional, bem formatado, pronto para ser lido por humanos.
        Estrutura:
        # 📘 LUMAX Living Playbook (Auto-Generated)
        ## 📊 Executive Summary
        ## 🛡️ Táticas de Defesa (Objeções)
        ## ⚔️ Táticas de Ataque (Fechamento)
        ## 💡 Insights por Perfil de Cliente
        `,
        prompt: `Analise estes dados de vitórias recentes e gere o Playbook:\n${JSON.stringify(summaryData, null, 2)}`
    });

    // 3. Salvar Arquivo
    const filename = `LUMAX_Playbook_v${new Date().toISOString().split('T')[0]}.md`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(outputPath, playbookContent);

    console.log(`\n✅ PLAYBOOK GERADO COM SUCESSO!`);
    console.log(`📄 Arquivo: ${outputPath}`);
    console.log(`🔗 Acesso Web: http://localhost:3000/playbooks/${filename}`);
}

generatePlaybook().catch(console.error);
