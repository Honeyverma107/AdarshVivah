import React, { useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import Button from '../../components/Button';
import { Lock, EyeOff, ShieldCheck, Bell, Save, CheckCircle2 } from 'lucide-react';

export const AccountSettings = () => {
  const [privacy, setPrivacy] = useState({
    hideContactInfo: true,
    photosVisibleToAcceptedOnly: false,
    hideProfileFromSearch: false,
    allowFamilyAssist: true,
    emailNotifications: true,
    smsAlerts: true
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Account Settings & Privacy Controls" 
        subtitle="Manage contact visibility, photo controls, and notification preferences."
      />

      {saved && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Privacy & Security settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Privacy Toggles Card */}
        <div className="bg-white rounded-3xl border border-rose-200 p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-maroon-600" /> Profile Privacy Controls
          </h3>

          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 bg-cream-50 rounded-2xl border border-rose-100">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-dark-800">Hide Contact Information</h4>
                <p className="text-[11px] text-muted-500">
                  Only show phone number and email after you explicitly accept an interest proposal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('hideContactInfo')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  privacy.hideContactInfo ? 'bg-maroon-600 justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-cream-50 rounded-2xl border border-rose-100">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-dark-800">Photos Visible to Accepted Connections Only</h4>
                <p className="text-[11px] text-muted-500">
                  Blur profile photos for public browsers until connection request is accepted.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('photosVisibleToAcceptedOnly')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  privacy.photosVisibleToAcceptedOnly ? 'bg-maroon-600 justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-cream-50 rounded-2xl border border-rose-100">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-dark-800">Hide Profile from Public Search</h4>
                <p className="text-[11px] text-muted-500">
                  Temporarily pause profile visibility on public search results.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('hideProfileFromSearch')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  privacy.hideProfileFromSearch ? 'bg-maroon-600 justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-3xl border border-rose-200 p-6 md:p-8 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-gold-600" /> Match Alert Notifications
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                className="w-4 h-4 text-maroon-600 rounded border-rose-300 focus:ring-maroon-600"
              />
              <span className="font-medium text-dark-800">Email alerts for new match proposals and interests</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.smsAlerts}
                onChange={() => handleToggle('smsAlerts')}
                className="w-4 h-4 text-maroon-600 rounded border-rose-300 focus:ring-maroon-600"
              />
              <span className="font-medium text-dark-800">SMS updates for accepted proposal contact unlocks</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" icon={Save}>
            Save Settings
          </Button>
        </div>

      </form>
    </div>
  );
};
export default AccountSettings;
