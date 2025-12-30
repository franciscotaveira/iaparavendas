/**
 * LXC CONSCIOUSNESS MODULE
 * Exporta todos os componentes do Nível 3
 */

// Core
export { PresenceCore, EmotionalState, MemoryType, detectEmotion } from './presence-core';
export type {
    MemoryEntry,
    SubtextPattern,
    TimingConfig,
    Message,
    PresenceState,
    SubtextAnalysis
} from './presence-core';

// Timing
export {
    calculateEmotionalTiming,
    selectPreResponse,
    applyHumanImperfection
} from './emotional-timing';
export type { TimingResult } from './emotional-timing';

// Proactive
export {
    checkProactiveInitiatives,
    logProactiveInitiative,
    checkAllLeadsForInitiatives
} from './proactive-initiative';
export type { ProactiveMessage, LeadContext } from './proactive-initiative';

// Relational Memory
export {
    detectMomentType,
    saveSharedMoment,
    getLeadMemory,
    generateRelationalOpening,
    extractMomentFromMessage
} from './relational-memory';
export type { SharedMoment, LeadMemory } from './relational-memory';
