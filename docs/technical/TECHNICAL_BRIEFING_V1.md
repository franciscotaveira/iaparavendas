# 🛠️ BRIEFING TÉCNICO V1 - EXECUÇÃO PÓS-CONCLAVE

**Prioridade:** Imediata
**Responsável:** Equipe de Engenharia (Dev Team + Architect)

Este documento traduz as ordens estratégicas do "Conclave das 37 Mentes" em tarefas técnicas executáveis.

---

## 🔴 1. SEGURANÇA (The Sentinel)

**Problema:** Injeção de Prompt via `botName` e `companyName`.
**Ação:** Implementar sanitização rígida no endpoint de chat.

### Tarefa 1.1: Blindagem da API

**Arquivo Alvo:** `app/api/chat/route.ts`
**Instrução:**

1. Criar função `sanitizeInput(text)`.
2. Remover qualquer caractere especial que possa ser usado para injeção (ex: `{}`, `[]`, `/`, `\`).
3. Limitar tamanho da string a 30 caracteres.

---

## 🟡 2. HUMANIZAÇÃO & UX (Psyche & Jester)

**Problema:** O delay de pensamento parece "travamento" para o usuário.
**Ação:** Simular feedback visual de "Digitando...".

### Tarefa 2.1: Evento de Presença

**Arquivo Alvo:** `app/api/chat/route.ts` (e integrador WhatsApp)
**Instrução:**

1. Antes de enviar a resposta da LLM, disparar webhook simulado:
   `await notifyTypingStart(sessionId);`
2. Aguardar o tempo do delay.
3. Enviar resposta.

---

## 🟢 3. EFICIÊNCIA DE CUSTOS (The CFO)

**Problema:** Usar modelo caro para dar "Bom dia".
**Ação:** Implementar Roteamento de Modelo baseado em Complexidade.

### Tarefa 3.1: Seletor Dinâmico de Modelo

**Arquivo Alvo:** `core/local-llm.ts` ou `app/api/chat/route.ts`
**Lógica:**

```typescript
const isComplex = message.length > 50 || /preço|comprar|problema|erro/i.test(message);
const model = isComplex ? 'gpt-4o' : 'gpt-3.5-turbo';
```

---

## 🔵 4. LÓGICA DE VENDAS (The Tone Detective)

**Problema:** SDR pedindo dados cedo demais.
**Ação:** Alterar System Prompt do SDR.

### Tarefa 4.1: Ajuste de Prompt SDR

**Arquivo Alvo:** `core/agents/index.ts` (SDR_AGENT)
**Mudança:**
Adicionar regra: "SÓ peça telefone/email após o usuário demonstrar interesse explícito ou após a 5ª interação. Antes disso, foque em entender a dor."

---

## 📋 COMANDOS PARA O TERMINAL

Copie e cole estes comandos para preparar o ambiente para as mudanças:

```bash
# 1. Instalar dependências de sanitização (se necessário, ou usar Regex nativo)
# (Nativo é preferível para manter leveza - The Operator)

# 2. Criar estrutura para upload de arquivos (Pedido do The Operator)
mkdir -p app/api/upload
touch app/api/upload/route.ts

# 3. Criar arquivo de configuração de segurança centralizada
touch core/security.ts
```
