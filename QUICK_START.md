# 🚀 QUICK START — LX AGENTS SYSTEM

## Acesso Rápido

### 🌐 Sites

- **Landing:** <https://mycodingteam.com>
- **Dashboard:** <https://mycodingteam.com/dashboard>
- **Login:** <https://mycodingteam.com/login>

### 🔐 Credenciais

- **Dashboard Password:** Configurada no Vercel (DASHBOARD_PASSWORD)

### 🤖 Bot Telegram

- **@Meuassistenteunico_bot**
- Comandos: `/start`, `/status`, ou texto livre

### 📊 APIs

```bash
# Health Check
curl https://mycodingteam.com/api/health

# Chat
curl -X POST https://mycodingteam.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"oi"}],"stream":false}'

# Agentes
curl https://mycodingteam.com/api/agents
```

---

## 📋 Checklist Operacional

### Diário

- [ ] Verificar leads no Supabase
- [ ] Responder WhatsApp/Telegram
- [ ] Monitorar campanhas (se ativas)

### Semanal

- [ ] Analisar métricas GA4/Clarity
- [ ] Follow-up de prospects
- [ ] Atualizar roadmap

---

## 🛠️ Troubleshooting

### Telegram não responde

1. Verificar webhook: `curl https://api.telegram.org/bot{TOKEN}/getWebhookInfo`
2. Deve apontar para: `https://www.mycodingteam.com/api/hooks/telegram`

### Dashboard não abre

1. Verificar variável DASHBOARD_PASSWORD no Vercel
2. Fazer redeploy após adicionar

### Chat lento

1. Verificar OpenRouter credits
2. Verificar logs no Vercel

---

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `PRODUCTION_ROADMAP.md` | Status e próximos passos |
| `docs/AUDITORIA_DEFINITIVA.md` | Diagnóstico completo |
| `docs/campaigns/SPRINT_VIRADA_2026.md` | Copies para ads |
| `docs/proposals/` | Propostas comerciais |
| `knowledge/` | Base de conhecimento dos agentes |
| `.env.local` | Variáveis locais |

---

## 🎯 Contatos

- **CEO:** Francisco
- **Prospect Ativo:** Jadiel (Massa Promotora)
- **WhatsApp:** +55 49 98844-7562

---

*Última atualização: 29/12/2024 23:30*
