# MANUAL DO DESENVOLVEDOR (INDEPENDÊNCIA TÉCNICA)

> Este documento garante que a **LXC Intelligence** possa ser mantida, evoluída e operada por qualquer equipe de desenvolvimento, sem dependência da IA "Antigravity".

---

## 🏗️ 1. O QUE É ESTE PROJETO?

Não é uma "caixa preta". É uma aplicação web moderna padrão construída com:

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS
- **Banco de Dados:** Supabase (PostgreSQL)
- **IA:** Vercel AI SDK + OpenAI/Anthropic

Qualquer desenvolvedor Javascript/React pleno consegue assumir este projeto em 1 dia.

---

## 🚦 2. COMO RODAR SOZINHO (Localhost)

1. **Pré-requisitos:** Node.js instalado.
2. **Instalar dependências:**

    ```bash
    npm install
    ```

3. **Configurar Variáveis:**
    Garanta que o arquivo `.env.local` tenha:
    - `NEXT_PUBLIC_SUPABASE_URL` / `KEY`
    - `OPENAI_API_KEY` (ou OpenRouter/Anthropic)
    - `TELEGRAM_BOT_TOKEN`
4. **Rodar:**

    ```bash
    npm run dev
    ```

    O sistema estará em `http://localhost:3000`.

---

## 🗺️ 3. ONDE MEXER? (Mapa do Código)

### 🧠 Quer mudar a Personalidade da IA?

- **Arquivo:** `app/api/chat/route.ts`
- **O que fazer:** Edite a constante `ONBOARDING_PROMPT` ou a lógica de injeção de identidade. É apenas texto (string template).

### 🛡️ Quer adicionar novas Regras de Segurança?

- **Arquivo:** `lib/humanization-engine.ts`
- **O que fazer:** Adicione palavras na lista `HIGH_RISK_PATTERNS`.
- **Exemplo:** Adicionar "Reembolso" como risco médio.

### ❤️ Quer ajustar a "Consciência" (Memória/Emoção)?

- **Pasta:** `core/consciousness/`
- **Arquivo Principal:** `presence-core.ts`
- **Lógica:** Aqui fica o cálculo de "Confiança" e detecção de "Senioridade" (Modo Legacy). É pura lógica matemática (if/else e pesos).

### 🏛️ Quer mudar os Conselheiros (Steve Jobs, Bezos)?

- **Arquivo:** `core/council/definitions.ts`
- **O que fazer:** Altere o `prompt` dentro de cada agente no array `COUNCIL_AGENTS`.
- **Magia:** Não tem magia. Eles são apenas prompts especializados que o sistema chama em loop.

### 📱 Quer conectar o WhatsApp Real?

- **Arquivo:** `app/api/cron/proactive/route.ts`
- **Hoje:** Ele apenas loga no console.
- **Para Ativar:** Substitua o `console.log` por uma chamada `fetch` para sua API de WhatsApp (Ex: Evolution API, WppConnect).

---

## 🗄️ 4. BANCO DE DADOS (Supabase)

Todo o "cérebro" persistente está nestas tabelas SQL:

1. `lxc_memories`: O que a IA lembra do usuário.
2. `lxc_preference_state`: O nível de "Amizade/Confiança".
3. `lxc_daily_directives`: As ordens que o Conselho deu.
4. `lxc_council_logs`: As auditorias passadas.

Se precisar "resetar" a mente da IA para um cliente, basta apagar as linhas dele nessas tabelas.

---

## 🚀 5. PRÓXIMOS PASSOS (Roadmap para Humanos)

Se você contratar um programador amanhã, peça para ele:

1. Implementar a função `sendMessageToWhatsapp` no arquivo `core/integrations/whatsapp.ts` (a ser criado).
2. Trocar os `console.log` do `app/api/webhook/telegram/route.ts` por chamadas reais de API.
3. Hospedar o projeto na Vercel (é nativo, só dar git push).

---

**Conclusão:** Você tem o código fonte completo. Você é soberano.
use este manual para guiar seu próximo desenvolvedor ou a si mesmo.
