import React from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import InterestStatusBadge from '../../components/InterestStatusBadge';
import Button from '../../components/Button';
import { MOCK_SENT_INTERESTS } from '../../data/interests';
import { Send, Eye } from 'lucide-react';

export const SentInterests = () => {
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Sent Interests" 
        subtitle="Track the status of express interest connection requests sent by you or your family."
      />

      <div className="space-y-4">
        {MOCK_SENT_INTERESTS.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <img
                src={item.profilePhoto}
                alt={item.profileName}
                className="w-16 h-16 rounded-full object-cover border-2 border-gold-400 shrink-0"
              />
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-base text-dark-800">{item.profileName}</h4>
                  <InterestStatusBadge status={item.status} />
                </div>
                <p className="text-muted-500 font-medium">
                  {item.age} Yrs • {item.profession} • {item.location}
                </p>
                <p className="text-muted-400 text-[11px] italic">
                  Sent on {item.dateSent} • Message: "{item.message}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
              <Link to={`/profiles/${item.profileId}`}>
                <Button variant="secondary" size="sm" icon={Eye}>
                  View Profile
                </Button>
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
export default SentInterests;
