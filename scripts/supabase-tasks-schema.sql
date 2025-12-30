-- ============================================
-- LX AGENTS - SCHEMA V2 (TAREFAS)
-- Execute no SQL Editor do Supabase
-- ============================================
-- TABELA DE TAREFAS (backlog do CEO)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    -- Dados da tarefa
    title TEXT NOT NULL,
    description TEXT,
    -- Status e prioridade
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending', 'in_progress', 'done', 'cancelled')
    ),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    -- Origem
    source TEXT DEFAULT 'system' CHECK (
        source IN ('telegram', 'dashboard', 'system', 'agent')
    ),
    -- Metadados
    assigned_agent TEXT,
    tags TEXT [],
    metadata JSONB DEFAULT '{}'::JSONB
);
-- Índices
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at);
-- Trigger para updated_at
DROP TRIGGER IF EXISTS trigger_tasks_updated_at ON tasks;
CREATE TRIGGER trigger_tasks_updated_at BEFORE
UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- ============================================
-- Após executar, verifique com:
-- SELECT * FROM tasks LIMIT 1;
-- ============================================