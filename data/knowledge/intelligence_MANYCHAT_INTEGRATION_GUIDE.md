# 🧠 Módulo: Integração ManyChat com LX Agent via WhatsApp

## 🎯 Essência Executiva:
A integração entre ManyChat e LX Agent permite que mensagens do WhatsApp sejam processadas com inteligência humanizada. Utilizando o N8N como middleware, o fluxo de mensagens é capturado, processado e respondido de forma eficiente. A configuração correta garante uma comunicação fluida e personalizada com os usuários.

## 📜 Regras e Fatos:
1. **Arquitetura de Conexão**: ManyChat captura mensagens, N8N orquestra o fluxo, LX Agent processa a inteligência, e ManyChat envia a resposta.
2. **ManyChat**:
   - Crie um fluxo "Default Reply" com um bloco de "Action".
   - Use "Trigger Webhook" para enviar dados ao N8N.
   - JSON enviado deve conter `message`, `wa_id`, e `name`.
3. **N8N**:
   - Recebe dados via Webhook Node (POST).
   - Consulta histórico de mensagens no Supabase/Postgres.
   - Formata histórico para a API do LX Agent.
   - Envia dados formatados para o LX Agent via HTTP Request Node.
   - Salva novas mensagens e respostas no Supabase/Postgres.
   - Envia resposta ao usuário via ManyChat Node.
4. **LX Agent API**:
   - Endpoint `/api/chat` suporta `stream: false`.
   - Processa mensagens e retorna respostas personalizadas.

## ⚔️ Táticas Sugeridas:
1. **Simulação de Digitação**: Utilize o node "Wait" no N8N para adicionar um delay humanizado antes de enviar respostas, simulando a digitação.
2. **Gerenciamento de Erros**: Configure um caminho de failover no N8N para lidar com erros da API, enviando mensagens genéricas ou alertas.
3. **Validação Prévia**: Teste a personalidade da IA no simulador antes de ativar no número oficial, garantindo que as respostas estejam alinhadas com a expectativa do cliente.