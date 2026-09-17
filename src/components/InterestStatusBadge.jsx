import React from 'react';
import { Clock, CheckCircle2, XCircle, Send } from 'lucide-react';

export const InterestStatusBadge = ({ status = 'Pending' }) => {
  const configs = {
    Pending: {
      label: 'Interest Pending',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock
    },
    Accepted: {
      label: 'Interest Accepted',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2
    },
    Declined: {
      label: 'Declined',
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: XCircle
    },
    Sent: {
      label: 'Interest Sent',
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      icon: Send
    }
  };

  const config = configs[status] || configs.Pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};
export default InterestStatusBadge;
