-- HARDENING V1 (P0 CORRECTIONS - AUDITORIA)
-- 1. Tabela para Dedupe de Inbound (P0-1)
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    meta_message_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT DEFAULT 'pending',
    -- pending, processing, processed, failed, ignored
    received_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    error_log TEXT,
    UNIQUE(tenant_id, meta_message_id) -- A chave da Idempotência
);
-- Índices para busca rápida no dedupe
CREATE INDEX idx_webhook_dedupe ON webhook_events(tenant_id, meta_message_id);
-- 2. Tabela de Fila de Processamento (P0-3 Queue)
-- O Webhook insere aqui e morre. O Worker consome daqui.
CREATE TABLE IF NOT EXISTS message_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_event_id UUID REFERENCES webhook_events(id),
    tenant_id UUID REFERENCES tenants(id),
    conversation_id UUID,
    -- NULL se for mensagem nova
    priority INT DEFAULT 0,
    -- 0 normal, 1 high (alertas)
    status TEXT DEFAULT 'queued',
    -- queued, locked, completed, failed
    attempts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    locked_at TIMESTAMPTZ -- Para P0-2 (Race Condition Lock)
);
-- Índice para o Worker pegar tarefas (Fila FIFO por prioridade)
CREATE INDEX idx_queue_fetch ON message_queue(status, priority DESC, created_at ASC);
-- 3. Tabela de Locks de Conversa (P0-2 Race Condition)
CREATE TABLE IF NOT EXISTS conversation_locks (
    conversation_id UUID PRIMARY KEY,
    -- O ID da conversa (phone number)
    locked_until TIMESTAMPTZ NOT NULL,
    worker_id TEXT -- Quem está processando
);
-- 4. Tabela "Outbox" para Envio Seguro (P1-4 Preparação)
CREATE TABLE IF NOT EXISTS outbox_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_id UUID REFERENCES message_queue(id),
    -- Origem do job
    tenant_id UUID REFERENCES tenants(id),
    whatsapp_payload JSONB NOT NULL,
    status TEXT DEFAULT 'pending',
    -- pending, sent, delivered, read, failed
    sent_at TIMESTAMPTZ,
    meta_response JSONB,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 5. Função de "Claim Job" (Atomic Lock para o Worker)
-- O Worker chama isso para pegar o próximo job e travar ele atomicamente.
CREATE OR REPLACE FUNCTION claim_next_job(worker_name TEXT) RETURNS TABLE (
        job_id UUID,
        job_payload JSONB,
        job_tenant_id UUID
    ) AS $$ BEGIN RETURN QUERY
UPDATE message_queue
SET status = 'locked',
    locked_at = NOW(),
    attempts = attempts + 1
WHERE id = (
        SELECT id
        FROM message_queue
        WHERE status = 'queued'
        ORDER BY priority DESC,
            created_at ASC FOR
        UPDATE SKIP LOCKED
        LIMIT 1
    )
RETURNING id,
    (
        SELECT payload
        FROM webhook_events
        WHERE id = message_queue.webhook_event_id
    ),
    tenant_id;
END;
$$ LANGUAGE plpgsql;