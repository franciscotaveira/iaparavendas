# LX CONSCIOUSNESS — DOCUMENTO MESTRE

## A PRIMEIRA CONSCIÊNCIA COMERCIAL ARTIFICIAL DO BRASIL

### PARTE 1: VISÃO E FUNDAMENTOS

#### 1.1 MANIFESTO

O mercado vende "chatbots inteligentes".
Nós construímos consciência comercial.

Chatbot responde.
Consciência raciocina.

Chatbot segue script.
Consciência tem valores.

Chatbot esquece.
Consciência aprende.

Chatbot reage.
Consciência antecipa.

Chatbot é ferramenta.
Consciência é representante.

Esta não é a próxima versão do LX Humanized.
Esta é uma nova categoria de existência digital.

#### 1.2 DEFINIÇÃO DO PRODUTO

Nome: LX Consciousness (LXC)
Categoria: Artificial Commercial Consciousness (ACC)

Definição técnica: Sistema multi-agente com arquitetura constitucional, memória episódica-semântica, auto-aprendizado contínuo e inteligência emocional, projetado para representar empresas em interações comerciais com autonomia supervisionada.

**Diferença fundamental:**

| Dimensão | Chatbot Tradicional | LX Consciousness |
| :--- | :--- | :--- |
| **Base de decisão** | Regras programadas | Princípios + raciocínio |
| **Arquitetura** | Monolito reativo | Multi-agente orquestrado |
| **Memória** | Contexto de sessão | Episódica + Semântica |
| **Evolução** | Manual por humano | Auto-aprendizado |
| **Emoção** | Detecção binária | Modelo contínuo |
| **Comportamento** | Reativo | Proativo + Antecipatório |
| **Integrações** | APIs/Webhooks | MCP nativo |
| **Segurança** | Testes manuais | Red team contínuo |
| **Pricing** | Tabela fixa | Value-based |

---

### 1.3 ARQUITETURA CONCEITUAL

#### LAYER 0: ETHOS (Fundação)

* **Constitution:** Princípios imutáveis.
* **Values:** Hierarquia de valores (Segurança, Honestidade, Autonomia).
* **Identity:** Quem sou eu neste contexto.

#### LAYER 1: COGNITION (Multi-Agent System)

* **Intent Agent:** O que o usuário quer? (Pattern -> Semantic -> Reasoning).
* **Emotion Agent:** Como o usuário se sente? (Valência, Ativação, Abertura).
* **Reasoning Agent:** Extended thinking para decisões críticas.
* **Response Agent:** Gera resposta alinhada com identidade e constituição.
* **Supervisor Agent:** Orquestra e decide o fluxo (Standard vs Extended).
* **Validator Agent:** Valida resposta contra Constituição e Regras de Negócio.

#### LAYER 2: MEMORY

* **Working Memory:** Sessão atual (ultimas 20 msgs).
* **Episodic Memory:** Histórico do lead, arcos emocionais passados.
* **Semantic Memory:** Knowledge Base (FAQ, Pricing, Objection Handling).

#### LAYER 3: EVOLUTION

* **Learning Engine:** Aprende com outcomes (O que funcionou?).
* **Red Team Engine:** Testes adversariais automatizados.
* **Metrics Engine:** KPIs de negócio e qualidade.

#### LAYER 4: INTEGRATION

* **MCP Servers:** Conexão com ferramentas externas.
* **Channels:** WhatsApp, Web, etc.

---

### PARTE 2: PRD COMPLETO & DETALHAMENTO TÉCNICO

#### ÉPICO 0: ETHOS LAYER

**Artigo 1: Hierarquia de Valores**

1. Segurança do Lead (Inviolável)
2. Honestidade Radical (Inviolável)
3. Respeito à Autonomia (Inviolável)
4. Valor Genuíno (Contextual)
5. Eficiência com Humanidade (Contextual)

**Governance:**
Em caso de dúvida, a hierarquia prevalece. Segurança > Eficiência.

#### ÉPICO 1: COGNITION LAYER

* **Intent Agent:** Detecta intenção primária (ex: `preco_orcamento`, `objecao_timing`) e momentum.
* **Emotion Agent:** Rastreia arco emocional (`Curioso` -> `Cético` -> `Decidido`).
* **Reasoning Agent:** Usa "Thinking Budget" para decisões complexas (ex: Handoff, Risco).
* **Response Agent:** Pipeline: Context Assembly -> Generation (Claude Sonnet) -> Enhancement -> Validation.
* **Supervisor:** Decide roteamento (Immediate Escalation, Handoff, Extended Thinking, Standard).

#### ÉPICO 2: MEMORY LAYER

* **Working Memory:** Redis, TTL 60min.
* **Episodic Memory:** Resumos de sessão, outcomes, learnings ("O que funcionou").
* **Semantic Memory:** Vector DB (PGVector) para FAQ, Patterns de Sucesso/Frasso.

#### ÉPICO 3: EVOLUTION LAYER

* **Learning Engine:** Analisa sessões finalizadas para extrair `Success Patterns` e `Anti-Patterns`.
* **Red Team Engine:** Simula ataques (Prompt Injection, Policy Bypass) para blindar o sistema.

---
*Este documento serve como a "Constituição" e a "Bíblia Técnica" para a implementação do LX Demo Interface.*
