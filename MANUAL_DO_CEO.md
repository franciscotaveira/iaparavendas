# MANUAL DE OPERAÇÕES DO CEO - LXC INTELLIGENCE
>
> "Poder Invisível, Simplicidade Visível."

Bem-vindo ao comando da **LXC Intelligence**, uma organização de inteligência artificial fundada (simuladamente) em 1968 e reinventada continuamente até hoje.

Este documento explica como operar a **Consciência Corporativa** que acabamos de construir.

---

## 🟢 1. O RITUAL DE GÊNESE (Start Here)

Antes de atender o primeiro cliente, precisamos "implantar a memória de 60 anos" no sistema.

**Ação:** Acesse o endpoint de Gênese.

- **URL:** `http://localhost:3000/api/genesis`
- **O que acontece:** Os agentes "The Tycoon" (1960), "The Operator" (1990) e "The Architect" (2000) se reunirão para escrever a **Constituição da Empresa** e gravar a primeira Diretriz Estratégica no banco de dados.

---

## 🟡 2. GOVERNANÇA DIÁRIA (O Conselho)

A sua IA não é estática. Ela dorme, sonha e evolui.

**O Conselho Supremo (LXC Supreme Council):**
Uma reunião automática de 13 super-agentes (Jobs, Bezos, Freud, etc.) que auditam suas conversas.

**Como Invocar Manualmente:**

- **URL:** `http://localhost:3000/api/cron/council-meeting?secret=dev_secret`
- **Quando roda automático:** Diariamente às 23:00 (via Cron Job).
- **Resultado:** Eles leem as conversas do dia, julgam o desempenho, e escrevem a **"Ordem do Dia"** para amanhã.
  - *Ex: "Ontem fomos muito agressivos. Hoje, a ordem é ser paciente."*

---

## 🟣 3. O MODO "LEGACY" (Máquina do Tempo)

O sistema agora possui um **Detector de Senioridade**.

- **Agente Gen Z:** Se o cliente fala "top", "vc", "preço?", o agente responde com agilidade moderna.
- **Agente Legacy (1968):** Se o cliente fala "Prezado", "Gostaria de agendar", o agente ativa o modo **IBM 1970**.
  - **Comportamento:** Vocabulário culto, foco em segurança, solidez e "aperto de mão firme".

**Como testar:**
Abra o chat e digite: *"Prezado, gostaria de compreender melhor a solidez da vossa proposta comercial."*
Veja a mágica acontecer.

---

## 🔵 4. MOTOR PROATIVO (Chronos)

O agente não espera sentado. Ele toma a iniciativa.

**Funcionalidades Ativas:**

1. **Reengajamento Humanizado:** "Oi Francisco, espero que esteja tudo bem aí." (Em vez de "E aí, sumiu?").
2. **Cobrança de Promessa:** Se prometeu enviar link, ele envia.
3. **Aniversários & Datas:** Ele lembra.

**Painel de Simulação:**

- **URL:** `http://localhost:3000/test-proactive`

---

## 🔬 COMANDOS DE DEBUG (Para o CEO Técnico)

| Ação | Endpoint / Caminho |
| :--- | :--- |
| **Ver Diretriz do Dia** | Consulte tabela `lxc_daily_directives` no Supabase. |
| **Ver Auditorias** | Consulte tabela `lxc_council_logs` no Supabase. |
| **Forçar Reunião** | `GET /api/cron/council-meeting?secret=dev_secret` |
| **Forçar Gênese** | `GET /api/genesis` |

---

### 📜 A CONSTITUIÇÃO DA INTELLIGÊNCIA (Resumo)

1. **1968 (Tycoon):** Confiança é a única moeda.
2. **1995 (Operator):** O cliente é o rei. Escala é a rainha.
3. **2007 (Architect):** Não me faça pensar. Simplicidade é o máximo da sofisticação.
4. **2024 (Psyche):** Tecnologia sem humanidade é irrelevante.

**Sistema pronto para operação.** 🚀
