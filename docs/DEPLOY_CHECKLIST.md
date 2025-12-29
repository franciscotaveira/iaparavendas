# Lx Humanized Agent Engine - Checklist de Deploy

## Pré-Deploy

### 1. Configuração de Ambiente

- [ ] `.env.local` configurado com:
  - [ ] `OPENROUTER_API_KEY` (válida)
  - [ ] `CALENDLY_BASE_URL` (URL da empresa)
  - [ ] `DATABASE_URL` (Postgres)
  - [ ] `MANYCHAT_API_KEY` (se usar callbacks)

### 2. Banco de Dados

- [ ] Postgres rodando
- [ ] Tabelas criadas (`scripts/schema.sql`)
- [ ] Conexão testada

### 3. Testes Locais

- [ ] `npm run dev` sem erros
- [ ] POST `/api/agent/message` retorna resposta válida
- [ ] Opener diferente a cada requisição
- [ ] Classifier detecta intenções corretamente
- [ ] Handoff ativa quando necessário
- [ ] Calendly URL gerada com tracking

---

## Deploy (Vercel)

### 1. Build

```bash
npm run build
# Deve completar sem erros
```

### 2. Variáveis de Ambiente

No painel da Vercel, adicionar:

- `OPENROUTER_API_KEY`
- `CALENDLY_BASE_URL`
- `DATABASE_URL` (conexão externa, não localhost)

### 3. Deploy

```bash
vercel --prod
```

---

## Pós-Deploy

### 1. Testar Endpoint

```bash
curl -X POST https://seu-dominio.vercel.app/api/agent/message \
  -H "Content-Type: application/json" \
  -d '{"subscriber_id": "test123", "text": "Oi"}'
```

Esperado:

```json
{
  "text": "Olá! Em que posso te ajudar hoje?",
  "actions": [...]
}
```

### 2. Configurar Webhook no ManyChat

1. Vá em **Settings** → **Integrations** → **Custom Integration**
2. URL: `https://seu-dominio.vercel.app/api/agent/message`
3. Method: `POST`
4. Headers: `Content-Type: application/json`
5. Body Template:

```json
{
  "subscriber_id": "{{subscriber_id}}",
  "text": "{{last_input_text}}",
  "custom_fields": {
    "session_id": "{{custom_field.session_id}}",
    "lead_id": "{{custom_field.lead_id}}",
    "last_intent": "{{custom_field.last_intent}}",
    "risk_level": "{{custom_field.risk_level}}"
  }
}
```

### 3. Criar Custom Fields no ManyChat

- `session_id` (text)
- `lead_id` (text)
- `last_intent` (text)
- `risk_level` (text)
- `handoff_reason` (text)
- `handoff_at` (text)
- `calendly_sent` (text)

### 4. Criar Tags no ManyChat

- `calendly_sent`
- `handoff_requested`
- `handoff_risco_alto`
- `handoff_objecao_repetida`
- `handoff_solicitado_pelo_lead`

---

## Monitoramento

### Logs

- Vercel: Dashboard → Functions → Logs
- Filtrar por `/api/agent/message`

### Métricas a Acompanhar

- Taxa de handoff
- Tempo médio de resposta
- Taxa de uso do Calendly
- Erros de classificação

### Alertas Recomendados

- Erro 500 > 1% das requisições
- Tempo de resposta > 5s
- Taxa de handoff > 20%

---

## Troubleshooting

### "Invalid payload"

- Verificar se ManyChat está enviando `subscriber_id` e `text`

### Respostas lentas

- Verificar latência do OpenRouter
- Considerar cache para classificações comuns

### Handoff não funciona

- Verificar se tags existem no ManyChat
- Verificar fluxo de handoff configurado

### Calendly URL errada

- Verificar `CALENDLY_BASE_URL` no ambiente
