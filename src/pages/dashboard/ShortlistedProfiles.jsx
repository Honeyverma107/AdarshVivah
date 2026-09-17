import React, { useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import ProfileCard from '../../components/ProfileCard';
import EmptyState from '../../components/EmptyState';
import { MOCK_PROFILES } from '../../data/profiles';
import { Heart } from 'lucide-react';

export const ShortlistedProfiles = () => {
  const [shortlistedList, setShortlistedList] = useState(
    MOCK_PROFILES.filter((p) => p.shortlisted)
  );

  const handleRemoveShortlist = (profileId) => {
    setShortlistedList((prev) => prev.filter((p) => p.id !== profileId));
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="My Shortlisted Profiles" 
        subtitle="Profiles you saved for discussion with your family members."
      />

      {shortlistedList.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Shortlisted Profiles Yet"
          description="Click the heart icon on any profile card while browsing to save them here for easy family review."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {shortlistedList.map((profile) => (
            <ProfileCard 
              key={profile.id} 
              profile={{ ...profile, shortlisted: true }} 
              onShortlistToggle={() => handleRemoveShortlist(profile.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default ShortlistedProfiles;
