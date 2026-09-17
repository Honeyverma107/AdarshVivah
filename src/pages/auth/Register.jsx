import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  User, 
  BookOpen, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Upload, 
  ShieldCheck,
  Camera
} from 'lucide-react';
import Button from '../../components/Button';

export const Register = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1
    fullName: 'Siddharth Sharma',
    gender: 'Male',
    dateOfBirth: '1996-05-18',
    phone: '+91 98765 12345',
    email: 'siddharth.s@example.com',
    password: 'Password@123',

    // Step 2
    location: 'Mumbai, Maharashtra',
    religion: 'Hindu',
    community: 'Brahmin',
    motherTongue: 'Hindi',
    maritalStatus: 'Never Married',
    height: "5' 10\"",

    // Step 3
    education: 'M.Tech in Computer Science',
    college: 'IIT Bombay',
    profession: 'Senior Software Engineer',
    company: 'Tech Innovations Pvt Ltd',
    income: '₹25 - 30 Lakhs P.A.',

    // Step 4
    prefAgeRange: '23 - 28 Yrs',
    prefReligion: 'Hindu',
    prefCommunity: 'Brahmin / Open',
    prefLocation: 'Mumbai, Pune, Bengaluru',
    prefEducation: 'Post Graduate / Engineer / MBA',

    // Step 5
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    verificationDoc: 'Aadhaar_Card_Proof.pdf'
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final Registration Submit
      if (onRegisterSuccess) onRegisterSuccess();
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream-100 to-cream-50">
      <div className="max-w-2xl w-full bg-white p-8 md:p-10 rounded-3xl border border-rose-200 shadow-xl relative">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-maroon-600 text-white flex items-center justify-center font-bold shadow-md">
              <Heart className="w-5 h-5 fill-gold-400 text-gold-400" />
            </div>
            <span className="font-serif font-bold text-2xl text-maroon-700">Adarsh<span className="text-gold-500">Vivah</span></span>
          </Link>
          <h2 className="text-2xl font-serif font-bold text-dark-800 pt-1">Create Your Matrimonial Profile</h2>
          <p className="text-xs text-muted-500">Join thousands of verified Indian families</p>
        </div>

        {/* Step Progress Indicator Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-dark-800 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span className="text-maroon-600">
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Personal & Family Details"}
              {currentStep === 3 && "Education & Career"}
              {currentStep === 4 && "Partner Preferences"}
              {currentStep === 5 && "Photo & Verification"}
            </span>
          </div>
          <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-maroon-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body Step Views */}
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
          
          {/* STEP 1: BASIC INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark-800 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Male">Groom (Male)</option>
                    <option value="Female">Bride (Female)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL & FAMILY */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Current City / Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Religion *</label>
                  <select
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Hindu">Hindu</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Jain">Jain</option>
                    <option value="Christian">Christian</option>
                    <option value="Muslim">Muslim</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Caste / Community *</label>
                  <input
                    type="text"
                    required
                    value={formData.community}
                    onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Mother Tongue *</label>
                  <input
                    type="text"
                    required
                    value={formData.motherTongue}
                    onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Marital Status *</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Never Married">Never Married</option>
                    <option value="Awaiting Divorce">Awaiting Divorce</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Height *</label>
                  <input
                    type="text"
                    required
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: EDUCATION & CAREER */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark-800 mb-1">Highest Qualification *</label>
                <input
                  type="text"
                  required
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="e.g. B.Tech / MBA / MBBS"
                  className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">College / Institute</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="University / College Name"
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Profession / Designation *</label>
                  <input
                    type="text"
                    required
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-800 mb-1">Annual Income *</label>
                <select
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                >
                  <option value="₹10 - 15 Lakhs P.A.">₹10 - 15 Lakhs P.A.</option>
                  <option value="₹15 - 25 Lakhs P.A.">₹15 - 25 Lakhs P.A.</option>
                  <option value="₹25 - 30 Lakhs P.A.">₹25 - 30 Lakhs P.A.</option>
                  <option value="₹35+ Lakhs P.A.">₹35+ Lakhs P.A.</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: PARTNER PREFERENCES */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Age Range</label>
                  <input
                    type="text"
                    value={formData.prefAgeRange}
                    onChange={(e) => setFormData({ ...formData, prefAgeRange: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Religion</label>
                  <input
                    type="text"
                    value={formData.prefReligion}
                    onChange={(e) => setFormData({ ...formData, prefReligion: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Cities / Locations</label>
                <input
                  type="text"
                  value={formData.prefLocation}
                  onChange={(e) => setFormData({ ...formData, prefLocation: e.target.value })}
                  className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-800 mb-1">Minimum Education Expectation</label>
                <input
                  type="text"
                  value={formData.prefEducation}
                  onChange={(e) => setFormData({ ...formData, prefEducation: e.target.value })}
                  className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: PHOTO & VERIFICATION */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center">
              <div className="space-y-3">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-gold-400 shadow-md">
                  <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-semibold text-dark-800">Profile Photo Uploaded</p>
              </div>

              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-maroon-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Government ID Verification Document</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-rose-100">
                  <span className="font-medium text-dark-800">{formData.verificationDoc}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Uploaded</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <Button type="button" onClick={handleBack} variant="secondary" size="md" icon={ArrowLeft}>
                Back
              </Button>
            ) : <div />}

            <Button type="submit" variant="primary" size="md" icon={currentStep === totalSteps ? CheckCircle2 : ArrowRight}>
              {currentStep === totalSteps ? 'Create Verified Profile' : 'Continue to Next Step'}
            </Button>
          </div>

        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-muted-500 pt-6 border-t border-rose-100 mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-maroon-700 hover:underline">
            Log In Here
          </Link>
        </p>

      </div>
    </div>
  );
};
export default Register;
