// ============================================
// LX AGENT COUNCIL - Multi-Agent Collaboration
// ============================================
// Sistema que coordena múltiplos agentes para resolver
// problemas complexos que requerem diferentes especialidades
// ============================================

import { AgentPersona, AgentRole, AGENT_REGISTRY, getAgentsByCategory, AgentCategory, AGENT_CATEGORIES } from './agents';
import { AgentContext } from './types';
import { hybridGenerate, isOllamaAvailable } from './local-llm';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// ============================================
// TIPOS
// ============================================
export interface CouncilRequest {
    question: string;
    context?: string;
    required_perspectives?: AgentRole[];
    max_agents?: number;
    include_synthesis?: boolean;
}

export interface AgentOpinion {
    agent: {
        role: AgentRole;
        name: string;
        title: string;
    };
    opinion: string;
    confidence: number;
    key_points: string[];
    suggested_actions?: string[];
    handoff_suggestions?: AgentRole[];
}

export interface CouncilResponse {
    question: string;
    agents_consulted: AgentRole[];
    opinions: AgentOpinion[];
    synthesis?: string;
    recommended_actions: string[];
    next_steps: string[];
    metadata: {
        total_latency_ms: number;
        source: 'online' | 'local' | 'mixed';
    };
}

// ============================================
// COUNCIL ORCHESTRATOR
// ============================================
export class AgentCouncil {
    private maxAgents: number = 5;

    constructor(config?: { maxAgents?: number }) {
        if (config?.maxAgents) {
            this.maxAgents = config.maxAgents;
        }
    }

    // ============================================
    // CONSULTAR COUNCIL
    // ============================================
    async consult(request: CouncilRequest): Promise<CouncilResponse> {
        const startTime = Date.now();

        // 1. Selecionar agentes relevantes
        const agents = this.selectRelevantAgents(request);

        // 2. Coletar opiniões em paralelo
        const opinions = await Promise.all(
            agents.map(agent => this.getAgentOpinion(agent, request))
        );

        // 3. Sintetizar se solicitado
        let synthesis: string | undefined;
        if (request.include_synthesis !== false) {
            synthesis = await this.synthesizeOpinions(opinions, request.question);
        }

        // 4. Extrair ações recomendadas
        const { actions, nextSteps } = this.extractRecommendations(opinions);

        return {
            question: request.question,
            agents_consulted: agents.map(a => a.role),
            opinions: opinions.filter(o => o !== null) as AgentOpinion[],
            synthesis,
            recommended_actions: actions,
            next_steps: nextSteps,
            metadata: {
                total_latency_ms: Date.now() - startTime,
                source: 'mixed' // TODO: track actual sources
            }
        };
    }

    // ============================================
    // SELECIONAR AGENTES RELEVANTES
    // ============================================
    private selectRelevantAgents(request: CouncilRequest): AgentPersona[] {
        // Se específicos foram solicitados, usar esses
        if (request.required_perspectives && request.required_perspectives.length > 0) {
            return request.required_perspectives
                .map(role => AGENT_REGISTRY[role])
                .filter(Boolean)
                .slice(0, request.max_agents || this.maxAgents);
        }

        // Caso contrário, detectar automaticamente
        const question = request.question.toLowerCase();
        const selectedAgents: AgentPersona[] = [];
        const addedRoles = new Set<AgentRole>();

        // Score cada agente por relevância
        const scored = Object.entries(AGENT_REGISTRY).map(([role, agent]) => {
            let score = 0;

            // Verificar triggers
            for (const trigger of agent.triggers.activate) {
                if (question.includes(trigger.toLowerCase())) {
                    score += 10;
                }
            }

            // Verificar expertise
            if (agent.expertise) {
                for (const skills of Object.values(agent.expertise)) {
                    for (const skill of skills) {
                        if (question.includes(skill.toLowerCase())) {
                            score += 5;
                        }
                    }
                }
            }

            // Verificar knowledge base
            if (agent.knowledge_base) {
                for (const kb of agent.knowledge_base) {
                    if (question.toLowerCase().includes(kb.toLowerCase().slice(0, 20))) {
                        score += 3;
                    }
                }
            }

            return { role: role as AgentRole, agent, score };
        });

        // Ordenar por score e pegar os top N
        scored
            .sort((a, b) => b.score - a.score)
            .slice(0, request.max_agents || this.maxAgents)
            .forEach(({ role, agent, score }) => {
                if (score > 0 && !addedRoles.has(role)) {
                    selectedAgents.push(agent);
                    addedRoles.add(role);
                }
            });

        // Se nenhum foi selecionado, usar defaults
        if (selectedAgents.length === 0) {
            selectedAgents.push(
                AGENT_REGISTRY.sdr,
                AGENT_REGISTRY.dev_fullstack,
                AGENT_REGISTRY.product_pm
            );
        }

        return selectedAgents;
    }

    // ============================================
    // OBTER OPINIÃO DE UM AGENTE
    // ============================================
    private async getAgentOpinion(
        agent: AgentPersona,
        request: CouncilRequest
    ): Promise<AgentOpinion | null> {
        try {
            const prompt = `Você é ${agent.name}, ${agent.title}.

${agent.system_prompt}

## PERGUNTA/PROBLEMA
${request.question}

${request.context ? `## CONTEXTO ADICIONAL\n${request.context}` : ''}

## INSTRUÇÕES
Dê sua opinião especializada sobre esse assunto, considerando:
1. Sua área de expertise
2. Riscos e oportunidades
3. Ações concretas que recomendaria

Responda em JSON:
{
  "opinion": "Sua análise em 2-3 parágrafos",
  "confidence": 0-100,
  "key_points": ["ponto 1", "ponto 2", "ponto 3"],
  "suggested_actions": ["ação 1", "ação 2"],
  "handoff_suggestions": ["role de outro agente que deveria opinar, se aplicável"]
}`;

            const provider = createOpenAI({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY || '',
            });

            const result = await generateText({
                model: provider('anthropic/claude-3.5-sonnet') as any,
                prompt,
                temperature: 0.3,
                maxTokens: 500,
            });

            // Tentar parsear JSON
            const jsonMatch = result.text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    agent: {
                        role: agent.role,
                        name: agent.name,
                        title: agent.title
                    },
                    opinion: parsed.opinion || result.text,
                    confidence: parsed.confidence || 70,
                    key_points: parsed.key_points || [],
                    suggested_actions: parsed.suggested_actions || [],
                    handoff_suggestions: parsed.handoff_suggestions || []
                };
            }

            // Fallback se não conseguir parsear
            return {
                agent: {
                    role: agent.role,
                    name: agent.name,
                    title: agent.title
                },
                opinion: result.text,
                confidence: 60,
                key_points: [],
                suggested_actions: []
            };

        } catch (error) {
            console.error(`[Council] Error getting opinion from ${agent.name}:`, error);
            return null;
        }
    }

    // ============================================
    // SINTETIZAR OPINIÕES
    // ============================================
    private async synthesizeOpinions(
        opinions: (AgentOpinion | null)[],
        question: string
    ): Promise<string> {
        const validOpinions = opinions.filter(o => o !== null) as AgentOpinion[];

        if (validOpinions.length === 0) {
            return 'Não foi possível obter opiniões dos agentes.';
        }

        const opinionsText = validOpinions
            .map(o => `**${o.agent.name} (${o.agent.title})**:\n${o.opinion}\nPontos-chave: ${o.key_points.join(', ')}`)
            .join('\n\n---\n\n');

        try {
            const provider = createOpenAI({
                baseURL: 'https://openrouter.ai/api/v1',
                apiKey: process.env.OPENROUTER_API_KEY || '',
            });

            const result = await generateText({
                model: provider('anthropic/claude-3.5-sonnet') as any,
                prompt: `Você é um facilitador de reuniões executivas.

## PERGUNTA ORIGINAL
${question}

## OPINIÕES DOS ESPECIALISTAS
${opinionsText}

## TAREFA
Sintetize as opiniões em um parágrafo executivo que:
1. Identifique os pontos de concordância
2. Destaque divergências importantes
3. Sugira a melhor abordagem considerando todas as perspectivas
4. Seja acionável e objetivo

Responda em português brasileiro, de forma direta e executiva.`,
                temperature: 0.3,
                maxTokens: 300,
            });

            return result.text;

        } catch (error) {
            console.error('[Council] Error synthesizing:', error);
            return validOpinions.map(o => `${o.agent.name}: ${o.key_points.join(', ')}`).join('\n');
        }
    }

    // ============================================
    // EXTRAIR RECOMENDAÇÕES
    // ============================================
    private extractRecommendations(opinions: (AgentOpinion | null)[]): {
        actions: string[];
        nextSteps: string[];
    } {
        const validOpinions = opinions.filter(o => o !== null) as AgentOpinion[];

        // Coletar todas as ações sugeridas
        const allActions = validOpinions.flatMap(o => o.suggested_actions || []);

        // Deduplicate e priorizar
        const uniqueActions = [...new Set(allActions)].slice(0, 5);

        // Gerar próximos passos baseados em handoff suggestions
        const handoffs = validOpinions.flatMap(o => o.handoff_suggestions || []);
        const nextSteps = [...new Set(handoffs)]
            .map(role => {
                const agent = AGENT_REGISTRY[role as AgentRole];
                return agent ? `Consultar ${agent.name} (${agent.title})` : null;
            })
            .filter(Boolean) as string[];

        return {
            actions: uniqueActions,
            nextSteps: nextSteps.length > 0 ? nextSteps : ['Implementar ações recomendadas', 'Revisar resultados em 1 semana']
        };
    }

    // ============================================
    // CONSULTA RÁPIDA (Um agente)
    // ============================================
    async askAgent(role: AgentRole, question: string, context?: string): Promise<string> {
        const agent = AGENT_REGISTRY[role];
        if (!agent) {
            return `Agente ${role} não encontrado.`;
        }

        const opinion = await this.getAgentOpinion(agent, { question, context });
        return opinion?.opinion || 'Não foi possível obter resposta.';
    }

    // ============================================
    // BRAINSTORM (Múltiplos agentes, ideação livre)
    // ============================================
    async brainstorm(topic: string, categories?: AgentCategory[]): Promise<{
        ideas: { agent: string; idea: string }[];
        top_ideas: string[];
    }> {
        // Selecionar um agente de cada categoria
        const selectedCategories = categories || ['dev', 'marketing', 'product', 'ops'] as AgentCategory[];

        const agents = selectedCategories.flatMap(cat => {
            const categoryAgents = getAgentsByCategory(cat);
            return categoryAgents.slice(0, 1); // Pegar apenas 1 de cada
        });

        const ideas = await Promise.all(
            agents.map(async agent => {
                try {
                    const provider = createOpenAI({
                        baseURL: 'https://openrouter.ai/api/v1',
                        apiKey: process.env.OPENROUTER_API_KEY || '',
                    });

                    const result = await generateText({
                        model: provider('anthropic/claude-3.5-sonnet') as any,
                        prompt: `Você é ${agent.name}, ${agent.title}.

Tópico para brainstorm: ${topic}

Dê UMA ideia criativa e acionável da perspectiva da sua área.
Seja específico e prático. Máximo 2 frases.`,
                        temperature: 0.7,
                        maxTokens: 100,
                    });

                    return { agent: agent.name, idea: result.text };
                } catch {
                    return { agent: agent.name, idea: '' };
                }
            })
        );

        return {
            ideas: ideas.filter(i => i.idea),
            top_ideas: ideas.filter(i => i.idea).map(i => i.idea).slice(0, 3)
        };
    }
}

// ============================================
// INSTÂNCIA SINGLETON
// ============================================
export const council = new AgentCouncil();

// ============================================
// FUNÇÕES DE CONVENIÊNCIA
// ============================================
export async function askCouncil(question: string, options?: Partial<CouncilRequest>): Promise<CouncilResponse> {
    return council.consult({ question, ...options });
}

export async function askAgent(role: AgentRole, question: string, context?: string): Promise<string> {
    return council.askAgent(role, question, context);
}

export async function brainstorm(topic: string): Promise<string[]> {
    const result = await council.brainstorm(topic);
    return result.top_ideas;
}
