// ============================================
// LX KNOWLEDGE BASE - Sistema de Conhecimento
// ============================================
// Conhecimento estruturado para os agentes
// Base para RAG e respostas contextualizadas
// ============================================

// ============================================
// CONHECIMENTO DE VENDAS
// ============================================
export const SALES_KNOWLEDGE = {
    // Técnicas de fechamento
    closing_techniques: [
        {
            name: 'Trial Close',
            description: 'Testar a receptividade antes do fechamento final',
            examples: ['Se resolvermos X, você estaria pronto para avançar?', 'Faz sentido para você?'],
            when_to_use: 'A qualquer momento para medir interesse'
        },
        {
            name: 'Assumptive Close',
            description: 'Assumir que a venda já está feita',
            examples: ['Qual email devo usar para enviar o contrato?', 'Prefere começar essa semana ou na próxima?'],
            when_to_use: 'Quando sinais de compra são fortes'
        },
        {
            name: 'Urgency Close',
            description: 'Criar senso de urgência legítimo',
            examples: ['Temos vagas limitadas esse mês', 'O preço atual vai até sexta'],
            when_to_use: 'Quando há urgência real (não fabricada)'
        },
        {
            name: 'Summary Close',
            description: 'Resumir benefícios acordados',
            examples: ['Então você quer: A, B e C. Faz sentido fecharmos?'],
            when_to_use: 'Após discussão longa'
        }
    ],

    // Tratamento de objeções
    objection_handling: {
        price: {
            framework: 'Isolar, Entender, Reformular',
            responses: [
                'Entendo a preocupação com investimento. Posso perguntar: o que seria um retorno justo para você?',
                'Comparado a que você considera caro? Quer que eu detalhe o que está incluído?',
                'Se o preço não fosse um fator, você veria valor na solução?'
            ]
        },
        timing: {
            framework: 'Respeitar, Qualificar, Nutrir',
            responses: [
                'Tranquilo. Você está pensando por timing ou por alguma dúvida?',
                'Faz sentido. Posso te mandar um resumo por escrito pra você revisar com calma?',
                'O que mudaria pra ser o momento certo?'
            ]
        },
        competitor: {
            framework: 'Curiosity, Acknowledge, Differentiate',
            responses: [
                'Interessante! O que te atraiu neles? Ajuda eu entender.',
                'Legal conhecer. O que você mais gosta no que usa hoje, e o que te incomoda?',
                'Entendo. Nosso diferencial é X. Faz sentido pra você?'
            ]
        },
        authority: {
            framework: 'Map, Enable, Follow-up',
            responses: [
                'Quem mais participa dessa decisão? Posso te mandar material pra você encaminhar.',
                'Perfeito. Quer que eu prepare algo específico pra você apresentar?',
                'Faz sentido uma call com as pessoas envolvidas?'
            ]
        }
    },

    // Qualificação BANT
    bant_questions: {
        budget: [
            'Você já tem um budget definido para isso?',
            'Como vocês costumam avaliar investimentos assim?'
        ],
        authority: [
            'Quem mais participa dessa decisão?',
            'Como funciona o processo de decisão aí?'
        ],
        need: [
            'Qual problema você quer resolver primeiro?',
            'Como isso afeta seu dia a dia hoje?'
        ],
        timeline: [
            'Isso é pra resolver agora ou só mapeando?',
            'Você tem um prazo em mente?'
        ]
    }
};

// ============================================
// CONHECIMENTO DE DESENVOLVIMENTO
// ============================================
export const DEV_KNOWLEDGE = {
    // Best practices
    best_practices: {
        code_review: [
            'Revisar lógica de negócio antes de estilo',
            'Verificar edge cases e tratamento de erros',
            'Confirmar cobertura de testes',
            'Validar nomes de variáveis e funções'
        ],
        security: [
            'Validar todos os inputs',
            'Nunca confiar em dados do cliente',
            'Usar parametrized queries',
            'Implementar rate limiting',
            'Logs sem dados sensíveis'
        ],
        performance: [
            'Medir antes de otimizar',
            'Lazy loading para recursos pesados',
            'Caching estratégico',
            'Índices corretos no banco'
        ]
    },

    // Padrões de arquitetura
    architecture_patterns: {
        clean_architecture: {
            layers: ['Domain', 'Application', 'Infrastructure', 'Presentation'],
            principles: ['Inversão de dependência', 'Separação de concerns', 'Testabilidade']
        },
        microservices: {
            when_to_use: 'Escala grande, times independentes, deploy separado',
            when_not_to_use: 'Time pequeno, MVP, complexidade baixa',
            patterns: ['API Gateway', 'Service Discovery', 'Circuit Breaker', 'Saga']
        }
    },

    // Stack recommendations
    stack_recommendations: {
        startup_mvp: {
            frontend: 'Next.js + TypeScript',
            backend: 'Next.js API Routes ou Express',
            database: 'PostgreSQL via Supabase',
            hosting: 'Vercel',
            reasoning: 'Velocidade de desenvolvimento, custo baixo, escala quando precisar'
        },
        saas_b2b: {
            frontend: 'Next.js + TypeScript + Tailwind',
            backend: 'Node.js ou Go',
            database: 'PostgreSQL + Redis',
            hosting: 'AWS ou Vercel + Railway',
            reasoning: 'Flexibilidade, enterprise-ready, bom ecossistema'
        }
    }
};

// ============================================
// CONHECIMENTO DE MARKETING
// ============================================
export const MARKETING_KNOWLEDGE = {
    // Copywriting frameworks
    copywriting_frameworks: {
        AIDA: {
            steps: ['Attention', 'Interest', 'Desire', 'Action'],
            example: 'Headline impactante → Problema reconhecível → Benefício/prova → CTA claro'
        },
        PAS: {
            steps: ['Problem', 'Agitate', 'Solution'],
            example: 'Identificar dor → Aumentar urgência → Apresentar solução'
        },
        BAB: {
            steps: ['Before', 'After', 'Bridge'],
            example: 'Situação atual → Situação desejada → Como chegar lá'
        }
    },

    // Métricas por canal
    channel_benchmarks: {
        facebook_ads: {
            good_ctr: '2-5%',
            average_cpc: 'R$ 0.50 - R$ 3.00',
            target_roas: '3x+'
        },
        google_ads: {
            good_ctr: '3-5%',
            average_cpc: 'R$ 1.00 - R$ 5.00',
            target_roas: '4x+'
        },
        email: {
            good_open_rate: '20-30%',
            good_ctr: '2-5%',
            good_conversion: '1-3%'
        }
    },

    // Estratégias de growth
    growth_strategies: {
        product_led: {
            description: 'Produto como principal canal de aquisição',
            tactics: ['Freemium', 'Free trial', 'Virality features', 'Self-serve']
        },
        content_led: {
            description: 'Conteúdo como motor de aquisição',
            tactics: ['SEO', 'Blog', 'YouTube', 'Podcasts', 'Social proof']
        },
        sales_led: {
            description: 'Time de vendas como motor',
            tactics: ['Outbound', 'SDR', 'Field sales', 'Partnerships']
        }
    }
};

// ============================================
// CONHECIMENTO DE PRODUTO
// ============================================
export const PRODUCT_KNOWLEDGE = {
    // Frameworks de priorização
    prioritization_frameworks: {
        RICE: {
            formula: '(Reach × Impact × Confidence) / Effort',
            scoring: {
                reach: 'Número de usuários impactados',
                impact: '0.25 (mínimo) a 3 (massivo)',
                confidence: '0-100%',
                effort: 'Person-weeks'
            }
        },
        ICE: {
            formula: '(Impact + Confidence + Ease) / 3',
            scoring: 'Cada fator de 1-10'
        },
        MoSCoW: {
            categories: ['Must have', 'Should have', 'Could have', 'Won\'t have']
        }
    },

    // Discovery contínuo
    discovery_methods: {
        user_interviews: {
            sample_size: '5-8 usuários para 85% dos insights',
            duration: '30-45 minutos',
            best_practices: ['Perguntas abertas', 'Não liderar', 'Explorar o porquê']
        },
        usability_testing: {
            sample_size: '5 usuários',
            focus: 'Tarefas específicas, não preferências',
            metrics: ['Success rate', 'Time on task', 'Error rate']
        }
    },

    // Métricas de produto
    product_metrics: {
        activation: 'Usuário completou ação chave (Aha moment)',
        engagement: 'DAU/MAU, tempo na plataforma, features usadas',
        retention: 'D1, D7, D30 retention',
        revenue: 'ARPU, expansion revenue, churn'
    }
};

// ============================================
// CONHECIMENTO DE OPERAÇÕES
// ============================================
export const OPS_KNOWLEDGE = {
    // OKRs
    okr_framework: {
        objective: {
            characteristics: ['Qualitativo', 'Inspirador', 'Memorável'],
            bad_example: 'Aumentar receita',
            good_example: 'Ser a referência em IA para vendas no Brasil'
        },
        key_results: {
            characteristics: ['Mensurável', 'Específico', 'Desafiador mas alcançável'],
            target: '70% de atingimento = sucesso (stretch goals)'
        },
        cadence: {
            weekly: 'Check-in de 15 minutos',
            monthly: 'Deep dive de 1 hora',
            quarterly: 'Retrospectiva e planejamento'
        }
    },

    // Unit economics
    unit_economics: {
        saas_metrics: {
            ltv_cac_ratio: 'Ideal > 3, Excelente > 5',
            payback_period: 'Ideal < 12 meses',
            gross_margin: 'SaaS típico > 70%',
            net_revenue_retention: 'Bom > 100%, Excelente > 120%'
        },
        formulas: {
            CAC: '(Marketing + Vendas) / Novos Clientes',
            LTV: '(ARPU × Margem) / Churn',
            Payback: 'CAC / (ARPU × Margem)'
        }
    },

    // Hiring
    hiring_best_practices: {
        process: [
            'Screening call (30min)',
            'Technical/Skill assessment (60min)',
            'Culture fit (45min)',
            'Case/Challenge (60min)',
            'Reference check (2-3 referências)'
        ],
        red_flags: [
            'Fala mal de empregadores anteriores',
            'Não demonstra curiosidade',
            'Respostas genéricas sem exemplos',
            'Inconsistências no histórico'
        ]
    }
};

// ============================================
// Export unificado
// ============================================
export const KNOWLEDGE_BASE = {
    sales: SALES_KNOWLEDGE,
    development: DEV_KNOWLEDGE,
    marketing: MARKETING_KNOWLEDGE,
    product: PRODUCT_KNOWLEDGE,
    operations: OPS_KNOWLEDGE
};

// ============================================
// Busca no conhecimento
// ============================================
export function searchKnowledge(query: string): { category: string; topic: string; content: any }[] {
    const results: { category: string; topic: string; content: any }[] = [];
    const lowerQuery = query.toLowerCase();

    // Busca simples por keywords
    const searchInObject = (obj: any, category: string, path: string = '') => {
        if (typeof obj === 'string') {
            if (obj.toLowerCase().includes(lowerQuery)) {
                results.push({ category, topic: path, content: obj });
            }
        } else if (Array.isArray(obj)) {
            obj.forEach((item, i) => searchInObject(item, category, `${path}[${i}]`));
        } else if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
                const newPath = path ? `${path}.${key}` : key;
                if (key.toLowerCase().includes(lowerQuery)) {
                    results.push({ category, topic: newPath, content: value });
                }
                searchInObject(value, category, newPath);
            });
        }
    };

    Object.entries(KNOWLEDGE_BASE).forEach(([category, knowledge]) => {
        searchInObject(knowledge, category);
    });

    return results.slice(0, 10); // Limitar resultados
}
