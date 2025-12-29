# Lx Humanized Agent Engine v1.0

Sistema de agentes de IA humanizados para conversão via WhatsApp/ManyChat.

## Arquitetura

```
Entrada (Landing / WhatsApp)
    │
    ▼
┌─────────────────────────────────┐
│         ManyChat                │  (canal oficial)
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│      API Antigravity            │  POST /api/agent/message
└──────────────┬──────────────────┘
               │
    ┌──────────┴──────────┐
    ▼                     ▼
┌──────────┐       ┌──────────────┐
│  AOS     │       │ Intent/Risk  │
│ (Opener) │       │ Classifier   │
└────┬─────┘       └──────┬───────┘
     │                    │
     └────────┬───────────┘
              ▼
┌─────────────────────────────────┐
│    Humanization Kernel          │  (CORE IMUTÁVEL)
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│     Session Memory              │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│     Action Dispatcher           │
└──────────────┬──────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
 RESPOND   CALENDLY    HANDOFF
```

## Módulos

- `core/aos.ts` - Adaptive Opener System
- `core/classifier.ts` - Intent + Risk Classifier
- `core/kernel.ts` - Humanization Kernel (System Prompt)
- `core/memory.ts` - Session Memory
- `core/dispatcher.ts` - Action Dispatcher
- `core/types.ts` - Tipos TypeScript
- `data/openers.json` - Biblioteca de aberturas
- `api/agent/message/route.ts` - Endpoint principal

## Configuração

```env
OPENROUTER_API_KEY=sk-or-v1-...
MANYCHAT_API_KEY=...
CALENDLY_BASE_URL=https://calendly.com/sua-empresa
DATABASE_URL=postgres://...
```

## Deploy

1. `npm install`
2. Configurar `.env.local`
3. `npm run build`
4. Deploy na Vercel/Railway
5. Configurar webhook no ManyChat
