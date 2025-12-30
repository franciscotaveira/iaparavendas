-- ============================================
-- LX AGENTS - UNIVERSAL RAPPORT ENGINE (URE)
-- Execute no Supabase SQL Editor
-- ============================================
-- 1. CONHECIMENTO GEOGRÁFICO
CREATE TABLE IF NOT EXISTS geo_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    country VARCHAR(100) NOT NULL DEFAULT 'Brasil',
    state VARCHAR(100),
    city VARCHAR(100),
    knowledge_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    conversation_hooks TEXT [],
    follow_up_questions TEXT [],
    emotional_weight FLOAT DEFAULT 0.5,
    usage_count INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_geo_city ON geo_knowledge(city);
CREATE INDEX IF NOT EXISTS idx_geo_state ON geo_knowledge(state);
-- 2. CONHECIMENTO PROFISSIONAL
CREATE TABLE IF NOT EXISTS professional_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    profession VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    knowledge_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    conversation_hooks TEXT [],
    follow_up_questions TEXT [],
    emotional_weight FLOAT DEFAULT 0.5
);
CREATE INDEX IF NOT EXISTS idx_prof_profession ON professional_knowledge(profession);
-- 3. SEED: CAPITAIS BRASILEIRAS
INSERT INTO geo_knowledge (
        city,
        state,
        knowledge_type,
        content,
        conversation_hooks,
        follow_up_questions,
        emotional_weight
    )
VALUES -- São Paulo
    (
        'São Paulo',
        'São Paulo',
        'nickname',
        'a terra da garoa',
        ARRAY ['Ah, SP!', 'A famosa'],
        ARRAY ['Mora na capital mesmo ou região metropolitana?'],
        0.8
    ),
    (
        'São Paulo',
        'São Paulo',
        'landmark',
        'Paulista é icônica',
        ARRAY ['A Avenida ', 'Conheço! A'],
        ARRAY ['Trabalha por lá?'],
        0.85
    ),
    (
        'São Paulo',
        'São Paulo',
        'culture',
        'gastronomia incrível, tem de tudo',
        ARRAY ['Cidade da ', 'Famosa pela'],
        ARRAY ['Qual sua culinária favorita de SP?'],
        0.75
    ),
    -- Rio de Janeiro
    (
        'Rio de Janeiro',
        'Rio de Janeiro',
        'nickname',
        'a cidade maravilhosa',
        ARRAY ['O Rio!', 'A famosa'],
        ARRAY ['Zona Sul, Norte ou Oeste?'],
        0.95
    ),
    (
        'Rio de Janeiro',
        'Rio de Janeiro',
        'landmark',
        'vista do Cristo é única',
        ARRAY ['A ', 'Famoso pelo'],
        ARRAY ['Já subiu no Corcovado?'],
        0.9
    ),
    -- Belo Horizonte
    (
        'Belo Horizonte',
        'Minas Gerais',
        'nickname',
        'a capital do pão de queijo',
        ARRAY ['BH!', 'A famosa'],
        ARRAY ['Mineiro raiz?'],
        0.85
    ),
    (
        'Belo Horizonte',
        'Minas Gerais',
        'culture',
        'boteco é tradição por lá',
        ARRAY ['Terra de ', 'Famosa pelos'],
        ARRAY ['Frequenta os botecos tradicionais?'],
        0.8
    ),
    -- Curitiba
    (
        'Curitiba',
        'Paraná',
        'nickname',
        'a capital mais fria do Brasil',
        ARRAY ['Curitiba!', 'A gelada'],
        ARRAY ['Aguenta bem o frio?'],
        0.8
    ),
    (
        'Curitiba',
        'Paraná',
        'landmark',
        'Jardim Botânico é cartão postal',
        ARRAY ['O famoso ', 'Conheço! O'],
        ARRAY ['Mora perto do centro?'],
        0.85
    ),
    -- Porto Alegre
    (
        'Porto Alegre',
        'Rio Grande do Sul',
        'nickname',
        'a capital gaúcha',
        ARRAY ['POA!', 'A querida'],
        ARRAY ['Gaúcho de nascença?'],
        0.85
    ),
    (
        'Porto Alegre',
        'Rio Grande do Sul',
        'culture',
        'chimarrão é quase obrigatório',
        ARRAY ['Terra do ', 'Famosa pelo'],
        ARRAY ['Toma mate todo dia?'],
        0.8
    ),
    -- Recife
    (
        'Recife',
        'Pernambuco',
        'nickname',
        'a Veneza brasileira',
        ARRAY ['Recife!', 'A bela'],
        ARRAY ['Nasceu lá ou se mudou?'],
        0.85
    ),
    (
        'Recife',
        'Pernambuco',
        'culture',
        'frevo e maracatu são tradição',
        ARRAY ['Terra do ', 'Famosa pelo'],
        ARRAY ['Curte carnaval?'],
        0.8
    ),
    -- Salvador
    (
        'Salvador',
        'Bahia',
        'nickname',
        'a capital da alegria',
        ARRAY ['Salvador!', 'A animada'],
        ARRAY ['Baiano de coração?'],
        0.9
    ),
    (
        'Salvador',
        'Bahia',
        'culture',
        'acarajé é patrimônio',
        ARRAY ['Terra do ', 'Famosa pelo'],
        ARRAY ['Qual sua comida baiana favorita?'],
        0.85
    ),
    -- Fortaleza
    (
        'Fortaleza',
        'Ceará',
        'nickname',
        'a terra do sol',
        ARRAY ['Fortal!', 'A ensolarada'],
        ARRAY ['Praia todo fim de semana?'],
        0.85
    ),
    (
        'Fortaleza',
        'Ceará',
        'landmark',
        'Praia do Futuro é point',
        ARRAY ['A famosa ', 'Conheço! A'],
        ARRAY ['Frequenta os barracões?'],
        0.8
    ),
    -- Brasília
    (
        'Brasília',
        'Distrito Federal',
        'nickname',
        'a capital planejada',
        ARRAY ['BSB!', 'A moderna'],
        ARRAY ['Nasceu lá ou foi a trabalho?'],
        0.75
    ),
    (
        'Brasília',
        'Distrito Federal',
        'landmark',
        'Esplanada é impressionante',
        ARRAY ['A ', 'Famosa pela'],
        ARRAY ['Trabalha no governo?'],
        0.7
    ),
    -- Manaus
    (
        'Manaus',
        'Amazonas',
        'nickname',
        'o coração da Amazônia',
        ARRAY ['Manaus!', 'A'],
        ARRAY ['Nasceu na floresta?'],
        0.85
    ),
    (
        'Manaus',
        'Amazonas',
        'landmark',
        'Teatro Amazonas é lindo',
        ARRAY ['O famoso ', 'Conheço! O'],
        ARRAY ['Já foi ao teatro?'],
        0.8
    ),
    -- Florianópolis
    (
        'Florianópolis',
        'Santa Catarina',
        'nickname',
        'a ilha da magia',
        ARRAY ['Floripa!', 'A paradisíaca'],
        ARRAY ['Qual praia é sua favorita?'],
        0.9
    ),
    (
        'Florianópolis',
        'Santa Catarina',
        'culture',
        'qualidade de vida é alta',
        ARRAY ['Terra de ', 'Famosa pela'],
        ARRAY ['Surfa?'],
        0.85
    ),
    -- Imperatriz (exemplo do URE)
    (
        'Imperatriz',
        'Maranhão',
        'nickname',
        'a Princesinha do Tocantins',
        ARRAY ['Imperatriz!', 'A famosa'],
        ARRAY ['Você é de lá mesmo ou se mudou?'],
        0.85
    ),
    (
        'Imperatriz',
        'Maranhão',
        'ranking',
        'segunda maior cidade do Maranhão',
        ARRAY ['Uma das maiores do estado, né?'],
        ARRAY ['Como é viver numa cidade desse porte?'],
        0.7
    ),
    (
        'Imperatriz',
        'Maranhão',
        'landmark',
        'Beira-Rio é point clássico',
        ARRAY ['Já ouvi falar da ', 'A famosa'],
        ARRAY ['Ainda é movimentada?'],
        0.9
    ),
    -- Chapecó
    (
        'Chapecó',
        'Santa Catarina',
        'nickname',
        'a capital do Oeste',
        ARRAY ['Chapecó!', 'A forte'],
        ARRAY ['Chapecoense, né?'],
        0.8
    ),
    (
        'Chapecó',
        'Santa Catarina',
        'economy',
        'polo de agroindústria',
        ARRAY ['Região forte em ', 'Terra da'],
        ARRAY ['Trabalha com agro?'],
        0.7
    ) ON CONFLICT DO NOTHING;
-- 4. SEED: PROFISSÕES
INSERT INTO professional_knowledge (
        profession,
        industry,
        knowledge_type,
        content,
        conversation_hooks,
        follow_up_questions,
        emotional_weight
    )
VALUES -- Advocacia
    (
        'advogado',
        'jurídico',
        'daily_challenge',
        'lidar com prazos e processos simultâneos',
        ARRAY ['Sei que advogado vive correndo com'],
        ARRAY ['Quantos processos ativos você tem?'],
        0.8
    ),
    (
        'advogado',
        'jurídico',
        'pain_point',
        'clientes que querem tudo pra ontem',
        ARRAY ['A clássica pressão de'],
        ARRAY ['Como você lida com isso?'],
        0.85
    ),
    -- Medicina
    (
        'médico',
        'saúde',
        'daily_challenge',
        'agenda lotada e pacientes ansiosos',
        ARRAY ['Sei que médico lida com'],
        ARRAY ['Como está sua agenda?'],
        0.8
    ),
    (
        'médico',
        'saúde',
        'pain_point',
        'burocracia de planos de saúde',
        ARRAY ['A famosa dor de cabeça com'],
        ARRAY ['Atende particular também?'],
        0.75
    ),
    -- Corretor de Imóveis
    (
        'corretor',
        'imobiliária',
        'daily_challenge',
        'convencer cliente indeciso',
        ARRAY ['Sei que corretor lida com'],
        ARRAY ['Qual seu ticket médio?'],
        0.8
    ),
    (
        'corretor',
        'imobiliária',
        'tool',
        'visitas, fotos e portais',
        ARRAY ['O dia a dia de'],
        ARRAY ['Usa muito os portais?'],
        0.7
    ),
    -- Dentista
    (
        'dentista',
        'saúde',
        'daily_challenge',
        'pacientes com medo',
        ARRAY ['Sei que dentista lida com'],
        ARRAY ['Muitos pacientes têm medo?'],
        0.8
    ),
    (
        'dentista',
        'saúde',
        'pain_point',
        'no-show de pacientes',
        ARRAY ['A famosa dor de'],
        ARRAY ['Quantos faltam por semana?'],
        0.85
    ),
    -- Conta
    (
        'contador',
        'financeiro',
        'daily_challenge',
        'declarações e prazos fiscais',
        ARRAY ['Sei que contador vive em'],
        ARRAY ['Época de IR é pesada?'],
        0.8
    ),
    (
        'contador',
        'financeiro',
        'tool',
        'sistemas, planilhas e legislação',
        ARRAY ['O dia a dia de'],
        ARRAY ['Qual sistema usa?'],
        0.7
    ),
    -- Arquiteto
    (
        'arquiteto',
        'construção',
        'daily_challenge',
        'alinhar expectativa com orçamento',
        ARRAY ['Sei que arquiteto lida com'],
        ARRAY ['Cliente sempre quer gastar menos, né?'],
        0.8
    ),
    -- Coach/Consultor
    (
        'coach',
        'desenvolvimento',
        'daily_challenge',
        'provar resultado intangível',
        ARRAY ['Sei que coach lida com'],
        ARRAY ['Como você mede resultado?'],
        0.75
    ),
    -- Empresário
    (
        'empresário',
        'negócios',
        'daily_challenge',
        'fazer tudo ao mesmo tempo',
        ARRAY ['Sei que empresário vive'],
        ARRAY ['Qual sua maior dor hoje?'],
        0.85
    ),
    (
        'empresário',
        'negócios',
        'pain_point',
        'falta de tempo para estratégia',
        ARRAY ['A clássica falta de'],
        ARRAY ['Consegue pensar no longo prazo?'],
        0.8
    ) ON CONFLICT DO NOTHING;
-- 5. PERGUNTAS DE OURO (para o fluxo de degustação)
CREATE TABLE IF NOT EXISTS golden_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    question_order INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_purpose VARCHAR(100),
    -- 'rapport', 'qualification', 'pain', 'urgency'
    expected_entity VARCHAR(50),
    -- 'city', 'profession', 'budget', 'timeline'
    follow_up_positive TEXT,
    -- se responder bem
    follow_up_negative TEXT,
    -- se responder mal
    active BOOLEAN DEFAULT true
);
INSERT INTO golden_questions (
        question_order,
        question_text,
        question_purpose,
        expected_entity,
        follow_up_positive
    )
VALUES (
        1,
        'De onde você está falando? Qual cidade?',
        'rapport',
        'city',
        'Que legal! [URE_HOOK]'
    ),
    (
        2,
        'E qual é o seu negócio? O que você faz?',
        'qualification',
        'profession',
        '[PROFESSIONAL_HOOK] E como está a demanda?'
    ),
    (
        3,
        'Qual o seu maior desafio com vendas hoje?',
        'pain',
        'pain_point',
        'Entendo perfeitamente. Isso é comum em [INDUSTRY].'
    ),
    (
        4,
        'Se você pudesse resolver isso essa semana, quanto isso valeria pra você?',
        'urgency',
        'urgency_level',
        'Faz sentido. Deixa eu te mostrar como funciona na prática...'
    ),
    (
        5,
        'Você tem alguém na equipe que cuida de vendas ou é só você?',
        'qualification',
        'team_size',
        'Perfeito. Nosso sistema se adapta a [TEAM_CONTEXT].'
    ) ON CONFLICT DO NOTHING;
-- 6. VERIFICAÇÃO
SELECT 'geo_knowledge' as tabela,
    count(*) as registros
FROM geo_knowledge
UNION ALL
SELECT 'professional_knowledge',
    count(*)
FROM professional_knowledge
UNION ALL
SELECT 'golden_questions',
    count(*)
FROM golden_questions;