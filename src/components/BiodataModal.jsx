import React from 'react';
import { X, Printer, Download, Share2, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const BiodataModal = ({ isOpen, onClose, profile }) => {
  if (!isOpen || !profile) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-rose-200 relative my-8">
        
        {/* Modal Actions Header */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-maroon-700 font-serif font-semibold text-lg">
            <Sparkles className="w-5 h-5 text-gold-500" />
            <span>Matrimonial Biodata Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-maroon-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-muted-500 hover:text-dark-800 hover:bg-rose-50 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Biodata Document Card */}
        <div className="bg-gradient-to-b from-cream-50 to-white border-2 border-gold-300 p-6 md:p-8 rounded-2xl relative shadow-xs">
          
          {/* Traditional Ornamental Frame Top Header */}
          <div className="text-center mb-6 border-b-2 border-gold-300/60 pb-5">
            <p className="text-xs font-semibold tracking-widest text-gold-600 uppercase mb-1">
              ॥ श्री गणेशाय नमः ॥
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-maroon-700 tracking-tight">
              AdarshVivah Matrimonial Biodata
            </h2>
            <p className="text-xs text-muted-500 mt-1 italic">
              Where Traditions Meet Timeless Connections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Photo & Key Highlights */}
            <div className="md:col-span-1 text-center">
              <div className="w-36 h-44 mx-auto rounded-xl overflow-hidden border-2 border-gold-400 shadow-md mb-3">
                <img 
                  src={profile.photo} 
                  alt={profile.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="font-serif font-bold text-lg text-dark-800">{profile.name}</h3>
              <p className="text-xs text-maroon-700 font-semibold">{profile.profession}</p>
              <p className="text-xs text-muted-500 mt-0.5">{profile.location}</p>

              <div className="mt-4 p-3 bg-rose-50/80 rounded-xl border border-rose-200/60 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-500">Age / Height:</span>
                  <span className="font-semibold text-dark-800">{profile.age} Yrs, {profile.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-500">Marital Status:</span>
                  <span className="font-semibold text-dark-800">{profile.maritalStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-500">Religion:</span>
                  <span className="font-semibold text-dark-800">{profile.religion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-500">Caste/Community:</span>
                  <span className="font-semibold text-dark-800">{profile.community}</span>
                </div>
              </div>
            </div>

            {/* Right Detailed Biodata Sections */}
            <div className="md:col-span-2 space-y-5 text-xs text-dark-800">
              
              {/* Personal & Education */}
              <div>
                <h4 className="font-serif font-bold text-sm text-maroon-700 border-b border-gold-300 pb-1 mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gold-500 inline-block"></span>
                  Personal & Professional Details
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div><span className="text-muted-500">Date of Birth:</span> <span className="font-medium">{profile.dateOfBirth || '15 April 1997'}</span></div>
                  <div><span className="text-muted-500">Mother Tongue:</span> <span className="font-medium">{profile.motherTongue}</span></div>
                  <div><span className="text-muted-500">Education:</span> <span className="font-medium">{profile.education}</span></div>
                  <div><span className="text-muted-500">Institute:</span> <span className="font-medium">{profile.educationDetails || 'Reputed Institution'}</span></div>
                  <div><span className="text-muted-500">Designation:</span> <span className="font-medium">{profile.profession}</span></div>
                  <div><span className="text-muted-500">Annual Income:</span> <span className="font-medium">{profile.income}</span></div>
                </div>
              </div>

              {/* Family Background */}
              {profile.family && (
                <div>
                  <h4 className="font-serif font-bold text-sm text-maroon-700 border-b border-gold-300 pb-1 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gold-500 inline-block"></span>
                    Family Background
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <div><span className="text-muted-500">Father:</span> <span className="font-medium">{profile.family.father}</span></div>
                    <div><span className="text-muted-500">Mother:</span> <span className="font-medium">{profile.family.mother}</span></div>
                    <div><span className="text-muted-500">Siblings:</span> <span className="font-medium">{profile.family.siblings}</span></div>
                    <div><span className="text-muted-500">Family Type:</span> <span className="font-medium">{profile.family.familyType}</span></div>
                    <div><span className="text-muted-500">Native Place:</span> <span className="font-medium">{profile.family.nativePlace}</span></div>
                    <div><span className="text-muted-500">Family Values:</span> <span className="font-medium">{profile.family.familyValues}</span></div>
                  </div>
                </div>
              )}

              {/* Partner Expectations */}
              {profile.partnerPreferences && (
                <div>
                  <h4 className="font-serif font-bold text-sm text-maroon-700 border-b border-gold-300 pb-1 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gold-500 inline-block"></span>
                    Partner Preferences
                  </h4>
                  <p className="text-muted-600 leading-relaxed">
                    Looking for a well-educated, respectful partner aged {profile.partnerPreferences.ageRange}, preferably in {profile.partnerPreferences.profession} from {profile.partnerPreferences.location}.
                  </p>
                </div>
              )}

              {/* Verification Seal */}
              <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-[11px] text-muted-500">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified by AdarshVivah
                </span>
                <span>Profile ID: {profile.id}</span>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <p className="text-center text-xs text-muted-400 mt-4 print:hidden">
          Downloaded from AdarshVivah Matrimonial Platform • Confidential Document
        </p>
      </div>
    </div>
  );
};
export default BiodataModal;
