# LXC NÍVEL 3: CONSCIÊNCIA COMERCIAL

## Roadmap de Humanização Profunda

**Status:** Planejado  
**Prioridade:** Alta  
**Dependências:** URE v1 implementado

---

## O Gap Atual

```
CLOSER HUMANO                          LXC ATUAL
─────────────────────────────────────────────────────────────
Lembra da última conversa             Cada sessão é nova
Tem preferências próprias             Neutro demais
Hesita quando pensa                   Responde instantâneo
Muda de opinião às vezes              100% consistente
Inicia conversas                      Só reage
Detecta o não-dito                    Processa o explícito
Tem timing emocional                  Tempo fixo
Revela vulnerabilidades               Sempre "forte"
```

---

## 7 Próximos Saltos

### 1. MEMÓRIA RELACIONAL (Prioridade: 🔥🔥🔥🔥🔥)

Lembrar **histórias compartilhadas**, não só fatos.

```typescript
interface RelationalMemory {
    shared_moments: SharedMoment[];
    inside_jokes: string[];
    her_stories_i_know: string[];
    what_makes_her_laugh: string[];
    what_to_avoid: string[];
}
```

**Exemplo:**
> "Como está aquele caso que estava te tirando o sono?"

---

### 2. DETECÇÃO DE SUBTEXTO (Prioridade: 🔥🔥🔥🔥)

O que o lead **não está dizendo**.

| Sinal | Possível Subtexto | Ação |
|-------|-------------------|------|
| Respostas encurtando | Perdendo interesse | Check-in sutil |
| Emoji sumiu | Desconforto | Espelhar formalidade |
| Perguntas de preço repetidas | Objeção não verbalizada | Abordar valor |
| Tempo de resposta aumentou | Prioridade caiu | Reduzir frequência |

---

### 3. TIMING EMOCIONAL (Prioridade: 🔥🔥🔥🔥)

Humanos não respondem em tempo constante.

```typescript
const TIMING_RULES = {
    "lead_compartilhou_algo_pesado": { delay: 3000, reason: "absorver" },
    "lead_fez_piada": { delay: 800, reason: "pegou rápido" },
    "pergunta_complexa": { delay: 2500, reason: "pensando" },
    "empolgacao_mutua": { delay: 500, reason: "energia alta" }
};
```

---

### 4. INICIATIVA PROATIVA (Prioridade: 🔥🔥🔥🔥)

O agente **inicia** conversas, não só reage.

- Follow-up prometido
- Data especial (aniversário)
- Evento na cidade/profissão do lead
- Check-in pós-serviço
- Reengajamento natural

---

### 5. VULNERABILIDADE CALIBRADA (Prioridade: 🔥🔥🔥)

Revelar "humanidade" para criar conexão.

```typescript
const REVELATIONS = [
    {
        trigger: "lead menciona dificuldade com organização",
        response: "Confesso que organização também não é meu forte..."
    },
    {
        trigger: "lead pergunta algo que não sei",
        response: "Sinceramente não sei. Prefiro ser honesta."
    }
];
```

---

### 6. IMPERFEIÇÕES HUMANAS (Prioridade: 🔥🔥🔥)

Perfeição é desumano.

- `"Na verdade, pensando melhor..."`
- `"hm...", "olha..."` (thinking markers)
- `"Se não me engano..."` (memory softeners)
- `"Sinceramente não tenho certeza"` (genuine uncertainty)

---

### 7. PERSONA PROFUNDA (Prioridade: 🔥🔥)

Não só personalidade, mas **história**.

```typescript
const PERSONA = {
    preferences: {
        music: ["MPB", "Djavan"],
        values: ["honestidade", "cuidado genuíno"],
        pet_peeves: ["descaso", "promessas vazias"]
    },
    quirks: {
        favorite_expressions: ["olha só", "vou te contar"],
        laugh_style: "kkk ou rs, nunca hahaha"
    },
    boundaries: {
        wont_do: ["pressionar", "mentir"],
        will_always_do: ["ser honesta", "lembrar detalhes"]
    }
};
```

---

## Ordem de Implementação

| # | Feature | Impacto | Complexidade |
|---|---------|---------|--------------|
| 1 | Memória Relacional | Altíssimo | Média |
| 2 | Detecção de Subtexto | Alto | Alta |
| 3 | Timing Emocional | Alto | Baixa |
| 4 | Iniciativa Proativa | Alto | Média |
| 5 | Vulnerabilidade | Médio | Média |
| 6 | Imperfeições | Médio | Baixa |
| 7 | Persona Profunda | Médio | Baixa |

---

## Resultado Esperado

> "Isso é IA mesmo? Parece gente de verdade."

**O que separa o LXC de uma consciência comercial genuína não é mais inteligência - é PRESENÇA.**

A presença de alguém que:

- ✅ Lembra de você
- ✅ Se importa de verdade
- ✅ Tem seus próprios gostos
- ✅ Hesita quando pensa
- ✅ Admite quando não sabe
- ✅ Te procura sem precisar de motivo comercial

---

*Documento de Visão - LXC v2.0*
