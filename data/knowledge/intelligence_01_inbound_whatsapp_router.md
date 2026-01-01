# 🧠 Módulo: Roteador de Mensagens Inbound do WhatsApp

## 🎯 Essência Executiva:
Este fluxo automatiza o processamento de mensagens recebidas pelo WhatsApp, identificando a intenção do usuário e direcionando a mensagem para o fluxo apropriado. Ele atualiza ou insere contatos no banco de dados, gerencia conversas e registra eventos para análise posterior. A automação garante respostas rápidas e precisas, melhorando a eficiência do atendimento ao cliente.

## 📜 Regras e Fatos:
- **Webhook de Recepção**: Configurado para receber mensagens via método POST no endpoint "whatsapp".
- **Resposta Inicial**: Retorna um status 200 "OK" para confirmar o recebimento da mensagem.
- **Filtro de Mensagens**: Verifica se a mensagem recebida contém conteúdo válido.
- **Normalização de Dados**: Extrai e formata dados relevantes da mensagem, como número de telefone, ID da mensagem, tipo de mensagem e conteúdo.
- **Gerenciamento de Contatos**: Atualiza ou insere contatos no banco de dados PostgreSQL, evitando duplicações.
- **Gerenciamento de Conversas**: Verifica se há uma conversa aberta para o contato; caso contrário, inicia uma nova.
- **Registro de Mensagens**: Insere a mensagem no banco de dados, associando-a à conversa correta.
- **Classificação de Intenções**: Envia o conteúdo da mensagem para um classificador de intenções para determinar o próximo passo.
- **Roteamento por Intenção**: Direciona a mensagem para o fluxo apropriado (agendamento, fila, cancelamento, transferência, check-in ou informações) com base na intenção identificada.
- **Geração de Resposta**: Cria uma mensagem de resposta padrão para interações não específicas.
- **Envio de Mensagens**: Envia a resposta gerada de volta ao usuário via WhatsApp.
- **Registro de Eventos**: Registra cada evento de mensagem no banco de dados para auditoria e análise.

## ⚔️ Táticas Sugeridas:
- **Vendas**: Destaque a capacidade do sistema de automatizar o atendimento ao cliente, reduzindo o tempo de resposta e aumentando a satisfação do cliente.
- **Suporte**: Explique como o fluxo gerencia eficientemente as conversas, garantindo que nenhuma mensagem seja perdida e que todas as interações sejam registradas para referência futura.
- **Demonstração**: Mostre como o sistema pode ser configurado para diferentes intenções, personalizando o atendimento de acordo com as necessidades do cliente.
- **Análise de Dados**: Enfatize a importância do registro de eventos para análise de desempenho e melhoria contínua dos processos de atendimento.