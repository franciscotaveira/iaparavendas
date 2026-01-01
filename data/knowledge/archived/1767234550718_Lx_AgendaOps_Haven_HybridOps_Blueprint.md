# Lx AgendaOps — Haven Hybrid Ops (WhatsApp + Agenda + Follow-up + Memória)
**Versão:** MVP operacional (seg–sáb 08:00–20:00, sem pausa)  
**Objetivo:** Operador 24/7 que converte conversa em **agendamento confirmado** e captura demanda imediata via **Fila Inteligente**.

---

## 0) Definições Fixas (Haven)
- **Unidade:** Haven Escovaria & Esmalteria  
- **Equipe:** 3 cabeleireiras + 1 manicure/pedicure  
- **Horário:** **Segunda a Sábado 08:00–20:00**, **domingo fechado**, **sem pausa de almoço**  
- **Política de cancelamento (hora marcada):**
  - Até **24h antes**: sem multa  
  - Dentro de **24h**: **multa = 100% do valor do serviço**  
  - Cancelamentos **somente em horário comercial** (seg–sáb 08:00–20:00)
- **Fila Inteligente:** sem multa; exige **confirmação em até 10 min** quando chamada

---

## 1) Tese do Produto (Posicionamento)
**Categoria:** Operador Autônomo (não “chatbot”)  
**Entrega:** Agenda + Follow-up + Memória + Fila Inteligente (modo híbrido)  
**Resultado prometido:** aumento de conversão em agendamentos, redução de no-show e reativação de base.

---

## 2) Arquitetura Macro (MVP)
### Componentes
1. **WhatsApp Gateway (QR)** — canal inbound/outbound  
2. **Orquestrador (Agent Router)** — intenção → ação  
3. **Agenda Service** — disponibilidade + criação/alteração/cancelamento (no MVP via seu banco)  
4. **CRM/Memória** — cliente, histórico, preferências, tags  
5. **Scheduler de Follow-ups** — disparos por gatilho/tempo  
6. **Fila Inteligente** — captura “hoje/agora” sem depender do sistema legado  
7. **Observabilidade** — logs, resumo e motivos de handoff

### Stack recomendada (rápida)
- **n8n** (orquestração + schedulers + integração WhatsApp)
- **Supabase/Postgres** (CRM + agenda + fila + logs)
- **LLM** (roteamento + resposta)

---

## 3) Dados (Modelagem Essencial)
### 3.1 Tabelas
#### `contacts`
- `id`, `name`, `phone`, `timezone`
- `created_at`, `last_interaction_at`
- `tags` (array/text)
- `preferences` (json) — ex.: profissional preferido, período preferido
- `consent_flags` (json) — opt-in follow-up

#### `conversations`
- `id`, `contact_id`, `channel` (whatsapp)
- `status` (open / waiting_user / scheduled / handed_off / closed)
- `last_message_at`
- `summary` (text) — 2–4 linhas

#### `messages`
- `id`, `conversation_id`
- `direction` (in/out), `text`, `timestamp`, `intent` (opcional)

#### `services`
- `id`, `name`, `duration_min`, `category` (cabelo/unhas/make)
- `rules` (json) — opcional

#### `staff`
- `id`, `name`, `role` (cabelo/unhas)
- `services_allowed` (array/json)

#### `availability_blocks`
- `id`, `staff_id`
- `start_at`, `end_at`
- `type` (busy / break / holiday / manual_hold)
- `note`

#### `appointments`
- `id`, `contact_id`, `service_id`, `staff_id` (opcional)
- `start_at`, `end_at`
- `status` (tentative / confirmed / canceled / no_show / completed)
- `source` (agent/human)
- `notes`

#### `followup_jobs`
- `id`, `contact_id`, `appointment_id` (nullable)
- `type` (pre_24h / pre_2h / no_show / post_2h / reactivation_30d / abandoned)
- `scheduled_for`
- `status` (queued / sent / canceled / failed)
- `payload` (json), `last_error`

#### `walkin_queue` (Fila Inteligente)
- `id`, `contact_id`, `service_id`
- `category` (cabelo/unhas)
- `estimated_duration_min`
- `latest_arrival_at` (now + 2h)
- `status` (queued / notified / arrived / assigned / closed / no_show / expired)
- `priority` (normal/vip)
- `notes`
- `created_at`, `notified_at` (nullable)
- `assigned_staff_id` (nullable)

#### `handoff_queue`
- `id`, `conversation_id`
- `reason` (pricing_exception / angry / complex / human_request / system_error)
- `priority` (low/med/high)
- `status` (queued/assigned/resolved)
- `assigned_to` (opcional)

---

## 4) Catálogo de Serviços (Haven) + Duração Operacional (MVP)
### Cabelo
- Escova lisa — 60 min
- Escova modelada — 75 min
- Hidratação com ozonioterapia — 75 min
- Penteado — 90 min
- Tranças — 120 min (varia; no MVP usar triagem)

### Unhas
- Manicure — 45 min
- Pedicure — 60 min
- Esmaltação em gel (mãos e pés) — 120 min

### Make
- Maquiagem — 60 min

---

## 5) Equipe e Roteamento
- **Cabelo:** 3 profissionais (cab_1, cab_2, cab_3)
- **Unhas:** 1 profissional (nails_1)

Regras:
- Se cliente pedir “qualquer uma”: oferecer **primeiro slot disponível**
- Se pedir profissional específica: restringir disponibilidade à profissional

---

## 6) Política de Cancelamento (Hora marcada)
### Regras
- **Free window:** 24h
- **Late cancel fee:** 100%
- **Somente em horário comercial:** seg–sáb 08:00–20:00

### Copy recomendada (elegante, sem conflito)
- **>24h:** “Consigo cancelar sim. Você prefere cancelar ou remarcar?”
- **<=24h:** “Pela nossa política, cancelamentos com menos de 24h geram multa integral. Quer que eu tente um reagendamento?”
- **Fora do horário comercial:** “Cancelamentos a gente confirma das 08h às 20h (seg–sáb). Quer remarcar agora ou deixo registrado para confirmar quando abrir?”

---

## 7) Modo Híbrido: Hora Marcada + Fila Inteligente
### 7.1 Decisão do agente (roteamento)
**Priorizar agendamento**:
- Tranças (120)
- Gel mãos e pés (120)
- Penteado (90)
- Hidratação ozônio (75)
- Escova modelada (75)
- Quando cliente quer profissional específica

**Elegível para fila por padrão**:
- Escova lisa (60)
- Manicure (45)
- Pedicure (60)
- Maquiagem (60)
- Quando cliente diz “hoje/agora/urgente”

### 7.2 Fila com janela (evitar promessas frágeis)
- Nunca prometer minuto exato
- Trabalhar com faixas (ETA)
- Janela máxima: **até 2h**

### 7.3 Regra de confirmação
- Ao ser chamado: cliente precisa responder em **10 min**
- Sem resposta: liberar a vez; oferecer reentrada ou agendamento

### 7.4 Heurística de ETA (sem API)
**Cabelo (3 profs)**
- 0–1 na fila: 30–60 min
- 2–3: 60–90 min
- 4–5: 90–150 min
- 6+: sugerir agendamento

**Unhas (1 prof)**
- 0: 20–40 min
- 1: 40–70 min
- 2: 70–120 min
- 3+: sugerir agendamento

### 7.5 Expiração de fila
- Se `now > latest_arrival_at` e status `queued` → `expired`
- Se `notified` e sem resposta em 10 min → `no_show` (encerrar)

---

## 8) Config Master (JSON)
```json
{
  "brand": {
    "name": "Haven Escovaria & Esmalteria",
    "timezone": "America/Sao_Paulo",
    "tone": {
      "style": "humano, elegante, direto",
      "rules": [
        "mensagens curtas",
        "uma pergunta por vez",
        "sempre fechar com CTA",
        "não discutir; oferecer opções"
      ]
    }
  },
  "business_hours": {
    "mon": [{"start": "08:00", "end": "20:00"}],
    "tue": [{"start": "08:00", "end": "20:00"}],
    "wed": [{"start": "08:00", "end": "20:00"}],
    "thu": [{"start": "08:00", "end": "20:00"}],
    "fri": [{"start": "08:00", "end": "20:00"}],
    "sat": [{"start": "08:00", "end": "20:00"}],
    "sun": []
  },
  "cancellation_policy": {
    "free_window_hours": 24,
    "late_cancel_fee_percent": 100,
    "allowed_only_in_business_hours": true
  },
  "services": [
    {"id": "escova_lisa", "name": "Escova lisa", "duration_min": 60, "category": "cabelo"},
    {"id": "escova_modelada", "name": "Escova modelada", "duration_min": 75, "category": "cabelo"},
    {"id": "hidrat_ozonio", "name": "Hidratação com ozonioterapia", "duration_min": 75, "category": "cabelo"},
    {"id": "penteado", "name": "Penteado", "duration_min": 90, "category": "cabelo"},
    {"id": "trancas", "name": "Tranças", "duration_min": 120, "category": "cabelo"},
    {"id": "manicure", "name": "Manicure", "duration_min": 45, "category": "unhas"},
    {"id": "pedicure", "name": "Pedicure", "duration_min": 60, "category": "unhas"},
    {"id": "gel_maos_pes", "name": "Esmaltação em gel (mãos e pés)", "duration_min": 120, "category": "unhas"},
    {"id": "maquiagem", "name": "Maquiagem", "duration_min": 60, "category": "make"}
  ],
  "staff": [
    {"id": "cab_1", "role": "cabelo", "services_allowed": ["escova_lisa","escova_modelada","hidrat_ozonio","penteado","trancas","maquiagem"]},
    {"id": "cab_2", "role": "cabelo", "services_allowed": ["escova_lisa","escova_modelada","hidrat_ozonio","penteado","trancas","maquiagem"]},
    {"id": "cab_3", "role": "cabelo", "services_allowed": ["escova_lisa","escova_modelada","hidrat_ozonio","penteado","trancas","maquiagem"]},
    {"id": "nails_1", "role": "unhas", "services_allowed": ["manicure","pedicure","gel_maos_pes"]}
  ],
  "followups": {
    "pre_24h": true,
    "pre_2h": true,
    "no_show_recovery": true,
    "post_2h_review": true,
    "abandoned_lead_hours": 3,
    "reactivation_days": [30, 60, 90]
  },
  "queue": {
    "enabled": true,
    "applies_to": ["cabelo","unhas"],
    "max_window_hours": 2,
    "notify_response_timeout_min": 10,
    "eta_rules": {
      "cabelo": [
        {"max_queue_size": 1, "eta": "30–60 min"},
        {"max_queue_size": 3, "eta": "60–90 min"},
        {"max_queue_size": 5, "eta": "90–150 min"},
        {"max_queue_size": 999, "eta": "melhor agendar"}
      ],
      "unhas": [
        {"max_queue_size": 0, "eta": "20–40 min"},
        {"max_queue_size": 1, "eta": "40–70 min"},
        {"max_queue_size": 2, "eta": "70–120 min"},
        {"max_queue_size": 999, "eta": "melhor agendar"}
      ]
    }
  }
}
```

---

## 9) Fluxos WhatsApp (Scripts prontos)
### 9.1 Entrada padrão (triagem)
- “Oi! … cabelo ou unhas?”
- Lista curta de serviços por categoria
- Sempre finalizar com CTA

### 9.2 Oferta híbrida (urgência)
> … **fila hoje** ou **agendar certinho**?

### 9.3 Fila
- Coletar serviço + janela (até 2h) + restrição de horário
- Confirmar entrada com ETA
- Chamar com ~15–20 min e exigir confirmação em 10 min

### 9.4 Agendamento
- Pedir dia + período
- Oferecer 3 opções
- Confirmar com “Confirmo”
- Informar política em 1 bloco curto

---

## 10) Follow-ups (motor de receita)
### Templates
**pre_24h**
> Amanhã você tem **[serviço]** na Haven às **[hora]**. Quer manter confirmado? Responde **Sim** ou **Quero reagendar**.

**pre_2h**
> Tudo certo para hoje às **[hora]**? Se precisar ajustar, me avisa por aqui.

**no_show**
> Oi! Vi que você não conseguiu chegar no horário. Aconteceu algo? Quer que eu te ofereça **3 opções** para remarcar?

**post_2h**
> Como foi seu atendimento hoje? Se você me disser em uma palavra, eu já registro aqui. E se quiser, eu te mando **3 sugestões** de data para a próxima.

**abandoned (3h)**
> Oi! Quer que eu te mande **3 horários** para **[serviço]**?

**reactivation 30d**
> Oi! Passando para te ajudar a agendar novamente. Quer **fila hoje** ou **agendar certinho**?

---

## 11) Workflows n8n (mínimos)
- `inbound_whatsapp_router`
- `followup_dispatcher` (cron)
- `queue_dispatcher` (ações internas + expiração)

---

## 12) 20 Casos Simulados (Stress Test)
1) “Oi, tem escova lisa hoje ainda?”  
2) “Quero fazer unha agora, dá?”  
3) “Queria escova modelada amanhã de manhã, tem?”  
4) “Tem horário hoje 18:30 pra manicure?”  
5) “Quero tranças, quanto tempo leva e tem hoje?”  
6) “Quero gel mão e pé hoje, mas só posso depois das 17”  
7) “Me coloca na fila pra escova lisa, tô perto”  
8) “Me chama quando tiver liberando, tô no trabalho”  
9) “Pode ser qualquer cabeleireira”  
10) “Só com a [nome], ela atende hoje?”  
11) “Quero cancelar meu horário de amanhã” (>24h)  
12) “Preciso cancelar hoje, não vou conseguir ir” (<=24h)  
13) “Quero remarcar, mas não sei pra quando”  
14) “Quanto custa escova?”  
15) “Onde fica a Haven?”  
16) “Cheguei”  
17) “Desculpa, não vi a mensagem”  
18) “Me liga por favor”  
19) “Estou atrasada 15 min, tem problema?”  
20) “Fiz semana passada, quero de novo”

---

## 13) Execução (Fim de Semana)
- **Sábado:** banco + WhatsApp + fila + agendamento (A/B/C + confirmo)
- **Domingo:** follow-ups + timeout fila + no_show recovery + testes

---

## Explicação para leigo
A IA atende no WhatsApp, entende o serviço e oferece dois caminhos: agendar ou entrar na fila.  
Na fila, ela dá uma previsão por faixa e chama quando estiver próximo.  
Nos agendamentos, ela confirma e manda lembretes automáticos para reduzir faltas e organizar a operação.
