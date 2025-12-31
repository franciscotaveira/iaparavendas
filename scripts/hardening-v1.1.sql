-- HARDENING V1.1 (SQL CORRIGIDO v2 - SINTAXE PLPGSQL)
-- Auditoria de Execução - P0 Resolution
-- Autor: LX Factory Engineering
BEGIN;
-- =========================================================
-- 1) webhook_events (Inbound Dedupe Reforçado)
-- =========================================================
ALTER TABLE webhook_events
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS last_error TEXT;
CREATE INDEX IF NOT EXISTS webhook_events_tenant_status_created_idx ON webhook_events (tenant_id, status, created_at DESC);
-- =========================================================
-- 2) message_queue (Job Queue Contrato Completo)
-- =========================================================
ALTER TABLE message_queue
ADD COLUMN IF NOT EXISTS job_type TEXT NOT NULL DEFAULT 'INBOUND_PROCESS',
    ADD COLUMN IF NOT EXISTS run_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS locked_by TEXT,
    ADD COLUMN IF NOT EXISTS attempts INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS max_attempts INT NOT NULL DEFAULT 5,
    ADD COLUMN IF NOT EXISTS last_error TEXT,
    ADD COLUMN IF NOT EXISTS payload JSONB;
CREATE INDEX IF NOT EXISTS message_queue_dequeue_idx ON message_queue (status, run_at, priority DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS message_queue_tenant_conversation_idx ON message_queue (tenant_id, conversation_id, created_at DESC);
-- =========================================================
-- 3) conversation_locks (Concurrency - Multi-tenant Fix)
-- =========================================================
ALTER TABLE conversation_locks
ADD COLUMN IF NOT EXISTS tenant_id UUID;
-- Backfill de tenant_id com cast
UPDATE conversation_locks cl
SET tenant_id = mq.tenant_id
FROM (
        SELECT conversation_id,
            MAX(tenant_id::text)::uuid AS tenant_id
        FROM message_queue
        GROUP BY conversation_id
    ) mq
WHERE cl.conversation_id = mq.conversation_id
    AND cl.tenant_id IS NULL;
-- Ajuste de PK para Composta
DO $$ BEGIN IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'conversation_locks_pkey'
) THEN
ALTER TABLE conversation_locks DROP CONSTRAINT conversation_locks_pkey;
END IF;
END $$;
ALTER TABLE conversation_locks
ADD PRIMARY KEY (tenant_id, conversation_id);
CREATE INDEX IF NOT EXISTS conversation_locks_until_idx ON conversation_locks (locked_until);
-- =========================================================
-- 4) outbox_messages (Outbox Idempotency Completo)
-- =========================================================
ALTER TABLE outbox_messages
ADD COLUMN IF NOT EXISTS conversation_id UUID,
    ADD COLUMN IF NOT EXISTS client_message_id TEXT,
    ADD COLUMN IF NOT EXISTS run_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS locked_by TEXT,
    ADD COLUMN IF NOT EXISTS attempts INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS max_attempts INT NOT NULL DEFAULT 5,
    ADD COLUMN IF NOT EXISTS last_error TEXT,
    ADD COLUMN IF NOT EXISTS meta_message_id TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS outbox_messages_tenant_client_msg_uidx ON outbox_messages (tenant_id, client_message_id)
WHERE client_message_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS outbox_messages_dequeue_idx ON outbox_messages (status, run_at, created_at ASC);
-- Trigger Updated At
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_outbox_updated_at'
) THEN CREATE TRIGGER trg_outbox_updated_at BEFORE
UPDATE ON outbox_messages FOR EACH ROW EXECUTE FUNCTION set_updated_at();
END IF;
END $$;
COMMIT;
-- =========================================================
-- RPCS (FUNCTIONS) - ATOMIC OPERATIONS
-- =========================================================
-- 1. Dequeue Job (Inbound)
CREATE OR REPLACE FUNCTION dequeue_job(p_worker_id TEXT) RETURNS TABLE(job JSONB) LANGUAGE plpgsql AS $$
DECLARE v_job RECORD;
v_payload JSONB;
BEGIN WITH picked AS (
    SELECT id
    FROM message_queue
    WHERE status = 'queued'
        AND run_at <= now()
    ORDER BY priority DESC,
        created_at ASC FOR
    UPDATE SKIP LOCKED
    LIMIT 1
)
UPDATE message_queue mq
SET status = 'locked',
    locked_at = now(),
    locked_by = p_worker_id,
    attempts = mq.attempts + 1
WHERE mq.id IN (
        SELECT id
        FROM picked
    )
RETURNING mq.* INTO v_job;
IF NOT FOUND THEN RETURN;
END IF;
IF v_job.payload IS NOT NULL THEN v_payload := v_job.payload;
ELSE
SELECT we.payload INTO v_payload
FROM webhook_events we
WHERE we.id = v_job.webhook_event_id;
END IF;
job := to_jsonb(v_job) || jsonb_build_object('resolved_payload', v_payload);
RETURN NEXT;
END;
$$;
-- 2. Acquire Lock (Concurrency - Sintaxe Corrigida)
CREATE OR REPLACE FUNCTION acquire_conversation_lock(
        p_tenant_id UUID,
        p_conversation_id UUID,
        p_locked_until TIMESTAMPTZ,
        p_worker_id TEXT
    ) RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE v_count INT;
v_acquired BOOLEAN := FALSE;
BEGIN
INSERT INTO conversation_locks (
        tenant_id,
        conversation_id,
        locked_until,
        worker_id
    )
VALUES (
        p_tenant_id,
        p_conversation_id,
        p_locked_until,
        p_worker_id
    ) ON CONFLICT (tenant_id, conversation_id) DO
UPDATE
SET locked_until = EXCLUDED.locked_until,
    worker_id = EXCLUDED.worker_id
WHERE conversation_locks.locked_until < now()
    OR conversation_locks.worker_id = EXCLUDED.worker_id;
GET DIAGNOSTICS v_count = ROW_COUNT;
v_acquired := v_count > 0;
RETURN jsonb_build_object('acquired', v_acquired);
END;
$$;
-- 3. Release Lock (Concurrency - Sintaxe Corrigida)
CREATE OR REPLACE FUNCTION release_conversation_lock(
        p_tenant_id UUID,
        p_conversation_id UUID,
        p_worker_id TEXT
    ) RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE v_count INT;
v_released BOOLEAN := FALSE;
BEGIN
DELETE FROM conversation_locks
WHERE tenant_id = p_tenant_id
    AND conversation_id = p_conversation_id
    AND worker_id = p_worker_id;
GET DIAGNOSTICS v_count = ROW_COUNT;
v_released := v_count > 0;
RETURN jsonb_build_object('released', v_released);
END;
$$;
-- 4. Dequeue Outbox (Enviar Mensagens)
CREATE OR REPLACE FUNCTION dequeue_outbox(p_worker_id TEXT) RETURNS TABLE(message JSONB) LANGUAGE plpgsql AS $$
DECLARE v_msg RECORD;
BEGIN WITH picked AS (
    SELECT id
    FROM outbox_messages
    WHERE status = 'queued'
        AND run_at <= now()
    ORDER BY created_at ASC FOR
    UPDATE SKIP LOCKED
    LIMIT 1
)
UPDATE outbox_messages om
SET status = 'sending',
    locked_at = now(),
    locked_by = p_worker_id,
    attempts = om.attempts + 1
WHERE om.id IN (
        SELECT id
        FROM picked
    )
RETURNING om.* INTO v_msg;
IF NOT FOUND THEN RETURN;
END IF;
message := to_jsonb(v_msg);
RETURN NEXT;
END;
$$;