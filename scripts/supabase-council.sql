-- ============================================
-- LXC COUNCIL - GOVERNANÇA E EVOLUÇÃO
-- ============================================
-- 1. Logs das Auditorias (Nível Tático - Por Conversa)
CREATE TABLE IF NOT EXISTS lxc_council_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    consensus TEXT,
    score INTEGER,
    opinions JSONB,
    -- O que cada agente falou individualmente
    action_items TEXT [] -- Lista de ações sugeridas
);
CREATE INDEX IF NOT EXISTS idx_council_logs_lead ON lxc_council_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_council_logs_date ON lxc_council_logs(created_at);
-- 2. Diretrizes Estratégicas Diárias (Nível Estratégico - Global)
-- Onde o Visionary escreve as "Leis" para o dia seguinte
CREATE TABLE IF NOT EXISTS lxc_daily_directives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    valid_date DATE DEFAULT CURRENT_DATE,
    -- Análise do dia anterior
    yesterday_learnings TEXT,
    -- "Ontem perdemos vendas por agressividade"
    -- Ordens para hoje
    global_focus TEXT,
    -- "Focar em empatia extrema"
    tone_modifier TEXT,
    -- Instruções para injetar no Prompt do Agente
    risk_tolerance VARCHAR(20) DEFAULT 'balanced',
    -- low, balanced, high
    approved_by VARCHAR(50) DEFAULT 'The Visionary'
);
CREATE INDEX IF NOT EXISTS idx_daily_directives_date ON lxc_daily_directives(valid_date);
-- Função para pegar a diretriz ativa mais recente
CREATE OR REPLACE FUNCTION get_active_directive() RETURNS TABLE (global_focus TEXT, tone_modifier TEXT) AS $$ BEGIN RETURN QUERY
SELECT dd.global_focus,
    dd.tone_modifier
FROM lxc_daily_directives dd
WHERE dd.valid_date = CURRENT_DATE
ORDER BY dd.created_at DESC
LIMIT 1;
END;
$$ LANGUAGE plpgsql;