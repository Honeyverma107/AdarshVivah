import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Edit, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Home, 
  Heart, 
  Sparkles,
  UserPlus,
  Loader2,
  Activity,
  Coffee,
  Lock
} from 'lucide-react';
import DashboardHeader from '../../components/DashboardHeader';
import VerifiedBadge from '../../components/VerifiedBadge';
import Button from '../../components/Button';
import IdentityVerificationCard from '../../components/IdentityVerificationCard';
import profileApi from '../../api/profileApi';

export const MyProfile = () => {
  const context = useOutletContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    profileApi.getMe()
      .then((res) => {
        setProfile(res.data);
        setHasProfile(true);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setHasProfile(false);
          setProfile(null);
        } else {
          console.error('Error fetching my profile:', err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-500 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-maroon-600" />
        <span>Loading your profile details...</span>
      </div>
    );
  }

  if (!hasProfile || !profile) {
    return (
      <div className="space-y-6">
        <DashboardHeader 
          title="My Matrimonial Profile" 
          subtitle="You haven't created your matrimonial profile yet."
        />

        <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center space-y-4 max-w-xl mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-maroon-700 flex items-center justify-center mx-auto">
            <UserPlus className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-dark-800">Complete Your Matrimonial Profile</h3>
            <p className="text-xs text-muted-500 mt-1 max-w-md mx-auto">
              Your account was registered successfully. Add your personal, educational, professional, and family details so compatible matches and prospective families can connect with you.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/create-profile">
              <Button variant="gold" size="lg" icon={Sparkles}>
                Create & Publish Profile Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const educationDisplay = typeof profile.education === 'string'
    ? profile.education
    : (profile.educationDetails || profile.education?.degree || 'Not specified');

  const professionDisplay = typeof profile.profession === 'string'
    ? profile.profession
    : (profile.professional?.occupation || 'Not specified');

  const photoUrl = profile.photo || '';

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="My Matrimonial Profile" 
        subtitle="This is how your verified profile appears to prospective families and compatible matches."
      />

      {/* Main Profile Card Header */}
      <div className="bg-white rounded-3xl border border-rose-200 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-rose-100 pb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gold-400 shadow-md shrink-0 bg-cream-100 flex items-center justify-center">
            {photoUrl ? (
              <img src={photoUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-100 via-cream-100 to-amber-100 flex flex-col items-center justify-center text-maroon-700">
                <User className="w-12 h-12 stroke-[1.5]" />
              </div>
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-serif font-bold text-dark-800">{profile.name}</h2>
                  {(profile.is_verified || profile.verified) && <VerifiedBadge text="Verified" size="sm" />}
                </div>
                <p className="text-xs font-semibold text-maroon-700 mt-1">
                  {profile.age ? `${profile.age} Yrs` : 'Age N/A'} • {profile.height || profile.height_feet_inches || "Height N/A"} • {profile.caste || profile.community || 'General'} ({profile.religion || 'Hindu'})
                </p>
                <p className="text-[11px] text-muted-500 mt-0.5">
                  {profile.location || `${profile.city || ''}, ${profile.state || ''}`} • {profile.mother_tongue || 'Hindi'}{profile.phone_number ? ` • 📞 ${profile.phone_number}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                <Link to="/dashboard/edit-profile">
                  <Button variant="outline" size="sm" icon={Edit}>
                    Edit Profile
                  </Button>
                </Link>
                <Button 
                  variant="gold" 
                  size="sm" 
                  icon={FileText}
                  onClick={() => context?.openBiodataModal && context.openBiodataModal()}
                >
                  Biodata PDF
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-500 italic bg-rose-50/50 p-3 rounded-xl border border-rose-100/60 max-w-2xl">
              "{profile.about || profile.bio || 'No personal bio added yet.'}"
            </p>
          </div>
        </div>

        {/* Profile Attributes Grid (4 Sections) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 1: Career & Education */}
          <div className="space-y-3 text-xs bg-cream-50/40 p-4 rounded-2xl border border-rose-100">
            <h4 className="font-serif font-bold text-sm text-maroon-700 border-b border-rose-100 pb-1.5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gold-600" /> Career & Education
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Education Level:</span>
                <span className="font-bold text-dark-800">{profile.education?.education_level || 'Graduate'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Highest Degree:</span>
                <span className="font-bold text-dark-800">{educationDisplay}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Institution:</span>
                <span className="font-bold text-dark-800">{profile.education?.institution || 'Not specified'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Occupation / Role:</span>
                <span className="font-bold text-dark-800">{professionDisplay}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Company:</span>
                <span className="font-bold text-dark-800">{profile.company || profile.professional?.company_name || 'Not specified'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Annual Income:</span>
                <span className="font-bold text-dark-800">{profile.income || profile.professional?.annual_income || 'Disclosed on request'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Family Details */}
          <div className="space-y-3 text-xs bg-cream-50/40 p-4 rounded-2xl border border-rose-100">
            <h4 className="font-serif font-bold text-sm text-maroon-700 border-b border-rose-100 pb-1.5 flex items-center gap-2">
              <Home className="w-4 h-4 text-gold-600" /> Family Background
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Father Occupation:</span>
                <span className="font-bold text-dark-800">{profile.family?.father_occupation || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Mother Occupation:</span>
                <span className="font-bold text-dark-800">{profile.family?.mother_occupation || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Brothers / Sisters:</span>
                <span className="font-bold text-dark-800">{profile.family?.brothers_count || 0} Brother(s), {profile.family?.sisters_count || 0} Sister(s)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Family Type:</span>
                <span className="font-bold text-dark-800">{profile.family?.family_type || 'Nuclear Family'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Family Values:</span>
                <span className="font-bold text-dark-800">{profile.family?.family_values || 'Moderate'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Native Place:</span>
                <span className="font-bold text-dark-800">{profile.family?.native_place || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Religion, Culture & Physical */}
          <div className="space-y-3 text-xs bg-cream-50/40 p-4 rounded-2xl border border-rose-100">
            <h4 className="font-serif font-bold text-sm text-maroon-700 border-b border-rose-100 pb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-600" /> Religion, Culture & Attributes
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Religion / Caste:</span>
                <span className="font-bold text-dark-800">{profile.religion || 'Hindu'} • {profile.caste || 'General'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Sub-Caste / Gothram:</span>
                <span className="font-bold text-dark-800">{profile.sub_caste || 'N/A'} {profile.gothram ? `(${profile.gothram})` : ''}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Mother Tongue:</span>
                <span className="font-bold text-dark-800">{profile.mother_tongue || 'Hindi'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Languages Known:</span>
                <span className="font-bold text-dark-800">{profile.languages_known || 'English, Hindi'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Physical Status:</span>
                <span className="font-bold text-dark-800">{profile.physical_status || 'Normal'}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Partner Preferences & Lifestyle */}
          <div className="space-y-3 text-xs bg-cream-50/40 p-4 rounded-2xl border border-rose-100">
            <h4 className="font-serif font-bold text-sm text-maroon-700 border-b border-rose-100 pb-1.5 flex items-center gap-2">
              <Heart className="w-4 h-4 text-gold-600" /> Lifestyle & Partner Preferences
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Diet / Habits:</span>
                <span className="font-bold text-dark-800">{profile.lifestyle?.diet || 'Vegetarian'} • Smoke: {profile.lifestyle?.smoking || 'Never'} • Drink: {profile.lifestyle?.drinking || 'Never'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Hobbies:</span>
                <span className="font-bold text-dark-800 truncate max-w-[200px]">{Array.isArray(profile.lifestyle?.hobbies) ? profile.lifestyle.hobbies.join(', ') : (profile.lifestyle?.hobbies || 'N/A')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Preferred Age:</span>
                <span className="font-bold text-dark-800">{profile.partnerPreferences?.min_age && profile.partnerPreferences?.max_age ? `${profile.partnerPreferences.min_age} - ${profile.partnerPreferences.max_age} Yrs` : 'Open'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Preferred Religion/Caste:</span>
                <span className="font-bold text-dark-800">{profile.partnerPreferences?.religion || 'Open'} / {profile.partnerPreferences?.caste || 'Open'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-100/60">
                <span className="text-muted-500">Preferred Location:</span>
                <span className="font-bold text-dark-800">{profile.partnerPreferences?.location || 'Any'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Dedicated Identity Verification Module Section */}
      <IdentityVerificationCard />
    </div>
  );
};

export default MyProfile;
