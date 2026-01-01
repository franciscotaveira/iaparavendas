-- LUMAX Training Sessions Schema
-- Execute este script no Supabase SQL Editor
-- Tabela para armazenar sessões de treinamento
CREATE TABLE IF NOT EXISTS training_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    persona_type TEXT NOT NULL,
    scenario TEXT NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]',
    success BOOLEAN DEFAULT true,
    duration_ms INTEGER,
    rating INTEGER CHECK (
        rating >= 1
        AND rating <= 5
    ),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_training_persona ON training_sessions(persona_type);
CREATE INDEX IF NOT EXISTS idx_training_scenario ON training_sessions(scenario);
CREATE INDEX IF NOT EXISTS idx_training_created ON training_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_training_success ON training_sessions(success);
-- View para análise de treinamento
CREATE OR REPLACE VIEW training_analytics AS
SELECT persona_type,
    scenario,
    COUNT(*) as total_sessions,
    AVG(duration_ms) as avg_duration_ms,
    SUM(
        CASE
            WHEN success THEN 1
            ELSE 0
        END
    )::float / COUNT(*) * 100 as success_rate,
    AVG(rating) as avg_rating,
    MIN(created_at) as first_session,
    MAX(created_at) as last_session
FROM training_sessions
GROUP BY persona_type,
    scenario;
-- Função para obter métricas de treinamento
CREATE OR REPLACE FUNCTION get_training_metrics() RETURNS JSON AS $$
DECLARE result JSON;
BEGIN
SELECT json_build_object(
        'total_sessions',
        (
            SELECT COUNT(*)
            FROM training_sessions
        ),
        'sessions_today',
        (
            SELECT COUNT(*)
            FROM training_sessions
            WHERE created_at > NOW() - INTERVAL '24 hours'
        ),
        'avg_duration_ms',
        (
            SELECT COALESCE(AVG(duration_ms), 0)
            FROM training_sessions
        ),
        'success_rate',
        (
            SELECT COALESCE(
                    SUM(
                        CASE
                            WHEN success THEN 1
                            ELSE 0
                        END
                    )::float / NULLIF(COUNT(*), 0) * 100,
                    0
                )
            FROM training_sessions
        ),
        'personas_covered',
        (
            SELECT COUNT(DISTINCT persona_type)
            FROM training_sessions
        ),
        'scenarios_covered',
        (
            SELECT COUNT(DISTINCT scenario)
            FROM training_sessions
        )
    ) INTO result;
RETURN result;
END;
$$ LANGUAGE plpgsql;
-- Policies RLS (Row Level Security)
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
-- Policy para leitura (qualquer um autenticado pode ler)
CREATE POLICY "Allow read training_sessions" ON training_sessions FOR
SELECT USING (true);
-- Policy para inserção (qualquer um autenticado pode inserir)
CREATE POLICY "Allow insert training_sessions" ON training_sessions FOR
INSERT WITH CHECK (true);
-- Comentários para documentação
COMMENT ON TABLE training_sessions IS 'Armazena sessões de treinamento do simulador LUMAX';
COMMENT ON COLUMN training_sessions.persona_type IS 'Tipo de persona do paciente simulado';
COMMENT ON COLUMN training_sessions.scenario IS 'Cenário/especialidade simulada';
COMMENT ON COLUMN training_sessions.messages IS 'Array JSON das mensagens trocadas';
COMMENT ON COLUMN training_sessions.success IS 'Se a conversa foi concluída sem erros';
COMMENT ON COLUMN training_sessions.rating IS 'Avaliação manual da qualidade (1-5)';