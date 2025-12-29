# 📋 SOPs - Processos Operacionais Padronizados

Este diretório contém os processos documentados do negócio.
Cada SOP pode ser executado pelos agentes automatizados.

## Estrutura de um SOP

```yaml
id: SOP_001
nome: "Enviar Orçamento para Lead"
trigger: "novo lead quer orçamento"
agente: SDR
passos:
  1. Coletar WhatsApp do lead
  2. Coletar nome do lead
  3. Identificar serviço de interesse
  4. Gerar orçamento personalizado
  5. Enviar via WhatsApp
saida: Mensagem enviada + Lead cadastrado no Supabase
```

## SOPs Cadastrados

| ID | Nome | Status |
|----|------|--------|
| SOP_001 | Enviar Orçamento | 🔄 Em construção |
| SOP_002 | Gerar Contrato | ⏳ Pendente |
| SOP_003 | Cobrança Asaas | ⏳ Pendente |
| SOP_004 | Disparo em Massa (Consignado) | ⏳ Pendente |
