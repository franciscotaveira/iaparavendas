# 🧠 Módulo: Followup Dispatcher

## 🎯 Essência Executiva:
O Followup Dispatcher é um sistema automatizado que envia mensagens de lembrete e confirmação via WhatsApp para clientes, baseado em agendamentos. Ele verifica a cada 5 minutos se há mensagens pendentes para envio e atualiza o status de cada tentativa, seja ela bem-sucedida ou falha. O sistema é projetado para otimizar a comunicação com clientes, garantindo que eles recebam lembretes oportunos sobre seus compromissos.

## 📜 Regras e Fatos:
- O sistema verifica a cada 5 minutos se há mensagens de follow-up pendentes.
- As mensagens são enviadas via WhatsApp usando a API do Facebook.
- O sistema busca até 10 trabalhos de follow-up que estão na fila e prontos para envio.
- Mensagens são personalizadas com base no tipo de follow-up: confirmação 24h antes ou lembrete 2h antes.
- Se o envio for bem-sucedido, o status do trabalho é atualizado para 'sent' e a data de envio é registrada.
- Se o envio falhar, o contador de tentativas é incrementado e o status é atualizado para 'failed' se o número máximo de tentativas for atingido.
- O sistema utiliza credenciais específicas para acessar o banco de dados PostgreSQL e a API do WhatsApp.

## ⚔️ Táticas Sugeridas:
- **Vendas:** Destaque a eficiência do sistema em manter os clientes informados e reduzir faltas em compromissos, aumentando a satisfação e fidelização.
- **Suporte:** Explique como o sistema gerencia automaticamente as tentativas de envio, garantindo que os clientes recebam suas mensagens ou que falhas sejam rapidamente identificadas e tratadas.
- **Demonstração:** Mostre a personalização das mensagens e a integração com o WhatsApp, enfatizando a facilidade de uso e a automação do processo de comunicação.