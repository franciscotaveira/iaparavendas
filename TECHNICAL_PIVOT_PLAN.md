# LX AGENT FACTORY: PLANO DE PIVÔ TÉCNICO (V1)

**Data:** 30/12/2025
**Status:** APROVADO PELO AUDITOR
**Arquitetura Alvo:** Enterprise White-Glove (Meta Cloud API)

---

## 1. MUDANÇA DE INFRAESTRUTURA (Runtime)

### DE (Arquitetura Demo)

- N8N mockado ou WPPConnect (instável).
- Council rodando 37 agentes a cada mensagem (lento/caro).
- Memória emocional complexa (overkill).

### PARA (Arquitetura Enterprise)

- **Canal:** Meta Cloud API (Oficial).
- **Roteamento:** Webhook Único -> Resolve `phone_number_id` -> Carrega Tenant.
- **Cérebro:** Runtime Leve usando `CompiledAgentBundle` (Prompt Estático Otimizado).
- **Setup:** Processo "White-Glove" (Nós configuramos, cliente aprova).

---

## 2. COMPONENTES NOVOS (A construir)

### A. Factory Core (Offline/Async)

1. **Intake Service:** Formulário que gera o JSON inicial do `AgentSpec`.
2. **Compiler:** Script que pega o `AgentSpec` + Docs e cospe o `system_prompt` final.
3. **Version Control:** Tabela `agent_versions` no Supabase. Nada vai para produção sem versão `v1.0.0`.

### B. Runtime Router (Online/Sync)

1. **Webhook Handler:** Recebe POST da Meta.
2. **Tenant Resolver:** Busca no Redis/Banco: "Quem é o dono do número +551199999999?".
3. **Bundle Loader:** Carrega o prompt compilado desse tenant.
4. **LLM Execution:** Roda 1 chamada simples (GPT-4o / Claude Haiku) com o prompt compilado.

---

## 3. CHECKLIST DE MIGRAÇÃO

### Fase 1: Fundação (Hoje)

- [x] Definir `AgentSpec` (Tipagem TypeScript).
- [ ] Criar tabela supabase `tenants` e `agent_versions`.
- [ ] Criar script `compiler.ts` (MVP que concatena strings).

### Fase 2: Conectividade (Amanhã)

- [ ] Criar endpoint `/api/webhooks/whatsapp` (Receptor Oficial Meta).
- [ ] Implementar verificação de assinatura (X-Hub-Signature).
- [ ] Testar com número de Sandbox da Meta.

### Fase 3: Operação (Semana que vem)

- [ ] Onboarding Manual da Haven (Primeiro Cliente White-Glove).
- [ ] Geração do Token Permanente.
- [ ] Deploy v1.0.0.

---

## 5. ROADMAP DE EXPANSÃO (UPSELL & MÓDULOS) V2

### A. Arquitetura Multi-Agente (SDR + Suporte)

A estrutura de banco já suporta (`agents` tabela).

- **Cenário:** Cliente quer 1 número para Vendas e 1 para Suporte.
- **Solução:** 2 Agents Specs diferentes associados ao mesmo Tenant.
- **Roteamento:** Pode ser por Menu Inicial ("Digite 1 para Vendas") ou por Números Diferentes.
- **Pricing:** Cobrança por Agente Ativo.

### B. Módulos de Integração (Plugins Pagos)

O `AgentSpec` terá campo `plugins` para ativar features premium:

1. **Google Calendar / Cal.com (Agendamento Real)**
    - Agent ganha ferramenta `check_availability` e `book_slot`.
    - Valor: +R$ Adicional/mês.
    - Requisito: Cliente conecta conta Google.

2. **Lembretes Ativos (Cron Jobs)**
    - Worker que roda a cada 10min.
    - Busca agendamentos futuros -> Dispara Template de Confirmação.
    - Valor: +R$ Adicional/mês.

3. **CRM Connector (Pipedrive/RD Station)**
    - Agent cria o deal automaticamente após qualificação.
    - Valor: +R$ Adicional/mês.

### C. Estratégia de Implementação

Não construir do zero. Usar N8N ou Make como "Backend de Ferramentas" no início, e o Agente apenas chama o Webhook do N8N.
Isso mantém o Core leve e a complexidade de integração isolada no N8N.

---

## 6. HARDENING & RISKS (AUDIT P0/P1)

### Objetivo

Transformar o runtime do WhatsApp (Meta Cloud API) de um fluxo síncrono e frágil para uma operação **assíncrona, idempotente e auditável**, com:

- Webhook **enqueue-only** (responde rápido)
- Processamento via **fila transacional** no Postgres (Supabase)
- **Idempotência** inbound/outbound (zero duplicidade)
- **Locks por conversa** (ordem e consistência)
- Fundamentos de **AgentOps** (versionamento, logs, rollback)

---

### Decisão de Arquitetura

**Escolha oficial:** Postgres DB Job Queue (Supabase) usando `FOR UPDATE SKIP LOCKED`.

- Velocidade: sem Redis/SQS no MVP
- Atomicidade: locking no banco
- Simplicidade: `npm run worker` como processador de fila
- Observabilidade: tudo rastreável no mesmo datastore

---

### Tabelas/Primitivos (Hardening Data Model)

**1) Inbound dedupe**

- `webhook_events`
  - `tenant_id`
  - `meta_message_id` (UNIQUE por tenant)
  - `payload`
  - `status` (pending/processed/failed/ignored)

**2) Job Queue**

- `message_queue`
  - `id`
  - `tenant_id`
  - `webhook_event_id`
  - `status` (queued/locked/completed/failed)
  - `attempts`
  - `locked_at`

**3) Conversation locks**

- `conversation_locks`
  - `conversation_id` (UNIQUE)
  - `locked_until`
  - `worker_id`

**4) Outbox (outbound idempotente)**

- `outbox_messages`
  - `tenant_id`
  - `queue_id`
  - `whatsapp_payload`
  - `status` (pending/sent/delivered/failed)
  - `sent_at`

**5) AgentOps**

- `agent_versions` imutável (compiled_bundle congelado)
- `audit_events` para: duplicidade, policy hits, falhas Meta, troca de versão, locks

---

### Novo Fluxo Runtime (Meta)

**Webhook (/api/webhooks/whatsapp) — Enqueue-only**

1) Validar assinatura
2) Extrair `metadata.phone_number_id`
3) Resolver `tenant_id` via Supabase
4) Dedupe inbound: inserir `meta_message_id` (se conflito -> drop + audit)
5) Enfileirar job em `webhook_events` -> `message_queue`
6) Responder HTTP 200 em < 300ms

**Worker (Node) — Processor**

1) Buscar próximo job com `FOR UPDATE SKIP LOCKED` (`claim_next_job`)
2) Adquirir lock por conversa (TTL)
3) Carregar `agent_version is_active`
4) Montar contexto (summaries + últimas mensagens)
5) Rodar inferência (compiled bundle)
6) Aplicar policy engine mínimo (Sentinel)
7) Enfileirar outbound em `outbox_messages` (idempotente)
8) Registrar logs + métricas + audit events
9) Liberar lock / concluir job

---

### Regras Meta 24h (P1 já planejado)

- Antes de enviar mensagem: checar `last_customer_message_at`
- Se fora da janela: enviar via **template dispatcher** (quando templates estiverem aprovados)
- Se template indisponível: bloquear envio e registrar `audit_events`

---

### Definition of Done — Hardening V1 (Auditoria)

Hardening V1 só é considerado concluído quando:

- Inbound dedupe (meta_message_id) impede respostas duplicadas
- Webhook responde < 300ms e não faz inferência síncrona
- Locks por conversa garantem ordem em rajadas de mensagens
- Outbox garante idempotência no envio
- Logs registram: tenant_id, agent_version, meta ids, tokens, latency, policy hits
- Falha Meta gera retry com backoff e limite de tentativas

---

## 4. DEFINITION OF DONE (Setup R$ 5k)

O setup só é considerado "Entregue" quando:

1. Número oficial respondendo via API.
2. Agente versionado no banco (`v1.0.0`).
3. Teste de "Handoff" realizado com sucesso.
4. Cliente acessa dashboard e vê métricas básicas.
