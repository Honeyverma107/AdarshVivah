import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, GraduationCap, Briefcase, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';
import CompatibilityBadge from './CompatibilityBadge';
import Button from './Button';

export const ProfileCard = ({ profile, onShortlistToggle, onSendInterest }) => {
  const [isShortlisted, setIsShortlisted] = useState(profile.shortlisted || false);
  const [interestStatus, setInterestStatus] = useState(profile.interestStatus || 'none');

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShortlisted(!isShortlisted);
    if (onShortlistToggle) onShortlistToggle(profile.id, !isShortlisted);
  };

  const handleSendInterestClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (interestStatus === 'none') {
      setInterestStatus('sent');
      if (onSendInterest) onSendInterest(profile.id);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-rose-100/90 hover:border-gold-400/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top Image Section */}
      <div className="relative h-64 w-full overflow-hidden bg-cream-100">
        <img 
          src={profile.photo} 
          alt={profile.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = profile.gender === 'Female' 
              ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent" />
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {profile.verified && <VerifiedBadge text="Verified" size="xs" />}
        </div>

        {/* Shortlist Heart Button */}
        <button
          onClick={handleHeartClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isShortlisted 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-dark-900/40 text-white hover:bg-rose-500 hover:text-white'
          }`}
          title={isShortlisted ? "Remove from Shortlist" : "Shortlist Profile"}
        >
          <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Compatibility Score Overlay */}
        {profile.compatibilityScore && (
          <div className="absolute bottom-3 left-3 z-10">
            <CompatibilityBadge score={profile.compatibilityScore} size="sm" showLabel={false} />
          </div>
        )}

        {/* Name & Basic info overlaid at bottom of image */}
        <div className="absolute bottom-3 right-3 z-10 text-right">
          <span className="text-white text-xs font-semibold px-2.5 py-0.5 rounded-full bg-dark-900/60 backdrop-blur-xs border border-white/20">
            {profile.age} Yrs • {profile.height}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <Link to={`/profiles/${profile.id}`} className="hover:text-maroon-600 transition-colors">
              <h3 className="font-serif font-bold text-lg text-dark-800 tracking-tight leading-snug">
                {profile.name}
              </h3>
            </Link>
          </div>

          <p className="text-xs font-medium text-maroon-700 mb-2">
            {profile.community} • {profile.motherTongue}
          </p>

          <div className="space-y-1.5 text-xs text-muted-600 mb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="truncate">{profile.profession}</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="truncate">{profile.education}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="truncate">{profile.location}</span>
            </div>
          </div>

          <p className="text-xs text-muted-500 line-clamp-2 leading-relaxed italic bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/60">
            "{profile.about}"
          </p>

          {/* Differentiating Feature: Why this match? */}
          {profile.compatibilityFactors && profile.compatibilityFactors.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-rose-100">
              <p className="text-[11px] font-semibold text-gold-600 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-gold-500" />
                Why this match?
              </p>
              <p className="text-[11px] text-dark-700 font-medium">
                • {profile.compatibilityFactors[0]}
              </p>
            </div>
          )}
        </div>

        {/* Card Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <Link to={`/profiles/${profile.id}`} className="flex-1">
            <Button variant="secondary" size="sm" fullWidth>
              View Profile
            </Button>
          </Link>

          <Button
            variant={interestStatus === 'sent' ? 'ghost' : interestStatus === 'accepted' ? 'gold' : 'primary'}
            size="sm"
            onClick={handleSendInterestClick}
            disabled={interestStatus === 'sent' || interestStatus === 'accepted'}
            className="flex-1"
          >
            {interestStatus === 'sent' ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sent
              </span>
            ) : interestStatus === 'accepted' ? (
              <span>Connected</span>
            ) : (
              <span className="flex items-center gap-1">
                <Send className="w-3.5 h-3.5" /> Express Interest
              </span>
            )}
          </Button>
        </div>

      </div>

    </div>
  );
};
export default ProfileCard;
