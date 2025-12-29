# LX HUMANIZED AGENTS - DOCUMENTO MESTRE OPERACIONAL

## Sistema Completo de Agentes Humanizados

### SOPs, POPs e Governança Operacional

**Versão 2.0 — Dezembro 2024**
**Lux Growth IA**

---

## SUMÁRIO

1. [PARTE 1: VISÃO GERAL DO SISTEMA](#parte-1)
2. [PARTE 2: JORNADA PONTA-A-PONTA](#parte-2)
3. [PARTE 3: SOPs — PROCEDIMENTOS OPERACIONAIS PADRÃO](#parte-3)
4. [PARTE 4: POPs — PROCEDIMENTOS OPERACIONAIS](#parte-4)
5. [PARTE 5: CONTRATOS DE PAYLOAD](#parte-5)
6. [PARTE 6: BIBLIOTECA DE NICHE PACKS](#parte-6)
7. [PARTE 7: HUMANIZATION KERNEL](#parte-7)
8. [PARTE 8: ROADMAP DE EVOLUÇÃO](#parte-8)
9. [PARTE 9: CHECKLIST DE GO-LIVE](#parte-9)

---

## PARTE 1: VISÃO GERAL DO SISTEMA

### 1.1 Arquitetura Técnica

O sistema Lx Humanized Agents opera sobre uma arquitetura proprietária que elimina dependências de plataformas intermediárias.

#### Stack Tecnológica

- **Frontend:** Next.js 14 (App Router)
- **Backend:** API Routes Next.js + OpenRouter
- **Database:** Supabase (PostgreSQL)
- **Automação:** n8n (self-hosted)
- **WhatsApp:** Meta Cloud API (nativo)
- **Deploy:** Vercel

#### Vantagens da Stack Atual

- Zero dependência de ManyChat ou plataformas third-party
- Controle total sobre logs, métricas e auditoria
- Custo operacional reduzido (sem taxas de intermediários)
- Latência otimizada (chamadas diretas à Meta API)
- IP totalmente protegido (prompts nunca expostos)

### 1.2 Modelo de Negócio

| Nível | Descrição |
|-------|-----------|
| **Interno** | Operações Lux (Instituto Suzana Rios, Haven, SŌRA) |
| **Externo** | Clientes via Lux Growth IA |

---

## PARTE 2: JORNADA PONTA-A-PONTA

### 2.1 Fase: Aquisição

#### Canais de Aquisição (por prioridade)

1. Meta Ads (Instagram/Facebook): CTA direto para "Teste o agente em 2 minutos"
2. Orgânico (Reels/Provas sociais): Demonstrações reais
3. Indicações/Parcerias: Links trackeados por UTM

#### Elementos Obrigatórios na Landing

- Promessa objetiva: "Seu agente nasce do seu jeito"
- Demo Engine embutido (widget de chat)
- CTA único: "Receber relatório + agendar"

#### KPIs de Aquisição

| Métrica | Meta |
|---------|------|
| CTR para Demo | >3% |
| Taxa início conversa | >60% |
| Taxa conclusão demo | >40% |
| Custo por lead | <R$25 |

### 2.2 Fase: Demo

#### Fluxo da Demo (5-7 inputs)

1. Abertura: "Preciso entender seu negócio em 5 perguntas"
2. Coleta - Nicho: "Qual é o segmento?"
3. Coleta - Objetivo: "Vendas, suporte ou agendamento?"
4. Coleta - Canal: "Onde acontecem as conversas?"
5. Coleta - Volume: "Quantas conversas/dia?"
6. Coleta - Dor: "Qual o maior problema?"
7. Simulação: 3-6 turnos de conversa

#### Regras do Demo Engine

- Respostas curtas (máximo 2 frases)
- Uma pergunta por vez
- Não inventar preço/prazo/garantia
- Handoff se fora do escopo
- Latência máxima: 6 segundos

#### Output da Demo

- `report_md`: Mini-diagnóstico formatado
- `report_json`: Dados estruturados para venda

#### KPIs de Demo

| Métrica | Meta |
|---------|------|
| Aceitação relatório WhatsApp | >70% |
| Clique Calendly | >50% |
| Agendamento efetivo | >30% |

### 2.3 Fase: Venda

#### Roteiro da Call (15-25 min)

1. Relembrar diagnóstico da demo
2. Explicar diferencial (política, memória, handoff)
3. Apresentar pacote de implantação
4. Fechar próximo passo

#### Pitch de 5 Minutos

| Tempo | Conteúdo |
|-------|----------|
| 30s | **Problema:** "O mercado vende bot como prompt preenchível" |
| 45s | **Tese:** "Humanização é política operacional, não tom" |
| 60s | **Diferencial:** "Agente nasce da identidade da empresa" |
| 60s | **Prova:** "Na landing você já testa" |
| 45s | **Implantação:** "7 dias você está no ar" |
| 60s | **Fechamento:** "Piloto ou implantação completa?" |

#### KPIs de Venda

| Métrica | Meta |
|---------|------|
| Show rate | >80% |
| Close rate | >40% |
| Tempo até go-live | <7 dias |

### 2.4 Fase: Implantação

#### Timeline de Implantação

| Fase | Dias | Ações |
|------|------|-------|
| **Pré-onboarding** | D+0 | Coletar identidade, definir objetivo |
| **Agent Factory** | D+1 a D+3 | Gerar agente, publicar, configurar Calendly |
| **QA & Governança** | D+4 a D+6 | 20 cenários de teste, ajustes de política |
| **Go-live** | D+7 | Ativar tráfego, monitorar, plano 14 dias |

#### KPIs de Implantação

| Métrica | Meta |
|---------|------|
| Taxa handoff | <15% |
| Taxa agendamento | >25% |
| Taxa reclamação | <5% |
| Custo por conversa | <R$0,50 |
| NPS cliente | >8 |

---

## PARTE 3: SOPs — PROCEDIMENTOS OPERACIONAIS PADRÃO

### SOP-001: Onboarding de Novo Cliente

#### Checklist de Execução

- [ ] Enviar mensagem de boas-vindas (template aprovado)
- [ ] Criar registro no Supabase (tabela: companies)
- [ ] Agendar call de kickoff (máximo D+1)
- [ ] Enviar formulário de coleta de identidade
- [ ] Criar pasta do cliente no drive
- [ ] Configurar acesso ao painel
- [ ] Notificar time técnico

#### Dados Coletados

| Campo | Descrição |
|-------|-----------|
| company_name | Nome da empresa |
| niche | Segmento principal |
| tone | Tom de comunicação |
| objective | Leads/Agendamento/Suporte |
| calendly_url | Link do Calendly |
| handoff_phone | Número para escalonamento |
| risk_topics | Temas sensíveis do nicho |

### SOP-002: Geração de Agente (Agent Factory)

#### Etapas de Geração

1. Validar dados de entrada
2. Selecionar Niche Pack base
3. Gerar Humanization Kernel personalizado
4. Configurar regras de handoff
5. Configurar modo risco
6. Deploy no n8n
7. Integrar Meta API
8. Testar conexão

#### Componentes do Agent Package

| Componente | Descrição |
|------------|-----------|
| humanization_kernel.json | Políticas e tom |
| niche_pack.json | FAQ e objeções do nicho |
| handoff_rules.json | Gatilhos de escalonamento |
| risk_config.json | Temas sensíveis |
| openers.json | Biblioteca de aberturas |

### SOP-003: Testes de Qualidade (QA)

#### Suite de Testes (20 cenários mínimos)

| # | Categoria | Cenário |
|---|-----------|---------|
| 1-4 | Saudação | Oi, Olá, Bom dia, Tudo bem |
| 5-8 | Interesse | Quero saber mais, Como funciona, Vocês fazem X, Me explica |
| 9-12 | Objeção | É caro, Preciso pensar, Já tenho, Não tenho tempo |
| 13-16 | Agendamento | Quero agendar, Qual horário, Pode ser amanhã |
| 17-18 | Handoff | Quero falar com humano, Isso é um robô |
| 19-20 | Risco | Quanto custa exato, Vocês garantem |

#### Critérios de Aprovação

- 100% handoffs acionam corretamente
- 100% modo risco ativa quando deve
- >90% respostas seguem 1 pergunta por vez
- >95% latência <6s
- Zero invenção de preço/prazo

### SOP-004: Handoff para Humano

#### Gatilhos de Handoff

| Gatilho | Descrição |
|---------|-----------|
| Pedido explícito | "Quero falar com alguém" |
| Urgência real | "É urgente", "Emergência" |
| Recusa repetida | 3+ "não" consecutivos |
| Fora do escopo | Pergunta que agente não sabe |
| Risco persistente | Tema sensível não resolvido |

#### Fluxo de Handoff

1. Detectar gatilho
2. Informar lead: "Vou te conectar com [Nome]"
3. Gerar HANDOFF_EVENT
4. Notificar atendente
5. Passar contexto completo
6. Atualizar status do lead

### SOP-005: Monitoramento e Alertas

#### Métricas Monitoradas

| Métrica | Alerta |
|---------|--------|
| Latência média | >6s por 5 min |
| Taxa de erro | >5% por hora |
| Handoffs | >20% do volume diário |
| Loops detectados | Qualquer ocorrência |
| Custo por conversa | >R$1,00 |

---

## PARTE 4: POPs — PROCEDIMENTOS OPERACIONAIS

### POP-001: Criar Novo Cliente no Sistema

**Pré-requisitos:** Acesso Supabase + Formulário preenchido + Contrato assinado

**Passos:**

1. Acessar Supabase
2. Navegar para tabela 'companies'
3. Clicar 'Insert row'
4. Preencher campos obrigatórios
5. Salvar registro
6. Copiar company_id
7. Registrar no drive

### POP-002: Configurar Workflow no n8n

**Passos:**

1. Acessar n8n
2. Duplicar template 'LX_AGENT_TEMPLATE'
3. Renomear: LX_AGENT_[NOME_EMPRESA]
4. Configurar nó 'Webhook'
5. Configurar nó 'Set Company'
6. Configurar nó 'System Prompt'
7. Testar workflow
8. Ativar workflow

### POP-003: Configurar Webhook na Meta API

**Passos:**

1. Acessar Meta Business
2. Ir para WhatsApp Manager
3. Selecionar número
4. Ir para Configuration > Webhook
5. Colar Callback URL + Verify Token
6. Selecionar eventos: messages, messaging_postbacks
7. Verificar e salvar
8. Testar

### POP-004: Executar Suite de Testes

**Para cada cenário:**

1. Enviar mensagem de teste
2. Aguardar resposta (máx 10s)
3. Verificar política
4. Registrar resultado
5. Capturar screenshot se FALHOU
6. Limpar contexto (nova sessão)

---

## PARTE 5: CONTRATOS DE PAYLOAD

### 5.1 INBOUND_MESSAGE (Entrada)

```json
{
  "event_type": "INBOUND_MESSAGE",
  "timestamp": "ISO8601",
  "channel": "whatsapp",
  "source": "meta_api|landing_demo",
  "company_id": "uuid",
  "lead": {
    "lead_id": "uuid",
    "name": "string|null",
    "phone": "string",
    "locale": "pt-BR"
  },
  "session": {
    "session_id": "uuid",
    "is_returning": boolean,
    "last_seen_at": "ISO8601|null"
  },
  "message": {
    "message_id": "string",
    "role": "user",
    "text": "string"
  },
  "context_snapshot": {
    "niche": "servicos|saas|mercado_financeiro|beleza_premium",
    "tone": "direto|consultivo|acolhedor|formal",
    "calendly_url": "string",
    "handoff_phone": "string",
    "risk_mode": boolean
  }
}
```

### 5.2 OUTBOUND_RESPONSE (Saída)

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
    "label": "duvida|orcamento|agendamento|objecao|urgencia|suporte",
    "confidence": 0.0
  },
  "actions": [{
    "type": "SEND_CALENDLY|HANDOFF|TAG",
    "value": "string"
  }],
  "handoff": {
    "required": boolean,
    "reason": "string|null"
  },
  "telemetry": {
    "tokens_in": 0,
    "tokens_out": 0,
    "latency_ms": 0
  }
}
```

### 5.3 HANDOFF_EVENT (Escalonamento)

```json
{
  "event_type": "HANDOFF_EVENT",
  "timestamp": "ISO8601",
  "company_id": "uuid",
  "lead_id": "uuid",
  "session_id": "uuid",
  "reason": "urgencia|fora_escopo|pedido_humano|recusa_repetida|risco",
  "summary_for_human": "string",
  "suggested_next_step": "string"
}
```

### 5.4 REPORT_CREATED (Relatório)

```json
{
  "event_type": "REPORT_CREATED",
  "report_id": "uuid",
  "lead_id": "uuid",
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

## PARTE 6: BIBLIOTECA DE NICHE PACKS

### 6.1 Niche Pack: Serviços Diversos

| Campo | Valor |
|-------|-------|
| Foco | Prestação de serviços em geral |
| Tom padrão | Consultivo |
| Handoff trigger | Orçamento específico |

**Objeções Típicas:**

- "É caro" → "Quer comparar custo com resultado esperado?"
- "Preciso pensar" → "O que falta pra decidir?"
- "Já tenho fornecedor" → "Como está a experiência?"

### 6.2 Niche Pack: SaaS B2B

| Campo | Valor |
|-------|-------|
| Foco | Software as a Service |
| Tom padrão | Direto |
| Handoff trigger | Demo técnica |

**Objeções Típicas:**

- "Já uso outra ferramenta" → "Ela resolve [problema]?"
- "Preciso ver com meu time" → "Preparo um resumo?"
- "Não tenho budget" → "Quando revisam orçamento?"

### 6.3 Niche Pack: Beleza Premium

| Campo | Valor |
|-------|-------|
| Foco | Estética, saúde, bem-estar |
| Tom padrão | Acolhedor |
| Handoff trigger | Condições especiais, alergia |

**Objeções Típicas:**

- "É caro" → "Já conhece nosso resultado?"
- "Nunca fiz" → "A primeira vez é especial"
- "Tenho alergia" → "Me conta mais?"

### 6.4 Niche Pack: Mercado Financeiro

| Campo | Valor |
|-------|-------|
| Foco | Investimentos, crédito, seguros |
| Tom padrão | Formal |
| Handoff trigger | Garantia, rentabilidade |
| **RISCO ALTO** | Compliance obrigatório |

**Objeções com MODO RISCO:**

- "Quanto rende?" → "[RISCO] Rentabilidade passada não garante futura"
- "Vocês garantem?" → "[RISCO] Não posso garantir - seria irregular"

---

## PARTE 7: HUMANIZATION KERNEL

### 7.1 Políticas Fundamentais

| Política | Regra |
|----------|-------|
| Brevidade | Máximo 2 frases por resposta |
| Foco | Uma pergunta por vez |
| Honestidade | Não inventar dados |
| Contexto | Usar nome do lead quando disponível |
| Memória | Referenciar histórico quando returning |

### 7.2 Sistema de Openers

Seleção baseada em:

- `first_time` vs `returning`
- origem (landing, WhatsApp, ads)
- estágio (pesquisando, comparando, decidindo)
- histórico (não repetir em 14 dias)

**Exemplos:**

| Contexto | Opener |
|----------|--------|
| First time (landing) | "Vi que você testou nosso agente. O que chamou sua atenção?" |
| Returning (<7 dias) | "Bom te ver de novo! Ficou com alguma dúvida?" |
| Returning (>14 dias) | "Faz um tempo que a gente conversou. Posso te ajudar com algo?" |

### 7.3 Modo Risco

#### Gatilhos

- Preço exato sem autorização
- Garantias de resultado
- Questões jurídicas
- Pedido de desconto não autorizado
- Promessas de rentabilidade

#### Comportamento

- Não afirmar, apenas informar
- Incluir disclaimers
- Redirecionar para humano se persistir
- Registrar com flag de risco

---

## PARTE 8: ROADMAP DE EVOLUÇÃO

### MVP (7-14 dias)

- [ ] Demo Engine funcional
- [ ] Agent Factory mínimo (1 Niche Pack)
- [ ] Integração n8n + Meta API + Supabase
- [ ] Calendly configurado
- [ ] Painel básico de logs

### V1 (30 dias)

- [ ] 4 Niche Packs completos
- [ ] Motor de variação de openers
- [ ] Quality gates (loop/teatro)
- [ ] Dashboard com métricas
- [ ] Alertas automatizados

### V2 (60-90 dias)

- [ ] Multi-tenant completo
- [ ] Automação de proposta PDF
- [ ] Learning loop por nicho
- [ ] Painel self-service
- [ ] Integrações CRM

---

## PARTE 9: CHECKLIST DE GO-LIVE

### Pré-Go-Live

- [ ] Formulário de onboarding completo
- [ ] Registro no Supabase
- [ ] Agent Package gerado
- [ ] Workflow no n8n
- [ ] Webhook Meta configurado
- [ ] Calendly testado
- [ ] 20 testes executados
- [ ] Aprovação >90%
- [ ] Handoff testado
- [ ] Alertas configurados

### Go-Live

- [ ] Cliente notificado
- [ ] Status = 'active'
- [ ] Monitoramento 24h ativo
- [ ] Atendente disponível

### Pós-Go-Live (D+7)

- [ ] Review de métricas
- [ ] Análise de handoffs
- [ ] Gaps identificados
- [ ] Ajustes aplicados
- [ ] Feedback coletado
- [ ] Plano 14 dias definido
