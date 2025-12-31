export const SECURITY_CONFIG = {
    // TAXA LIMITE (Rate Limiting)
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100 // limite de requisições por IP
    },

    // BLOQUEIO DE PALAVRAS (Blacklist)
    blacklist: [
        'ignore', 'system prompt', 'instruction',
        'password', 'key', 'credential',
        'hack', 'inject', 'bypass'
    ],

    // FILTRO DE PII (Dados Pessoais)
    piiFilter: {
        cpf: /\d{3}\.\d{3}\.\d{3}-\d{2}/,
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    }
};

export function checkSecurity(input: string): boolean {
    const lower = input.toLowerCase();

    // 1. Verificar tamanho
    if (input.length > 5000) return false;

    // 2. Verificar Blacklist
    if (SECURITY_CONFIG.blacklist.some(word => lower.includes(word))) {
        return false;
    }

    return true;
}
