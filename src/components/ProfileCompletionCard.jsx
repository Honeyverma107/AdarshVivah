import React from 'react';
import { ShieldCheck, PlusCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfileCompletionCard = ({ completionPercentage = 85 }) => {
  const missingSuggestions = [
    { title: "Upload Horoscope / Guna Match PDF", score: "+5%" },
    { title: "Add Partner Location Preferences", score: "+5%" },
    { title: "Verify Government ID (Aadhaar/Passport)", score: "+5%" }
  ];

  return (
    <div className="bg-gradient-to-br from-rose-50 to-white rounded-2xl border border-rose-200/80 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-maroon-700 uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-rose-200">
            Profile Strength
          </span>
          <h3 className="text-lg font-bold text-dark-800 mt-2">
            Your Profile is {completionPercentage}% Complete
          </h3>
        </div>
        <div className="relative w-14 h-14 flex items-center justify-center bg-white rounded-full border-2 border-maroon-600 font-bold text-maroon-700 shadow-sm text-sm">
          {completionPercentage}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-rose-200/60 h-2.5 rounded-full overflow-hidden mb-5">
        <div 
          className="bg-gradient-to-r from-maroon-600 to-gold-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <p className="text-xs text-muted-500 mb-3 font-medium">
        Complete these suggestions to get 3x higher response rates from compatible families:
      </p>

      <div className="space-y-2 mb-4">
        {missingSuggestions.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs bg-white/80 p-2.5 rounded-xl border border-rose-100">
            <span className="flex items-center gap-2 text-dark-800 font-medium">
              <PlusCircle className="w-3.5 h-3.5 text-maroon-600" />
              {item.title}
            </span>
            <span className="font-bold text-gold-600">{item.score}</span>
          </div>
        ))}
      </div>

      <Link
        to="/dashboard/edit-profile"
        className="inline-flex items-center justify-center w-full py-2.5 text-xs font-semibold text-white bg-maroon-600 hover:bg-maroon-700 rounded-xl transition-all shadow-sm"
      >
        Complete My Profile Now
      </Link>
    </div>
  );
};
export default ProfileCompletionCard;
