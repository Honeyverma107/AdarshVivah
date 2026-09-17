import React, { useState } from 'react';
import { MOCK_ADMIN_STATS, MOCK_PENDING_PROFILES, MOCK_REPORTED_PROFILES } from '../../data/adminData';
import { Users, ShieldCheck, CheckSquare, AlertTriangle, ArrowUpRight, Check, X, Eye } from 'lucide-react';
import StatCard from '../../components/StatCard';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [pendingList, setPendingList] = useState(MOCK_PENDING_PROFILES);

  const handleApprove = (id) => {
    setPendingList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReject = (id) => {
    setPendingList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-white">AdarshVivah Admin Console Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Platform metric monitor and profile verification workflow demo.</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-full">
          System Operational • 100% Verification Active
        </span>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Registered Users</p>
          <h3 className="text-2xl font-bold text-white mt-1">{MOCK_ADMIN_STATS.totalRegisteredUsers.toLocaleString()}</h3>
          <p className="text-xs text-emerald-400 font-medium mt-1">{MOCK_ADMIN_STATS.thisMonthGrowth} this month</p>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
          <p className="text-xs text-amber-400 font-semibold uppercase">Pending Approvals</p>
          <h3 className="text-2xl font-bold text-white mt-1">{pendingList.length}</h3>
          <p className="text-xs text-slate-400 mt-1">Requires document verification</p>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
          <p className="text-xs text-emerald-400 font-semibold uppercase">Verified Profiles</p>
          <h3 className="text-2xl font-bold text-white mt-1">{MOCK_ADMIN_STATS.verifiedProfiles.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-1">Government ID checked</p>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
          <p className="text-xs text-rose-400 font-semibold uppercase">Reported Profiles</p>
          <h3 className="text-2xl font-bold text-white mt-1">{MOCK_ADMIN_STATS.reportedProfiles}</h3>
          <p className="text-xs text-slate-400 mt-1">Under moderation review</p>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-white">Pending Verification Approvals</h3>
            <p className="text-xs text-slate-400">Review submitted identity & qualification proofs before granting badges</p>
          </div>
          <Link to="/admin/approvals" className="text-xs text-gold-400 font-bold hover:underline">
            View All Pending ({pendingList.length})
          </Link>
        </div>

        {pendingList.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">All pending profiles have been reviewed!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Requested Verification</th>
                  <th className="p-3">Documents Submitted</th>
                  <th className="p-3">Date Submitted</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {pendingList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30">
                    <td className="p-3 flex items-center gap-3">
                      <img src={user.photo} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-600" />
                      <div>
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-[10px] text-slate-400">{user.age} Yrs • {user.profession} ({user.city})</p>
                      </div>
                    </td>
                    <td className="p-3 text-gold-400 font-medium">{user.verificationRequested}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {user.docsSubmitted.map((doc, idx) => (
                          <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700">
                            📄 {doc}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-slate-400">{user.submittedDate}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
export default AdminDashboard;
