# CONSTITUIÇÃO DA LX AGENT FACTORY OS

**Data de Homologação:** 30/12/2025
**Status:** Auditado e Aprovado

---

## 1. DECISÕES DE FUNDAÇÃO (IMUTÁVEIS)

Estas são as bases do modelo de negócio. Alterar isso exige nova auditoria.

### A. Modelo Operacional: White-glove

- **O que vendemos:** Infraestrutura + Serviço.
- **Setup:** R$ 5.000,00 (ancorado em infraestrutura real).
- **Execução:** O cliente aprova, nós operamos. O cliente NÃO acessa configurações técnicas.

### B. Canal & Arquitetura

- **Canal:** Meta Cloud API Oficial (Exclusivamente).
- **Isolamento:** 1 Tenant = 1 WABA (WhatsApp Business Account).
- **Risco:** O banimento de um cliente jamais afeta outro.

### C. Software: Factory OS

- **Runtime:** "Prompt Compilation" (Leve, Rápido, Seguro). Sem improviso em tempo real.
- **Council:** CI/CD Offline (Auditores Internos). Não rodam na frente do cliente.
- **Expansão:** Plugins (Age, CRM) via arquitetura V2.

### D. Produto

- Entregamos Agentes Versionados (`v1.0.0`, `v1.0.1`).
- Entregamos Governança (Monitoramento e Ajuste).
- Não vendemos "Chatbot", vendemos "Equipe Digital Gerenciada".

---

## 2. RESSALVAS OBRIGATÓRIAS (NON-NEGOTIABLES)

### R1. Selo de Verificação (Green Badge)

- **Regra:** JAMAIS prometer verificação em contrato.
- **Promessa:** Canal Oficial com nome e foto da marca. Verificação é consequência, não produto.

### R2. Versionamento é Lei

- Nenhum agente vai para o ar sem:
  - `agent_version` definida.
  - `compiled_bundle_hash` registrado.
  - Rollback testado (capacidade de voltar versão anterior em 1 min).

### R3. Segurança Multi-tenant

- Dados de clientes diferentes NUNCA se misturam.
- RLS (Row Level Security) obrigatório no Banco de Dados.
- Logs devem minimizar PII (Dados Pessoais Identificáveis).

---

## 3. DEFINITION OF DONE (D.O.D)

### Para Setup (O que libera os R$ 5k)

1. [ ] WABA + Número funcionando na Cloud API.
2. [ ] Templates críticos aprovados pela Meta.
3. [ ] `Agent Spec v1` + `Compiled Bundle v1` publicados.
4. [ ] Observabilidade ativa (Logs de latência e policy).
5. [ ] Handoff Humano testado e funcionando.

### Para Mensalidade (O que justifica a cobrança)

1. [ ] Ciclo mensal de revisão executado.
2. [ ] Relatório de performance enviado.
3. [ ] Incidentes resolvidos dentro do SLA.
4. [ ] Melhoria contínua (Ajustes de prompt/voz).

---

## 4. POSICIONAMENTO OFICIAL

*"LX Agent Factory OS é uma montadora de agentes para WhatsApp: nós projetamos, validamos e operamos agentes com identidade da marca do cliente, entregues em canal oficial (Meta Cloud API) com governança contínua, versionamento e auditabilidade."*
