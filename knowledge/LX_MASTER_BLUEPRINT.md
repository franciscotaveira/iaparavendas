# DOCUMENTO MESTRE — Lx Humanized Agents

**Escopo:** Aquisição → Demo → Venda → Implantação + MicroSaaS (Landing Demo) + Engine Principal (Factory)
**Runtime:** ManyChat (API) + WhatsApp | **Agenda:** Calendly fixo
**Princípio:** agente nasce da identidade da empresa (não de "prompt preenchível")
**Tese:** "humanização" é **política operacional**, não adjetivo

---

## 1) Mapa ponta-a-ponta do negócio (Aquisição → Demo → Venda → Implantação)

### 1.1 Aquisição (entrada de tráfego)

**Canais recomendados (prioridade):**

1. Ads (Meta/IG) com CTA direto para "Teste o agente em 2 minutos"
2. Orgânico (Reels/Provas) com link para Demo
3. Indicação (parcerias) com link trackeado por UTM

**Artefatos obrigatórios na landing:**

* Promessa objetiva: "Seu agente nasce do seu jeito. Sem script robótico."
* Micro Demo Engine embutido (chat + geração de mini-relatório)
* CTA único: "Receber relatório + agendar" (Calendly)

**KPI de aquisição:**

* CTR para Demo
* Taxa de início de conversa
* Taxa de conclusão da demo (geração de relatório)

---

### 1.2 Demo (degustação na landing)

**Objetivo:** provar diferencial em minutos, sem "setup" do cliente.

**O que a demo faz (em 90–180s):**

1. Coleta mínima (5–7 inputs) sobre a empresa (não sobre "o bot")
2. Simula conversa curta (3–6 turnos) com Humanization Kernel
3. Gera um "Mini Diagnóstico" (1 página) + "Próximo passo sugerido"
4. CTA: envio do relatório no WhatsApp + Calendly

**KPI de demo:**

* % que aceita receber relatório no WhatsApp
* % que clica no Calendly
* % que agenda

---

### 1.3 Venda (call curta e objetiva)

**Formato:** 15–25 min (não "sessão estratégica"; é fechamento técnico-comercial)

**Roteiro macro:**

1. Relembrar o que a demo detectou (intenção/objeção/padrão)
2. Explicar "por que é diferente" (política, memória, handoff, risco)
3. Mostrar "pacote de implantação" e o que é entregue em 7 dias
4. Fechar próximo passo: contrato + onboarding + início da implantação

**KPI de venda:**

* show rate
* close rate
* tempo até go-live

---

### 1.4 Implantação (onboarding e go-live)

**Fase 0 — Pré-onboarding (D+0):**

* coletar identidade da empresa (inputs mínimos)
* definir objetivo: leads / agendamento / triagem / suporte

**Fase 1 — Agent Factory (D+1 a D+3):**

* gerar agente: Kernel + Niche Pack + regras de risco + handoff
* publicar no ManyChat
* configurar Calendly fixo (link e regras)

**Fase 2 — Qualidade & governança (D+4 a D+6):**

* testes com 20 cenários (suite de conversas)
* ajustes de "política" (não "tom")
* ativar rate-limit e guardrails de custo

**Fase 3 — Go-live (D+7):**

* ativar tráfego
* monitorar painel (alertas, loops, handoffs)
* plano de otimização 14 dias

**KPI de implantação:**

* taxa de handoff
* taxa de agendamento
* taxa de reclamação/queda
* custo por conversa / lead

---

## 2) PRD completo (MicroSaaS + Engine Principal)

### 2.1 Produto A — MicroSaaS: "Lx Demo Engine"

**Persona:** visitante curioso (decisor ou influenciador)
**Job-to-be-done:** "quero saber se isso presta antes de falar com alguém"

**Funcionalidades MVP:**

* Chat embutido na landing (widget)
* Coleta mínima de identidade do negócio (5–7 perguntas)
* Simulação de conversa (3–6 turnos)
* Geração de mini-relatório (ID único, link compartilhável)
* Envio via WhatsApp + botão Calendly
* Captura de eventos (tracking)
* Anti-abuso (rate limiting)

**Regras do produto:**

* Respostas curtas (1–2 frases)
* Uma pergunta por vez
* Não inventa preço/prazo/garantia
* Handoff se fora do escopo

**Outputs:**

* `report_md` (humano)
* `report_json` (estruturado para a venda e para o factory)

**Não-funcionais:**

* Latência aceitável: < 6s p95
* Observabilidade: logs por sessão e por mensagem
* Custo: limite de tokens por sessão (hard cap)

---

### 2.2 Produto B — Engine Principal: "Lx Agent Factory"

**Persona:** operador interno (você/time)
**Job-to-be-done:** "criar um agente premium em minutos, com governança"

**Funcionalidades MVP:**

* Cadastro de empresa (identidade e operação)
* Geração automática:
  * Humanization Kernel
  * Niche Pack (serviços / SaaS / mercado financeiro)
  * Regras de risco e handoff
* Publicação no ManyChat (assets + fields + flow map)
* Painel de observabilidade (conversas, intenção, handoff, alertas)
* Suite de testes com cenários (simulação)
* Gestão de versões (v1, v2 do agente)

**Não-funcionais:**

* IP protegido: prompts e políticas nunca expostos ao cliente
* Auditoria: logs imutáveis (para provar compliance)
* Segurança: acesso admin-only

---

### 2.3 Roadmap (sem romantizar)

**MVP (7–14 dias):**

* MicroSaaS + Factory mínimo + integração ManyChat + Calendly + painel básico

**V1 (30 dias):**

* biblioteca de Niche Packs
* motor de variação de "abertura" (primeira mensagem não repetitiva)
* quality gates (detectar robô/teatro/loop)

**V2 (60–90 dias):**

* multi-tenant completo
* automação de proposta (PDF + escopo + preço)
* learning loop por nicho (sem vazar dados)

---

## 3) Blueprint técnico (backend, ManyChat, Calendly)

### 3.1 Componentes

1. **Landing + Demo Widget** (frontend)
2. **API Core** (backend)
3. **DB** (Supabase/Postgres ou equivalente)
4. **ManyChat** (runtime oficial WhatsApp)
5. **Calendly** (link fixo)
6. **Painel Ops (admin)**

### 3.2 Fluxos principais

#### Fluxo 1 — Demo na landing

1. Usuário abre landing → inicia chat
2. Backend cria `lead` + `demo_session`
3. Mensagens passam pelo Kernel + Niche Pack "Demo"
4. Usuário conclui → backend gera `report`
5. CTA WhatsApp + Calendly

#### Fluxo 2 — ManyChat runtime (produção)

1. Lead conversa no WhatsApp via ManyChat
2. ManyChat chama seu endpoint (custom request)
3. Backend decide:
   * responder
   * pedir 1 dado
   * acionar handoff
   * empurrar para Calendly
4. Logs em `messages`, `handoff_events`, `agent_logs`

#### Fluxo 3 — Implantação (Factory)

1. Operador cadastra empresa
2. Engine gera "Agent Package"
3. Publica assets e campos no ManyChat
4. Ativa flow base + regras de risco

### 3.3 Regras para "abertura não repetitiva"

**Mecanismo:**

* manter `openers[]` por nicho e tom
* selecionar opener por:
  * first_time vs returning
  * origem (landing vs WhatsApp direto)
  * estágio (pesquisando vs pronto para decidir)
* nunca repetir o mesmo opener em sessões próximas (janela 14 dias)

---

## 4) Contrato de payload definitivo (ManyChat ↔ Backend ↔ Engine)

### 4.1 Payload de Entrada (INBOUND_MESSAGE)

```json
{
  "event_type": "INBOUND_MESSAGE",
  "timestamp": "2025-12-28T00:00:00.000Z",
  "channel": "whatsapp",
  "source": "manychat|landing_demo",
  "company_id": "uuid",
  "lead": {
    "lead_id": "uuid",
    "name": "string|null",
    "phone": "string",
    "locale": "pt-BR"
  },
  "session": {
    "session_id": "uuid",
    "is_returning": true,
    "last_seen_at": "2025-12-20T00:00:00.000Z"
  },
  "message": {
    "message_id": "string",
    "role": "user",
    "text": "string"
  },
  "context_snapshot": {
    "niche": "servicos|saas|mercado_financeiro",
    "tone": "direto|consultivo|acolhedor|formal",
    "calendly_url": "string",
    "handoff_phone": "string",
    "risk_mode": false
  },
  "niche_pack_id": "string",
  "kernel_version": "v1.0",
  "meta": {
    "utm": {
      "source": "string|null",
      "campaign": "string|null",
      "content": "string|null"
    },
    "ip_hash": "string|null"
  }
}
```

### 4.2 Payload de Saída (OUTBOUND_RESPONSE)

```json
{
  "event_type": "OUTBOUND_RESPONSE",
  "session_id": "uuid",
  "message": {
    "role": "assistant",
    "text": "string",
    "max_followup_questions": 1
  },
  "intent": {
    "label": "duvida|orcamento|agendamento|comparacao|objecao|urgencia|suporte|outros",
    "confidence": 0.0
  },
  "actions": [
    {
      "type": "SEND_CALENDLY",
      "value": "https://calendly.com/..."
    }
  ],
  "handoff": {
    "required": false,
    "reason": "string|null",
    "channel": "whatsapp|human"
  },
  "telemetry": {
    "tokens_in": 0,
    "tokens_out": 0,
    "latency_ms": 0
  }
}
```

### 4.3 Evento de Handoff (HANDOFF_EVENT)

```json
{
  "event_type": "HANDOFF_EVENT",
  "timestamp": "2025-12-28T00:00:00.000Z",
  "company_id": "uuid",
  "lead_id": "uuid",
  "session_id": "uuid",
  "reason": "urgencia|fora_escopo|pedido_humano|recusa_repetida|risco_financeiro",
  "summary_for_human": "string",
  "suggested_next_step": "string"
}
```

### 4.4 Report (REPORT_CREATED)

```json
{
  "event_type": "REPORT_CREATED",
  "report_id": "uuid",
  "company_id": "uuid",
  "lead_id": "uuid",
  "session_id": "uuid",
  "report_md": "string",
  "report_json": {
    "profile": {},
    "pain_points": [],
    "objections": [],
    "recommended_flow": {},
    "risk_flags": []
  }
}
```

---

## 5) Exemplo real de conversa (1ª interação + retorno do mesmo lead)

### Cenário: **SaaS** (lead vindo da landing)

**Primeira interação (landing_demo)**
**Lead:** "Tô vendo várias automações por aí. O que vocês fazem diferente?"
**Agente (Kernel):** "Você quer comparar opções ou resolver isso ainda este mês?"
**Lead:** "Comparar. Não quero dor de cabeça."
**Agente:** "Entendi: comparar sem dor de cabeça. Hoje o que mais te trava: vendas, suporte ou operação?"
**Lead:** "Suporte. Resposta lenta."
**Agente:** "Resposta lenta no suporte. Você prefere um resumo no WhatsApp ou já quer agendar pelo Calendly?"
**Lead:** "Manda no WhatsApp."

**Sistema aciona:** REPORT_CREATED + WhatsApp CTA

---

**Retorno do mesmo lead (WhatsApp via ManyChat, 5 dias depois)**
**Lead:** "Voltei. Vi o relatório. Quanto custa?"
**Agente (Kernel returning=true):** "Você já tinha citado suporte lento. Pra te passar um valor certo: é mais importante reduzir tempo de resposta ou aumentar conversão?"
**Lead:** "Tempo de resposta."
**Agente:** "Fechado: tempo de resposta. Você quer um piloto de 7 dias ou prefere começar direto com implantação completa?"
**Lead:** "Piloto."
**Agente:** "Perfeito. Vou te mandar o Calendly fixo pra encaixar o kick-off do piloto. Pode ser?"
**Ação:** SEND_CALENDLY

---

## 6) Modelo de venda (como explicar isso em 5 minutos)

### Pitch de 5 minutos (sem firula)

**1) Problema do mercado (30s):**
"O mercado vende 'agente' como prompt preenchível. Isso vira teatro: o bot parece simpático, mas não entende intenção, não tem política, e quebra quando aparece objeção."

**2) Nossa tese (45s):**
"Humanização real não é tom de voz. É política operacional: uma pergunta por vez, intenção explícita, memória útil, handoff com critérios e modo risco quando precisa."

**3) Diferencial incontestável (60s):**
"O nosso agente não é imposto. Ele nasce da identidade da sua empresa. Você responde poucas perguntas sobre o seu negócio e a engine gera o agente com seu jeito — com governança e padrão."

**4) Prova (60s):**
"Na landing você já testa uma degustação. Em minutos sai um mini-relatório e você agenda pelo Calendly. Isso não é demo de PowerPoint: é o produto funcionando."

**5) Implantação (45s):**
"Você não configura prompt. A gente implanta: ManyChat como runtime oficial, Calendly fixo, regras de risco, logs e monitoramento. Em 7 dias você está no ar."

**6) Fechamento (60s):**
"Ou você continua com bot genérico que queima lead, ou você sobe um agente premium que conversa como empresa de verdade. Quer piloto de 7 dias ou implantação completa?"

---

## 7) Decisão direta

Sim — **dois produtos**, um painel.

1. **MicroSaaS (Demo Engine)**: prova e captura demanda (landing)
2. **Engine principal (Agent Factory)**: geração e governança do agente
3. **Painel Ops (interno)**: operar, versionar, monitorar, publicar no ManyChat

Sem painel, você vira refém de operação manual. Isso não escala.

---

## 8) Próximos artefatos que destravam execução imediata

1. **Micro Demo Engine** na landing (captura + prova)
2. **Contrato de payload** como verdade única (já está acima)
3. **Painel Ops mínimo** (empresa → gerar agente → publicar ManyChat → logs)
4. **3 Niche Packs** (serviços diversos, SaaS, mercado financeiro) com regras de risco e handoff
5. **Playbook comercial** (pitch + proposta + piloto)
