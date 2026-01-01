# 🧠 Módulo: Fluxo de Check-in

## 🎯 Essência Executiva:
O fluxo de check-in automatiza a verificação e confirmação de presença em uma fila de espera, enviando notificações via WhatsApp. Ele valida se o usuário ainda está na fila e dentro do prazo, atualiza o status para "checked_in" e registra o evento no banco de dados. Mensagens de sucesso ou falha são enviadas ao usuário dependendo do resultado da verificação.

## 📜 Regras e Fatos:
- O fluxo inicia com um webhook que recebe uma solicitação POST no caminho "checkin-flow".
- Verifica o status na fila de espera para o `contact_id` fornecido, assegurando que o status seja 'notified' e o prazo de resposta não tenha expirado.
- Se a verificação for bem-sucedida, o status é atualizado para 'checked_in' e a posição global é retornada.
- Mensagem de sucesso: "Perfeito! 🎉 Te esperamos no Haven. Pode vir que sua vez está garantida!"
- Mensagem de falha: "Ops! Não encontrei sua vez na fila ou seu tempo expirou. 😔 Quer entrar na fila novamente?"
- As mensagens são enviadas via WhatsApp usando a API do Facebook.
- Todos os eventos de check-in são registrados no banco de dados `agent_logs`.

## ⚔️ Táticas Sugeridas:
- **Vendas**: Destaque a eficiência do sistema automatizado de check-in para reduzir o tempo de espera e melhorar a experiência do cliente.
- **Suporte**: Explique como o sistema notifica automaticamente os usuários sobre seu status na fila, garantindo que eles sejam informados em tempo real.
- **Demonstração**: Mostre como o fluxo lida com diferentes cenários (sucesso e falha) e como as mensagens personalizadas são enviadas diretamente para o WhatsApp do usuário.