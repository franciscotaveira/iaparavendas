# LX AGENT OPERATING SYSTEM - DASHBOARD SPECIFICATION

## Contexto

Estamos construindo o "Cockpit" para um Sistema Operacional de Agentes com 24 personas especializadas (Vendas, Dev, Marketing, etc). O backend já existe em Next.js (App Router).

## Tech Stack

- Framework: Next.js 14 (App Router)
- Estilização: Tailwind CSS
- Ícones: Lucide React
- HTTP Client: Fetch padrão

## 1. APIs Disponíveis (Reais)

### A. Listar Agentes

`GET /api/agents`
Retorna todos os agentes e estatísticas.

```json
{
  "success": true,
  "stats": { "total_agents": 24, "by_category": { "sales": 5, ... } },
  "agents": {
    "sales": [ { "role": "sdr", "name": "Ana", "status": "active" }, ... ],
    "dev": [ ... ]
  }
}
```

### B. Health & Status

`GET /api/health`
Monitora o status do sistema híbrido (Local + Online).

```json
{
  "status": "healthy",
  "local_llm": { "available": true, "model": "llama3", "cost_savings": 12.50 },
  "orchestration": { "active_sessions": 5 }
}
```

### C. War Room (Simulação)

`POST /api/agents/ask`
Envia problemas para o conselho.
Payload: `{ "mode": "council", "question": "..." }`

## 2. Requisitos das Telas

### Tela 1: Visão Geral (Overview)

- Cards de métricas no topo: Total de Agentes, Economia Gerada (USD), Sessões Ativas.
- Gráfico de pizza simples (distribuição por departamento).
- Lista de "Agentes em Destaque" (status real).

### Tela 2: Tropa (Agents Grid)

- Uma grid exibindo os 24 agentes agrupados por time (Sales, Dev, Marketing...).
- Cada card deve ter: Foto (avatar placeholder), Nome, Cargo e uma "badge" de especialidade.
- Botão "Chamar": Abre um modal para conversar direto com aquele agente.

### Tela 3: Memória Corporativa

- Visualização dos dados do Supabase (Leads e Conhecimento).
- Tabela simples listando as últimas memórias salvas.

## 3. Sua Tarefa (Prompt para o AI Studio)

Crie o código React (Next.js) para estas telas.
Use componentes funcionais e hooks (useEffect) para buscar os dados das APIs citadas acima.
Seja visualmente impressionante ("Cyberpunk Corporate Clean").
Use cores escuras (slate-900, blue-900) e acentos vibrantes (purple-500, emerald-400).
