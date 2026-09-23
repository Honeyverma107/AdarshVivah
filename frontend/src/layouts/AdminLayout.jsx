import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Users, CheckSquare, AlertTriangle, ArrowLeft, Heart, BarChart3 } from 'lucide-react';

export const AdminLayout = () => {
  const location = useLocation();

  const adminTabs = [
    { name: 'Admin Dashboard', path: '/admin', icon: BarChart3 },
    { name: 'Profile Approvals', path: '/admin/approvals', icon: CheckSquare, badge: '42 Pending' },
    { name: 'Manage Profiles', path: '/admin/profiles', icon: ShieldCheck },
    { name: 'User Directory', path: '/admin/users', icon: Users },
  ];

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gold-500 text-dark-900 flex items-center justify-center font-bold">
                <Heart className="w-4 h-4 fill-dark-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-lg text-white">AdarshVivah Admin</span>
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                    Demo Mode
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Matchmaking Platform Management Console</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Main App
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Admin Navigation Bar */}
      <div className="bg-slate-800/80 border-b border-slate-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab.path);
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? 'bg-maroon-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  {tab.badge && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

    </div>
  );
};
export default AdminLayout;
