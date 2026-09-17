import React from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import ProfileCard from '../../components/ProfileCard';
import { MOCK_PROFILES } from '../../data/profiles';
import { Sparkles } from 'lucide-react';

export const RecommendedMatches = () => {
  // Sort by compatibility score
  const recommended = [...MOCK_PROFILES].sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0));

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Smart Match Recommendations" 
        subtitle="Profiles calculated with high compatibility scores (85%+ preference fit) matching your criteria."
      />

      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 flex items-center gap-3 text-xs text-amber-900 font-medium">
        <Sparkles className="w-5 h-5 text-gold-500 fill-gold-400 shrink-0" />
        <span>
          Demo Feature: Recommendations are scored against your registered Brahmin, Tech Professional, and North Indian family preferences.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommended.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
};
export default RecommendedMatches;
