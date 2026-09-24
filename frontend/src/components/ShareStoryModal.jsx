import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  HeartHandshake, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Calendar, 
  MapPin, 
  Sparkles,
  Lock,
  Clock
} from 'lucide-react';
import Button from './Button';
import storyApi from '../api/storyApi';

export const ShareStoryModal = ({ isOpen, onClose, onStorySubmit }) => {
  const [coupleName, setCoupleName] = useState('');
  const [marriageDate, setMarriageDate] = useState('');
  const [location, setLocation] = useState('');
  const [story, setStory] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  // Reset form on open/close
  useEffect(() => {
    if (!isOpen) {
      setCoupleName('');
      setMarriageDate('');
      setLocation('');
      setStory('');
      setPhotoFile(null);
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhotoPreview(null);
      setConsent(false);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!coupleName.trim()) {
      errs.coupleName = 'Please enter the couple name.';
    }
    if (!marriageDate) {
      errs.marriageDate = 'Please select your marriage date.';
    }
    if (!location.trim()) {
      errs.location = 'Please enter your location.';
    }
    if (!story.trim()) {
      errs.story = 'Please share your story.';
    }
    if (!consent) {
      errs.consent = 'Please agree to the sharing terms.';
    }
    return errs;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setErrors((prev) => ({ ...prev, photo: 'Please select a valid image file (JPEG, PNG, or WebP).' }));
        return;
      }
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      setErrors((prev) => ({ ...prev, photo: null }));
    }
  };

  const handleRemovePhoto = () => {
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const formatMarriageDate = (rawDate) => {
    if (!rawDate) return 'Recently Married';
    try {
      const dateObj = new Date(rawDate);
      return dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return rawDate;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      coupleName: true,
      marriageDate: true,
      location: true,
      story: true,
      consent: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append('couple_name', coupleName.trim());
        formData.append('marriage_date', marriageDate);
        formData.append('location', location.trim());
        formData.append('story', story.trim());
        if (photoFile) {
          formData.append('image', photoFile);
        }

        const res = await storyApi.submitSuccessStory(formData);
        const savedStory = res?.data || {
          id: Date.now(),
          coupleName: coupleName.trim(),
          location: location.trim(),
          marriageDate: marriageDate,
          story: story.trim(),
          image: photoPreview || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
          badge: 'Submitted Story',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        };

        if (onStorySubmit) {
          onStorySubmit(savedStory);
        }

        setIsSubmitting(false);
        setIsSubmitted(true);
      } catch (err) {
        console.error('Error submitting story in modal:', err);
        setIsSubmitting(false);
        setErrors((prev) => ({
          ...prev,
          submit: err.response?.data?.detail || 'Failed to submit story. Please try again.',
        }));
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/70 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) handleClose();
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full border-2 border-gold-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-maroon-800 via-maroon-700 to-maroon-900 text-cream-50 p-6 flex items-center justify-between border-b border-gold-500/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-dark-900 flex items-center justify-center shadow-md">
              <HeartHandshake className="w-5 h-5 fill-dark-900" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-white leading-tight">
                Share Your AdarshVivah Story
              </h3>
              <p className="text-xs text-rose-200">
                Inspire other families on their matrimonial journey
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="p-2 rounded-xl text-rose-200 hover:text-white hover:bg-maroon-600/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {isSubmitted ? (
            /* SUCCESS STATE SCREEN */
            <div className="text-center py-6 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-md">
                <Heart className="w-8 h-8 fill-emerald-600" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-bold text-2xl text-dark-800">
                  Thank You for Sharing Your Story! ❤️
                </h4>
                <p className="text-xs sm:text-sm text-muted-500 max-w-md mx-auto leading-relaxed">
                  Your story has been submitted successfully and is now awaiting review. Once approved, it can become part of the AdarshVivah Success Stories.
                </p>
              </div>

              {/* Submitted Story Preview Card */}
              <div className="bg-cream-50 p-4 rounded-2xl border border-rose-200 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-dark-800">{coupleName}</span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-700" /> Pending Review
                  </span>
                </div>
                <p className="text-xs text-maroon-700 font-medium">{location} • Married {formatMarriageDate(marriageDate)}</p>
                <p className="text-xs text-muted-600 italic line-clamp-2">"{story}"</p>
              </div>

              <div className="pt-4">
                <Button variant="gold" size="lg" onClick={handleClose} className="min-w-[140px]">
                  Done
                </Button>
              </div>
            </div>
          ) : (
            /* FORM STATE SCREEN */
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              <p className="text-xs text-muted-500 leading-relaxed">
                Tell us about your journey and inspire other families looking for a meaningful connection.
              </p>

              {/* Field 1: Couple Name */}
              <div>
                <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5">
                  Couple Name <span className="text-maroon-600">*</span>
                </label>
                <input
                  type="text"
                  value={coupleName}
                  onChange={(e) => {
                    setCoupleName(e.target.value);
                    if (errors.coupleName) setErrors((prev) => ({ ...prev, coupleName: null }));
                  }}
                  onBlur={() => handleBlur('coupleName')}
                  placeholder="e.g. Aarav & Ananya"
                  className={`w-full bg-cream-50 text-dark-800 text-xs sm:text-sm rounded-xl px-4 py-3 border transition-colors font-medium focus:outline-none focus:ring-2 ${
                    touched.coupleName && errors.coupleName
                      ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                      : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                  }`}
                />
                {touched.coupleName && errors.coupleName && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.coupleName}
                  </p>
                )}
              </div>

              {/* Grid Field: Marriage Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field 2: Marriage Date */}
                <div>
                  <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5">
                    Marriage Date <span className="text-maroon-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={marriageDate}
                    onChange={(e) => {
                      setMarriageDate(e.target.value);
                      if (errors.marriageDate) setErrors((prev) => ({ ...prev, marriageDate: null }));
                    }}
                    onBlur={() => handleBlur('marriageDate')}
                    className={`w-full bg-cream-50 text-dark-800 text-xs sm:text-sm rounded-xl px-4 py-3 border transition-colors font-medium focus:outline-none focus:ring-2 ${
                      touched.marriageDate && errors.marriageDate
                        ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                        : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                    }`}
                  />
                  {touched.marriageDate && errors.marriageDate && (
                    <p className="mt-1.5 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.marriageDate}
                    </p>
                  )}
                </div>

                {/* Field 3: City / Location */}
                <div>
                  <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5">
                    City / Location <span className="text-maroon-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
                    }}
                    onBlur={() => handleBlur('location')}
                    placeholder="e.g. Indore, Madhya Pradesh"
                    className={`w-full bg-cream-50 text-dark-800 text-xs sm:text-sm rounded-xl px-4 py-3 border transition-colors font-medium focus:outline-none focus:ring-2 ${
                      touched.location && errors.location
                        ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                        : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                    }`}
                  />
                  {touched.location && errors.location && (
                    <p className="mt-1.5 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.location}
                    </p>
                  )}
                </div>

              </div>

              {/* Field 4: Your Story Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider">
                    Your Story <span className="text-maroon-600">*</span>
                  </label>
                  <span className={`text-[11px] font-semibold ${story.length > 480 ? 'text-red-600' : 'text-muted-400'}`}>
                    {story.length} / 500
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={500}
                  value={story}
                  onChange={(e) => {
                    setStory(e.target.value);
                    if (errors.story) setErrors((prev) => ({ ...prev, story: null }));
                  }}
                  onBlur={() => handleBlur('story')}
                  placeholder="Tell us how you met through AdarshVivah and what made your journey special..."
                  className={`w-full bg-cream-50 text-dark-800 text-xs sm:text-sm rounded-xl p-4 border transition-colors font-medium focus:outline-none focus:ring-2 resize-none ${
                    touched.story && errors.story
                      ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                      : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                  }`}
                />
                {touched.story && errors.story && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.story}
                  </p>
                )}
              </div>

              {/* Field 5: Couple Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5">
                  Couple Photo <span className="text-muted-400 font-normal lowercase">(optional)</span>
                </label>
                
                {photoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-gold-400 h-44 bg-cream-100 flex items-center justify-center group">
                    <img 
                      src={photoPreview} 
                      alt="Couple preview" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-dark-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-1 shadow-md hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-rose-200 bg-cream-50/60 hover:bg-rose-50/50 transition-colors cursor-pointer text-center group">
                    <Upload className="w-6 h-6 text-maroon-600 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-dark-800">Click to upload photo</span>
                    <span className="text-[10px] text-muted-400 mt-0.5">JPG, PNG, or WebP (Max 5MB)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.photo && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.photo}
                  </p>
                )}
              </div>

              {/* Field 6: Consent Checkbox & Privacy Note */}
              <div className="pt-2 border-t border-rose-100 space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (errors.consent) setErrors((prev) => ({ ...prev, consent: null }));
                    }}
                    className="w-4 h-4 text-maroon-600 rounded border-rose-300 focus:ring-maroon-600 cursor-pointer mt-0.5 shrink-0"
                  />
                  <span className="text-xs text-dark-800 font-medium leading-normal">
                    I agree to share this story publicly on AdarshVivah. <span className="text-maroon-600">*</span>
                  </span>
                </label>
                {touched.consent && errors.consent && (
                  <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1 pl-6">
                    <AlertCircle className="w-3 h-3" /> {errors.consent}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-muted-500 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                  <Lock className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>Your story will be reviewed by our team before it is published publicly.</span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-rose-100">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="md" 
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="md" 
                  icon={isSubmitting ? Loader2 : Sparkles}
                  disabled={isSubmitting}
                  className="shadow-md shadow-maroon-900/10 min-w-[160px]"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Your Story'}
                </Button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default ShareStoryModal;
