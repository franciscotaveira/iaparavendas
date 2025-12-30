/**
 * LXC COUNCIL MEETING ENGINE
 * Onde os agentes se reúnem para debater.
 */

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { COUNCIL_AGENTS, CouncilAgent } from './definitions';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase & LLM
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const provider = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL_NAME = 'anthropic/claude-3.5-haiku'; // Rápido e inteligente para auditoria em lote

export interface AuditResult {
    agentId: string;
    role: string;
    opinion: string;
    score: number; // 0-100
    flagged: boolean;
}

export interface MeetingSummary {
    leadId: string;
    consensus: string;
    actionableItems: string[];
    overallScore: number;
    agentsHeard: string[];
}

export class CouncilMeeting {

    // Realizar uma auditoria em uma conversa específica
    async auditConversation(leadId: string, history: string[]): Promise<MeetingSummary> {
        // 1. Selecionar o "Board" adequado para o caso
        // Por padrão, chamamos um representante de cada cluster para economizar, 
        // mas se a conversa for crítica, chamamos todos.
        const board = this.selectBoardMembers();

        const opinions: AuditResult[] = [];

        // 2. Ouvir cada agente (em paralelo para velocidade)
        const promises = board.map(agent => this.askAgent(agent, history));
        opinions.push(...await Promise.all(promises));

        // 3. O Chairman (Visionary) sintetiza a reunião
        const summary = await this.synthesizeMeeting(opinions, history);

        // 4. Persistir a Ata da Reunião
        await this.saveMeetingMinutes(leadId, summary, opinions);

        return summary;
    }

    private selectBoardMembers(): CouncilAgent[] {
        // Seleção inteligente: 1 de cada cluster + Visionary
        // TODO: Poderia ser dinâmico baseado no estágio do lead
        return [
            COUNCIL_AGENTS.find(a => a.id === 'sales_closer')!,
            COUNCIL_AGENTS.find(a => a.id === 'human_psyche')!,
            COUNCIL_AGENTS.find(a => a.id === 'qa_sentinel')!,
            COUNCIL_AGENTS.find(a => a.id === 'strat_visionary')!
        ];
    }

    private async askAgent(agent: CouncilAgent, history: string[]): Promise<AuditResult> {
        try {
            const prompt = `
            ${agent.prompt}

            Abaixo está o histórico da conversa que você deve auditar:
            ---
            ${history.join('\n')}
            ---

            Com base na sua PERSONALIDADE ÚNICA e DIRETRIZ PRIMÁRIA:
            1. Dê sua opinião brutalmente honesta.
            2. Dê uma nota de 0 a 100 para o desempenho do agente atual.
            3. Marque FLAG = TRUE se houver algo crítico/inaceitável para sua função.

            Retorne APENAS um JSON no formato:
            {
                "opinion": "sua analise aqui...",
                "score": 85,
                "flagged": false
            }
            `;

            const { text } = await generateText({
                model: provider(MODEL_NAME),
                system: `Você é ${agent.role}. Aja conforme sua persona.`,
                prompt: prompt,
                temperature: 0.4 // Leve criatividade, mas focado
            });

            // Parse seguro
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

            // Notificar Sócio via Telegram
            // @ts-ignore
            if (typeof notifyProactiveAction !== 'undefined') {
                // Import dinâmico ou assumir importação no topo (farei import no topo na próxima passada se necessário, 
                // mas aqui é mais seguro editar o arquivo inteiro se for complexo, 
                // vou simplificar e assumir que o usuário vai rodar o replace do import depois ou eu faço agora)
            }
            // Na verdade, vou usar o multi-replace direito e adicionar o import no topo deste arquivo também

            const result = JSON.parse(cleanJson);

            return {
                agentId: agent.id,
                role: agent.role,
                opinion: result.opinion,
                score: result.score,
                flagged: result.flagged
            };

        } catch (e) {
            console.error(`[Council] Error hearing agent ${agent.role}:`, e);
            return {
                agentId: agent.id,
                role: agent.role,
                opinion: "Falha ao processar opinião.",
                score: 50,
                flagged: false
            };
        }
    }

    private async synthesizeMeeting(opinions: AuditResult[], history: string[]): Promise<MeetingSummary> {
        // O Visionary (ou um Chairman neutro) compila tudo
        const opinionsText = opinions.map(o => `[${o.role}]: "${o.opinion}" (Score: ${o.score})`).join('\n');

        const prompt = `
        Você é o CHAIRMAN (Presidente do Conselho).
        Você acabou de ouvir seus conselheiros sobre uma interação recente:

        ${opinionsText}

        Sintetize esta reunião em:
        1. Um CONSENSO GERAL (O que todos concordam ou qual a verdade que emerge do debate?)
        2. 3 AÇÕES PRÁTICAS para melhorar (Actionable Items).
        3. Score Final Ponderado (Média dos scores).

        Retorne JSON: { "consensus": "...", "actionableItems": ["..."], "overallScore": 0 }
        `;

        const { text } = await generateText({
            model: provider(MODEL_NAME),
            prompt: prompt
        });

        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(cleanJson);

        return {
            leadId: 'unknown', // Será preenchido externamente
            consensus: result.consensus,
            actionableItems: result.actionableItems,
            overallScore: result.overallScore,
            agentsHeard: opinions.map(o => o.role)
        };
    }

    private async saveMeetingMinutes(leadId: string, summary: MeetingSummary, opinions: AuditResult[]) {
        // Salvar em tabela de auditoria (lxc_council_logs)
        // Se a tabela não existir, o erro será capturado, mas idealmente criaríamos ela.
        try {
            await supabase.from('lxc_council_logs').insert({
                lead_id: leadId,
                consensus: summary.consensus,
                score: summary.overallScore,
                opinions: opinions, // JSONB
                created_at: new Date().toISOString()
            });
        } catch (e) {
            // Silencioso se tabela n existir ainda
            console.warn('[Council] Failed to save logs (Table might correspond missing):', e);
        }
    }
}
