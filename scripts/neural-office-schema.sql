-- ============================================
-- MY CODE TEAM - NEURAL OFFICE CORE
-- ============================================
-- Monitoramento em tempo real dos agentes e serviços
-- ============================================
CREATE TABLE IF NOT EXISTS service_heartbeats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id TEXT UNIQUE NOT NULL,
    -- Ex: 'worker-primary', 'n8n-main'
    service_name TEXT NOT NULL,
    -- Nome amigável no mapa
    service_type TEXT NOT NULL,
    -- 'worker', 'webhook', 'automation'
    status TEXT DEFAULT 'idle',
    -- 'idle', 'working', 'error'
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    current_task TEXT,
    -- O que está fazendo agora
    metadata JSONB DEFAULT '{}'::JSONB
);
-- Ativar Realtime para esta tabela
ALTER publication supabase_realtime
ADD TABLE service_heartbeats;
-- Função para atualizar batimento
CREATE OR REPLACE FUNCTION heartbeat_service(
        p_service_id TEXT,
        p_service_name TEXT,
        p_service_type TEXT,
        p_status TEXT,
        p_current_task TEXT DEFAULT NULL
    ) RETURNS VOID LANGUAGE plpgsql AS $$ BEGIN
INSERT INTO service_heartbeats (
        service_id,
        service_name,
        service_type,
        status,
        current_task,
        last_heartbeat
    )
VALUES (
        p_service_id,
        p_service_name,
        p_service_type,
        p_status,
        p_current_task,
        NOW()
    ) ON CONFLICT (service_id) DO
UPDATE
SET status = EXCLUDED.status,
    current_task = EXCLUDED.current_task,
    last_heartbeat = NOW();
END;
$$;