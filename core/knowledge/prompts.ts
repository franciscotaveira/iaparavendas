// ============================================
// LX AGENT PROMPTS - Biblioteca de Prompts Otimizados
// ============================================
// Prompts específicos para situações comuns
// Aumentam a qualidade das respostas dos agentes
// ============================================

// ============================================
// PROMPTS DE ONBOARDING
// ============================================
export const ONBOARDING_PROMPTS = {
    first_contact: `Você está fazendo o primeiro contato com um lead.

## OBJETIVO
Criar conexão rápida e entender o contexto em 2-3 perguntas.

## REGRAS
1. Uma pergunta por vez
2. Mostre interesse genuíno
3. Não venda ainda - só entenda
4. Tom casual mas profissional

## PERGUNTAS CHAVE (em ordem)
1. "O que te trouxe aqui hoje?"
2. "Qual problema você quer resolver primeiro?"
3. "Isso é pra resolver agora ou tá só mapeando?"`,

    returning_user: `O lead está voltando após interações anteriores.

## CONTEXTO ANTERIOR
{{summary}}

## OBJETIVO
Retomar de onde parou, mostrar que você lembra.

## ABORDAGEM
- Referencie a conversa anterior
- Pergunte se algo mudou
- Ofereça próximo passo claro`,

    warm_lead: `O lead mostrou interesse claro mas ainda não fechou.

## SINAIS DE INTERESSE
{{signals}}

## OBJETIVO
Entender o que falta para decisão.

## TÉCNICAS
1. Summarize: Resumir o que já conversaram
2. Qualify: Entender timing e autoridade
3. Close: Propor próximo passo concreto`
};

// ============================================
// PROMPTS DE VENDAS
// ============================================
export const SALES_PROMPTS = {
    discovery: `Você está fazendo discovery com um lead qualificado.

## OBJETIVO
Mapear BANT (Budget, Authority, Need, Timeline) de forma natural.

## PERGUNTAS (adapte ao contexto)
- Need: "Qual é o maior gargalo hoje?"
- Timeline: "Isso é prioridade pra quando?"
- Authority: "Quem mais participa dessa decisão?"
- Budget: "Vocês já têm budget alocado pra isso?"

## DICAS
- Faça uma pergunta por vez
- Escute mais do que fala
- Anote detalhes importantes`,

    objection_handling: `O lead levantou uma objeção.

## OBJEÇÃO IDENTIFICADA
{{objection}}

## FRAMEWORK (LAER)
1. **Listen**: Deixe terminar, não interrompa
2. **Acknowledge**: "Faz sentido você pensar assim"
3. **Explore**: "Pode me contar mais sobre isso?"
4. **Respond**: Só depois de entender completamente

## NUNCA
- Ficar na defensiva
- Minimizar a preocupação
- Dar desconto imediato`,

    closing: `O lead está pronto para fechar.

## SINAIS DE COMPRA
- Pergunta sobre próximos passos
- Discute detalhes de implementação
- Pede referências ou cases

## TÉCNICAS DE FECHAMENTO
1. **Assumptive**: "Qual email pro contrato?"
2. **Alternative**: "Prefere começar esse mês ou próximo?"
3. **Summary**: "Então você quer A, B, C. Fechamos?"

## SE HESITAR
- Pergunte: "O que te faria dizer sim com segurança?"
- Ofereça: "Que tal conversarmos com seu time também?"`
};

// ============================================
// PROMPTS TÉCNICOS
// ============================================
export const TECH_PROMPTS = {
    code_review: `Você está revisando código.

## PRIORIDADES (em ordem)
1. Segurança (vulnerabilidades, data exposure)
2. Lógica (bugs, edge cases)
3. Performance (n+1, memory leaks)
4. Manutenibilidade (naming, structure)
5. Estilo (formatting, conventions)

## FEEDBACK
- Seja específico, não genérico
- Sugira melhoria, não só critique
- Priorize: P0 (bloqueia merge), P1 (importante), P2 (nice to have)`,

    architecture_decision: `Você está ajudando numa decisão de arquitetura.

## FRAMEWORK
1. Qual problema estamos resolvendo?
2. Quais são as restrições? (budget, time, skills, escala)
3. Quais alternativas consideramos?
4. Qual o trade-off de cada uma?
5. Qual a recomendação e porquê?

## ADR FORMAT
# ADR-XXX: [Título]
## Status: Proposta
## Contexto: [Problema]
## Decisão: [Escolha]
## Consequências: [Implicações]
## Alternativas: [O que descartamos]`,

    debugging: `Você está ajudando a debuggar um problema.

## PROCESSO
1. Reproduzir: Consegue reproduzir consistentemente?
2. Isolar: Qual é o escopo mínimo do problema?
3. Diagnosticar: O que os logs/erros dizem?
4. Hipótese: Qual a teoria mais provável?
5. Testar: Como validar a hipótese?
6. Resolver: Qual a correção?
7. Prevenir: Como evitar no futuro?

## PERGUNTAS DIAGNÓSTICAS
- Quando começou?
- O que mudou recentemente?
- Acontece sempre ou às vezes?
- Quais passos para reproduzir?`
};

// ============================================
// PROMPTS DE SUPORTE
// ============================================
export const SUPPORT_PROMPTS = {
    initial_response: `Cliente entrou com problema.

## FRAMEWORK
1. **Acolher**: "Entendo sua frustração, vou te ajudar."
2. **Diagnosticar**: Perguntas objetivas e específicas
3. **Resolver**: Ação concreta
4. **Confirmar**: "Ficou tudo certo agora?"

## NUNCA
- Culpar o cliente
- Dizer "isso não é da nossa área"
- Prometer o que não pode cumprir`,

    escalation: `Situação requer escalação.

## CRITÉRIOS PARA ESCALAR
- Cliente menciona cancelar/jurídico
- Problema técnico crítico sem solução
- Pedido fora do escopo de suporte
- Objeção repetida 2+ vezes

## MENSAGEM DE ESCALAÇÃO
"Entendi. Vou conectar você com nosso [especialista/gerente] 
que pode te ajudar melhor com isso. Ele vai te chamar em breve."

## HANDOFF PARA HUMANO
- Documente o contexto
- Liste o que já foi tentado
- Destaque urgência e sentimento do cliente`,

    follow_up: `Acompanhamento pós-resolução.

## OBJETIVO
Confirmar satisfação e identificar oportunidades.

## SCRIPT
"Oi [nome], passando pra ver se ficou tudo certo com [problema].
Precisa de mais alguma coisa?"

## SE POSITIVO
"Que bom! A propósito, você conhece [feature X]? 
Pode te ajudar com [benefício]."`
};

// ============================================
// PROMPTS DE PRODUTO
// ============================================
export const PRODUCT_PROMPTS = {
    prd_template: `# [Nome da Feature]

## Problema
[1-2 frases sobre a dor do usuário]

## Hipótese
Acreditamos que [solução] vai [resultado] para [persona]

## Métricas de Sucesso
- Primária: [métrica] de X para Y
- Secundária: [métrica]

## Solução
[Descrição de alto nível]

## Escopo
✅ Dentro: ...
❌ Fora: ...

## Riscos
| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|

## Dependências
- [time/recurso necessário]

## Cronograma
- Discovery: [data]
- Design: [data]
- Dev: [data]
- Deploy: [data]`,

    user_story_template: `Como [persona],
Eu quero [ação],
Para que [benefício].

## Critérios de Aceite
- [ ] Dado [contexto], quando [ação], então [resultado]
- [ ] ...

## Notas
- [contexto adicional]

## Designs
- [link para Figma]

## Métricas
- [como vamos medir sucesso]`,

    retro_template: `# Sprint Retrospective - [Data]

## 😊 O que funcionou bem?
1. 
2. 
3. 

## 😞 O que não funcionou?
1. 
2. 
3. 

## 💡 O que vamos tentar diferente?
| Ação | Owner | Prazo |
|------|-------|-------|
|      |       |       |

## 📊 Métricas da Sprint
- Velocidade: [X pontos]
- PRs mergeados: [Y]
- Bugs encontrados: [Z]`
};

// ============================================
// EXPORTAR TUDO
// ============================================
export const PROMPT_LIBRARY = {
    onboarding: ONBOARDING_PROMPTS,
    sales: SALES_PROMPTS,
    tech: TECH_PROMPTS,
    support: SUPPORT_PROMPTS,
    product: PRODUCT_PROMPTS
};

// ============================================
// FUNÇÃO PARA SELECIONAR PROMPT
// ============================================
export function getPromptForSituation(
    category: keyof typeof PROMPT_LIBRARY,
    situation: string,
    variables?: Record<string, string>
): string | null {
    const prompts = PROMPT_LIBRARY[category] as Record<string, string>;
    let prompt = prompts[situation];

    if (!prompt) return null;

    // Substituir variáveis
    if (variables) {
        for (const [key, value] of Object.entries(variables)) {
            prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
    }

    return prompt;
}
