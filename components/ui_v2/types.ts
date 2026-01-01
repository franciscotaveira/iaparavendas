// Domain Entities

export enum Niche {
  SERVICES = 'Serviços',
  SAAS = 'SaaS',
  FINANCE = 'Mercado Financeiro',
  ECOMMERCE = 'E-commerce',
  HEALTH = 'Saúde',
  OTHER = 'Outro'
}

export enum Tone {
  FORMAL = 'Formal',
  CONSULTATIVE = 'Consultivo',
  DIRECT = 'Direto',
  WELCOMING = 'Acolhedor',
  LUXURY = 'Luxo/Exclusivo'
}

export enum CompanyStatus {
  LEAD = 'Lead',
  ACTIVE = 'Ativo',
  PAUSED = 'Pausado',
  CHURN = 'Churn'
}

export enum AgentStatus {
  NOT_DEPLOYED = 'Não Implantado',
  DEPLOYING = 'Implantando...',
  ACTIVE = 'Ativo',
  ERROR = 'Erro',
  RISK_MODE = 'Modo Risco (Manual)'
}

export interface Company {
  id: string;
  name: string;
  niche: Niche;
  description: string;
  tone: Tone;
  channel: 'WhatsApp' | 'Instagram' | 'Web';
  calendlyUrl: string;
  status: CompanyStatus;
  agentStatus: AgentStatus;
  createdAt: string;
}

export interface OperationalLog {
  id: string;
  companyId: string;
  companyName: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  category: 'CONVERSATION' | 'HANDOFF' | 'SYSTEM' | 'SECURITY';
  message: string;
  details?: string;
}

// LX CONSCIOUSNESS TYPES

export type EmotionalState = 'CURIOUS' | 'SKEPTICAL' | 'URGENT' | 'FRUSTRATED' | 'READY' | 'VULNERABLE';

export interface ThinkingTrace {
  step: number;
  agent: 'INTENT' | 'RISK' | 'RESPONSE' | 'SUPERVISOR';
  thought: string;
  durationMs: number;
}

export interface Conversation {
  id: string;
  companyId: string;
  companyName: string;
  date: string;
  intent: string;
  handoff: boolean;
  handoffReason?: string;
  status: 'OK' | 'ALERT';
  emotionalArc?: EmotionalState[]; // New: Tracking emotional journey
  thinking?: ThinkingTrace[]; // New: The reasoning behind the response
}

export interface KPIMetrics {
  totalCompanies: number;
  activeAgents: number;
  handoffRate: number;
  riskAlerts: number;
  leadsInDemo: number;
  conversionRate: number;
  // New Metrics
  learningEvents: number; // Patterns learned
  valueGenerated: number; // R$ estimated
  avgCognitiveLoad: number; // Tokens/reasoning used
}

export interface DeploymentConfig {
  humanizationKernelVersion: string;
  nichePackVersion: string;
  riskThreshold: number; // 0-100
  enableHandoff: boolean;
}

export interface ConstitutionRule {
  id: string;
  rank: number;
  principle: string;
  description: string;
  active: boolean;
}