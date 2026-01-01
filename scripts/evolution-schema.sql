-- Tabela de Agentes (Cérebros Mutáveis)
CREATE TABLE IF NOT EXISTS agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role TEXT UNIQUE NOT NULL,
    -- ex: 'sdr', 'closer'
    name TEXT NOT NULL,
    current_version INT DEFAULT 1,
    system_prompt TEXT NOT NULL,
    -- O cérebro atual
    base_prompt TEXT NOT NULL,
    -- O backup original
    personality JSONB,
    -- Configurações de estilo
    memories JSONB DEFAULT '[]',
    -- Lições aprendidas (Knowledge Base acumulada)
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    last_evolution_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Tabela de Histórico de Evolução (Para podermos fazer rollback se a IA ficar burra)
CREATE TABLE IF NOT EXISTS agent_evolutions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID REFERENCES agents(id),
    version INT NOT NULL,
    diff_summary TEXT,
    -- O que mudou? ex: "Aprendeu a lidar com objeção de preço"
    previous_prompt TEXT,
    new_prompt TEXT,
    triggered_by_session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Habilitar RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_evolutions ENABLE ROW LEVEL SECURITY;
-- Políticas (Permissiva para devs/local)
CREATE POLICY "Enable read/write for all" ON agents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all" ON agent_evolutions FOR ALL USING (true) WITH CHECK (true);