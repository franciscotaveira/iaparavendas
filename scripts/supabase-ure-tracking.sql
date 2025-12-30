-- ============================================
-- URE TRACKING TABLES
-- Execute após os seeds iniciais
-- ============================================
-- Entidades detectadas nas conversas
CREATE TABLE IF NOT EXISTS ure_detected_entities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    session_id VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_value TEXT NOT NULL,
    confidence FLOAT NOT NULL,
    original_text TEXT,
    resolved BOOLEAN DEFAULT false,
    resolved_id UUID
);
CREATE INDEX IF NOT EXISTS idx_ure_entities_session ON ure_detected_entities(session_id);
CREATE INDEX IF NOT EXISTS idx_ure_entities_type ON ure_detected_entities(entity_type);
-- Uso de rapport nas conversas
CREATE TABLE IF NOT EXISTS ure_rapport_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    used_at TIMESTAMPTZ DEFAULT NOW(),
    session_id VARCHAR(100) NOT NULL,
    knowledge_type VARCHAR(50) NOT NULL,
    knowledge_id UUID,
    content_used TEXT,
    hook_used TEXT,
    lead_reaction VARCHAR(50),
    reaction_indicators TEXT [],
    conversation_continued BOOLEAN,
    rapport_established BOOLEAN
);
CREATE INDEX IF NOT EXISTS idx_ure_usage_session ON ure_rapport_usage(session_id);
-- Função para incrementar uso
CREATE OR REPLACE FUNCTION increment_knowledge_usage(p_table TEXT, p_id UUID) RETURNS VOID AS $$ BEGIN IF p_table = 'geo_knowledge' THEN
UPDATE geo_knowledge
SET usage_count = usage_count + 1
WHERE id = p_id;
ELSIF p_table = 'professional_knowledge' THEN
UPDATE professional_knowledge
SET usage_count = usage_count + 1
WHERE id = p_id;
END IF;
END;
$$ LANGUAGE plpgsql;
-- View de analytics
CREATE OR REPLACE VIEW ure_analytics AS
SELECT date_trunc('day', detected_at) as day,
    entity_type,
    COUNT(*) as detections,
    AVG(confidence) as avg_confidence
FROM ure_detected_entities
WHERE detected_at > NOW() - INTERVAL '30 days'
GROUP BY date_trunc('day', detected_at),
    entity_type
ORDER BY day DESC;
-- View de top entities
CREATE OR REPLACE VIEW ure_top_entities AS
SELECT entity_type,
    entity_value,
    COUNT(*) as count
FROM ure_detected_entities
WHERE detected_at > NOW() - INTERVAL '30 days'
GROUP BY entity_type,
    entity_value
ORDER BY count DESC
LIMIT 50;