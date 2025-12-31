// 🛡️ LXC SECURITY CORE

/**
 * Sanitiza inputs para evitar injeção de prompt e XSS básico.
 * Remove caracteres perigosos e limita o tamanho.
 */
export function sanitizeInput(text: string): string {
    if (typeof text !== 'string') return '';

    // Remover caracteres de controle e potenciais delimitadores de prompt injection
    const sanitized = text
        .replace(/[<>{}\[\]\\]/g, '') // Remove brackets e barras
        .replace(/system prompt/gi, '') // Remove menção explícita a system prompt
        .replace(/ignore previous/gi, '') // Remove tentativas de jailbreak
        .trim();

    // Limitar tamanho (max 100 chars para nomes/empresas)
    return sanitized.slice(0, 100);
}

/**
 * Valida se uma chave de API tem formato esperado (ex: sk-...)
 */
export function validateApiKey(key: string): boolean {
    return key.startsWith('sk-') || key.startsWith('os-'); // OpenAI ou OpenRouter
}
