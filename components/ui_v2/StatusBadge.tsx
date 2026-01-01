import React from 'react';
import { CompanyStatus, AgentStatus } from './types';

interface StatusBadgeProps {
  status: CompanyStatus | AgentStatus | string;
  type?: 'company' | 'agent' | 'risk';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'company' }) => {
  let colorClass = 'bg-slate-100 text-slate-600';

  if (type === 'company') {
    switch (status) {
      case CompanyStatus.ACTIVE:
        colorClass = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
        break;
      case CompanyStatus.LEAD:
        colorClass = 'bg-blue-100 text-blue-800 border border-blue-200';
        break;
      case CompanyStatus.PAUSED:
        colorClass = 'bg-amber-100 text-amber-800 border border-amber-200';
        break;
      case CompanyStatus.CHURN:
        colorClass = 'bg-red-100 text-red-800 border border-red-200';
        break;
    }
  } else if (type === 'agent') {
    switch (status) {
      case AgentStatus.ACTIVE:
        colorClass = 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200';
        break;
      case AgentStatus.NOT_DEPLOYED:
        colorClass = 'bg-slate-200 text-slate-600 border border-slate-300';
        break;
      case AgentStatus.DEPLOYING:
        colorClass = 'bg-indigo-100 text-indigo-800 animate-pulse border border-indigo-200';
        break;
      case AgentStatus.RISK_MODE:
        colorClass = 'bg-red-100 text-red-800 font-bold border border-red-200';
        break;
    }
  } else if (type === 'risk') {
    if (status === 'HIGH') colorClass = 'bg-red-100 text-red-800 border border-red-200';
    if (status === 'MEDIUM') colorClass = 'bg-amber-100 text-amber-800 border border-amber-200';
    if (status === 'LOW') colorClass = 'bg-slate-100 text-slate-600 border border-slate-200';
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
};