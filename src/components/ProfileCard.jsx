import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, GraduationCap, Briefcase, Sparkles, Send, CheckCircle2, User, Loader2 } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';
import CompatibilityBadge from './CompatibilityBadge';
import Button from './Button';
import { sendInterest } from '../api/chatApi';
import profileApi from '../api/profileApi';

export const ProfileCard = ({ profile, onShortlistToggle, onSendInterest }) => {
  const [isShortlisted, setIsShortlisted] = useState(profile.shortlisted || false);
  const [interestStatus, setInterestStatus] = useState(profile.interestStatus || 'none');
  const [imgError, setImgError] = useState(false);
  const [sending, setSending] = useState(false);

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const prevVal = isShortlisted;
    setIsShortlisted(!prevVal);
    try {
      const res = await profileApi.toggleShortlist(profile.id);
      if (res.data && typeof res.data.shortlisted === 'boolean') {
        setIsShortlisted(res.data.shortlisted);
      }
      if (onShortlistToggle) onShortlistToggle(profile.id, !prevVal);
    } catch (err) {
      console.error('Failed to toggle shortlist:', err);
      setIsShortlisted(prevVal);
    }
  };

  const handleSendInterestClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (interestStatus === 'sent' || interestStatus === 'accepted' || sending) return;

    const targetUserId = profile.user_id || (typeof profile.user === 'object' ? profile.user?.id : (profile.user ? Number(profile.user) : profile.id));
    if (!targetUserId || isNaN(Number(targetUserId)) || Number(targetUserId) <= 0) {
      console.warn('Cannot send interest: Target user ID is missing.');
      return;
    }

    setSending(true);
    try {
      const data = await sendInterest(Number(targetUserId));
      const newStatus = data.status === 'ACCEPTED' ? 'accepted' : 'sent';
      setInterestStatus(newStatus);
      if (onSendInterest) {
        onSendInterest(profile.id, data);
      }
    } catch (err) {
      console.error('Failed to send interest:', err);
      const msg = err.response?.data?.detail || 'Failed to send interest request.';
      alert(msg);
    } finally {
      setSending(false);
    }
  };

  const hasPhoto = Boolean(profile.photo && profile.photo.trim() && !imgError);

  return (
    <div className="group bg-white rounded-2xl border border-rose-100/90 hover:border-gold-400/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top Image Section */}
      <div className="relative h-64 w-full overflow-hidden bg-cream-100 flex items-center justify-center">
        {hasPhoto ? (
          <>
            <img 
              src={profile.photo} 
              alt={profile.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-100/70 via-cream-100 to-amber-100/70 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-20 h-20 rounded-full bg-white/90 border-2 border-rose-200 flex items-center justify-center text-maroon-700 shadow-xs mb-2">
              <User className="w-10 h-10 stroke-[1.5]" />
            </div>
            <span className="text-xs font-serif font-bold text-dark-800">
              {profile.name}
            </span>
            <span className="text-[10px] text-muted-500 mt-0.5">
              No Photo Uploaded
            </span>
          </div>
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {(profile.verified || profile.is_verified) && <VerifiedBadge text="Verified" size="xs" />}
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
            {profile.age} Yrs • {profile.height || profile.height_feet_inches || "5' 8\""}
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
            {profile.community || profile.caste || 'General'} • {profile.motherTongue || profile.mother_tongue || 'Hindi'}
          </p>

          <div className="space-y-1.5 text-xs text-muted-600 mb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="truncate">
                {typeof profile.profession === 'string' ? profile.profession : profile.professional?.occupation || 'Professional'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="truncate">
                {typeof profile.education === 'string' ? profile.education : profile.educationDetails || profile.education?.degree || 'Graduate'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span className="truncate">
                {profile.location || `${profile.city || ''}, ${profile.state || ''}`}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-500 line-clamp-2 leading-relaxed italic bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/60">
            "{typeof profile.about === 'string' ? profile.about : profile.bio || ''}"
          </p>

          {/* Differentiating Feature: Why this match? */}
          {((profile.whyMatch && profile.whyMatch.length > 0) || (profile.compatibilityFactors && profile.compatibilityFactors.length > 0)) && (
            <div className="mt-3 pt-2.5 border-t border-rose-100">
              <p className="text-[11px] font-semibold text-gold-600 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-gold-500" />
                Why this match?
              </p>
              <p className="text-[11px] text-dark-700 font-medium">
                • {profile.whyMatch ? profile.whyMatch[0] : profile.compatibilityFactors[0]}
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
            disabled={interestStatus === 'sent' || interestStatus === 'accepted' || sending}
            className="flex-1"
          >
            {sending ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...
              </span>
            ) : interestStatus === 'sent' ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Interest Sent
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
