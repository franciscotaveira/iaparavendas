# CHECKLIST INTERNO: SETUP WHITE-GLOVE (LX FACTORY)

**Uso exclusivo da equipe de operações LX.**

---

## 0. Pré-check (Comercial → Operação)

- [ ] Contrato assinado + Escopo fechado (MVP).
- [ ] Tenant criado no sistema (`tenant_id`).
- [ ] Responsável do cliente definido (Matrix de contato).
- [ ] Cobrança Meta: Confirmado que será no cartão do cliente.

## 1. Partner Access (Meta Business Suite)

- [ ] Cliente possui BM (Business Manager) ativo?
- [ ] Convite de **Parceiro** enviado.
- [ ] Cliente aceitou convite.
- [ ] Acesso confirmado ao WhatsApp Manager.
- [ ] EVIDÊNCIA: Print salvo na pasta do cliente.

## 2. WABA + Número (Tenant Infrastructure)

- [ ] Número dedicado definido (Novo ou Migração).
- [ ] WABA (WhatsApp Business Account) criada/associada.
- [ ] Número registrado na Cloud API (Verificado PIN).
- [ ] **COLETAR E ARMAZENAR NO VAULT:**
  - [ ] `waba_id`
  - [ ] `phone_number_id`
  - [ ] System User Token (Escopo Mínimo).

## 3. Perfil e Identidade (Brand)

- [ ] Nome exibido (Display Name) aprovado.
- [ ] Foto de perfil (Alta resolução) configurada.
- [ ] Descrição Bio / Endereço / Site configurados.
- [ ] Mensagem de Saudação configurada (se houver).

## 4. Conectividade (Runtime)

- [ ] Endpoint Webhook Configurado (`/api/webhooks/whatsapp`).
- [ ] Token de Verificação Configurado.
- [ ] Teste Hello World: Enviar mensagem "Oi" -> Receber Echo.
- [ ] Teste de Idempotência (Mensagem duplicada não gera erro).

## 5. Agent Factory (Control Plane)

- [ ] Intake recebido e validado.
- [ ] Documentos processados (Knowledge Ingestion).
- [ ] `Agent Spec v1` gerado.
- [ ] `Compiled Bundle v1` gerado.
- [ ] **PUBLISH:** Versão `1.0.0` ativa no banco.

## 6. Templates (HSM)

- [ ] Templates Criados:
  - [ ] Confirmação de Agenda.
  - [ ] Follow-up 24h.
  - [ ] Reativação (Marketing).
- [ ] Submetidos para Aprovação Meta.
- [ ] Aprovados? (Se rejeitado, ajustar e reenviar).

## 7. Go-Live & Handover

- [ ] Teste End-to-End com cliente oculto.
- [ ] Handoff para humano testado (Link de Whats ou CRM).
- [ ] Monitoramento assistido (48h).
- [ ] Dashboard liberado para cliente.
