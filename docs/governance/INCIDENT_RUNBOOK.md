# INCIDENT RUNBOOK v1.0 (Manual de Crise)

**Objetivo:** Guia de reação rápida para falhas operacionais.
**Princípio:** Primeiro estanque o sangramento, depois investigue a causa.

---

## CENÁRIO 1: AGENTE FALANDO BESTEIRA (ALUCINAÇÃO CRÍTICA)

*Sintoma: Agente prometendo desconto absurdo, xingando ou saindo do personagem.*

1. **AÇÃO IMEDIATA:** Acesse o Dashboard -> Tela do Cliente -> Botão **"PAUSAR AGENTE"** (Emergency Stop).
    * *Isso deve parar de responder automaticamente e apenas encaminhar para humano.*
2. **COMUNICAÇÃO:** Avise o cliente: "Detectamos uma instabilidade na calibragem e pausamos a IA. Seu atendimento segue manual preventivamente."
3. **ROLLBACK:** Re-publique a versão anterior (`v-1`) que estava estável.
4. **INVESTIGAÇÃO:** Analise os logs da conversa. Ajuste o Prompt/Spec. Re-teste.

## CENÁRIO 2: WHATSAPP PAROU DE RESPONDER (DOWNTIME)

*Sintoma: Cliente manda mensagem e nada acontece.*

1. **VERIFICAÇÃO:**
    * O Webhook da Meta está chegando? (Ver logs de `webhook_events`).
    * O saldo da conta Cloud API acabou? (Cartão recusado na Meta).
    * O Token de acesso expirou?
2. **RESOLUÇÃO:**
    * Se for *Erro 500 no Servidor*: Reinicie o serviço de Runtime.
    * Se for *Meta Down*: Acompanhe status.whatsapp.com e avise o cliente.
    * Se for *Token*: Gere novo token no Business Manager e atualize no Vault.

## CENÁRIO 3: BLOQUEIO / BANIMENTO DE NÚMERO

*Sintoma: Alerta crítico da Meta sobre "Qualidade Baixa" ou número banido.*

1. **AÇÃO IMEDIATA:** Pare qualquer disparo de modelo (Marketing/Reativação).
2. **RECURSO:** Abra chamado na Meta via Business Support (temos prioridade como Parceiro/Tech Provider, mas nem sempre).
3. **CONTINGÊNCIA:** Se o banimento for irreversível, provisione novo número imediatamente (Migração de Emergência).
4. **ANÁLISE:** Verifique se houve *Spam* ou *Templates Reprovados* sendo forçados.

## CENÁRIO 4: TEMPLATE REJEITADO

*Sintoma: Mensagens de "Confirmação" não chegam para usuários fora da janela de 24h.*

1. **CAUSA:** A Meta rejeitou o texto do template ou a categoria (Marketing vs Utilidade).
2. **AÇÃO:**
    * Edite o template no Painel da Meta (mude palavras gatilho).
    * Submeta novamente.
    * Enquanto não aprova, use um template genérico de backup ("Oi, tenho uma atualização sobre seu pedido, pode me responder?").

---

**LISTA DE CONTATOS DE EMERGÊNCIA:**

* Engenharia LX (Você): [Seu Número]
* Suporte Meta: business.facebook.com/help
