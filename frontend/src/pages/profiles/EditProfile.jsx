import React, { useState, useEffect } from 'react';
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
  Lock, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight,
  Upload,
  RefreshCw,
  X,
  ShieldCheck
} from 'lucide-react';
import Button from '../../components/Button';
import DashboardHeader from '../../components/DashboardHeader';
import IdentityVerificationCard from '../../components/IdentityVerificationCard';
import PhotoGalleryManager from '../../components/PhotoGalleryManager';
import profileApi from '../../api/profileApi';
import dashboardApi from '../../api/dashboardApi';

const SECTIONS = [
  { id: 'basic', label: '1. Basic Information', icon: User },
  { id: 'location', label: '2. Contact & Location', icon: MapPin },
  { id: 'physical', label: '3. Physical Attributes', icon: Activity },
  { id: 'about', label: '4. About Me', icon: FileText },
  { id: 'religion', label: '5. Religion & Culture', icon: Sparkles },
  { id: 'education', label: '6. Education', icon: GraduationCap },
  { id: 'professional', label: '7. Career / Profession', icon: Briefcase },
  { id: 'family', label: '8. Family Details', icon: HomeIcon },
  { id: 'lifestyle', label: '9. Lifestyle & Hobbies', icon: Coffee },
  { id: 'preferences', label: '10. Partner Preferences', icon: Heart },
  { id: 'photos', label: '11. Photos & Gallery', icon: Camera },
  { id: 'privacy', label: '12. Privacy & Settings', icon: Lock }
];

export const EditProfile = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photosList, setPhotosList] = useState([]);

  // Live Camera Capture state
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImageBlob, setCapturedImageBlob] = useState(null);
  const [capturedImagePreview, setCapturedImagePreview] = useState(null);

  const fileInputRef = React.useRef(null);
  const cameraInputRef = React.useRef(null);
  const galleryInputRef = React.useRef(null);
  const videoRef = React.useRef(null);

  const [formData, setFormData] = useState({
    // Basic
    name: '',
    gender: 'Male',
    date_of_birth: '',
    marital_status: 'Never Married',
    
    // Contact & Location
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    phone_number: '',
    native_place: '',

    // Physical
    height_feet_inches: "5' 8\"",
    height_cm: 172,
    weight_kg: '',
    body_type: '',
    complexion: '',
    physical_status: 'Normal',

    // About
    bio: '',

    // Religion & Culture
    religion: 'Hindu',
    caste: '',
    sub_caste: '',
    gothram: '',
    mother_tongue: 'Hindi',
    languages_known: '',

    // Education
    education_level: 'Bachelors',
    degree: '',
    field_of_study: '',
    institution: '',
    passing_year: '',
    additional_degree: '',

    // Professional
    employed_in: 'Private Sector',
    occupation: '',
    company_name: '',
    annual_income: '',
    work_location: '',
    experience_years: '',

    // Family
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

    // Lifestyle
    diet: 'Vegetarian',
    smoking: 'Never',
    drinking: 'Never',
    exercise: '',
    hobbies: '',
    interests: '',
    pets: '',

    // Partner Preferences
    pref_min_age: 22,
    pref_max_age: 30,
    pref_min_height: "5' 2\"",
    pref_max_height: "6' 0\"",
    pref_marital_status: '',
    pref_religion: '',
    pref_caste: '',
    pref_sub_caste: '',
    pref_mother_tongue: '',
    pref_education_level: '',
    pref_occupation: '',
    pref_min_income: '',
    pref_location: '',
    pref_diet: '',
    pref_smoking: '',
    pref_drinking: '',

    // Photos
    photo: '',

    // Privacy
    profile_visibility: 'All Members',
    show_contact: false
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await profileApi.getMe();
      const data = res.data;

      setFormData({
        name: data.name || '',
        gender: data.gender || 'Male',
        date_of_birth: data.date_of_birth || '',
        marital_status: data.marital_status || 'Never Married',

        country: data.country || 'India',
        state: data.state || '',
        city: data.city || '',
        pincode: data.pincode || '',
        phone_number: data.phone_number || '',
        native_place: data.family?.native_place || '',

        height_feet_inches: data.height_feet_inches || "5' 8\"",
        height_cm: data.height_cm || 172,
        weight_kg: data.weight_kg || '',
        body_type: data.body_type || '',
        complexion: data.complexion || '',
        physical_status: data.physical_status || 'Normal',

        bio: data.bio || data.about || '',

        religion: data.religion || 'Hindu',
        caste: data.caste || '',
        sub_caste: data.sub_caste || '',
        gothram: data.gothram || '',
        mother_tongue: data.mother_tongue || 'Hindi',
        languages_known: data.languages_known || '',

        education_level: data.education?.education_level || 'Bachelors',
        degree: data.education?.degree || '',
        field_of_study: data.education?.field_of_study || '',
        institution: data.education?.institution || '',
        passing_year: data.education?.passing_year || '',
        additional_degree: data.education?.additional_degree || '',

        employed_in: data.professional?.employed_in || 'Private Sector',
        occupation: data.professional?.occupation || '',
        company_name: data.professional?.company_name || '',
        annual_income: data.professional?.annual_income || '',
        work_location: data.professional?.work_location || '',
        experience_years: data.professional?.experience_years || '',

        father_name: data.family?.father_name || '',
        father_occupation: data.family?.father_occupation || '',
        mother_name: data.family?.mother_name || '',
        mother_occupation: data.family?.mother_occupation || '',
        brothers_count: data.family?.brothers_count || 0,
        sisters_count: data.family?.sisters_count || 0,
        married_brothers_count: data.family?.married_brothers_count || 0,
        married_sisters_count: data.family?.married_sisters_count || 0,
        family_type: data.family?.family_type || 'Nuclear Family',
        family_values: data.family?.family_values || 'Moderate',
        family_status: data.family?.family_status || 'Middle Class',
        about_family: data.family?.about_family || '',

        diet: data.lifestyle?.diet || 'Vegetarian',
        smoking: data.lifestyle?.smoking || 'Never',
        drinking: data.lifestyle?.drinking || 'Never',
        exercise: data.lifestyle?.exercise || '',
        hobbies: Array.isArray(data.lifestyle?.hobbies) ? data.lifestyle.hobbies.join(', ') : (data.lifestyle?.hobbies || ''),
        interests: data.lifestyle?.interests || '',
        pets: data.lifestyle?.pets || '',

        pref_min_age: data.partnerPreferences?.min_age || 22,
        pref_max_age: data.partnerPreferences?.max_age || 30,
        pref_min_height: data.partnerPreferences?.min_height || "5' 2\"",
        pref_max_height: data.partnerPreferences?.max_height || "6' 0\"",
        pref_marital_status: data.partnerPreferences?.marital_status || '',
        pref_religion: data.partnerPreferences?.religion || '',
        pref_caste: data.partnerPreferences?.caste || '',
        pref_sub_caste: data.partnerPreferences?.sub_caste || '',
        pref_mother_tongue: data.partnerPreferences?.mother_tongue || '',
        pref_education_level: data.partnerPreferences?.education_level || '',
        pref_occupation: data.partnerPreferences?.occupation || '',
        pref_min_income: data.partnerPreferences?.min_income || '',
        pref_location: data.partnerPreferences?.location || '',
        pref_diet: data.partnerPreferences?.diet || '',
        pref_smoking: data.partnerPreferences?.smoking || '',
        pref_drinking: data.partnerPreferences?.drinking || '',

        photo: data.photo || '',

        profile_visibility: data.profile_visibility || 'All Members',
        show_contact: Boolean(data.show_contact)
      });
      setPhotosList(data.photos_list || data.photos || []);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (showCameraModal && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showCameraModal, cameraStream]);

  const startCamera = async () => {
    setPhotoError('');
    setCapturedImageBlob(null);
    setCapturedImagePreview(null);
    setShowCameraModal(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('WebRTC getUserMedia not supported.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setCameraStream(stream);
    } catch (err) {
      console.warn('Live camera stream not available, falling back to capture input:', err);
      setShowCameraModal(false);
      // Fallback: click hidden camera input (<input type="file" accept="image/*" capture="user" />)
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        setPhotoError('Unable to access device camera.');
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
    setCapturedImageBlob(null);
    setCapturedImagePreview(null);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImagePreview(dataUrl);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `captured_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setCapturedImageBlob(file);
      }
    }, 'image/jpeg', 0.92);
  };

  const confirmCapturedPhoto = () => {
    if (capturedImageBlob) {
      const fileToUpload = capturedImageBlob;
      stopCamera();
      handleFileSelect(fileToUpload, true);
    }
  };

  const handleFileSelect = async (file, isPrimary = false) => {
    if (!file) return;
    setPhotoError('');

    // Client-side file size validation (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Selected file exceeds maximum limit of 5 MB.');
      return;
    }

    // Client-side format validation
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type.toLowerCase())) {
      setPhotoError('Unsupported file format. Please upload JPG, PNG, or WebP.');
      return;
    }

    setUploadingPhoto(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      if (isPrimary) {
        uploadData.append('is_primary', 'true');
      }

      await profileApi.uploadPhoto(uploadData);
      await fetchProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Photo upload error:', err);
      const msg = err.response?.data?.detail || 'Failed to upload image file to backend.';
      setPhotoError(msg);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!photoId) return;
    setUploadingPhoto(true);
    setPhotoError('');
    try {
      await profileApi.deletePhoto(photoId);
      await fetchProfile();
    } catch (err) {
      console.error('Photo deletion error:', err);
      setPhotoError('Failed to delete photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSetPrimary = async (photoId) => {
    if (!photoId) return;
    setUploadingPhoto(true);
    setPhotoError('');
    try {
      await profileApi.setPrimaryPhoto(photoId);
      await fetchProfile();
    } catch (err) {
      console.error('Set primary photo error:', err);
      setPhotoError('Failed to set primary photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaved(false);
    setErrorMsg('');

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

      education: {
        education_level: formData.education_level,
        degree: formData.degree,
        field_of_study: formData.field_of_study,
        institution: formData.institution,
        passing_year: formData.passing_year,
        additional_degree: formData.additional_degree
      },

      professional: {
        employed_in: formData.employed_in,
        occupation: formData.occupation,
        company_name: formData.company_name,
        annual_income: formData.annual_income,
        work_location: formData.work_location,
        experience_years: formData.experience_years
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
        min_age: Number(formData.pref_min_age) || null,
        max_age: Number(formData.pref_max_age) || null,
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
      },

      photo: formData.photo,
      profile_visibility: formData.profile_visibility,
      show_contact: formData.show_contact
    };

    try {
      await profileApi.updateMe(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMsg('Failed to save profile changes. Please check fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-500 font-medium flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-maroon-600" />
        Loading matrimonial profile editor...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Edit My Matrimonial Profile" 
        subtitle="Manage and update your matrimonial profile details and preferences."
      />

      {saved && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Matrimonial profile updated successfully in MySQL database!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid Layout: Navigation Tabs (Left) + Form Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Section Navigation Tabs */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-rose-200/80 p-3 shadow-xs space-y-1">
          <h4 className="text-xs font-bold text-maroon-800 uppercase tracking-wider px-3 py-2 border-b border-rose-100">
            Profile Sections
          </h4>
          {SECTIONS.map((sec) => {
            const IconComponent = sec.icon;
            const isCurrent = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isCurrent 
                    ? 'bg-maroon-600 text-white shadow-xs' 
                    : 'text-dark-700 hover:bg-rose-50 hover:text-maroon-700'
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span className="truncate">{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Editor Form */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-rose-200 p-6 shadow-xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TAB 1: BASIC INFORMATION */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-maroon-600" /> Basic Information
                </h3>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Honey Verma"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Marital Status *</label>
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
            )}

            {/* TAB 2: CONTACT & LOCATION */}
            {activeTab === 'location' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-maroon-600" /> Contact & Location
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">PIN Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 400001"
                      value={formData.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
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

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Ancestral / Native Place</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={formData.native_place}
                    onChange={(e) => handleChange('native_place', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: PHYSICAL ATTRIBUTES */}
            {activeTab === 'physical' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-maroon-600" /> Physical Attributes
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Height (Feet & Inches)</label>
                    <input
                      type="text"
                      placeholder="e.g. 5' 10&quot;"
                      value={formData.height_feet_inches}
                      onChange={(e) => handleChange('height_feet_inches', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="e.g. 70"
                      value={formData.weight_kg}
                      onChange={(e) => handleChange('weight_kg', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Body Type</label>
                    <select
                      value={formData.body_type}
                      onChange={(e) => handleChange('body_type', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    >
                      <option value="">Select Body Type</option>
                      <option value="Slim">Slim</option>
                      <option value="Athletic">Athletic</option>
                      <option value="Average">Average</option>
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
                      <option value="">Select Complexion</option>
                      <option value="Fair">Fair</option>
                      <option value="Very Fair">Very Fair</option>
                      <option value="Wheatish">Wheatish</option>
                      <option value="Dark">Dark</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Physical Status</label>
                  <select
                    value={formData.physical_status}
                    onChange={(e) => handleChange('physical_status', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="Normal">Normal / Healthy</option>
                    <option value="Physically Challenged">Physically Challenged</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 4: ABOUT ME */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-maroon-600" /> About Me & Personality
                </h3>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Personal Bio</label>
                  <textarea
                    rows="5"
                    maxLength={1000}
                    placeholder="Tell potential matches about your personality, values, interests and what you are looking for in a partner..."
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                  <span className="text-[11px] text-muted-400 mt-1 block text-right">
                    {formData.bio.length} / 1000 characters
                  </span>
                </div>
              </div>
            )}

            {/* TAB 5: RELIGION & CULTURE */}
            {activeTab === 'religion' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-maroon-600" /> Religious & Cultural Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Religion</label>
                    <input
                      type="text"
                      placeholder="e.g. Hindu / Sikh / Jain / Muslim / Christian"
                      value={formData.religion}
                      onChange={(e) => handleChange('religion', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Caste</label>
                    <input
                      type="text"
                      placeholder="e.g. Brahmin / Maratha / Rajput / Jatt"
                      value={formData.caste}
                      onChange={(e) => handleChange('caste', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Sub-Caste</label>
                    <input
                      type="text"
                      placeholder="e.g. Kanyakubj / Vadama"
                      value={formData.sub_caste}
                      onChange={(e) => handleChange('sub_caste', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Gothram</label>
                    <input
                      type="text"
                      placeholder="e.g. Kashyap / Vashishtha"
                      value={formData.gothram}
                      onChange={(e) => handleChange('gothram', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Mother Tongue</label>
                    <input
                      type="text"
                      placeholder="e.g. Hindi / Marathi / Tamil"
                      value={formData.mother_tongue}
                      onChange={(e) => handleChange('mother_tongue', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Languages Known</label>
                    <input
                      type="text"
                      placeholder="e.g. English, Hindi, Marathi"
                      value={formData.languages_known}
                      onChange={(e) => handleChange('languages_known', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-maroon-600" /> Educational Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Education Level</label>
                    <select
                      value={formData.education_level}
                      onChange={(e) => handleChange('education_level', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    >
                      <option value="Doctorate">Doctorate / Ph.D.</option>
                      <option value="Master / Post Graduate">Master / Post Graduate</option>
                      <option value="Bachelor / Graduate">Bachelor / Graduate</option>
                      <option value="Diploma">Diploma</option>
                      <option value="High School">High School</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Highest Degree</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech / MBA / MBBS"
                      value={formData.degree}
                      onChange={(e) => handleChange('degree', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Field of Study</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science / Finance"
                      value={formData.field_of_study}
                      onChange={(e) => handleChange('field_of_study', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">University / Institution</label>
                    <input
                      type="text"
                      placeholder="e.g. IIT Bombay / University of Mumbai"
                      value={formData.institution}
                      onChange={(e) => handleChange('institution', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: PROFESSIONAL */}
            {activeTab === 'professional' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-maroon-600" /> Career & Professional Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Employment Status</label>
                    <select
                      value={formData.employed_in}
                      onChange={(e) => handleChange('employed_in', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    >
                      <option value="Private Sector">Private Sector</option>
                      <option value="Government / PSU">Government / PSU</option>
                      <option value="Business / Entrepreneur">Business / Entrepreneur</option>
                      <option value="Self Employed">Self Employed</option>
                      <option value="Not Working">Not Working</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Occupation / Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Engineer / Manager"
                      value={formData.occupation}
                      onChange={(e) => handleChange('occupation', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Global Tech Solutions"
                      value={formData.company_name}
                      onChange={(e) => handleChange('company_name', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Annual Income</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹20 - 25 Lakhs P.A."
                      value={formData.annual_income}
                      onChange={(e) => handleChange('annual_income', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: FAMILY */}
            {activeTab === 'family' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <HomeIcon className="w-5 h-5 text-maroon-600" /> Family Background
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Father's Occupation</label>
                    <input
                      type="text"
                      placeholder="e.g. Retd. Senior Officer / Businessman"
                      value={formData.father_occupation}
                      onChange={(e) => handleChange('father_occupation', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Mother's Occupation</label>
                    <input
                      type="text"
                      placeholder="e.g. Homemaker / Professor"
                      value={formData.mother_occupation}
                      onChange={(e) => handleChange('mother_occupation', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Family Type</label>
                    <select
                      value={formData.family_type}
                      onChange={(e) => handleChange('family_type', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    >
                      <option value="Nuclear Family">Nuclear Family</option>
                      <option value="Joint Family">Joint Family</option>
                      <option value="Extended Family">Extended Family</option>
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
                </div>
              </div>
            )}

            {/* TAB 9: LIFESTYLE */}
            {activeTab === 'lifestyle' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-maroon-600" /> Lifestyle & Habits
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Diet</label>
                    <select
                      value={formData.diet}
                      onChange={(e) => handleChange('diet', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Eggetarian">Eggetarian</option>
                      <option value="Vegan">Vegan</option>
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
                      <option value="Socially">Socially</option>
                      <option value="Regularly">Regularly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Hobbies & Interests</label>
                  <input
                    type="text"
                    placeholder="e.g. Classical Music, Reading, Yoga, Travel, Fitness"
                    value={formData.hobbies}
                    onChange={(e) => handleChange('hobbies', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 10: PARTNER PREFERENCES */}
            {activeTab === 'preferences' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-maroon-600" /> Partner Preferences
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Minimum Preferred Age</label>
                    <input
                      type="number"
                      placeholder="e.g. 23"
                      value={formData.pref_min_age}
                      onChange={(e) => handleChange('pref_min_age', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Maximum Preferred Age</label>
                    <input
                      type="number"
                      placeholder="e.g. 30"
                      value={formData.pref_max_age}
                      onChange={(e) => handleChange('pref_max_age', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Religion</label>
                    <input
                      type="text"
                      placeholder="e.g. Hindu / Open to All"
                      value={formData.pref_religion}
                      onChange={(e) => handleChange('pref_religion', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Caste / Community</label>
                    <input
                      type="text"
                      placeholder="e.g. Brahmin / Open to All"
                      value={formData.pref_caste}
                      onChange={(e) => handleChange('pref_caste', e.target.value)}
                      className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Preferred Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai / Maharashtra / Open to Relocation"
                    value={formData.pref_location}
                    onChange={(e) => handleChange('pref_location', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 11: PHOTOS */}
            {activeTab === 'photos' && (
              <PhotoGalleryManager
                photos={photosList}
                onPhotosChange={(updatedPhotos, primaryUrl) => {
                  setPhotosList(updatedPhotos);
                  setFormData(prev => ({ ...prev, photo: primaryUrl }));
                }}
              />
            )}

            {/* Identity verification is temporarily disabled and will be re-integrated later. */}

            {/* TAB 13: PRIVACY */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-dark-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-maroon-600" /> Privacy & Visibility
                </h3>

                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Profile Visibility</label>
                  <select
                    value={formData.profile_visibility}
                    onChange={(e) => handleChange('profile_visibility', e.target.value)}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="All Members">Visible to All Registered Members</option>
                    <option value="Connected Only">Visible Only to Accepted Connections</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="show_contact"
                    checked={formData.show_contact}
                    onChange={(e) => handleChange('show_contact', e.target.checked)}
                    className="w-4 h-4 text-maroon-600 rounded border-rose-300 focus:ring-maroon-500"
                  />
                  <label htmlFor="show_contact" className="text-xs font-medium text-dark-800">
                    Allow connected matches to view my phone number / contact details
                  </label>
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="pt-4 border-t border-rose-100 flex items-center justify-between">
              <span className="text-xs text-muted-500 font-medium">
                Changes saved directly to Django/MySQL backend.
              </span>
              <Button type="submit" variant="primary" size="md" icon={Save} disabled={saving}>
                {saving ? 'Saving...' : 'Save & Update Profile'}
              </Button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default EditProfile;
