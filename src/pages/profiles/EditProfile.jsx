import React, { useState } from 'react';
import { CURRENT_USER } from '../../data/profiles';
import { Save, ShieldCheck, CheckCircle2, User, Briefcase, Home, Heart } from 'lucide-react';
import Button from '../../components/Button';
import DashboardHeader from '../../components/DashboardHeader';

export const EditProfile = () => {
  const [user, setUser] = useState({ ...CURRENT_USER });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Edit My Matrimonial Profile" 
        subtitle="Keep your profile details up-to-date to get maximum preference match accuracy."
      />

      {saved && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully! Your updated biodata is now live.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-rose-200 p-6 md:p-8 shadow-xs space-y-8">
        
        {/* Section 1: Basic & Personal */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
            <User className="w-5 h-5 text-maroon-600" /> Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">Full Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">Current City / State</label>
              <input
                type="text"
                value={user.location}
                onChange={(e) => setUser({ ...user, location: e.target.value })}
                className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-800 mb-1">About Me (Bio)</label>
            <textarea
              rows="3"
              value={user.about}
              onChange={(e) => setUser({ ...user, about: e.target.value })}
              className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* Section 2: Education & Career */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-maroon-600" /> Education & Career
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">Highest Degree</label>
              <input
                type="text"
                value={user.education}
                onChange={(e) => setUser({ ...user, education: e.target.value })}
                className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-800 mb-1">Profession / Role</label>
              <input
                type="text"
                value={user.profession}
                onChange={(e) => setUser({ ...user, profession: e.target.value })}
                className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-rose-100 flex justify-end">
          <Button type="submit" variant="primary" size="md" icon={Save}>
            Save & Update Profile
          </Button>
        </div>

      </form>
    </div>
  );
};
export default EditProfile;
