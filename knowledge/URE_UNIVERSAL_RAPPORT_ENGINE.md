# UNIVERSAL RAPPORT ENGINE (URE)

## Sistema de Humanização Contextual para LX Consciousness

**Versão:** 1.0.0  
**Data:** Dezembro 2024  
**Autor:** Lux Growth IA

---

## ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Database Schema](#2-database-schema)
3. [Entity Detection](#3-entity-detection)
4. [Context Enrichment](#4-context-enrichment)
5. [Rapport Selection](#5-rapport-selection)
6. [Strategic Triage](#6-strategic-triage)
7. [Integration Layer](#7-integration-layer)
8. [Auto-Enrichment API](#8-auto-enrichment-api)
9. [Seed Data](#9-seed-data)
10. [Jobs & Maintenance](#10-jobs-maintenance)

---

## 1. VISÃO GERAL

### 1.1 O Conceito

O Universal Rapport Engine transforma interações automatizadas em conexões humanas genuínas através de conhecimento contextual estratégico.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         UNIVERSAL RAPPORT ENGINE                         │
├─────────────────────────────────────────────────────────────────────────┤
│  INPUT: "Sou de Imperatriz do Maranhão"                                 │
│                          ↓                                               │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                    ENTITY DETECTOR                              │     │
│  │  Detecta: cidade, estado, país, profissão, idade, interesses   │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                          ↓                                               │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                  CONTEXT ENRICHER                               │     │
│  │  Busca conhecimento: landmarks, cultura, orgulho local, etc.   │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                          ↓                                               │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │                   RAPPORT SELECTOR                              │     │
│  │  Escolhe insights + hooks + follow-ups naturais                │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                          ↓                                               │
│  OUTPUT: "Imperatriz! A Princesinha do Tocantins, né?                   │
│           Já ouvi falar muito bem da Beira-Rio. Como está por aí?"      │
│                                                                          │
│  RESULTADO: Lead impressionado → Rapport instantâneo → Conexão real     │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Categorias de Contexto

```python
CONTEXT_CATEGORIES = {
    "geographic": {
        "city_facts": "População, ranking, apelidos locais",
        "landmarks": "Pontos turísticos, praças, lugares icônicos",
        "culture": "Festas, comidas típicas, tradições",
        "economy": "Principais empresas, indústrias, vocação econômica",
        "pride": "O que moradores têm orgulho",
        "nicknames": "Apelidos da cidade",
        "sports": "Times locais, rivalidades"
    },
    "professional": {
        "daily_challenges": "Desafios comuns da profissão",
        "tools": "Ferramentas do dia-a-dia",
        "pain_points": "Dores conhecidas",
        "achievements": "Conquistas típicas",
        "jargon": "Termos e expressões da área"
    },
    "demographic": {
        "generation": "Referências culturais da geração",
        "life_stage": "Desafios da fase de vida",
        "communication": "Como preferem se comunicar"
    },
    "temporal": {
        "season": "Características da estação",
        "holidays": "Feriados próximos",
        "day_context": "Contexto do momento (manhã/tarde/noite)"
    }
}
```

### 1.3 Métricas de Sucesso

| Métrica | Target | Descrição |
|---------|--------|-----------|
| Rapport Detection Rate | > 70% | % de mensagens onde detectamos oportunidade |
| Rapport Accuracy | > 90% | % de informações corretas |
| Lead Surprise Rate | > 60% | % de leads que reagem positivamente |
| Naturalness Score | > 85% | Avaliação de quão natural soa |
| Conversation Continuation | > 80% | % que continua após rapport |

---

## 2. DATABASE SCHEMA

### Tabelas Principais

```sql
-- geo_knowledge: Conhecimento geográfico
-- professional_knowledge: Conhecimento profissional
-- golden_questions: Perguntas de ouro para triagem
-- detected_entities: Tracking de entidades detectadas
-- rapport_usage: Tracking de uso de rapport
```

Ver arquivo: `scripts/supabase-ure-simple.sql`

---

## 3. ENTITY DETECTION

### Padrões de Detecção

```typescript
// Localização
const LOCATION_PATTERNS = [
    /(?:sou|moro|estou|vim|venho)\s+(?:de|em|do|da)\s+([A-Za-zÀ-ÿ\s]+)/i,
    /aqui\s+(?:em|no|na)\s+([A-Za-zÀ-ÿ\s]+)/i,
];

// Profissão
const PROFESSION_PATTERNS = [
    /(?:sou|trabalho\s+como)\s+([A-Za-zÀ-ÿ\s]+)/i,
    /(?:atuo|trabalho)\s+(?:na|no|com)\s+([A-Za-zÀ-ÿ\s]+)/i,
];
```

### Mapeamento de Gentílicos

```typescript
const DEMONYM_MAP = {
    "paulista": ("São Paulo", "SP"),
    "carioca": ("Rio de Janeiro", "RJ"),
    "mineiro": ("Minas Gerais", "MG"),
    "gaúcho": ("Rio Grande do Sul", "RS"),
    // ... etc
};
```

---

## 4. CONTEXT ENRICHMENT

### RapportInsight

```typescript
interface RapportInsight {
    id: string;
    sourceTable: string;
    content: string;
    knowledgeType: string;
    conversationHooks: string[];
    followUpQuestions: string[];
    emotionalWeight: number;    // 0-1
    naturalnessScore: number;   // 0-1
    surpriseFactor: number;     // 0-1
    effectivenessScore: number; // 0-1
}
```

### Cálculo de Rapport Score

```typescript
rapportScore = (
    emotionalWeight * 0.35 +
    naturalnessScore * 0.25 +
    surpriseFactor * 0.25 +
    effectivenessScore * 0.15
);
```

---

## 5. RAPPORT SELECTION

### Regras do Selector

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

### Templates Naturais

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

## 6. STRATEGIC TRIAGE

### Perguntas de Ouro

| Ordem | Pergunta | Propósito | Entidade Esperada |
|-------|----------|-----------|-------------------|
| 1 | "De onde você está falando?" | Rapport | city |
| 2 | "O que você faz profissionalmente?" | Qualificação | profession |
| 3 | "O que te trouxe até aqui?" | Qualificação | goal |
| 4 | "Se resolver essa semana, quanto valeria?" | Urgência | urgency |
| 5 | "Tem alguém na equipe de vendas?" | Qualificação | team_size |

---

## 7. INTEGRATION LAYER

### Fluxo de Integração

```
1. Detectar entidades na mensagem
2. Enriquecer com conhecimento contextual
3. Selecionar melhor rapport para o momento
4. Opcionalmente adicionar pergunta de triagem
5. Retornar componentes para Response Agent usar
```

### Output do RapportEngine

```typescript
interface RapportResult {
    entities_detected: DetectedEntity[];
    rapport_opening: string | null;
    rapport_follow_up: string | null;
    triage_question: string | null;
    insights_used: InsightRef[];
    has_rapport: boolean;
}
```

---

## 8. AUTO-ENRICHMENT API

### Fontes de Dados

- **Wikipedia BR**: Informações gerais sobre cidades
- **IBGE**: Dados demográficos e econômicos
- **LLM (Claude)**: Extração de conhecimento útil para rapport

### Endpoints

```
POST /api/enrichment/locations/{id}/enrich
POST /api/enrichment/locations/bulk-enrich
POST /api/enrichment/professions/{id}/enrich
GET  /api/enrichment/stats
```

---

## 9. SEED DATA

### Cidades Brasileiras

- Todas as 27 capitais
- Top 10 cidades de cada estado por população
- ~150 cidades no total inicial

### Profissões

- ~80 profissões com aliases
- Conhecimento inicial para profissões-chave

---

## 10. CHECKLIST DE IMPLEMENTAÇÃO

### Setup Inicial

- [x] Schema SQL básico criado (`supabase-ure-simple.sql`)
- [x] Engine TypeScript integrado (`core/rapport/engine.ts`)
- [x] Seed de 28 cidades
- [x] Seed de 18 profissões
- [x] 5 perguntas de ouro

### Próximos Passos

- [ ] Expandir seed para 150+ cidades
- [ ] Expandir seed para 80+ profissões
- [ ] Implementar tracking de uso
- [ ] Criar jobs de manutenção
- [ ] Auto-enrichment com LLM
- [ ] Dashboard de analytics

---

*Documento atualizado: 30/12/2024*
