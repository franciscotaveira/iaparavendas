import React, { useEffect, useState } from 'react';
import { MemoryItem, HealthResponse } from '../types';
import { fetchMemories, fetchHealth } from '../services/mockApi';
import { Search, Database, Filter, ArrowUpRight, ShieldCheck, Wifi, WifiOff, RefreshCw, Lock, Sparkles, Key, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const MemoryBank: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<MemoryItem[]>([]);
  const [dbStatus, setDbStatus] = useState<string>('connecting');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Semantic Search State
  const [apiKey, setApiKey] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [searchMode, setSearchMode] = useState<'keyword' | 'semantic'>('keyword');

  useEffect(() => {
    const init = async () => {
      const [memData, healthData] = await Promise.all([fetchMemories(), fetchHealth()]);
      setMemories(memData);
      setFilteredMemories(memData);
      setDbStatus(healthData.database_status);
      setLoading(false);
    };
    init();
  }, []);

  // Standard Keyword Filter (Fallback)
  useEffect(() => {
    if (searchMode === 'keyword') {
      const results = memories.filter(m => 
        m.niche.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.pattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.includes(searchTerm)
      );
      setFilteredMemories(results);
    }
  }, [searchTerm, memories, searchMode]);

  const handleSemanticSearch = async () => {
    if (!searchTerm.trim()) {
       setFilteredMemories(memories);
       return;
    }
    
    // Switch to Semantic Mode
    setSearchMode('semantic');
    setIsSearchingAI(true);

    try {
      const keyToUse = apiKey || process.env.API_KEY || '';
      if (!keyToUse) {
        alert("Enter API Key for Semantic Search"); // Simple alert for fallback
        setIsSearchingAI(false);
        setSearchMode('keyword');
        return;
      }

      const ai = new GoogleGenAI({ apiKey: keyToUse });
      
      // We send the dataset to the model (in a real app, this would be a Vector DB query)
      // Here we demonstrate the logic using the Context Window of Flash (Cost efficient)
      const prompt = `
        You are a Semantic Search Engine for a Corporate Memory Bank.
        
        DATASET (JSON):
        ${JSON.stringify(memories.map(m => ({ id: m.id, content: `${m.niche} - ${m.pattern}` })))}

        USER QUERY: "${searchTerm}"

        TASK:
        Analyze the meaning of the query and find relevant items in the dataset.
        Even if keywords don't match, match the INTENT (e.g., "angry" matches "conflict" or "churn").
        
        OUTPUT:
        Return ONLY a JSON array of strings containing the IDs of the relevant items.
        Example: ["id1", "id2"]
        If nothing is relevant, return [].
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-latest',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
           responseMimeType: "application/json" 
        }
      });
      
      const responseText = response.text || "[]";
      const relevantIds = JSON.parse(responseText);
      
      const results = memories.filter(m => relevantIds.includes(m.id));
      setFilteredMemories(results);

    } catch (error) {
      console.error("Semantic Search Failed:", error);
      // Fallback to keyword
      setSearchMode('keyword');
    } finally {
      setIsSearchingAI(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'converted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Converted</span>;
      case 'lost':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">Lost</span>;
      case 'nurturing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">Nurturing</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-slate-300 border border-slate-600">New</span>;
    }
  };

  const getDbStatusConfig = (status: string) => {
    switch (status) {
      case 'connected':
        return { color: 'bg-emerald-950/50 border-emerald-900 text-emerald-400', icon: <Wifi size={10} /> };
      case 'syncing':
        return { color: 'bg-blue-950/50 border-blue-900 text-blue-400 animate-pulse', icon: <RefreshCw size={10} className="animate-spin" /> };
      case 'readonly':
        return { color: 'bg-amber-950/50 border-amber-900 text-amber-400', icon: <Lock size={10} /> };
      default:
        return { color: 'bg-red-950/50 border-red-900 text-red-400', icon: <WifiOff size={10} /> };
    }
  };

  const dbConfig = getDbStatusConfig(dbStatus);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Corporate Memory</h2>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${dbConfig.color} text-xs font-mono`}>
               {dbConfig.icon}
               <span className="uppercase">{dbStatus}</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <Database size={12} className="text-violet-500" />
            <span>Vector Store Uplink active.</span>
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto items-end">
           {/* API Key Input for Semantic Search */}
           <div className="flex items-center gap-2 bg-slate-900 rounded px-2 py-2 border border-slate-700 w-full sm:w-auto">
              <Key size={14} className="text-slate-500" />
              <input 
                type="password" 
                placeholder="API Key (For AI Search)" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-transparent text-xs text-slate-300 w-full sm:w-32 focus:outline-none placeholder-slate-600"
              />
           </div>

          <div className="relative group flex-1 md:w-64 w-full">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               {isSearchingAI ? (
                  <Zap className="h-4 w-4 text-violet-400 animate-pulse" />
               ) : (
                  <Search className="h-4 w-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
               )}
             </div>
             <input
               type="text"
               className={`
                  block w-full pl-10 pr-12 py-2 border rounded-lg leading-5 bg-slate-900/50 text-slate-200 placeholder-slate-500 focus:outline-none transition-all
                  ${searchMode === 'semantic' ? 'border-violet-500/50 ring-1 ring-violet-500/20' : 'border-slate-700 focus:border-violet-500'}
               `}
               placeholder="Search patterns (e.g. 'high budget')..."
               value={searchTerm}
               onChange={(e) => {
                 setSearchTerm(e.target.value);
                 if (e.target.value === '') {
                   setSearchMode('keyword'); // Reset to keyword on clear
                 }
               }}
               onKeyDown={(e) => e.key === 'Enter' && handleSemanticSearch()}
             />
             <button 
                onClick={handleSemanticSearch}
                className="absolute right-1 top-1 bottom-1 px-2 bg-slate-800 hover:bg-violet-600 text-slate-400 hover:text-white rounded text-xs font-bold transition-all"
                title="Run Semantic Search"
             >
                AI
             </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      {searchMode === 'semantic' && (
        <div className="bg-violet-900/10 border border-violet-500/20 rounded-lg p-3 flex items-center gap-2 animate-fade-in">
           <Sparkles size={14} className="text-violet-400" />
           <span className="text-xs text-violet-200">
             Semantic filtering active. Showing results conceptually related to <span className="font-bold">"{searchTerm}"</span>.
           </span>
           <button 
             onClick={() => { setSearchTerm(''); setSearchMode('keyword'); }}
             className="ml-auto text-xs text-slate-500 hover:text-white underline"
           >
             Clear
           </button>
        </div>
      )}

      {/* Main Data Table */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500 opacity-20"></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">ID Hash</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Niche / Persona</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Pattern Learned</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">MQL Score</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading || isSearchingAI ? (
                [1,2,3,4].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-48 bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-800 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredMemories.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                     <div className="flex flex-col items-center gap-2">
                       <Search size={24} className="opacity-20" />
                       <p>No memory traces found.</p>
                     </div>
                   </td>
                 </tr>
              ) : filteredMemories.map((mem) => (
                <tr key={mem.id} className="group hover:bg-slate-800/40 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-violet-400 group-hover:text-violet-300">#{mem.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-200">{mem.niche}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-400 truncate max-w-xs group-hover:text-slate-300">{mem.pattern}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`text-sm font-bold w-8 text-right ${
                        mem.score >= 80 ? 'text-emerald-400' : mem.score >= 50 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {mem.score}
                      </div>
                      {/* Mini Progress Bar */}
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            mem.score >= 80 ? 'bg-emerald-500' : mem.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${mem.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {getStatusBadge(mem.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer / Pagination Placeholder */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/30 flex justify-between items-center text-xs text-slate-500 font-mono">
           <span>Showing {filteredMemories.length} records</span>
           <div className="flex gap-2">
             <span className="cursor-pointer hover:text-slate-300">PREV</span>
             <span className="text-slate-700">|</span>
             <span className="cursor-pointer hover:text-slate-300">NEXT</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryBank;