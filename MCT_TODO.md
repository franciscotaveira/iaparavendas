# 📝 MCT OS - QUADRO DE COMANDO (BACKLOG DO JULES)

Este é o quadro oficial de tarefas para o Jules. Tarefas marcadas com [⏳] estão pendentes, [🏃] em execução e [✅] concluídas.

## 🏗️ FASE 1: UNIFICAÇÃO NUCLEO (URGENTE)

- [⏳] **Task 001**: Auditar a pasta `components/MCT_OS` e remover arquivos duplicados do `lx-demo-interface`.
- [⏳] **Task 002**: Padronizar todos os imports para usar `@/components/` conforme configuração do Next.js.
- [⏳] **Task 003**: Verificar se o `lx-worker` tem todas as variáveis do Supabase configuradas corretamente para evitar o loop de queda.
- [⏳] **Task 004**: Refatorar o `scripts/evolve.ts` para usar leitura em stream em vez de carregar 44MB de JSON na memória.

## 🛡️ FASE 2: BLINDAGEM DE SERVIDOR

- [⏳] **Task 005**: Implementar Sentry ou um Logger robusto para capturar erros em tempo real no servidor.
- [⏳] **Task 006**: Criar scripts de "Limpeza de Primavera" que rodam todo domingo para arquivar logs e treinos antigos automaticamente.

## 🎨 FASE 3: UI/UX PREMIUM (TDAH FOCUS)

- [⏳] **Task 007**: Integrar o `NeuralBackground.tsx` como fundo padrão de todas as páginas do sistema unificado.
- [⏳] **Task 008**: Otimizar a velocidade de carregamento da Home Page (LCP < 1.2s).

---
*Commander Antigravity está vigiando.* 👁️
