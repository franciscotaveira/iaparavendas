// ============================================
// LX WHATSAPP ADAPTER LAYER
// ============================================
// Abstração para suportar múltiplos providers:
// - Meta Cloud API (Oficial)
// - Evolution API (QR Code / Quick Start)
// ============================================

export type WhatsAppProvider = 'meta' | 'evolution';

export interface WhatsAppConfig {
    provider: WhatsAppProvider;

    // Meta Cloud API
    meta?: {
        accessToken: string;
        phoneNumberId: string;
        verifyToken: string;
    };

    // Evolution API
    evolution?: {
        baseUrl: string;
        apiKey: string;
        instanceName: string;
    };
}

export interface SendMessageParams {
    to: string;
    text: string;
    // Futuro: suportar mídia, botões, etc.
}

export interface SendMessageResult {
    success: boolean;
    messageId?: string;
    error?: string;
    provider: WhatsAppProvider;
}

// ============================================
// EVOLUTION API CLIENT
// ============================================

export class EvolutionClient {
    private baseUrl: string;
    private apiKey: string;
    private instanceName: string;

    constructor(config: WhatsAppConfig['evolution']) {
        if (!config) throw new Error('Evolution config required');
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
        this.instanceName = config.instanceName;
    }

    private async request(path: string, method: string = 'GET', body?: any) {
        const url = `${this.baseUrl}${path}`;
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.apiKey,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Evolution API Error (${response.status}): ${errorText}`);
        }

        return response.json();
    }

    // Criar instância
    async createInstance(instanceName?: string): Promise<any> {
        const name = instanceName || this.instanceName;
        return this.request('/instance/create', 'POST', {
            instanceName: name,
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS',
        });
    }

    // Obter QR Code
    async getQRCode(): Promise<{ qrcode: string; base64: string } | null> {
        try {
            const result = await this.request(`/instance/connect/${this.instanceName}`);
            return result;
        } catch (e) {
            console.error('QR Code error:', e);
            return null;
        }
    }

    // Status da conexão
    async getConnectionStatus(): Promise<{ connected: boolean; state: string }> {
        try {
            const result = await this.request(`/instance/connectionState/${this.instanceName}`);
            return {
                connected: result.state === 'open',
                state: result.state,
            };
        } catch (e) {
            return { connected: false, state: 'unknown' };
        }
    }

    // Enviar mensagem
    async sendMessage(to: string, text: string): Promise<SendMessageResult> {
        try {
            // Formatar número (remove +, espaços, etc)
            const number = to.replace(/\D/g, '');

            const result = await this.request(`/message/sendText/${this.instanceName}`, 'POST', {
                number,
                text,
            });

            return {
                success: true,
                messageId: result.key?.id,
                provider: 'evolution',
            };
        } catch (e: any) {
            return {
                success: false,
                error: e.message,
                provider: 'evolution',
            };
        }
    }

    // Logout/Desconectar
    async disconnect(): Promise<void> {
        await this.request(`/instance/logout/${this.instanceName}`, 'DELETE');
    }
}

// ============================================
// META CLOUD API CLIENT
// ============================================

export class MetaCloudClient {
    private accessToken: string;
    private phoneNumberId: string;

    constructor(config: WhatsAppConfig['meta']) {
        if (!config) throw new Error('Meta config required');
        this.accessToken = config.accessToken;
        this.phoneNumberId = config.phoneNumberId;
    }

    async sendMessage(to: string, text: string): Promise<SendMessageResult> {
        try {
            const url = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to,
                    type: 'text',
                    text: { body: text },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Meta API Error (${response.status}): ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            return {
                success: true,
                messageId: result.messages?.[0]?.id,
                provider: 'meta',
            };
        } catch (e: any) {
            return {
                success: false,
                error: e.message,
                provider: 'meta',
            };
        }
    }
}

// ============================================
// UNIFIED WHATSAPP CLIENT
// ============================================

export class WhatsAppClient {
    private config: WhatsAppConfig;
    private evolutionClient?: EvolutionClient;
    private metaClient?: MetaCloudClient;

    constructor(config: WhatsAppConfig) {
        this.config = config;

        if (config.provider === 'evolution' && config.evolution) {
            this.evolutionClient = new EvolutionClient(config.evolution);
        } else if (config.provider === 'meta' && config.meta) {
            this.metaClient = new MetaCloudClient(config.meta);
        }
    }

    get provider(): WhatsAppProvider {
        return this.config.provider;
    }

    async sendMessage(to: string, text: string): Promise<SendMessageResult> {
        if (this.config.provider === 'evolution' && this.evolutionClient) {
            return this.evolutionClient.sendMessage(to, text);
        } else if (this.config.provider === 'meta' && this.metaClient) {
            return this.metaClient.sendMessage(to, text);
        }

        return {
            success: false,
            error: 'No WhatsApp provider configured',
            provider: this.config.provider,
        };
    }

    // Métodos específicos do Evolution
    async getQRCode() {
        if (this.evolutionClient) {
            return this.evolutionClient.getQRCode();
        }
        return null;
    }

    async getConnectionStatus() {
        if (this.evolutionClient) {
            return this.evolutionClient.getConnectionStatus();
        }
        // Meta está sempre "conectado" se o token funcionar
        return { connected: true, state: 'open' };
    }

    async createInstance(name?: string) {
        if (this.evolutionClient) {
            return this.evolutionClient.createInstance(name);
        }
        return null;
    }
}

// ============================================
// FACTORY - CRIA CLIENT BASEADO NO TENANT
// ============================================

export function createWhatsAppClient(tenantConfig: any): WhatsAppClient {
    // Se o tenant tem evolution configurado, usa
    if (tenantConfig.evolution_instance) {
        return new WhatsAppClient({
            provider: 'evolution',
            evolution: {
                baseUrl: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
                apiKey: process.env.EVOLUTION_API_KEY || 'lx-evolution-secret-key-2024',
                instanceName: tenantConfig.evolution_instance,
            },
        });
    }

    // Senão, usa Meta
    return new WhatsAppClient({
        provider: 'meta',
        meta: {
            accessToken: process.env.META_ACCESS_TOKEN || '',
            phoneNumberId: tenantConfig.phone_number_id || process.env.META_PHONE_NUMBER_ID || '',
            verifyToken: process.env.META_VERIFY_TOKEN || '',
        },
    });
}
