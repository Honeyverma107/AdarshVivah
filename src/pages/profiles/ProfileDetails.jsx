import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Home, 
  Lock, 
  Flag,
  FileText,
  ArrowLeft,
  MessageSquare,
  Phone,
  Loader2,
  XCircle,
  Clock
} from 'lucide-react';
import Button from '../../components/Button';
import VerifiedBadge from '../../components/VerifiedBadge';
import CompatibilityBadge from '../../components/CompatibilityBadge';
import BiodataModal from '../../components/BiodataModal';
import profileApi from '../../api/profileApi';
import { 
  createConversation, 
  sendInterest, 
  getInterestStatus, 
  acceptInterest, 
  rejectInterest, 
  cancelInterest 
} from '../../api/chatApi';

export const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState('');
  const [imgError, setImgError] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isBiodataOpen, setIsBiodataOpen] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setImgError(false);
    profileApi.getProfileById(id)
      .then((res) => {
        setProfile(res.data);
        const photoUrl = res.data.photo || (Array.isArray(res.data.gallery) && res.data.gallery[0]) || '';
        setActivePhoto(photoUrl);
        setIsShortlisted(res.data.shortlisted || false);
      })
      .catch((err) => console.error('Error fetching profile detail:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const targetUserId = profile?.user_id || (typeof profile?.user === 'object' ? profile?.user?.id : (profile?.user ? Number(profile.user) : (profile?.id ? Number(profile.id) : undefined)));
  const isValidUserId = Boolean(targetUserId && !isNaN(Number(targetUserId)) && Number(targetUserId) > 0);

  // Dynamic Interest / Connection state from backend
  const [relStatus, setRelStatus] = useState({
    status: 'NONE', // 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
    interest_id: null,
    can_message: false,
    can_call: false,
    conversation_id: null
  });
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [interestError, setInterestError] = useState('');

  useEffect(() => {
    if (!isValidUserId) {
      setLoadingStatus(false);
      return;
    }
    fetchBackendStatus(Number(targetUserId));
  }, [targetUserId, isValidUserId]);

  const fetchBackendStatus = async (userId) => {
    if (!userId || isNaN(userId) || Number(userId) <= 0) {
      setLoadingStatus(false);
      return;
    }
    setLoadingStatus(true);
    try {
      const data = await getInterestStatus(userId);
      setRelStatus(data);
    } catch (err) {
      console.error('Failed to fetch interest status:', err);
      setRelStatus({
        status: 'NONE',
        interest_id: null,
        can_message: false,
        can_call: false,
        conversation_id: null
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleSendInterest = async () => {
    if (!isValidUserId) return;
    setActionLoading(true);
    setInterestError('');
    try {
      const data = await sendInterest(Number(targetUserId));
      if (data.status === 'ACCEPTED') {
        // Auto-accepted (if mutual)
        setRelStatus((prev) => ({
          ...prev,
          status: 'ACCEPTED',
          interest_id: data.id,
          can_message: true,
          can_call: true
        }));
      } else {
        setRelStatus((prev) => ({
          ...prev,
          status: 'PENDING_SENT',
          interest_id: data.id
        }));
      }
    } catch (err) {
      console.error('Failed to send interest:', err);
      const msg = err.response?.data?.detail || err.message || 'Failed to send interest request.';
      setInterestError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptInterest = async () => {
    if (!relStatus.interest_id) return;
    setActionLoading(true);
    try {
      const res = await acceptInterest(relStatus.interest_id);
      setRelStatus({
        status: 'ACCEPTED',
        interest_id: res.id,
        can_message: true,
        can_call: true,
        conversation_id: res.conversation_id
      });
    } catch (err) {
      console.error('Failed to accept interest:', err);
      alert(err.response?.data?.detail || 'Failed to accept interest.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectInterest = async () => {
    if (!relStatus.interest_id) return;
    setActionLoading(true);
    try {
      await rejectInterest(relStatus.interest_id);
      setRelStatus((prev) => ({ ...prev, status: 'REJECTED' }));
    } catch (err) {
      console.error('Failed to decline interest:', err);
      alert(err.response?.data?.detail || 'Failed to decline interest.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelInterest = async () => {
    if (!relStatus.interest_id) return;
    setActionLoading(true);
    try {
      await cancelInterest(relStatus.interest_id);
      setRelStatus((prev) => ({ ...prev, status: 'NONE', interest_id: null }));
    } catch (err) {
      console.error('Failed to cancel interest:', err);
      alert(err.response?.data?.detail || 'Failed to cancel interest.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!isValidUserId) return;
    setActionLoading(true);
    try {
      if (relStatus.conversation_id) {
        navigate(`/messages?conversation=${relStatus.conversation_id}`);
      } else {
        const conv = await createConversation(targetUserId);
        navigate(`/messages?conversation=${conv.id}`);
      }
    } catch (err) {
      console.error('Failed to start chat:', err);
      alert(err.response?.data?.detail || 'Messaging is available after mutual interest acceptance.');
    } finally {
      setActionLoading(false);
    }
  };

  const [shortlistLoading, setShortlistLoading] = useState(false);

  const handleShortlistToggle = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!profile?.id || shortlistLoading) return;
    setShortlistLoading(true);
    const prevVal = isShortlisted;
    setIsShortlisted(!prevVal);
    try {
      const res = await profileApi.toggleShortlist(profile.id);
      if (res.data && typeof res.data.shortlisted === 'boolean') {
        setIsShortlisted(res.data.shortlisted);
      }
    } catch (err) {
      console.error('Failed to toggle shortlist:', err);
      setIsShortlisted(prevVal);
      const msg = err.response?.data?.detail || 'Failed to update shortlist status.';
      alert(msg);
    } finally {
      setShortlistLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="py-20 text-center text-muted-500 font-medium">
        Loading profile details...
      </div>
    );
  }

  const educationDisplay = typeof profile.education === 'string'
    ? profile.education
    : (profile.educationDetails || profile.education?.degree || 'Graduate');

  const professionDisplay = typeof profile.profession === 'string'
    ? profile.profession
    : (profile.professional?.occupation || 'Professional');

  const heightDisplay = profile.height || profile.height_feet_inches || "5' 8\"";
  const communityDisplay = profile.community || profile.caste || profile.religion || 'General';
  const whyMatchList = profile.whyMatch || profile.compatibilityFactors || [];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Back Link Header */}
      <div className="flex items-center justify-between">
        <Link to="/profiles" className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-700 hover:text-maroon-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to All Profiles
        </Link>
        <span className="text-xs text-muted-500 font-mono">Profile ID: {profile.id}</span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Gallery & Key Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-rose-200 p-5 shadow-xs space-y-4">
            
            {/* Main Photo Frame */}
            <div className="relative h-96 w-full rounded-2xl overflow-hidden border-2 border-gold-300 shadow-md bg-cream-100 flex items-center justify-center">
              {(activePhoto || profile.photo) && !imgError ? (
                <img 
                  src={activePhoto || profile.photo} 
                  alt={profile.name} 
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-100/80 via-cream-100 to-amber-100/80 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-white/90 border-2 border-rose-200 flex items-center justify-center text-maroon-700 shadow-sm mb-3">
                    <User className="w-12 h-12 stroke-[1.5]" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-dark-800">
                    {profile.name}
                  </h3>
                  <span className="text-xs text-muted-500 mt-1">
                    No Profile Photo Uploaded
                  </span>
                </div>
              )}
              
              <button
                onClick={handleShortlistToggle}
                disabled={shortlistLoading}
                className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
                  isShortlisted ? 'bg-rose-500 text-white' : 'bg-dark-900/50 text-white hover:bg-rose-500'
                }`}
                title={isShortlisted ? "Remove from Shortlist" : "Shortlist Profile"}
              >
                <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-white' : ''}`} />
              </button>

              <div className="absolute bottom-3 left-3">
                <CompatibilityBadge score={profile.compatibilityScore || 88} size="lg" />
              </div>
            </div>

            {/* Photo Gallery Thumbnails */}
            {Array.isArray(profile.gallery) && profile.gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {profile.gallery.map((img, idx) => {
                  const imgUrl = typeof img === 'string' ? img : img?.url;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActivePhoto(imgUrl)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activePhoto === imgUrl ? 'border-maroon-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Primary Action Buttons (Dynamic Backend Interest State) */}
            <div className="space-y-2.5 pt-2">
              {interestError && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{interestError}</span>
                </div>
              )}

              {loadingStatus ? (
                <div className="py-4 text-center text-xs text-muted-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-maroon-600" />
                  <span>Checking connection status...</span>
                </div>
              ) : relStatus.status === 'ACCEPTED' || relStatus.can_message ? (
                /* Connected State: Message & Voice Call */
                <div className="space-y-2">
                  <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Mutual Interest Accepted • Connected</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleStartChat}
                      disabled={actionLoading}
                      icon={actionLoading ? Loader2 : MessageSquare}
                    >
                      {actionLoading ? 'Opening...' : 'Message'}
                    </Button>

                    <Button
                      variant="gold"
                      size="md"
                      onClick={handleStartChat}
                      disabled={actionLoading}
                      icon={Phone}
                    >
                      Voice Call
                    </Button>
                  </div>
                </div>
              ) : relStatus.status === 'PENDING_SENT' ? (
                /* Pending Sent State */
                <div className="space-y-2">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center text-xs font-semibold text-amber-900 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-gold-600 animate-pulse" />
                    <span>Interest Sent — Awaiting Response</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={handleCancelInterest}
                    disabled={actionLoading}
                    icon={XCircle}
                    className="text-rose-700 hover:bg-rose-50"
                  >
                    Cancel Sent Request
                  </Button>
                </div>
              ) : relStatus.status === 'PENDING_RECEIVED' ? (
                /* Pending Received State */
                <div className="space-y-2">
                  <div className="p-2.5 bg-rose-50 rounded-2xl border border-rose-200 text-center text-xs font-semibold text-maroon-800">
                    This profile sent an interest request to you!
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleAcceptInterest}
                      disabled={actionLoading}
                      icon={CheckCircle2}
                    >
                      Accept
                    </Button>

                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleRejectInterest}
                      disabled={actionLoading}
                      icon={XCircle}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ) : (
                /* Default No Request State */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleShortlistToggle}
                    disabled={shortlistLoading}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      isShortlisted
                        ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 shadow-xs'
                        : 'bg-white border-rose-200 text-dark-800 hover:bg-rose-50/60 shadow-xs'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-rose-600 text-rose-600' : 'text-rose-500'}`} />
                    <span>{isShortlisted ? '♥ Shortlisted' : '♡ Shortlist'}</span>
                  </button>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSendInterest}
                    disabled={actionLoading}
                    icon={actionLoading ? Loader2 : Send}
                  >
                    {actionLoading ? 'Sending...' : 'Send Interest'}
                  </Button>
                </div>
              )}

              {/* Biodata PDF Generator */}
              <Button
                variant="secondary"
                size="md"
                fullWidth
                icon={FileText}
                onClick={() => setIsBiodataOpen(true)}
              >
                Generate Matrimonial Biodata PDF
              </Button>
            </div>

            {/* Privacy Note */}
            <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200/60 text-xs text-muted-600 flex items-start gap-2">
              <Lock className="w-4 h-4 text-maroon-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-dark-800">Privacy Control Active</p>
                <p className="text-[11px] text-muted-500 mt-0.5">
                  Contact phone number and direct messaging are unlocked only upon mutual interest acceptance.
                </p>
              </div>
            </div>

            {/* Report Profile Link */}
            <div className="pt-2 text-center border-t border-rose-100">
              {reported ? (
                <span className="text-xs text-amber-700 font-medium">✓ Profile reported to Admin safety team</span>
              ) : (
                <button
                  onClick={() => setReported(true)}
                  className="text-xs font-semibold text-muted-500 hover:text-red-600 flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" /> Report suspicious information
                </button>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Profile Content Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-rose-200 p-6 md:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-dark-800">{profile.name}</h1>
                  {(profile.is_verified || profile.verified) && <VerifiedBadge text="Verified Profile" size="md" />}
                </div>
                <p className="text-xs md:text-sm font-semibold text-maroon-700 mt-1">
                  {profile.age} Yrs • {heightDisplay} • {communityDisplay} ({profile.religion || 'Hindu'})
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  Income: {profile.income || profile.professional?.annual_income || 'Disclosed on request'}
                </span>
              </div>
            </div>

            {/* Key Overview Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2.5 bg-cream-50 p-3 rounded-xl border border-rose-100">
                <Briefcase className="w-4 h-4 text-gold-600 shrink-0" />
                <div>
                  <p className="text-muted-400 font-medium text-[10px]">Profession</p>
                  <p className="font-bold text-dark-800 truncate">{professionDisplay}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-cream-50 p-3 rounded-xl border border-rose-100">
                <GraduationCap className="w-4 h-4 text-gold-600 shrink-0" />
                <div>
                  <p className="text-muted-400 font-medium text-[10px]">Education</p>
                  <p className="font-bold text-dark-800 truncate">{educationDisplay}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-cream-50 p-3 rounded-xl border border-rose-100">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                <div>
                  <p className="text-muted-400 font-medium text-[10px]">Location</p>
                  <p className="font-bold text-dark-800 truncate">{profile.location || 'Location Not Specified'}</p>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="pt-2">
              <h3 className="font-serif font-bold text-base text-maroon-700 mb-2">About {profile.name}</h3>
              <p className="text-xs md:text-sm text-dark-700 leading-relaxed font-normal bg-rose-50/40 p-4 rounded-2xl border border-rose-100">
                "{profile.about || profile.bio || 'No detailed biography added yet.'}"
              </p>
            </div>

            {/* Why This Match Breakdown */}
            {whyMatchList.length > 0 && (
              <div className="pt-2 bg-gradient-to-r from-amber-50/80 to-cream-50 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                <h4 className="font-serif font-bold text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold-500 fill-gold-400" />
                  Why This Match? ({profile.compatibilityScore || 88}% Compatibility Fit)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {whyMatchList.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-dark-800 font-medium bg-white/90 p-2 rounded-xl border border-amber-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0"></span>
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Details Tabs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal & Lifestyle */}
            <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-maroon-700 flex items-center gap-2 border-b border-rose-100 pb-2">
                <User className="w-4 h-4 text-gold-600" /> Personal & Lifestyle
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-rose-50">
                  <span className="text-muted-500">Marital Status:</span>
                  <span className="font-semibold text-dark-800">{profile.maritalStatus || profile.marital_status || 'Never Married'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-rose-50">
                  <span className="text-muted-500">Mother Tongue:</span>
                  <span className="font-semibold text-dark-800">{profile.motherTongue || profile.mother_tongue || 'Hindi'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-rose-50">
                  <span className="text-muted-500">Dietary Habits:</span>
                  <span className="font-semibold text-dark-800">{profile.lifestyle?.diet || 'Not specified'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-rose-50">
                  <span className="text-muted-500">Drinking:</span>
                  <span className="font-semibold text-dark-800">{profile.lifestyle?.drinking || 'Not specified'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-rose-50">
                  <span className="text-muted-500">Smoking:</span>
                  <span className="font-semibold text-dark-800">{profile.lifestyle?.smoking || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {/* Family Background */}
            <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-maroon-700 flex items-center gap-2 border-b border-rose-100 pb-2">
                <Home className="w-4 h-4 text-gold-600" /> Family Background
              </h3>
              {profile.family ? (
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-rose-50">
                    <span className="text-muted-500">Father Details:</span>
                    <span className="font-semibold text-dark-800 text-right">{profile.family.father || profile.family.father_occupation || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose-50">
                    <span className="text-muted-500">Mother Details:</span>
                    <span className="font-semibold text-dark-800 text-right">{profile.family.mother || profile.family.mother_occupation || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose-50">
                    <span className="text-muted-500">Siblings:</span>
                    <span className="font-semibold text-dark-800 text-right">
                      {profile.family.siblings || (profile.family.brothers_count !== undefined ? `${profile.family.brothers_count} Bro, ${profile.family.sisters_count} Sis` : 'N/A')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose-50">
                    <span className="text-muted-500">Family Values:</span>
                    <span className="font-semibold text-dark-800">{profile.family.familyValues || profile.family.family_values || profile.family.family_type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose-50">
                    <span className="text-muted-500">Native Place:</span>
                    <span className="font-semibold text-dark-800">{profile.family.nativePlace || profile.family.native_place || 'N/A'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-500">Family details available upon request.</p>
              )}
            </div>

          </div>

          {/* Partner Expectations Box */}
          {profile.partnerPreferences && (
            <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-maroon-700 border-b border-rose-100 pb-2">
                Partner Preferences & Expectations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="bg-cream-50 p-3 rounded-xl border border-rose-100">
                  <span className="text-muted-400 font-medium block">Age Expectation</span>
                  <span className="font-bold text-dark-800">
                    {profile.partnerPreferences.ageRange || `${profile.partnerPreferences.min_age || 18} - ${profile.partnerPreferences.max_age || 60} Yrs`}
                  </span>
                </div>
                <div className="bg-cream-50 p-3 rounded-xl border border-rose-100">
                  <span className="text-muted-400 font-medium block">Community / Religion</span>
                  <span className="font-bold text-dark-800">
                    {profile.partnerPreferences.community || profile.partnerPreferences.religion || profile.partnerPreferences.caste || 'Any'}
                  </span>
                </div>
                <div className="bg-cream-50 p-3 rounded-xl border border-rose-100">
                  <span className="text-muted-400 font-medium block">Preferred Locations</span>
                  <span className="font-bold text-dark-800">{profile.partnerPreferences.location || 'Any'}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Matrimonial Biodata Modal */}
      <BiodataModal
        isOpen={isBiodataOpen}
        onClose={() => setIsBiodataOpen(false)}
        profile={profile}
      />

    </div>
  );
};
export default ProfileDetails;
