import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Activity, 
  FileText, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Home as HomeIcon, 
  Coffee, 
  Heart, 
  Camera, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  AlertCircle, 
  Loader2, 
  Save,
  Edit3
} from 'lucide-react';
import Button from '../../components/Button';
import PhotoGalleryManager from '../../components/PhotoGalleryManager';
import profileApi from '../../api/profileApi';
import { useAuth } from '../../context/AuthContext';

const STEPS = [
  { id: 'basic', label: '1. Basic Info', title: 'Basic Information', icon: User },
  { id: 'location', label: '2. Location', title: 'Contact & Location Details', icon: MapPin },
  { id: 'physical', label: '3. Physical', title: 'Physical Attributes', icon: Activity },
  { id: 'about', label: '4. About Me', title: 'About Yourself', icon: FileText },
  { id: 'religion', label: '5. Religion', title: 'Religion & Cultural Background', icon: Sparkles },
  { id: 'education', label: '6. Education', title: 'Educational Background', icon: GraduationCap },
  { id: 'professional', label: '7. Career', title: 'Career & Professional Details', icon: Briefcase },
  { id: 'family', label: '8. Family', title: 'Family Background & Details', icon: HomeIcon },
  { id: 'lifestyle', label: '9. Lifestyle', title: 'Lifestyle & Hobbies', icon: Coffee },
  { id: 'preferences', label: '10. Preferences', title: 'Partner Preferences', icon: Heart },
  { id: 'photos', label: '11. Photos', title: 'Profile Photos & Gallery', icon: Camera },
  { id: 'review', label: '12. Review', title: 'Review & Submit Profile', icon: CheckCircle2 }
];

export const CreateProfile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [photosList, setPhotosList] = useState([]);

  const [formData, setFormData] = useState({
    // Step 1: Basic
    name: authUser?.first_name || authUser?.name || '',
    gender: 'Male',
    date_of_birth: '',
    marital_status: 'Never Married',
    
    // Step 2: Contact & Location
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    phone_number: '',
    native_place: '',

    // Step 3: Physical
    height_feet_inches: "5' 8\"",
    height_cm: 172,
    weight_kg: '',
    body_type: 'Average',
    complexion: 'Wheatish',
    physical_status: 'Normal',

    // Step 4: About
    bio: '',

    // Step 5: Religion & Culture
    religion: 'Hindu',
    caste: '',
    sub_caste: '',
    gothram: '',
    mother_tongue: 'Hindi',
    languages_known: '',

    // Step 6: Education
    education_level: 'Bachelor / Graduate',
    degree: '',
    field_of_study: '',
    institution: '',
    passing_year: '',
    additional_degree: '',

    // Step 7: Professional
    employed_in: 'Private Sector',
    occupation: '',
    company_name: '',
    annual_income: '',
    work_location: '',
    experience_years: '',

    // Step 8: Family
    father_name: '',
    father_occupation: '',
    mother_name: '',
    mother_occupation: '',
    brothers_count: 0,
    sisters_count: 0,
    married_brothers_count: 0,
    married_sisters_count: 0,
    family_type: 'Nuclear Family',
    family_values: 'Moderate',
    family_status: 'Middle Class',
    about_family: '',

    // Step 9: Lifestyle
    diet: 'Vegetarian',
    smoking: 'Never',
    drinking: 'Never',
    exercise: 'Occasionally',
    hobbies: '',
    interests: '',
    pets: 'No Pets',

    // Step 10: Partner Preferences
    pref_min_age: 22,
    pref_max_age: 30,
    pref_min_height: "5' 2\"",
    pref_max_height: "6' 0\"",
    pref_marital_status: 'Never Married',
    pref_religion: 'Hindu',
    pref_caste: '',
    pref_sub_caste: '',
    pref_mother_tongue: 'Hindi',
    pref_education_level: '',
    pref_occupation: '',
    pref_min_income: '',
    pref_location: '',
    pref_diet: '',
    pref_smoking: '',
    pref_drinking: '',

    // Step 11: Photos
    photo: ''
  });

  // Pre-load existing profile data if user already started
  useEffect(() => {
    const fetchExisting = async () => {
      setLoading(true);
      try {
        const res = await profileApi.getMe();
        const data = res.data;
        if (data && (data.id || data.gender || data.religion)) {
          setPhotosList(data.photos_list || data.photos || []);
          setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            gender: data.gender || prev.gender,
            date_of_birth: data.date_of_birth || prev.date_of_birth,
            marital_status: data.marital_status || prev.marital_status,

            country: data.country || prev.country,
            state: data.state || prev.state,
            city: data.city || prev.city,
            pincode: data.pincode || prev.pincode,
            phone_number: data.phone_number || prev.phone_number,
            native_place: data.family?.native_place || prev.native_place,

            height_feet_inches: data.height_feet_inches || prev.height_feet_inches,
            height_cm: data.height_cm || prev.height_cm,
            weight_kg: data.weight_kg || prev.weight_kg,
            body_type: data.body_type || prev.body_type,
            complexion: data.complexion || prev.complexion,
            physical_status: data.physical_status || prev.physical_status,

            bio: data.bio || data.about || prev.bio,

            religion: data.religion || prev.religion,
            caste: data.caste || prev.caste,
            sub_caste: data.sub_caste || prev.sub_caste,
            gothram: data.gothram || prev.gothram,
            mother_tongue: data.mother_tongue || prev.mother_tongue,
            languages_known: data.languages_known || prev.languages_known,

            education_level: data.education?.education_level || prev.education_level,
            degree: data.education?.degree || prev.degree,
            field_of_study: data.education?.field_of_study || prev.field_of_study,
            institution: data.education?.institution || prev.institution,
            passing_year: data.education?.passing_year || prev.passing_year,
            additional_degree: data.education?.additional_degree || prev.additional_degree,

            employed_in: data.professional?.employed_in || prev.employed_in,
            occupation: data.professional?.occupation || prev.occupation,
            company_name: data.professional?.company_name || prev.company_name,
            annual_income: data.professional?.annual_income || prev.annual_income,
            work_location: data.professional?.work_location || prev.work_location,
            experience_years: data.professional?.experience_years || prev.experience_years,

            father_name: data.family?.father_name || prev.father_name,
            father_occupation: data.family?.father_occupation || prev.father_occupation,
            mother_name: data.family?.mother_name || prev.mother_name,
            mother_occupation: data.family?.mother_occupation || prev.mother_occupation,
            brothers_count: data.family?.brothers_count ?? prev.brothers_count,
            sisters_count: data.family?.sisters_count ?? prev.sisters_count,
            married_brothers_count: data.family?.married_brothers_count ?? prev.married_brothers_count,
            married_sisters_count: data.family?.married_sisters_count ?? prev.married_sisters_count,
            family_type: data.family?.family_type || prev.family_type,
            family_values: data.family?.family_values || prev.family_values,
            family_status: data.family?.family_status || prev.family_status,
            about_family: data.family?.about_family || prev.about_family,

            diet: data.lifestyle?.diet || prev.diet,
            smoking: data.lifestyle?.smoking || prev.smoking,
            drinking: data.lifestyle?.drinking || prev.drinking,
            exercise: data.lifestyle?.exercise || prev.exercise,
            hobbies: Array.isArray(data.lifestyle?.hobbies) ? data.lifestyle.hobbies.join(', ') : (data.lifestyle?.hobbies || prev.hobbies),
            interests: data.lifestyle?.interests || prev.interests,
            pets: data.lifestyle?.pets || prev.pets,

            pref_min_age: data.partnerPreferences?.min_age || prev.pref_min_age,
            pref_max_age: data.partnerPreferences?.max_age || prev.pref_max_age,
            pref_min_height: data.partnerPreferences?.min_height || prev.pref_min_height,
            pref_max_height: data.partnerPreferences?.max_height || prev.pref_max_height,
            pref_marital_status: data.partnerPreferences?.marital_status || prev.pref_marital_status,
            pref_religion: data.partnerPreferences?.religion || prev.pref_religion,
            pref_caste: data.partnerPreferences?.caste || prev.pref_caste,
            pref_sub_caste: data.partnerPreferences?.sub_caste || prev.pref_sub_caste,
            pref_mother_tongue: data.partnerPreferences?.mother_tongue || prev.pref_mother_tongue,
            pref_education_level: data.partnerPreferences?.education_level || prev.pref_education_level,
            pref_occupation: data.partnerPreferences?.occupation || prev.pref_occupation,
            pref_min_income: data.partnerPreferences?.min_income || prev.pref_min_income,
            pref_location: data.partnerPreferences?.location || prev.pref_location,
            pref_diet: data.partnerPreferences?.diet || prev.pref_diet,
            pref_smoking: data.partnerPreferences?.smoking || prev.pref_smoking,
            pref_drinking: data.partnerPreferences?.drinking || prev.pref_drinking,

            photo: data.photo || prev.photo
          }));
        }
      } catch (err) {
        // Safe fallback if profile doesn't exist yet
      } finally {
        setLoading(false);
      }
    };
    fetchExisting();
  }, [authUser]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePhotoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setErrorMsg('');
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('is_primary', 'true');
      const res = await profileApi.uploadPhoto(data);
      if (res.data?.image) {
        setFormData(prev => ({ ...prev, photo: res.data.image }));
      }
    } catch (err) {
      console.error('Photo upload failed:', err);
      setErrorMsg(err.response?.data?.detail || 'Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth || null,
        marital_status: formData.marital_status,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
        phone_number: formData.phone_number,

        height_feet_inches: formData.height_feet_inches,
        height_cm: Number(formData.height_cm) || 172,
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : null,
        body_type: formData.body_type,
        complexion: formData.complexion,
        physical_status: formData.physical_status,

        bio: formData.bio,

        religion: formData.religion,
        caste: formData.caste,
        sub_caste: formData.sub_caste,
        gothram: formData.gothram,
        mother_tongue: formData.mother_tongue,
        languages_known: formData.languages_known,

        photo: formData.photo,

        education: {
          education_level: formData.education_level,
          degree: formData.degree,
          field_of_study: formData.field_of_study,
          institution: formData.institution,
          passing_year: formData.passing_year ? Number(formData.passing_year) : null,
          additional_degree: formData.additional_degree
        },
        professional: {
          employed_in: formData.employed_in,
          occupation: formData.occupation,
          company_name: formData.company_name,
          annual_income: formData.annual_income,
          work_location: formData.work_location,
          experience_years: formData.experience_years ? Number(formData.experience_years) : null
        },
        family: {
          father_name: formData.father_name,
          father_occupation: formData.father_occupation,
          mother_name: formData.mother_name,
          mother_occupation: formData.mother_occupation,
          brothers_count: Number(formData.brothers_count) || 0,
          sisters_count: Number(formData.sisters_count) || 0,
          married_brothers_count: Number(formData.married_brothers_count) || 0,
          married_sisters_count: Number(formData.married_sisters_count) || 0,
          family_type: formData.family_type,
          family_values: formData.family_values,
          family_status: formData.family_status,
          native_place: formData.native_place,
          about_family: formData.about_family
        },
        lifestyle: {
          diet: formData.diet,
          smoking: formData.smoking,
          drinking: formData.drinking,
          exercise: formData.exercise,
          hobbies: formData.hobbies,
          interests: formData.interests,
          pets: formData.pets
        },
        partnerPreferences: {
          min_age: Number(formData.pref_min_age) || 18,
          max_age: Number(formData.pref_max_age) || 70,
          min_height: formData.pref_min_height,
          max_height: formData.pref_max_height,
          marital_status: formData.pref_marital_status,
          religion: formData.pref_religion,
          caste: formData.pref_caste,
          sub_caste: formData.pref_sub_caste,
          mother_tongue: formData.pref_mother_tongue,
          education_level: formData.pref_education_level,
          occupation: formData.pref_occupation,
          min_income: formData.pref_min_income,
          location: formData.pref_location,
          diet: formData.pref_diet,
          smoking: formData.pref_smoking,
          drinking: formData.pref_drinking
        }
      };

      await profileApi.createProfile(payload);
      navigate('/dashboard/my-profile');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setErrorMsg('Failed to save matrimonial profile. Please check your network and inputs.');
    } finally {
      setSaving(false);
    }
  };

  const currentStep = STEPS[currentStepIndex];

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-maroon-600 animate-spin" />
        <p className="text-xs font-semibold text-muted-600">Loading matrimonial profile setup...</p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-maroon-700 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
              Step {currentStepIndex + 1} of {STEPS.length} • {currentStep.title}
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-dark-800">
              Create Your Matrimonial Profile
            </h1>
            <p className="text-xs text-muted-500 mt-1">
              Please complete each step to build your detailed matrimonial profile.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-maroon-700">
              {Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}% Completed
            </span>
            <div className="w-36 h-2 bg-rose-100 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-maroon-600 rounded-full transition-all duration-300" 
                style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Wizard Step Tabs */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {STEPS.map((step, idx) => {
              const IconComp = step.icon;
              const isActive = idx === currentStepIndex;
              const isCompleted = idx < currentStepIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-maroon-700 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-rose-50 text-maroon-800 hover:bg-rose-100'
                      : 'bg-cream-50 text-muted-500 hover:bg-cream-100'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-gold-400' : isCompleted ? 'text-maroon-600' : 'text-muted-400'}`} />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Content */}
      <div className="bg-white rounded-3xl border border-rose-200 p-6 md:p-8 shadow-xs">
        <form onSubmit={currentStepIndex === STEPS.length - 1 ? handleSubmit : handleNextStep} className="space-y-6">
          
          {/* STEP 1: BASIC INFO */}
          {currentStep.id === 'basic' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-maroon-600" /> Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleChange('date_of_birth', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Marital Status</label>
                  <select
                    value={formData.marital_status}
                    onChange={(e) => handleChange('marital_status', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Awaiting Divorce">Awaiting Divorce</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {currentStep.id === 'location' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-maroon-600" /> Contact & Location Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Country</label>
                  <input
                    type="text"
                    placeholder="e.g. India"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">City / Town</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Pincode / Postal Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 400001"
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone_number}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-dark-800 mb-1">Native Place / Ancestral Town</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={formData.native_place}
                    onChange={(e) => handleChange('native_place', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PHYSICAL ATTRIBUTES */}
          {currentStep.id === 'physical' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                <Activity className="w-5 h-5 text-maroon-600" /> Physical Attributes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Height (Feet & Inches)</label>
                  <select
                    value={formData.height_feet_inches}
                    onChange={(e) => handleChange('height_feet_inches', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="4' 10&quot;">4' 10"</option>
                    <option value="5' 0&quot;">5' 0"</option>
                    <option value="5' 2&quot;">5' 2"</option>
                    <option value="5' 4&quot;">5' 4"</option>
                    <option value="5' 6&quot;">5' 6"</option>
                    <option value="5' 8&quot;">5' 8"</option>
                    <option value="5' 10&quot;">5' 10"</option>
                    <option value="6' 0&quot;">6' 0"</option>
                    <option value="6' 2&quot;">6' 2"</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="172"
                    value={formData.height_cm}
                    onChange={(e) => handleChange('height_cm', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 68"
                    value={formData.weight_kg}
                    onChange={(e) => handleChange('weight_kg', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Body Type</label>
                  <select
                    value={formData.body_type}
                    onChange={(e) => handleChange('body_type', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Slim">Slim</option>
                    <option value="Average">Average</option>
                    <option value="Athletic">Athletic</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Complexion</label>
                  <select
                    value={formData.complexion}
                    onChange={(e) => handleChange('complexion', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Very Fair">Very Fair</option>
                    <option value="Fair">Fair</option>
                    <option value="Wheatish">Wheatish</option>
                    <option value="Dark">Dark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Physical Status</label>
                  <select
                    value={formData.physical_status}
                    onChange={(e) => handleChange('physical_status', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Physically Challenged">Physically Challenged</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ABOUT ME */}
          {currentStep.id === 'about' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-maroon-600" /> About Yourself
              </h3>
              <div>
                <label className="block text-xs font-bold text-dark-800 mb-1">Bio / Express Yourself</label>
                <textarea
                  rows={6}
                  placeholder="Share details about your personality, values, career goals, family background, and what you are looking for in a partner..."
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: RELIGION & CULTURE */}
          {currentStep.id === 'religion' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-maroon-600" /> Religion & Culture
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Religion</label>
                  <select
                    value={formData.religion}
                    onChange={(e) => handleChange('religion', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Christian">Christian</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Jain">Jain</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Caste</label>
                  <input
                    type="text"
                    placeholder="e.g. Brahmin / Rajput / Maratha / Kayastha"
                    value={formData.caste}
                    onChange={(e) => handleChange('caste', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Sub Caste</label>
                  <input
                    type="text"
                    placeholder="e.g. Kanya-Kubja"
                    value={formData.sub_caste}
                    onChange={(e) => handleChange('sub_caste', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Gothram</label>
                  <input
                    type="text"
                    placeholder="e.g. Bhardwaj"
                    value={formData.gothram}
                    onChange={(e) => handleChange('gothram', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Mother Tongue</label>
                  <select
                    value={formData.mother_tongue}
                    onChange={(e) => handleChange('mother_tongue', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Odia">Odia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Languages Known</label>
                  <input
                    type="text"
                    placeholder="e.g. Hindi, English, Marathi"
                    value={formData.languages_known}
                    onChange={(e) => handleChange('languages_known', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: EDUCATION */}
          {currentStep.id === 'education' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-maroon-600" /> Education
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Education Level</label>
                  <select
                    value={formData.education_level}
                    onChange={(e) => handleChange('education_level', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor / Graduate">Bachelor / Graduate</option>
                    <option value="Master / Post Graduate">Master / Post Graduate</option>
                    <option value="Doctorate / PhD">Doctorate / PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Highest Degree</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech / MBA / MBBS / M.Sc"
                    value={formData.degree}
                    onChange={(e) => handleChange('degree', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Field of Study / Major</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science / Finance"
                    value={formData.field_of_study}
                    onChange={(e) => handleChange('field_of_study', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">College / Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. IIT Bombay / Delhi University"
                    value={formData.institution}
                    onChange={(e) => handleChange('institution', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Passing Year</label>
                  <input
                    type="number"
                    placeholder="e.g. 2020"
                    value={formData.passing_year}
                    onChange={(e) => handleChange('passing_year', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Additional Certifications / Degree</label>
                  <input
                    type="text"
                    placeholder="e.g. PMP, CFA, AWS Certified"
                    value={formData.additional_degree}
                    onChange={(e) => handleChange('additional_degree', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: CAREER / PROFESSION */}
          {currentStep.id === 'professional' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-maroon-600" /> Career & Profession
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Employed In</label>
                  <select
                    value={formData.employed_in}
                    onChange={(e) => handleChange('employed_in', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Private Sector">Private Sector</option>
                    <option value="Government / Public Sector">Government / Public Sector</option>
                    <option value="Business / Entrepreneur">Business / Entrepreneur</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Defense / Civil Services">Defense / Civil Services</option>
                    <option value="Not Working">Not Working</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Occupation / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer / Doctor / Architect"
                    value={formData.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Google / AIIMS / TCS"
                    value={formData.company_name}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Annual Income</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹12 - ₹15 Lakhs per annum"
                    value={formData.annual_income}
                    onChange={(e) => handleChange('annual_income', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Work Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru"
                    value={formData.work_location}
                    onChange={(e) => handleChange('work_location', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={formData.experience_years}
                    onChange={(e) => handleChange('experience_years', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: FAMILY DETAILS */}
          {currentStep.id === 'family' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                <HomeIcon className="w-5 h-5 text-maroon-600" /> Family Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Father's Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Shri Rajesh Sharma"
                    value={formData.father_name}
                    onChange={(e) => handleChange('father_name', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Father's Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Retired Govt Officer / Business"
                    value={formData.father_occupation}
                    onChange={(e) => handleChange('father_occupation', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Smt. Sunita Sharma"
                    value={formData.mother_name}
                    onChange={(e) => handleChange('mother_name', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Mother's Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Homemaker / Teacher"
                    value={formData.mother_occupation}
                    onChange={(e) => handleChange('mother_occupation', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Number of Brothers</label>
                  <input
                    type="number"
                    value={formData.brothers_count}
                    onChange={(e) => handleChange('brothers_count', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Married Brothers</label>
                  <input
                    type="number"
                    value={formData.married_brothers_count}
                    onChange={(e) => handleChange('married_brothers_count', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Number of Sisters</label>
                  <input
                    type="number"
                    value={formData.sisters_count}
                    onChange={(e) => handleChange('sisters_count', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Married Sisters</label>
                  <input
                    type="number"
                    value={formData.married_sisters_count}
                    onChange={(e) => handleChange('married_sisters_count', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Family Type</label>
                  <select
                    value={formData.family_type}
                    onChange={(e) => handleChange('family_type', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Nuclear Family">Nuclear Family</option>
                    <option value="Joint Family">Joint Family</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Family Values</label>
                  <select
                    value={formData.family_values}
                    onChange={(e) => handleChange('family_values', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Traditional">Traditional</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Liberal">Liberal</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-dark-800 mb-1">About Family</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your family background, values, and roots..."
                    value={formData.about_family}
                    onChange={(e) => handleChange('about_family', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: LIFESTYLE & HOBBIES */}
          {currentStep.id === 'lifestyle' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-maroon-600" /> Lifestyle & Hobbies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Diet Preference</label>
                  <select
                    value={formData.diet}
                    onChange={(e) => handleChange('diet', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Jain">Jain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Smoking</label>
                  <select
                    value={formData.smoking}
                    onChange={(e) => handleChange('smoking', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Never">Never</option>
                    <option value="Occasionally">Occasionally</option>
                    <option value="Regularly">Regularly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Drinking</label>
                  <select
                    value={formData.drinking}
                    onChange={(e) => handleChange('drinking', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Never">Never</option>
                    <option value="Occasionally">Occasionally</option>
                    <option value="Regularly">Regularly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Exercise Habit</label>
                  <select
                    value={formData.exercise}
                    onChange={(e) => handleChange('exercise', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Occasionally">Occasionally</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Never">Never</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-dark-800 mb-1">Hobbies & Activities</label>
                  <input
                    type="text"
                    placeholder="e.g. Reading, Traveling, Music, Cooking"
                    value={formData.hobbies}
                    onChange={(e) => handleChange('hobbies', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 10: PARTNER PREFERENCES */}
          {currentStep.id === 'preferences' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-maroon-600" /> Partner Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Min Age</label>
                  <input
                    type="number"
                    value={formData.pref_min_age}
                    onChange={(e) => handleChange('pref_min_age', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Max Age</label>
                  <input
                    type="number"
                    value={formData.pref_max_age}
                    onChange={(e) => handleChange('pref_max_age', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Religion</label>
                  <input
                    type="text"
                    placeholder="e.g. Hindu / Any"
                    value={formData.pref_religion}
                    onChange={(e) => handleChange('pref_religion', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Caste</label>
                  <input
                    type="text"
                    placeholder="e.g. Brahmin / Open to All"
                    value={formData.pref_caste}
                    onChange={(e) => handleChange('pref_caste', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Education</label>
                  <input
                    type="text"
                    placeholder="e.g. Graduate / Post Graduate"
                    value={formData.pref_education_level}
                    onChange={(e) => handleChange('pref_education_level', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Occupation / Profession</label>
                  <input
                    type="text"
                    placeholder="e.g. IT Professional / Doctor / Any"
                    value={formData.pref_occupation}
                    onChange={(e) => handleChange('pref_occupation', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 11: PHOTOS */}
          {currentStep.id === 'photos' && (
            <PhotoGalleryManager
              photos={photosList}
              onPhotosChange={(updatedPhotos, primaryUrl) => {
                setPhotosList(updatedPhotos);
                setFormData(prev => ({ ...prev, photo: primaryUrl }));
              }}
            />
          )}

          {/* STEP 12: REVIEW & SUBMIT */}
          {currentStep.id === 'review' && (
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Review Your Profile Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Basic Summary */}
                <div className="p-4 bg-cream-50 border border-rose-100 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center border-b border-rose-100 pb-1">
                    <span className="font-bold text-maroon-800">Basic Information</span>
                    <button type="button" onClick={() => setCurrentStepIndex(0)} className="text-maroon-600 hover:underline flex items-center gap-1 font-semibold">
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  </div>
                  <p><span className="text-muted-500">Name:</span> <strong>{formData.name || 'N/A'}</strong></p>
                  <p><span className="text-muted-500">Gender:</span> <strong>{formData.gender}</strong></p>
                  <p><span className="text-muted-500">Date of Birth:</span> <strong>{formData.date_of_birth || 'N/A'}</strong></p>
                  <p><span className="text-muted-500">Marital Status:</span> <strong>{formData.marital_status}</strong></p>
                </div>

                {/* Location Summary */}
                <div className="p-4 bg-cream-50 border border-rose-100 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center border-b border-rose-100 pb-1">
                    <span className="font-bold text-maroon-800">Contact & Location</span>
                    <button type="button" onClick={() => setCurrentStepIndex(1)} className="text-maroon-600 hover:underline flex items-center gap-1 font-semibold">
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  </div>
                  <p><span className="text-muted-500">City / State:</span> <strong>{formData.city || 'N/A'}, {formData.state || 'N/A'}</strong></p>
                  <p><span className="text-muted-500">Country:</span> <strong>{formData.country}</strong></p>
                  <p><span className="text-muted-500">Native Place:</span> <strong>{formData.native_place || 'N/A'}</strong></p>
                </div>

                {/* Religion Summary */}
                <div className="p-4 bg-cream-50 border border-rose-100 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center border-b border-rose-100 pb-1">
                    <span className="font-bold text-maroon-800">Religion & Culture</span>
                    <button type="button" onClick={() => setCurrentStepIndex(4)} className="text-maroon-600 hover:underline flex items-center gap-1 font-semibold">
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  </div>
                  <p><span className="text-muted-500">Religion / Caste:</span> <strong>{formData.religion} {formData.caste ? `(${formData.caste})` : ''}</strong></p>
                  <p><span className="text-muted-500">Mother Tongue:</span> <strong>{formData.mother_tongue}</strong></p>
                </div>

                {/* Education & Career Summary */}
                <div className="p-4 bg-cream-50 border border-rose-100 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center border-b border-rose-100 pb-1">
                    <span className="font-bold text-maroon-800">Education & Career</span>
                    <button type="button" onClick={() => setCurrentStepIndex(6)} className="text-maroon-600 hover:underline flex items-center gap-1 font-semibold">
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  </div>
                  <p><span className="text-muted-500">Degree:</span> <strong>{formData.degree || 'N/A'}</strong></p>
                  <p><span className="text-muted-500">Occupation:</span> <strong>{formData.occupation || 'N/A'}</strong></p>
                  <p><span className="text-muted-500">Income:</span> <strong>{formData.annual_income || 'N/A'}</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="pt-6 border-t border-rose-100 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="md"
              icon={ArrowLeft}
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0 || saving}
            >
              Previous Step
            </Button>

            {currentStepIndex < STEPS.length - 1 ? (
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={ArrowRight}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={Save}
                disabled={saving}
              >
                {saving ? 'Creating Matrimonial Profile...' : 'Save & Create Matrimonial Profile'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
