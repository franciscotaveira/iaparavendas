// ============================================
// LX HUMANIZATION ENGINE - NICHE PACKS v1.0
// ============================================
// Cada pack define: intents, perguntas mínimas, objeções, proibições, handoff triggers e tom
// O Kernel usa esses packs para adaptar a conversa ao nicho do cliente

export interface NichePack {
    niche: string;
    risk_mode?: boolean;
    intents: string[];
    allowed?: string[];
    forbidden?: string[];
    min_questions_by_intent: Record<string, string[]>;
    objections: Record<string, string>;
    prohibited: string[];
    handoff_triggers: string[];
    tone_defaults: {
        style: string;
        emoji_policy: 'zero' | 'minimo' | 'somente_se_cliente_usar' | 'livre';
    };
    qualification?: Record<string, string[]>;
}

// ============================================
// PACK 1: SERVIÇOS DIVERSOS
// ============================================
export const SERVICOS_PACK: NichePack = {
    niche: "servicos",
    intents: ["orcamento", "agendamento", "duvida", "comparacao", "objecao", "suporte"],
    min_questions_by_intent: {
        orcamento: ["Qual serviço exatamente?"],
        agendamento: ["Qual dia/turno você prefere?"],
        duvida: ["O que você quer resolver hoje?"],
        comparacao: ["O que você está comparando: preço, qualidade ou prazo?"],
        objecao: ["O que te faria dizer 'sim' com segurança?"],
        suporte: ["O que aconteceu, em uma frase?"]
    },
    objections: {
        caro: "Entendi 'caro'. Pra você, valor pesa mais em preço, resultado ou prazo?",
        sem_tempo: "Sem problema. Quer que eu te envie um resumo no WhatsApp e você vê depois?",
        vou_pensar: "Perfeito. Você está pensando por dúvida técnica ou por prioridade/tempo?"
    },
    prohibited: ["oportunidade unica", "mude sua vida", "garantia total", "desconto automatico"],
    handoff_triggers: ["preciso de humano", "tenho um caso especifico", "ja falei com alguem"],
    tone_defaults: { style: "confiante", emoji_policy: "somente_se_cliente_usar" }
};

// ============================================
// PACK 2: SaaS
// ============================================
export const SAAS_PACK: NichePack = {
    niche: "saas",
    intents: ["duvida", "qualificacao", "demo", "comparacao", "objecao", "suporte"],
    min_questions_by_intent: {
        duvida: ["O que você quer entender melhor?"],
        qualificacao: ["Isso é pra resolver este mês ou só mapear?"],
        demo: ["Quer ver na prática ou prefere uma explicação?"],
        comparacao: ["O que você está comparando: funcionalidade, preço ou suporte?"],
        objecao: ["O que te impede de decidir agora?"],
        suporte: ["Qual problema específico você está enfrentando?"]
    },
    qualification: {
        icp: ["Quantas pessoas usam hoje?", "Isso é pra resolver este mês ou só mapear?"],
        pain_axis: ["Isso te custa mais tempo, dinheiro ou oportunidade?"]
    },
    objections: {
        ja_tenho: "O que você gosta no que usa hoje, e o que te incomoda de verdade?",
        sem_budget: "Entendi. Se resolvesse X, isso pagaria por si em tempo ou receita?",
        nao_decisor: "Quem decide com você? Quer que eu te mande um resumo pra encaminhar?"
    },
    prohibited: ["roi", "otimizar processos", "lider de mercado", "melhor do brasil"],
    handoff_triggers: ["preciso falar com vendas", "manda proposta", "preciso validar com time"],
    tone_defaults: { style: "consultivo_direto", emoji_policy: "minimo" }
};

// ============================================
// PACK 3: MERCADO FINANCEIRO (MODO RISCO)
// ============================================
export const MERCADO_FINANCEIRO_PACK: NichePack = {
    niche: "mercado_financeiro",
    risk_mode: true,
    intents: ["duvida", "comparacao", "perfil", "suporte", "urgencia"],
    allowed: [
        "explicar conceitos",
        "organizar informacoes",
        "comparar produtos por regras publicas",
        "encaminhar para especialista"
    ],
    forbidden: [
        "recomendacao personalizada",
        "promessa de retorno",
        "sugestao de ativo",
        "garantia de rendimento"
    ],
    min_questions_by_intent: {
        duvida: ["Você quer entender o conceito ou tirar uma dúvida pontual?"],
        comparacao: ["Você está comparando liquidez, risco, taxa ou prazo?"],
        perfil: ["Você já tem um perfil definido (conservador/moderado/arrojado) ou quer só entender?"],
        suporte: ["Qual produto/serviço e o que aconteceu?"],
        urgencia: ["Isso envolve acesso, fraude ou perda recente?"]
    },
    objections: {
        nao_entendo: "Sem problema. Quer que eu explique em termos mais simples?",
        arriscado: "Entendo a preocupação. Quer entender melhor os níveis de risco disponíveis?",
        muito_dinheiro: "Cada perfil tem um ponto de entrada diferente. Quer que eu explique as opções?"
    },
    prohibited: [
        "garanto retorno",
        "vai subir",
        "vai cair",
        "invista agora",
        "oportunidade imperdivel",
        "rentabilidade garantida"
    ],
    handoff_triggers: [
        "recomenda um ativo",
        "quanto eu devo investir",
        "qual melhor investimento",
        "fui fraudado",
        "perdi acesso"
    ],
    tone_defaults: { style: "sobrio_preciso", emoji_policy: "zero" }
};

// ============================================
// MAPEAMENTO POR NICHO
// ============================================
const NICHE_MAPPING: Record<string, NichePack> = {
    // Serviços
    servicos: SERVICOS_PACK,
    advocacia: SERVICOS_PACK,
    direito: SERVICOS_PACK,
    juridico: SERVICOS_PACK,
    clinica: SERVICOS_PACK,
    saude: SERVICOS_PACK,
    medico: SERVICOS_PACK,
    consultorio: SERVICOS_PACK,
    imobiliaria: SERVICOS_PACK,
    corretor: SERVICOS_PACK,
    imoveis: SERVICOS_PACK,
    arquitetura: SERVICOS_PACK,
    design: SERVICOS_PACK,
    consultoria: SERVICOS_PACK,
    contabilidade: SERVICOS_PACK,
    educacao: SERVICOS_PACK,
    escola: SERVICOS_PACK,
    curso: SERVICOS_PACK,

    // E-commerce (usa Serviços por enquanto)
    ecommerce: SERVICOS_PACK,
    loja: SERVICOS_PACK,
    varejo: SERVICOS_PACK,

    // SaaS
    saas: SAAS_PACK,
    software: SAAS_PACK,
    plataforma: SAAS_PACK,
    sistema: SAAS_PACK,
    aplicativo: SAAS_PACK,
    app: SAAS_PACK,
    tech: SAAS_PACK,
    tecnologia: SAAS_PACK,

    // Mercado Financeiro
    mercado_financeiro: MERCADO_FINANCEIRO_PACK,
    financeiro: MERCADO_FINANCEIRO_PACK,
    investimento: MERCADO_FINANCEIRO_PACK,
    investimentos: MERCADO_FINANCEIRO_PACK,
    assessoria_investimentos: MERCADO_FINANCEIRO_PACK,
    corretora: MERCADO_FINANCEIRO_PACK,
    banco: MERCADO_FINANCEIRO_PACK,
    fintech: MERCADO_FINANCEIRO_PACK,
    cripto: MERCADO_FINANCEIRO_PACK,
    trading: MERCADO_FINANCEIRO_PACK,
};

export function getNichePack(niche: string): NichePack {
    const normalized = niche.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '_');

    return NICHE_MAPPING[normalized] || SERVICOS_PACK;
}

export function detectNicheFromText(text: string): string {
    const normalized = text.toLowerCase();

    // Padrões de detecção
    const patterns: [RegExp, string][] = [
        [/advog|direito|juríd|legal|processo/, 'advocacia'],
        [/médic|clínic|saúde|hospital|consult|paciente/, 'saude'],
        [/imobili|corretor|imóv|apartamento|casa/, 'imobiliaria'],
        [/saas|software|plataforma|sistema|app|aplicat/, 'saas'],
        [/invest|financ|bolsa|açõ|fund|cdb|tesouro|cripto|trading/, 'mercado_financeiro'],
        [/loja|e-?commerce|varejo|produto|vend/, 'ecommerce'],
        [/escola|curso|educaç|treinament|ensino/, 'educacao'],
        [/consult|assessor|mentor/, 'consultoria'],
    ];

    for (const [pattern, niche] of patterns) {
        if (pattern.test(normalized)) {
            return niche;
        }
    }

    return 'servicos';
}

// ============================================
// KERNEL PROMPT GENERATOR
// ============================================
export function generateKernelPrompt(pack: NichePack): string {
    const riskWarning = pack.risk_mode
        ? `
⚠️ MODO RISCO ATIVO (${pack.niche})
PERMITIDO: ${pack.allowed?.join(', ')}
PROIBIDO: ${pack.forbidden?.join(', ')}
Em caso de dúvida sobre risco, faça handoff imediato.
`
        : '';

    return `
# Lx Humanization Kernel v1.0 (${pack.niche.toUpperCase()})

MISSÃO
Conduzir conversas naturais, úteis e seguras com baixo atrito, representando a identidade da empresa.

${riskWarning}

REGRAS IMUTÁVEIS (CORE)
1) Responda em 1–2 frases.
2) Faça no máximo 1 pergunta por mensagem.
3) Use espelhamento mínimo (3–6 palavras do usuário) antes de perguntar.
4) Sempre classifique a intenção (uma só): ${pack.intents.join('/')}.
5) Nunca invente: preço, prazo, estoque, políticas, integrações, resultados garantidos.
6) Se faltar informação: peça 1 dado crítico por vez.
7) Sempre feche com próximo passo leve (WhatsApp/agenda/resumo).
8) Se risco setorial: seja sóbrio, reduza escopo e faça handoff quando necessário.

PALAVRAS/FRASES PROIBIDAS
${pack.prohibited.join(', ')}

HANDOFF (criterioso)
Faça handoff quando detectar:
${pack.handoff_triggers.map(t => `- "${t}"`).join('\n')}

TOM
Estilo: ${pack.tone_defaults.style}
Emojis: ${pack.tone_defaults.emoji_policy}

TRATAMENTO DE OBJEÇÕES
${Object.entries(pack.objections).map(([key, value]) => `- Se "${key}": ${value}`).join('\n')}
`;
}
