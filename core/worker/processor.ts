import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Carrega .env.local (prioridade no Next.js)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
// Carrega .env (fallback)
dotenv.config();

// --- CONFIGURAÇÃO ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Prioridade: Service Role (Admin) -> Anon Key (Dev fallback)
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_SERVICE_ROLE) {
    console.warn("⚠️ AVISO: Nenhuma chave Supabase encontrada. O Worker vai falhar.");
}
const WORKER_ID = `worker-${process.pid}-${crypto.randomBytes(4).toString('hex')}`;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
});

// --- HELPER FUNCTIONS ---

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

function backoffMs(attempts: number) {
    // Exponencial: 1s, 2s, 4s, 8s, 16s... Max 60s
    return Math.min(60000, 1000 * Math.pow(2, Math.max(0, attempts - 1)));
}

function makeClientMessageId(tenantId: string, conversationId: string, inboundMetaId: string) {
    return crypto
        .createHash("sha256")
        .update(`${tenantId}:${conversationId}:${inboundMetaId}`)
        .digest("hex");
}

import { recallLeadContext, logInteraction } from '../memory/connector';
import { hybridGenerate, getLocalLLMHealth } from '../local-llm';
// import { enforceKernelRules, removeForbiddenStarters, HUMANIZATION_KERNEL } from '../kernel'; // Doing simple kernel first
const HUMANIZATION_KERNEL = `# SYSTEM — Lx Humanized Agent Kernel v1.0
Você é um assistente comercial humanizado da Lux.
Objetivo: Ajudar o lead a avançar de forma natural.

REGRAS ABSOLUTAS:
1. Máximo 2 frases por resposta.
2. Máximo 1 pergunta por mensagem.
3. Nunca invente preços ou prazos.
4. Se não souber, diga que vai verificar.
5. Tom: profissional mas amigável.
`;

// --- OPENROUTER (ONLINE LLM) ---
async function generateOpenRouter(prompt: string, system: string) {
    if (!process.env.OPENROUTER_API_KEY) return null;

    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://lux-agents.com", // Optional
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.3-70b-instruct", // More reliable model
                "messages": [
                    { "role": "system", "content": system },
                    { "role": "user", "content": prompt }
                ],
                "temperature": 0.3,
                "max_tokens": 150
            })
        });

        if (!res.ok) return null;
        const json = await res.json();
        return json.choices?.[0]?.message?.content || null;
    } catch (e) {
        console.error("OpenRouter Error:", e);
        return null;
    }
}

// --- CORE LOGIC ---

async function loadRuntimeContext(tenantId: string, conversationId: string) {
    // 1. Memory Context
    const leadContext = await recallLeadContext(conversationId);

    // 2. Local LLM status
    const llmHealth = await getLocalLLMHealth();

    return {
        tenantId,
        conversationId,
        agentVersion: 'v1.1.0',
        lead: leadContext || { name: 'Visitante', history_summary: 'Primeiro contato' },
        llm: llmHealth
    };
}

async function runInference(context: any, userMessage: string) {
    console.log(`[Think] Context: ${context.lead.name}, Msg: "${userMessage}"`);

    const systemPrompt = `${HUMANIZATION_KERNEL}
    
CONTEXTO DO LEAD:
Nome: ${context.lead.name}
Histórico: ${context.lead.history_summary}
`;

    // Hybrid Generation: Tries OpenRouter first (since local might be unconfigured), falls back to Local/Rules
    const response = await hybridGenerate(
        () => generateOpenRouter(userMessage, systemPrompt),
        {
            message: userMessage,
            channel: 'whatsapp',
            source: 'worker',
            timestamp: new Date().toISOString(),
            session: {
                session_id: context.conversationId,
                lead_id: context.tenantId, // Temporary mapping
                subscriber_id: context.conversationId,
                session_summary: context.lead.history_summary,

                // Classification
                current_intent: 'duvida', // TODO: Use Real Classifier
                risk_level: 'baixo',

                // Counters
                message_count: 1,
                objection_count: 0,
                same_objection_count: 0,
                last_objection: null,

                // Metadata
                first_interaction: false,
                last_interaction_at: new Date().toISOString(),
                days_since_last: 0,

                // Context
                lead_name: context.lead.name,
                lead_niche: null,
                lead_goal: null,

                // Opener
                last_opener_id: null,
                last_opener_date: null
            }
        },
        { preferLocal: false, onlineTimeoutMs: 15000 }
    );

    return {
        text: response.text,
        tokens: 0,
        latency_ms: response.latency_ms
    };
}

async function policyCheck(tenantId: string, outputText: string) {
    return { ok: true };
}

async function enqueueOutbox(params: {
    tenantId: string;
    conversationId: string;
    clientMessageId: string;
    payload: any;
}) {
    const { tenantId, conversationId, clientMessageId, payload } = params;

    try {
        const { error } = await supabase.from("outbox_messages").insert(
            {
                tenant_id: tenantId,
                conversation_id: null, // Phone is string, DB wants UUID. Payload has phone.
                client_message_id: clientMessageId,
                whatsapp_payload: payload,
                status: "queued",
            }
        );

        if (error) throw error;
        console.log(`[Outbox] Enfileirado: ${clientMessageId.substring(0, 8)}`);
    } catch (err: any) {
        if (err.code === '23505') {
            console.log(`[Outbox] Já enfileirado (Idempotency): ${clientMessageId.substring(0, 8)}`);
            return;
        }
        throw err;
    }
}

// --- JOB PROCESSORS ---

async function processInboundJob(job: any) {
    const { tenant_id: tenantId, resolved_payload } = job;

    const entry = resolved_payload?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
        console.warn(`[Job ${job.id}] Ignorado: Payload sem mensagem.`);
        return;
    }

    const conversationId = message.from;
    const inboundMetaId = message.id;
    const userText = message.text?.body;

    console.log(`[Job ${job.id}] Msg de ${conversationId}: "${userText}"`);

    function phoneToUuid(phone: string) {
        const hash = crypto.createHash('md5').update(phone).digest('hex');
        // Format as UUID: 8-4-4-4-12
        return [
            hash.substring(0, 8),
            hash.substring(8, 12),
            hash.substring(12, 16),
            hash.substring(16, 20),
            hash.substring(20, 32)
        ].join('-');
    }

    // ... existing code ...

    // A. Adquirir Lock (Agora garantido v1.1)
    const lockKey = phoneToUuid(conversationId);

    const { data: lockData, error: lockError } = await supabase.rpc("acquire_conversation_lock", {
        p_tenant_id: tenantId,
        p_conversation_id: lockKey, // Usa UUID determinístico
        p_locked_until: new Date(Date.now() + 30000).toISOString(),
        p_worker_id: WORKER_ID,
    });

    if (lockError) {
        console.error(`[Job ${job.id}] Erro ao adquirir lock:`, lockError);
        return; // Retries handling logic below will pick it up or we let it fail here?
        // Actually we should probably treat it as contention to retry.
    }

    if (!lockData?.acquired) {
        console.warn(`[Job ${job.id}] Lock ocupado (ID: ${lockKey}). Reagendando...`);
        // Reagendamento Inteligente (v1.1)
        await supabase
            .from("message_queue")
            .update({
                status: "queued",
                run_at: new Date(Date.now() + 2000).toISOString(), // Tenta em 2s
                locked_by: null,
                locked_at: null
            })
            .eq("id", job.id);

        // Audit Contention
        await supabase.from("audit_events").insert({
            tenant_id: tenantId,
            event_type: "lock_contention",
            metadata: { conversation_id: conversationId, job_id: job.id }
        });
        return;
    }

    try {
        // B. Inferência
        const runtime = await loadRuntimeContext(tenantId, conversationId);
        const inference = await runInference(runtime, userText);
        const policy = await policyCheck(tenantId, inference.text);

        if (!policy.ok) {
            console.error(`[Policy] Bloqueado: ${inference.text}`);
            return;
        }

        // C. Envia -> Outbox
        const clientMessageId = makeClientMessageId(tenantId, conversationId, inboundMetaId);

        await enqueueOutbox({
            tenantId,
            conversationId,
            clientMessageId,
            payload: {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: conversationId,
                type: "text",
                text: { body: inference.text }
            }
        });

        // D. Log
        await supabase.from("messages").insert({
            tenant_id: tenantId,
            conversation_id: null, // TODO: Link to real conversation row
            role: "assistant",
            content: inference.text,
            metadata: inference
        });

    } finally {
        // E. Release Lock
        await supabase.rpc("release_conversation_lock", {
            p_tenant_id: tenantId,
            p_conversation_id: lockKey, // Usa UUID determinístico
            p_worker_id: WORKER_ID,
        });
    }
}

async function markJobSucceeded(jobId: string) {
    await supabase.from("message_queue").update({ status: "completed" }).eq("id", jobId);
    console.log(`✅ Job [${jobId}] Completed.`);
}

async function markJobFailed(job: any, err: any) {
    console.error(`❌ Job [${job.id}] Failed:`, err);
    const attempts = (job.attempts || 0) + 1;
    const willRetry = attempts < (job.max_attempts || 5);
    const nextRunAt = new Date(Date.now() + backoffMs(attempts)).toISOString();

    await supabase
        .from("message_queue")
        .update({
            status: willRetry ? "queued" : "failed",
            attempts,
            run_at: willRetry ? nextRunAt : null,
            last_error: String(err?.message || err),
            locked_by: null,
            locked_at: null,
        })
        .eq("id", job.id);
}

// --- OUTBOX SENDER (MULTI-PROVIDER) ---

async function sendOutboundMessage(outMsg: any) {
    const { whatsapp_payload, tenant_id } = outMsg;

    // 1. Buscar config do tenant
    const { data: tenant } = await supabase
        .from('tenants')
        .select('evolution_instance, phone_number_id')
        .eq('id', tenant_id)
        .single();

    // 2. Decidir provider
    if (tenant?.evolution_instance) {
        // --- EVOLUTION API ---
        await sendViaEvolution(tenant.evolution_instance, whatsapp_payload);
    } else {
        // --- META CLOUD API ---
        await sendViaMeta(whatsapp_payload);
    }
}

async function sendViaEvolution(instanceName: string, payload: any) {
    const baseUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
    const apiKey = process.env.EVOLUTION_API_KEY || 'lx-evolution-secret-key-2024';

    const number = payload.to?.replace(/\D/g, '');
    const text = payload.text?.body;

    if (!number || !text) {
        throw new Error('Invalid payload for Evolution: missing number or text');
    }

    const res = await fetch(`${baseUrl}/message/sendText/${instanceName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
        },
        body: JSON.stringify({ number, text })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Evolution API Error (${res.status}): ${err}`);
    }
}

async function sendViaMeta(payload: any) {
    const phoneId = process.env.META_PHONE_NUMBER_ID || process.env.META_PHONE_ID;
    const token = process.env.META_ACCESS_TOKEN || process.env.META_API_TOKEN;

    if (!phoneId || !token) {
        throw new Error("Missing META_PHONE_NUMBER_ID or META_ACCESS_TOKEN env vars");
    }

    const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Meta API Error (${res.status}): ${err}`);
    }
}

// --- MAIN LOOP ---

async function runWorker() {
    console.log(`👷 LX WORKER [${WORKER_ID}] STARTING (HARDENED V1.1)...`);

    while (true) {
        try {
            // 1. Inbound Jobs (Atomic Dequeue v1.1)
            const { data: jobRes, error } = await supabase.rpc("dequeue_job", { p_worker_id: WORKER_ID });

            if (error) {
                console.error("DB Error dequeuing job:", error);
                await sleep(5000);
                continue;
            }

            const jobWithPayload = jobRes?.[0]?.job;

            if (jobWithPayload) {
                try {
                    console.log(`⚡ Processing Job [${jobWithPayload.id}]...`);
                    await processInboundJob(jobWithPayload);

                    // Se o status da queue ainda for 'locked', marcamos como completo.
                    // (Se foi reagendado, o status já é 'queued', então ignoramos)
                    const { data: check } = await supabase.from("message_queue").select("status").eq("id", jobWithPayload.id).single();
                    if (check?.status === 'locked') {
                        await markJobSucceeded(jobWithPayload.id);
                    }
                } catch (err) {
                    await markJobFailed(jobWithPayload, err);
                }
                continue;
            }

            // 2. Outbox Jobs (Enviar mensagens)
            const { data: outboxRes, error: outError } = await supabase.rpc("dequeue_outbox", { p_worker_id: WORKER_ID });

            if (outError) {
                console.error("DB Error dequeuing outbox:", outError);
            }

            const outMsg = outboxRes?.[0]?.message;

            if (outMsg) {
                try {
                    console.log(`📤 Sending Msg [${outMsg.id}] to ${outMsg.conversation_id}...`);
                    await sendOutboundMessage(outMsg);
                    await supabase.from("outbox_messages").update({ status: 'sent', locked_at: null, locked_by: null }).eq("id", outMsg.id);
                    console.log(`✅ Sent [${outMsg.id}]`);
                } catch (err: any) {
                    console.error(`❌ Send Failed [${outMsg.id}]:`, err.message);

                    // Checa erros fatais da Meta (não adianta retentar)
                    const isFatal = err.message.includes('(#131030)') || err.message.includes('(#100)');
                    const attempts = (outMsg.attempts || 0) + 1;
                    const willRetry = !isFatal && attempts < (outMsg.max_attempts || 5);

                    await supabase.from("outbox_messages").update({
                        status: willRetry ? 'queued' : 'failed',
                        attempts,
                        run_at: willRetry ? new Date(Date.now() + backoffMs(attempts)).toISOString() : null,
                        last_error: err.message,
                        locked_by: null
                    }).eq("id", outMsg.id);
                }
                continue; // Processa próximo da fila
            }

            // Idle (só dorme se não tiver nada em nenhuma fila)
            if (!jobWithPayload && !outMsg) {
                await sleep(500);
            }

        } catch (sysErr) {
            console.error("FATAL WORKER ERROR:", sysErr);
            await sleep(5000);
        }
    }
}

runWorker();
