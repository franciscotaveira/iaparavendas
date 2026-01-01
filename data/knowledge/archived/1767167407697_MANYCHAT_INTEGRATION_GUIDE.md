# GUIA DE INTEGRAÇÃO: MANYCHAT + LX AGENT

## Conectando a Consciência Comercial ao WhatsApp

Este guia descreve como conectar o seu fluxo do ManyChat ao cérebro do LX Agent (`/api/chat`) para habilitar a inteligência humanizada no WhatsApp.

### ARQUITETURA DE CONEXÃO

**ManyChat** (Captura msg) --> **N8N** (Orquestrador) --> **LX Agent API** (Cérebro) --> **N8N** --> **ManyChat** (Resposta)

---

### PASSO 1: PREPARAR O MANYCHAT

1. Crie um fluxo "Default Reply" (Resposta Padrão).
2. Adicione um bloco de "Action".
3. Selecione "External Request" (se tiver Pro) ou "Trigger Webhook" (para N8N).
   - **Recomendado:** Use o Trigger Webhook enviando os dados para o N8N.
4. Envie o JSON com:
   - `message`: (Last Input Text)
   - `wa_id`: (WhatsApp ID)
   - `name`: (Full Name)

### PASSO 2: CONFIGURAR O N8N (MIDDLEWARE)

O N8N servirá como "tradutor" entre o ManyChat e o LX Agent, além de manter o histórico de conversa.

**Fluxo Sugerido no N8N:**

1. **Webhook Node (POST)**: Recebe do ManyChat.
2. **Supabase/Postgres (Select)**: Busca histórico de mensagens desse `wa_id`.
   - *Tabela*: `chat_messages`
   - *Query*: Últimas 10 mensagens.
3. **Function Node**: Formata o histórico para o padrão da API.

   ```javascript
   // Exemplo de formato esperado pela API
   const messages = items[0].json.history.map(h => ({
       role: h.role, // 'user' ou 'assistant'
       content: h.text
   }));
   messages.push({ role: 'user', content: $input.item.json.body.message });
   return { json: { messages, stream: false } }; // stream: false é vital para HTTP Request simples
   ```

4. **HTTP Request Node**:
   - **Method**: POST
   - **URL**: `https://seu-dominio-lx.com/api/chat`
   - **Body**: JSON (Output do Function Node)
5. **Supabase/Postgres (Insert)**: Salva a nova mensagem do usuário e a resposta da IA.
6. **ManyChat Node (Send Text)**: Envia a resposta (`response.text`) de volta ao usuário no WhatsApp.

### PASSO 3: CONFIGURAR A API DO LX AGENT

O endpoint `/api/chat` foi atualizado para suportar o modo `stream: false`.

**Payload Exemplo:**

```json
{
  "messages": [
    {"role": "assistant", "content": "Olá, tudo bem?"},
    {"role": "user", "content": "Quanto custa o serviço?"}
  ],
  "stream": false
}
```

**Resposta Exemplo:**

```json
{
  "text": "Depende do escopo do seu projeto. Você procura algo para agora ou planejamento?",
  "tool_calls": [],
  "usage": { "prompt_tokens": 150, "completion_tokens": 20 }
}
```

---

### DICAS DE OURO PARA O LANÇAMENTO

1. **Delay Humanizado**: No N8N, adicione um node "Wait" antes de enviar a resposta ao ManyChat. Calcule `tempo = palavras * 0.1s`. Isso simula digitação humana.
2. **Failover**: Se a API da IA der erro ou timeout no N8N, tenha um caminho de "Erro" que envia um alerta para você ou uma mensagem genérica ("Estou verificando com meu supervisor, um momento.").
3. **Teste no Simulador**: Use o `/dashboard/simulator` para validar se a "personalidade" da IA está respondendo como esperado antes de ligar no número oficial da empresa.
