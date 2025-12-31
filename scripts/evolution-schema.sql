-- ============================================
-- EVOLUTION API SCHEMA UPDATE
-- ============================================
-- Adiciona suporte a Evolution API (QR Code) na tabela tenants
-- ============================================
-- Adicionar colunas para Evolution API
ALTER TABLE tenants
ADD COLUMN IF NOT EXISTS evolution_instance TEXT,
    ADD COLUMN IF NOT EXISTS evolution_connected BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS evolution_qrcode TEXT,
    ADD COLUMN IF NOT EXISTS evolution_last_check TIMESTAMPTZ;
-- Índice para buscar por instância
CREATE INDEX IF NOT EXISTS idx_tenants_evolution_instance ON tenants (evolution_instance)
WHERE evolution_instance IS NOT NULL;
-- Comentários
COMMENT ON COLUMN tenants.evolution_instance IS 'Nome da instância no Evolution API';
COMMENT ON COLUMN tenants.evolution_connected IS 'Se o WhatsApp está conectado via Evolution';
COMMENT ON COLUMN tenants.evolution_qrcode IS 'QR Code base64 para conexão';
COMMENT ON COLUMN tenants.evolution_last_check IS 'Última verificação de status';