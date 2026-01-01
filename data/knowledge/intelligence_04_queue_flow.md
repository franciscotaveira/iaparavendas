# 🧠 Módulo: Fluxo de Fila

## 🎯 Essência Executiva:
O fluxo de fila automatiza a verificação de elegibilidade de serviços e gerencia a adição de clientes a uma fila de atendimento. Se o serviço não for elegível, o cliente é informado sobre a necessidade de agendamento prévio. Caso contrário, o cliente é adicionado à fila e recebe informações sobre sua posição e tempo estimado de espera.

## 📜 Regras e Fatos:
- O fluxo inicia com um webhook que recebe dados via método HTTP POST.
- Verifica a elegibilidade do serviço consultando o banco de dados PostgreSQL.
- Se o serviço for elegível, o cliente é adicionado à fila através de uma função SQL.
- Se o serviço não for elegível, uma mensagem é gerada informando a necessidade de agendamento.
- Mensagens são formatadas e enviadas via WhatsApp usando a API do Facebook.
- Todas as interações são registradas em logs no banco de dados para auditoria.

## ⚔️ Táticas Sugeridas:
- Ao explicar o sistema para um cliente, destaque a eficiência do processo automatizado de verificação e fila.
- Enfatize a conveniência de receber atualizações em tempo real via WhatsApp, melhorando a experiência do cliente.
- Use o registro de logs como um ponto de confiança, garantindo que todas as interações são monitoradas e auditáveis.