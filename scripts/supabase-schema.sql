-- ============================================
-- LX AGENTS - SCHEMA SUPABASE
-- Execute este script no SQL Editor do Supabase
-- ============================================
-- 1. TABELA DE LEADS
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Identificação
    name TEXT,
    email TEXT,
    phone TEXT,
    document TEXT,
    -- CPF/CNPJ
    -- Contexto
    niche TEXT,
    goal TEXT,
    channel TEXT,
    -- whatsapp, instagram, site
    source TEXT,
    -- orgânico, ads, indicação
    -- Qualificação
    score_fit INTEGER DEFAULT 0,
    -- 0-100
    intent TEXT,
    -- interesse, duvida, objecao, pronto_para_comprar
    risk_level TEXT DEFAULT 'baixo',
    -- baixo, medio, alto
    status TEXT DEFAULT 'new',
    -- new, qualified, nurturing, converted, lost
    -- Metadados
    tags TEXT [],
    custom_fields JSONB DEFAULT '{}'::JSONB
);
-- 2. TABELA DE CONVERSAS
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    platform TEXT,
    -- whatsapp, instagram, web_chat, telegram
    -- Status
    status TEXT DEFAULT 'active',
    -- active, closed, escalated
    agent_role TEXT,
    -- sdr, closer, support
    -- Métricas
    message_count INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0
);
-- 3. TABELA DE MENSAGENS
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    -- user, assistant, system
    content TEXT NOT NULL,
    -- Análise
    intent TEXT,
    sentiment TEXT,
    -- positive, neutral, negative
    -- Metadados
    metadata JSONB DEFAULT '{}'::JSONB
);
-- 4. TABELA DE CONTRATOS
CREATE TABLE IF NOT EXISTS contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID REFERENCES leads(id),
    -- Dados do Contrato
    external_id TEXT,
    -- ID no Clicksign/Autentique
    sign_url TEXT,
    value DECIMAL(10, 2),
    -- Status
    status TEXT DEFAULT 'pending',
    -- pending, signed, rejected, expired
    signed_at TIMESTAMPTZ,
    -- Documento
    document_url TEXT
);
-- 5. TABELA DE COBRANÇAS
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID REFERENCES leads(id),
    contract_id UUID REFERENCES contracts(id),
    -- Dados da Cobrança
    external_id TEXT,
    -- ID no Asaas
    billing_type TEXT,
    -- BOLETO, PIX, CREDIT_CARD
    value DECIMAL(10, 2),
    due_date DATE,
    -- Links
    invoice_url TEXT,
    pix_qrcode_url TEXT,
    boleto_url TEXT,
    -- Status
    status TEXT DEFAULT 'pending',
    -- pending, paid, overdue, cancelled
    paid_at TIMESTAMPTZ
);
-- 6. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_niche ON leads(niche);
CREATE INDEX IF NOT EXISTS idx_conversations_lead ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
-- 7. FUNÇÃO PARA ATUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Trigger para leads
DROP TRIGGER IF EXISTS trigger_leads_updated_at ON leads;
CREATE TRIGGER trigger_leads_updated_at BEFORE
UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- ============================================
-- Execute e depois vá para o Dashboard Supabase
-- para verificar se as tabelas foram criadas.
-- ============================================