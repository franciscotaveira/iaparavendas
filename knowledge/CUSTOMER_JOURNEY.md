# 🎯 JORNADA DO CLIENTE LX AGENTS

## End-to-End Customer Journey

**Versão:** 1.0
**Data:** 29/12/2024
**Autor:** Antigravity + CEO

---

## VISÃO GERAL

```
[DESCOBERTA] → [CONTATO] → [QUALIFICAÇÃO] → [DEMO] → [PROPOSTA] → [FECHAMENTO] → [ONBOARDING] → [SUCESSO] → [EXPANSÃO]
```

---

## FASE 1: DESCOBERTA (Awareness)

### Canais de Entrada

- 🔍 Busca orgânica (SEO)
- 📱 Anúncios pagos (Meta, Google)
- 🤝 Indicação de cliente existente
- 💬 Post viral no LinkedIn/Instagram
- 🎙️ Webinar/Conteúdo educativo

### Gatilho do Interest

O prospect tem uma dor:

- "Perco leads porque demoro para responder"
- "Minha equipe não dá conta do volume"
- "Quero vender 24h por dia"
- "Preciso automatizar meu funil"

### Ação do Sistema

1. **Bot captura lead** no site/landing page
2. **Pergunta qualificadora inicial:** "Qual seu maior desafio?"
3. **Adiciona tag** no CRM: `stage:awareness`

---

## FASE 2: PRIMEIRO CONTATO (First Touch)

### Tempo Máximo de Resposta: 5 minutos

### Agente Responsável: SDR

### Mensagem Padrão

```
Olá {nome}! 👋

Vi que você se interessou por automatizar seu atendimento.

Me conta rapidinho: você já usa alguma ferramenta hoje ou está começando do zero?

Pergunto porque dependendo da sua situação, posso te indicar o caminho mais rápido.
```

### Objetivo

- Gerar **rapport**
- Entender **situação atual**
- Identificar **dor principal**

### Ação do Sistema

1. Lead responde → **Classifier** identifica intenção
2. Se qualificado → Agendamento de Demo
3. Se não qualificado → Nurturing automático

---

## FASE 3: QUALIFICAÇÃO (Discovery Call)

### Critérios de Qualificação (BANT+)

| Critério | Pergunta |
|----------|----------|
| **Budget** | "Você tem budget reservado para essa solução?" |
| **Authority** | "Você é quem decide ou precisa consultar alguém?" |
| **Need** | "Qual problema específico você quer resolver?" |
| **Timeline** | "Para quando você precisa disso funcionando?" |
| **Fit** | "Quantos leads/mês você recebe hoje?" |

### Score de Qualificação

| Score | Classificação | Próximo Passo |
|-------|---------------|---------------|
| 80-100 | 🔥 Hot Lead | Demo imediata |
| 60-79 | 🌡️ Warm Lead | Enviar material + Demo |
| 40-59 | ❄️ Cold Lead | Nurturing por email |
| 0-39 | ❌ Desqualificado | Arquivo |

### Ação do Sistema

1. **Atualizar score** no Supabase
2. **Agendar demo** (Calendly) se qualificado
3. **Enviar confirmação** via WhatsApp

---

## FASE 4: DEMONSTRAÇÃO (Demo)

### Duração: 30 minutos

### Estrutura da Demo

| Tempo | Conteúdo |
|-------|----------|
| 0-5 min | Rapport + Confirmação das dores |
| 5-15 min | Demo ao vivo do Simulador |
| 15-25 min | Perguntas e customização |
| 25-30 min | Proposta de valor + Próximos passos |

### Pontos Obrigatórios da Demo

1. Mostrar **Simulador WhatsApp** com lead fictício
2. Mostrar **Dashboard** com métricas
3. Mostrar **Resposta em tempo real** (bot respondendo)
4. Mostrar **Classificação automática** de leads
5. Mostrar **Integração com Calendly**

### Ação do Sistema

1. **Gravar sessão** (opcional)
2. **Enviar resumo** pós-demo
3. **Agendar follow-up** em 24-48h

---

## FASE 5: PROPOSTA (Proposal)

### Modelos de Precificação

| Plano | Descrição | Valor |
|-------|-----------|-------|
| **Starter** | Até 500 conversas/mês, 1 agente | R$ 297/mês |
| **Pro** | Até 2.000 conversas/mês, 5 agentes | R$ 797/mês |
| **Scale** | Até 10.000 conversas/mês, ilimitado | R$ 1.997/mês |
| **Enterprise** | Custom, SLA dedicado | Sob consulta |

### Extras Opcionais

- Setup assistido: R$ 500-1.500 (único)
- Treinamento da equipe: R$ 200/hora
- Customização de fluxos: R$ 100/hora

### Formato da Proposta

1. **Resumo do diagnóstico** (dores identificadas)
2. **Solução proposta** (plano recomendado)
3. **Investimento** (preço + condições)
4. **Garantia** (7 dias para testar)
5. **Próximo passo** (link para pagamento)

### Ação do Sistema

1. **Gerar PDF** da proposta (automático)
2. **Enviar via WhatsApp** + Email
3. **Agendar follow-up** se não responder em 48h

---

## FASE 6: FECHAMENTO (Closing)

### Objeções Comuns

| Objeção | Resposta |
|---------|----------|
| "Tá caro" | "Quanto você perde hoje por não ter isso?" |
| "Preciso pensar" | "Entendo. O que exatamente você precisa avaliar?" |
| "Já tentei algo parecido" | "O que não funcionou? Nosso diferencial é X." |
| "Não sei se funciona pro meu nicho" | "Posso te mostrar cases do seu segmento?" |

### Técnicas de Fechamento

- **Assumptivo:** "Vou configurar seu acesso hoje. Qual email usar?"
- **Alternativa:** "Você prefere começar com o Starter ou já ir pro Pro?"
- **Urgência:** "Tenho 2 vagas esse mês com 20% de desconto no setup."

### Ação do Sistema

1. Contrato assinado → **Trigger Onboarding**
2. Pagamento confirmado → **Criar conta no sistema**
3. Notificar CEO via Telegram

---

## FASE 7: ONBOARDING (Activation)

### Semana 1: Setup

| Dia | Ação |
|-----|------|
| D+0 | Enviar credenciais de acesso |
| D+1 | Call de kickoff (30 min) |
| D+2 | Configurar integrações (WhatsApp, Calendly) |
| D+3 | Personalizar respostas do bot |
| D+5 | Go-live com supervisão |
| D+7 | Revisão de métricas |

### Marcos de Sucesso

- ✅ Primeiro lead respondido pelo bot
- ✅ Primeiro agendamento automático
- ✅ Primeiro feedback positivo do cliente

### Ação do Sistema

1. **Checklist automático** no dashboard
2. **Alertas** se cliente não ativou em 48h
3. **NPS** no D+7

---

## FASE 8: SUCESSO (Retention)

### Métricas de Saúde do Cliente

| Métrica | Bom | Alerta | Crítico |
|---------|-----|--------|---------|
| Uso semanal | 5+ dias | 2-4 dias | 0-1 dia |
| Conversas/mês | > 80% do plano | 50-80% | < 50% |
| NPS | 9-10 | 7-8 | < 7 |

### Ações de Retenção

- **Health Score baixo:** Ligar para entender problemas
- **Pouco uso:** Enviar dicas de otimização
- **NPS alto:** Pedir indicação/depoimento

### Ação do Sistema

1. **Monitorar uso** diariamente
2. **Alertar CS** se health score cair
3. **Automatizar** emails de engajamento

---

## FASE 9: EXPANSÃO (Growth)

### Oportunidades de Upsell

- Upgrade de plano (mais conversas)
- Módulos adicionais (Cobrança, Contratos)
- Novas unidades/filiais

### Oportunidades de Referral

- Programa de indicação: 1 mês grátis por cliente indicado
- Depoimento em vídeo → Desconto permanente

### Ação do Sistema

1. **Identificar** clientes satisfeitos (NPS 9-10)
2. **Propor** indicação automaticamente
3. **Rastrear** origem dos novos leads

---

## FERRAMENTAS INTEGRADAS

| Fase | Ferramenta |
|------|------------|
| Descoberta | Landing Page + Chat Bot |
| Contato | WhatsApp Cloud API |
| Qualificação | LX Agents SDR |
| Demo | Calendly + Loom |
| Proposta | Gerador PDF automático |
| Fechamento | Asaas (Pagamento) + Autentique (Contrato) |
| Onboarding | Dashboard + Checklist |
| Sucesso | Health Score + Alertas |
| Expansão | CRM + Automações |

---

## PRÓXIMOS PASSOS

1. [ ] Implementar cada fase como SOP executável
2. [ ] Conectar agentes às fases correspondentes
3. [ ] Criar templates de mensagens para cada etapa
4. [ ] Configurar automações no Supabase

---

*"Uma jornada de mil milhas começa com um único passo - automatizado."*
