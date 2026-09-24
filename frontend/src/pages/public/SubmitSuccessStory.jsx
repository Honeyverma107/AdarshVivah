import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  HeartHandshake, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  Lock,
  ArrowLeft,
  Clock
} from 'lucide-react';
import SectionHeading from '../../components/SectionHeading';
import Button from '../../components/Button';
import storyApi from '../../api/storyApi';

export const SubmitSuccessStory = () => {
  const navigate = useNavigate();

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
  const [serverError, setServerError] = useState('');

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const validate = () => {
    const errs = {};
    if (!coupleName.trim()) {
      errs.coupleName = 'Please enter the couple name.';
    }
    if (!marriageDate) {
      errs.marriageDate = 'Please select your marriage date.';
    }
    if (!location.trim()) {
      errs.location = 'Please enter your city/location.';
    }
    if (!story.trim()) {
      errs.story = 'Please share your story.';
    }
    if (!consent) {
      errs.consent = 'Please agree to the terms to submit your story.';
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
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: 'File size exceeds maximum limit of 5 MB.' }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
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

        await storyApi.submitSuccessStory(formData);

        setIsSubmitting(false);
        setIsSubmitted(true);
      } catch (err) {
        console.error('Error submitting success story:', err);
        setIsSubmitting(false);
        const errorDetail = err.response?.data?.detail || err.response?.data?.message || 'Failed to submit success story. Please try again.';
        setServerError(errorDetail);
      }
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Top Back Navigation Link */}
      <div>
        <Link 
          to="/success-stories" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-maroon-700 hover:text-maroon-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Success Stories
        </Link>
      </div>

      <SectionHeading
        badge="Share Your Journey"
        title="Submit Your Success Story"
        subtitle="Inspire thousands of families across India by sharing how you found your soulmate on AdarshVivah."
      />

      <div className="bg-white rounded-3xl border-2 border-gold-300 shadow-xl overflow-hidden p-6 sm:p-10 relative">
        
        {isSubmitted ? (
          /* SUCCESS STATE */
          <div className="text-center py-10 space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-md">
              <Heart className="w-10 h-10 fill-emerald-600" />
            </div>

            <div className="space-y-3 max-w-lg mx-auto">
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-dark-800">
                Thank You for Sharing Your Story! ❤️
              </h3>
              <p className="text-sm text-muted-600 leading-relaxed">
                Thank you for sharing your story. Your story has been submitted for review. Once approved by our team, it will be published on AdarshVivah.
              </p>
            </div>

            {/* Submitted Story Preview */}
            <div className="bg-cream-50 p-6 rounded-2xl border border-rose-200 max-w-lg mx-auto text-left space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-base text-dark-800">{coupleName}</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" /> Pending Review
                </span>
              </div>
              <p className="text-xs text-maroon-700 font-semibold">{location} • Married {marriageDate}</p>
              <p className="text-xs text-muted-600 italic line-clamp-3">"{story}"</p>
            </div>

            <div className="pt-6 flex flex-wrap justify-center gap-4">
              <Link to="/success-stories">
                <Button variant="primary" size="lg">
                  View Success Stories
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  setCoupleName('');
                  setMarriageDate('');
                  setLocation('');
                  setStory('');
                  setPhotoFile(null);
                  setPhotoPreview(null);
                  setConsent(false);
                  setIsSubmitted(false);
                }}
              >
                Submit Another Story
              </Button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {serverError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Field 1: Couple Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-2">
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
                  className={`w-full bg-cream-50 text-dark-800 text-sm rounded-xl px-4 py-3.5 border transition-colors font-medium focus:outline-none focus:ring-2 ${
                    touched.coupleName && errors.coupleName
                      ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                      : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                  }`}
                />
                {touched.coupleName && errors.coupleName && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.coupleName}
                  </p>
                )}
              </div>

              {/* Field 2: Marriage Date */}
              <div>
                <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-2">
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
                  className={`w-full bg-cream-50 text-dark-800 text-sm rounded-xl px-4 py-3.5 border transition-colors font-medium focus:outline-none focus:ring-2 ${
                    touched.marriageDate && errors.marriageDate
                      ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                      : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                  }`}
                />
                {touched.marriageDate && errors.marriageDate && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.marriageDate}
                  </p>
                )}
              </div>

              {/* Field 3: City / Location */}
              <div>
                <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-2">
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
                  className={`w-full bg-cream-50 text-dark-800 text-sm rounded-xl px-4 py-3.5 border transition-colors font-medium focus:outline-none focus:ring-2 ${
                    touched.location && errors.location
                      ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                      : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                  }`}
                />
                {touched.location && errors.location && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.location}
                  </p>
                )}
              </div>

            </div>

            {/* Field 4: Success Story Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider">
                  Success Story <span className="text-maroon-600">*</span>
                </label>
                <span className={`text-xs font-semibold ${story.length > 480 ? 'text-red-600' : 'text-muted-400'}`}>
                  {story.length} / 500
                </span>
              </div>
              <textarea
                rows={5}
                maxLength={500}
                value={story}
                onChange={(e) => {
                  setStory(e.target.value);
                  if (errors.story) setErrors((prev) => ({ ...prev, story: null }));
                }}
                onBlur={() => handleBlur('story')}
                placeholder="Tell us how you met through AdarshVivah and what made your matrimonial journey special..."
                className={`w-full bg-cream-50 text-dark-800 text-sm rounded-xl p-4 border transition-colors font-medium focus:outline-none focus:ring-2 resize-none ${
                  touched.story && errors.story
                    ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                    : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                }`}
              />
              {touched.story && errors.story && (
                <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.story}
                </p>
              )}
            </div>

            {/* Field 5: Couple Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-2">
                Couple Photo <span className="text-muted-400 font-normal lowercase">(optional)</span>
              </label>

              {photoPreview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-gold-400 h-52 bg-cream-100 flex items-center justify-center group max-w-md">
                  <img 
                    src={photoPreview} 
                    alt="Couple preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-dark-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-rose-200 bg-cream-50/60 hover:bg-rose-50/50 transition-colors cursor-pointer text-center group max-w-md">
                  <Upload className="w-7 h-7 text-maroon-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-dark-800">Click to upload couple photo</span>
                  <span className="text-[11px] text-muted-400 mt-1">JPG, PNG, or WebP (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              {errors.photo && (
                <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.photo}
                </p>
              )}
            </div>

            {/* Field 6: Consent Checkbox */}
            <div className="pt-4 border-t border-rose-100 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (errors.consent) setErrors((prev) => ({ ...prev, consent: null }));
                  }}
                  className="w-4 h-4 text-maroon-600 rounded border-rose-300 focus:ring-maroon-600 cursor-pointer mt-0.5 shrink-0"
                />
                <span className="text-xs sm:text-sm text-dark-800 font-medium leading-relaxed">
                  I agree to share this success story publicly on AdarshVivah. <span className="text-maroon-600">*</span>
                </span>
              </label>
              {touched.consent && errors.consent && (
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1 pl-7">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.consent}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                <Lock className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Your story will be reviewed by our administration team before being published.</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end gap-4 border-t border-rose-100">
              <Link to="/success-stories">
                <Button type="button" variant="ghost" size="lg" disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                icon={isSubmitting ? Loader2 : Sparkles}
                disabled={isSubmitting}
                className="shadow-lg shadow-maroon-900/10 min-w-[180px]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Story'}
              </Button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default SubmitSuccessStory;
