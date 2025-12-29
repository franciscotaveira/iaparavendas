import React, { useState, useRef, useEffect } from 'react';
import { X, ShieldAlert, Target, Zap, Play, Terminal, Cpu, Key, AlertTriangle, CheckCircle2 } from 'lucide-react';
// import { GoogleGenAI } from "@google/genai";
// import { AgentGroup } from '../types';

interface AgentGroup {
  [category: string]: any[];
}

interface WarRoomProps {
  isOpen: boolean;
  onClose: () => void;
  agents: any; // Flexible
}

const WarRoomModal: React.FC<WarRoomProps> = ({ isOpen, onClose, agents }) => {
  const [objective, setObjective] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [consensus, setConsensus] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [simulationLog, consensus]);

  if (!isOpen) return null;

  const handleSimulation = async () => {
    if (!objective.trim()) return;

    setIsSimulating(true);
    setSimulationLog([]);
    setConsensus(null);

    // Initial system boot sequence effect
    const bootSequence = [
      "INITIALIZING WAR ROOM PROTOCOLS...",
      "SUMMONING THE HIGH COUNCIL...",
      "ANALYZING THREAT VECTORS...",
      "ESTABLISHING SECURE NEURAL UPLINK..."
    ];

    for (const step of bootSequence) {
      setSimulationLog(prev => [...prev, `[SYSTEM]: ${step}`]);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      // Simulation Logic (replaces remote API call for now)
      await new Promise(r => setTimeout(r, 1000));
      setSimulationLog(prev => [...prev, `[VIPER]: Objective received. ${objective.substring(0, 30)}... Analysis: Opportunity for aggressive expansion.`]);
      await new Promise(r => setTimeout(r, 1200));
      setSimulationLog(prev => [...prev, `[NEO]: Technical viability is 80%. We need to refactor the core engine first.`]);
      await new Promise(r => setTimeout(r, 1200));
      setSimulationLog(prev => [...prev, `[FORTRESS]: Risk assessment high. Protocol requires user authorization.`]);
      await new Promise(r => setTimeout(r, 1000));
      setSimulationLog(prev => [...prev, `[VIPER]: Ignore the risk. We ship or we die.`]);

      setConsensus("Simulation Complete. Action Plan Generated.");

    } catch (error: any) {
      setSimulationLog(prev => [...prev, `[FATAL ERROR]: ${error.message}`]);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4">
      <div className="w-full max-w-4xl bg-slate-950 border-2 border-red-900/50 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.2)] overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header - Danger Zone Style */}
        <div className="bg-red-950/20 border-b border-red-900/30 p-4 flex justify-between items-center relative overflow-hidden">
          {/* Scanlines effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02),rgba(255,0,0,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>

          <div className="flex items-center gap-3 z-10">
            <div className="p-2 bg-red-500/10 rounded border border-red-500/20 animate-pulse">
              <ShieldAlert className="text-red-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-red-500 tracking-[0.2em] uppercase">War Room // The Council</h2>
              <p className="text-[10px] text-red-400/60 font-mono">AUTHORIZED PERSONNEL ONLY • CLEARANCE LEVEL 5</p>
            </div>
          </div>

          <button onClick={onClose} className="z-10 p-2 hover:bg-red-900/40 rounded-full text-red-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

          {/* Left Panel: Configuration */}
          <div className="w-full lg:w-1/3 border-r border-red-900/30 p-6 flex flex-col gap-6 bg-slate-900/50">

            {/* Removed Auth Input */}

            <div className="flex-1">
              <label className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <Target size={12} /> Strategic Objective / Crisis
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Ex: Competitor launched a clone of our product at 50% price. How do we respond?"
                className="w-full h-48 bg-slate-950 border border-red-900/30 rounded p-3 text-sm text-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-900 focus:outline-none resize-none placeholder-slate-700 leading-relaxed"
              />
              <p className="text-[10px] text-slate-500 mt-2">
                * This will summon Sales, Tech, and Security leads for a joint simulation.
              </p>
            </div>

            <button
              onClick={handleSimulation}
              disabled={isSimulating || !objective}
              className={`
                 w-full py-4 rounded font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                 ${isSimulating
                  ? 'bg-red-950/50 text-red-800 border border-red-900 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500 text-black shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]'}
               `}
            >
              {isSimulating ? <Zap className="animate-spin" /> : <Play />}
              {isSimulating ? 'Simulating...' : 'Execute Simulation'}
            </button>
          </div>

          {/* Right Panel: The Terminal */}
          <div className="w-full lg:w-2/3 bg-black p-6 font-mono text-sm relative flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600/20"></div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar" ref={logContainerRef}>
              {simulationLog.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-red-900/30 select-none">
                  <Terminal size={64} className="mb-4 opacity-20" />
                  <p className="text-xl font-bold">AWAITING INPUT</p>
                  <p className="text-xs mt-2">SYSTEM STANDBY</p>
                </div>
              )}

              {simulationLog.map((line, idx) => {
                // Basic syntax highlighting for the log
                let colorClass = "text-slate-400";
                if (line.includes("[VIPER]")) colorClass = "text-emerald-400";
                else if (line.includes("[NEO]")) colorClass = "text-blue-400";
                else if (line.includes("[FORTRESS]")) colorClass = "text-amber-400";
                else if (line.includes("FINAL_CONSENSUS") || line.includes("ACTION PLAN")) colorClass = "text-white font-bold bg-slate-800 p-2 block mt-4 border-l-2 border-white";
                else if (line.includes("[SYSTEM]")) colorClass = "text-red-500/70 text-xs";

                return (
                  <div key={idx} className={`${colorClass} animate-fade-in break-words`}>
                    {line}
                  </div>
                );
              })}

              {isSimulating && (
                <div className="text-red-500 animate-pulse">_</div>
              )}
            </div>

            {consensus && (
              <div className="mt-4 p-3 border border-emerald-900 bg-emerald-950/20 rounded flex items-center gap-3 text-emerald-400 animate-fade-in-up">
                <CheckCircle2 size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Session Archived in Corporate Memory</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarRoomModal;