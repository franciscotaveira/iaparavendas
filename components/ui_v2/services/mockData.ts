// ============================================
// LX PAINEL - API SERVICE v1.0
// ============================================
// Conecta com o lx-demo-interface backend

import { Company, CompanyStatus, AgentStatus, Niche, Tone, OperationalLog, KPIMetrics, Conversation } from '../types';

// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ============================================
// FETCH HELPER
// ============================================

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.warn(`[API] Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

// ============================================
// DATA STORE (conectado à API)
// ============================================

class LxDataStore {
  private cachedCompanies: Company[] = [];
  private cachedLogs: OperationalLog[] = [];
  private cachedConversations: Conversation[] = [];
  private cachedMetrics: KPIMetrics | null = null;
  private lastFetch: number = 0;
  private cacheTimeout = 5000; // 5 segundos

  // =============== COMPANIES ===============

  async fetchCompanies(): Promise<Company[]> {
    try {
      const response = await fetchAPI<{ companies: any[] }>('/api/dashboard?action=companies');
      this.cachedCompanies = (response.companies || []).map(this.mapCompany);
      return this.cachedCompanies;
    } catch {
      return this.cachedCompanies.length > 0 ? this.cachedCompanies : this.getDefaultCompanies();
    }
  }

  getCompanies(): Company[] {
    // Trigger async fetch
    this.fetchCompanies().catch(() => { });
    return this.cachedCompanies.length > 0 ? this.cachedCompanies : this.getDefaultCompanies();
  }

  getCompanyById(id: string): Company | undefined {
    return this.getCompanies().find(c => c.id === id);
  }

  async addCompany(company: Partial<Company>): Promise<Company | null> {
    try {
      const response = await fetchAPI<{ success: boolean; company: any }>('/api/dashboard', {
        method: 'POST',
        body: JSON.stringify({ action: 'add_company', company }),
      });
      if (response.success) {
        const newCompany = this.mapCompany(response.company);
        this.cachedCompanies.push(newCompany);
        return newCompany;
      }
    } catch { }
    return null;
  }

  async deployAgent(companyId: string): Promise<boolean> {
    try {
      const response = await fetchAPI<{ success: boolean }>('/api/dashboard', {
        method: 'POST',
        body: JSON.stringify({ action: 'deploy_agent', companyId }),
      });

      if (response.success) {
        // Update local cache
        const idx = this.cachedCompanies.findIndex(c => c.id === companyId);
        if (idx !== -1) {
          this.cachedCompanies[idx] = {
            ...this.cachedCompanies[idx],
            agentStatus: AgentStatus.DEPLOYING
          };

          // Simulate completion after 3s
          setTimeout(() => {
            if (this.cachedCompanies[idx]) {
              this.cachedCompanies[idx] = {
                ...this.cachedCompanies[idx],
                agentStatus: AgentStatus.ACTIVE,
                status: CompanyStatus.ACTIVE,
              };
            }
          }, 3000);
        }
        return true;
      }
    } catch { }
    return false;
  }

  updateCompanyStatus(id: string, status: CompanyStatus): void {
    const idx = this.cachedCompanies.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.cachedCompanies[idx] = { ...this.cachedCompanies[idx], status };

      // Sync with API
      fetchAPI('/api/dashboard', {
        method: 'POST',
        body: JSON.stringify({ action: 'update_company', id, updates: { status } }),
      }).catch(() => { });
    }
  }

  // =============== CONVERSATIONS ===============

  async fetchConversations(): Promise<Conversation[]> {
    try {
      const response = await fetchAPI<{ conversations: any[] }>('/api/dashboard?action=conversations');
      this.cachedConversations = (response.conversations || []).map(this.mapConversation);
      return this.cachedConversations;
    } catch {
      return this.cachedConversations.length > 0 ? this.cachedConversations : this.getDefaultConversations();
    }
  }

  getConversations(): Conversation[] {
    this.fetchConversations().catch(() => { });
    return this.cachedConversations.length > 0 ? this.cachedConversations : this.getDefaultConversations();
  }

  // =============== LOGS ===============

  async fetchLogs(): Promise<OperationalLog[]> {
    try {
      const response = await fetchAPI<{ events: any[] }>('/api/dashboard?action=events');
      this.cachedLogs = (response.events || []).map(this.mapLog);
      return this.cachedLogs;
    } catch {
      return this.cachedLogs;
    }
  }

  getLogs(): OperationalLog[] {
    this.fetchLogs().catch(() => { });
    return this.cachedLogs.length > 0 ? this.cachedLogs : this.getDefaultLogs();
  }

  addLog(log: OperationalLog): void {
    this.cachedLogs.unshift(log);

    // Sync with API
    fetchAPI('/api/dashboard', {
      method: 'POST',
      body: JSON.stringify({
        action: 'track_event',
        event: log.category,
        data: { message: log.message, level: log.level }
      }),
    }).catch(() => { });
  }

  // =============== METRICS ===============

  async fetchMetrics(): Promise<KPIMetrics> {
    try {
      const metrics = await fetchAPI<KPIMetrics>('/api/dashboard?action=metrics');
      this.cachedMetrics = metrics;
      this.lastFetch = Date.now();
      return metrics;
    } catch {
      return this.cachedMetrics || this.getDefaultMetrics();
    }
  }

  getMetrics(): KPIMetrics {
    // Use cache if fresh
    if (this.cachedMetrics && Date.now() - this.lastFetch < this.cacheTimeout) {
      return this.cachedMetrics;
    }

    // Trigger async fetch
    this.fetchMetrics().catch(() => { });

    return this.cachedMetrics || this.getDefaultMetrics();
  }

  // =============== MAPPERS ===============

  private mapCompany(c: any): Company {
    return {
      id: c.id,
      name: c.name,
      niche: this.toNiche(c.niche),
      description: c.description || '',
      tone: this.toTone(c.tone),
      channel: c.channel || 'WhatsApp',
      calendlyUrl: c.calendlyUrl || '',
      status: this.toCompanyStatus(c.status),
      agentStatus: this.toAgentStatus(c.agentStatus),
      createdAt: c.createdAt || new Date().toISOString(),
    };
  }

  private mapConversation(c: any): Conversation {
    return {
      id: c.id,
      companyId: c.companyId || 'demo-1',
      companyName: c.companyName || 'Lux Demo',
      date: c.date || new Date().toISOString(),
      intent: c.intent || 'Não detectado',
      handoff: c.handoff || false,
      handoffReason: c.handoffReason,
      status: c.status === 'ALERT' ? 'ALERT' : 'OK',
      emotionalArc: c.emotionalArc,
      thinking: c.thinking,
    };
  }

  private mapLog(e: any): OperationalLog {
    return {
      id: e.id || `log-${Date.now()}`,
      companyId: 'demo-1',
      companyName: 'Lux Demo',
      timestamp: e.timestamp || new Date().toISOString(),
      level: e.data?.level || 'INFO',
      category: e.event?.includes('handoff') ? 'HANDOFF' :
        e.event?.includes('conversation') ? 'CONVERSATION' : 'SYSTEM',
      message: e.data?.message || e.event || 'Evento',
      details: JSON.stringify(e.data || {}),
    };
  }

  private toNiche(n: string): Niche {
    const map: Record<string, Niche> = {
      'Serviços': Niche.SERVICES,
      'SaaS': Niche.SAAS,
      'Mercado Financeiro': Niche.FINANCE,
      'E-commerce': Niche.ECOMMERCE,
      'Saúde': Niche.HEALTH,
    };
    return map[n] || Niche.OTHER;
  }

  private toTone(t: string): Tone {
    const map: Record<string, Tone> = {
      'Formal': Tone.FORMAL,
      'Consultivo': Tone.CONSULTATIVE,
      'Direto': Tone.DIRECT,
      'Acolhedor': Tone.WELCOMING,
      'Luxo/Exclusivo': Tone.LUXURY,
    };
    return map[t] || Tone.CONSULTATIVE;
  }

  private toCompanyStatus(s: string): CompanyStatus {
    const map: Record<string, CompanyStatus> = {
      'Lead': CompanyStatus.LEAD,
      'Ativo': CompanyStatus.ACTIVE,
      'Pausado': CompanyStatus.PAUSED,
      'Churn': CompanyStatus.CHURN,
    };
    return map[s] || CompanyStatus.LEAD;
  }

  private toAgentStatus(s: string): AgentStatus {
    const map: Record<string, AgentStatus> = {
      'Não Implantado': AgentStatus.NOT_DEPLOYED,
      'Implantando...': AgentStatus.DEPLOYING,
      'Ativo': AgentStatus.ACTIVE,
      'Erro': AgentStatus.ERROR,
      'Modo Risco (Manual)': AgentStatus.RISK_MODE,
    };
    return map[s] || AgentStatus.NOT_DEPLOYED;
  }

  // =============== DEFAULTS ===============

  private getDefaultCompanies(): Company[] {
    return [{
      id: 'demo-1',
      name: 'Lux Demo Engine',
      niche: Niche.SERVICES,
      description: 'Sistema de demonstração do Lux',
      tone: Tone.CONSULTATIVE,
      channel: 'WhatsApp',
      calendlyUrl: 'https://calendly.com/lux-demo/15min',
      status: CompanyStatus.ACTIVE,
      agentStatus: AgentStatus.ACTIVE,
      createdAt: new Date().toISOString(),
    }];
  }

  private getDefaultConversations(): Conversation[] {
    return [{
      id: 'conv-1',
      companyId: 'demo-1',
      companyName: 'Lux Demo',
      date: new Date().toISOString(),
      intent: 'Qualificação',
      handoff: false,
      status: 'OK',
      emotionalArc: ['CURIOUS', 'READY'],
      thinking: [
        { step: 1, agent: 'INTENT', thought: 'Detectando intenção...', durationMs: 120 },
        { step: 2, agent: 'RISK', thought: 'Nenhum risco detectado.', durationMs: 80 },
        { step: 3, agent: 'RESPONSE', thought: 'Gerando resposta.', durationMs: 350 },
      ],
    }];
  }

  private getDefaultLogs(): OperationalLog[] {
    return [{
      id: 'log-1',
      companyId: 'demo-1',
      companyName: 'Lux Demo',
      timestamp: new Date().toISOString(),
      level: 'INFO',
      category: 'SYSTEM',
      message: 'Sistema inicializado. Conecte à API para dados reais.',
    }];
  }

  private getDefaultMetrics(): KPIMetrics {
    return {
      totalCompanies: 1,
      activeAgents: 1,
      handoffRate: 8.5,
      riskAlerts: 0,
      leadsInDemo: 0,
      conversionRate: 42,
      learningEvents: 0,
      valueGenerated: 0,
      avgCognitiveLoad: 1450,
    };
  }
}

export const store = new LxDataStore();