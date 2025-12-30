-- ============================================
-- URE SEED EXPANDIDO - 150+ CIDADES
-- Execute após supabase-ure-simple.sql
-- ============================================
-- ============================================
-- MAIS CIDADES COM CONHECIMENTO
-- ============================================
-- ACRE
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
        'Rio Branco',
        'Acre',
        'nickname',
        'a capital do início do Brasil',
        '{"Rio Branco!", "A capital acreana"}',
        '{"Você é de lá mesmo?"}',
        0.75
    ),
    (
        'Rio Branco',
        'Acre',
        'culture',
        'açaí na tigela é tradição por lá',
        '{"Terra do açaí!"}',
        '{"Toma açaí todo dia?"}',
        0.8
    );
-- ALAGOAS
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
        'Maceió',
        'Alagoas',
        'nickname',
        'o paraíso das águas',
        '{"Maceió!", "O paraíso alagoano"}',
        '{"Praia todo fim de semana?"}',
        0.9
    ),
    (
        'Maceió',
        'Alagoas',
        'landmark',
        'piscinas naturais de Maragogi são lindas',
        '{"Conheço Maragogi!"}',
        '{"Já foi nas piscinas naturais?"}',
        0.85
    );
-- AMAPÁ
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
        'Macapá',
        'Amapá',
        'trivia',
        'única capital cortada pela linha do Equador',
        '{"Macapá!", "Linha do Equador, né?"}',
        '{"Já foi no Marco Zero?"}',
        0.85
    );
-- AMAZONAS
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
        'Manaus',
        'Amazonas',
        'landmark',
        'Teatro Amazonas é patrimônio histórico lindo',
        '{"O famoso Teatro Amazonas!"}',
        '{"Já foi ao teatro?"}',
        0.85
    ),
    (
        'Manaus',
        'Amazonas',
        'culture',
        'encontro das águas é fenômeno único',
        '{"Encontro das águas, né?"}',
        '{"Já viu de perto?"}',
        0.9
    ),
    (
        'Parintins',
        'Amazonas',
        'culture',
        'Festival de Parintins é o maior do Norte',
        '{"Parintins!", "Boi-Bumbá!"}',
        '{"Caprichoso ou Garantido?"}',
        0.95
    );
-- BAHIA
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
        'Feira de Santana',
        'Bahia',
        'economy',
        'maior entroncamento rodoviário do Nordeste',
        '{"Feira de Santana!", "O entroncamento do Nordeste"}',
        '{"Você trabalha com o quê?"}',
        0.7
    ),
    (
        'Vitória da Conquista',
        'Bahia',
        'nickname',
        'a Suíça Baiana pelo clima ameno',
        '{"Conquista!", "A Suíça Baiana"}',
        '{"O clima é bom mesmo?"}',
        0.8
    ),
    (
        'Ilhéus',
        'Bahia',
        'culture',
        'terra do cacau, cenário de Jorge Amado',
        '{"Ilhéus!", "Terra de Gabriela!"}',
        '{"Gosta de cacau?"}',
        0.85
    ),
    (
        'Porto Seguro',
        'Bahia',
        'landmark',
        'onde o Brasil foi descoberto',
        '{"Porto Seguro!", "O berço do Brasil"}',
        '{"Mora lá ou é turismo?"}',
        0.8
    );
-- CEARÁ
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
        'Juazeiro do Norte',
        'Ceará',
        'culture',
        'terra de Padre Cícero, muito fé',
        '{"Juazeiro!", "Terra de Padim Ciço"}',
        '{"Católico fervoroso?"}',
        0.9
    ),
    (
        'Sobral',
        'Ceará',
        'trivia',
        'onde Einstein provou a relatividade em 1919',
        '{"Sobral!", "A cidade de Einstein!"}',
        '{"Sabia dessa história?"}',
        0.85
    );
-- ESPÍRITO SANTO
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
        'Vitória',
        'Espírito Santo',
        'nickname',
        'a ilha do mel',
        '{"Vitória!", "A ilha capixaba"}',
        '{"Nasceu na ilha?"}',
        0.8
    ),
    (
        'Vila Velha',
        'Espírito Santo',
        'landmark',
        'Convento da Penha é lindo',
        '{"Vila Velha!", "Pertinho do Convento da Penha"}',
        '{"Já subiu lá?"}',
        0.85
    );
-- GOIÁS
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
        'Anápolis',
        'Goiás',
        'economy',
        'polo industrial e farmacêutico forte',
        '{"Anápolis!", "Polo industrial, né?"}',
        '{"Trabalha na indústria?"}',
        0.7
    ),
    (
        'Caldas Novas',
        'Goiás',
        'landmark',
        'maior estância hidrotermal do mundo',
        '{"Caldas Novas!", "Águas quentes!"}',
        '{"Mora lá ou vai relaxar?"}',
        0.85
    );
-- MARANHÃO
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
        'São Luís',
        'Maranhão',
        'nickname',
        'a Atenas Brasileira',
        '{"São Luís!", "A Atenas Brasileira"}',
        '{"Nasceu lá?"}',
        0.85
    ),
    (
        'São Luís',
        'Maranhão',
        'culture',
        'Bumba-meu-boi é patrimônio',
        '{"Terra do Bumba-meu-boi!"}',
        '{"Curte as festas juninas?"}',
        0.9
    ),
    (
        'Caxias',
        'Maranhão',
        'nickname',
        'a cidade dos poetas',
        '{"Caxias!", "A cidade dos poetas"}',
        '{"Gosta de literatura?"}',
        0.75
    );
-- MATO GROSSO
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
        'Cuiabá',
        'Mato Grosso',
        'nickname',
        'a cidade verde',
        '{"Cuiabá!", "A cidade verde"}',
        '{"Aguenta o calor?"}',
        0.8
    ),
    (
        'Cuiabá',
        'Mato Grosso',
        'trivia',
        'centro geodésico da América do Sul',
        '{"O centro da América do Sul!"}',
        '{"Sabia disso?"}',
        0.7
    ),
    (
        'Sinop',
        'Mato Grosso',
        'economy',
        'capital do Nortão, agronegócio forte',
        '{"Sinop!", "Capital do agro"}',
        '{"Trabalha com agro?"}',
        0.75
    );
-- MATO GROSSO DO SUL
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
        'Campo Grande',
        'Mato Grosso do Sul',
        'nickname',
        'a cidade morena',
        '{"Campo Grande!", "A cidade morena"}',
        '{"Curte sertanejo?"}',
        0.8
    ),
    (
        'Bonito',
        'Mato Grosso do Sul',
        'landmark',
        'capital do ecoturismo brasileiro',
        '{"Bonito!", "O paraíso ecológico"}',
        '{"Já mergulhou nos rios cristalinos?"}',
        0.95
    );
-- MINAS GERAIS
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
        'Uberlândia',
        'Minas Gerais',
        'economy',
        'polo logístico e atacadista nacional',
        '{"Uberlândia!", "O centro logístico"}',
        '{"Trabalha com logística?"}',
        0.7
    ),
    (
        'Juiz de Fora',
        'Minas Gerais',
        'nickname',
        'a Manchester Mineira',
        '{"Juiz de Fora!", "A Manchester Mineira"}',
        '{"Nasceu lá?"}',
        0.75
    ),
    (
        'Ouro Preto',
        'Minas Gerais',
        'culture',
        'cidade histórica, patrimônio da UNESCO',
        '{"Ouro Preto!", "Patrimônio da humanidade"}',
        '{"Já visitou as igrejas?"}',
        0.9
    ),
    (
        'Tiradentes',
        'Minas Gerais',
        'culture',
        'cidade colonial mais bem preservada',
        '{"Tiradentes!", "Que cidade linda!"}',
        '{"Mora lá ou visita?"}',
        0.85
    ),
    (
        'Diamantina',
        'Minas Gerais',
        'culture',
        'terra de JK, patrimônio histórico',
        '{"Diamantina!", "Terra de JK"}',
        '{"Curte história?"}',
        0.8
    );
-- PARÁ
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
        'Belém',
        'Pará',
        'culture',
        'Círio de Nazaré é a maior festa religiosa',
        '{"Belém!", "Terra do Círio"}',
        '{"Já foi no Círio?"}',
        0.95
    ),
    (
        'Belém',
        'Pará',
        'culture',
        'tacacá e açaí são patrimônios',
        '{"Terra do tacacá!"}',
        '{"Gosta de comida paraense?"}',
        0.85
    ),
    (
        'Santarém',
        'Pará',
        'landmark',
        'encontro do Tapajós com o Amazonas',
        '{"Santarém!", "Alter do Chão, né?"}',
        '{"Já foi em Alter do Chão?"}',
        0.9
    );
-- PARAÍBA
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
        'João Pessoa',
        'Paraíba',
        'trivia',
        'ponto mais oriental das Américas',
        '{"João Pessoa!", "A mais oriental!"}',
        '{"Já viu o nascer do sol na Ponta do Seixas?"}',
        0.85
    );
-- PARANÁ
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
        'Londrina',
        'Paraná',
        'nickname',
        'a pequena Londres',
        '{"Londrina!", "A pequena Londres"}',
        '{"Nasceu lá?"}',
        0.8
    ),
    (
        'Maringá',
        'Paraná',
        'landmark',
        'Catedral de Maringá é top 10 do mundo',
        '{"Maringá!", "A Catedral linda!"}',
        '{"Já subiu na torre?"}',
        0.85
    ),
    (
        'Foz do Iguaçu',
        'Paraná',
        'landmark',
        'Cataratas são maravilha do mundo',
        '{"Foz!", "As Cataratas, né?"}',
        '{"Mora lá ou trabalha com turismo?"}',
        0.95
    ),
    (
        'Cascavel',
        'Paraná',
        'economy',
        'capital do Oeste, polo agroindustrial',
        '{"Cascavel!", "O Oeste paranaense"}',
        '{"Trabalha com agro?"}',
        0.7
    );
-- PERNAMBUCO
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
        'Olinda',
        'Pernambuco',
        'culture',
        'carnaval de rua mais tradicional',
        '{"Olinda!", "Carnaval de rua, né?"}',
        '{"Curte frevo?"}',
        0.9
    ),
    (
        'Caruaru',
        'Pernambuco',
        'culture',
        'capital do forró, maior São João',
        '{"Caruaru!", "Capital do forró!"}',
        '{"Já foi no São João?"}',
        0.95
    ),
    (
        'Petrolina',
        'Pernambuco',
        'economy',
        'polo de fruticultura irrigada',
        '{"Petrolina!", "Terra das uvas e mangas"}',
        '{"Trabalha com agronegócio?"}',
        0.75
    ),
    (
        'Fernando de Noronha',
        'Pernambuco',
        'landmark',
        'paraíso brasileiro, patrimônio natural',
        '{"Noronha!", "O paraíso!"}',
        '{"Mora lá ou é visita?"}',
        0.98
    );
-- PIAUÍ
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
        'Teresina',
        'Piauí',
        'trivia',
        'única capital do Nordeste não litorânea',
        '{"Teresina!", "A capital dos cajus"}',
        '{"Aguenta o calor?"}',
        0.75
    );
-- RIO DE JANEIRO
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
        'Niterói',
        'Rio de Janeiro',
        'landmark',
        'MAC do Niemeyer é icônico',
        '{"Niterói!", "O MAC é lindo!"}',
        '{"Já foi no MAC?"}',
        0.8
    ),
    (
        'Petrópolis',
        'Rio de Janeiro',
        'nickname',
        'a cidade imperial',
        '{"Petrópolis!", "A cidade imperial"}',
        '{"Gosta do clima da serra?"}',
        0.85
    ),
    (
        'Búzios',
        'Rio de Janeiro',
        'landmark',
        'a Saint-Tropez brasileira',
        '{"Búzios!", "O point do Rio"}',
        '{"Mora lá ou é verão?"}',
        0.85
    ),
    (
        'Paraty',
        'Rio de Janeiro',
        'culture',
        'cidade colonial, FLIP é famosa',
        '{"Paraty!", "Centro histórico lindo"}',
        '{"Já foi na FLIP?"}',
        0.85
    );
-- RIO GRANDE DO NORTE
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
        'Mossoró',
        'Rio Grande do Norte',
        'economy',
        'polo de sal e petróleo',
        '{"Mossoró!", "A segunda maior do RN"}',
        '{"Trabalha na área de petróleo?"}',
        0.7
    ),
    (
        'Pipa',
        'Rio Grande do Norte',
        'landmark',
        'point alternativo, praias lindas',
        '{"Pipa!", "Praias incríveis!"}',
        '{"Mora lá ou é turismo?"}',
        0.9
    );
-- RIO GRANDE DO SUL
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
        'Gramado',
        'Rio Grande do Sul',
        'culture',
        'a Suíça brasileira, Natal Luz',
        '{"Gramado!", "A Suíça brasileira"}',
        '{"Gosta do frio?"}',
        0.9
    ),
    (
        'Canela',
        'Rio Grande do Sul',
        'landmark',
        'Catedral de Pedra é linda',
        '{"Canela!", "Pertinho de Gramado"}',
        '{"Prefere Gramado ou Canela?"}',
        0.85
    ),
    (
        'Bento Gonçalves',
        'Rio Grande do Sul',
        'culture',
        'capital brasileira do vinho',
        '{"Bento!", "Terra do vinho!"}',
        '{"Aprecia um bom vinho?"}',
        0.85
    ),
    (
        'Pelotas',
        'Rio Grande do Sul',
        'culture',
        'terra dos doces tradicionais',
        '{"Pelotas!", "Terra dos doces"}',
        '{"Gosta de doce de Pelotas?"}',
        0.8
    );
-- RONDÔNIA
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
        'Porto Velho',
        'Rondônia',
        'landmark',
        'Estrada de Ferro Madeira-Mamoré é histórica',
        '{"Porto Velho!", "Terra da Madeira-Mamoré"}',
        '{"Nasceu lá ou se mudou?"}',
        0.75
    );
-- RORAIMA
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
        'Boa Vista',
        'Roraima',
        'trivia',
        'única capital totalmente acima do Equador',
        '{"Boa Vista!", "Lá em cima, né?"}',
        '{"Há quanto tempo está lá?"}',
        0.75
    );
-- SANTA CATARINA
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
        'Blumenau',
        'Santa Catarina',
        'culture',
        'Oktoberfest é a maior festa alemã das Américas',
        '{"Blumenau!", "Terra da Oktoberfest!"}',
        '{"Curte a festa?"}',
        0.9
    ),
    (
        'Itajaí',
        'Santa Catarina',
        'economy',
        'maior porto pesqueiro do país',
        '{"Itajaí!", "O porto catarinense"}',
        '{"Trabalha na área portuária?"}',
        0.7
    ),
    (
        'Balneário Camboriú',
        'Santa Catarina',
        'nickname',
        'a Dubai brasileira',
        '{"BC!", "A Dubai brasileira"}',
        '{"Mora lá ou é temporada?"}',
        0.85
    ),
    (
        'Bombinhas',
        'Santa Catarina',
        'landmark',
        'capital do mergulho',
        '{"Bombinhas!", "Paraíso do mergulho"}',
        '{"Curte mergulho?"}',
        0.85
    );
-- SÃO PAULO
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
        'Campinas',
        'São Paulo',
        'economy',
        'polo tecnológico e universitário',
        '{"Campinas!", "Unicamp, né?"}',
        '{"Trabalha com tech?"}',
        0.75
    ),
    (
        'Santos',
        'São Paulo',
        'landmark',
        'maior porto da América Latina',
        '{"Santos!", "O portão do Brasil"}',
        '{"Gosta de praia?"}',
        0.8
    ),
    (
        'São José dos Campos',
        'São Paulo',
        'economy',
        'polo aeroespacial, Embraer',
        '{"SJC!", "Terra da Embraer"}',
        '{"Trabalha na área aeroespacial?"}',
        0.8
    ),
    (
        'Sorocaba',
        'São Paulo',
        'nickname',
        'a Manchester paulista',
        '{"Sorocaba!", "A Manchester paulista"}',
        '{"Nasceu lá?"}',
        0.75
    ),
    (
        'Piracicaba',
        'São Paulo',
        'culture',
        'capital do etanol',
        '{"Piracicaba!", "Terra do etanol"}',
        '{"Trabalha com agro?"}',
        0.7
    ),
    (
        'Campos do Jordão',
        'São Paulo',
        'nickname',
        'a Suíça paulista',
        '{"Campos!", "A Suíça paulista"}',
        '{"Gosta do frio da serra?"}',
        0.85
    ),
    (
        'Guarujá',
        'São Paulo',
        'nickname',
        'a pérola do Atlântico',
        '{"Guarujá!", "A pérola do Atlântico"}',
        '{"Mora lá ou é praia de fim de semana?"}',
        0.8
    );
-- SERGIPE
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
        'Aracaju',
        'Sergipe',
        'landmark',
        'Orla de Atalaia é linda',
        '{"Aracaju!", "Orla de Atalaia!"}',
        '{"Curte comer caranguejo na Passarela?"}',
        0.85
    );
-- TOCANTINS
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
        'Palmas',
        'Tocantins',
        'trivia',
        'capital mais jovem do Brasil',
        '{"Palmas!", "A capital mais jovem"}',
        '{"Nasceu lá ou foi com a cidade?"}',
        0.8
    );
-- ============================================
-- 80+ PROFISSÕES COM CONHECIMENTO
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
VALUES -- TECNOLOGIA
    (
        'programador',
        'tecnologia',
        'jargon',
        'Stack Overflow é o melhor amigo',
        '{"Todo dev conhece o Stack Overflow!"}',
        '{"Prefere frontend ou backend?"}',
        0.85
    ),
    (
        'programador',
        'tecnologia',
        'pain_point',
        'requisitos que mudam no meio do projeto',
        '{"A clássica mudança de escopo, né?"}',
        '{"Trabalha com metodologia ágil?"}',
        0.8
    ),
    (
        'product manager',
        'tecnologia',
        'jargon',
        'roadmap que muda toda sprint',
        '{"Roadmap fixo é lenda!"}',
        '{"Qual seu principal desafio hoje?"}',
        0.75
    ),
    (
        'ux designer',
        'tecnologia',
        'pain_point',
        'stakeholder que ignora a pesquisa',
        '{"Quando ignoram o UX Research dói, né?"}',
        '{"Qual ferramenta você mais usa?"}',
        0.8
    ),
    (
        'data scientist',
        'tecnologia',
        'daily_challenge',
        '80% do tempo é limpar dados',
        '{"A famosa limpeza de dados!"}',
        '{"Trabalha mais com ML ou BI?"}',
        0.75
    ),
    (
        'devops',
        'tecnologia',
        'jargon',
        'deploy de sexta é proibido',
        '{"Deploy de sexta, jamais!"}',
        '{"Usa Kubernetes?"}',
        0.85
    ),
    -- SAÚDE
    (
        'enfermeiro',
        'saúde',
        'daily_challenge',
        'plantão de 12h é rotina',
        '{"Sei que a rotina de enfermagem é puxada!"}',
        '{"Trabalha em qual especialidade?"}',
        0.85
    ),
    (
        'fisioterapeuta',
        'saúde',
        'achievement',
        'ver paciente recuperando movimento',
        '{"Deve ser gratificante ver a recuperação!"}',
        '{"Você trabalha com qual área?"}',
        0.9
    ),
    (
        'farmacêutico',
        'saúde',
        'daily_challenge',
        'cliente que quer antibiótico sem receita',
        '{"A clássica discussão de receita!"}',
        '{"Farmácia própria ou rede?"}',
        0.75
    ),
    (
        'veterinário',
        'saúde',
        'achievement',
        'salvar um bichinho não tem preço',
        '{"Cuidar de animais é vocação!"}',
        '{"Qual animal você mais atende?"}',
        0.9
    ),
    -- DIREITO
    (
        'advogado tributarista',
        'jurídico',
        'daily_challenge',
        'legislação muda toda hora',
        '{"Tributário muda todo dia, né?"}',
        '{"Atende mais empresas?"}',
        0.75
    ),
    (
        'advogado trabalhista',
        'jurídico',
        'daily_challenge',
        'audiência de conciliação exige jogo de cintura',
        '{"Conciliação é arte!"}',
        '{"Atende empregado ou empregador?"}',
        0.8
    ),
    -- FINANCEIRO
    (
        'analista financeiro',
        'finanças',
        'daily_challenge',
        'fechamento de mês é maratona',
        '{"Fechamento de mês, né?"}',
        '{"FP&A ou tesouraria?"}',
        0.75
    ),
    (
        'assessor de investimentos',
        'finanças',
        'pain_point',
        'cliente que entra em pânico na queda',
        '{"Psicologia é 80% do trabalho!"}',
        '{"Qual seu perfil de cliente?"}',
        0.8
    ),
    (
        'trader',
        'finanças',
        'jargon',
        'stop loss é sagrado',
        '{"Stop loss salva vidas!"}',
        '{"Day trade ou swing?"}',
        0.85
    ),
    -- VENDAS
    (
        'sdr',
        'vendas',
        'daily_challenge',
        'quota de ligações por dia é puxada',
        '{"Sei como é a rotina de SDR!"}',
        '{"Quantos leads por dia?"}',
        0.8
    ),
    (
        'closer',
        'vendas',
        'achievement',
        'bater meta é adrenalina pura',
        '{"Nada como bater a meta!"}',
        '{"Ticket médio de quanto?"}',
        0.9
    ),
    (
        'gerente comercial',
        'vendas',
        'pain_point',
        'vendedor que não segue o processo',
        '{"Processo de vendas é lei!"}',
        '{"Qual tamanho da equipe?"}',
        0.75
    ),
    -- MARKETING
    (
        'social media',
        'marketing',
        'jargon',
        'engajamento caiu e cliente reclama',
        '{"Algoritmo muda toda hora!"}',
        '{"Qual rede dá mais resultado?"}',
        0.8
    ),
    (
        'tráfego pago',
        'marketing',
        'pain_point',
        'CPM subindo sem parar',
        '{"CPM tá difícil, né?"}',
        '{"Meta Ads ou Google?"}',
        0.8
    ),
    (
        'copywriter',
        'marketing',
        'achievement',
        'copy que converte é arte',
        '{"Boa copy vale ouro!"}',
        '{"Direct response ou branding?"}',
        0.85
    ),
    -- EDUCAÇÃO
    (
        'coordenador pedagógico',
        'educação',
        'daily_challenge',
        'mediar família e escola é delicado',
        '{"Mediação diária, né?"}',
        '{"Escola particular ou pública?"}',
        0.75
    ),
    (
        'tutor online',
        'educação',
        'pain_point',
        'aluno que some no meio do curso',
        '{"Evasão é o pesadelo, né?"}',
        '{"Ensina qual área?"}',
        0.7
    ),
    -- ENGENHARIA
    (
        'engenheiro civil',
        'engenharia',
        'daily_challenge',
        'obra atrasada é rotina',
        '{"Cronograma de obra é complicado!"}',
        '{"Mais incorporação ou infraestrutura?"}',
        0.75
    ),
    (
        'arquiteto',
        'engenharia',
        'pain_point',
        'cliente que muda projeto na execução',
        '{"Mudança na obra dói!"}',
        '{"Residencial ou comercial?"}',
        0.8
    ),
    (
        'engenheiro de produção',
        'engenharia',
        'daily_challenge',
        'otimizar processo sem parar linha',
        '{"Lean forever!"}',
        '{"Qual setor?"}',
        0.7
    ),
    -- CRIATIVO
    (
        'fotógrafo',
        'criativo',
        'daily_challenge',
        'edição toma mais tempo que foto',
        '{"Edição é 70% do trabalho!"}',
        '{"Qual seu estilo?"}',
        0.75
    ),
    (
        'videomaker',
        'criativo',
        'pain_point',
        'deadline apertado para muito material',
        '{"Render que demora!"}',
        '{"Trabalha com quê? Publicidade?"}',
        0.8
    ),
    -- RH
    (
        'recrutador',
        'rh',
        'pain_point',
        'candidato que some no processo',
        '{"Ghost de candidato é clássico!"}',
        '{"Recruta para qual área?"}',
        0.8
    ),
    (
        'business partner',
        'rh',
        'daily_challenge',
        'equilibrar interesses de todos os lados',
        '{"BP é equilibrista!"}',
        '{"Atende quantas áreas?"}',
        0.75
    ),
    -- BELEZA
    (
        'esteticista',
        'beleza',
        'achievement',
        'autoestima do cliente transformada',
        '{"Transformar autoestima é lindo!"}',
        '{"Qual sua especialidade?"}',
        0.9
    ),
    (
        'barbeiro',
        'beleza',
        'culture',
        'barbearia virou point social',
        '{"Barbearia é social!"}',
        '{"Tem barbearia própria?"}',
        0.8
    ),
    (
        'maquiador',
        'beleza',
        'daily_challenge',
        'noiva nervosa no dia',
        '{"Noiva no dia é adrenalina!"}',
        '{"Faz mais social ou artístico?"}',
        0.85
    ),
    -- AUTÔNOMOS
    (
        'personal trainer',
        'fitness',
        'pain_point',
        'aluno que não segue dieta',
        '{"Dieta é 80% do resultado!"}',
        '{"Onde você atende?"}',
        0.75
    ),
    (
        'coach',
        'desenvolvimento',
        'daily_challenge',
        'cliente espera resultado imediato',
        '{"Coaching é processo!"}',
        '{"Qual sua especialidade?"}',
        0.7
    ),
    (
        'influenciador',
        'mídia',
        'pain_point',
        'algoritmo é imprevisível',
        '{"Algoritmo muda toda hora!"}',
        '{"Qual sua principal plataforma?"}',
        0.8
    ),
    (
        'corretor de seguros',
        'seguros',
        'daily_challenge',
        'explicar coberturas e exclusões',
        '{"Cobertura é complexo!"}',
        '{"Qual ramo você mais vende?"}',
        0.7
    ),
    (
        'despachante',
        'serviços',
        'pain_point',
        'burocracia do Detran',
        '{"Detran testa paciência!"}',
        '{"Só veículos ou documentos também?"}',
        0.75
    ),
    -- GASTRONOMIA
    (
        'chef de cozinha',
        'gastronomia',
        'daily_challenge',
        'movimento de sábado é guerra',
        '{"Sábado no restaurante é arena!"}',
        '{"Tem restaurante ou trabalha em um?"}',
        0.85
    ),
    (
        'confeiteiro',
        'gastronomia',
        'achievement',
        'bolo do casamento perfeito',
        '{"Bolo perfeito é arte!"}',
        '{"Qual sua especialidade?"}',
        0.9
    ),
    (
        'sommelier',
        'gastronomia',
        'jargon',
        'harmonização é ciência e arte',
        '{"Harmonizar é arte!"}',
        '{"Trabalha em restaurante?"}',
        0.8
    ),
    -- SAÚDE MENTAL
    (
        'terapeuta',
        'saúde mental',
        'daily_challenge',
        'absorver demandas emocionais pede autocuidado',
        '{"Terapeuta cuida dos outros, e de si?"}',
        '{"Qual sua abordagem?"}',
        0.85
    ),
    (
        'coaching de carreira',
        'desenvolvimento',
        'achievement',
        'ver cliente conseguir emprego novo',
        '{"Recolocação é gratificante!"}',
        '{"Trabalha com transição de carreira?"}',
        0.85
    );
-- ============================================
-- MAIS PERGUNTAS DE OURO
-- ============================================
INSERT INTO golden_questions (
        question_order,
        question_text,
        question_purpose,
        expected_entity,
        follow_up_positive
    )
VALUES (
        6,
        'Quanto você investe hoje em marketing ou vendas?',
        'qualification',
        'budget',
        'Interessante. Nosso sistema costuma trazer X retorno.'
    ),
    (
        7,
        'Qual ferramenta você usa hoje para gerenciar leads?',
        'qualification',
        'current_tool',
        'Ah, [TOOL] é boa! Mas deixa eu te mostrar...'
    ),
    (
        8,
        'O que te fez procurar uma solução agora?',
        'urgency',
        'trigger',
        'Faz total sentido. Vejo isso acontecer muito.'
    ),
    (
        9,
        'Quem mais na empresa vai participar da decisão?',
        'qualification',
        'stakeholders',
        'Entendi. Importante alinhar com todos.'
    ),
    (
        10,
        'Se a IA pudesse resolver um problema seu amanhã, qual seria?',
        'pain',
        'main_pain',
        'Isso é exatamente o que fazemos!'
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