/**
 * PRESENCE CORE v2.0
 * Sistema unificado de presença contínua com:
 * - Memória relacional contextual
 * - Timing emocional adaptativo
 * - Detecção de subtexto em tempo real
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// ============================================
// ENUMS & TYPES
// ============================================

export enum EmotionalState {
    NEUTRAL = 'neutral',
    ENGAGED = 'engaged',
    VULNERABLE = 'vulnerable',
    STRESSED = 'stressed',
    EXCITED = 'excited',
    DISTANT = 'distant',
    CONTEMPLATIVE = 'contemplative'
}

export enum MemoryType {
    FACTUAL = 'factual',
    RELATIONAL = 'relational',
    CONTEXTUAL = 'contextual',
    SUBTEXTUAL = 'subtextual'
}

export interface MemoryEntry {
    id: string;
    type: MemoryType;
    content: Record<string, unknown>;
    emotionalWeight: number;
    timestamp: Date;
    contextSnapshot: Record<string, unknown>;
    lastAccessed: Date;
    accessCount: number;
    decayRate: number;
}

export interface SubtextPattern {
    name: string;
    detect: (history: Message[]) => number;
    meanings: string[];
    actions: string[];
    severity: number;
}

export interface TimingConfig {
    baseDelayMs: number;
    typingIndicator: boolean;
    preResponse: string | null;
    varianceRange: [number, number];
}

export interface Message {
    content: string;
    sender: 'lead' | 'agent';
    timestamp: Date;
    topics?: string[];
}

export interface PresenceState {
    relationshipDepth: number;
    trustLevel: number;
    lastInteraction: Date;
    emotionalTrajectory: Array<{ timestamp: Date; emotion: string; intensity: number }>;
    communicationPrefs: {
        formalityLevel: number;
        emojiUsage: number;
        responseLength: 'short' | 'medium' | 'long';
        detectedGeneration?: 'legacy' | 'modern' | 'unknown';
    };
}

// ============================================
// TIMING CONFIGS
// ============================================

const TIMING_CONFIGS: Record<EmotionalState, TimingConfig> = {
    [EmotionalState.NEUTRAL]: {
        baseDelayMs: 1200,
        typingIndicator: true,
        preResponse: null,
        varianceRange: [0.9, 1.2]
    },
    [EmotionalState.ENGAGED]: {
        baseDelayMs: 600,
        typingIndicator: false,
        preResponse: 'nossa!',
        varianceRange: [0.7, 1.0]
    },
    [EmotionalState.VULNERABLE]: {
        baseDelayMs: 3500,
        typingIndicator: true,
        preResponse: null,
        varianceRange: [1.1, 1.4]
    },
    [EmotionalState.STRESSED]: {
        baseDelayMs: 2000,
        typingIndicator: true,
        preResponse: null,
        varianceRange: [1.0, 1.3]
    },
    [EmotionalState.EXCITED]: {
        baseDelayMs: 500,
        typingIndicator: false,
        preResponse: '🔥',
        varianceRange: [0.6, 0.9]
    },
    [EmotionalState.DISTANT]: {
        baseDelayMs: 1800,
        typingIndicator: true,
        preResponse: null,
        varianceRange: [0.9, 1.1]
    },
    [EmotionalState.CONTEMPLATIVE]: {
        baseDelayMs: 2800,
        typingIndicator: true,
        preResponse: 'hmm...',
        varianceRange: [1.0, 1.3]
    }
};

// ============================================
// SUBTEXT DETECTION
// ============================================

function detectShorteningResponses(history: Message[]): number {
    const leadMsgs = history.filter(m => m.sender === 'lead').slice(-4);
    if (leadMsgs.length < 3) return 0;

    const lengths = leadMsgs.map(m => m.content.length);
    if (lengths[0] === 0) return 0;

    const reductionRate = (lengths[0] - lengths[lengths.length - 1]) / lengths[0];
    const isConsistent = lengths.every((len, i) => i === 0 || len <= lengths[i - 1]);

    return Math.min(1, Math.max(0, (reductionRate * 0.7 + (isConsistent ? 0.3 : 0)) * 1.2));
}

function detectEmotionalSilence(history: Message[]): number {
    if (history.length < 2) return 0;

    const lastLead = [...history].reverse().find(m => m.sender === 'lead');
    const lastAgent = [...history].reverse().find(m => m.sender === 'agent');
    if (!lastLead || !lastAgent) return 0;

    const personalKeywords = ['como você está', 'o que sente', 'conta pra mim', 'me fala'];
    const hasPersonalQ = personalKeywords.some(k => lastAgent.content.toLowerCase().includes(k));

    const vagueResponses = ['mais ou menos', 'não sei', 'vou ver', 'talvez', 'depois'];
    const isVague = vagueResponses.some(v => lastLead.content.toLowerCase().includes(v));

    if (hasPersonalQ && (lastLead.content.length < 20 && isVague)) {
        return 0.85;
    }
    return 0.2;
}

function detectExcessiveFormality(history: Message[]): number {
    const leadMsgs = history.filter(m => m.sender === 'lead').slice(-3);
    if (leadMsgs.length < 2) return 0;

    const formalMarkers = ['prezado', 'senhor', 'senhora', 'atenciosamente', 'cordialmente', 'grato'];
    const informalMarkers = ['kkk', 'haha', 'rs', '😊', '❤️', 'valeu', 'blz', 'vlw'];

    const recentMsg = leadMsgs[leadMsgs.length - 1].content.toLowerCase();
    const previousMsgs = leadMsgs.slice(0, -1).map(m => m.content.toLowerCase()).join(' ');

    const recentFormal = formalMarkers.filter(m => recentMsg.includes(m)).length;
    const previousInformal = informalMarkers.filter(m => previousMsgs.includes(m)).length;

    if (recentFormal > 0 && previousInformal > 0) {
        return 0.8;
    }
    return 0.1;
}

function detectPriceObsession(history: Message[]): number {
    const leadMsgs = history.filter(m => m.sender === 'lead');
    const priceKeywords = ['preço', 'valor', 'custo', 'quanto custa', 'investimento', 'orçamento'];

    let priceCount = 0;
    for (const msg of leadMsgs) {
        if (priceKeywords.some(k => msg.content.toLowerCase().includes(k))) {
            priceCount++;
        }
    }

    if (priceCount >= 3) return 0.9;
    if (priceCount >= 2) return 0.6;
    return 0;
}

const SUBTEXT_PATTERNS: SubtextPattern[] = [
    {
        name: 'respostas_encurtando',
        detect: detectShorteningResponses,
        meanings: ['perdendo interesse', 'ficou ocupado', 'algo incomodou', 'já decidiu'],
        actions: ['check_in_sutil', 'dar_espaco', 'abordar_objecao'],
        severity: 3
    },
    {
        name: 'silencio_emocional',
        detect: detectEmotionalSilence,
        meanings: ['processando algo pesado', 'hesitando em compartilhar', 'avaliando confiança'],
        actions: ['validar_sentimento', 'oferecer_espaco', 'vulnerabilidade_calibrada'],
        severity: 4
    },
    {
        name: 'excesso_formalidade',
        detect: detectExcessiveFormality,
        meanings: ['criando distância', 'preparando para negar', 'desconfortável'],
        actions: ['espelhar_formalidade', 'reduzir_intimidade', 'focar_fatos'],
        severity: 2
    },
    {
        name: 'obcecado_preco',
        detect: detectPriceObsession,
        meanings: ['objeção não verbalizada', 'comparando concorrente', 'precisa justificar'],
        actions: ['abordar_valor_proativamente', 'demonstrar_roi', 'perguntar_orçamento'],
        severity: 3
    }
];

// ============================================
// SENIORITY / GENERATION DETECTION (1960s-1980s Filter)
// ============================================

function detectGeneration(message: string): 'legacy' | 'modern' {
    const lower = message.toLowerCase();

    // Marcadores de Senioridade (Gen X / Boomer)
    // Foco: Formalidade, termos corporativos antigos, cortesia excessiva, clareza estrutural
    const legacyMarkers = [
        'gostaria de', 'prezado', 'bom dia', 'boa tarde', 'boa noite',
        'compreender', 'proposta', 'agendar uma reunião', 'conversar com',
        'telefone', 'falar ao telefone', 'ligação',
        'empresa', 'negócio', 'parceria', 'investimento',
        'grato', 'atenciosamente', 'cordialmente',
        'senhor', 'senhora'
    ];

    // Marcadores de Modernidade (Gen Z / Millennial)
    // Foco: Agilidade, gírias, abreviações, emojis
    const modernMarkers = [
        'vc', 'vcs', 'zap', 'whats', 'link', 'app',
        'tá', 'to', 'né', 'kkk', 'rs', 'blz', 'valeu',
        'top', 'daora', 'manda ai', 'preço?', 'valor?'
    ];

    let legacyScore = 0;
    let modernScore = 0;

    legacyMarkers.forEach(m => { if (lower.includes(m)) legacyScore++; });
    modernMarkers.forEach(m => { if (lower.includes(m)) modernScore++; });

    // Se houver indícios claros de senioridade E ausência de gírias modernas
    if (legacyScore >= 1 && modernScore === 0) return 'legacy';

    // Default moderno/neutro
    return 'modern';
}

// ============================================
// EMOTION DETECTION
// ============================================

export function detectEmotion(message: string, history: Message[]): EmotionalState {
    const lower = message.toLowerCase();

    // Vulnerable
    if (/difícil|complicado|não sei o que fazer|estressad|preocupad|ansios/.test(lower)) {
        return EmotionalState.VULNERABLE;
    }

    // Excited
    if (/incrível|maravilh|perfeito|amei|sensacional|🔥|🚀|❤️/.test(lower)) {
        return EmotionalState.EXCITED;
    }

    // Engaged
    if (/legal|interessante|quero|gostei|me conta|como funciona/.test(lower)) {
        return EmotionalState.ENGAGED;
    }

    // Stressed
    if (/urgente|preciso|rápido|prazo|correndo|atrasad/.test(lower)) {
        return EmotionalState.STRESSED;
    }

    // Contemplative
    if (/pensando|avaliando|talvez|será que|não tenho certeza/.test(lower)) {
        return EmotionalState.CONTEMPLATIVE;
    }

    // Distant (detectar via subtexto)
    const shorteningScore = detectShorteningResponses(history);
    const formalityScore = detectExcessiveFormality(history);
    if (shorteningScore > 0.6 || formalityScore > 0.7) {
        return EmotionalState.DISTANT;
    }

    return EmotionalState.NEUTRAL;
}

// ============================================
// PRESENCE CORE CLASS
// ============================================

export class PresenceCore {
    private memoryStore: Map<string, MemoryEntry[]> = new Map();
    private conversationHistory: Map<string, Message[]> = new Map();
    private presenceState: Map<string, PresenceState> = new Map();
    private agentPersona: Record<string, unknown>;

    constructor(agentPersona: Record<string, unknown>) {
        this.agentPersona = agentPersona;
    }

    // Carregar estado do banco
    private async loadState(leadId: string): Promise<PresenceState> {
        if (!supabase) return this.getInitialState();

        try {
            const { data, error } = await supabase
                .from('lxc_presence_state')
                .select('*')
                .eq('lead_id', leadId)
                .single();

            if (error || !data) return this.getInitialState();

            return {
                relationshipDepth: data.relationship_depth,
                trustLevel: data.trust_level,
                lastInteraction: new Date(data.last_interaction),
                emotionalTrajectory: Array.isArray(data.emotional_trajectory) ? data.emotional_trajectory : [],
                communicationPrefs: {
                    formalityLevel: 0.5,
                    emojiUsage: 0.5,
                    responseLength: 'medium',
                    detectedGeneration: data.detected_generation || 'unknown' // Campo novo (precisa de migração no banco se for persistir)
                }
            };
        } catch (e) {
            console.error('[Presence] Error loading state:', e);
            return this.getInitialState();
        }
    }

    private getInitialState(): PresenceState {
        return {
            relationshipDepth: 0,
            trustLevel: 0.3,
            lastInteraction: new Date(),
            emotionalTrajectory: [],
            emotionalTrajectory: [],
            communicationPrefs: {
                formalityLevel: 0.5,
                emojiUsage: 0.5,
                responseLength: 'medium',
                detectedGeneration: 'unknown'
            }
        };
    }

    // Processar interação completa
    async processInteraction(sessionId: string, message: Message, externalHistory?: Message[]): Promise<{
        emotion: EmotionalState;
        subtextInsights: SubtextAnalysis;
        relevantMemories: MemoryEntry[];
        timing: { delayMs: number; typingIndicator: boolean; preResponse: string | null };
        relationshipState: PresenceState;
        legacyMode: boolean; // Flag para o Chat API
    }> {
        // leadId é necessário (vamos tentar extrair do session ou default)
        // Nota: Idealmente sessionId seria mapeado para leadId antes
        // Aqui assumimos que quem chama já resolveu o leadId ou estamos criando um temporário
        const leadId = await this.resolveLeadId(sessionId);
        if (!leadId) {
            console.warn('[Presence] No lead ID found for session', sessionId);
            return this.getFallbackResponse();
        }

        // 1. Carregar Estado
        let relationshipState = await this.loadState(leadId);
        this.presenceState.set(leadId, relationshipState);

        // 2. Carregar Memórias
        if (supabase) {
            const { data: memories } = await supabase
                .from('lxc_memories')
                .select('*')
                .eq('lead_id', leadId)
                .eq('is_active', true);

            if (memories) {
                const mappedMemories = memories.map((m: any) => ({
                    id: m.id,
                    type: m.memory_type as MemoryType,
                    content: m.content,
                    emotionalWeight: m.emotional_weight,
                    timestamp: new Date(m.created_at),
                    contextSnapshot: m.context_snapshot || {},
                    lastAccessed: new Date(m.last_accessed),
                    accessCount: m.access_count,
                    decayRate: m.decay_rate
                }));
                this.memoryStore.set(leadId, mappedMemories);
            }
        }

        // Injetar histórico externo
        if (externalHistory) {
            this.conversationHistory.set(leadId, [...externalHistory]);
        }

        // Atualizar histórico local
        this.updateHistory(leadId, message);
        const history = this.conversationHistory.get(leadId) || [];

        // Detectar emoção
        const emotion = detectEmotion(message.content, history);

        // Analisar subtexto
        const subtextInsights = this.analyzeSubtext(history);

        // Buscar memórias relevantes
        const relevantMemories = this.getRelevantMemories(leadId, { emotion, topics: message.topics || [] });

        // Detectar Geração (se ainda não detectado ou para recalibrar)
        const currentGeneration = detectGeneration(message.content);
        if (relationshipState.communicationPrefs.detectedGeneration === 'unknown' ||
            (relationshipState.communicationPrefs.detectedGeneration === 'modern' && currentGeneration === 'legacy')) {
            relationshipState.communicationPrefs.detectedGeneration = currentGeneration;
        }

        // Calcular timing
        const timing = this.calculateTiming(emotion, message.content.length);

        // Atualizar estado de presença (memória + banco)
        await this.updatePresenceState(leadId, emotion, subtextInsights);

        // Reload state to get updated values
        relationshipState = this.presenceState.get(leadId)!;

        // Persistir log de subtexto
        if (subtextInsights.confidence > 0.5 && supabase) {
            await supabase.from('lxc_subtext_logs').insert({
                session_id: sessionId,
                lead_id: leadId,
                pattern_name: subtextInsights.detectedPatterns[0]?.pattern || 'unknown',
                confidence: subtextInsights.confidence,
                meanings: subtextInsights.detectedPatterns[0]?.meanings || [],
                actions_taken: subtextInsights.actionRecommendations,
                severity: subtextInsights.detectedPatterns[0]?.severity || 1,
                outcome: 'neutral'
            });
        }

        return {
            emotion,
            subtextInsights,
            relevantMemories,
            timing,
            relationshipState,
            legacyMode: relationshipState.communicationPrefs.detectedGeneration === 'legacy'
        };
    }

    private async resolveLeadId(sessionId: string): Promise<string | null> {
        if (!supabase) return 'temp_lead';
        // Tentar buscar lead pela sessão
        const { data } = await supabase
            .from('conversations')
            .select('lead_id')
            .eq('session_id', sessionId)
            .single();
        return data?.lead_id || null;
    }

    private getFallbackResponse() {
        return {
            emotion: EmotionalState.NEUTRAL,
            subtextInsights: { detectedPatterns: [], overallSentiment: 'neutral', confidence: 0, actionRecommendations: [] },
            relevantMemories: [],
            timing: { delayMs: 1000, typingIndicator: true, preResponse: null },
            relationshipState: this.getInitialState()
        };
    }

    private updateHistory(leadId: string, message: Message): void {
        if (!this.conversationHistory.has(leadId)) {
            this.conversationHistory.set(leadId, []);
        }
        const history = this.conversationHistory.get(leadId)!;
        history.push(message);
        // Manter apenas últimas 50 mensagens
        if (history.length > 50) {
            history.shift();
        }
    }

    private analyzeSubtext(history: Message[]): SubtextAnalysis {
        const detected: Array<{
            pattern: string;
            confidence: number;
            meanings: string[];
            actions: string[];
            severity: number;
        }> = [];

        for (const pattern of SUBTEXT_PATTERNS) {
            const confidence = pattern.detect(history);
            if (confidence > 0.5) {
                detected.push({
                    pattern: pattern.name,
                    confidence,
                    meanings: pattern.meanings,
                    actions: pattern.actions,
                    severity: pattern.severity
                });
            }
        }

        const maxConfidence = detected.length > 0 ? Math.max(...detected.map(d => d.confidence)) : 0;
        const overallSentiment = this.calculateOverallSentiment(detected);

        return {
            detectedPatterns: detected,
            overallSentiment,
            confidence: maxConfidence,
            actionRecommendations: this.synthesizeActions(detected)
        };
    }

    private calculateOverallSentiment(patterns: Array<{ severity: number; confidence: number }>): string {
        if (patterns.length === 0) return 'neutral';

        const weightedSeverity = patterns.reduce((sum, p) => sum + p.severity * p.confidence, 0) / patterns.length;

        if (weightedSeverity > 3.5) return 'concerning';
        if (weightedSeverity > 2.5) return 'cautious';
        return 'stable';
    }

    private synthesizeActions(patterns: Array<{ actions: string[]; severity: number }>): string[] {
        const allActions = patterns.flatMap(p => p.actions);
        return [...new Set(allActions)].slice(0, 3);
    }

    private getRelevantMemories(leadId: string, context: { emotion: EmotionalState; topics: string[] }): MemoryEntry[] {
        const memories = this.memoryStore.get(leadId) || [];

        return memories
            .filter(m => m.type === MemoryType.RELATIONAL || m.type === MemoryType.CONTEXTUAL)
            .map(m => ({
                memory: m,
                relevance: this.calculateRelevance(m, context)
            }))
            .filter(({ relevance }) => relevance > 0.3)
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 5)
            .map(({ memory }) => memory);
    }

    private calculateRelevance(memory: MemoryEntry, context: { emotion: EmotionalState; topics: string[] }): number {
        const now = new Date();
        const daysSince = (now.getTime() - memory.timestamp.getTime()) / (1000 * 60 * 60 * 24);
        const timeDecay = Math.max(0, 1 - (memory.decayRate * daysSince));

        const memoryTopics = (memory.contextSnapshot.topics as string[]) || [];
        const topicMatch = context.topics.filter(t => memoryTopics.includes(t)).length / Math.max(1, context.topics.length);

        const emotionalMatch = memory.contextSnapshot.emotion === context.emotion ? 0.3 : 0;

        return (timeDecay * 0.4) + (topicMatch * 0.3) + emotionalMatch + (memory.emotionalWeight * 0.2);
    }

    private calculateTiming(emotion: EmotionalState, messageLength: number): {
        delayMs: number;
        typingIndicator: boolean;
        preResponse: string | null;
    } {
        const config = TIMING_CONFIGS[emotion];
        const readingTime = messageLength * 30;
        const [minVar, maxVar] = config.varianceRange;
        const variance = minVar + Math.random() * (maxVar - minVar);

        const emotionalIntensity = [EmotionalState.VULNERABLE, EmotionalState.EXCITED].includes(emotion) ? 0.7 : 0.3;
        const emotionalFactor = 1 + (emotionalIntensity * 0.5);

        return {
            delayMs: Math.round((config.baseDelayMs + readingTime) * emotionalFactor * variance),
            typingIndicator: config.typingIndicator,
            preResponse: config.preResponse
        };
    }

    private async updatePresenceState(leadId: string, emotion: EmotionalState, subtext: SubtextAnalysis): Promise<void> {
        const state = this.presenceState.get(leadId)!;

        // Atualizar profundidade do relacionamento
        let depthDelta = 0;
        if ([EmotionalState.ENGAGED, EmotionalState.VULNERABLE].includes(emotion)) {
            depthDelta += 0.05;
        }
        if (subtext.overallSentiment === 'concerning') {
            depthDelta -= 0.03;
        }

        state.relationshipDepth = Math.min(1, Math.max(0, state.relationshipDepth + depthDelta));

        // Atualizar confiança
        if (emotion === EmotionalState.VULNERABLE) {
            state.trustLevel = Math.min(1, state.trustLevel + 0.1);
        }

        // Atualizar trajetória emocional
        state.emotionalTrajectory.push({
            timestamp: new Date(),
            emotion: emotion,
            intensity: subtext.confidence || 0.5
        });

        if (state.emotionalTrajectory.length > 10) {
            state.emotionalTrajectory.shift();
        }

        state.lastInteraction = new Date();
        this.presenceState.set(leadId, state);

        // PERSISTIR NO SUPABASE
        if (supabase) {
            try {
                // Atualizar trajetória via RPC ou update direto
                // Usando a função update_presence_state que criamos no SQL
                const { error } = await supabase.rpc('update_presence_state', {
                    p_lead_id: leadId,
                    p_emotion: emotion,
                    p_intensity: subtext.confidence || 0.5
                });

                if (error) {
                    // Fallback para update manual se RPC falhar
                    await supabase.from('lxc_presence_state').upsert({
                        lead_id: leadId,
                        relationship_depth: state.relationshipDepth,
                        trust_level: state.trustLevel,
                        last_interaction: state.lastInteraction.toISOString(),
                        emotional_trajectory: state.emotionalTrajectory
                    }, { onConflict: 'lead_id' });
                }
            } catch (e) {
                console.error('[Presence] Error persisting state:', e);
            }
        }
    }

    // Armazenar memória relacional
    async storeMemory(leadId: string, data: {
        type?: MemoryType;
        content: Record<string, unknown>;
        emotionalWeight: number;
        topics?: string[];
        emotion?: string;
    }): Promise<void> {
        const memory: MemoryEntry = {
            id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            type: data.type || MemoryType.RELATIONAL,
            content: data.content,
            emotionalWeight: data.emotionalWeight,
            timestamp: new Date(),
            contextSnapshot: {
                topics: data.topics || [],
                emotion: data.emotion || 'neutral',
                relationshipDepth: this.presenceState.get(leadId)?.relationshipDepth || 0
            },
            lastAccessed: new Date(),
            accessCount: 0,
            decayRate: 0.01
        };

        // Cache local
        if (!this.memoryStore.has(leadId)) {
            this.memoryStore.set(leadId, []);
        }
        this.memoryStore.get(leadId)!.push(memory);

        // PERSISTIR NO BANCO
        if (supabase) {
            try {
                await supabase.from('lxc_memories').insert({
                    lead_id: leadId,
                    memory_type: memory.type,
                    content: memory.content,
                    emotional_weight: memory.emotionalWeight,
                    context_snapshot: memory.contextSnapshot,
                    is_active: true
                });
            } catch (e) {
                console.error('[Presence] Failed to persist memory:', e);
            }
        }
    }

    // Gerar abertura relacional
    generateRelationalOpening(leadId: string): string | null {
        const state = this.presenceState.get(leadId);
        if (!state || state.relationshipDepth < 0.3) return null;

        const memories = this.memoryStore.get(leadId) || [];

        // Priorizar vulnerabilidade compartilhada
        const vulnerability = memories.find(m =>
            m.content.type === 'vulnerabilidade_compartilhada' &&
            m.content.followUpNeeded
        );
        if (vulnerability && state.relationshipDepth >= 0.5) {
            return vulnerability.content.appropriateOpening as string;
        }

        // Conquista recente
        const achievement = memories.find(m => m.content.type === 'conquista');
        if (achievement) {
            return `E aí, como está aquele projeto que você tinha mencionado?`;
        }

        return null;
    }
}

// ============================================
// TYPES EXPORT
// ============================================

export interface SubtextAnalysis {
    detectedPatterns: Array<{
        pattern: string;
        confidence: number;
        meanings: string[];
        actions: string[];
        severity: number;
    }>;
    overallSentiment: string;
    confidence: number;
    actionRecommendations: string[];
}
