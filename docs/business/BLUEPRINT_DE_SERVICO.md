# BLUEPRINT DE SERVIÇO (JORNADA DO CLIENTE)
>
> O passo a passo técnico e operacional desde o "Oi" até a "Fatura Paga".

## FASE 1: ATRAÇÃO & CONVENCIMENTO (O Showroom)

### Passo 1: A Vitrine (Lead Entra)

* **Ação:** Lead acessa `lx-demo.com.br` (nossa Landing Page).
* **Experiência:** Ele NÃO vê um formulário chato. Ele vê uma janela de chat bonita.
* **Interação:** O "Agente Demo" conversa com ele, qualifica (pergunta nicho e volume de leads) e agenda uma reunião de fechamento.

### Passo 2: O Fechamento (Humano)

* **Ação:** Você ou seu time de vendas entra em contato.
* **Ferramenta:** Usa o CRM interno.
* **Contrato:** Envia link de pagamento do Setup Fee.

---

## FASE 2: ONBOARDING TÉCNICO ("O Plug")

### Passo 3: O Ritual de Gênese (Setup - Dia 0)

Aqui a mágica acontece. O cliente pagou e quer ver funcionando.

1. **Formulário de Calibragem:** Envie um Typeform/Forms perguntando:
    * "Se sua marca fosse uma pessoa, quem seria?" (Ex: Steve Jobs, Anitta, Um Avô sábio).
    * "Quais são as 3 perguntas que todo cliente faz?"
    * "Qual o link da sua tabela de preços?"
2. **Configuração do Agente (Backoffice):**
    * Você pega essas respostas e edita o arquivo de Prompt (`ONBOARDING_PROMPT`) ou sobe no Painel de Admin.
3. **Conexão do WhatsApp:**
    * Cliente acessa `painel.lx-intelligence.com/connect`.
    * Lê o QR Code com o WhatsApp da empresa dele.
    * **STATUS:** 🟢 ONLINE.

---

## FASE 3: OPERAÇÃO E MANUTENÇÃO (O Dia a Dia)

### Passo 4: O "Copiloto" (Dia 1 em diante)

O cliente não quer "ficar olhando". Ele quer resultado.

* **Dashboard do Cliente:** Ele tem acesso a uma tela simples com:
  * **Chats em Tempo Real:** Vê a IA conversando.
  * **Botão de Pânico:** "Assumir Conversa" (A IA pausa e o humano digita).
  * **Resumo do Dia:** "Hoje falei com 50 pessoas, 5 agendaram visita."

### Passo 5: A Auditoria (O Conselho)

Semanalmente, nosso sistema roda uma auditoria automática.

* **Relatório Automático:** "Olá [Cliente], essa semana a IA detectou que muitos clientes reclamaram do preço. Sugerimos criar uma promoção."

---

## FASE 4: SUPORTE E SEGURANÇA (O Protocolo de Crise)

### O que acontece se a IA falar besteira?

1. **Gatilho de Segurança:** Se a IA detectar palavras como "processo", "advogado", "absurdo", "chame o gerente".
2. **Ação Imediata:**
    * A IA diz: *"Entendi perfeitamente sua frustração. Estou transferindo para a gerência humana agora."*
    * Ela envia um alerta no Telegram do Dono/Cliente.
    * Ela entra em modo "Mudo" (pausa) naquele chat.

### O suporte técnico

* **Bug no sistema?** Você recebe o alerta no seu painel de admin.
* **Cliente quer mudar o preço?** Ele manda um áudio no WhatsApp de Suporte da LX e a própria IA de Suporte atualiza a base de conhecimento dele.
