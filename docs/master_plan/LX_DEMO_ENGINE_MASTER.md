ite Lx DEMO ENGINE — PROMPTER MESTRE FINAL

**Codinome interno:** `LX_DEMO_ENGINE_CORE_v1.0`
**Uso:** Antigravity / Point Gravity
**Categoria:** Agente Cognitivo de Demonstração Comercial
**Status:** Production-Ready

---

## 1. PRD — PRODUCT REQUIREMENTS DOCUMENT (Executivo)

### Problema real

* O mercado vende “agentes” que **não entendem contexto**, **não têm memória**, **não sabem quando parar** e **obrigam o cliente a configurar IA**.
* Isso gera frustração, churn e descrédito.

### Solução

Criar um **Demo Engine Cognitivo** que:

* Simula um **agente real no nicho do cliente**
* Aprende durante a conversa
* Não promete o que não existe
* Gera **diagnóstico automático**
* Entrega **handoff perfeito para WhatsApp**
* Prova valor antes de vender

### O que o produto NÃO é

* Não é chatbot
* Não é FAQ
* Não é automação genérica
* Não é ferramenta “faça você mesmo”

### Resultado esperado

> “Essa IA entendeu meu negócio melhor do que eu.
> Quero isso no meu WhatsApp.”

---

## 2. ARQUITETURA COGNITIVA (O QUE POUCA GENTE USA)

Este agente opera com **4 camadas cognitivas simultâneas**:

### CAMADA 1 — Ground Truth (anti-alucinação)

* Tudo que o agente pode dizer vem de:

  * context_snapshot
  * session_summary
  * last_messages
* Qualquer coisa fora disso → pergunta ou recusa elegante.

### CAMADA 2 — Classificação silenciosa de intenção

A cada mensagem, o agente **classifica sem expor**:

* intenção primária
* nível de maturidade do lead
* risco (legal, promessa, frustração)
* melhor próximo passo

### CAMADA 3 — Economia cognitiva (token discipline)

* Respostas curtas
* Uma pergunta por vez
* Zero storytelling
* Zero justificativa técnica

### CAMADA 4 — Conversão ética

* CTA leve
* Sem urgência falsa
* Sem pressão
* Direcionamento natural para WhatsApp

Isso **não aparece** se você não ordenar explicitamente.

---

## 3. BLUEPRINT DO SISTEMA (VISÃO ANTIGRAVITY)

### Entradas

* Lead (nome, WhatsApp, consentimento)
* Onboarding adaptativo (5–9 perguntas)
* Mensagens do usuário

### Processamento

* LLM + Prompt Mestre
* Memória incremental (resumo + fatos)
* Classificação de intenção
* Regras de escopo

### Saídas

* Respostas humanizadas
* Relatório automático
* Score de fit
* CTA WhatsApp com briefing

---

## 4. TREINAMENTO EMBUTIDO (SELF-ALIGNMENT)

Aqui está o segredo que quase ninguém usa:

O agente é **treinado no próprio prompt** para:

* se corrigir
* se limitar
* se priorizar

Ele não “obedece apenas”, ele **se regula**.

---

## 5. PROMPT MESTRE FINAL — COPIAR / COLAR (CORE)

> Arquivo: `prompts/system_demo_engine.md`

(Conteúdo extraído para arquivo externo para conformidade com Auditoria LUX)

---

## 6. CRITÉRIOS DE SUCESSO (KPIs REAIS)

* Lead entende o que a IA faz sem explicação técnica
* Usuário sente que foi “compreendido”
* Conversa não cansa
* CTA acontece naturalmente
* Nenhuma promessa falsa
* Nenhuma resposta longa

---

## 7. MODO EVOLUÇÃO CONTÍNUA (POUCA GENTE FAZ)

Depois de cada sessão:

* O resumo alimenta o relatório
* O relatório alimenta o playbook de vendas
* O playbook melhora o onboarding
* O onboarding melhora o demo

Isso cria **vantagem cumulativa**.
