# 🧠 Módulo: Health Check do Sistema

## 🎯 Essência Executiva:
O Health Check do sistema verifica a integridade do serviço "Lx AgendaOps" através de um webhook que consulta a conexão com o banco de dados e formata uma resposta com o status atual. Ele utiliza um método HTTP GET para acionar a verificação e retorna informações sobre a conexão com o banco de dados, incluindo o tempo do servidor e a contagem de contatos. A resposta é formatada em um objeto JSON que indica o status do serviço, a versão e o timestamp atual.

## 📜 Regras e Fatos:
- O Health Check é ativado por um webhook usando o método HTTP GET no caminho "health".
- A verificação de conexão com o banco de dados é feita através de uma consulta SQL que retorna o tempo atual do servidor e a contagem de contatos.
- A resposta do Health Check é formatada em JSON, incluindo status, nome do serviço, versão, timestamp, e detalhes da conexão com o banco de dados.
- O sistema utiliza credenciais específicas para acessar o banco de dados PostgreSQL hospedado no Supabase.
- A execução do fluxo segue a ordem definida nas configurações do sistema.

## ⚔️ Táticas Sugeridas:
- Ao discutir a confiabilidade do sistema com um cliente, destaque a capacidade do Health Check de monitorar continuamente a integridade do serviço e a conexão com o banco de dados.
- Em conversas de suporte, explique como o Health Check pode ajudar a diagnosticar problemas de conectividade com o banco de dados rapidamente, fornecendo informações em tempo real.
- Use o status e a versão do serviço retornados pelo Health Check para assegurar aos clientes que estão utilizando a versão mais atualizada e estável do sistema.