
import fs from 'fs';
import path from 'path';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import dotenv from 'dotenv';
import mammoth from 'mammoth';
const pdf = require('pdf-parse');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const provider = createOpenAI({
    baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined,
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
});

const DROPZONE = path.join(process.cwd(), 'data', 'knowledge', 'dropzone');
const ACTIVE_POOL = path.join(process.cwd(), 'data', 'knowledge');
const ARCHIVE = path.join(process.cwd(), 'data', 'knowledge', 'archived');

async function extractText(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    if (['.md', '.txt', '.json', '.csv', '.sql'].includes(ext)) {
        const text = fs.readFileSync(filePath, 'utf8');
        console.log(`Debug: Lidos ${text.length} caracteres de ${filePath}`);
        return text;
    }

    if (ext === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    }

    if (ext === '.pdf' || ext === '.docx') {
        const { execSync } = require('child_process');
        console.log(`Debug: Chamando Python Extractor para ${path.basename(filePath)}...`);
        const text = execSync(`python3 scripts/extractor.py "${filePath}"`).toString();
        return text;
    }

    return fs.readFileSync(filePath, 'utf8'); // Fallback
}

async function digestFile(filename: string) {
    const filePath = path.join(DROPZONE, filename);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) return;

    console.log(`\n⚙️  Digerindo: ${filename}...`);

    try {
        // 1. Extração Inteligente
        const rawContent = await extractText(filePath);

        if (!rawContent || rawContent.length < 10) {
            console.error("   ❌ Conteúdo insuficiente ou falha na extração.");
            return;
        }

        // 2. Geração de Camada de Inteligência
        console.log(`   🧠 Destilando ${rawContent.length} caracteres para Inteligência LUMAX...`);

        const { text: refinedIntelligence } = await generateText({
            model: provider('gpt-4o'),
            system: `Você é o Alquimista de Conhecimento do Sistema LUMAX.
            Sua missão é converter documentos brutos de qualquer formato em "Soro de Inteligência".
            
            ESTRUTURA OBRIGATÓRIA DO ARQUIVO:
            # 🧠 Módulo: [Nome do Assunto]
            ## 🎯 Essência Executiva: (Resumo de 3 frases para o agente ler rápido)
            ## 📜 Regras e Fatos: (Listagem técnica e objetiva)
            ## ⚔️ Táticas Sugeridas: (Como usar isso em uma conversa de vendas/suporte)
            
            FOCO: Converta parágrafos chatos em REGRAS DE AÇÃO.`,
            prompt: `Analise este material e crie o Soro de Inteligência:\n\n${rawContent.substring(0, 50000)}`
        });

        // 3. Salvar
        const outputFilename = `intelligence_${filename.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_")}.md`;
        const outputPath = path.join(ACTIVE_POOL, outputFilename);

        fs.writeFileSync(outputPath, refinedIntelligence);
        console.log(`   ✅ Soro de Inteligência Injetado: ${outputFilename}`);

        // 4. Arquivar
        if (!fs.existsSync(ARCHIVE)) fs.mkdirSync(ARCHIVE);
        fs.renameSync(filePath, path.join(ARCHIVE, `${Date.now()}_${filename}`));
        console.log(`   📦 Original arquivado.`);

    } catch (e) {
        console.error(`   ❌ Falha ao processar ${filename}:`, e);
    }
}

async function runHarvest() {
    if (!fs.existsSync(DROPZONE)) fs.mkdirSync(DROPZONE, { recursive: true });

    const files = fs.readdirSync(DROPZONE);
    if (files.length === 0) {
        console.log("ℹ️  Nenhum arquivo na Dropzone. Aguardando novos materiais.");
        return;
    }

    console.log(`🚀 Iniciando colheita de ${files.length} arquivos...`);
    for (const file of files) {
        await digestFile(file);
    }
}

runHarvest().catch(console.error);
