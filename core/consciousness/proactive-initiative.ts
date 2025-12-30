/**
 * PROACTIVE INITIATIVE ENGINE
 * Sistema que INICIA conversas, não só reage
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// ============================================
// TYPES
// ============================================

export interface ProactiveMessage {
    leadId: string;
    content: string;
    triggerType: string;
    scheduledFor: Date;
    priority: number;
    context: Record<string, unknown>;
}

export interface InitiativeTrigger {
    name: string;
    check: (lead: LeadContext) => boolean;
    generate: (lead: LeadContext) => string;
    cooldownDays: number;
    priority: number;
}

export interface LeadContext {
    id: string;
    name: string;
    city?: string;
    profession?: string;
    lastInteraction: Date;
    pendingFollowUps: Array<{ type: string; content: string }>;
    upcomingDates: Array<{ type: string; date: Date }>;
    conversationStage: string;
    relationshipDepth: number;
}

// ============================================
// INITIATIVE TRIGGERS
// ============================================

export const INITIATIVE_TRIGGERS: InitiativeTrigger[] = [
    // Follow-up prometido
    {
        name: 'follow_up_prometido',
        check: (lead) => lead.pendingFollowUps.length > 0,
        generate: (lead) => {
            const followUp = lead.pendingFollowUps[0];
            return `Oi ${lead.name}! Lembra que eu ia te mandar ${followUp.content}? Aqui está!`;
        },
        cooldownDays: 0,  // Imediato
        priority: 10
    },

    // Check-in pós-serviço (3-7 dias)
    {
        name: 'check_in_pos_servico',
        check: (lead) => {
            const daysSince = daysSinceDate(lead.lastInteraction);
            return lead.conversationStage === 'closed' && daysSince >= 3 && daysSince <= 7;
        },
        generate: (lead) => {
            return `Oi ${lead.name}! Passando pra saber como está tudo. Ficou satisfeito(a)?`;
        },
        cooldownDays: 30,
        priority: 8
    },

    // Reengajamento natural (lead sumiu)
    {
        name: 'reengajamento',
        check: (lead) => {
            const daysSince = daysSinceDate(lead.lastInteraction);
            return lead.conversationStage === 'active' && daysSince >= 5 && daysSince <= 14;
        },
        generate: (lead) => {
            const openers = [
                `Oi ${lead.name}, espero que esteja tudo bem com você!`,
                `Oi ${lead.name}, espero que esteja tudo bem por aí.`,
                `Passando aqui só para desejar que esteja tudo bem, ${lead.name}.`,
                `Oi ${lead.name}, espero que a semana esteja sendo ótima por aí!`
            ];
            return openers[Math.floor(Math.random() * openers.length)];
        },
        cooldownDays: 7,
        priority: 6
    },

    // Data especial (aniversário)
    {
        name: 'aniversario',
        check: (lead) => {
            return lead.upcomingDates.some(d => d.type === 'birthday' && isToday(d.date));
        },
        generate: (lead) => {
            return `🎉 Parabéns, ${lead.name}! Feliz aniversário! Que seu dia seja incrível!`;
        },
        cooldownDays: 365,
        priority: 9
    },

    // Evento na cidade/profissão
    {
        name: 'evento_relevante',
        check: (lead) => {
            // TODO: Integrar com fonte de eventos
            return false;
        },
        generate: (lead) => {
            return `Oi ${lead.name}! Vi uma novidade sobre ${lead.city || lead.profession} e lembrei de você!`;
        },
        cooldownDays: 14,
        priority: 5
    },

    // Compartilhar conteúdo útil
    {
        name: 'conteudo_util',
        check: (lead) => {
            const daysSince = daysSinceDate(lead.lastInteraction);
            return lead.relationshipDepth > 0.5 && daysSince >= 10 && daysSince <= 20;
        },
        generate: (lead) => {
            return `Oi ${lead.name}! Achei um conteúdo que pode te interessar sobre ${lead.profession || 'seu negócio'}. Posso mandar?`;
        },
        cooldownDays: 30,
        priority: 4
    }
];

// ============================================
// HELPERS
// ============================================

function daysSinceDate(date: Date): number {
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

function getOptimalSendTime(lead: LeadContext): Date {
    const now = new Date();
    const hour = now.getHours();

    // Evitar madrugada (0-8)
    if (hour < 8) {
        now.setHours(9, 0, 0, 0);
    }
    // Evitar muito tarde (22+)
    else if (hour >= 22) {
        now.setDate(now.getDate() + 1);
        now.setHours(9, 0, 0, 0);
    }
    // Preferir horário comercial
    else if (hour >= 12 && hour < 14) {
        now.setHours(14, 30, 0, 0);
    }

    return now;
}

// ============================================
// MAIN FUNCTIONS
// ============================================

export async function checkProactiveInitiatives(
    leadId: string
): Promise<ProactiveMessage | null> {
    if (!supabase) return null;

    try {
        // Buscar contexto do lead
        const { data: leadData } = await supabase
            .from('leads')
            .select('id, name, city, profession, created_at')
            .eq('id', leadId)
            .single();

        if (!leadData) return null;

        // Buscar última interação
        const { data: lastConv } = await supabase
            .from('conversations')
            .select('updated_at, status')
            .eq('lead_id', leadId)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

        // Buscar memórias com follow-up pendente
        const { data: pendingMemories } = await supabase
            .from('lxc_memories')
            .select('content')
            .eq('lead_id', leadId)
            .eq('is_active', true)
            .contains('content', { followUpNeeded: true });

        // Buscar última iniciativa (cooldown)
        const { data: lastInitiative } = await supabase
            .from('lxc_proactive_initiatives')
            .select('trigger_type, sent_at')
            .eq('lead_id', leadId)
            .order('sent_at', { ascending: false })
            .limit(1)
            .single();

        // Montar contexto
        const lead: LeadContext = {
            id: leadData.id,
            name: leadData.name || 'você',
            city: leadData.city,
            profession: leadData.profession,
            lastInteraction: lastConv?.updated_at ? new Date(lastConv.updated_at) : new Date(leadData.created_at),
            pendingFollowUps: (pendingMemories || []).map(m => ({
                type: 'memory',
                content: (m.content as Record<string, unknown>).content as string || ''
            })),
            upcomingDates: [], // TODO: integrar com datas
            conversationStage: lastConv?.status || 'new',
            relationshipDepth: 0.5 // TODO: buscar do presence state
        };

        // Verificar cooldown global (máximo 1 iniciativa por semana)
        if (lastInitiative) {
            const daysSinceInitiative = daysSinceDate(new Date(lastInitiative.sent_at));
            if (daysSinceInitiative < 7) {
                return null;
            }
        }

        // Testar triggers por prioridade
        const sortedTriggers = [...INITIATIVE_TRIGGERS].sort((a, b) => b.priority - a.priority);

        for (const trigger of sortedTriggers) {
            if (trigger.check(lead)) {
                // Verificar cooldown específico
                if (lastInitiative?.trigger_type === trigger.name) {
                    const daysSince = daysSinceDate(new Date(lastInitiative.sent_at));
                    if (daysSince < trigger.cooldownDays) {
                        continue;
                    }
                }

                return {
                    leadId: lead.id,
                    content: trigger.generate(lead),
                    triggerType: trigger.name,
                    scheduledFor: getOptimalSendTime(lead),
                    priority: trigger.priority,
                    context: { leadName: lead.name, city: lead.city, profession: lead.profession }
                };
            }
        }

        return null;
    } catch (e) {
        console.error('[Proactive] Check failed:', e);
        return null;
    }
}

export async function logProactiveInitiative(
    message: ProactiveMessage
): Promise<void> {
    if (!supabase) return;

    try {
        await supabase.from('lxc_proactive_initiatives').insert({
            lead_id: message.leadId,
            trigger_type: message.triggerType,
            content: message.content,
            scheduled_for: message.scheduledFor.toISOString(),
            priority: message.priority,
            context: message.context,
            sent_at: new Date().toISOString()
        });
    } catch (e) {
        console.warn('[Proactive] Log failed:', e);
    }
}

// ============================================
// BATCH CHECK (para jobs)
// ============================================

export async function checkAllLeadsForInitiatives(): Promise<ProactiveMessage[]> {
    if (!supabase) return [];

    try {
        // Buscar leads ativos com interações recentes
        const { data: activeLeads } = await supabase
            .from('leads')
            .select('id')
            .limit(100);

        const initiatives: ProactiveMessage[] = [];

        for (const lead of activeLeads || []) {
            const initiative = await checkProactiveInitiatives(lead.id);
            if (initiative) {
                initiatives.push(initiative);
            }
        }

        return initiatives;
    } catch (e) {
        console.error('[Proactive] Batch check failed:', e);
        return [];
    }
}
