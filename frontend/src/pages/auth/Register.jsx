import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Lock, 
  Mail, 
  User,
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Button from '../../components/Button';
import VerifiedBadge from '../../components/VerifiedBadge';
import api from '../../api/api';

export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = (values) => {
    const errs = {};

    if (!values.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }

    if (!values.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!values.password) {
      errs.password = 'Please enter a password.';
    } else if (values.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!values.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (values.confirmPassword !== values.password) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    return errs;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  };

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await api.post('/auth/register/', {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirm_password: formData.confirmPassword,
        });
        setIsSubmitting(false);
        navigate('/login', { state: { registeredEmail: formData.email.trim() } });
      } catch (err) {
        setIsSubmitting(false);
        if (err.response && err.response.data) {
          const resData = err.response.data;
          if (typeof resData === 'object') {
            const fieldErrors = {};
            if (resData.email) {
              fieldErrors.email = Array.isArray(resData.email) ? resData.email[0] : resData.email;
            }
            if (resData.name) {
              fieldErrors.fullName = Array.isArray(resData.name) ? resData.name[0] : resData.name;
            }
            if (resData.password) {
              fieldErrors.password = Array.isArray(resData.password) ? resData.password[0] : resData.password;
            }
            if (resData.confirm_password) {
              fieldErrors.confirmPassword = Array.isArray(resData.confirm_password) ? resData.confirm_password[0] : resData.confirm_password;
            }
            if (resData.detail) {
              setApiError(resData.detail);
            }
            if (Object.keys(fieldErrors).length > 0) {
              setErrors((prev) => ({ ...prev, ...fieldErrors }));
            }
          } else {
            setApiError('Registration failed. Please try again.');
          }
        } else {
          setApiError('Network error. Please check your connection.');
        }
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream-100 via-rose-50/40 to-cream-50">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-rose-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        
        {/* ================= LEFT VISUAL SECTION (Desktop ~45% width) ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-maroon-800 via-maroon-700 to-maroon-900 text-cream-50 p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden order-2 lg:order-1">
          
          {/* Subtle Decorative Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-maroon-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10 space-y-3">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-900 shadow-md shadow-gold-500/20 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-dark-900" />
              </div>
              <div>
                <span className="font-serif font-bold text-2xl tracking-tight text-white block leading-tight">
                  Adarsh<span className="text-gold-400">Vivah</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-rose-200 tracking-widest block -mt-0.5">
                  Where Traditions Meet Timeless Connections
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed pt-2 font-normal">
              Begin your journey toward a meaningful relationship built on trust, values, and compatibility.
            </p>
          </div>

          {/* Visual Card / Couple Image */}
          <div className="relative z-10 my-6">
            <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-gold-400/60 shadow-xl group">
              <img 
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800" 
                alt="AdarshVivah Matrimonial" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800';
                }}
                className="w-full h-48 sm:h-56 lg:h-60 object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="font-semibold text-[11px]">100% Family-Assisted Platform</span>
                </div>
                <VerifiedBadge text="Verified" size="xs" />
              </div>
            </div>
          </div>

          {/* Trust Features Checklist */}
          <div className="relative z-10 pt-2 border-t border-maroon-600/60 space-y-2 text-xs text-rose-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Government ID & Phone Verified Profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Strict Photo & Contact Privacy Controls</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT FORM CARD (Desktop ~55% width) ================= */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between order-1 lg:order-2 bg-white">
          <div>
            
            {/* Header */}
            <div className="space-y-1.5 mb-8">
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-dark-800 tracking-tight">
                Create Your Account
              </h2>
              <p className="text-xs sm:text-sm text-muted-500">
                Start your journey toward a meaningful connection.
              </p>
            </div>

            {apiError && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {apiError}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* Field 1: Full Name */}
              <div>
                <label 
                  htmlFor="fullName" 
                  className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                    className={`w-full bg-cream-50 text-dark-800 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 border transition-colors font-medium focus:outline-none focus:ring-2 ${
                      touched.fullName && errors.fullName
                        ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                        : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                    }`}
                  />
                </div>
                {touched.fullName && errors.fullName && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <span>•</span> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Field 2: Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className={`w-full bg-cream-50 text-dark-800 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 border transition-colors font-medium focus:outline-none focus:ring-2 ${
                      touched.email && errors.email
                        ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                        : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <span>•</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Field 3: Password */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    placeholder="Create a password"
                    disabled={isSubmitting}
                    className={`w-full bg-cream-50 text-dark-800 text-xs sm:text-sm rounded-xl pl-10 pr-11 py-3 border transition-colors font-medium focus:outline-none focus:ring-2 ${
                      touched.password && errors.password
                        ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                        : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-400 hover:text-dark-800 transition-colors cursor-pointer focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <span>•</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Field 4: Confirm Password */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="Confirm your password"
                    disabled={isSubmitting}
                    className={`w-full bg-cream-50 text-dark-800 text-xs sm:text-sm rounded-xl pl-10 pr-11 py-3 border transition-colors font-medium focus:outline-none focus:ring-2 ${
                      touched.confirmPassword && errors.confirmPassword
                        ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                        : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-400 hover:text-dark-800 transition-colors cursor-pointer focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <span>•</span> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Primary Submit Button */}
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                fullWidth 
                icon={ArrowRight}
                disabled={isSubmitting}
                className="shadow-md shadow-maroon-900/10 mt-2"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>

            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-rose-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-muted-400 font-bold tracking-widest">OR</span>
              </div>
            </div>

            {/* Login CTA */}
            <div className="text-center bg-cream-50 p-4 rounded-2xl border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-medium text-muted-600">
                Already have an account?
              </span>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </div>

          </div>

          {/* Bottom Trust Badge */}
          <div className="pt-6 mt-6 border-t border-rose-100 flex items-center justify-center gap-2 text-xs text-muted-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Your privacy and security matter to us.</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Register;
