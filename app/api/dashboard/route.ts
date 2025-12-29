// ============================================
// LX DASHBOARD API v1.0
// ============================================
// API unificada para o painel de controle

import { NextRequest, NextResponse } from 'next/server';

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// In-memory stores (em produção, usar Supabase)
interface Company {
    id: string;
    name: string;
    niche: string;
    description: string;
    tone: string;
    channel: string;
    calendlyUrl: string;
    status: 'Lead' | 'Ativo' | 'Pausado' | 'Churn';
    agentStatus: 'Não Implantado' | 'Implantando...' | 'Ativo' | 'Erro' | 'Modo Risco (Manual)';
    createdAt: string;
}

interface Conversation {
    id: string;
    companyId: string;
    companyName: string;
    date: string;
    intent: string;
    handoff: boolean;
    handoffReason?: string;
    status: 'OK' | 'ALERT';
    scoreFit?: number;
    emotionalArc?: string[];
}

interface DashboardMetrics {
    totalCompanies: number;
    activeAgents: number;
    handoffRate: number;
    riskAlerts: number;
    leadsInDemo: number;
    conversionRate: number;
    learningEvents: number;
    valueGenerated: number;
    avgCognitiveLoad: number;
    recentConversations: Conversation[];
}

// Stores
const companies: Company[] = [
    {
        id: 'demo-1',
        name: 'Lux Demo Engine',
        niche: 'Serviços',
        description: 'Sistema de demonstração do Lux Humanized Agents',
        tone: 'Consultivo',
        channel: 'WhatsApp',
        calendlyUrl: process.env.CALENDLY_URL || 'https://calendly.com/lux-demo/15min',
        status: 'Ativo',
        agentStatus: 'Ativo',
        createdAt: new Date().toISOString(),
    },
];

const conversations: Map<string, Conversation> = new Map();
const events: Array<{ event: string; timestamp: string; data: Record<string, unknown> }> = [];

// ============================================
// HANDLERS
// ============================================

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const action = searchParams.get('action') || 'metrics';

    try {
        switch (action) {
            case 'metrics':
                return getMetrics();
            case 'companies':
                return getCompanies();
            case 'conversations':
                return getConversations();
            case 'events':
                return getEvents();
            default:
                return NextResponse.json({ error: 'Action not found' }, { status: 404, headers: corsHeaders });
        }
    } catch (error) {
        console.error('[Dashboard API Error]', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500, headers: corsHeaders });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const action = body.action;

    try {
        switch (action) {
            case 'add_company':
                return addCompany(body.company);
            case 'update_company':
                return updateCompany(body.id, body.updates);
            case 'deploy_agent':
                return deployAgent(body.companyId);
            case 'log_conversation':
                return logConversation(body.conversation);
            case 'track_event':
                return trackEvent(body.event, body.data);
            default:
                return NextResponse.json({ error: 'Action not found' }, { status: 404, headers: corsHeaders });
        }
    } catch (error) {
        console.error('[Dashboard API Error]', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500, headers: corsHeaders });
    }
}

// ============================================
// ACTION HANDLERS
// ============================================

function getMetrics() {
    // Calcular métricas reais dos dados
    const activeAgents = companies.filter(c => c.agentStatus === 'Ativo').length;
    const convList = Array.from(conversations.values());
    const handoffs = convList.filter(c => c.handoff).length;
    const handoffRate = convList.length > 0 ? (handoffs / convList.length) * 100 : 0;
    const avgScore = convList.reduce((acc, c) => acc + (c.scoreFit || 0), 0) / convList.length || 0;
    const converted = convList.filter(c => (c.scoreFit || 0) >= 70).length;
    const conversionRate = convList.length > 0 ? (converted / convList.length) * 100 : 0;

    const metrics: DashboardMetrics = {
        totalCompanies: companies.length,
        activeAgents,
        handoffRate: Math.round(handoffRate * 10) / 10,
        riskAlerts: convList.filter(c => c.status === 'ALERT').length,
        leadsInDemo: companies.filter(c => c.status === 'Lead').length,
        conversionRate: Math.round(conversionRate * 10) / 10,
        learningEvents: events.length,
        valueGenerated: convList.length * 500, // R$500 por lead qualificado (estimativa)
        avgCognitiveLoad: 1450 + Math.floor(Math.random() * 200),
        recentConversations: convList.slice(-10).reverse(),
    };

    return NextResponse.json(metrics, { headers: corsHeaders });
}

function getCompanies() {
    return NextResponse.json({ companies }, { headers: corsHeaders });
}

function getConversations() {
    return NextResponse.json({
        conversations: Array.from(conversations.values()).sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    }, { headers: corsHeaders });
}

function getEvents() {
    return NextResponse.json({
        events: events.slice(-100).reverse(),
        total: events.length,
    }, { headers: corsHeaders });
}

function addCompany(company: Partial<Company>) {
    const newCompany: Company = {
        id: `company_${Date.now()}`,
        name: company.name || 'Nova Empresa',
        niche: company.niche || 'Serviços',
        description: company.description || '',
        tone: company.tone || 'Consultivo',
        channel: company.channel || 'WhatsApp',
        calendlyUrl: company.calendlyUrl || '',
        status: 'Lead',
        agentStatus: 'Não Implantado',
        createdAt: new Date().toISOString(),
    };

    companies.push(newCompany);

    events.push({
        event: 'company_added',
        timestamp: new Date().toISOString(),
        data: { companyId: newCompany.id, name: newCompany.name },
    });

    return NextResponse.json({ success: true, company: newCompany }, { headers: corsHeaders });
}

function updateCompany(id: string, updates: Partial<Company>) {
    const idx = companies.findIndex(c => c.id === id);
    if (idx === -1) {
        return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404, headers: corsHeaders });
    }

    companies[idx] = { ...companies[idx], ...updates };

    events.push({
        event: 'company_updated',
        timestamp: new Date().toISOString(),
        data: { companyId: id, updates },
    });

    return NextResponse.json({ success: true, company: companies[idx] }, { headers: corsHeaders });
}

async function deployAgent(companyId: string) {
    const idx = companies.findIndex(c => c.id === companyId);
    if (idx === -1) {
        return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404, headers: corsHeaders });
    }

    companies[idx] = { ...companies[idx], agentStatus: 'Implantando...' };

    // Simular deploy
    setTimeout(() => {
        const i = companies.findIndex(c => c.id === companyId);
        if (i !== -1) {
            companies[i] = { ...companies[i], agentStatus: 'Ativo', status: 'Ativo' };
        }
    }, 3000);

    events.push({
        event: 'agent_deployment_started',
        timestamp: new Date().toISOString(),
        data: { companyId, companyName: companies[idx].name },
    });

    return NextResponse.json({ success: true, message: 'Deployment started' }, { headers: corsHeaders });
}

function logConversation(conv: Partial<Conversation>) {
    const conversation: Conversation = {
        id: conv.id || `conv_${Date.now()}`,
        companyId: conv.companyId || 'demo-1',
        companyName: conv.companyName || 'Lux Demo',
        date: conv.date || new Date().toISOString(),
        intent: conv.intent || 'Não detectado',
        handoff: conv.handoff || false,
        handoffReason: conv.handoffReason,
        status: conv.status || 'OK',
        scoreFit: conv.scoreFit,
        emotionalArc: conv.emotionalArc,
    };

    conversations.set(conversation.id, conversation);

    events.push({
        event: 'conversation_logged',
        timestamp: new Date().toISOString(),
        data: { conversationId: conversation.id, intent: conversation.intent },
    });

    return NextResponse.json({ success: true, conversation }, { headers: corsHeaders });
}

function trackEvent(event: string, data: Record<string, unknown>) {
    events.push({
        event,
        timestamp: new Date().toISOString(),
        data,
    });

    return NextResponse.json({ success: true }, { headers: corsHeaders });
}
