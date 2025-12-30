-- ============================================
-- UNIVERSAL RAPPORT ENGINE - SCHEMA AVANÇADO
-- Execute no Supabase SQL Editor
-- ============================================
-- EXTENSÕES (algumas já existem no Supabase)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- ============================================
-- 1. GEO_LOCATIONS (Hierarquia Geográfica)
-- ============================================
CREATE TABLE IF NOT EXISTS geo_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    country VARCHAR(100) NOT NULL DEFAULT 'Brasil',
    country_code VARCHAR(3) DEFAULT 'BRA',
    region VARCHAR(100),
    state VARCHAR(100),
    state_code VARCHAR(2),
    city VARCHAR(200) NOT NULL,
    population INTEGER,
    state_rank INTEGER,
    city_type VARCHAR(50) DEFAULT 'interior',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    data_quality VARCHAR(20) DEFAULT 'basic',
    last_enriched_at TIMESTAMPTZ,
    CONSTRAINT unique_city_state UNIQUE (city, state, country)
);
CREATE INDEX IF NOT EXISTS idx_geo_locations_city ON geo_locations(city);
CREATE INDEX IF NOT EXISTS idx_geo_locations_state ON geo_locations(state);
CREATE INDEX IF NOT EXISTS idx_geo_locations_city_trgm ON geo_locations USING gin (city gin_trgm_ops);
-- ============================================
-- 2. GEO_KNOWLEDGE (Conhecimento Geográfico)
-- ============================================
CREATE TABLE IF NOT EXISTS geo_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    location_id UUID REFERENCES geo_locations(id) ON DELETE CASCADE,
    -- Para compatibilidade com schema anterior (sem location_id)
    city VARCHAR(200),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Brasil',
    knowledge_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    content_short VARCHAR(200),
    conversation_hooks TEXT [],
    follow_up_questions TEXT [],
    emotional_weight FLOAT DEFAULT 0.5,
    naturalness_score FLOAT DEFAULT 0.5,
    surprise_factor FLOAT DEFAULT 0.5,
    source VARCHAR(100) DEFAULT 'manual',
    verified BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    positive_reactions INTEGER DEFAULT 0,
    negative_reactions INTEGER DEFAULT 0,
    effectiveness_score FLOAT DEFAULT 0.5,
    is_active BOOLEAN DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_geo_knowledge_location ON geo_knowledge(location_id);
CREATE INDEX IF NOT EXISTS idx_geo_knowledge_city ON geo_knowledge(city);
CREATE INDEX IF NOT EXISTS idx_geo_knowledge_type ON geo_knowledge(knowledge_type);
-- ============================================
-- 3. GEO_ALIASES (Apelidos de Cidades)
-- ============================================
CREATE TABLE IF NOT EXISTS geo_aliases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    location_id UUID REFERENCES geo_locations(id) ON DELETE CASCADE,
    alias VARCHAR(200) NOT NULL,
    alias_type VARCHAR(50) DEFAULT 'common',
    is_primary BOOLEAN DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_geo_aliases_alias ON geo_aliases(alias);
-- ============================================
-- 4. PROFESSIONS (Profissões)
-- ============================================
CREATE TABLE IF NOT EXISTS professions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name VARCHAR(200) NOT NULL UNIQUE,
    name_normalized VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    aliases TEXT [],
    is_active BOOLEAN DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_professions_name ON professions(name);
CREATE INDEX IF NOT EXISTS idx_professions_normalized ON professions(name_normalized);
-- ============================================
-- 5. PROFESSIONAL_KNOWLEDGE
-- ============================================
CREATE TABLE IF NOT EXISTS professional_knowledge (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    profession_id UUID REFERENCES professions(id) ON DELETE CASCADE,
    -- Para compatibilidade direta
    profession VARCHAR(100),
    industry VARCHAR(100),
    seniority_level VARCHAR(50),
    knowledge_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    content_short VARCHAR(200),
    conversation_hooks TEXT [],
    follow_up_questions TEXT [],
    emotional_weight FLOAT DEFAULT 0.5,
    naturalness_score FLOAT DEFAULT 0.5,
    relatability_score FLOAT DEFAULT 0.5,
    usage_count INTEGER DEFAULT 0,
    effectiveness_score FLOAT DEFAULT 0.5,
    is_active BOOLEAN DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_prof_knowledge_profession ON professional_knowledge(profession_id);
CREATE INDEX IF NOT EXISTS idx_prof_knowledge_name ON professional_knowledge(profession);
-- ============================================
-- 6. GOLDEN_QUESTIONS (Perguntas de Ouro)
-- ============================================
CREATE TABLE IF NOT EXISTS golden_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    question_order INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_purpose VARCHAR(100),
    expected_entity VARCHAR(50),
    follow_up_positive TEXT,
    follow_up_negative TEXT,
    active BOOLEAN DEFAULT true
);
-- ============================================
-- 7. DETECTED_ENTITIES (Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS detected_entities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    session_id VARCHAR(100) NOT NULL,
    message_id UUID,
    entity_type VARCHAR(50) NOT NULL,
    entity_value TEXT NOT NULL,
    confidence FLOAT NOT NULL,
    resolved_to_id UUID,
    resolved_to_table VARCHAR(50),
    resolution_method VARCHAR(50),
    original_text TEXT
);
CREATE INDEX IF NOT EXISTS idx_detected_session ON detected_entities(session_id);
-- ============================================
-- 8. RAPPORT_USAGE (Tracking de Uso)
-- ============================================
CREATE TABLE IF NOT EXISTS rapport_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    used_at TIMESTAMPTZ DEFAULT NOW(),
    session_id VARCHAR(100) NOT NULL,
    message_id UUID,
    knowledge_id UUID NOT NULL,
    knowledge_table VARCHAR(50) NOT NULL,
    content_used TEXT,
    hook_used TEXT,
    lead_reaction VARCHAR(50),
    reaction_indicators TEXT [],
    conversation_continued BOOLEAN,
    rapport_established BOOLEAN
);
CREATE INDEX IF NOT EXISTS idx_rapport_session ON rapport_usage(session_id);
-- ============================================
-- 9. SEED: LOCALIZAÇÕES (100+ cidades)
-- ============================================
-- Capitais
INSERT INTO geo_locations (
        city,
        state,
        state_code,
        region,
        population,
        state_rank,
        city_type
    )
VALUES (
        'São Paulo',
        'São Paulo',
        'SP',
        'Sudeste',
        12400000,
        1,
        'capital'
    ),
    (
        'Rio de Janeiro',
        'Rio de Janeiro',
        'RJ',
        'Sudeste',
        6750000,
        1,
        'capital'
    ),
    (
        'Brasília',
        'Distrito Federal',
        'DF',
        'Centro-Oeste',
        3055000,
        1,
        'capital'
    ),
    (
        'Salvador',
        'Bahia',
        'BA',
        'Nordeste',
        2900000,
        1,
        'capital'
    ),
    (
        'Fortaleza',
        'Ceará',
        'CE',
        'Nordeste',
        2700000,
        1,
        'capital'
    ),
    (
        'Belo Horizonte',
        'Minas Gerais',
        'MG',
        'Sudeste',
        2500000,
        1,
        'capital'
    ),
    (
        'Manaus',
        'Amazonas',
        'AM',
        'Norte',
        2250000,
        1,
        'capital'
    ),
    (
        'Curitiba',
        'Paraná',
        'PR',
        'Sul',
        1950000,
        1,
        'capital'
    ),
    (
        'Recife',
        'Pernambuco',
        'PE',
        'Nordeste',
        1650000,
        1,
        'capital'
    ),
    (
        'Porto Alegre',
        'Rio Grande do Sul',
        'RS',
        'Sul',
        1490000,
        1,
        'capital'
    ),
    (
        'Goiânia',
        'Goiás',
        'GO',
        'Centro-Oeste',
        1555000,
        1,
        'capital'
    ),
    (
        'Belém',
        'Pará',
        'PA',
        'Norte',
        1500000,
        1,
        'capital'
    ),
    (
        'Guarulhos',
        'São Paulo',
        'SP',
        'Sudeste',
        1400000,
        2,
        'metropolitan'
    ),
    (
        'Campinas',
        'São Paulo',
        'SP',
        'Sudeste',
        1220000,
        3,
        'metropolitan'
    ),
    (
        'São Luís',
        'Maranhão',
        'MA',
        'Nordeste',
        1115000,
        1,
        'capital'
    ),
    (
        'Maceió',
        'Alagoas',
        'AL',
        'Nordeste',
        1025000,
        1,
        'capital'
    ),
    (
        'Natal',
        'Rio Grande do Norte',
        'RN',
        'Nordeste',
        895000,
        1,
        'capital'
    ),
    (
        'Campo Grande',
        'Mato Grosso do Sul',
        'MS',
        'Centro-Oeste',
        920000,
        1,
        'capital'
    ),
    (
        'Teresina',
        'Piauí',
        'PI',
        'Nordeste',
        870000,
        1,
        'capital'
    ),
    (
        'João Pessoa',
        'Paraíba',
        'PB',
        'Nordeste',
        825000,
        1,
        'capital'
    ),
    (
        'Aracaju',
        'Sergipe',
        'SE',
        'Nordeste',
        665000,
        1,
        'capital'
    ),
    (
        'Cuiabá',
        'Mato Grosso',
        'MT',
        'Centro-Oeste',
        620000,
        1,
        'capital'
    ),
    (
        'Florianópolis',
        'Santa Catarina',
        'SC',
        'Sul',
        510000,
        1,
        'capital'
    ),
    (
        'Vitória',
        'Espírito Santo',
        'ES',
        'Sudeste',
        365000,
        1,
        'capital'
    ),
    (
        'Porto Velho',
        'Rondônia',
        'RO',
        'Norte',
        540000,
        1,
        'capital'
    ),
    (
        'Macapá',
        'Amapá',
        'AP',
        'Norte',
        520000,
        1,
        'capital'
    ),
    (
        'Boa Vista',
        'Roraima',
        'RR',
        'Norte',
        420000,
        1,
        'capital'
    ),
    (
        'Rio Branco',
        'Acre',
        'AC',
        'Norte',
        415000,
        1,
        'capital'
    ),
    (
        'Palmas',
        'Tocantins',
        'TO',
        'Norte',
        315000,
        1,
        'capital'
    ),
    -- Cidades do Interior (exemplos importantes)
    (
        'Imperatriz',
        'Maranhão',
        'MA',
        'Nordeste',
        259000,
        2,
        'interior'
    ),
    (
        'Campina Grande',
        'Paraíba',
        'PB',
        'Nordeste',
        410000,
        2,
        'interior'
    ),
    (
        'Santos',
        'São Paulo',
        'SP',
        'Sudeste',
        435000,
        5,
        'coastal'
    ),
    (
        'Ribeirão Preto',
        'São Paulo',
        'SP',
        'Sudeste',
        720000,
        6,
        'interior'
    ),
    (
        'Joinville',
        'Santa Catarina',
        'SC',
        'Sul',
        600000,
        2,
        'industrial'
    ),
    (
        'Londrina',
        'Paraná',
        'PR',
        'Sul',
        580000,
        2,
        'interior'
    ),
    (
        'Uberlândia',
        'Minas Gerais',
        'MG',
        'Sudeste',
        700000,
        2,
        'interior'
    ),
    (
        'Sorocaba',
        'São Paulo',
        'SP',
        'Sudeste',
        700000,
        4,
        'industrial'
    ),
    (
        'Chapecó',
        'Santa Catarina',
        'SC',
        'Sul',
        225000,
        5,
        'interior'
    ),
    (
        'Maringá',
        'Paraná',
        'PR',
        'Sul',
        430000,
        3,
        'interior'
    ),
    (
        'Juiz de Fora',
        'Minas Gerais',
        'MG',
        'Sudeste',
        580000,
        4,
        'interior'
    ),
    (
        'Feira de Santana',
        'Bahia',
        'BA',
        'Nordeste',
        620000,
        2,
        'interior'
    ),
    (
        'Petrolina',
        'Pernambuco',
        'PE',
        'Nordeste',
        360000,
        3,
        'interior'
    ),
    (
        'Caruaru',
        'Pernambuco',
        'PE',
        'Nordeste',
        370000,
        2,
        'interior'
    ),
    (
        'Mossoró',
        'Rio Grande do Norte',
        'RN',
        'Nordeste',
        305000,
        2,
        'interior'
    ),
    (
        'Caxias do Sul',
        'Rio Grande do Sul',
        'RS',
        'Sul',
        520000,
        2,
        'industrial'
    ) ON CONFLICT (city, state, country) DO NOTHING;
-- ============================================
-- 10. SEED: CONHECIMENTO GEOGRÁFICO
-- ============================================
-- São Paulo
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
        ARRAY ['Ah, SP!', 'A famosa'],
        ARRAY ['Mora na capital mesmo ou região metropolitana?'],
        0.8
    ),
    (
        'São Paulo',
        'São Paulo',
        'nickname',
        'a cidade que nunca para',
        ARRAY ['A agitada', 'A incansável'],
        ARRAY ['Gosta do ritmo de SP?'],
        0.85
    ),
    (
        'São Paulo',
        'São Paulo',
        'landmark',
        'Paulista é icônica',
        ARRAY ['A Avenida', 'Conheço! A famosa'],
        ARRAY ['Trabalha por lá?'],
        0.85
    ),
    (
        'São Paulo',
        'São Paulo',
        'culture',
        'gastronomia incrível, tem de tudo',
        ARRAY ['Cidade da', 'Famosa pela'],
        ARRAY ['Qual sua culinária favorita de SP?'],
        0.75
    ),
    (
        'São Paulo',
        'São Paulo',
        'economy',
        'maior centro financeiro da América Latina',
        ARRAY ['O coração econômico,', 'Centro de negócios,'],
        ARRAY ['Você trabalha na área financeira?'],
        0.7
    );
-- Rio de Janeiro  
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
        'Rio de Janeiro',
        'Rio de Janeiro',
        'nickname',
        'a cidade maravilhosa',
        ARRAY ['O Rio!', 'A maravilhosa'],
        ARRAY ['Zona Sul, Norte ou Oeste?'],
        0.95
    ),
    (
        'Rio de Janeiro',
        'Rio de Janeiro',
        'landmark',
        'vista do Cristo é única',
        ARRAY ['O famoso', 'A vista do'],
        ARRAY ['Já subiu no Corcovado?'],
        0.9
    ),
    (
        'Rio de Janeiro',
        'Rio de Janeiro',
        'culture',
        'praias lindas em qualquer época',
        ARRAY ['Terra das', 'Famoso pelas'],
        ARRAY ['Qual praia é sua favorita?'],
        0.85
    );
-- Belo Horizonte
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
        ARRAY ['Terra de', 'Famosa pelos'],
        ARRAY ['Frequenta os botecos tradicionais?'],
        0.8
    ),
    (
        'Belo Horizonte',
        'Minas Gerais',
        'pride',
        'trem é palavra universal',
        ARRAY ['Uai,', 'O clássico'],
        ARRAY ['Você fala trem também?'],
        0.75
    );
-- Curitiba
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
        ARRAY ['O famoso', 'Conheço! O'],
        ARRAY ['Mora perto do centro?'],
        0.85
    ),
    (
        'Curitiba',
        'Paraná',
        'pride',
        'transporte público é exemplo',
        ARRAY ['A cidade modelo de', 'Referência em'],
        ARRAY ['Usa o transporte público?'],
        0.7
    );
-- Porto Alegre
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
        ARRAY ['Terra do', 'Famosa pelo'],
        ARRAY ['Toma mate todo dia?'],
        0.8
    ),
    (
        'Porto Alegre',
        'Rio Grande do Sul',
        'sports',
        'Grenal é clássico que para tudo',
        ARRAY ['A cidade do', 'Onde o'],
        ARRAY ['Gremista ou colorado?'],
        0.9
    );
-- Florianópolis
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
        ARRAY ['Terra de', 'Famosa pela'],
        ARRAY ['Surfa?'],
        0.85
    );
-- Recife
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
        ARRAY ['Terra do', 'Famosa pelo'],
        ARRAY ['Curte carnaval?'],
        0.8
    );
-- Salvador
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
        ARRAY ['Terra do', 'Famosa pelo'],
        ARRAY ['Qual sua comida baiana favorita?'],
        0.85
    ),
    (
        'Salvador',
        'Bahia',
        'landmark',
        'Pelourinho é história viva',
        ARRAY ['O histórico', 'O charmoso'],
        ARRAY ['Frequenta o Pelô?'],
        0.8
    );
-- Fortaleza
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
        ARRAY ['A famosa', 'Conheço! A'],
        ARRAY ['Frequenta os barracões?'],
        0.8
    );
-- Imperatriz (exemplo especial do URE)
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
        ARRAY ['Já ouvi falar da', 'A famosa'],
        ARRAY ['Ainda é movimentada?'],
        0.9
    ),
    (
        'Imperatriz',
        'Maranhão',
        'economy',
        'portal de entrada da Amazônia Legal',
        ARRAY ['O portal da Amazônia,'],
        ARRAY ['Você trabalha com algo ligado a isso?'],
        0.75
    );
-- Chapecó
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
        'polo de agroindústria forte',
        ARRAY ['Região forte em', 'Terra da'],
        ARRAY ['Trabalha com agro?'],
        0.7
    ),
    (
        'Chapecó',
        'Santa Catarina',
        'landmark',
        'Arena Condá é histórica',
        ARRAY ['A famosa', 'A histórica'],
        ARRAY ['Acompanha o time?'],
        0.85
    );
-- Campina Grande
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
        'Campina Grande',
        'Paraíba',
        'culture',
        'maior São João do mundo',
        ARRAY ['A cidade do', 'Famosa pelo'],
        ARRAY ['Já foi no São João?'],
        0.95
    ),
    (
        'Campina Grande',
        'Paraíba',
        'nickname',
        'a rainha da Borborema',
        ARRAY ['Campina!', 'A rainha'],
        ARRAY ['Nasceu lá?'],
        0.8
    );
-- Ribeirão Preto
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
        'Ribeirão Preto',
        'São Paulo',
        'economy',
        'capital do agronegócio',
        ARRAY ['Ribeirão!', 'A capital do agro'],
        ARRAY ['Trabalha com agro?'],
        0.8
    ),
    (
        'Ribeirão Preto',
        'São Paulo',
        'culture',
        'polo universitário forte',
        ARRAY ['Cidade universitária,', 'Famosa pelas faculdades,'],
        ARRAY ['Estudou lá?'],
        0.7
    );
-- Joinville
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
        'Joinville',
        'Santa Catarina',
        'nickname',
        'a Manchester catarinense',
        ARRAY ['Joinville!', 'A industrial'],
        ARRAY ['Trabalha na indústria?'],
        0.75
    ),
    (
        'Joinville',
        'Santa Catarina',
        'culture',
        'Festival de Dança é famoso',
        ARRAY ['Cidade do', 'Famosa pelo'],
        ARRAY ['Curte dança?'],
        0.8
    );
-- ============================================
-- 11. SEED: PROFISSÕES
-- ============================================
INSERT INTO professions (name, name_normalized, category, aliases)
VALUES (
        'Advogado',
        'advogado',
        'Jurídico',
        ARRAY ['advogada', 'adv', 'jurista']
    ),
    (
        'Médico',
        'medico',
        'Saúde',
        ARRAY ['médica', 'doutor', 'doutora', 'dr']
    ),
    (
        'Dentista',
        'dentista',
        'Saúde',
        ARRAY ['odontólogo', 'odontologista']
    ),
    (
        'Enfermeiro',
        'enfermeiro',
        'Saúde',
        ARRAY ['enfermeira', 'técnico de enfermagem']
    ),
    (
        'Professor',
        'professor',
        'Educação',
        ARRAY ['professora', 'docente', 'educador']
    ),
    (
        'Contador',
        'contador',
        'Financeiro',
        ARRAY ['contadora', 'contabilista']
    ),
    (
        'Empresário',
        'empresario',
        'Negócios',
        ARRAY ['empresária', 'empreendedor', 'empreendedora', 'dono de empresa']
    ),
    (
        'Corretor de Imóveis',
        'corretor de imoveis',
        'Imobiliário',
        ARRAY ['corretora', 'corretor imobiliário']
    ),
    (
        'Arquiteto',
        'arquiteto',
        'Construção',
        ARRAY ['arquiteta']
    ),
    (
        'Engenheiro',
        'engenheiro',
        'Engenharia',
        ARRAY ['engenheira']
    ),
    (
        'Psicólogo',
        'psicologo',
        'Saúde Mental',
        ARRAY ['psicóloga', 'terapeuta']
    ),
    (
        'Nutricionista',
        'nutricionista',
        'Saúde',
        ARRAY ['nutri']
    ),
    (
        'Personal Trainer',
        'personal trainer',
        'Fitness',
        ARRAY ['personal', 'preparador físico']
    ),
    (
        'Designer',
        'designer',
        'Criativo',
        ARRAY ['designer gráfico', 'web designer', 'ui designer']
    ),
    (
        'Desenvolvedor',
        'desenvolvedor',
        'Tecnologia',
        ARRAY ['programador', 'dev', 'developer', 'desenvolvedora']
    ),
    (
        'Product Manager',
        'product manager',
        'Tecnologia',
        ARRAY ['pm', 'gerente de produto']
    ),
    (
        'Vendedor',
        'vendedor',
        'Comercial',
        ARRAY ['vendedora', 'consultor de vendas', 'representante']
    ),
    (
        'Cabeleireiro',
        'cabeleireiro',
        'Beleza',
        ARRAY ['cabeleireira', 'hair stylist', 'cabelereiro']
    ),
    (
        'Fotógrafo',
        'fotografo',
        'Criativo',
        ARRAY ['fotógrafa', 'foto']
    ),
    (
        'Coach',
        'coach',
        'Desenvolvimento',
        ARRAY ['mentor', 'mentora', 'consultor']
    ) ON CONFLICT (name) DO NOTHING;
-- ============================================
-- 12. SEED: CONHECIMENTO PROFISSIONAL
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
VALUES -- Advogado
    (
        'advogado',
        'jurídico',
        'daily_challenge',
        'prazo processual não perdoa',
        ARRAY ['Sei que prazo no direito é sagrado!'],
        ARRAY ['Qual sua área de atuação?'],
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
    (
        'advogado',
        'jurídico',
        'tool',
        'PJe ainda dá trabalho às vezes',
        ARRAY ['Como está o PJe na sua região?'],
        ARRAY ['Você atua em qual tribunal?'],
        0.6
    ),
    -- Médico
    (
        'médico',
        'saúde',
        'daily_challenge',
        'plantão de 24h exige outra resistência',
        ARRAY ['Sei que a rotina médica é puxada!'],
        ARRAY ['Qual sua especialidade?'],
        0.85
    ),
    (
        'médico',
        'saúde',
        'achievement',
        'ver paciente recuperado é a melhor recompensa',
        ARRAY ['Deve ser gratificante ver a recuperação, né?'],
        ARRAY [],
        0.95
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
    -- Dentista
    (
        'dentista',
        'saúde',
        'daily_challenge',
        'pacientes com medo são comuns',
        ARRAY ['Sei que dentista lida com'],
        ARRAY ['Muitos pacientes têm medo?'],
        0.8
    ),
    (
        'dentista',
        'saúde',
        'pain_point',
        'no-show de pacientes dói no caixa',
        ARRAY ['A famosa falta de'],
        ARRAY ['Quantos faltam por semana?'],
        0.85
    ),
    -- Contador
    (
        'contador',
        'financeiro',
        'daily_challenge',
        'época de IR é maratona',
        ARRAY ['Época de IR deve ser loucura, né?'],
        ARRAY ['Você atende mais PF ou PJ?'],
        0.8
    ),
    (
        'contador',
        'financeiro',
        'pain_point',
        'legislação muda toda hora',
        ARRAY ['Legislação muda toda hora, né?'],
        ARRAY [],
        0.7
    ),
    -- Empresário
    (
        'empresário',
        'negócios',
        'daily_challenge',
        'equilibrar caixa e crescimento é arte',
        ARRAY ['Sei que empreender não é fácil!'],
        ARRAY ['Há quanto tempo você tem o negócio?', 'Qual seu ramo?'],
        0.85
    ),
    (
        'empresário',
        'negócios',
        'pain_point',
        'burocracia brasileira testa a paciência',
        ARRAY ['A burocracia aqui não ajuda, né?'],
        ARRAY [],
        0.75
    ),
    -- Corretor de Imóveis
    (
        'corretor',
        'imobiliária',
        'daily_challenge',
        'cliente que visita 50 imóveis e não decide',
        ARRAY ['Sei que tem cliente indeciso demais!'],
        ARRAY ['Você trabalha mais com venda ou aluguel?'],
        0.8
    ),
    (
        'corretor',
        'imobiliária',
        'tool',
        'visitas, fotos e portais tomam tempo',
        ARRAY ['O dia a dia de'],
        ARRAY ['Usa muito os portais?'],
        0.7
    ),
    -- Designer
    (
        'designer',
        'criativo',
        'daily_challenge',
        'cliente pedir mais pop sem saber o que quer',
        ARRAY ['Briefing vago é clássico, né?'],
        ARRAY ['Você trabalha com qual tipo de design?'],
        0.85
    ),
    (
        'designer',
        'criativo',
        'jargon',
        'só mais uma alteraçãozinha que vira 10',
        ARRAY ['A famosa última alteração, rs'],
        ARRAY [],
        0.8
    ),
    -- Professor
    (
        'professor',
        'educação',
        'daily_challenge',
        'corrigir prova no fim de semana faz parte',
        ARRAY ['Sei que professor leva trabalho pra casa!'],
        ARRAY ['Você dá aula de quê?', 'Ensina pra qual série?'],
        0.7
    ),
    (
        'professor',
        'educação',
        'achievement',
        'ver aluno evoluir não tem preço',
        ARRAY ['Deve ser lindo ver o aluno crescer!'],
        ARRAY [],
        0.95
    ),
    -- Cabeleireiro
    (
        'cabeleireiro',
        'beleza',
        'daily_challenge',
        'sábado é dia de guerra, agenda lotada',
        ARRAY ['Sábado no salão é correria, né?'],
        ARRAY ['Você tem salão próprio ou trabalha em algum?'],
        0.8
    ),
    (
        'cabeleireiro',
        'beleza',
        'achievement',
        'cliente sair feliz com o resultado é tudo',
        ARRAY ['Nada como cliente satisfeita, né?'],
        ARRAY ['Qual técnica você mais gosta de fazer?'],
        0.9
    ),
    -- Product Manager
    (
        'product manager',
        'tecnologia',
        'daily_challenge',
        'priorizar entre 100 coisas urgentes',
        ARRAY ['Sei que PM vive priorizando!'],
        ARRAY ['Você é PM de qual tipo de produto?'],
        0.8
    ),
    (
        'product manager',
        'tecnologia',
        'jargon',
        'roadmap que muda toda sprint',
        ARRAY ['Roadmap fixo é lenda, né?'],
        ARRAY [],
        0.75
    );
-- ============================================
-- 13. SEED: PERGUNTAS DE OURO
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
-- ============================================
-- 14. VERIFICAÇÃO FINAL
-- ============================================
SELECT 'geo_locations' as tabela,
    count(*) as registros
FROM geo_locations
UNION ALL
SELECT 'geo_knowledge',
    count(*)
FROM geo_knowledge
UNION ALL
SELECT 'professions',
    count(*)
FROM professions
UNION ALL
SELECT 'professional_knowledge',
    count(*)
FROM professional_knowledge
UNION ALL
SELECT 'golden_questions',
    count(*)
FROM golden_questions;