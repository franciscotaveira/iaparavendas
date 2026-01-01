
import fs from 'fs';
import path from 'path';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const provider = createOpenAI({
    baseURL: process.env.OPENROUTER_API_KEY ? 'https://openrouter.ai/api/v1' : undefined,
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
});

// Arquivos "Ouro" identificados
const GOLD_FILES = [
    '2026_REVOLUTION_PLAN.md',
    'MANUAL_DO_CEO.md',
    'GTM_STRATEGY.md',
    'knowledge/URE_UNIVERSAL_RAPPORT_ENGINE.md',
    'knowledge/ANTIGRAVITY_PROTOCOL.md',
    'docs/proposals/TEMPLATE_PROPOSTA_COMERCIAL.md'
];

const RAW_DIR = path.join(process.cwd(), 'data', 'knowledge', 'raw');
const PROCESSED_DIR = path.join(process.cwd(), 'data', 'knowledge'); // Onde a API lê
const SOURCE_ROOT = path.join(process.cwd(), '..'); // IAPARAVENDAS root

async function ingestGold() {
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

    console.log("🤠 Iniciando mineração de conhecimento...");

    for (const relativePath of GOLD_FILES) {
        // Tentar achar o arquivo (pode estar na raiz do workspace ou dentro de lx-demo)
        // O find_by_name mostrou caminhos relativos ao root do user, mas o cwd é lx-demo-interface
        // Vou tentar caminhos inteligentes

        let fullPath = path.join(process.cwd(), relativePath);
        if (!fs.existsSync(fullPath)) {
            // Tenta na raiz do usuario (../)
            fullPath = path.join(process.cwd(), '..', relativePath);
            // Corrige caminhos do find que as vezes incluem o nome da pasta atual
            if (!fs.existsSync(fullPath)) {
                // Tenta achar apenas pelo nome base usando recursão simples se falhar
                console.warn(`Arquivo não encontrado no path direto: ${relativePath}. Pulando.`);
                continue;
            }
        }

        console.log(`\n💎 Processando: ${relativePath}`);

        const content = fs.readFileSync(fullPath, 'utf8');
        const filename = path.basename(relativePath);

        // 1. Backup Raw
        fs.writeFileSync(path.join(RAW_DIR, filename), content);

        // 2. Refinamento com IA
        console.log("   ↳ Refinando com IA (extraindo fatos e táticas)...");
        try {
            const { text: refinedContent } = await generateText({
                model: provider('gpt-4o'),
                system: `Você é um Analista de Conhecimento (Knowledge Engineer).
                Sua missão: Ler documentos brutos da empresa e extrair APENAS informações úteis para Agentes de IA (SDRs, Suporte).
                
                O que extrair:
                - Regras de Negócio e Preços.
                - Táticas de Persuasão e Rapport.
                - Missão, Visão e Valores (Cultura).
                - Objeções e Respostas.
                
                O que IGNORAR:
                - Formatação quebrada.
                - Dados pessoais sensíveis (CPFs, nomes de clientes reais - anonimize!).
                - Textos genéricos ou 'lorem ipsum'.
                
                Saída: Markdown limpo e estruturado.`,
                prompt: `Analise este documento e extraia o conhecimento:\n\n${content.substring(0, 30000)}` // Limitando caracteres
            });

            // 3. Salvar na Base de Conhecimento Ativa
            const targetPath = path.join(PROCESSED_DIR, `reclaimed_${filename}`);
            fs.writeFileSync(targetPath, refinedContent);
            console.log(`   ✅ Salvo em: ${targetPath}`);

        } catch (e) {
            console.error(`   ❌ Falha ao refinar ${filename}:`, e);
        }
    }
}

ingestGold().catch(console.error);
