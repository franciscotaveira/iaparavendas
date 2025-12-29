// ============================================
// Lx Humanized Agent Engine - Local LLM Support v1.0
// ============================================
// Motor de LLM Local (Ollama) para apoio aos modelos online
// Usa llama3 ou mistral como fallback inteligente
// ============================================

import { AgentContext, ClassificationResult, Intent, RiskLevel } from './types';

// ============================================
// CONFIGURAÇÃO
// ============================================
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const LOCAL_MODEL = process.env.LOCAL_MODEL || 'llama3';
const LOCAL_TIMEOUT_MS = 30000; // 30 segundos
const ONLINE_TIMEOUT_MS = 10000; // 10 segundos antes de tentar local

// ============================================
// TIPOS INTERNOS
// ============================================
interface LocalLLMResponse {
    text: string;
    source: 'local' | 'online' | 'fallback';
    latency_ms: number;
    model?: string;
    cached?: boolean;
}

interface CacheEntry {
    response: string;
    timestamp: number;
    intent?: Intent;
    ttl_ms: number;
}

// ============================================
// CACHE INTELIGENTE (In-Memory com TTL)
// ============================================
const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

function getCacheKey(message: string, context: string): string {
    // Normalizar para aumentar cache hits
    const normalizedMessage = message.toLowerCase().trim().slice(0, 100);
    const normalizedContext = context.slice(0, 50);
    return `${normalizedMessage}::${normalizedContext}`;
}

function getCachedResponse(message: string, context: string): string | null {
    const key = getCacheKey(message, context);
    const entry = responseCache.get(key);

    if (entry && Date.now() - entry.timestamp < entry.ttl_ms) {
        return entry.response;
    }

    // Limpar entrada expirada
    if (entry) {
        responseCache.delete(key);
    }

    return null;
}

function setCachedResponse(
    message: string,
    context: string,
    response: string,
    intent?: Intent,
    ttl_ms: number = CACHE_TTL_MS
): void {
    const key = getCacheKey(message, context);
    responseCache.set(key, {
        response,
        timestamp: Date.now(),
        intent,
        ttl_ms
    });

    // Limitar tamanho do cache
    if (responseCache.size > 1000) {
        const oldest = responseCache.keys().next().value;
        if (oldest) responseCache.delete(oldest);
    }
}

// ============================================
// VERIFICAÇÃO DE DISPONIBILIDADE OLLAMA
// ============================================
let ollamaAvailable: boolean | null = null;
let lastOllamaCheck = 0;
const OLLAMA_CHECK_INTERVAL = 60000; // Verificar a cada 1 minuto

export async function isOllamaAvailable(): Promise<boolean> {
    const now = Date.now();

    // Usar cache da verificação anterior
    if (ollamaAvailable !== null && now - lastOllamaCheck < OLLAMA_CHECK_INTERVAL) {
        return ollamaAvailable;
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json();
            // Verificar se o modelo desejado está disponível
            const models = data.models || [];
            const hasModel = models.some((m: any) =>
                m.name?.includes(LOCAL_MODEL) || m.name?.startsWith(LOCAL_MODEL)
            );

            ollamaAvailable = hasModel || models.length > 0;
            lastOllamaCheck = now;

            if (ollamaAvailable) {
                console.log(`[LocalLLM] Ollama disponível com ${models.length} modelo(s)`);
            }

            return ollamaAvailable === true;
        }
    } catch (error) {
        ollamaAvailable = false;
        lastOllamaCheck = now;
        console.log('[LocalLLM] Ollama não disponível:', (error as Error).message);
    }

    return false;
}

// ============================================
// PROMPTS OTIMIZADOS PARA LLM LOCAL
// ============================================
const LOCAL_SYSTEM_PROMPT = `Você é um assistente comercial humanizado da Lux.
Responda em português brasileiro, de forma breve e natural.

REGRAS:
1. Máximo 2 frases por resposta
2. Máximo 1 pergunta por mensagem
3. Nunca invente preços, prazos ou dados
4. Se não souber, diga que vai verificar
5. Tom: profissional mas amigável

PROIBIDO: "Claro!", "Com certeza!", "Perfeito!", saudações longas`;

const LOCAL_CLASSIFIER_PROMPT = `Classifique a mensagem em JSON com:
{
  "intent": "duvida|orcamento|agendamento|objecao|urgencia|outro",
  "risk": "baixo|medio|alto",
  "confidence": 0-100
}

Regras:
- "quanto custa/preço/valor" = orcamento
- "agendar/marcar/horário" = agendamento  
- "vou pensar/caro/depois" = objecao
- "humano/atendente/reclamar" = alto risco

Apenas JSON, sem explicação.`;

// ============================================
// CHAMADA LOCAL OLLAMA
// ============================================
export async function callLocalLLM(
    prompt: string,
    systemPrompt: string = LOCAL_SYSTEM_PROMPT,
    options: {
        temperature?: number;
        max_tokens?: number;
        format?: 'json' | 'text';
    } = {}
): Promise<string | null> {
    if (!(await isOllamaAvailable())) {
        return null;
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), LOCAL_TIMEOUT_MS);

        const requestBody = {
            model: LOCAL_MODEL,
            prompt: prompt,
            system: systemPrompt,
            stream: false,
            options: {
                temperature: options.temperature ?? 0.3,
                num_predict: options.max_tokens ?? 150,
            },
            format: options.format === 'json' ? 'json' : undefined
        };

        const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            console.error('[LocalLLM] Erro HTTP:', response.status);
            return null;
        }

        const data = await response.json();
        return data.response?.trim() || null;

    } catch (error) {
        console.error('[LocalLLM] Erro na chamada:', (error as Error).message);
        return null;
    }
}

// ============================================
// CLASSIFICAÇÃO LOCAL (RÁPIDA)
// ============================================
export async function classifyMessageLocally(
    context: AgentContext
): Promise<ClassificationResult | null> {
    const prompt = `Mensagem: "${context.message}"
Histórico: ${context.session.session_summary || 'Primeira interação'}

${LOCAL_CLASSIFIER_PROMPT}`;

    const result = await callLocalLLM(prompt, LOCAL_CLASSIFIER_PROMPT, {
        temperature: 0,
        max_tokens: 100,
        format: 'json'
    });

    if (!result) return null;

    try {
        const parsed = JSON.parse(result);
        return {
            intent: parsed.intent as Intent || 'outro',
            risk: parsed.risk as RiskLevel || 'baixo',
            confidence: parsed.confidence || 50,
            reasoning: 'Local LLM classification'
        };
    } catch {
        console.error('[LocalLLM] Erro ao parsear classificação');
        return null;
    }
}

// ============================================
// RESPOSTA LOCAL (BACKUP)
// ============================================
export async function generateResponseLocally(
    context: AgentContext
): Promise<LocalLLMResponse | null> {
    const startTime = Date.now();

    // Verificar cache primeiro
    const cached = getCachedResponse(
        context.message,
        context.session.current_intent
    );

    if (cached) {
        return {
            text: cached,
            source: 'local',
            latency_ms: Date.now() - startTime,
            model: 'cache',
            cached: true
        };
    }

    const prompt = `Contexto:
- Intenção: ${context.session.current_intent}
- Nome: ${context.session.lead_name || 'Não informado'}
- Nicho: ${context.session.lead_niche || 'Não informado'}
- Risco: ${context.session.risk_level}

Mensagem do lead: "${context.message}"

Responda de forma breve (máx 2 frases):`;

    const response = await callLocalLLM(prompt, LOCAL_SYSTEM_PROMPT, {
        temperature: 0.4,
        max_tokens: 150
    });

    if (!response) return null;

    // Cachear resposta bem-sucedida
    setCachedResponse(
        context.message,
        context.session.current_intent,
        response,
        context.session.current_intent
    );

    return {
        text: response,
        source: 'local',
        latency_ms: Date.now() - startTime,
        model: LOCAL_MODEL
    };
}

// ============================================
// HYBRID ROUTER - ESCOLHE ONLINE OU LOCAL
// ============================================
export interface HybridResponse {
    text: string;
    source: 'online' | 'local' | 'fallback';
    latency_ms: number;
    cost_saved?: boolean;
    model?: string;
}

export async function hybridGenerate(
    onlineGenerator: () => Promise<string>,
    context: AgentContext,
    options: {
        preferLocal?: boolean;
        onlineTimeoutMs?: number;
    } = {}
): Promise<HybridResponse> {
    const startTime = Date.now();
    const onlineTimeout = options.onlineTimeoutMs ?? ONLINE_TIMEOUT_MS;

    // Modo economia: tentar local primeiro se disponível
    if (options.preferLocal) {
        const localResponse = await generateResponseLocally(context);
        if (localResponse) {
            return {
                ...localResponse,
                cost_saved: true
            };
        }
    }

    // Tentar online com timeout
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), onlineTimeout);

        const onlineResult = await Promise.race([
            onlineGenerator(),
            new Promise<null>((resolve) => {
                setTimeout(() => resolve(null), onlineTimeout);
            })
        ]);

        clearTimeout(timeout);

        if (onlineResult) {
            return {
                text: onlineResult,
                source: 'online',
                latency_ms: Date.now() - startTime,
                model: 'claude-3.5-sonnet'
            };
        }
    } catch (error) {
        console.warn('[Hybrid] Online falhou, tentando local:', (error as Error).message);
    }

    // Fallback para local
    const localResponse = await generateResponseLocally(context);
    if (localResponse) {
        return {
            ...localResponse,
            cost_saved: true
        };
    }

    // Último fallback: resposta estática inteligente
    return {
        text: getSmartFallback(context),
        source: 'fallback',
        latency_ms: Date.now() - startTime
    };
}

// ============================================
// FALLBACK ESTÁTICO INTELIGENTE
// ============================================
function getSmartFallback(context: AgentContext): string {
    const { session, message } = context;
    const lower = message.toLowerCase();

    // Baseado na intenção detectada
    switch (session.current_intent) {
        case 'orcamento':
            return 'Sobre valores, depende do escopo. Posso te passar mais detalhes se você me contar um pouco do seu caso.';

        case 'agendamento':
            return 'Consigo te ajudar a agendar. Qual horário funciona melhor pra você?';

        case 'objecao':
            if (/caro|preço|valor/.test(lower)) {
                return 'Entendo a preocupação com investimento. Quer que eu detalhe o que está incluído?';
            }
            if (/tempo|depois|pensar/.test(lower)) {
                return 'Sem problema. Posso te enviar um resumo por escrito?';
            }
            return 'Entendi. O que você precisa saber pra se sentir mais seguro?';

        case 'urgencia':
            return 'Entendi que é urgente. Vou priorizar sua questão.';

        case 'duvida':
            return 'Boa pergunta. Pode me dar mais contexto pra eu te ajudar melhor?';

        default:
            return 'Entendi. Em que mais posso te ajudar?';
    }
}

// ============================================
// ECONOMIA DE CUSTOS - TRACKING
// ============================================
interface CostStats {
    online_calls: number;
    local_calls: number;
    fallback_calls: number;
    cache_hits: number;
    estimated_savings_usd: number;
}

let costStats: CostStats = {
    online_calls: 0,
    local_calls: 0,
    fallback_calls: 0,
    cache_hits: 0,
    estimated_savings_usd: 0
};

const COST_PER_ONLINE_CALL = 0.003; // ~$0.003 por chamada Claude 3.5 Sonnet

export function trackCost(source: 'online' | 'local' | 'fallback' | 'cache'): void {
    switch (source) {
        case 'online':
            costStats.online_calls++;
            break;
        case 'local':
            costStats.local_calls++;
            costStats.estimated_savings_usd += COST_PER_ONLINE_CALL;
            break;
        case 'cache':
            costStats.cache_hits++;
            costStats.estimated_savings_usd += COST_PER_ONLINE_CALL;
            break;
        case 'fallback':
            costStats.fallback_calls++;
            costStats.estimated_savings_usd += COST_PER_ONLINE_CALL;
            break;
    }
}

export function getCostStats(): CostStats {
    return { ...costStats };
}

export function resetCostStats(): void {
    costStats = {
        online_calls: 0,
        local_calls: 0,
        fallback_calls: 0,
        cache_hits: 0,
        estimated_savings_usd: 0
    };
}

// ============================================
// HEALTH CHECK
// ============================================
export async function getLocalLLMHealth(): Promise<{
    available: boolean;
    model: string;
    base_url: string;
    cache_size: number;
    cost_stats: CostStats;
}> {
    const available = await isOllamaAvailable();

    return {
        available,
        model: LOCAL_MODEL,
        base_url: OLLAMA_BASE_URL,
        cache_size: responseCache.size,
        cost_stats: getCostStats()
    };
}
