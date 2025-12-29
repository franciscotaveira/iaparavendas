-- ============================================
-- LX HUMANIZED AGENTS OS - DATABASE SCHEMA v2.0
-- ============================================
-- Schema completo para Sprint 2: persistência + relatórios + eventos
-- ============================================
-- 1. LEADS: Cada pessoa que interage com o sistema
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT UNIQUE,
    -- ID do WhatsApp, telefone, etc
    name TEXT,
    phone TEXT,
    company TEXT,
    niche TEXT,
    goal TEXT,
    channel TEXT,
    pain TEXT,
    volume_estimate TEXT,
    rules TEXT,
    quality_score DECIMAL(5, 2) DEFAULT 0,
    objections_count INTEGER DEFAULT 0,
    last_objection TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- 2. CONVERSATIONS: Cada sessão de conversa
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE
    SET NULL,
        session_id TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'active',
        -- active, completed, abandoned
        entry_point TEXT DEFAULT 'landing',
        -- landing, ads, referral, direct
        niche_pack TEXT,
        -- servicos, saas, mercado_financeiro
        started_at TIMESTAMP DEFAULT NOW(),
        ended_at TIMESTAMP,
        total_messages INTEGER DEFAULT 0,
        outcome TEXT,
        -- converted, not_converted, handoff
        conversion_score DECIMAL(5, 2),
        context_snapshot JSONB -- snapshot do contexto extraído
);
-- 3. MESSAGES: Cada mensagem individual
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    -- user, assistant, system
    content TEXT NOT NULL,
    intent_detected TEXT,
    risk_level TEXT,
    -- low, medium, high, critical
    confidence_score DECIMAL(5, 2),
    response_time_ms INTEGER,
    was_fallback BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
-- 4. REPORTS: Relatórios de qualificação gerados
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE
    SET NULL,
        lead_id UUID REFERENCES leads(id) ON DELETE
    SET NULL,
        session_id TEXT,
        score_fit INTEGER,
        score_label TEXT,
        -- Baixo, Médio, Alto, Excelente
        qualification_level TEXT,
        -- Curioso, Interessado, Qualificado, Pronto para fechar
        priority TEXT,
        -- Baixa, Média, Alta
        recommended_package TEXT,
        -- Starter, Pro, Full
        estimated_value TEXT,
        insights_strengths TEXT [],
        insights_concerns TEXT [],
        insights_next_steps TEXT [],
        conversation_summary TEXT,
        niche_pack TEXT,
        report_data JSONB,
        -- dados completos do relatório
        created_at TIMESTAMP DEFAULT NOW()
);
-- 5. EVENTS: Tracking de eventos para analytics
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    event_type TEXT NOT NULL,
    event_data JSONB,
    source TEXT DEFAULT 'lx-demo-interface',
    created_at TIMESTAMP DEFAULT NOW()
);
-- 6. HANDOFFS: Registro de handoffs executados
CREATE TABLE IF NOT EXISTS handoffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    lead_id UUID REFERENCES leads(id) ON DELETE
    SET NULL,
        channel TEXT NOT NULL,
        -- manychat, calendly, whatsapp, human
        cta_type TEXT,
        -- calendly, whatsapp, human
        handoff_reason TEXT,
        payload JSONB,
        status TEXT DEFAULT 'pending',
        -- pending, sent, failed
        provider_response JSONB,
        created_at TIMESTAMP DEFAULT NOW()
);
-- 7. PATTERNS: Padrões aprendidos (do schema v1)
CREATE TABLE IF NOT EXISTS learned_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_type TEXT NOT NULL,
    -- objection, buying_signal, pain_point, exit_intent
    trigger_phrase TEXT NOT NULL,
    recommended_response TEXT,
    niche TEXT,
    success_rate DECIMAL(5, 2) DEFAULT 50.0,
    times_used INTEGER DEFAULT 0,
    times_successful INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- 8. TRAINING_RUNS: Histórico de ciclos de treinamento
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
-- 9. KNOWLEDGE_BASE: Base de conhecimento estruturada
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    -- product, pricing, policy, faq, objection_handler
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    niche TEXT,
    priority INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- 10. AGENT_PERFORMANCE: Métricas de performance
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
    handoff_rate DECIMAL(5, 2),
    avg_score_fit DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_lead ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_patterns_niche ON learned_patterns(niche);
CREATE INDEX IF NOT EXISTS idx_patterns_type ON learned_patterns(pattern_type);
CREATE INDEX IF NOT EXISTS idx_kb_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_session ON reports(session_id);
CREATE INDEX IF NOT EXISTS idx_handoffs_session ON handoffs(session_id);
CREATE INDEX IF NOT EXISTS idx_leads_external_id ON leads(external_id);
CREATE INDEX IF NOT EXISTS idx_leads_niche ON leads(niche);
-- ============================================
-- VIEWS for Dashboard
-- ============================================
-- Dashboard Summary
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
        FROM reports
    ) as total_reports,
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
        FROM conversations
        WHERE outcome = 'handoff'
    ) as total_handoffs,
    (
        SELECT COUNT(*)
        FROM training_runs
        WHERE status = 'completed'
    ) as training_runs_completed;
-- Recent Conversations View
CREATE OR REPLACE VIEW recent_conversations AS
SELECT c.id,
    c.session_id,
    c.status,
    c.outcome,
    c.conversion_score,
    c.total_messages,
    c.started_at,
    c.ended_at,
    c.niche_pack,
    l.name as lead_name,
    l.company as lead_company,
    l.niche as lead_niche,
    l.goal as lead_goal
FROM conversations c
    LEFT JOIN leads l ON c.lead_id = l.id
ORDER BY c.started_at DESC
LIMIT 100;
-- Daily Metrics View
CREATE OR REPLACE VIEW daily_metrics AS
SELECT DATE(started_at) as date,
    COUNT(*) as total_conversations,
    COUNT(
        CASE
            WHEN outcome = 'converted' THEN 1
        END
    ) as converted,
    COUNT(
        CASE
            WHEN outcome = 'handoff' THEN 1
        END
    ) as handoffs,
    AVG(conversion_score) as avg_score,
    AVG(total_messages) as avg_messages
FROM conversations
WHERE started_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(started_at)
ORDER BY date DESC;
-- Niche Performance View
CREATE OR REPLACE VIEW niche_performance AS
SELECT niche_pack as niche,
    COUNT(*) as total_conversations,
    COUNT(
        CASE
            WHEN outcome = 'converted' THEN 1
        END
    ) as converted,
    ROUND(
        COUNT(
            CASE
                WHEN outcome = 'converted' THEN 1
            END
        )::DECIMAL / NULLIF(COUNT(*), 0) * 100,
        2
    ) as conversion_rate,
    AVG(conversion_score) as avg_score,
    AVG(total_messages) as avg_messages
FROM conversations
WHERE niche_pack IS NOT NULL
GROUP BY niche_pack
ORDER BY total_conversations DESC;
-- ============================================
-- FUNCTIONS
-- ============================================
-- Function to update lead updated_at on changes
CREATE OR REPLACE FUNCTION update_lead_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger for leads
DROP TRIGGER IF EXISTS trigger_update_lead_timestamp ON leads;
CREATE TRIGGER trigger_update_lead_timestamp BEFORE
UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_lead_timestamp();
-- Function to increment conversation message count
CREATE OR REPLACE FUNCTION increment_message_count() RETURNS TRIGGER AS $$ BEGIN
UPDATE conversations
SET total_messages = total_messages + 1
WHERE id = NEW.conversation_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger for messages
DROP TRIGGER IF EXISTS trigger_increment_message_count ON messages;
CREATE TRIGGER trigger_increment_message_count
AFTER
INSERT ON messages FOR EACH ROW EXECUTE FUNCTION increment_message_count();
-- ============================================
-- SEED DATA (opcional)
-- ============================================
-- Niche packs knowledge
INSERT INTO knowledge_base (category, key, value, niche, priority)
VALUES (
        'niche_pack',
        'servicos',
        'Pack para prestadores de serviços diversos',
        'servicos',
        1
    ),
    (
        'niche_pack',
        'saas',
        'Pack para empresas de software SaaS',
        'saas',
        1
    ),
    (
        'niche_pack',
        'mercado_financeiro',
        'Pack para mercado financeiro com modo risco',
        'mercado_financeiro',
        1
    ) ON CONFLICT DO NOTHING;
-- Common objections
INSERT INTO learned_patterns (
        pattern_type,
        trigger_phrase,
        recommended_response,
        niche,
        success_rate
    )
VALUES (
        'objection',
        'caro',
        'Entendi "caro". Pra você, valor pesa mais em preço, resultado ou prazo?',
        NULL,
        75.0
    ),
    (
        'objection',
        'sem tempo',
        'Sem problema. Quer que eu te envie um resumo no WhatsApp e você vê depois?',
        NULL,
        70.0
    ),
    (
        'objection',
        'vou pensar',
        'Perfeito. Você está pensando por dúvida técnica ou por prioridade/tempo?',
        NULL,
        65.0
    ),
    (
        'objection',
        'já tenho',
        'O que você gosta no que usa hoje, e o que te incomoda de verdade?',
        'saas',
        72.0
    ) ON CONFLICT DO NOTHING;