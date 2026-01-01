# 🧠 Módulo: Cancelamento de Agendamentos

## 🎯 Essência Executiva:
O fluxo de cancelamento automatiza o processo de verificar e cancelar compromissos futuros de um cliente, enviando notificações via WhatsApp. Ele verifica se há compromissos futuros, cancela-os se existirem, e informa o cliente sobre o status do cancelamento e possíveis penalidades. A comunicação é feita de forma amigável e oferece a opção de reagendar.

## 📜 Regras e Fatos:
- O fluxo é ativado por um webhook que recebe requisições POST no caminho "cancel-flow".
- Consulta compromissos futuros do cliente no banco de dados, limitando a três resultados.
- Verifica se existem compromissos futuros:
  - Se não houver compromissos, informa o cliente e oferece a opção de agendar um novo horário.
  - Se houver compromissos, procede com o cancelamento.
- Executa a função `cancel_appointment` no banco de dados para cancelar o compromisso.
- Formata a mensagem de resposta:
  - Informa o cliente sobre o sucesso do cancelamento.
  - Se o cancelamento ocorrer com menos de 24 horas de antecedência, aplica uma multa e informa o cliente.
  - Oferece a opção de reagendar.
- Envia a mensagem de resposta ao cliente via WhatsApp.

## ⚔️ Táticas Sugeridas:
- **Em Vendas:** Destaque a eficiência e a conveniência do sistema automatizado de cancelamento, que economiza tempo e reduz erros humanos.
- **Em Suporte:** Reforce a política de cancelamento e as condições de multa, garantindo que o cliente esteja ciente das regras e opções disponíveis.
- **Em Conversas de Reagendamento:** Use a mensagem de cancelamento como uma oportunidade para oferecer novos horários, mantendo o cliente engajado e satisfeito com o serviço.