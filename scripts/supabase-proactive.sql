-- ============================================
-- PRESENCE CORE - PROACTIVE INITIATIVES SCHEMA
-- ============================================
CREATE TABLE IF NOT EXISTS lxc_proactive_initiatives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    trigger_type VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    priority INTEGER DEFAULT 0,
    context JSONB DEFAULT '{}'::JSONB
);
CREATE INDEX IF NOT EXISTS idx_lxc_proactive_lead ON lxc_proactive_initiatives(lead_id);
CREATE INDEX IF NOT EXISTS idx_lxc_proactive_trigger ON lxc_proactive_initiatives(trigger_type);