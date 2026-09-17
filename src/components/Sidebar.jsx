import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Sparkles, 
  Search, 
  Inbox, 
  Send, 
  Heart, 
  Settings, 
  LogOut,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { CURRENT_USER } from '../data/profiles';

export const Sidebar = ({ onLogout, onOpenBiodata }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/dashboard/my-profile', icon: User },
    { name: 'Recommended Matches', path: '/dashboard/recommended', icon: Sparkles, badge: '90%+ Match' },
    { name: 'Browse Profiles', path: '/profiles', icon: Search },
    { name: 'Received Interests', path: '/dashboard/received-interests', icon: Inbox, count: 2 },
    { name: 'Sent Interests', path: '/dashboard/sent-interests', icon: Send },
    { name: 'Shortlisted Profiles', path: '/dashboard/shortlisted', icon: Heart },
    { name: 'Account Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-full lg:w-64 bg-white border border-rose-100/80 rounded-2xl p-4 shadow-xs space-y-6 shrink-0">
      
      {/* Mini User Card */}
      <div className="p-3 bg-gradient-to-br from-rose-50 to-white rounded-xl border border-rose-200/80 flex items-center gap-3">
        <img
          src={CURRENT_USER.photo}
          alt={CURRENT_USER.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-gold-400 shrink-0"
        />
        <div className="min-w-0">
          <h4 className="font-bold text-dark-800 text-sm truncate">{CURRENT_USER.name}</h4>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Profile Verified
          </span>
          <p className="text-[10px] text-muted-500 mt-0.5">{CURRENT_USER.id}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                active
                  ? 'bg-maroon-600 text-white shadow-xs font-semibold'
                  : 'text-dark-700 hover:bg-rose-50 hover:text-maroon-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gold-600'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? 'bg-gold-500 text-dark-900' : 'bg-gold-100 text-gold-700'}`}>
                  {item.badge}
                </span>
              )}
              {item.count && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? 'bg-white text-maroon-700' : 'bg-rose-100 text-maroon-700'}`}>
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Unique Feature: Matrimonial Biodata Button */}
      <div className="pt-2 border-t border-rose-100">
        <button
          onClick={onOpenBiodata}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold transition-all shadow-xs"
        >
          <FileText className="w-4 h-4 text-gold-600" />
          <span>Generate Biodata PDF</span>
        </button>
      </div>

      {/* Logout Action */}
      <div className="pt-2 border-t border-rose-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Log Out</span>
        </button>
      </div>

    </aside>
  );
};
export default Sidebar;
