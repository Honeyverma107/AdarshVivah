import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Coffee, 
  Lock, 
  Flag,
  FileText,
  Share2,
  ArrowLeft
} from 'lucide-react';
import Button from '../../components/Button';
import VerifiedBadge from '../../components/VerifiedBadge';
import CompatibilityBadge from '../../components/CompatibilityBadge';
import BiodataModal from '../../components/BiodataModal';
import { MOCK_PROFILES } from '../../data/profiles';

export const ProfileDetails = () => {
  const { id } = useParams();
  
  // Find profile or fallback to first
  const profile = MOCK_PROFILES.find((p) => p.id === id) || MOCK_PROFILES[0];

  const [activePhoto, setActivePhoto] = useState(profile.photo);
  const [isShortlisted, setIsShortlisted] = useState(profile.shortlisted || false);
  const [interestStatus, setInterestStatus] = useState(profile.interestStatus || 'none');
  const [isBiodataOpen, setIsBiodataOpen] = useState(false);
  const [reported, setReported] = useState(false);

  const handleSendInterest = () => {
    if (interestStatus === 'none') {
      setInterestStatus('sent');
    }
  };

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
            <div className="relative h-96 w-full rounded-2xl overflow-hidden border-2 border-gold-300 shadow-md">
              <img src={activePhoto} alt={profile.name} className="w-full h-full object-cover" />
              
              <button
                onClick={() => setIsShortlisted(!isShortlisted)}
                className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
                  isShortlisted ? 'bg-rose-500 text-white' : 'bg-dark-900/50 text-white hover:bg-rose-500'
                }`}
                title="Shortlist Profile"
              >
                <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-white' : ''}`} />
              </button>

              <div className="absolute bottom-3 left-3">
                <CompatibilityBadge score={profile.compatibilityScore} size="lg" />
              </div>
            </div>

            {/* Photo Gallery Thumbnails */}
            {profile.gallery && profile.gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {profile.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activePhoto === img ? 'border-maroon-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                variant={interestStatus === 'sent' ? 'ghost' : interestStatus === 'accepted' ? 'gold' : 'primary'}
                size="lg"
                fullWidth
                onClick={handleSendInterest}
                disabled={interestStatus === 'sent' || interestStatus === 'accepted'}
                icon={interestStatus === 'sent' ? CheckCircle2 : Send}
              >
                {interestStatus === 'sent' ? 'Interest Sent Request Pending' : interestStatus === 'accepted' ? 'Connected Profile' : 'Express Interest Now'}
              </Button>

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
                  Contact phone number and full family details are unlocked only upon mutual interest acceptance.
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
                  {profile.verified && <VerifiedBadge text="Verified Profile" size="md" />}
                </div>
                <p className="text-xs md:text-sm font-semibold text-maroon-700 mt-1">
                  {profile.age} Yrs • {profile.height} • {profile.community} ({profile.religion})
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  Income: {profile.income}
                </span>
              </div>
            </div>

            {/* Key Overview Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2.5 bg-cream-50 p-3 rounded-xl border border-rose-100">
                <Briefcase className="w-4 h-4 text-gold-600 shrink-0" />
                <div>
                  <p className="text-muted-400 font-medium text-[10px]">Profession</p>
                  <p className="font-bold text-dark-800 truncate">{profile.profession}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-cream-50 p-3 rounded-xl border border-rose-100">
                <GraduationCap className="w-4 h-4 text-gold-600 shrink-0" />
                <div>
                  <p className="text-muted-400 font-medium text-[10px]">Education</p>
                  <p className="font-bold text-dark-800 truncate">{profile.education}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-cream-50 p-3 rounded-xl border border-rose-100">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                <div>
                  <p className="text-muted-400 font-medium text-[10px]">Location</p>
                  <p className="font-bold text-dark-800 truncate">{profile.location}</p>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="pt-2">
              <h3 className="font-serif font-bold text-base text-maroon-700 mb-2">About {profile.name}</h3>
              <p className="text-xs md:text-sm text-dark-700 leading-relaxed font-normal bg-rose-50/40 p-4 rounded-2xl border border-rose-100">
                "{profile.about}"
              </p>
            </div>

            {/* Why This Match Breakdown */}
            {profile.compatibilityFactors && (
              <div className="pt-2 bg-gradient-to-r from-amber-50/80 to-cream-50 p-4 rounded-2xl border border-amber-200/80 space-y-2">
                <h4 className="font-serif font-bold text-xs text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold-500 fill-gold-400" />
                  Why This Match? ({profile.compatibilityScore}% Compatibility Fit)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {profile.compatibilityFactors.map((factor, idx) => (
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
                  <span className="font-semibold text-dark-800">{profile.maritalStatus}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-rose-50">
                  <span className="text-muted-500">Mother Tongue:</span>
                  <span className="font-semibold text-dark-800">{profile.motherTongue}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-rose-50">
                  <span className="text-muted-500">Dietary Habits:</span>
                  <span className="font-semibold text-dark-800">{profile.lifestyle?.diet}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-rose-50">
                  <span className="text-muted-500">Drinking:</span>
                  <span className="font-semibold text-dark-800">{profile.lifestyle?.drinking}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-rose-50">
                  <span className="text-muted-500">Smoking:</span>
                  <span className="font-semibold text-dark-800">{profile.lifestyle?.smoking}</span>
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
                    <span className="font-semibold text-dark-800 text-right">{profile.family.father}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose-50">
                    <span className="text-muted-500">Mother Details:</span>
                    <span className="font-semibold text-dark-800 text-right">{profile.family.mother}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose-50">
                    <span className="text-muted-500">Siblings:</span>
                    <span className="font-semibold text-dark-800 text-right">{profile.family.siblings}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose-50">
                    <span className="text-muted-500">Family Values:</span>
                    <span className="font-semibold text-dark-800">{profile.family.familyValues}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose-50">
                    <span className="text-muted-500">Native Place:</span>
                    <span className="font-semibold text-dark-800">{profile.family.nativePlace}</span>
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
                  <span className="font-bold text-dark-800">{profile.partnerPreferences.ageRange}</span>
                </div>
                <div className="bg-cream-50 p-3 rounded-xl border border-rose-100">
                  <span className="text-muted-400 font-medium block">Community / Religion</span>
                  <span className="font-bold text-dark-800">{profile.partnerPreferences.community}</span>
                </div>
                <div className="bg-cream-50 p-3 rounded-xl border border-rose-100">
                  <span className="text-muted-400 font-medium block">Preferred Locations</span>
                  <span className="font-bold text-dark-800">{profile.partnerPreferences.location}</span>
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
