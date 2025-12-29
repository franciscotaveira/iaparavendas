# PROMPT: TELA "MEMÓRIA CORPORATIVA" (MEMORY BOARD)

## Contexto

Você é um especialista em UI/UX e Frontend Engineer.
Esta tela é o "Cérebro" do sistema. Ela visualiza os dados que os agentes coletaram, processaram e armazenaram no banco de dados (Supabase).
O usuário precisa sentir que está olhando diretamente para o fluxo de dados da empresa.

## Especificações Técnicas

- Framework: Next.js 14 (App Router)
- Estilização: Tailwind CSS
- Ícones: Lucide React
- Componente: `app/dashboard/memory/page.tsx`

## Design System

- Estilo: Data Dashboard / Sci-Fi Interface.
- Tabelas: Devem ser limpas, com linhas finas (slate-800) e boa legibilidade.
- Status: Use "pílulas" (badges) coloridas para scores e resultados.

## Requisitos da Tela

1. **Header com Status**:
   - Título "Memória Corporativa".
   - Indicador de status do Supabase (Offline/Online/Leitura). Puxe isso de `/api/health`.

2. **Tabela de Dados (Simulação/Real)**:
   - Fonte de dados: `GET /api/simulation-data` (que retorna um array de objetos de memória).
   - Colunas Obrigatórias:
     - ID (hash curto).
     - Nicho / Persona (ex: "SaaS B2B / CTO Cético").
     - Padrão Aprendido (insight chave).
     - MQL Score (0-100).
     - Status/Outcome (Convertido, Perdido, etc).

3. **Filtros e Busca**:
   - Um campo de busca visual (input) no topo da tabela.
   - Botão de filtro (pode ser visual apenas por enquanto).

4. **Visualização do Score**:
   - Use cores condicionais para a coluna MQL Score:
     - > 80: Verde (Alta qualidade).
     - 50-79: Amarelo (Médio).
     - < 50: Vermelho (Baixo).

## Tarefa

Gere o código completo do componente `MemoryPage`. A tabela deve ser visualmente rica, não apenas HTML padrão. Use classes do Tailwind para bordas, hovers e transparências.
