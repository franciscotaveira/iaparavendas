# 🧠 UNIVERSAL RAPPORT ENGINE (URE)

## O Conceito

O URE detecta entidades contextuais (cidade, profissão, idade) mencionadas pelo lead e enriquece com conhecimento local para criar rapport instantâneo.

```
Lead: "Sou de Imperatriz do Maranhão"
           ↓
   ENTITY DETECTOR → Cidade: Imperatriz, Estado: Maranhão
           ↓
   CONTEXT ENRICHMENT → "Princesinha do Tocantins", Beira-Rio, 2ª maior do MA
           ↓
   RAPPORT SELECTOR → Escolhe 1-2 insights naturais
           ↓
Agent: "Imperatriz! A Princesinha do Tocantins, né? 
        Segunda maior do Maranhão. Já ouvi falar muito 
        bem da Beira-Rio. Como está por aí?"

Lead: 😮 "Como você conhece minha cidade?!"
```

---

## Categorias de Contexto

```typescript
const UNIVERSAL_CONTEXT_CATEGORIES = {
    geographic: {
        city_facts: "População, ranking, apelidos",
        landmarks: "Pontos turísticos, praças famosas",
        culture: "Festas, comidas típicas, sotaque",
        economy: "Principais empresas, indústrias",
        weather: "Clima característico",
        local_pride: "O que os moradores têm orgulho"
    },
    
    professional: {
        daily_challenges: "Desafios comuns da profissão",
        tools_used: "Ferramentas do dia-a-dia",
        industry_trends: "Tendências do setor",
        pain_points: "Dores conhecidas",
        achievements: "Conquistas típicas"
    },
    
    demographic: {
        life_stage: "Desafios da fase de vida",
        references: "Referências culturais da geração",
        priorities: "O que importa nessa fase",
        communication: "Como preferem se comunicar"
    },
    
    temporal: {
        season: "Características da estação",
        holidays: "Feriados próximos",
        events: "Eventos relevantes",
        day_context: "Manhã/tarde/noite, dia da semana"
    }
};
```

---

## Schema do Banco

```sql
-- Conhecimento Geográfico
CREATE TABLE IF NOT EXISTS geo_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Hierarquia geográfica
    country VARCHAR(100) NOT NULL DEFAULT 'Brasil',
    state VARCHAR(100),
    city VARCHAR(100),
    neighborhood VARCHAR(100),
    
    -- Tipo de conhecimento
    knowledge_type VARCHAR(50) NOT NULL,
    -- 'landmark', 'culture', 'economy', 'pride', 'nickname', 
    -- 'food', 'event', 'weather', 'trivia', 'ranking'
    
    -- O conhecimento em si
    content TEXT NOT NULL,
    
    -- Para geração natural
    conversation_hooks TEXT[], -- Formas de introduzir naturalmente
    follow_up_questions TEXT[], -- Perguntas para continuar
    
    -- Controle de qualidade
    emotional_weight FLOAT DEFAULT 0.5, -- Quanto gera orgulho/conexão (0-1)
    naturalness_score FLOAT DEFAULT 0.5, -- Quão natural soa (0-1)
    
    -- Tracking
    usage_count INTEGER DEFAULT 0,
    effectiveness_score FLOAT DEFAULT 0.5
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_geo_city ON geo_knowledge(city);
CREATE INDEX IF NOT EXISTS idx_geo_state ON geo_knowledge(state);
CREATE INDEX IF NOT EXISTS idx_geo_type ON geo_knowledge(knowledge_type);

-- Conhecimento Profissional
CREATE TABLE IF NOT EXISTS professional_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    profession VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    seniority_level VARCHAR(50), -- junior, mid, senior, executive
    
    knowledge_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    
    conversation_hooks TEXT[],
    follow_up_questions TEXT[],
    emotional_weight FLOAT DEFAULT 0.5
);

-- Tracking de uso
CREATE TABLE IF NOT EXISTS rapport_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    used_at TIMESTAMPTZ DEFAULT NOW(),
    
    session_id VARCHAR(100),
    knowledge_id UUID NOT NULL,
    knowledge_table VARCHAR(50) NOT NULL,
    
    content_used TEXT,
    context_detected TEXT,
    
    lead_reaction VARCHAR(50), -- positive, neutral, negative, surprised
    conversation_continued BOOLEAN,
    rapport_established BOOLEAN
);
```

---

## Dados de Exemplo - Imperatriz/MA

```json
{
  "city": "Imperatriz",
  "state": "Maranhão",
  "country": "Brasil",
  "knowledge": [
    {
      "knowledge_type": "nickname",
      "content": "a Princesinha do Tocantins",
      "conversation_hooks": ["Ah, Imperatriz! ", "A famosa "],
      "follow_up_questions": ["Você é de lá mesmo ou se mudou?"],
      "emotional_weight": 0.85
    },
    {
      "knowledge_type": "ranking",
      "content": "segunda maior cidade do Maranhão",
      "conversation_hooks": ["Uma das maiores do estado, né? "],
      "follow_up_questions": ["Como é viver numa cidade desse porte?"],
      "emotional_weight": 0.7
    },
    {
      "knowledge_type": "landmark",
      "content": "Beira-Rio é um point clássico",
      "conversation_hooks": ["Já ouvi falar muito bem da ", "A famosa "],
      "follow_up_questions": ["Ainda é movimentada a Beira-Rio?"],
      "emotional_weight": 0.9
    },
    {
      "knowledge_type": "economy",
      "content": "polo importante de agronegócio e papel/celulose",
      "conversation_hooks": ["Região forte em "],
      "follow_up_questions": ["Você trabalha com algo ligado a isso?"],
      "emotional_weight": 0.5
    },
    {
      "knowledge_type": "geography",
      "content": "portal de entrada da Amazônia Legal",
      "conversation_hooks": ["O portal da Amazônia, "],
      "follow_up_questions": null,
      "emotional_weight": 0.75
    }
  ]
}
```

---

## Diferencial Competitivo

| BOT COMUM | LXC + URE |
|-----------|-----------|
| Lead: "Sou de Imperatriz" | Lead: "Sou de Imperatriz" |
| Bot: "Entendi! Como posso ajudar?" | Agent: "A Princesinha do Tocantins! Já ouvi falar da Beira-Rio. Como está por aí?" |
| Zero conexão ❌ | Rapport instantâneo ✅ |

---

## Implementação Futura

1. **Entity Detector**: Regex + NLP para detectar cidades, profissões
2. **Context Enricher**: Busca no banco de conhecimento
3. **Rapport Selector**: Escolhe insights naturais baseado no momento
4. **Learning Loop**: Trackeia reações para melhorar seleção

---

*Framework documentado: 30/12/2024*
