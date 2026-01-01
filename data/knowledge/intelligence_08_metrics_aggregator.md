# 🧠 Módulo: Agregador de Métricas Diárias

## 🎯 Essência Executiva:
O Agregador de Métricas Diárias é um sistema automatizado que coleta e armazena dados operacionais do dia anterior, como conversas, mensagens, agendamentos e penalidades, em um banco de dados PostgreSQL. Ele é acionado diariamente às 01:00 e garante que as métricas sejam atualizadas ou inseridas conforme necessário. O processo é registrado para garantir a rastreabilidade e o sucesso da execução.

## 📜 Regras e Fatos:
- O sistema é acionado diariamente às 01:00 usando uma expressão cron.
- Coleta dados do dia anterior, incluindo:
  - Total de conversas, mensagens recebidas e enviadas.
  - Total de agendamentos, cancelamentos e ausências.
  - Total de entradas, completados e expirados na fila de espera.
  - Total de transferências e tokens LLM usados.
  - Receita gerada e penalidades coletadas.
- Os dados são inseridos na tabela `metrics_daily` do banco de dados PostgreSQL.
- Em caso de conflito de data, os dados existentes são atualizados.
- A execução do processo é registrada na tabela `agent_logs` para monitoramento.

## ⚔️ Táticas Sugeridas:
- **Vendas:** Destaque a automação e precisão do sistema para empresas que buscam otimizar a coleta de dados operacionais e melhorar a tomada de decisões baseada em dados.
- **Suporte:** Explique como o sistema garante a integridade dos dados e a atualização automática, minimizando a necessidade de intervenção manual e reduzindo erros.
- **Demonstração:** Mostre como a execução diária e o registro de logs proporcionam uma visão clara e confiável das operações diárias, facilitando auditorias e análises de desempenho.