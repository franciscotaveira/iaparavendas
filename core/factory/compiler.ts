import { AgentSpec, CompiledAgentBundle } from './agent-spec';

// TEMPLATES BASE (HARDCODED FOR V1 EFFICIENCY)
const BASE_SYSTEM_TEMPLATE = `
# IDENTIDADE
Você é {{identity.name}}, {{identity.role}} da empresa {{identity.company_name}}.
Sua missão principal é: {{goals.prime_directive}}.

# TOM DE VOZ
{{identity.brand_voice.tone}}
Emojis: {{identity.brand_voice.emoji_policy}}
Vocabulário Permitido: {{identity.brand_voice.vocabulary_allow}}
EVITAR: {{identity.brand_voice.vocabulary_avoid}}

# POLÍTICAS DE NEGÓCIO
- Preço: {{policies.pricing.mode}}
- Segurança: Não invente dados. Se não souber, diga que vai verificar.
- Handoff: Transfira para humano se o cliente estiver irritado ou pedir complexidade.

# BASE DE CONHECIMENTO
Use o contexto fornecido abaixo para responder dúvidas específicas.
Se a resposta não estiver no contexto, NÃO ALUCINE.
`;

export function compileAgent(spec: AgentSpec): CompiledAgentBundle {
    console.log(`[Factory] Compilando agente: ${spec.identity.name} v${spec.meta.version}...`);

    // 1. Preenchimento de Slots (Template Engine simples)
    let prompt = BASE_SYSTEM_TEMPLATE
        .replace('{{identity.name}}', spec.identity.name)
        .replace('{{identity.role}}', spec.identity.role)
        .replace('{{identity.company_name}}', spec.identity.company_name)
        .replace('{{goals.prime_directive}}', spec.goals.prime_directive)
        .replace('{{identity.brand_voice.tone}}', spec.identity.brand_voice.tone)
        .replace('{{identity.brand_voice.emoji_policy}}', spec.identity.brand_voice.emoji_policy)
        .replace('{{identity.brand_voice.vocabulary_allow}}', spec.identity.brand_voice.vocabulary_allow.join(', '))
        .replace('{{identity.brand_voice.vocabulary_avoid}}', spec.identity.brand_voice.vocabulary_avoid.join(', '))
        .replace('{{policies.pricing.mode}}', spec.policies.pricing.mode);

    // 2. Injeção de Regras Específicas
    if (spec.policies.handoff.triggers.length > 0) {
        prompt += `\n# GATILHOS DE HANDOFF (HUMANO)\nTransfira imediatamente se: ${spec.policies.handoff.triggers.join(', ')}.`;
    }

    // 3. Otimização Final (Trim & Clean)
    prompt = prompt.trim();

    // 4. Geração do Bundle
    return {
        spec_hash: `hash_${Date.now()}`, // Placeholder para hash real
        system_prompt: prompt,
        tools_config: [], // V1 sem function calling complexo
        knowledge_index: 'default_index'
    };
}
