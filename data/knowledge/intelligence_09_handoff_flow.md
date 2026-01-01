# 🧠 Módulo: Handoff Flow

## 🎯 Essência Executiva:
O fluxo de handoff automatiza a transição de uma conversa para um atendimento humano, registrando a solicitação em uma fila e atualizando o status da conversa. Uma mensagem é enviada ao cliente informando que um atendente humano irá responder em breve. Todo o processo é registrado para fins de auditoria e análise.

## 📜 Regras e Fatos:
- O fluxo é ativado por um webhook que recebe dados da conversa.
- Os dados da conversa são inseridos na tabela `handoff_queue` com informações como `conversation_id`, `contact_id`, `reason`, `trigger_type` e `priority`.
- O status da conversa é atualizado para 'handoff' no banco de dados.
- Uma mensagem é enviada via WhatsApp ao cliente, informando sobre a transição para atendimento humano.
- O evento de handoff é registrado na tabela `agent_logs` com detalhes do evento e sucesso da operação.

## ⚔️ Táticas Sugeridas:
- Ao explicar o processo para um cliente, destaque a rapidez e eficiência do sistema em garantir que um atendente humano esteja disponível para ajudar.
- Em uma conversa de suporte, reforce que o sistema não apenas encaminha a solicitação, mas também mantém o cliente informado sobre o status do atendimento.
- Use o registro detalhado dos eventos como um ponto de confiança, assegurando ao cliente que todas as interações são monitoradas para garantir qualidade e responsabilidade.