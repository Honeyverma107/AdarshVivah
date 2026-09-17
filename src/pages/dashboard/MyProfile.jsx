import React from 'react';
import { CURRENT_USER } from '../../data/profiles';
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
  Sparkles 
} from 'lucide-react';
import DashboardHeader from '../../components/DashboardHeader';
import VerifiedBadge from '../../components/VerifiedBadge';
import Button from '../../components/Button';

export const MyProfile = () => {
  const context = useOutletContext();
  const user = CURRENT_USER;

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="My Matrimonial Profile" 
        subtitle="This is how your verified profile appears to prospective families and compatible matches."
      />

      {/* Main Profile Card Header */}
      <div className="bg-white rounded-3xl border border-rose-200 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-rose-100 pb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gold-400 shadow-md shrink-0">
            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-serif font-bold text-dark-800">{user.name}</h2>
                  <VerifiedBadge text="Verified" size="sm" />
                </div>
                <p className="text-xs font-semibold text-maroon-700 mt-1">
                  {user.age} Yrs • {user.height} • {user.community} ({user.religion})
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
              "{user.about}"
            </p>
          </div>
        </div>

        {/* Profile Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Personal & Career */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-maroon-700 border-b border-rose-100 pb-1.5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gold-600" /> Career & Education
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-rose-50">
                <span className="text-muted-500">Profession:</span>
                <span className="font-bold text-dark-800">{user.profession}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-50">
                <span className="text-muted-500">Company:</span>
                <span className="font-bold text-dark-800">{user.company}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-50">
                <span className="text-muted-500">Education:</span>
                <span className="font-bold text-dark-800">{user.education}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-50">
                <span className="text-muted-500">Annual Income:</span>
                <span className="font-bold text-dark-800">{user.income}</span>
              </div>
            </div>
          </div>

          {/* Family Background */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-maroon-700 border-b border-rose-100 pb-1.5 flex items-center gap-2">
              <Home className="w-4 h-4 text-gold-600" /> Family Background
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-rose-50">
                <span className="text-muted-500">Father Details:</span>
                <span className="font-bold text-dark-800">{user.family.father}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-50">
                <span className="text-muted-500">Mother Details:</span>
                <span className="font-bold text-dark-800">{user.family.mother}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-50">
                <span className="text-muted-500">Native Place:</span>
                <span className="font-bold text-dark-800">{user.family.nativePlace}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-50">
                <span className="text-muted-500">Family Values:</span>
                <span className="font-bold text-dark-800">{user.family.familyValues}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default MyProfile;
