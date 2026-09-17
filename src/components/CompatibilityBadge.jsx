import React from 'react';
import { Sparkles } from 'lucide-react';

export const CompatibilityBadge = ({ score = 90, size = "md", showLabel = true }) => {
  const getBadgeStyle = (val) => {
    if (val >= 90) return 'bg-amber-50 text-amber-800 border-amber-300';
    if (val >= 80) return 'bg-rose-50 text-maroon-800 border-rose-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div 
      className={`inline-flex items-center gap-1.5 border rounded-full font-semibold shadow-xs ${getBadgeStyle(score)} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-3 py-1 text-xs'
      }`}
      title={`Demo compatibility recommendation based on partner preferences: ${score}% match`}
    >
      <Sparkles className="w-3.5 h-3.5 text-gold-500 fill-gold-400" />
      <span>{score}% Match</span>
      {showLabel && <span className="text-[10px] text-muted-500 font-normal">Preference Fit</span>}
    </div>
  );
};
export default CompatibilityBadge;
