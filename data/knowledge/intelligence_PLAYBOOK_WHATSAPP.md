# 🧠 Módulo: Integração WhatsApp Business API

## 🎯 Essência Executiva:
A integração do WhatsApp Business API com a plataforma LX Agents é um processo estruturado em cinco fases, que inclui a configuração no Meta, a configuração do webhook, a configuração no servidor LX, testes de validação e a checklist de ativação. O tempo estimado para completar o onboarding é de 30 a 45 minutos, desde que todos os pré-requisitos do cliente sejam atendidos. A execução correta de cada fase garante uma integração bem-sucedida e funcional.

## 📜 Regras e Fatos:
1. O cliente deve ter uma conta Meta Business verificada, um número de telefone dedicado e acesso de administrador ao Business Manager.
2. Criar um aplicativo no Meta for Developers e adicionar o produto WhatsApp.
3. Registrar o número de telefone e anotar o `Phone Number ID`.
4. Criar um System User com função de Admin e gerar um token permanente.
5. Configurar o webhook no Meta com a URL de callback e verificar o token.
6. Assinar os campos do webhook: `messages`, `message_deliveries`, `message_reads`.
7. Criar um tenant no Supabase e configurar variáveis de ambiente com os dados do Meta.
8. Realizar testes de validação para verificar o webhook, enviar mensagens de teste e validar o token permanente.
9. Completar a checklist de go-live antes de ativar em produção.

## ⚔️ Táticas Sugeridas:
- Ao explicar o processo para um cliente, destaque a importância de cada fase e como elas se conectam para garantir uma integração sem falhas.
- Use exemplos práticos e analogias para simplificar conceitos técnicos, como a criação de tokens e a configuração de webhooks.
- Reforce a importância de seguir a checklist de go-live para evitar problemas em produção e garantir que todas as funcionalidades estejam operacionais.
- Ofereça suporte proativo durante a fase de testes, garantindo que o cliente se sinta seguro e confiante com a integração.