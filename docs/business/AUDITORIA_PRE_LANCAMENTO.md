# 🏛️ RELATÓRIO DO CONSELHO SUPREMO (LXC COUNCIL)

**Data:** 30/12/2025 | **Status:** Crítico | **Assunto:** Auditoria Pré-Lançamento

Abaixo encontra-se a transcrição da reunião extraordinária realizada pelos agentes diretores para avaliar a empresa criada.

---

## 1. 🎩 THE TYCOON (Diretor de Estratégia - 1968)
>
> *"O modelo de negócios é sólido, mas a oferta ainda está 'tímida'. Estamos vendendo ouro a preço de lata."*

* **Veredito:** O Pricing em R$ 497/mês é baixo para um produto "Concierge". Se prometemos IA com Psicologia, devemos cobrar como Consultoria.
* **Ordem:** Subir o pacote de entrada para **R$ 997**. Eliminar o plano barato. Quem paga pouco, reclama muito. Queremos clientes que entendam valor.
* **Crítica na Demo:** A página cita "Sem cartão". Isso atrai curiosos. Mude para "Solicite Convite". Crie escassez.

## 2. 🏗️ THE OPERATOR (Diretor de Operações - 1995)
>
> *"O gargalo está no Onboarding. O QR Code é ótimo, mas e a ingestão de PDFs?"*

* **Risco Identificado:** O `ONBOARDING_PLAYBOOK` diz para "ingestão de PDFs", mas não vi a ferramenta no painel para o cliente fazer upload sozinho. Isso vai obrigar você (Francisco) a fazer manual. Isso não escala.
* **Ação Imediata:** Se não temos upload automático hoje, precisamos cobrar caro no Setup Fee para justificar seu tempo de fazer isso manualmente.
* **Alerta:** O suporte via Telegram é perigoso. Se 10 clientes mandarem mensagem ao mesmo tempo, você trava. Crie um "Bot de Triagem" no seu próprio suporte.

## 3. 📐 THE ARCHITECT (Diretor Técnico - 2005)
>
> *"O código é robusto, mas a segurança do Prompt está exposta."*

* **Falha de Segurança:** No arquivo `route.ts`, o `companyName` e `botName` vêm do frontend. Um hacker pode injetar nomes maliciosos.
* **Correção:** Devemos validar esses inputs no backend ou hardcodar os IDs dos clientes pagantes. Não confie no cliente.
* **Dashboard:** A tela `dashboard/page.tsx` está linda, mas os dados são mockados (falsos) em algumas partes. O cliente vai perceber se o gráfico não mexer. Precisamos conectar os websockets reais urgentemente.

## 4. 🧠 PSYCHE (Diretora de Humanização - 2024)
>
> *"A alma do produto está no Delay, mas ele precisa ser visível."*

* **Insight de Ouro:** Quando a IA demora 10 segundos para responder (simulando pensamento), o usuário comum acha que a internet caiu.
* **Solução:** Precisamos enviar o status **"Digitando..."** (Typing Indicator) no WhatsApp durante esse delay. Sem isso, a ansiedade mata a venda.
* **Refinamento:** O `SUPPORT_PROTOCOL` está muito formal. Troque "Conselho Técnico" por "Supervisão". Soa menos robótico.

---

## 💎 PLANO DE LAPIDAÇÃO (AÇÕES FINAIS)

O Conselho determinou as seguintes prioridades para o "Go Live":

### 🔴 Prioridade 1: Segurança & Identidade (The Architect)

1. Blindar a API `POST /api/chat` para aceitar apenas domínios autorizados (CORS rígido).
2. Implementar validação de input nos nomes do bot.

### 🟡 Prioridade 2: Experiência do Usuário (Psyche)

1. Garantir que o evento `sendPresence('composing')` seja disparado no WhatsApp durante os delays emocionais.
2. Alterar o Copy da Landing Page de "Testar Agora" para "Aplicar para Vaga" (Escassez).

### 🟢 Prioridade 3: Operação (The Operator)

1. Criar um **Formulário de Typeform** real para o Onboarding e linkar no Playbook.
2. Definir o SLA: "Tempo de resposta de suporte humano: até 4 horas". Coloque isso no contrato.

---

**Assinado:** *LXC Supreme Council*
