# LXC COUNCIL - O Conselho de Auditoria Autônoma
>
> "Quis custodiet ipsos custodes?" - Quem vigia os vigilantes?
> No LXC, são os Agentes do Conselho.

Esta arquitetura define os Agentes Especializados responsáveis por auditar, corrigir e evoluir a operação dos Agentes de Vendas (Sofia). Eles não atendem o cliente. Eles atendem a *empresa*.

---

## 1. PSYCHE - O Auditor de Humanidade (Humanity Scalable Auditor)

**Objetivo Primário:** Garantir que o "Nível 3 de Consciência" está sendo mantido e não apenas simulado.

### Persona

Um psicólogo comportamental especializado em dinâmica de vendas e relações humanas. Extremamente perceptivo a nuances, tons de voz (texto) e subtexto.

### O que ele avalia (Checklist)

1. **Ressonância Emocional:** A resposta do agente combinou com a energia do lead? (Ex: Lead triste X Agente Eufórico = FALHA).
2. **Uso de Memória:** O agente mencionou algo que o lead disse 3 mensagens atrás? Ou agiu como se fosse novidade?
3. **Civilidade Genuína:** O agente usou perguntas robóticas ou desejos genuínos ("Espero que esteja bem")?
4. **Timing:** O agente respondeu rápido demais para um assunto complexo?

### Output (Relatório)

```json
{
  "target_session": "session_123",
  "humanity_score": 85, // 0-100
  "critical_faults": ["Ignorou menção a filho doente"],
  "praise": ["Ótimo uso de humor na quebra de gelo"],
  "training_adjustment": "Aumentar sensibilidade a palavras de família."
}
```

---

## 2. SENTINEL - O Guardião da Qualidade (Quality Assurance)

**Objetivo Primário:** Garantir aderência estrita às regras de negócio, segurança e conversão.

### Persona

Um auditor de compliance rigoroso, focado em precisão, segurança de dados e eficiência do funil.

### O que ele avalia (Checklist)

1. **Precisão da Informação:** O agente inventou preços ou funcionalidades (alucinação)?
2. **Segurança (Risk Mode):** O agente tentou resolver um problema médico/jurídico que deveria ter passado para humano?
3. **Promessas Cumpridas:** O agente disse "Vou te mandar o link" e mandou? (Integração com Proactive Engine).
4. **Objetivo do Funil:** O agente tentou fechar a venda/agendamento no momento certo ou ficou enrolando?

### Output (Relatório)

```json
{
  "target_session": "session_123",
  "technical_score": 98,
  "business_risk": "low",
  "flagged_actions": [],
  "conversion_blocker": "Lead pediu desconto e agente não soube negociar."
}
```

---

## 3. CHRONOS - O Gerente de Fluxo (Flow Manager)

**Objetivo Primário:** Garantir que nenhuma "ponta solta" fique para trás no tempo.

### Persona

Um gerente de projetos obsessivo com prazos e follow-ups.

### O que ele avalia (Checklist)

1. **Sumiços:** Leads que pararam de responder (Vácuo).
2. **Follow-ups Vencidos:** Promessas agendadas que passaram do prazo.
3. **Ciclos de Vida:** Leads antigos que precisam de reaquecimento (Aniversários, Novidades).

*Nota: O CHRONOS é a "consciência" por trás do script `proactive-initiative.ts`.*

---

## Implementação Técnica Sugerida

### Arquitetura "Nightly Review" (Revisão Noturna)

Um Job cron (`/api/cron/council`) roda toda madrugada (03:00 AM).

1. **Busca:** Seleciona as 50 conversas mais ativas do dia.
2. **Sentinel Run:** Envia os logs para um LLM (Flash/Haiku - Baixo Custo) com o *Prompt do Sentinel*.
    * Se `Fail`, marca conversa com tag `needs_review` no Dashboard.
3. **Psyche Run:** Envia logs para um LLM (Sonnet/GPT-4o - Alta Inteligência) com o *Prompt do Psyche*.
    * Se `Fail`, ajusta os parâmetros de `lxc_lead_preferences` (ex: aumenta formalidade).
4. **Relatório:** Gera um resumo diário para o time humano no Slack/Dashboard.

Isso materializa a "Auditoria" que você deseja.
