-- FIX LOCKS SCHEMA (UUID -> TEXT)
BEGIN;
-- 1. Drop functions depending on the column type
DROP FUNCTION IF EXISTS acquire_conversation_lock(uuid, uuid, timestamptz, text);
DROP FUNCTION IF EXISTS release_conversation_lock(uuid, uuid, text);
-- 2. Alter table column type
ALTER TABLE conversation_locks
ALTER COLUMN conversation_id TYPE TEXT;
-- 3. Recreate functions with TEXT parameters
-- Acquire Lock
CREATE OR REPLACE FUNCTION acquire_conversation_lock(
        p_tenant_id UUID,
        p_conversation_id TEXT,
        -- Changed to TEXT
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
-- Release Lock
CREATE OR REPLACE FUNCTION release_conversation_lock(
        p_tenant_id UUID,
        p_conversation_id TEXT,
        -- Changed to TEXT
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
COMMIT;