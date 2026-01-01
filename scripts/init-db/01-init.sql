-- Criação dos Bancos de Dados para cada Ferramenta da Nave
-- 1. Evolution API (WhatsApp)
CREATE DATABASE evolution;
-- 2. Listmonk (E-mail Marketing)
CREATE DATABASE listmonk;
-- 3. n8n (Automação Neural)
CREATE DATABASE n8n;
-- 4. LX Core (Dados da Empresa, Leads, Logs)
CREATE DATABASE lx_db;
-- Permissões (simplificado para container interno)
GRANT ALL PRIVILEGES ON DATABASE evolution TO postgres;
GRANT ALL PRIVILEGES ON DATABASE listmonk TO postgres;
GRANT ALL PRIVILEGES ON DATABASE n8n TO postgres;
GRANT ALL PRIVILEGES ON DATABASE lx_db TO postgres;