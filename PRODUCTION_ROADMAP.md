# PRODUCTION ROADMAP: LX AGENTS v1.0 (GO-LIVE)

**Status:** INICIADO
**Meta:** Transformar protótipo funcional em Produto SaaS Escalável.
**Última Atualização:** 2025-12-29 09:30

---

## 1. INFRAESTRUTURA & DADOS (Prioridade Alta)

- [ ] **Migração Supabase:**
  - [x] Configurar URL e Key no `.env.local`. ✅ FEITO
  - [ ] Executar `scripts/supabase-schema.sql` no SQL Editor do Supabase.
  - [ ] Desligar `mockAgents` e `mockMemory`.
  - [ ] Conectar Dashboard aos dados vivos.
- [ ] **Deploy Vercel:**
  - [ ] Configurar domínio `mycodingteam.com`.
  - [ ] Configurar variáveis de ambiente de produção.

---

## 2. AUDITORIA UI/UX (O "Polimento")

- [x] **Correção de Links (Erro 404):**
  - [ ] "Automações" -> Rota quebrada ou vazia.
  - [x] "Configurações" -> CRIADA (Em Construção).
  - [ ] "Memória Corp" -> Layout quebrado.
- [ ] **Harmonização Visual:**
  - [ ] Padronizar a paleta "Cyberpunk Clean" (remover cores soltas).
  - [ ] Melhorar contraste de leitura em dispositivos móveis.
- [ ] **Responsividade:**
  - [ ] Verificar Menu Hambúrguer no Mobile.
  - [ ] Verificar tabelas no Mobile.

---

## 3. TELEGRAM COMMAND CENTER (The "God Mode")

- [x] **Bot "Meu Sócio":**
  - [x] Criar endpoint `/api/hooks/telegram`. (FEITO)
  - [ ] Configurar Token do BotFather no `.env`.
  - [ ] Configurar Webhook no Telegram.
  - [ ] Comandos: `/status`, `/deploy`, `/fix [bug]`.
  - [ ] Suporte a Áudio (Transcrição Whisper).
  - [ ] Suporte a Imagem (Visão GPT-4o).

---

## 4. LANDING PAGE & COMUNICAÇÃO

- [ ] **Refatoração `mycodingteam.com`:**
  - [ ] Transformar em "Holding de IA".
  - [ ] Criar subdomínio/rota `demo` para o Simulador.
  - [ ] Copywriting focado em autoridade e tecnologia proprietária.

---

## 5. SISTEMA MULTI-AGENTE (Dispatcher Central)

- [x] **Dispatcher Central (`core/dispatcher-central.ts`):** (FEITO)
  - [x] Classificar comandos por categoria (Marketing, Sales, Ops, Dev).
  - [x] Rotear para o Agente correto.
- [ ] **Agente de Marketing:**
  - [ ] Gerar ideias de post para Instagram.
  - [ ] (Futuro) Integrar com API do Meta para postar direto.
- [ ] **Agente de Vendas (SDR):**
  - [ ] Enviar formulário de Briefing via WhatsApp.
  - [ ] Qualificar lead e calcular Score.
- [ ] **Agente de Operações:**
  - [ ] Coletar dados para contrato.
  - [ ] Gerar cobrança (boleto/PIX).

---

## 6. INTEGRAÇÕES EXTERNAS (APIs de Terceiros)

- [ ] **Asaas (Pagamentos):**
  - [ ] Criar endpoint `/api/integrations/asaas`.
  - [ ] Gerar Boleto/PIX via API.
  - [ ] Receber Webhook de confirmação de pagamento.
- [ ] **Clicksign / Autentique (Contratos):**
  - [ ] Criar endpoint `/api/integrations/contracts`.
  - [ ] Enviar contrato para assinatura digital.
  - [ ] Receber Webhook de assinatura concluída.
- [ ] **Instagram Graph API (Marketing):**
  - [ ] (Fase 2) Postar conteúdo gerado pelo Marketing Agent.

---

## CHECKLIST DE VALIDAÇÃO (DOER)

1. O usuário consegue se cadastrar? (Auth)
2. O usuário consegue conectar o WhatsApp dele? (Onboarding)
3. A IA responde rápido sem travar? (Performance)
4. O dinheiro cai na conta? (Asaas - Fase 2)
5. O contrato é assinado digitalmente? (Clicksign - Fase 2)
