# 🧠 Módulo: Fluxo de Agendamento

## 🎯 Essência Executiva:
O fluxo de agendamento automatiza a interação com o cliente para marcar serviços, verificando a disponibilidade de datas e horários, e confirmando o agendamento via WhatsApp. Ele utiliza uma série de verificações e formatações de dados para garantir que o cliente receba informações claras e precisas sobre suas opções de agendamento. A integração com o WhatsApp permite uma comunicação direta e eficiente com o cliente.

## 📜 Regras e Fatos:
- O fluxo inicia com um webhook que recebe dados de agendamento via método HTTP POST.
- Verifica se o serviço desejado pelo cliente é conhecido; caso contrário, solicita ao cliente que escolha um serviço.
- Verifica se a data do agendamento foi fornecida; se não, solicita ao cliente.
- A data é processada para garantir que seja válida, ajustando para "hoje" ou "amanhã" conforme necessário.
- Consulta o banco de dados para encontrar horários disponíveis para o serviço e data escolhidos.
- Formata os horários disponíveis em uma mensagem clara, oferecendo opções A, B ou C.
- Cria um agendamento no banco de dados com base na escolha do cliente.
- Envia uma mensagem de confirmação ao cliente via WhatsApp, incluindo detalhes do agendamento.

## ⚔️ Táticas Sugeridas:
- **Vendas:** Ao discutir com um cliente, destaque a facilidade e rapidez do nosso sistema de agendamento automatizado, que garante uma experiência sem complicações.
- **Suporte:** Se um cliente tiver problemas com o agendamento, explique que o sistema verifica automaticamente a disponibilidade e sugere alternativas, garantindo que ele sempre tenha opções.
- **Engajamento:** Use a confirmação via WhatsApp como um ponto de contato para reforçar o compromisso com o cliente, oferecendo lembretes e suporte adicional se necessário.