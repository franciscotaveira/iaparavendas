-- ============================================
-- LUX LEARNING ENGINE - DATABASE SCHEMA v1.0
-- ============================================
-- Este schema suporta aprendizado contínuo real
-- ============================================
-- 1. LEADS: Cada pessoa que interage com o sistema
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT,
    -- ID do WhatsApp, etc
    niche TEXT,
    goal TEXT,
    channel TEXT,
    volume_estimate TEXT,
    rules TEXT,
    quality_score DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- 2. CONVERSATIONS: Cada sessão de conversa
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    session_id TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    -- active, completed, abandoned
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    total_messages INTEGER DEFAULT 0,
    outcome TEXT,
    -- converted, not_converted, handoff
    conversion_score DECIMAL(5, 2)
);
-- 3. MESSAGES: Cada mensagem individual
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    role TEXT NOT NULL,
    -- user, assistant, system
    content TEXT NOT NULL,
    intent_detected TEXT,
    confidence_score DECIMAL(5, 2),
    response_time_ms INTEGER,
    was_fallback BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
-- 4. PATTERNS: Padrões aprendidos (o coração do aprendizado)
CREATE TABLE IF NOT EXISTS learned_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_type TEXT NOT NULL,
    -- objection, buying_signal, pain_point, exit_intent
    trigger_phrase TEXT NOT NULL,
    -- frase que dispara o padrão
    recommended_response TEXT,
    -- resposta que funcionou
    niche TEXT,
    -- em qual nicho funciona
    success_rate DECIMAL(5, 2) DEFAULT 50.0,
    times_used INTEGER DEFAULT 0,
    times_successful INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- 5. TRAINING_RUNS: Histórico de ciclos de treinamento
CREATE TABLE IF NOT EXISTS training_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_type TEXT NOT NULL,
    -- manual, scheduled, continuous
    conversations_analyzed INTEGER DEFAULT 0,
    patterns_extracted INTEGER DEFAULT 0,
    synthetic_cases_generated INTEGER DEFAULT 0,
    avg_score_before DECIMAL(5, 2),
    avg_score_after DECIMAL(5, 2),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    status TEXT DEFAULT 'running' -- running, completed, failed
);
-- 6. SYNTHETIC_CASES: Casos sintéticos gerados para treinamento
CREATE TABLE IF NOT EXISTS synthetic_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    training_run_id UUID REFERENCES training_runs(id),
    source_pattern_id UUID REFERENCES learned_patterns(id),
    niche TEXT,
    simulated_user_message TEXT,
    ideal_agent_response TEXT,
    difficulty_level TEXT,
    -- easy, medium, hard
    created_at TIMESTAMP DEFAULT NOW()
);
-- 7. KNOWLEDGE_BASE: Base de conhecimento estruturada
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    -- product, pricing, policy, faq, objection_handler
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    niche TEXT,
    -- null = applies to all
    priority INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- 8. AGENT_PERFORMANCE: Métricas de performance dos agentes
CREATE TABLE IF NOT EXISTS agent_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    agent_type TEXT NOT NULL,
    -- onboarding, demo, conversion
    total_conversations INTEGER DEFAULT 0,
    completed_conversations INTEGER DEFAULT 0,
    avg_response_time_ms INTEGER,
    avg_confidence_score DECIMAL(5, 2),
    conversion_rate DECIMAL(5, 2),
    fallback_rate DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT NOW()
);
-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_lead ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_patterns_niche ON learned_patterns(niche);
CREATE INDEX IF NOT EXISTS idx_patterns_type ON learned_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_kb_category ON knowledge_base(category);
-- VIEW: Dashboard Summary
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT (
        SELECT COUNT(*)
        FROM conversations
    ) as total_conversations,
    (
        SELECT COUNT(*)
        FROM leads
    ) as total_leads,
    (
        SELECT COUNT(*)
        FROM learned_patterns
    ) as total_patterns,
    (
        SELECT AVG(conversion_score)
        FROM conversations
        WHERE conversion_score IS NOT NULL
    ) as avg_conversion_score,
    (
        SELECT COUNT(*)
        FROM conversations
        WHERE outcome = 'converted'
    ) as total_converted,
    (
        SELECT COUNT(*)
        FROM training_runs
        WHERE status = 'completed'
    ) as training_runs_completed;