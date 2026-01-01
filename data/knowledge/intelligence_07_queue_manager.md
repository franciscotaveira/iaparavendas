# 🧠 Módulo: Gerenciamento de Fila

## 🎯 Essência Executiva:
O sistema de gerenciamento de fila automatiza a atualização de status de entradas na fila a cada 5 minutos, expira entradas antigas e notifica os próximos na fila. As notificações são enviadas via WhatsApp, permitindo que os usuários confirmem ou desistam de sua vez. Todas as ações são registradas para auditoria e análise.

## 📜 Regras e Fatos:
- O sistema verifica e atualiza a fila a cada 5 minutos.
- Entradas com status 'queued' e expiradas são marcadas como 'expired'.
- Entradas notificadas que não responderam dentro do prazo são marcadas como 'no_show'.
- O próximo na fila de cada categoria é selecionado se não houver ninguém já notificado.
- Notificações são enviadas via WhatsApp, com um prazo de resposta de 10 minutos.
- As notificações incluem opções para confirmar ou desistir.
- Todas as operações são registradas no banco de dados para controle.

## ⚔️ Táticas Sugeridas:
- Ao explicar o sistema para um cliente, destaque a eficiência do processo automatizado que garante que ninguém perca sua vez na fila.
- Enfatize a conveniência das notificações via WhatsApp, que permitem respostas rápidas e fáceis.
- Use o registro de auditoria como um ponto de venda para demonstrar a transparência e a capacidade de análise do sistema.
- Em suporte, oriente os usuários sobre como responder às notificações para garantir que suas posições na fila sejam mantidas.