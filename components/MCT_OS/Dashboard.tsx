
import React, { useState } from 'react';
import { Agent, AgentStats, HealthResponse } from '../types';
import { Mic, Eye, EyeOff, Zap, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { HeartbeatMonitor } from './HeartbeatMonitor';
import { DojoArena } from './DojoArena';
import { NeuralBackground } from './NeuralBackground';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  stats: AgentStats | null;
  health: HealthResponse | null;
  featuredAgents: Agent[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, health, featuredAgents }) => {
  const [instaMode, setInstaMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Fallback data
  const safeHealth = health || { local_llm: { cost_savings: 1250.00, model: 'Llama-3-8b' }, orchestration: { active_sessions: 12 } };

  const toggleInstaMode = () => setInstaMode(!instaMode);

  return (
    <div className={`min-h-screen bg-[#020202] text-white font-mono transition-none relative overflow-hidden flex flex-col ${instaMode ? 'p-0' : 'p-6'}`}>

      {/* 1. ATMOSPHERE LAYER */}
      <NeuralBackground />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-green-900/10 pointer-events-none z-0"></div>

      {/* 2. UI LAYER */}
      <div className="relative z-10 flex flex-col h-full">

        {/* HEADER: COMMAND CENTER */}
        <motion.header
          layout
          className={`flex justify-between items-end border-b border-green-900/30 pb-4 mb-6 backdrop-blur-sm ${instaMode ? 'pt-12 px-8 bg-black/60 sticky top-0 z-50' : ''}`}
        >
          <div className="flex items-center gap-4">
            {/* Logo Glitch Effect */}
            <div className="relative group cursor-default">
              <h1 className="text-3xl font-black tracking-tighter text-white group-hover:animate-pulse">
                MCT OS
              </h1>
              <span className="absolute -top-1 -right-6 text-[10px] text-green-500 border border-green-500/50 px-1 rounded bg-green-900/20">
                V1.0
              </span>
              <div className="h-0.5 w-full bg-green-500 mt-1 shadow-[0_0_10px_#22c55e]"></div>
            </div>

            {!instaMode && (
              <div className="hidden md:flex gap-4 ml-8 text-[10px] text-gray-500 font-bold tracking-widest">
                <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-green-600" /> SECURITY: MAX</span>
                <span className="flex items-center gap-1"><Cpu size={10} className="text-green-600" /> NEURAL: ONLINE</span>
              </div>
            )}
          </div>

          <button
            onClick={toggleInstaMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm border transition-all duration-300 group
                ${instaMode
                ? 'bg-purple-900/20 border-purple-500 text-purple-400 hover:bg-purple-900/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-black/40 border-green-900/50 text-green-600 hover:text-green-400 hover:border-green-500 hover:shadow-[0_0_10px_rgba(34,197,94,0.2)]'
              }`}
          >
            {instaMode ? <Eye size={16} /> : <EyeOff size={16} />}
            <span className="text-xs font-bold tracking-widest">{instaMode ? 'EXIT INSTA-MODE' : 'REC_MODE'}</span>
          </button>
        </motion.header>

        {/* MAIN GRID */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: HYPERVELOCITY INPUT */}
          <AnimatePresence>
            {!instaMode && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                className="lg:col-span-4 flex flex-col gap-6"
              >
                {/* THE ORB (Voice Dump) */}
                <div
                  className="bg-black/40 border border-green-900/30 p-8 rounded-sm backdrop-blur-md group hover:border-green-500/50 transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex flex-col items-center justify-center gap-4 z-10 relative">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-500/20 shadow-[0_0_30px_#ef4444]' : 'bg-green-500/10 shadow-[0_0_20px_#22c55e]'}`}>
                      <motion.div
                        animate={{ scale: isRecording ? [1, 1.2, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Mic size={32} className={isRecording ? 'text-red-500' : 'text-green-500'} />
                      </motion.div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      {isRecording ? 'LISTENING...' : 'VOICE DUMP INPUT'}
                    </h3>
                    <p className="text-[10px] text-gray-600 text-center max-w-[200px]">
                      CLICK TO DUMP CHAOS. <br /> AI WILL STRUCTURE IT.
                    </p>
                  </div>
                </div>

                {/* METRICS HUD */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/40 border border-green-900/30 rounded-sm">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Saved (Bio-Coins)</div>
                    <div className="text-2xl font-mono text-white mt-1 flex items-end gap-2">
                      ${safeHealth.local_llm.cost_savings.toFixed(0)} <span className="text-xs text-green-500 mb-1">▲</span>
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 border border-green-900/30 rounded-sm">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Active Synapses</div>
                    <div className="text-2xl font-mono text-white mt-1">
                      {safeHealth.orchestration.active_sessions}
                    </div>
                  </div>
                </div>

                {/* AGENT LIST */}
                <div className="flex-1 bg-black/20 border border-green-900/30 rounded-sm p-4 overflow-hidden backdrop-blur-sm">
                  <div className="text-[10px] text-gray-500 uppercase mb-4 border-b border-gray-800 pb-2">Colony Status</div>
                  <div className="space-y-3">
                    {featuredAgents.slice(0, 5).map((agent, i) => (
                      <div key={i} className="flex items-center justify-between text-xs group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-gray-700'}`}></div>
                          <span className="text-gray-400 group-hover:text-white transition-colors uppercase font-bold">{agent.name}</span>
                        </div>
                        <span className="text-[9px] text-gray-600 bg-gray-900 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {agent.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT COLUMN: VISUAL PROOF (Takes over in Insta-Mode) */}
          <motion.div
            layout
            className={`${instaMode ? 'lg:col-span-12 px-8 scale-105 origin-top' : 'lg:col-span-8'} flex flex-col gap-6`}
          >

            {/* DOJO ARENA */}
            <div className="flex-1 min-h-[500px] border border-green-900/30 bg-black/50 backdrop-blur-sm rounded-sm p-1 relative group">
              {/* Decorative Corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500"></div>

              <DojoArena />
            </div>

            {/* HEARTBEAT (Full Width) */}
            <div className={`relative border border-green-900/30 bg-black/80 rounded-sm overflow-hidden ${instaMode ? 'h-48' : 'h-32'}`}>
              <HeartbeatMonitor bpm={78} active={true} />
              <div className="absolute bottom-2 right-2 text-[10px] text-green-500/50 font-mono">
                SYSTEM_PULSE_MONITOR // REALTIME
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;