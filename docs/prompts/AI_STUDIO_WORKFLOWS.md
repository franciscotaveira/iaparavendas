# PROMPT: TELA "AUTOMAÇÕES" (WORKFLOWS PIPELINE)

## Contexto

Você é um especialista em UI/UX e Frontend Engineer.
Esta tela permite ao usuário visualizar os "Pipelines de Agentes" em execução.
É onde a mágica acontece: mostra como os agentes colaboram em sequência.

## Especificações Técnicas

- Framework: Next.js 14 (App Router)
- Estilização: Tailwind CSS
- Ícones: Lucide React
- Componente: `app/dashboard/workflows/page.tsx`

## Design System

- Estilo: Visual Pipeline / CI-CD Look (como Github Actions ou n8n).
- Animação: Use animações sutis nos conectores para indicar fluxo de dados.

## Requisitos da Tela

1. **Lista de Workflows**:
   - Card para cada processo (ex: "Inbound Lead", "Reativação Base", "Vigilância Concorrente").
   - Toggle para Pausar/Ativar.
   - Info de "Última Execução".

2. **Visualização dos Passos (Steps)**:
   - Dentro de cada card, mostre os nós do processo.
   - Exemplo: [Formulário] -> [Enriquecimento] -> [CRM] -> [WhatsApp].
   - Conecte-os com linhas.

3. **Estado Visual**:
   - **Pendente**: Cinza/Opaco.
   - **Processando**: Pulsando (Indigo/Blue).
   - **Concluído**: Verde/Check.
   - **Erro**: Vermelho.

4. **Simulação de Vivacidade**:
   - O código deve incluir um `useEffect` que simule o progresso dos passos (muda de status a cada X segundos) para dar a impressão de que o sistema está trabalhando agora.

## Tarefa

Gere o código completo do componente `WorkflowsPage`.
