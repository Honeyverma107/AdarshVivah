import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import ProfileCard from '../../components/ProfileCard';
import profileApi from '../../api/profileApi';
import { Sparkles } from 'lucide-react';

export const RecommendedMatches = () => {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileApi.getProfiles()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        const sorted = [...data].sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));
        setRecommended(sorted);
      })
      .catch((err) => console.error('Error loading recommendations:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Smart Match Recommendations" 
        subtitle="Profiles calculated with high compatibility scores matching your partner criteria."
      />

      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 flex items-center gap-3 text-xs text-amber-900 font-medium">
        <Sparkles className="w-5 h-5 text-gold-500 fill-gold-400 shrink-0" />
        <span>
          Matches are dynamically scored by our backend matching engine using your partner preferences, education, lifestyle, and location.
        </span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-500 text-xs font-medium">Loading smart recommendations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recommended && recommended.length > 0 ? (
            recommended.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-500 text-xs font-medium bg-white rounded-2xl border border-rose-100">
              No recommended profiles found matching your preferences yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default RecommendedMatches;
