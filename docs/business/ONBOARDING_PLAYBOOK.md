# PLAYBOOK DE ONBOARDING (RITUAL DE ATIVAÇÃO)
>
> O script exato para você ou seu time de CS (Customer Success) ativar um cliente novo.

## ETAPA 1: O BRIEFING (EXTRAÇÃO DE ALMA)

*Nossa meta não é configurar um software, é clonar a alma do negócio.*

**Realize uma call de 30 min ou envie este questionário:**

### A. Identidade & Tom de Voz

1. **Quem responde hoje?** (Ex: "Sou eu, Ana, dona da clínica").
2. **Qual o nível de formalidade?** (0 a 10).
    * (0 = "E aí mano", 10 = "Prezadíssimo Sr.").
3. **Quais emojis são proibidos?** (Ex: "Odeio berinjela e foguinho").
4. **Assinatura:** O robô deve assinar como quem? (Ex: "Ass: Ana, via IA" ou "Ass: Equipe Vendas").

### B. Regras de Negócio (O Check-Mate)

5. **Qual a meta final da conversa?**
    * [ ] Agendar Reunião
    * [ ] Vender no Link Direto
    * [ ] Tirar Dúvidas
2. **Qual a Objeção nº 1?** (Ex: "Tá caro").
    * *Como a Ana responde hoje?* (Copiar a resposta exata dela).
3. **Existe algum "Segredo"?** (Ex: "Damos 10% de desconto se pagar no PIX, mas só ofereça se o cliente insistir").

---

## ETAPA 2: A CONFIGURAÇÃO TÉCNICA (O BACKOFFICE)

**Checklist do Implementador (Você):**

1. [ ] **Criar Tenant:** Criar o cliente no Supabase (`lxc_clients`).
2. [ ] **Configurar Prompt:**
    * Pegar o `BASE_PROMPT` padrão.
    * Injetar as respostas do Briefing.
    * Ajustar os parâmetros de "Senioridade" e "Vulnerabilidade".
3. [ ] **Ingestão de Knowledge:**
    * Converter Tabela de Preços para Texto Limpo.
    * Adicionar ao Vector DB (RAG).

---

## ETAPA 3: O "GO LIVE" (ATIVAÇÃO)

**Script de Ativação (Enviar no WhatsApp do Cliente):**

> "Olá [Cliente]! A consciência digital da [Empresa Dele] está pronta. 🧠✨
>
> Para ativá-la, preciso que você:
>
> 1. Tenha o celular da empresa em mãos.
> 2. Acesse este link no computador: `[SEU_LINK_PAINEL]`
> 3. Na aba 'Conexão', escaneie o QR Code.
>
> 🚨 **Aviso Importante:** Assim que escanear, a IA vai começar a ler as mensagens. Se tiver alguma conversa 'pessoal' nesse número, arquive agora."

---

## ETAPA 4: O TESTE DE FOGO (VALIDAÇÃO)

Antes de liberar, faça o "Teste de Turing Vendedor":

1. Mande mensagem de um número desconhecido.
2. Finja ser um cliente chato (pergunte preço, reclame, demore pra responder).
3. Veja se a IA manteve a postura definida no Briefing.
4. Aprovado? Avise o cliente: "Está rodando. Boas vendas!"
