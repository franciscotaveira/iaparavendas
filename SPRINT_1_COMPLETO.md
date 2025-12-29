# Lx Demo Engine - Sprint 1 Completo

## 📊 Status: ✅ IMPLEMENTADO

**Data:** 2025-12-28  
**Versão:** 1.0.0

---

## 🎯 O que foi entregue

### 1. Motor de Humanização (`lib/humanization-engine.ts`)

**Componentes implementados:**

| Router | Função | Status |
|--------|--------|--------|
| **Router 1 - Intenção** | Classifica: dúvida, orçamento, agendamento, comparação, objeção, suporte, urgência | ✅ |
| **Router 2 - Risco** | Detecta termos proibidos, modo risco para financeiro/saúde | ✅ |
| **Router 3 - Abertura** | Variação controlada por contexto (first_time, returning, abandoned) | ✅ |
| **Router 4 - Handoff** | Decide quando passar para humano/Calendly/WhatsApp | ✅ |
| **Score Fit** | Calcula qualificação do lead (0-100) | ✅ |
| **Memory Manager** | Resumo incremental + fatos estruturados | ✅ |

---

### 2. Niche Packs (`lib/niche-packs.ts`)

**Packs implementados:**

| Pack | Nichos Mapeados | Modo Risco |
|------|-----------------|------------|
| **Serviços** | advocacia, clínica, imobiliária, consultoria, educação, e-commerce | ❌ |
| **SaaS** | software, plataforma, sistema, aplicativo, tech | ❌ |
| **Mercado Financeiro** | investimentos, corretora, fintech, cripto, trading | ✅ |

Cada pack inclui:

- Intents específicos
- Perguntas mínimas por intent
- Tratamento de objeções
- Palavras/frases proibidas
- Triggers de handoff
- Tom e política de emojis

---

### 3. Handoff Engine (`lib/handoff.ts`)

**Funcionalidades:**

- ✅ Geração de payload estruturado para ManyChat
- ✅ Assinatura HMAC para segurança
- ✅ Builder de URL Calendly com UTM params
- ✅ Fallback para WhatsApp link direto
- ✅ Mensagens de handoff humanizadas

---

### 4. APIs Implementadas

| Endpoint | Método | Função |
|----------|--------|--------|
| `/api/chat` | POST | Chat com LLM + Humanization Engine |
| `/api/handoff` | POST | Executa handoff para ManyChat/Calendly |
| `/api/handoff` | GET | Gera URL do Calendly |
| `/api/events` | POST | Tracking de eventos |
| `/api/events` | GET | Lista eventos por sessão |

---

### 5. Componente DemoChat Atualizado

**Novidades:**

- ✅ CTAs de Calendly e WhatsApp aparecem após qualificação
- ✅ Detecção automática de momento de handoff
- ✅ Tracking de cliques nos CTAs
- ✅ Feedback visual de loading e sucesso
- ✅ Integração com API de handoff

---

## 🔧 Configuração Necessária

No arquivo `.env.local`:

```env
# LLM (obrigatório)
OPENROUTER_API_KEY=sk-or-v1-...

# N8n (opcional - para analytics)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/lux-learning

# Calendly (customizar)
CALENDLY_URL=https://calendly.com/seu-usuario/15min

# ManyChat (opcional - deixar vazio para fallback)
MANYCHAT_API_URL=
MANYCHAT_API_KEY=

# Segurança
HMAC_SECRET=sua-chave-secreta-aqui
```

---

## 📁 Estrutura de Arquivos

```
lib/
├── prompts.ts              # Prompts originais (Onboarding, Demo, Extraction)
├── niche-packs.ts          # 3 Niche Packs + detecção automática
├── humanization-engine.ts  # Motor completo (routers, score, memória)
└── handoff.ts              # Integração ManyChat/Calendly/WhatsApp

app/api/
├── chat/route.ts           # Chat principal (atualizado com Engine)
├── handoff/route.ts        # API de handoff
├── events/route.ts         # Tracking de eventos
├── n8n-health/route.ts     # Health check N8n
└── simulation-data/route.ts# Dados de simulação

components/
└── DemoChat.tsx            # Chat com CTAs integrados
```

---

## 🚀 Próximos Passos (Sprint 2)

### Prioridade 1 - Relatório 1 Página

- [ ] Gerar mini-relatório após 3+ mensagens
- [ ] Endpoint `/api/report`
- [ ] Componente `MiniReport.tsx`

### Prioridade 2 - Persistência

- [ ] Integrar Supabase para leads/sessions
- [ ] Schema já existe em `scripts/schema.sql`

### Prioridade 3 - ManyChat Real

- [ ] Configurar conta ManyChat
- [ ] Testar integração com WhatsApp Cloud API
- [ ] Fluxo "Lx Handoff" no ManyChat

---

## 📈 Métricas a Acompanhar

Eventos que já estão sendo rastreados:

| Evento | Quando dispara |
|--------|---------------|
| `chat_message` | Cada mensagem do usuário |
| `onboarding_complete` | Quando onboarding termina |
| `risk_handoff_triggered` | Quando detecta risco alto |
| `fallback_activated` | Quando LLM falha |
| `handoff_executed` | Quando handoff é disparado |
| `cta_calendly_clicked` | Clique no botão Calendly |
| `cta_whatsapp_clicked` | Clique no botão WhatsApp |

---

## ✅ Validação

Para testar:

1. Acesse `http://localhost:3000`
2. Clique em um cenário ou digite seu negócio
3. Converse por 3-4 turnos
4. Os CTAs devem aparecer automaticamente
5. Clique em "Agendar Call" ou "WhatsApp"

Verificar logs no terminal para:

- `[Event]` - Eventos sendo rastreados
- `N8n:` - Eventos enviados para N8n
- `Using OpenRouter` - Confirmação de LLM ativo

---

**Documento Mestre:** Siga o `Lx Humanized Agents OS v1.0` como fonte de verdade.
