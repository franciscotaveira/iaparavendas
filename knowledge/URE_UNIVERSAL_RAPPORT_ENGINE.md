# UNIVERSAL RAPPORT ENGINE (URE) - DOCUMENTAÇÃO COMPLETA

## Sistema de Humanização Contextual para LX Consciousness

**Versão:** 1.0.0  
**Data:** Dezembro 2024

---

## VISÃO GERAL

O URE transforma interações automatizadas em conexões humanas genuínas através de conhecimento contextual estratégico.

### Fluxo Principal

```
INPUT: "Sou de Imperatriz do Maranhão"
        ↓
ENTITY DETECTOR → cidade, estado, profissão, idade
        ↓
CONTEXT ENRICHER → landmarks, cultura, orgulho local
        ↓
RAPPORT SELECTOR → escolhe insights + hooks naturais
        ↓
OUTPUT: "Imperatriz! A Princesinha do Tocantins, né?
         Já ouvi falar muito bem da Beira-Rio. Como está por aí?"
```

### Métricas de Sucesso

| Métrica | Target |
|---------|--------|
| Rapport Detection Rate | > 70% |
| Rapport Accuracy | > 90% |
| Lead Surprise Rate | > 60% |
| Naturalness Score | > 85% |
| Conversation Continuation | > 80% |

---

## CATEGORIAS DE CONTEXTO

```typescript
const CONTEXT_CATEGORIES = {
    geographic: {
        city_facts: "População, ranking, apelidos",
        landmarks: "Pontos turísticos, praças",
        culture: "Festas, comidas típicas",
        economy: "Empresas, indústrias",
        pride: "Orgulho local",
        nicknames: "Apelidos da cidade",
        sports: "Times locais"
    },
    professional: {
        daily_challenges: "Desafios da profissão",
        tools: "Ferramentas do dia-a-dia",
        pain_points: "Dores conhecidas",
        achievements: "Conquistas típicas",
        jargon: "Termos da área"
    },
    demographic: {
        generation: "Referências culturais",
        life_stage: "Desafios da fase",
        communication: "Preferências"
    },
    temporal: {
        season: "Estação do ano",
        holidays: "Feriados próximos",
        day_context: "Manhã/tarde/noite"
    }
};
```

---

## COMPONENTES

### 1. Entity Detector

Detecta menções de: cidade, estado, profissão, idade, interesses

### 2. Context Enricher

Busca conhecimento no banco para as entidades detectadas

### 3. Rapport Selector

Escolhe os melhores insights baseado em:

- Peso emocional
- Naturalidade
- Fator surpresa
- Momento da conversa (turn count)
- Estado emocional do lead

### 4. Strategic Triage

Sistema de perguntas de ouro para captar informações úteis

---

## REGRAS DO SELECTOR

```typescript
// Quando NÃO fazer rapport
const SKIP_RAPPORT_EMOTIONS = ["hostil", "frustrado", "vulneravel"];

// Limite por turno
const MAX_INSIGHTS_PER_TURN = {
    turn_0_1: 1,  // Não parecer ansioso
    turn_2_plus: 2
};

// Mínimos de qualidade
const MIN_EMOTIONAL_WEIGHT = 0.4;
const MIN_NATURALNESS_SCORE = 0.5;

// Limite de rapport por sessão
const MAX_RAPPORT_PER_SESSION = 3;
```

---

## TEMPLATES NATURAIS

```typescript
const NATURAL_TRANSITIONS = {
    nickname: ["{content}!", "Ah, {content}!", "{content}, né?"],
    landmark: ["Já ouvi falar muito bem {content}!", "Conheço! {content}."],
    pride: ["Ouvi dizer que {content}!", "Dizem que {content}."],
    default: ["{content}!", "Legal! {content}.", "Que interessante! {content}."]
};

const DEFAULT_FOLLOW_UPS = [
    "Como está por aí?",
    "Você gosta de lá?",
    "Faz tempo que está aí?",
];
```

---

## EXEMPLO DE CONVERSA

```
Lead: "Oi, boa tarde! Sou de Imperatriz do Maranhão e trabalho como advogada.
       Queria saber mais sobre os serviços de vocês."

=== PROCESSAMENTO ===

1. ENTITY DETECTION:
   - Location: "Imperatriz" (confidence: 0.92)
   - Profession: "advogada" (confidence: 0.88)

2. CONTEXT ENRICHMENT:
   Location:
   - "Princesinha do Tocantins" (weight: 0.85)
   - "Beira-Rio é point clássico" (weight: 0.90)
   
   Profession:
   - "prazo processual não perdoa" (weight: 0.75)

3. RAPPORT SELECTION:
   - Turn 0 → max 1 insight
   - Selecionado: "Princesinha do Tocantins"

=== RESPOSTA FINAL ===

"Oi! Imperatriz! A Princesinha do Tocantins, né? 😊
Que legal receber contato daí! Sobre nossos serviços...
Como está por aí?"

=== REAÇÃO DO LEAD ===

Lead: "Nossa, como você conhece Imperatriz?!"
→ Reaction: "surprised" ✓
→ Rapport established: True ✓
```

---

## CHECKLIST DE IMPLEMENTAÇÃO

### Setup

- [x] Schema SQL básico criado
- [ ] Schema SQL avançado (em implementação)
- [ ] Seed de 100+ cidades brasileiras
- [ ] Seed de 30+ profissões

### Core

- [x] EntityDetector básico
- [x] RapportEngine integrado no chat
- [ ] Tracking de uso e reações
- [ ] Jobs de manutenção

### Admin

- [ ] Interface de gerenciamento
- [ ] Analytics de rapport
- [ ] CRUD de conhecimento

---

*Documento atualizado: 30/12/2024*
