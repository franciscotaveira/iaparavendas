-- ============================================
-- LX AGENT SYSTEM - CORPORATE MEMORY SCHEMA
-- ============================================
-- Execute isso no Supabase SQL Editor
-- Habilita vetorização e cria estruturas de memória
-- ============================================
-- 1. Habilitar a extensão de vetores (pgvector)
create extension if not exists vector;
-- 2. Tabela de Perfis/Leads (Dossiês Unificados)
create table if not exists leads (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    -- Identificação
    name text,
    email text unique,
    phone text unique,
    -- Contexto de Negócio
    company_name text,
    niche text,
    role text,
    -- Estado do Lead
    status text default 'new',
    -- new, qualified, customer, churned
    current_sentiment text,
    -- positive, neutral, negative
    -- Scoring
    lead_score integer default 0,
    -- Metadados flexíveis
    metadata jsonb default '{}'::jsonb
);
-- 3. Tabela de Sessões (Memória de Curto Prazo Persistida)
create table if not exists sessions (
    id text primary key,
    -- session_id gerado pelo frontend/zapier
    lead_id uuid references leads(id),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    channel text,
    -- whatsapp, web, telegram
    status text default 'active',
    -- Estado atual
    current_intent text,
    current_agent_role text,
    risk_level text,
    -- Resumo da conversa até agora (compactação)
    summary text
);
-- 4. Tabela de Mensagens (Log Bruto)
create table if not exists messages (
    id uuid primary key default gen_random_uuid(),
    session_id text references sessions(id),
    created_at timestamptz default now(),
    role text,
    -- user, agent, system
    agent_role text,
    -- qual agente falou (se role=agent)
    content text,
    -- Metadados da mensagem (tokens, latencia, tool calls)
    metadata jsonb default '{}'::jsonb
);
-- 5. Tabela de "Memória Semântica" (RAG - Knowledge Base)
-- Aqui guardamos documentos da empresa, PDFs, regras, decisões estratégicas
create table if not exists knowledge_docs (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    title text,
    content text,
    -- o texto cru
    category text,
    -- sales_playbook, technical_docs, pricing, strategy
    -- O VETOR MÁGICO (Embeddings)
    -- Usando 1536 dimensoes (padrao OpenAI ada-002 ou text-embedding-3-small)
    embedding vector(1536),
    metadata jsonb default '{}'::jsonb
);
-- 6. Função para buscar documentos similares (A Mágica do RAG)
create or replace function match_knowledge (
        query_embedding vector(1536),
        match_threshold float,
        match_count int
    ) returns table (
        id uuid,
        content text,
        category text,
        similarity float
    ) language plpgsql as $$ begin return query;
select knowledge_docs.id,
    knowledge_docs.content,
    knowledge_docs.category,
    1 - (knowledge_docs.embedding <=> query_embedding) as similarity
from knowledge_docs
where 1 - (knowledge_docs.embedding <=> query_embedding) > match_threshold
order by similarity desc
limit match_count;
end;
$$;
-- 7. Tabela de "Decisões de Projeto" (Memória da War Room)
create table if not exists project_decisions (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    project_name text,
    decision_title text,
    rationale text,
    agents_involved text [],
    -- ['ops_ceo', 'mkt_growth']
    approved_by text,
    status text default 'implemented'
);