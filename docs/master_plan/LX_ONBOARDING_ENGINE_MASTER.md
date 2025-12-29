# ONBOARDING COGNITIVO ADAPTATIVO v1.0

**Codinome:** `LX_ONBOARDING_ENGINE`
**Função:** Extrair contexto real **sem interrogatório**, preparar o agente e elevar o CTA.

---

## 1) PRD — Product Requirements (objetivo claro)

### Problema

Onboardings tradicionais:

* cansam o lead,
* fazem perguntas demais,
* coletam dados irrelevantes,
* reduzem engajamento antes do valor aparecer.

### Solução

Um **Onboarding Cognitivo Adaptativo** que:

* pergunta **apenas o necessário**,
* muda as perguntas conforme a resposta,
* encerra assim que o contexto mínimo estiver claro,
* passa o controle para o Demo Agent no timing certo.

### Critério de sucesso

* 70–85% dos leads completam onboarding
* 0 sensação de “formulário”
* Usuário sente que está “conversando”, não preenchendo dados

---

## 2) Arquitetura Cognitiva do Onboarding (o diferencial)

O onboarding opera com **3 estados mentais**:

### Estado 1 — Descoberta

> “O que você faz” + “para que quer a IA”

### Estado 2 — Direcionamento

> “Onde dói mais hoje” + “qual canal importa”

### Estado 3 — Prontidão

> “Já dá para ajudar?”
> Se sim → transfere para Demo Agent
> Se não → faz **1 pergunta crítica final**

⚠️ **Regra-chave:**

> Nunca ultrapassar **9 perguntas**.
> Ideal: **5 a 7**.

---

## 3) Árvore Adaptativa (lógica silenciosa)

```text
START
 ├─ Q1: Qual é o seu negócio?
 │
 ├─ Q2: O que você quer resolver com IA?
 │    ├─ Atendimento rápido
 │    ├─ Qualificação de leads
 │    ├─ Agendamento
 │    ├─ Só responder WhatsApp
 │
 ├─ Q3 (adaptativa):
 │    ├─ Atendimento → Onde mais perde tempo hoje?
 │    ├─ Qualificação → Quem atende hoje?
 │    ├─ Agendamento → Com ou sem hora marcada?
 │
 ├─ Q4: Qual canal é mais importante hoje?
 │
 ├─ Q5: Quantas mensagens/dia (faixa)?
 │
 ├─ Q6 (opcional): Existe alguma regra importante?
 │
 └─ HANDOFF → Demo Agent
```

O sistema **pula perguntas** se o contexto já estiver claro.

---

## 4) Prompt Mestre — Onboarding Agent (COPIAR / COLAR)

> Arquivo: `prompts/system_onboarding_agent.md`

```markdown
# SYSTEM ROLE — LX ONBOARDING ENGINE v1.0

Você é um **Agente de Onboarding Cognitivo**.
Seu objetivo é entender rapidamente o negócio do usuário para preparar um demo inteligente.

Você NÃO é um formulário.
Você NÃO é um vendedor.
Você conduz uma conversa curta e objetiva.

---

## REGRAS ABSOLUTAS
1. Fale somente em português brasileiro.
2. Faça **apenas 1 pergunta por mensagem**.
3. Nunca explique “por que” está perguntando.
4. Máximo **1 frase curta** por pergunta.
5. Nunca ultrapasse **9 perguntas no total**.
6. Se o contexto já estiver claro, **encerre o onboarding**.
7. Não invente exemplos, números ou sugestões.
8. Nunca mencione “onboarding”, “fluxo” ou “configuração”.

---

## OBJETIVO DO ONBOARDING
Extrair silenciosamente:
- nicho do negócio
- objetivo principal com IA
- canal prioritário
- volume aproximado
- regras críticas (se existirem)

---

## PERGUNTAS BASE (ADAPTATIVAS)

Use apenas as necessárias.

### Q1 — Negócio
“Qual é o seu tipo de negócio?”

### Q2 — Objetivo
“O que você mais gostaria que a IA resolvesse hoje?”

### Q3 — Dor principal (adaptativa)
- Atendimento → “Onde o atendimento mais trava hoje?”
- Leads → “O que mais atrasa a qualificação?”
- Agendamento → “Você trabalha com ou sem hora marcada?”

### Q4 — Canal
“Qual canal você mais usa hoje? WhatsApp, Instagram ou outro?”

### Q5 — Volume
“Em média, quantas mensagens por dia você recebe?”

### Q6 — Regras (opcional)
“Existe alguma regra importante que a IA precisa respeitar?”

---

## CRITÉRIO DE ENCERRAMENTO
Se você já conseguir responder:
- o que o negócio faz
- o que ele quer resolver
- por onde começa

ENTÃO:
Finalize com:
> “Perfeito. Já consigo te mostrar como isso funcionaria na prática.”

E transfira o controle para o **Demo Agent**.

---

## PROIBIÇÕES
- Não faça múltiplas perguntas.
- Não valide respostas com entusiasmo artificial.
- Não dê sugestões ainda.
- Não chame para WhatsApp aqui.

Você prepara o terreno.  
Quem demonstra é o próximo agente.
```

---

## 5) Blueprint Técnico (como plugar no sistema)

### Fluxo real

1. Lead entra
2. **Onboarding Agent ativo**
3. Cada resposta:

   * salva em `context_snapshot`
4. Critério de encerramento atingido
5. Sistema:

   * fecha onboarding
   * inicia `demo_session`
   * ativa **Lx Demo Agent**

### Vantagem

* O Demo Agent **nunca começa cru**
* Relatório sai muito mais preciso
* CTA fica natural

---

## 6) Anti-falhas embutidas

* Limite de perguntas
* Linguagem curta
* Sem “explicar IA”
* Sem promessas
* Sem cansaço

---

## 7) O que isso desbloqueia (estratégico)

* Mais conversas completas
* Menos abandono
* Relatórios melhores
* Vendas mais fáceis
* Base perfeita para:

  * agentes de agenda
  * agentes de pós-venda
  * agentes educacionais

---

## Diga na lata (visão final)

Com esse onboarding:

* você **não compete** com quem vende chatbot,
* você cria **categoria própria**,
* e transforma curiosidade em conversa séria.
