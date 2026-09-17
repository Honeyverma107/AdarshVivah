import React from 'react';
import { Bell, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { CURRENT_USER } from '../data/profiles';

export const DashboardHeader = ({ title = "Dashboard Overview", subtitle }) => {
  return (
    <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-serif font-bold text-dark-800 tracking-tight">{title}</h1>
          <span className="bg-rose-100 text-maroon-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-rose-200">
            Premium Member
          </span>
        </div>
        <p className="text-xs text-muted-500 mt-1">
          {subtitle || `Welcome back, ${CURRENT_USER.name}! Here is your personalized matchmaking update.`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button className="p-2.5 rounded-xl bg-rose-50 text-maroon-700 border border-rose-100 hover:bg-rose-100 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-cream-50 px-3 py-1.5 rounded-xl border border-rose-100">
          <Sparkles className="w-4 h-4 text-gold-500" />
          <span className="text-xs font-semibold text-dark-800">Match Accuracy: 94%</span>
        </div>
      </div>
    </div>
  );
};
export default DashboardHeader;
