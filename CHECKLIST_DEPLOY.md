# 🚀 GUIA DE DEPLOY (Rumo à Produção)

Para entregar este software ao cliente, siga estes 3 passos.

---

## 1. 🌐 COLOCAR NO AR (Hospedagem)

Recomendação: **Vercel** (Melhor compatibilidade com Next.js).

1. Crie uma conta na [Vercel](https://vercel.com).
2. Instale a CLI: `npm i -g vercel`.
3. Rode o comando na pasta do projeto:

   ```bash
   vercel
   ```

4. Siga as instruções (Aceite os padrões).
5. **Importante:** Vá nas configurações do projeto na Vercel e adicione as **Variáveis de Ambiente** (`.env.local`):
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_USER` / `ADMIN_PASS`

---

## 2. 📱 CONECTAR WHATSAPP REAL

O sistema atual precisa de um "Gateway" para falar com o WhatsApp.

**Opção A: Evolution API (Recomendada)**

1. Contrate uma instância ou instale a [Evolution API](https://github.com/EvolutionAPI/evolution-api) em um VPS.
2. No arquivo `core/integrations/whatsapp.ts` (que precisa ser criado), configure para enviar requisições POST para sua Evolution API.
3. Aponte o Webhook da Evolution API para: `https://seu-site-vercel.app/api/webhook/whatsapp`.

**Opção B: WppConnect (Self-Hosted)**

1. Requer servidor Node.js rodando 24/7 (não funciona bem em serverless/Vercel puro).

---

## 3. 🗄️ BANCO DE DADOS (Supabase)

Garanta que as tabelas existem no projeto de produção.

1. Vá no Painel do Supabase > SQL Editor.
2. Copie o conteúdo de `scripts/supabase-council.sql`.
3. Cole e execute (RUN).
4. Faça o mesmo para `scripts/supabase-proactive.sql`.

---

## ✅ CHECKLIST FINAL (Antes de enviar o link)

- [ ] Site abre sem erros (HTTPS)?
- [ ] Senha do Dashboard funciona?
- [ ] Monitor em `/dashboard` mostra "System: ONLINE"?
- [ ] Chat responde rápido?

Se tudo for SIM, você pode emitir a Nota Fiscal. 💰
