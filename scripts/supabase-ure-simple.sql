-- ============================================
-- UNIVERSAL RAPPORT ENGINE - VERSÃO FINAL
-- Execute no Supabase SQL Editor
-- ============================================
-- EXTENSÃO
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- ============================================
-- TABELAS
-- ============================================
CREATE TABLE IF NOT EXISTS geo_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    city VARCHAR(200),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Brasil',
    knowledge_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    conversation_hooks TEXT [],
    follow_up_questions TEXT [],
    emotional_weight FLOAT DEFAULT 0.5,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);
CREATE TABLE IF NOT EXISTS professional_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    profession VARCHAR(100),
    industry VARCHAR(100),
    knowledge_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    conversation_hooks TEXT [],
    follow_up_questions TEXT [],
    emotional_weight FLOAT DEFAULT 0.5,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);
CREATE TABLE IF NOT EXISTS golden_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    question_order INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_purpose VARCHAR(100),
    expected_entity VARCHAR(50),
    follow_up_positive TEXT,
    active BOOLEAN DEFAULT true
);
-- ============================================
-- SEED: CIDADES
-- ============================================
INSERT INTO geo_knowledge (
        city,
        state,
        knowledge_type,
        content,
        conversation_hooks,
        follow_up_questions,
        emotional_weight
    )
VALUES (
        'São Paulo',
        'São Paulo',
        'nickname',
        'a terra da garoa',
        '{"Ah, SP!", "A famosa"}',
        '{"Mora na capital mesmo?"}',
        0.8
    ),
    (
        'São Paulo',
        'São Paulo',
        'landmark',
        'Paulista é icônica',
        '{"A Avenida", "Conheço!"}',
        '{"Trabalha por lá?"}',
        0.85
    ),
    (
        'Rio de Janeiro',
        'Rio de Janeiro',
        'nickname',
        'a cidade maravilhosa',
        '{"O Rio!", "A maravilhosa"}',
        '{"Zona Sul ou Norte?"}',
        0.95
    ),
    (
        'Rio de Janeiro',
        'Rio de Janeiro',
        'landmark',
        'vista do Cristo é única',
        '{"O famoso", "A vista do"}',
        '{"Já subiu no Corcovado?"}',
        0.9
    ),
    (
        'Belo Horizonte',
        'Minas Gerais',
        'nickname',
        'a capital do pão de queijo',
        '{"BH!", "A famosa"}',
        '{"Mineiro raiz?"}',
        0.85
    ),
    (
        'Belo Horizonte',
        'Minas Gerais',
        'culture',
        'boteco é tradição',
        '{"Terra de", "Famosa pelos"}',
        '{"Frequenta os botecos?"}',
        0.8
    ),
    (
        'Curitiba',
        'Paraná',
        'nickname',
        'a capital mais fria do Brasil',
        '{"Curitiba!", "A gelada"}',
        '{"Aguenta bem o frio?"}',
        0.8
    ),
    (
        'Curitiba',
        'Paraná',
        'landmark',
        'Jardim Botânico é cartão postal',
        '{"O famoso", "Conheço!"}',
        '{"Mora perto do centro?"}',
        0.85
    ),
    (
        'Porto Alegre',
        'Rio Grande do Sul',
        'nickname',
        'a capital gaúcha',
        '{"POA!", "A querida"}',
        '{"Gaúcho de nascença?"}',
        0.85
    ),
    (
        'Porto Alegre',
        'Rio Grande do Sul',
        'culture',
        'chimarrão é obrigatório',
        '{"Terra do", "Famosa pelo"}',
        '{"Toma mate todo dia?"}',
        0.8
    ),
    (
        'Porto Alegre',
        'Rio Grande do Sul',
        'sports',
        'Grenal para tudo',
        '{"A cidade do", "Onde o"}',
        '{"Gremista ou colorado?"}',
        0.9
    ),
    (
        'Florianópolis',
        'Santa Catarina',
        'nickname',
        'a ilha da magia',
        '{"Floripa!", "A paradisíaca"}',
        '{"Qual praia favorita?"}',
        0.9
    ),
    (
        'Salvador',
        'Bahia',
        'nickname',
        'a capital da alegria',
        '{"Salvador!", "A animada"}',
        '{"Baiano de coração?"}',
        0.9
    ),
    (
        'Salvador',
        'Bahia',
        'culture',
        'acarajé é patrimônio',
        '{"Terra do", "Famosa pelo"}',
        '{"Comida baiana favorita?"}',
        0.85
    ),
    (
        'Fortaleza',
        'Ceará',
        'nickname',
        'a terra do sol',
        '{"Fortal!", "A ensolarada"}',
        '{"Praia todo fim de semana?"}',
        0.85
    ),
    (
        'Recife',
        'Pernambuco',
        'nickname',
        'a Veneza brasileira',
        '{"Recife!", "A bela"}',
        '{"Nasceu lá ou se mudou?"}',
        0.85
    ),
    (
        'Recife',
        'Pernambuco',
        'culture',
        'frevo e maracatu são tradição',
        '{"Terra do", "Famosa pelo"}',
        '{"Curte carnaval?"}',
        0.8
    ),
    (
        'Brasília',
        'Distrito Federal',
        'nickname',
        'a capital planejada',
        '{"BSB!", "A moderna"}',
        '{"Nasceu lá ou trabalho?"}',
        0.75
    ),
    (
        'Manaus',
        'Amazonas',
        'nickname',
        'o coração da Amazônia',
        '{"Manaus!", "A"}',
        '{"Nasceu na floresta?"}',
        0.85
    ),
    (
        'Imperatriz',
        'Maranhão',
        'nickname',
        'a Princesinha do Tocantins',
        '{"Imperatriz!", "A famosa"}',
        '{"Você é de lá mesmo?"}',
        0.85
    ),
    (
        'Imperatriz',
        'Maranhão',
        'ranking',
        'segunda maior do Maranhão',
        '{"Uma das maiores do estado!"}',
        '{"Como é viver lá?"}',
        0.7
    ),
    (
        'Imperatriz',
        'Maranhão',
        'landmark',
        'Beira-Rio é point clássico',
        '{"Já ouvi falar da", "A famosa"}',
        '{"Ainda é movimentada?"}',
        0.9
    ),
    (
        'Chapecó',
        'Santa Catarina',
        'nickname',
        'a capital do Oeste',
        '{"Chapecó!", "A forte"}',
        '{"Chapecoense, né?"}',
        0.8
    ),
    (
        'Campina Grande',
        'Paraíba',
        'culture',
        'maior São João do mundo',
        '{"A cidade do", "Famosa pelo"}',
        '{"Já foi no São João?"}',
        0.95
    ),
    (
        'Goiânia',
        'Goiás',
        'culture',
        'sertanejo é hino',
        '{"Goiânia!", "A cidade do"}',
        '{"Curte sertanejo?"}',
        0.85
    ),
    (
        'Natal',
        'Rio Grande do Norte',
        'nickname',
        'a cidade do sol',
        '{"Natal!", "A ensolarada"}',
        '{"Sol o ano todo, né?"}',
        0.85
    ),
    (
        'Joinville',
        'Santa Catarina',
        'nickname',
        'a Manchester catarinense',
        '{"Joinville!", "A industrial"}',
        '{"Trabalha na indústria?"}',
        0.75
    ),
    (
        'Ribeirão Preto',
        'São Paulo',
        'economy',
        'capital do agronegócio',
        '{"Ribeirão!", "A capital do agro"}',
        '{"Trabalha com agro?"}',
        0.8
    );
-- ============================================
-- SEED: PROFISSÕES
-- ============================================
INSERT INTO professional_knowledge (
        profession,
        industry,
        knowledge_type,
        content,
        conversation_hooks,
        follow_up_questions,
        emotional_weight
    )
VALUES (
        'advogado',
        'jurídico',
        'daily_challenge',
        'prazo processual não perdoa',
        '{"Sei que prazo no direito é sagrado!"}',
        '{"Qual sua área de atuação?"}',
        0.8
    ),
    (
        'advogado',
        'jurídico',
        'pain_point',
        'clientes querem tudo pra ontem',
        '{"A clássica pressão de"}',
        '{"Como você lida com isso?"}',
        0.85
    ),
    (
        'médico',
        'saúde',
        'daily_challenge',
        'plantão de 24h exige resistência',
        '{"Sei que a rotina médica é puxada!"}',
        '{"Qual sua especialidade?"}',
        0.85
    ),
    (
        'médico',
        'saúde',
        'achievement',
        'ver paciente recuperado é a recompensa',
        '{"Deve ser gratificante, né?"}',
        '{""}',
        0.95
    ),
    (
        'dentista',
        'saúde',
        'daily_challenge',
        'pacientes com medo são comuns',
        '{"Sei que dentista lida com"}',
        '{"Muitos têm medo?"}',
        0.8
    ),
    (
        'dentista',
        'saúde',
        'pain_point',
        'no-show dói no caixa',
        '{"A famosa falta de"}',
        '{"Quantos faltam por semana?"}',
        0.85
    ),
    (
        'contador',
        'financeiro',
        'daily_challenge',
        'época de IR é maratona',
        '{"Época de IR deve ser loucura!"}',
        '{"Atende mais PF ou PJ?"}',
        0.8
    ),
    (
        'empresário',
        'negócios',
        'daily_challenge',
        'equilibrar caixa e crescimento',
        '{"Sei que empreender não é fácil!"}',
        '{"Há quanto tempo tem o negócio?"}',
        0.85
    ),
    (
        'empresário',
        'negócios',
        'pain_point',
        'burocracia brasileira testa',
        '{"A burocracia não ajuda, né?"}',
        '{""}',
        0.75
    ),
    (
        'corretor',
        'imobiliária',
        'daily_challenge',
        'cliente visita 50 imóveis',
        '{"Sei que tem cliente indeciso!"}',
        '{"Venda ou aluguel?"}',
        0.8
    ),
    (
        'designer',
        'criativo',
        'daily_challenge',
        'cliente pede mais pop',
        '{"Briefing vago é clássico!"}',
        '{"Qual tipo de design?"}',
        0.85
    ),
    (
        'designer',
        'criativo',
        'jargon',
        'só mais uma alteraçãozinha',
        '{"A famosa última alteração, rs"}',
        '{""}',
        0.8
    ),
    (
        'professor',
        'educação',
        'daily_challenge',
        'corrigir prova no fim de semana',
        '{"Professor leva trabalho pra casa!"}',
        '{"Dá aula de quê?"}',
        0.7
    ),
    (
        'professor',
        'educação',
        'achievement',
        'ver aluno evoluir',
        '{"Deve ser lindo ver crescer!"}',
        '{""}',
        0.95
    ),
    (
        'cabeleireiro',
        'beleza',
        'daily_challenge',
        'sábado é dia de guerra',
        '{"Sábado no salão é correria!"}',
        '{"Tem salão próprio?"}',
        0.8
    ),
    (
        'desenvolvedor',
        'tecnologia',
        'daily_challenge',
        'debugar às 3 da manhã',
        '{"A vida de dev é assim!"}',
        '{"Qual stack você usa?"}',
        0.75
    ),
    (
        'psicólogo',
        'saúde mental',
        'daily_challenge',
        'cuidar da mente dos outros',
        '{"Psicólogo também precisa de um, né?"}',
        '{"Qual sua abordagem?"}',
        0.85
    ),
    (
        'nutricionista',
        'saúde',
        'daily_challenge',
        'paciente não segue o plano',
        '{"Aderência é o desafio!"}',
        '{"Clínica ou esportivo?"}',
        0.75
    );
-- ============================================
-- SEED: PERGUNTAS DE OURO
-- ============================================
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
        'Que legal!'
    ),
    (
        2,
        'E qual é o seu negócio? O que você faz?',
        'qualification',
        'profession',
        'E como está a demanda?'
    ),
    (
        3,
        'Qual o seu maior desafio com vendas hoje?',
        'pain',
        'pain_point',
        'Entendo perfeitamente.'
    ),
    (
        4,
        'Se resolver isso essa semana, quanto valeria?',
        'urgency',
        'urgency_level',
        'Faz sentido. Deixa eu mostrar...'
    ),
    (
        5,
        'Tem alguém na equipe que cuida de vendas?',
        'qualification',
        'team_size',
        'Perfeito.'
    );
-- ============================================
-- VERIFICAÇÃO
-- ============================================
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