"use client";

import Link from 'next/link';
import React from 'react'; // Added React import
import { usePathname } from 'next/navigation';
import { APP_NAME, NAV_ITEMS } from './constants';
import { LogOut, Lock } from 'lucide-react';
import { AiChatbot } from './AiChatbot';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-2">
          <Lock className="text-emerald-500" size={20} />
          <h1 className="text-xl font-bold text-white tracking-tight">{APP_NAME}</h1>
        </div>

        <div className="px-6 py-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Painel Operacional</div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-slate-800 text-white border-l-4 border-emerald-500'
                  : 'hover:bg-slate-800 hover:text-white'
                  }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center space-x-3 text-slate-400 hover:text-white w-full px-4 py-2 transition-colors">
            <LogOut size={20} />
            <span>Sair (Admin)</span>
          </button>
          <div className="mt-4 text-xs text-slate-600 text-center">
            v1.0.4 • Internal Only
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-y-auto bg-slate-50 relative">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
        <AiChatbot />
      </main>
    </div>
  );
};