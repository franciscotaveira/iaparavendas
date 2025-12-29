// ============================================
// LX AGENT TOOLS - Definitions
// ============================================
// Infraestrutura para que agentes possam EXECUTAR ações
// e não apenas gerar texto.
// ============================================

import { z } from 'zod';

export interface AgentTool<TArgs = any, TResult = any> {
    name: string;
    description: string;
    category: 'research' | 'coding' | 'system' | 'marketing';
    parameters: z.ZodType<TArgs>;
    execute: (args: TArgs, context?: any) => Promise<TResult>;
    requires_permission?: boolean; // Se true, usuário precisa aprovar
}

export interface ToolResult {
    tool: string;
    input: any;
    output: any;
    success: boolean;
    error?: string;
    timestamp: number;
}

// Registro central de ferramentas disponíveis
export const TOOLS_REGISTRY: Record<string, AgentTool> = {};

export function registerTool(tool: AgentTool) {
    TOOLS_REGISTRY[tool.name] = tool;
    console.log(`[Tools] Ferramenta registrada: ${tool.name}`);
}

export function getTool(name: string): AgentTool | undefined {
    return TOOLS_REGISTRY[name];
}

export function getToolsForAgent(allowedTools: string[]): AgentTool[] {
    return allowedTools
        .map(name => TOOLS_REGISTRY[name])
        .filter(Boolean);
}
