# LX AGENT SYSTEM v1.0

## Sistema Completo de Agentes Especializados

---

## 📊 Visão Geral

O LX Agent System é uma plataforma de **24 agentes de IA especializados** que simulam uma empresa completa. Cada agente tem personalidade, expertise e comportamento únicos.

### Categorias de Agentes

| Categoria | Agentes | Descrição |
|-----------|---------|-----------|
| 💼 **Vendas** | 5 | SDR, Closer, Suporte, Scheduler, Qualifier |
| 💻 **Desenvolvimento** | 5 | Fullstack, Arquiteto, DevOps, DBA, Segurança |
| 📈 **Marketing** | 5 | Copy, Growth, Social, Ads, SEO |
| 🎨 **Produto** | 4 | PM, UX, UI, Analyst |
| ⚙️ **Operações** | 5 | CEO, COO, CFO, HR, CS |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      API ENDPOINTS                           │
│  /api/agents    /api/agents/ask    /api/health              │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                    ORCHESTRATOR                              │
│  • Seleção inteligente de agente                            │
│  • Classificação híbrida (online + local)                   │
│  • Gestão de handoff entre agentes                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                      COUNCIL                                 │
│  • Consulta multi-agente                                    │
│  • Síntese de opiniões                                      │
│  • Brainstorming colaborativo                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  ONLINE LLM │   │  LOCAL LLM  │   │  FALLBACK   │
│   (Claude)  │   │  (Ollama)   │   │  (Pattern)  │
└─────────────┘   └─────────────┘   └─────────────┘
```

---

## 🤖 Catálogo de Agentes

### 💼 Time de Vendas

| Role | Nome | Especialidade |
|------|------|---------------|
| `sdr` | Ana | Qualificação de leads, primeiro contato |
| `closer` | Bruno | Fechamento, objeções, negociação |
| `support` | Carol | Atendimento, resolução de problemas |
| `scheduler` | Diego | Agendamento eficiente |
| `qualifier` | Eduardo | Análise técnica de fit |

### 💻 Time de Desenvolvimento

| Role | Nome | Especialidade |
|------|------|---------------|
| `dev_fullstack` | Lucas | TypeScript, React, Node, Python |
| `dev_architect` | Rafael | Design de sistemas, decisões técnicas |
| `dev_devops` | Marina | CI/CD, Docker, Kubernetes, Cloud |
| `dev_dba` | Paulo | PostgreSQL, otimização, modelagem |
| `dev_security` | Fernanda | AppSec, pentesting, compliance |

### 📈 Time de Marketing

| Role | Nome | Especialidade |
|------|------|---------------|
| `mkt_copywriter` | Juliana | Copy persuasiva, headlines, CTAs |
| `mkt_growth` | Thiago | Growth loops, métricas, experimentos |
| `mkt_social` | Camila | Redes sociais, conteúdo, engajamento |
| `mkt_ads` | Ricardo | Mídia paga, ROAS, campanhas |
| `mkt_seo` | Marcos | SEO técnico, conteúdo, link building |

### 🎨 Time de Produto

| Role | Nome | Especialidade |
|------|------|---------------|
| `product_pm` | Gabriela | Discovery, priorização, PRDs |
| `product_ux` | Amanda | Pesquisa, usabilidade, jornadas |
| `product_ui` | Daniel | Design visual, design systems |
| `product_analyst` | Felipe | Métricas, A/B tests, dashboards |

### ⚙️ Time de Operações

| Role | Nome | Especialidade |
|------|------|---------------|
| `ops_ceo` | Ricardo | Estratégia, visão, OKRs |
| `ops_coo` | Patricia | Processos, SOPs, eficiência |
| `ops_cfo` | Marcelo | Finanças, unit economics, P&L |
| `ops_hr` | Isabela | Recrutamento, cultura, desenvolvimento |
| `ops_cs` | Letícia | Customer Success, retenção, NPS |

---

## 🚀 Como Usar

### 1. Consultar um Agente Específico

```bash
curl -X POST /api/agents/ask \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "single",
    "agent": "dev_fullstack",
    "question": "Como estruturar uma API de autenticação?"
  }'
```

### 2. Consultar o Council (Múltiplos Agentes)

```bash
curl -X POST /api/agents/ask \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "council",
    "question": "Como lançar um novo produto?",
    "agents": ["product_pm", "mkt_growth", "ops_ceo"]
  }'
```

### 3. Brainstorm

```bash
curl -X POST /api/agents/ask \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "brainstorm",
    "question": "Ideias para aumentar retenção de clientes"
  }'
```

### 4. Listar Agentes Disponíveis

```bash
curl /api/agents
curl /api/agents?category=dev
curl /api/agents?role=dev_fullstack
```

### 5. Health Check

```bash
curl /api/health
```

---

## ⚡ Sistema Híbrido (Online + Local)

O sistema usa uma arquitetura híbrida para:

- **Reduzir custos**: LLM local para mensagens simples
- **Aumentar velocidade**: Cache inteligente
- **Garantir disponibilidade**: Fallback automático

### Configuração do Ollama (Local)

```bash
# Instalar Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Baixar modelo
ollama pull llama3

# Verificar
ollama list
```

### Variáveis de Ambiente

```env
# LLM Online (obrigatório)
OPENROUTER_API_KEY=sk-or-v1-...

# LLM Local (opcional)
OLLAMA_BASE_URL=http://localhost:11434
LOCAL_MODEL=llama3
```

---

## 📁 Estrutura de Arquivos

```
core/
├── agents/
│   ├── index.ts          # Registry + Router
│   ├── types.ts          # Tipos unificados
│   ├── dev-team.ts       # Agentes de Dev
│   ├── marketing-team.ts # Agentes de Marketing
│   ├── product-team.ts   # Agentes de Produto
│   └── ops-team.ts       # Agentes de Operações
├── council.ts            # Multi-Agent Collaboration
├── orchestrator.ts       # Orquestração principal
├── local-llm.ts          # Suporte a LLM local
├── classifier.ts         # Classificação de intent
├── kernel.ts             # Humanization Kernel
├── memory.ts             # Gestão de sessão
├── dispatcher.ts         # Actions (Calendly, Handoff)
└── types.ts              # Tipos base

app/api/
├── agents/
│   ├── route.ts          # GET /api/agents
│   └── ask/
│       └── route.ts      # POST /api/agents/ask
└── health/
    └── route.ts          # GET /api/health
```

---

## 🔧 Extensibilidade

### Adicionar Novo Agente

1. Definir persona em `core/agents/[team]-team.ts`:

```typescript
export const NEW_AGENT: AgentPersona = {
    role: 'new_role' as AgentRole,
    name: 'Nome',
    title: 'Título',
    description: 'Descrição',
    personality: { ... },
    goals: [...],
    triggers: { ... },
    system_prompt: `...`,
    examples: [...]
};
```

1. Adicionar ao registry em `core/agents/index.ts`

2. Adicionar role ao type em `core/agents/types.ts`

---

## 📊 Métricas & Observabilidade

### Tracking de Custos

O sistema rastreia automaticamente:

- Chamadas online vs local
- Cache hits
- Economia estimada em USD

### Health Check Response

```json
{
  "status": "healthy",
  "agents": {
    "total": 24,
    "by_category": { "sales": 5, "dev": 5, ... }
  },
  "local_llm": {
    "available": true,
    "model": "llama3",
    "cost_savings": { "estimated_savings_usd": 0.45 }
  }
}
```

---

## 🎯 Próximos Passos

- [ ] Integrar com RAG (documentos da empresa)
- [ ] Adicionar memória persistente (Supabase)
- [ ] Dashboard de monitoramento
- [ ] Treinamento específico por nicho
- [ ] Integração com ferramentas (Slack, Discord)

---

*Gerado automaticamente por LX Agent System v1.0*
