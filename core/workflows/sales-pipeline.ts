import { Intent, RiskLevel, AgentContext, SessionState } from '../types';
import { orchestrate } from '../orchestrator';

// ============================================
// LX CORTEX - NATIVE WORKFLOW ENGINE
// ============================================
// Substitui o N8N para fluxos de vendas.
// Arquitetura: Pipeline Linear (Trigger -> Process -> Action)

export type WorkflowStep = 'INIT' | 'CLASSIFY' | 'DECIDE' | 'RESPOND' | 'LOG';

export interface WorkflowResult {
    success: boolean;
    steps_executed: WorkflowStep[];
    final_output: any;
    error?: string;
    metrics: {
        latency_ms: number;
    };
}

// 1. O "Cérebro" do Fluxo
export async function executeSalesWorkflow(
    inputData: { contact: any; message: string; platform: string }
): Promise<WorkflowResult> {
    const startTime = Date.now();
    const steps: WorkflowStep[] = [];

    try {
        // STEP 1: INITIALIZATION
        steps.push('INIT');
        console.log(`[CORTEX] Iniciando fluxo para: ${inputData.contact.name || 'Anon'}`);

        // Criar sessão válida
        const session: SessionState = {
            session_id: `ses_${inputData.contact.id}_${Date.now()}`,
            lead_id: inputData.contact.id || 'unknown',
            subscriber_id: inputData.contact.subscriber_id || 'unknown',
            session_summary: '',
            current_intent: 'duvida' as Intent,
            risk_level: 'baixo' as RiskLevel,
            message_count: 0,
            objection_count: 0,
            same_objection_count: 0,
            last_objection: null,
            first_interaction: true,
            last_interaction_at: null,
            days_since_last: 0,
            lead_name: inputData.contact.name || null,
            lead_niche: null,
            lead_goal: null,
            last_opener_id: null,
            last_opener_date: null
        };

        // Normalizar contexto
        const context: AgentContext = {
            session,
            message: inputData.message,
            channel: inputData.platform === 'whatsapp' ? 'whatsapp' : 'site',
            source: 'workflow_engine_v1',
            timestamp: new Date().toISOString()
        };

        // STEP 2: ORCHESTRATION (Substitui o "HTTP Request" do N8N para a API)
        // Chamamos a função interna direto, sem fetch HTTP (Zero Latency)
        steps.push('CLASSIFY', 'DECIDE', 'RESPOND');

        // A mágica acontece aqui: O Orquestrador já classifica e decide
        const orchestrationResult = await orchestrate(context);

        // STEP 3: LOGGING (Substitui o "Insert Row" do N8N)
        steps.push('LOG');
        // await supabase.from('conversations').insert(...) // Todo: Implementar persistência real

        const totalTime = Date.now() - startTime;

        return {
            success: true,
            steps_executed: steps,
            final_output: {
                text: orchestrationResult.response.text,
                action: orchestrationResult.response.action,
                agent: orchestrationResult.metadata.agent
            },
            metrics: { latency_ms: totalTime }
        };

    } catch (e: any) {
        return {
            success: false,
            steps_executed: steps,
            final_output: null,
            error: e.message,
            metrics: { latency_ms: Date.now() - startTime }
        };
    }
}
