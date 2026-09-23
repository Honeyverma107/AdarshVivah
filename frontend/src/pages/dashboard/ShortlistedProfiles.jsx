import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import ProfileCard from '../../components/ProfileCard';
import EmptyState from '../../components/EmptyState';
import profileApi from '../../api/profileApi';
import Button from '../../components/Button';
import { Heart, Search } from 'lucide-react';

export const ShortlistedProfiles = () => {
  const [myShortlist, setMyShortlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await profileApi.getShortlists();
      const items = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      const profiles = items
        .filter((item) => item.profile)
        .map((item) => ({ ...item.profile, shortlisted: true }));
      setMyShortlist(profiles);
    } catch (err) {
      console.error('Error fetching shortlist data:', err);
      setError('Unable to load shortlist data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShortlist = async (profileId) => {
    try {
      await profileApi.toggleShortlist(profileId);
      setMyShortlist((prev) => prev.filter((p) => p.id !== profileId));
    } catch (err) {
      console.error('Failed to remove shortlist:', err);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="My Shortlist" 
        subtitle="Profiles you saved for future review and discussion with your family."
      />

      {loading ? (
        <div className="py-16 text-center text-muted-500 text-xs font-medium">
          Loading shortlisted profiles...
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl text-center font-medium">
          {error}
        </div>
      ) : myShortlist.length === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={Heart}
            title="You haven't shortlisted any profiles yet."
            description="Click the heart icon on any profile card while browsing to save them here for easy family review."
            action={
              <Link to="/profiles">
                <Button variant="primary" size="md" icon={Search}>
                  Discover Profiles
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {myShortlist.map((profile) => (
            <ProfileCard 
              key={profile.id} 
              profile={profile} 
              onShortlistToggle={() => handleRemoveShortlist(profile.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShortlistedProfiles;
