# Lx Humanized Agent Engine - Exemplos de Fluxo

## Fluxo 1: Primeira Interação (Lead Frio)

### Entrada

```json
{
  "subscriber_id": "12345",
  "text": "Oi",
  "custom_fields": {}
}
```

### Processamento Interno

1. **AOS**: Detecta `first_interaction: true`
2. **Opener selecionado**: "Olá! Em que posso te ajudar hoje?"
3. **Classifier**: Não executa (primeira mensagem)
4. **Sessão criada**:
   - `session_id`: `sess_1735...`
   - `message_count`: 1
   - `first_interaction`: false

### Saída

```json
{
  "text": "Olá! Em que posso te ajudar hoje?",
  "actions": [
    { "type": "set_custom_field", "field_name": "session_id", "value": "sess_1735..." }
  ]
}
```

---

## Fluxo 2: Lead Pergunta sobre Preço

### Entrada

```json
{
  "subscriber_id": "12345",
  "text": "Quanto custa o serviço de vocês?",
  "custom_fields": {
    "session_id": "sess_1735..."
  }
}
```

### Processamento Interno

1. **Classifier**:
   - Intent: `orcamento`
   - Risk: `baixo`
2. **Kernel**: Aplica regra "nunca invente preço"
3. **Dispatcher**: `RESPOND`

### Saída

```json
{
  "text": "Sobre valores, depende do escopo do projeto. Quer agendar 10 min pra gente detalhar?",
  "actions": [
    { "type": "set_custom_field", "field_name": "last_intent", "value": "orcamento" },
    { "type": "set_custom_field", "field_name": "risk_level", "value": "baixo" }
  ]
}
```

---

## Fluxo 3: Lead Quer Agendar

### Entrada

```json
{
  "subscriber_id": "12345",
  "text": "Quero agendar uma reunião",
  "custom_fields": {
    "session_id": "sess_1735...",
    "last_intent": "orcamento"
  }
}
```

### Processamento Interno

1. **Classifier**:
   - Intent: `agendamento`
   - Risk: `baixo`
2. **Dispatcher**: Detecta `wantsToSchedule` → `SEND_CALENDLY`
3. **URL construída** com tracking

### Saída

```json
{
  "text": "Aqui está o link para agendar:\n\n📅 https://calendly.com/lux-sales?lead_id=lead_12345&session_id=sess_1735...&source=agent",
  "actions": [
    { "type": "add_tag", "value": "calendly_sent" },
    { "type": "set_custom_field", "field_name": "last_intent", "value": "agendamento" },
    { "type": "set_custom_field", "field_name": "calendly_sent", "value": "true" }
  ]
}
```

---

## Fluxo 4: Retorno após 3 dias

### Entrada

```json
{
  "subscriber_id": "12345",
  "text": "Oi, vim ver se vocês podem me ajudar",
  "custom_fields": {
    "session_id": "sess_1735...",
    "last_intent": "agendamento"
  }
}
```

### Processamento Interno

1. **Sessão recuperada**: `days_since_last: 3`
2. **AOS**: Detecta `returning_recent: true`
3. **Opener selecionado**: "Oi! Bom te ver de novo. Em que posso ajudar?"

### Saída

```json
{
  "text": "Oi! Bom te ver de novo. Em que posso ajudar?",
  "actions": []
}
```

---

## Fluxo 5: Objeção Repetida → Handoff

### Estado Anterior

- `objection_count`: 1
- `last_objection`: "Tá muito caro"

### Entrada

```json
{
  "subscriber_id": "12345",
  "text": "Ainda acho caro demais",
  "custom_fields": {}
}
```

### Processamento Interno

1. **Classifier**:
   - Intent: `objecao`
   - Risk: `medio`
2. **detectRepeatedObjection**: `true` (similaridade > 50%)
3. **same_objection_count**: 2
4. **Dispatcher**: `shouldHandoff` → `true`
5. **Action**: `REQUEST_HANDOFF`

### Saída

```json
{
  "text": "Entendi. Vou passar sua conversa pro nosso especialista. Ele vai te chamar em breve, ok?",
  "actions": [
    { "type": "add_tag", "value": "handoff_requested" },
    { "type": "add_tag", "value": "handoff_objecao_repetida" },
    { "type": "set_custom_field", "field_name": "handoff_reason", "value": "objecao_repetida" },
    { "type": "set_custom_field", "field_name": "handoff_at", "value": "2025-12-28T22:30:00Z" }
  ]
}
```

---

## Fluxo 6: Lead Pede Humano

### Entrada

```json
{
  "subscriber_id": "12345",
  "text": "Quero falar com uma pessoa de verdade",
  "custom_fields": {}
}
```

### Processamento Interno

1. **Classifier**:
   - Intent: `outro`
   - Risk: `alto`
2. **Dispatcher**: `shouldHandoff` detecta "pessoa real" → `true`
3. **Action**: `REQUEST_HANDOFF`

### Saída

```json
{
  "text": "Entendi. Vou passar sua conversa pro nosso especialista. Ele vai te chamar em breve, ok?",
  "actions": [
    { "type": "add_tag", "value": "handoff_requested" },
    { "type": "add_tag", "value": "handoff_solicitado_pelo_lead" },
    { "type": "set_custom_field", "field_name": "handoff_reason", "value": "solicitado_pelo_lead" }
  ]
}
```
