# 🧠 Módulo: Classificador de Intenções

## 🎯 Essência Executiva:
O Classificador de Intenções é um sistema automatizado que identifica e categoriza as intenções dos clientes em um salão de beleza, utilizando um modelo de linguagem para processar mensagens e determinar a ação apropriada. Ele analisa o contexto da conversa, classifica a intenção do cliente e atualiza os registros de conversação e mensagens com base na intenção detectada. O sistema também possui mecanismos para lidar com loops de intenção e solicitações de transferência para atendimento humano.

## 📜 Regras e Fatos:
- **Webhook de Intenção**: Recebe mensagens via método POST no endpoint "intent-classifier".
- **Consulta de Contexto**: Executa uma consulta SQL para obter o contexto da conversa, incluindo resumo, intenção atual, contagem de loops, nome do contato, preferências, total de compromissos e mensagens recentes.
- **Construção de Prompt LLM**: Cria um prompt para o modelo de linguagem, especificando intenções possíveis como saudação, agendamento, fila, cancelamento, informação, transferência, check-in e outras.
- **Chamada LLM**: Envia o prompt para um modelo de linguagem (ex: GPT-4) para classificação da intenção.
- **Análise de Resposta**: Analisa a resposta do LLM, valida a intenção e ajusta a confiança. Identifica palavras-chave para transferência e verifica solicitações explícitas de atendimento humano.
- **Atualização de Conversação**: Atualiza a intenção atual e a contagem de loops na base de dados.
- **Atualização de Mensagem**: Atualiza a intenção detectada e a confiança na mensagem mais recente.
- **Verificação de Loop**: Força a transferência para atendimento humano se a intenção se repetir mais de cinco vezes.
- **Registro de Classificação**: Insere logs de eventos de classificação no banco de dados.
- **Preparação de Saída**: Prepara a saída final com detalhes da intenção, urgência, data, hora, período, preferência de funcionário, confiança e outros metadados.

## ⚔️ Táticas Sugeridas:
- **Vendas**: Explique como o sistema automatiza a identificação de intenções, melhorando a eficiência do atendimento ao cliente e reduzindo a necessidade de intervenção humana.
- **Suporte**: Destaque a capacidade do sistema de lidar com loops de intenção e transferir automaticamente para um atendente humano quando necessário, garantindo que os clientes recebam a atenção adequada.
- **Demonstração**: Mostre como o sistema utiliza dados contextuais para personalizar a experiência do cliente, aumentando a satisfação e fidelidade.