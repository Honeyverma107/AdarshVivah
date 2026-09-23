import React from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';

export const VerifiedBadge = ({ text = "Verified Profile", size = "sm", className = "" }) => {
  return (
    <span 
      className={`inline-flex items-center gap-1 font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full ${
        size === 'xs' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs'
      } ${className}`}
      title="Identity & Credentials Verified by AdarshVivah Team"
    >
      <ShieldCheck className={size === 'xs' ? 'w-3 h-3 text-emerald-600' : size === 'lg' ? 'w-4 h-4 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
      <span>{text}</span>
    </span>
  );
};
export default VerifiedBadge;
