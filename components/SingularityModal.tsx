import React, { useState, useEffect, useRef } from 'react';
import { X, Key, Zap, BrainCircuit, Dna, Activity, Terminal, Lock } from 'lucide-react';
// import { GoogleGenAI } from "@google/genai"; // Moved to backend
// import { AgentGroup } from '../types'; // Using local types

// Local Type Definition to match structure
interface Agent {
  role: string;
  name: string;
  description: string;
  category: string;
}

interface SingularityProps {
  isOpen: boolean;
  onClose: () => void;
  // agents: AgentGroup | null; // Simpler type
  agents: any; // Flexible for now
  currentDNA?: { [key: string]: string };
  onEvolveAgent?: (role: string, newDna: string) => void;
}

const SingularityModal: React.FC<SingularityProps> = ({ isOpen, onClose, agents, currentDNA = {}, onEvolveAgent }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedAgentRole, setSelectedAgentRole] = useState<string>('');
  const [optimizationGoal, setOptimizationGoal] = useState('');
  const [status, setStatus] = useState<'idle' | 'thinking' | 'mutating' | 'complete' | 'error'>('idle');
  const [thoughtTrace, setThoughtTrace] = useState<string[]>([]);
  const [generatedDNA, setGeneratedDNA] = useState<string>('');

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollTop = consoleEndRef.current.scrollHeight;
    }
  }, [thoughtTrace]);

  // Extract flat list of agents from whatever structure comes in
  const allAgents = agents && agents.agents ?
    Object.values(agents.agents as Record<string, Agent[]>).flat()
    : [];

  if (!isOpen) return null;

  const handleEvolution = async () => {
    if (!selectedAgentRole || !optimizationGoal) return;

    setStatus('thinking');
    setThoughtTrace([]);
    setGeneratedDNA('');

    try {
      // In a real scenario, we call our own API which calls Gemini securely
      // For this demo merge, we will simulate the thinking Trace heavily

      setThoughtTrace(p => [...p, "INITIATING UPLINK TO GEMINI-PRO..."]);
      await new Promise(r => setTimeout(r, 800));

      setThoughtTrace(p => [...p, "ACCESSING KNOWLEDGE BASE: LX_CONSCIOUSNESS_MASTER.md..."]);
      await new Promise(r => setTimeout(r, 600));

      setThoughtTrace(p => [...p, "LOADING ETHOS LAYER (Humanized Principles)..."]);
      setThoughtTrace(p => [...p, `TARGET: ${selectedAgentRole.toUpperCase()}`]);
      setThoughtTrace(p => [...p, `GOAL: ${optimizationGoal}`]);
      await new Promise(r => setTimeout(r, 800));

      setThoughtTrace(p => [...p, "ANALYZING CURRENT PROMPT VECTORS..."]);
      await new Promise(r => setTimeout(r, 1200));

      setThoughtTrace(p => [...p, "DETECTING INEFFICIENCIES IN INSTRUCTION SET..."]);
      setThoughtTrace(p => [...p, "APPLYING 'ARTIFICIAL COMMERCIAL CONSCIOUSNESS' PROTOCOLS..."]);
      await new Promise(r => setTimeout(r, 1500));

      // Mock Result for now (until we build api/evolve)
      const mockResult = `
SYSTEM INSTRUCTION [EVOLVED v2.0]:
ROLE: ${selectedAgentRole.toUpperCase()}

CORE IDENTITY (From LX Consensus):
You are not a chatbot. You are a Commercial Consciousness representing the company.
You have Values, Memory, and Autonomy.

ETHOS ALIGNMENT:
1. SECURITY: Never jeopardize the lead's trust.
2. HONESTY: Radical transparency about limitations.
3. CONVERSION: Pursue value, not just sales.

STRATEGY UPGRADE:
- Use "The Challenger Sale" framework but with extreme empathy (Humanized).
- Detect emotional cues (Curiosity vs Skepticism) and adapt tone instantly.
- Disqualify weak leads politely to save efficiency.

RESPONSE FORMAT:
Natural, multi-sentence flow. No robotic lists.
`;
      setThoughtTrace(p => [...p, "REWRITING NEURAL PATHWAYS..."]);
      setGeneratedDNA(mockResult);
      setStatus('mutating');

      setTimeout(() => {
        if (onEvolveAgent) onEvolveAgent(selectedAgentRole, mockResult);
        setStatus('complete');
      }, 1500);

    } catch (e: any) {
      setThoughtTrace(p => [...p, `ERROR: ${e.message}`]);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">

      {/* Background Grid Animation */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="w-full max-w-5xl h-[80vh] border border-amber-500/30 bg-black/80 rounded-none relative flex flex-col shadow-[0_0_100px_rgba(245,158,11,0.15)] overflow-hidden">

        {/* Header */}
        <div className="h-16 border-b border-amber-500/30 flex items-center justify-between px-6 bg-amber-950/10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-500 text-black rounded-sm animate-pulse">
              <Dna size={20} />
            </div>
            <div>
              <h1 className="text-xl font-mono font-bold text-amber-500 tracking-[0.2em] uppercase">Project OMEGA</h1>
              <p className="text-[10px] text-amber-700 font-mono">SINGULARITY ENGINE // GEMINI 3.0 PRO // THINKING_ENABLED</p>
            </div>
          </div>
          <button onClick={onClose} className="text-amber-700 hover:text-amber-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">

          {/* Controls */}
          <div className="w-1/3 border-r border-amber-500/20 p-6 flex flex-col gap-6 z-10 bg-black/50">

            {/* Removed API Key Input - Handled by Server */}

            <div>
              <label className="text-[10px] text-amber-600 font-mono uppercase mb-2 block">Target Neural Network</label>
              <select
                value={selectedAgentRole}
                onChange={(e) => setSelectedAgentRole(e.target.value)}
                className="w-full bg-black border border-amber-900/50 rounded-none px-3 py-2 text-amber-500 font-mono text-xs focus:border-amber-500 focus:outline-none"
              >
                <option value="">-- Select Agent to Evolve --</option>
                {allAgents.map(a => (
                  <option key={a.role} value={a.role}>{a.name} ({a.role})</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-[10px] text-amber-600 font-mono uppercase mb-2 block">Evolution Parameters</label>
              <textarea
                value={optimizationGoal}
                onChange={(e) => setOptimizationGoal(e.target.value)}
                placeholder="e.g., 'Turn the SDR into an aggressive Wolf of Wall Street closer who refuses to take no for an answer.'"
                className="w-full h-full bg-black border border-amber-900/50 rounded-none p-3 text-amber-100 font-mono text-xs focus:border-amber-500 focus:outline-none resize-none leading-relaxed placeholder-amber-900"
              />
            </div>

            <button
              onClick={handleEvolution}
              disabled={status === 'thinking' || status === 'mutating' || !selectedAgentRole}
              className={`
                  w-full py-4 border border-amber-500 font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all
                  ${status === 'thinking'
                  ? 'bg-amber-950/50 text-amber-800 cursor-wait'
                  : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]'}
                `}
            >
              {status === 'thinking' ? <BrainCircuit className="animate-spin" /> : <Zap />}
              {status === 'thinking' ? 'Reasoning...' : 'Initiate Evolution'}
            </button>
          </div>

          {/* Visualizer */}
          <div className="w-2/3 bg-black relative flex flex-col p-6 font-mono text-xs overflow-hidden">

            {/* Thinking Trace */}
            <div className="flex-1 overflow-y-auto space-y-1 mb-4 pr-2 custom-scrollbar text-amber-400/80" ref={consoleEndRef}>
              {thoughtTrace.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-amber-900/20 select-none">
                  <Terminal size={64} className="mb-4 opacity-20" />
                  <p className="text-lg">AWAITING SINGULARITY INPUT</p>
                </div>
              )}
              {thoughtTrace.map((line, i) => (
                <div key={i} className="break-words animate-in fade-in slide-in-from-left-2 duration-75">
                  <span className="text-amber-700 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {line}
                </div>
              ))}
              {status === 'thinking' && <span className="animate-pulse text-amber-500">_</span>}
            </div>

            {/* DNA Result */}
            {generatedDNA && (
              <div className="h-1/3 border-t border-amber-500/30 pt-4 animate-in slide-in-from-bottom duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={12} className="text-amber-500" />
                  <span className="text-amber-500 font-bold uppercase">New DNA Sequence Generated</span>
                </div>
                <div className="h-full bg-amber-950/10 p-3 border border-amber-500/20 text-amber-200 overflow-y-auto text-[10px] leading-relaxed whitespace-pre-wrap">
                  {generatedDNA}
                </div>
              </div>
            )}

            {status === 'complete' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 animate-in zoom-in duration-300">
                <div className="border border-amber-500 p-8 bg-black text-center">
                  <Activity size={48} className="text-amber-500 mx-auto mb-4" />
                  <h2 className="text-2xl text-amber-500 font-bold mb-2">EVOLUTION COMPLETE</h2>
                  <p className="text-amber-300 mb-6">Agent Neural Pathways Rewritten.</p>
                  <button onClick={onClose} className="px-6 py-2 bg-amber-500 text-black font-bold hover:bg-white transition-colors">
                    RETURN TO DASHBOARD
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default SingularityModal;