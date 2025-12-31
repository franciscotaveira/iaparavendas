# 🚀 Playbook de Onboarding: Integração WhatsApp Business API

## Visão Geral

Este documento descreve o processo completo para conectar um cliente à plataforma LX Agents via WhatsApp Business API. Tempo estimado: **30-45 minutos**.

---

## 📋 Pré-Requisitos do Cliente

Antes de iniciar, o cliente precisa ter:

1. ✅ **Conta Meta Business** verificada (business.facebook.com)
2. ✅ **Número de telefone** dedicado para o bot (não pode estar vinculado a WhatsApp pessoal)
3. ✅ **Acesso Admin** ao Business Manager

---

## 🔧 FASE 1: Configuração no Meta (Cliente faz com seu suporte)

### Passo 1.1: Criar App no Meta for Developers

1. Acesse: https://developers.facebook.com/apps
2. Clique **Criar App**
3. Selecione **Outros** → **Empresa**
4. Nome: `[Nome da Empresa] Bot`
5. Vincule ao Business Manager do cliente

### Passo 1.2: Adicionar Produto WhatsApp

1. No dashboard do App, clique **Adicionar Produto**
2. Selecione **WhatsApp**
3. Clique **Configurar**

### Passo 1.3: Registrar Número de Telefone

1. Em **WhatsApp > Configuração da API**
2. Clique **Adicionar número de telefone**
3. Insira o número dedicado
4. Verifique via SMS ou ligação
5. **Anote o `Phone Number ID`** (ex: `853596591180846`)

### Passo 1.4: Criar System User (Token Permanente)

1. Vá para: https://business.facebook.com/settings/system-users
2. Clique **Adicionar**
3. Nome: `LX Agent Bot`
4. Função: **Admin**
5. Crie o usuário

### Passo 1.5: Gerar Token Permanente

1. Clique no System User criado
2. **Gerar novo token**
3. Selecione o App do passo 1.1
4. Marque as permissões:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
5. **COPIE O TOKEN** (só aparece 1x!)
6. Validade: **Nunca expira** ✅

### Passo 1.6: Associar Ativo ao System User

1. Na página do System User
2. **Adicionar Ativos** → Apps
3. Selecione o App
4. Permissão: **Controle total**

---

## 🔗 FASE 2: Configuração do Webhook (Você faz)

### Passo 2.1: Configurar Webhook no Meta

1. No App, vá em **WhatsApp > Configuração**
2. Em **Webhook**, clique **Editar**
3. **URL do Callback**: `https://[SEU_DOMINIO]/api/webhooks/whatsapp`
4. **Verificar Token**: Crie um token único (ex: `lx-cliente-[NOME]-v1`)
5. Clique **Verificar e Salvar**

### Passo 2.2: Assinar Campos do Webhook

Após verificar, assine os campos:
- ✅ `messages`
- ✅ `message_deliveries` (opcional)
- ✅ `message_reads` (opcional)

---

## ⚙️ FASE 3: Configuração no Servidor LX (Você faz)

### Passo 3.1: Criar Tenant no Supabase

```sql
INSERT INTO tenants (name, slug, phone_number_id)
VALUES (
    'Nome do Cliente',
    'cliente-slug',
    'PHONE_NUMBER_ID_DO_PASSO_1.3'
);
```

### Passo 3.2: Configurar Variáveis de Ambiente

No arquivo `.env` do tenant (ou config no banco):

```env
# Meta WhatsApp API
META_ACCESS_TOKEN=TOKEN_DO_PASSO_1.5
META_PHONE_NUMBER_ID=ID_DO_PASSO_1.3
META_VERIFY_TOKEN=TOKEN_DO_PASSO_2.1
META_BUSINESS_ID=ID_DO_BUSINESS_MANAGER
```

---

## 🧪 FASE 4: Teste de Validação

### Teste 1: Verificar Webhook
```bash
curl -X GET "https://[SEU_DOMINIO]/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=[TOKEN]&hub.challenge=test123"
# Esperado: test123
```

### Teste 2: Enviar Mensagem de Teste
1. Adicione seu número à lista de teste (em Modo Dev)
2. Envie "Oi" do WhatsApp
3. Verifique logs do Worker
4. Confirme resposta recebida

### Teste 3: Validar Token Permanente
```bash
curl -X GET "https://graph.facebook.com/v18.0/[PHONE_NUMBER_ID]?access_token=[TOKEN]"
# Esperado: JSON com dados do número
```

---

## 📊 FASE 5: Go-Live Checklist

Antes de ativar em produção:

- [ ] Número verificado no Meta
- [ ] Token permanente funcionando
- [ ] Webhook respondendo 200
- [ ] Worker processando mensagens
- [ ] Resposta chegando no WhatsApp
- [ ] Histórico salvando no Supabase
- [ ] Cliente adicionado à lista de números permitidos (ou App Live)

---

## 🚨 Troubleshooting Comum

| Erro | Causa | Solução |
|------|-------|---------|
| `Session expired` (190) | Token temporário expirou | Use System User Token |
| `Recipient not in allowed list` (131030) | App em modo Dev | Adicione número ou publique App |
| `Invalid access token` (190) | Token inválido | Gere novo token no System User |
| `Rate limit exceeded` | Muitas requisições | Implemente fila/throttling |
| Webhook não verifica | Token diferente | Confirme META_VERIFY_TOKEN |

---

## 📁 Dados a Coletar do Cliente

| Campo | Onde Encontrar | Exemplo |
|-------|----------------|---------|
| Business ID | Business Settings | `1364855432097459` |
| Phone Number ID | WhatsApp > API Setup | `853596591180846` |
| Access Token | System User | `EAAd...` |
| App ID | Developer Console | `123456789` |
| Verify Token | Você define | `lx-cliente-acme-v1` |

---

## ⏱️ Timeline de Onboarding

| Dia | Atividade |
|-----|-----------|
| D0 | Reunião inicial, coletar pré-requisitos |
| D1 | Cliente cria App + System User |
| D2 | Você configura webhook + tenant |
| D3 | Testes em modo Dev |
| D4 | Go-live (publish App) |

---

*Última atualização: 2025-12-30*
*Versão: 1.0*
