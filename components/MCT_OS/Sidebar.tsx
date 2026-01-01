import React from 'react';
import { LayoutDashboard, Users, Database, Zap, Activity } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'agents', label: 'Agent Grid', icon: Users },
    { id: 'memory', label: 'Corp Memory', icon: Database },
    { id: 'antigravity', label: 'Antigravity', icon: Activity },
  ];

  return (
    <div className="w-20 lg:w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
        <Zap className="w-8 h-8 text-brand-cyber" />
        <span className="hidden lg:block ml-3 font-bold text-xl tracking-wider text-slate-100">
          MCT<span className="text-brand-cyber">OS</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                relative flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
              `}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-blue-400' : 'group-hover:text-slate-200'}`} />
              <span className="hidden lg:block ml-3 font-medium">{item.label}</span>
              {isActive && (
                <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_currentColor]"></div>
              )}

              {/* Tooltip for Collapsed State (Visible only on small screens < lg) */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none lg:hidden whitespace-nowrap z-50 shadow-xl">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 transform rotate-45"></div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* System Status Indicator */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 group relative">
          <div className="flex items-center gap-3 mb-2 justify-center lg:justify-start">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-3 h-3 bg-emerald-500 rounded-full opacity-50 animate-ping"></div>
            </div>
            <span className="hidden lg:block text-xs font-mono text-emerald-400 uppercase tracking-widest">System Online</span>
          </div>
          <div className="hidden lg:block text-xs text-slate-500 truncate">
            Orchestrator v2.4.1
          </div>

          {/* Tooltip for Status */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-slate-800 text-emerald-400 text-xs rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none lg:hidden whitespace-nowrap z-50 shadow-xl">
            SYSTEM ONLINE
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 transform rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;