-- ============================================
-- PRESENCE CORE - SCHEMA DO BANCO
-- Tabelas para persistência da consciência
-- ============================================
-- Momentos compartilhados (memória relacional)
CREATE TABLE IF NOT EXISTS lxc_shared_moments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    session_id VARCHAR(100) NOT NULL,
    lead_id UUID,
    moment_type VARCHAR(50) NOT NULL,
    -- 'humor', 'vulnerability', 'achievement', 'struggle', 'preference', 'story'
    context TEXT NOT NULL,
    emotional_peak FLOAT DEFAULT 0.5,
    can_reference BOOLEAN DEFAULT false,
    appropriate_opening TEXT,
    follow_up_needed BOOLEAN DEFAULT false,
    -- Decaimento
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    access_count INTEGER DEFAULT 0,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_lxc_moments_lead ON lxc_shared_moments(lead_id);
CREATE INDEX IF NOT EXISTS idx_lxc_moments_type ON lxc_shared_moments(moment_type);
-- Preferências aprendidas do lead
CREATE TABLE IF NOT EXISTS lxc_lead_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID NOT NULL UNIQUE,
    inside_jokes TEXT [] DEFAULT '{}',
    stories_known TEXT [] DEFAULT '{}',
    makes_them_laugh TEXT [] DEFAULT '{}',
    to_avoid TEXT [] DEFAULT '{}',
    communication_style VARCHAR(50) DEFAULT 'balanced',
    -- 'formal', 'casual', 'balanced'
    formality_level FLOAT DEFAULT 0.5,
    emoji_usage FLOAT DEFAULT 0.5,
    response_length VARCHAR(20) DEFAULT 'medium',
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);
-- Estado de presença contínua
CREATE TABLE IF NOT EXISTS lxc_presence_state (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID NOT NULL UNIQUE,
    relationship_depth FLOAT DEFAULT 0 CHECK (
        relationship_depth >= 0
        AND relationship_depth <= 1
    ),
    trust_level FLOAT DEFAULT 0.3 CHECK (
        trust_level >= 0
        AND trust_level <= 1
    ),
    last_interaction TIMESTAMPTZ DEFAULT NOW(),
    emotional_trajectory JSONB DEFAULT '[]',
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);
-- Subtexto detectado (para analytics)
CREATE TABLE IF NOT EXISTS lxc_subtext_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    session_id VARCHAR(100) NOT NULL,
    lead_id UUID,
    pattern_name VARCHAR(100) NOT NULL,
    confidence FLOAT NOT NULL,
    meanings TEXT [],
    actions_taken TEXT [],
    severity INTEGER,
    outcome VARCHAR(50),
    -- 'positive', 'negative', 'neutral'
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_lxc_subtext_lead ON lxc_subtext_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_lxc_subtext_pattern ON lxc_subtext_logs(pattern_name);
-- Memórias relacionais persistentes
CREATE TABLE IF NOT EXISTS lxc_memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID NOT NULL,
    memory_type VARCHAR(50) NOT NULL,
    -- 'factual', 'relational', 'contextual', 'subtextual'
    content JSONB NOT NULL,
    emotional_weight FLOAT DEFAULT 0.5,
    context_snapshot JSONB DEFAULT '{}',
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    access_count INTEGER DEFAULT 0,
    decay_rate FLOAT DEFAULT 0.01,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_lxc_memories_lead ON lxc_memories(lead_id);
CREATE INDEX IF NOT EXISTS idx_lxc_memories_type ON lxc_memories(memory_type);
-- View para memórias relevantes
CREATE OR REPLACE VIEW lxc_relevant_memories AS
SELECT m.*,
    CASE
        WHEN m.memory_type = 'relational' THEN m.emotional_weight * 1.5
        WHEN m.memory_type = 'contextual' THEN m.emotional_weight * 1.2
        ELSE m.emotional_weight
    END * (
        1 - (
            m.decay_rate * EXTRACT(
                DAY
                FROM NOW() - m.created_at
            )
        )
    ) as relevance_score
FROM lxc_memories m
WHERE m.is_active = true
    AND (
        1 - (
            m.decay_rate * EXTRACT(
                DAY
                FROM NOW() - m.created_at
            )
        )
    ) > 0.3;
-- Função para atualizar acesso à memória
CREATE OR REPLACE FUNCTION touch_memory(p_memory_id UUID) RETURNS VOID AS $$ BEGIN
UPDATE lxc_memories
SET last_accessed = NOW(),
    access_count = access_count + 1
WHERE id = p_memory_id;
END;
$$ LANGUAGE plpgsql;
-- Função para atualizar estado de presença
CREATE OR REPLACE FUNCTION update_presence_state(
        p_lead_id UUID,
        p_emotion VARCHAR,
        p_intensity FLOAT
    ) RETURNS VOID AS $$
DECLARE v_trajectory JSONB;
BEGIN -- Buscar trajetória atual
SELECT emotional_trajectory INTO v_trajectory
FROM lxc_presence_state
WHERE lead_id = p_lead_id;
IF v_trajectory IS NULL THEN v_trajectory := '[]'::JSONB;
END IF;
-- Adicionar nova entrada
v_trajectory := v_trajectory || jsonb_build_object(
    'timestamp',
    NOW(),
    'emotion',
    p_emotion,
    'intensity',
    p_intensity
);
-- Manter apenas últimas 10
IF jsonb_array_length(v_trajectory) > 10 THEN v_trajectory := (
    SELECT jsonb_agg(elem)
    FROM (
            SELECT elem
            FROM jsonb_array_elements(v_trajectory) elem
            ORDER BY (elem->>'timestamp')::timestamptz DESC
            LIMIT 10
        ) sub
);
END IF;
-- Upsert
INSERT INTO lxc_presence_state (lead_id, emotional_trajectory, last_interaction)
VALUES (p_lead_id, v_trajectory, NOW()) ON CONFLICT (lead_id) DO
UPDATE
SET emotional_trajectory = EXCLUDED.emotional_trajectory,
    last_interaction = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;