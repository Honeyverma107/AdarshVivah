import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import InterestStatusBadge from '../../components/InterestStatusBadge';
import CompatibilityBadge from '../../components/CompatibilityBadge';
import Button from '../../components/Button';
import { MOCK_RECEIVED_INTERESTS } from '../../data/interests';
import { CheckCircle2, XCircle, Eye, Inbox } from 'lucide-react';

export const ReceivedInterests = () => {
  const [receivedList, setReceivedList] = useState(MOCK_RECEIVED_INTERESTS);

  const handleAction = (id, newStatus) => {
    setReceivedList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Received Interests" 
        subtitle="Review proposal interest requests sent to your profile by prospective partners."
      />

      <div className="space-y-4">
        {receivedList.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              <img
                src={item.profilePhoto}
                alt={item.profileName}
                className="w-16 h-16 rounded-full object-cover border-2 border-gold-400 shrink-0"
              />
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif font-bold text-lg text-dark-800">{item.profileName}</h4>
                  <CompatibilityBadge score={item.compatibilityScore} size="sm" showLabel={false} />
                  <InterestStatusBadge status={item.status} />
                </div>
                <p className="text-muted-600 font-medium">
                  {item.age} Yrs • {item.profession} • {item.location}
                </p>
                <p className="text-dark-700 bg-cream-50 p-2.5 rounded-xl border border-rose-100/80 italic">
                  "{item.message}"
                </p>
                <p className="text-muted-400 text-[10px]">Received on {item.dateReceived}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
              <Link to={`/profiles/${item.profileId}`}>
                <Button variant="secondary" size="sm" icon={Eye}>
                  View Profile
                </Button>
              </Link>

              {item.status === 'Pending' ? (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle2}
                    onClick={() => handleAction(item.id, 'Accepted')}
                  >
                    Accept Proposal
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-700 hover:bg-rose-50"
                    onClick={() => handleAction(item.id, 'Declined')}
                  >
                    Decline
                  </Button>
                </>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  {item.status === 'Accepted' ? 'Proposal Accepted - Contact Unlocked' : 'Proposal Declined'}
                </span>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
export default ReceivedInterests;
