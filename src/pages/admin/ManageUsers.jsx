import React, { useState } from 'react';
import { MOCK_PROFILES } from '../../data/profiles';
import { Search, ShieldCheck, User, Mail, Phone, Lock, Unlock } from 'lucide-react';

export const ManageUsers = () => {
  const [userList, setUserList] = useState(
    MOCK_PROFILES.map((p, idx) => ({
      id: `usr-00${idx + 1}`,
      name: p.name,
      email: `${p.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: `+91 98765 ${10000 + idx * 23}`,
      status: 'Active',
      role: idx % 3 === 0 ? 'Parent Managed' : 'Self Registered',
      photo: p.photo
    }))
  );

  const [search, setSearch] = useState('');

  const toggleStatus = (id) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      )
    );
  };

  const filtered = userList.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Registered Account Directory</h2>
          <p className="text-xs text-slate-400 mt-1">Manage platform accounts, parent sub-users, and access security.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search accounts..."
            className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3">User Account</th>
                <th className="p-3">Contact Details</th>
                <th className="p-3">Account Mode</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30">
                  <td className="p-3 flex items-center gap-3">
                    <img src={user.photo} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-slate-600" />
                    <div>
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400">{user.id}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-slate-200">{user.email}</p>
                    <p className="text-[10px] text-slate-400">{user.phone}</p>
                  </td>
                  <td className="p-3 text-gold-400 font-medium">{user.role}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      user.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        user.status === 'Active' ? 'bg-rose-900/60 text-rose-200 hover:bg-rose-800' : 'bg-emerald-700 text-white hover:bg-emerald-600'
                      }`}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ManageUsers;
