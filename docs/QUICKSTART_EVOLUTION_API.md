# 🚀 Quick Start: Conexão WhatsApp via QR Code (Evolution API)

## Visão Geral

Este guia permite conectar um cliente ao WhatsApp em **menos de 5 minutos**, sem precisar de aprovação da Meta. Ideal para:

- ✅ Clínicas pequenas (até 20 msgs/dia)
- ✅ Testes e POCs
- ✅ Clientes que precisam começar urgente
- ✅ Validação antes de migrar para Meta API

---

## ⚠️ Importante

| Aspecto | Valor |
|---------|-------|
| **Limite seguro** | ~200 mensagens/dia |
| **Risco de ban** | Baixo se respeitado limite |
| **Custo** | R$ 0,00 |
| **Estabilidade** | ~95% (pode precisar reconectar) |

**Recomendação**: Para operações maiores, migrar para Meta Cloud API.

---

## 🔧 Pré-Requisitos

1. Docker instalado
2. Número de WhatsApp dedicado (não precisa ser número novo)
3. Celular com WhatsApp logado

---

## 📋 Passo a Passo

### Passo 1: Subir o Evolution API

```bash
cd lx-demo-interface/docker
docker-compose -f docker-compose.evolution.yml up -d
```

Verifique se está rodando:

```bash
curl http://localhost:8080/
```

### Passo 2: Criar Instância do Cliente

```bash
curl -X POST http://localhost:8080/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: lx-evolution-secret-key-2024" \
  -d '{
    "instanceName": "clinica-exemplo",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'
```

### Passo 3: Obter QR Code

```bash
curl http://localhost:8080/instance/connect/clinica-exemplo \
  -H "apikey: lx-evolution-secret-key-2024"
```

Isso retorna o QR Code em base64. Você pode:

- Exibir na dashboard do cliente
- Ou acessar a URL diretamente

### Passo 4: Escanear QR Code

1. Abra o WhatsApp no celular
2. Vá em **Configurações** > **Dispositivos Conectados**
3. Clique **Conectar Dispositivo**
4. Escaneie o QR Code

### Passo 5: Verificar Conexão

```bash
curl http://localhost:8080/instance/connectionState/clinica-exemplo \
  -H "apikey: lx-evolution-secret-key-2024"
```

Esperado: `{ "state": "open" }`

### Passo 6: Criar Tenant no Supabase

```sql
INSERT INTO tenants (name, slug, evolution_instance, evolution_connected)
VALUES (
    'Clínica Exemplo',
    'clinica-exemplo',
    'clinica-exemplo',
    true
);
```

### Passo 7: Testar Envio

```bash
curl -X POST http://localhost:8080/message/sendText/clinica-exemplo \
  -H "Content-Type: application/json" \
  -H "apikey: lx-evolution-secret-key-2024" \
  -d '{
    "number": "5511999999999",
    "text": "Olá! Este é um teste do LX Agent."
  }'
```

---

## 🔄 Migração para Meta API

Quando o cliente crescer ou precisar de mais estabilidade:

1. Siga o [Playbook Meta API](./PLAYBOOK_ONBOARDING_WHATSAPP.md)
2. Atualize o tenant no Supabase:

```sql
UPDATE tenants 
SET 
    phone_number_id = 'META_PHONE_ID',
    evolution_instance = NULL,
    evolution_connected = false
WHERE slug = 'clinica-exemplo';
```

1. O sistema automaticamente passa a usar Meta

---

## 🛠️ Comandos Úteis

### Ver status de todas as instâncias

```bash
curl http://localhost:8080/instance/fetchInstances \
  -H "apikey: lx-evolution-secret-key-2024"
```

### Desconectar instância

```bash
curl -X DELETE http://localhost:8080/instance/logout/clinica-exemplo \
  -H "apikey: lx-evolution-secret-key-2024"
```

### Ver logs do container

```bash
docker logs -f lx-evolution-api
```

### Reiniciar Evolution

```bash
docker restart lx-evolution-api
```

---

## 🚨 Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| QR Code não aparece | Instância já conectada | Delete e recrie |
| Desconecta frequente | WhatsApp Web logado | Feche outras sessões |
| Mensagens não chegam | Webhook não configurado | Verifique WEBHOOK_GLOBAL_URL |
| Erro 401 | API Key errada | Verifique AUTHENTICATION_API_KEY |

---

## 📊 Comparativo Final

| Aspecto | Evolution (QR) | Meta (Oficial) |
|---------|----------------|----------------|
| Setup | 5 min | 2-4 dias |
| Custo | Grátis | ~$0.05/msg |
| Limite | ~200/dia | Ilimitado |
| Estabilidade | 95% | 99.9% |
| Suporte | Comunidade | Meta |
| **Quando usar** | POC, Clínicas pequenas | Produção, Escala |

---

*Última atualização: 2025-12-31*
*Versão: 1.0*
