// ============================================
// LX KNOWLEDGE - Index Principal
// ============================================

export * from './base';
export * from './prompts';

import { KNOWLEDGE_BASE, searchKnowledge } from './base';
import { PROMPT_LIBRARY, getPromptForSituation } from './prompts';

// Re-export
export { KNOWLEDGE_BASE, searchKnowledge, PROMPT_LIBRARY, getPromptForSituation };
