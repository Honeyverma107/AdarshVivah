import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, CheckCircle2, XCircle, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import profileApi from '../../api/profileApi';

export const ManageProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    profileApi.getProfiles()
      .then((res) => {
        setProfiles(Array.isArray(res.data) ? res.data : res.data.results || []);
      })
      .catch((err) => console.error('Error fetching admin profiles:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = profiles.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (typeof p.profession === 'string' ? p.profession : p.professional?.occupation || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.location || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Manage Platform Profiles</h2>
          <p className="text-xs text-slate-400 mt-1">Directory of all public and active matrimonial profiles on AdarshVivah</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search profiles..."
            className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3">Profile</th>
                <th className="p-3">Religion & Caste</th>
                <th className="p-3">Profession & Income</th>
                <th className="p-3">Verification Badge</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filtered.map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-700/30">
                  <td className="p-3 flex items-center gap-3">
                    <img src={profile.photo} alt={profile.name} className="w-9 h-9 rounded-full object-cover border border-slate-600" />
                    <div>
                      <p className="font-bold text-white">{profile.name}</p>
                      <p className="text-[10px] text-slate-400">{profile.age} Yrs • {profile.location}</p>
                    </div>
                  </td>
                  <td className="p-3">{profile.religion} ({profile.community})</td>
                  <td className="p-3">
                    <p className="text-white font-medium">{profile.profession}</p>
                    <p className="text-[10px] text-slate-400">{profile.income}</p>
                  </td>
                  <td className="p-3">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      ✓ Verified
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Link to={`/profiles/${profile.id}`}>
                      <button className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="p-1.5 bg-rose-900/60 hover:bg-rose-700 text-rose-200 rounded-lg"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
export default ManageProfiles;
