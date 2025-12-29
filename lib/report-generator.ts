// ============================================
// LX REPORT GENERATOR v1.0
// ============================================
// Gera mini-relatório de 1 página após qualificação

import { getNichePack, type NichePack } from './niche-packs';

// ============================================
// TIPOS
// ============================================
export interface LeadProfile {
    name?: string;
    company?: string;
    niche: string;
    goal?: string;
    channel?: string;
    pain?: string;
    volume?: string;
    objections: string[];
}

export interface ReportData {
    id: string;
    generated_at: string;
    lead: LeadProfile;
    analysis: {
        score_fit: number;
        score_label: 'Baixo' | 'Médio' | 'Alto' | 'Excelente';
        qualification_level: 'Curioso' | 'Interessado' | 'Qualificado' | 'Pronto para fechar';
        priority: 'Baixa' | 'Média' | 'Alta';
    };
    insights: {
        strengths: string[];
        concerns: string[];
        next_steps: string[];
    };
    recommendations: {
        package: 'Starter' | 'Pro' | 'Full';
        reason: string;
        estimated_value?: string;
    };
    conversation_summary: string;
    niche_pack: string;
}

// ============================================
// SCORE LABELS
// ============================================
function getScoreLabel(score: number): ReportData['analysis']['score_label'] {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Alto';
    if (score >= 40) return 'Médio';
    return 'Baixo';
}

function getQualificationLevel(score: number, messagesCount: number): ReportData['analysis']['qualification_level'] {
    if (score >= 80 && messagesCount >= 6) return 'Pronto para fechar';
    if (score >= 60) return 'Qualificado';
    if (score >= 40 || messagesCount >= 4) return 'Interessado';
    return 'Curioso';
}

function getPriority(score: number, hasUrgency: boolean): ReportData['analysis']['priority'] {
    if (hasUrgency || score >= 80) return 'Alta';
    if (score >= 50) return 'Média';
    return 'Baixa';
}

// ============================================
// INSIGHTS GENERATOR
// ============================================
function generateInsights(
    lead: LeadProfile,
    score: number,
    pack: NichePack
): ReportData['insights'] {
    const strengths: string[] = [];
    const concerns: string[] = [];
    const next_steps: string[] = [];

    // Strengths based on what we know
    if (lead.niche && lead.niche !== 'Não detectado') {
        strengths.push(`Nicho bem definido: ${lead.niche}`);
    }
    if (lead.goal && lead.goal !== 'Não detectado') {
        strengths.push(`Objetivo claro: ${lead.goal}`);
    }
    if (lead.channel && lead.channel !== 'Não detectado') {
        strengths.push(`Canal de atendimento identificado: ${lead.channel}`);
    }
    if (lead.volume && lead.volume !== 'Não detectado') {
        strengths.push(`Volume de atendimento informado: ${lead.volume}`);
    }
    if (lead.pain && lead.pain !== 'Não detectado') {
        strengths.push(`Dor principal identificada: ${lead.pain}`);
    }

    // Concerns based on score and objections
    if (score < 50) {
        concerns.push('Baixa qualificação - precisa de mais contexto');
    }
    if (lead.objections.length > 0) {
        concerns.push(`Objeções levantadas: ${lead.objections.join(', ')}`);
    }
    if (!lead.volume || lead.volume === 'Não detectado') {
        concerns.push('Volume de atendimento não informado');
    }
    if (pack.risk_mode) {
        concerns.push('Nicho requer cuidado regulatório (modo risco ativo)');
    }

    // Next steps based on qualification
    if (score >= 70) {
        next_steps.push('Agendar call de apresentação');
        next_steps.push('Enviar proposta comercial');
    } else if (score >= 50) {
        next_steps.push('Aprofundar qualificação via WhatsApp');
        next_steps.push('Compartilhar case de sucesso do nicho');
    } else {
        next_steps.push('Nutrir com conteúdo educativo');
        next_steps.push('Reengajar após 7 dias');
    }

    // Add niche-specific next step
    if (pack.niche === 'saas') {
        next_steps.push('Oferecer demo personalizada');
    } else if (pack.niche === 'mercado_financeiro') {
        next_steps.push('Conectar com especialista de compliance');
    }

    return { strengths, concerns, next_steps };
}

// ============================================
// PACKAGE RECOMMENDATION
// ============================================
function recommendPackage(
    lead: LeadProfile,
    score: number,
    messagesCount: number
): ReportData['recommendations'] {
    // Logic based on maturity signals
    const hasMultipleChannels = lead.channel?.includes(',') || false;
    const highVolume = lead.volume?.match(/\d+/)?.[0] ? parseInt(lead.volume.match(/\d+/)![0]) > 30 : false;
    const hasIntegrationNeeds = lead.pain?.toLowerCase().includes('crm') ||
        lead.pain?.toLowerCase().includes('sistema') ||
        lead.pain?.toLowerCase().includes('integr');

    if (score >= 75 && (hasMultipleChannels || highVolume || hasIntegrationNeeds)) {
        return {
            package: 'Full',
            reason: 'Alto volume e/ou necessidade de integrações justificam pacote completo',
            estimated_value: 'R$ 2.500 - 5.000/mês',
        };
    }

    if (score >= 50 || messagesCount >= 6) {
        return {
            package: 'Pro',
            reason: 'Lead qualificado com demanda clara para automação avançada',
            estimated_value: 'R$ 1.200 - 2.500/mês',
        };
    }

    return {
        package: 'Starter',
        reason: 'Início com escopo controlado para validar valor',
        estimated_value: 'R$ 497 - 997/mês',
    };
}

// ============================================
// SUMMARY GENERATOR
// ============================================
function generateSummary(lead: LeadProfile, score: number): string {
    const parts: string[] = [];

    if (lead.company) {
        parts.push(`Lead da empresa ${lead.company}`);
    } else if (lead.niche) {
        parts.push(`Lead do nicho ${lead.niche}`);
    } else {
        parts.push('Lead em prospecção');
    }

    if (lead.goal) {
        parts.push(`busca ${lead.goal}`);
    }

    if (lead.channel) {
        parts.push(`usa ${lead.channel} como canal principal`);
    }

    if (lead.volume) {
        parts.push(`com volume de ${lead.volume}`);
    }

    if (lead.pain) {
        parts.push(`Principal dor: ${lead.pain}`);
    }

    parts.push(`Score de fit: ${score}/100.`);

    return parts.join('. ').replace(/\. \./g, '.');
}

// ============================================
// MAIN GENERATOR
// ============================================
export function generateReport(params: {
    sessionId: string;
    lead: LeadProfile;
    scoreFit: number;
    messagesCount: number;
    hasUrgency?: boolean;
}): ReportData {
    const { sessionId, lead, scoreFit, messagesCount, hasUrgency = false } = params;
    const pack = getNichePack(lead.niche);

    return {
        id: `report_${sessionId}_${Date.now()}`,
        generated_at: new Date().toISOString(),
        lead,
        analysis: {
            score_fit: scoreFit,
            score_label: getScoreLabel(scoreFit),
            qualification_level: getQualificationLevel(scoreFit, messagesCount),
            priority: getPriority(scoreFit, hasUrgency),
        },
        insights: generateInsights(lead, scoreFit, pack),
        recommendations: recommendPackage(lead, scoreFit, messagesCount),
        conversation_summary: generateSummary(lead, scoreFit),
        niche_pack: pack.niche,
    };
}

// ============================================
// REPORT TO HTML (para email/export)
// ============================================
export function reportToHTML(report: ReportData): string {
    const priorityColor = {
        'Alta': '#ef4444',
        'Média': '#f59e0b',
        'Baixa': '#6b7280',
    };

    const scoreColor = report.analysis.score_fit >= 70 ? '#22c55e' :
        report.analysis.score_fit >= 50 ? '#f59e0b' : '#ef4444';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Relatório de Lead - ${report.lead.company || report.lead.niche}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { margin: 0 0 8px 0; font-size: 24px; color: #fff; }
    .header .meta { font-size: 12px; color: #71717a; }
    .score-badge { display: inline-block; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 18px; }
    .section { background: #18181b; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
    .section h2 { margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .metric { padding: 16px; background: #27272a; border-radius: 8px; }
    .metric-label { font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; }
    .metric-value { font-size: 20px; font-weight: bold; margin-top: 4px; }
    ul { margin: 0; padding-left: 20px; }
    li { margin-bottom: 8px; color: #a1a1aa; }
    .recommendation { background: linear-gradient(135deg, #1e3a5f 0%, #1a1a2e 100%); border: 1px solid #3b82f6; }
    .recommendation h3 { color: #60a5fa; margin: 0 0 8px 0; }
    .priority { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
    .footer { text-align: center; font-size: 11px; color: #52525b; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Relatório de Qualificação</h1>
    <div class="meta">
      <span>ID: ${report.id}</span> · 
      <span>Gerado: ${new Date(report.generated_at).toLocaleString('pt-BR')}</span> ·
      <span class="priority" style="background: ${priorityColor[report.analysis.priority]}20; color: ${priorityColor[report.analysis.priority]}">
        Prioridade ${report.analysis.priority}
      </span>
    </div>
  </div>

  <div class="section">
    <h2>Score de Fit</h2>
    <div class="grid">
      <div class="metric">
        <div class="metric-label">Score</div>
        <div class="metric-value" style="color: ${scoreColor}">${report.analysis.score_fit}/100</div>
      </div>
      <div class="metric">
        <div class="metric-label">Qualificação</div>
        <div class="metric-value">${report.analysis.qualification_level}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Perfil do Lead</h2>
    <div class="grid">
      <div class="metric">
        <div class="metric-label">Nicho</div>
        <div class="metric-value">${report.lead.niche}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Objetivo</div>
        <div class="metric-value">${report.lead.goal || 'Não detectado'}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Canal</div>
        <div class="metric-value">${report.lead.channel || 'Não detectado'}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Volume</div>
        <div class="metric-value">${report.lead.volume || 'Não detectado'}</div>
      </div>
    </div>
    ${report.lead.pain ? `<p style="margin-top: 16px; padding: 12px; background: #27272a; border-radius: 8px;"><strong>Dor principal:</strong> ${report.lead.pain}</p>` : ''}
  </div>

  <div class="section">
    <h2>Análise</h2>
    <div class="grid">
      <div>
        <h4 style="color: #22c55e; margin: 0 0 12px 0;">✅ Pontos Fortes</h4>
        <ul>
          ${report.insights.strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      <div>
        <h4 style="color: #f59e0b; margin: 0 0 12px 0;">⚠️ Pontos de Atenção</h4>
        <ul>
          ${report.insights.concerns.length > 0 ? report.insights.concerns.map(c => `<li>${c}</li>`).join('') : '<li>Nenhum ponto crítico</li>'}
        </ul>
      </div>
    </div>
  </div>

  <div class="section recommendation">
    <h2>Recomendação</h2>
    <h3>📦 Pacote ${report.recommendations.package}</h3>
    <p style="margin: 8px 0; color: #a1a1aa;">${report.recommendations.reason}</p>
    ${report.recommendations.estimated_value ? `<p style="font-size: 18px; font-weight: bold; color: #60a5fa;">${report.recommendations.estimated_value}</p>` : ''}
  </div>

  <div class="section">
    <h2>Próximos Passos</h2>
    <ul>
      ${report.insights.next_steps.map(s => `<li>${s}</li>`).join('')}
    </ul>
  </div>

  <div class="section" style="background: #1c1c1c;">
    <h2>Resumo da Conversa</h2>
    <p style="color: #a1a1aa; font-style: italic;">"${report.conversation_summary}"</p>
  </div>

  <div class="footer">
    Lx Humanized Agents OS · Gerado automaticamente · ${new Date().getFullYear()}
  </div>
</body>
</html>
  `.trim();
}
