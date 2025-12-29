# PROMPT: TELA "TROPA DE AGENTES" (AGENTS GRID)

## Contexto

Você é um especialista em UI/UX e Frontend Engineer (Next.js + Tailwind).
Estamos construindo o painel de controle de um Sistema Operacional de Agentes (LX OS).
O objetivo desta tela é listar os 24 agentes de IA especializados que compõem a "força de trabalho" da empresa.

## Especificações Técnicas

- Framework: Next.js 14 (App Router)
- Estilização: Tailwind CSS
- Ícones: Lucide React
- Componente: `app/dashboard/agents/page.tsx`

## Design System

- Estilo: Cyberpunk Corporate Clean.
- Cores de Fundo: Slate-900 / Black.
- Cores de Acento: Indigo-500 (Dev), Emerald-500 (Sales), Purple-500 (Marketing).
- Cards: Devem parecer "módulos de hardware" ou "cartões de identificação holográficos".

## Requisitos da Tela

1. **Grid de Agentes**:
   - Exibir todos os agentes retornados pela API.
   - Layout responsivo (grid-cols-1 md:grid-cols-2 lg:grid-cols-4).
   - Agrupamento visual por categoria (Sales, Dev, Marketing, Ops).

2. **Card do Agente**:
   - Avatar (letra inicial ou ícone).
   - Nome ("Ana", "Devin", etc).
   - Cargo ("SDR Senior", "Fullstack Engineer").
   - Badge de Especialidade.
   - Breve descrição (truncate se for longa).
   - Botão "Convocar" ou "Chamar" (Call to Action principal).

3. **Integração (Mock Realista)**:
   - Os dados vêm de `GET /api/agents`.
   - Se a API demorar, mostrar esqueleto de carregamento (Skeleton Loader) ou Spinner tecnológico.

4. **Interatividade**:
   - Hover effects nos cards (brilho/glow).
   - Ao clicar em "Convocar", deve exibir um alerta ou feedback visual de conexão.

## Exemplo de Resposta da API

```json
{
  "agents": {
    "sales": [ { "role": "sales_sdr", "name": "Ana", "title": "SDR Senior", "category": "sales" } ],
    "dev": [ { "role": "dev_backend", "name": "Neo", "title": "Architect", "category": "dev" } ]
  }
}
```

## Tarefa

Gere o código completo do componente `AgentsPage`. Use `framer-motion` para animações de entrada se possível.
