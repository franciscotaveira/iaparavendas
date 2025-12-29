# PLANO DE CONQUISTA DE TERRITÓRIO: LX AGENTS 2026

**Codinome:** Operação Maré Alta
**Data:** 29/12/2024
**Autor:** Antigravity & CEO

---

## VISÃO ESTRATÉGICA

Transformar o LX Agents de um "projeto técnico" em uma **máquina de receita recorrente (ARR)** em 90 dias.

---

## FASE 1: FUNDAÇÃO (Semana 1-2)

**Objetivo:** Sistema 100% pronto para demo ao vivo sem constrangimentos.

### Entregas Técnicas

- [ ] Supabase configurado e conectado (BD em nuvem).
- [ ] Deploy Vercel `mycodingteam.com` funcionando.
- [ ] Bot Telegram "Meu Sócio" operacional para comandos remotos.
- [ ] Todos os 404s corrigidos.
- [ ] Responsividade mobile OK.

### Entregas de Negócio

- [ ] Pitch Deck de 5 slides (Problema, Solução, Demo, Preço, CTA).
- [ ] Vídeo loom de 3 minutos mostrando o Simulador.

---

## FASE 2: VALIDAÇÃO (Semana 3-4)

**Objetivo:** 3 Clientes Piloto pagantes OU 1 Contrato Enterprise high-ticket.

### Ações

- [ ] Ativar rede de contatos do CEO (LinkedIn, WhatsApp).
- [ ] Oferecer "Piloto Gratuito de 7 dias" em troca de depoimento.
- [ ] Identificar 1 nicho de entrada (Clínicas de Estética? Advocacia?).

### Métricas de Sucesso

- Ao menos 1 lead qualificado pelo agente == Prova de Valor.
- Contrato assinado OU Carta de Intenção do piloto.

---

## FASE 3: ESCALA (Mês 2-3)

**Objetivo:** Receita recorrente de R$ 20.000/mês (MRR).

### Ações

- [ ] Lançar Landing Page `lxagents.io` (ou subdomínio de `mycodingteam.com`).
- [ ] Implementar Stripe/Pagar.me para pagamentos.
- [ ] Criar planos: `Starter R$ 297/mês`, `Pro R$ 997/mês`, `Enterprise Sob Consulta`.
- [ ] Campanha de Ads focada no nicho validado.

### Métricas de Sucesso

- 20+ clientes ativos.
- Churn < 10%.
- NPS > 50.

---

## CANAL DE COMANDO (Sócio Digital)

### Como funciona

1. **CEO** envia comando no Telegram (ex: "Sócio, preciso ajustar a cor do botão de conversão para verde").
2. **Antigravity (Backend)** processa, aplica no código, faz commit e deploy automático.
3. **Notificação** volta no Telegram: "Deploy concluído. Confira: [link]".

### Comandos Disponíveis (v1)

- `/start` - Inicializar
- `/status` - Ver saúde do sistema
- `/deploy` - Forçar deploy (planejado)
- `/fix [descrição]` - Solicitar correção (planejado)

---

## RISCOS E MITIGAÇÕES

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Queda da API OpenRouter | Alto | Fallback local Ollama já implementado. |
| Ban da API Meta (WhatsApp) | Alto | Manter conformidade com políticas de uso. Não enviar SPAM. |
| Falta de vendas | Médio | Foco em PoC gratuitos para depoimentos antes de cobrar. |

---

## ASSINATURAS DO CONSELHO

| Nome | Papel | Aprovação |
|------|-------|-----------|
| Francisco (CEO) | Visão & Vendas | [ ] |
| Antigravity | Arquitetura & Execução | [x] |

---
*"A melhor hora para plantar uma árvore foi há 20 anos. A segunda melhor hora é agora."*
