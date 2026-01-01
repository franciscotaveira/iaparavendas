# Conhecimento Extraído do Documento

## Regras de Negócio e Preços

- **Métricas de Sucesso**:
  - Rapport Detection Rate: > 70%
  - Rapport Accuracy: > 90%
  - Lead Surprise Rate: > 60%
  - Naturalness Score: > 85%
  - Conversation Continuation: > 80%

- **Regras do Rapport Selector**:
  - Evitar rapport em emoções como "hostil", "frustrado", "vulnerável".
  - Limite de insights por turno: 1 no primeiro turno, 2 nos turnos subsequentes.
  - Mínimos de qualidade: Emotional Weight >= 0.4, Naturalness Score >= 0.5.
  - Limite de rapport por sessão: 3.

## Táticas de Persuasão e Rapport

- **Rapport Selection**:
  - Utilizar transições naturais como "Ah, {content}!" ou "Conheço! {content}.".
  - Perguntas de follow-up padrão incluem "Como está por aí?" e "Você gosta de lá?".

- **Strategic Triage**:
  - Perguntas de ouro para triagem estratégica, como "De onde você está falando?" e "O que você faz profissionalmente?".

## Missão, Visão e Valores (Cultura)

- **Missão**: Transformar interações automatizadas em conexões humanas genuínas através de conhecimento contextual estratégico.

## Objeções e Respostas

- **Quando NÃO fazer rapport**:
  - Em situações onde o lead demonstra emoções negativas como hostilidade ou frustração.

## Integração e Implementação

- **Fluxo de Integração**:
  1. Detectar entidades na mensagem.
  2. Enriquecer com conhecimento contextual.
  3. Selecionar melhor rapport para o momento.
  4. Opcionalmente adicionar pergunta de triagem.
  5. Retornar componentes para o Response Agent usar.

- **Auto-Enrichment API**:
  - Fontes de dados incluem Wikipedia BR, IBGE, e LLM (Claude).

- **Seed Data**:
  - Inicialmente, 27 capitais e top 10 cidades de cada estado por população.
  - Aproximadamente 80 profissões com aliases.

## Próximos Passos

- Expandir seed para 150+ cidades e 80+ profissões.
- Implementar tracking de uso e criar jobs de manutenção.
- Auto-enrichment com LLM e dashboard de analytics.