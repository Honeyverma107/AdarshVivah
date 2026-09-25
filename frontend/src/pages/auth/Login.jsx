import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Edit2,
  RefreshCw
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import Button from '../../components/Button';
import VerifiedBadge from '../../components/VerifiedBadge';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOtp, verifyOtp, loginWithGoogle } = useAuth();

  // Screen step: 'EMAIL' (Step 1) | 'OTP' (Step 2)
  const [step, setStep] = useState('EMAIL');

  // Input states
  const [email, setEmail] = useState(location.state?.registeredEmail || '');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Cooldown timer state for Resend OTP (60 seconds)
  const [cooldown, setCooldown] = useState(0);

  // Loading & Error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Resend cooldown timer effect
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Mask email for OTP step display (e.g. u***@gmail.com)
  const getMaskedEmail = (emailStr) => {
    if (!emailStr || !emailStr.includes('@')) return emailStr;
    const [name, domain] = emailStr.split('@');
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  };

  // Step 1: Send OTP handler
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setEmailError('');
    setGeneralError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setEmailError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendOtp(cleanEmail);

      if (result.success) {
        setStep('OTP');
        setCooldown(60);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpError('');
        // Auto-focus first digit input after transition
        setTimeout(() => {
          if (otpInputRefs[0].current) otpInputRefs[0].current.focus();
        }, 100);
      } else {
        setGeneralError(result.error);
      }
    } catch (err) {
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (cooldown > 0 || isSubmitting) return;
    setOtpError('');
    setGeneralError('');
    setIsSubmitting(true);

    try {
      const result = await sendOtp(email.trim().toLowerCase());

      if (result.success) {
        setCooldown(60);
        setOtpDigits(['', '', '', '', '', '']);
        if (otpInputRefs[0].current) otpInputRefs[0].current.focus();
      } else {
        setOtpError(result.error);
      }
    } catch (err) {
      setOtpError('Failed to resend verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: OTP Digit inputs handling (Auto-focus, Backspace, Paste)
  const handleOtpChange = (index, value) => {
    // Clean to digits only
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    if (otpError) setOtpError('');

    // Auto-focus next input
    if (digit && index < 5) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs[index - 1].current?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setOtpDigits(newDigits);
      const targetIndex = Math.min(pastedData.length, 5);
      otpInputRefs[targetIndex].current?.focus();
    }
  };

  // Step 2: Verify OTP submission
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setOtpError('');
    setGeneralError('');

    const otpCode = otpDigits.join('');
    if (otpCode.length < 6) {
      setOtpError('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await verifyOtp(email.trim().toLowerCase(), otpCode);

      if (result.success) {
        if (result.hasProfile) {
          navigate('/dashboard');
        } else {
          navigate('/create-profile');
        }
      } else {
        setOtpError(result.error);
      }
    } catch (err) {
      setOtpError('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth Login Trigger
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleSubmitting(true);
      setGeneralError('');

      // Send credential/access_token tokenResponse to backend
      const credential = tokenResponse.access_token || tokenResponse.credential;
      const result = await loginWithGoogle(credential);
      setIsGoogleSubmitting(false);

      if (result.success) {
        if (result.hasProfile) {
          navigate('/dashboard');
        } else {
          navigate('/create-profile');
        }
      } else {
        setGeneralError(result.error);
      }
    },
    onError: (error) => {
      console.error('Google OAuth Error:', error);
      setIsGoogleSubmitting(false);
      setGeneralError('Google login was cancelled or failed to authenticate.');
    }
  });

  const handleGoogleClick = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId || googleClientId.includes('placeholder')) {
      setGeneralError('Google Client ID is not configured. Please add VITE_GOOGLE_CLIENT_ID to environment variables.');
      return;
    }
    setIsGoogleSubmitting(true);
    triggerGoogleLogin();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream-100 via-rose-50/40 to-cream-50">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-rose-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        
        {/* ================= LEFT VISUAL SECTION (~45% width) ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-maroon-800 via-maroon-700 to-maroon-900 text-cream-50 p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden order-2 lg:order-1">
          
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

          {/* Visual Matrimonial Couple Card */}
          <div className="relative z-10 my-6">
            <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-gold-400/60 shadow-xl group">
              <img 
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800" 
                alt="AdarshVivah Matrimonial Couple" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800';
                }}
                className="w-full h-52 sm:h-60 lg:h-64 object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
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

          {/* Trust Features */}
          <div className="relative z-10 pt-2 border-t border-maroon-600/60 space-y-2 text-xs text-rose-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Email & Phone Verified Profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Strict Photo & Privacy Controls</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT AUTHENTICATION CARD (~55% width) ================= */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between order-1 lg:order-2 bg-white">
          <div>
            
            {/* Session Expired Banner */}
            {(location.search.includes('session_expired=true') || location.state?.sessionExpired) && !generalError && (
              <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-900 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Your session has expired. Please sign in again.</span>
              </div>
            )}

            {/* General API Error Banner */}
            {generalError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            {/* SCREEN STEP 1: EMAIL ADDRESS INPUT */}
            {step === 'EMAIL' && (
              <div className="space-y-6 animate-fadeIn">
                
                <div className="space-y-1.5">
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-dark-800 tracking-tight">
                    Welcome Back
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-500">
                    Enter your email to receive a secure login verification code.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
                  
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
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                          if (generalError) setGeneralError('');
                        }}
                        placeholder="Enter your email"
                        disabled={isSubmitting || isGoogleSubmitting}
                        className={`w-full bg-cream-50 text-dark-800 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3.5 border transition-colors font-medium focus:outline-none focus:ring-2 ${
                          emailError
                            ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                            : 'border-rose-200 focus:border-maroon-600 focus:ring-maroon-600/20'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="mt-1.5 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {emailError}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                    icon={isSubmitting ? Loader2 : ArrowRight}
                    disabled={isSubmitting || isGoogleSubmitting}
                    className="shadow-md shadow-maroon-900/10 mt-2"
                  >
                    {isSubmitting ? 'Sending Code...' : 'Continue with Email'}
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

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-dark-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  {isGoogleSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-maroon-600" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>{isGoogleSubmitting ? 'Connecting with Google...' : 'Continue with Google'}</span>
                </button>

                {/* Registration CTA */}
                <div className="pt-2 text-center">
                  <p className="text-xs text-muted-600 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-maroon-700 hover:text-maroon-900 hover:underline transition-colors">
                      Create Account
                    </Link>
                  </p>
                </div>

              </div>
            )}

            {/* SCREEN STEP 2: 6-DIGIT OTP VERIFICATION */}
            {step === 'OTP' && (
              <div className="space-y-6 animate-fadeIn">
                
                <div className="space-y-1.5">
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-dark-800 tracking-tight">
                    Verify Your Email
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-500">
                    We sent a 6-digit verification code to:
                  </p>
                  
                  <div className="inline-flex items-center gap-2 bg-cream-50 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-bold text-maroon-800">
                    <span>{getMaskedEmail(email)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setStep('EMAIL');
                        setOtpError('');
                        setGeneralError('');
                      }}
                      className="text-muted-500 hover:text-maroon-700 transition-colors p-1"
                      title="Edit email address"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* OTP Error Banner */}
                {otpError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6" noValidate>
                  
                  {/* 6 Individual Digit Boxes */}
                  <div>
                    <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-2">
                      Enter 6-Digit Code
                    </label>
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={otpInputRefs[idx]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={handleOtpPaste}
                          disabled={isSubmitting}
                          className={`w-11 h-13 sm:w-14 sm:h-14 text-center font-bold text-lg sm:text-2xl rounded-2xl border transition-all focus:outline-none focus:ring-2 ${
                            digit
                              ? 'bg-rose-50/60 border-maroon-600 text-maroon-800 focus:ring-maroon-600/30'
                              : 'bg-cream-50 border-rose-200 text-dark-800 focus:border-maroon-600 focus:ring-maroon-600/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                    icon={isSubmitting ? Loader2 : CheckCircle2}
                    disabled={isSubmitting || otpDigits.join('').length < 6}
                    className="shadow-md shadow-maroon-900/10"
                  >
                    {isSubmitting ? 'Verifying Code...' : 'Verify & Continue'}
                  </Button>

                </form>

                {/* Resend & Change Email Footer */}
                <div className="pt-2 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-500 font-medium">Didn't receive the code?</span>
                    {cooldown > 0 ? (
                      <span className="text-muted-500 font-medium ml-1">
                        Resend code in <strong className="text-maroon-700">{cooldown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSubmitting}
                        className="font-bold text-maroon-700 hover:text-maroon-900 flex items-center gap-1 hover:underline transition-colors cursor-pointer ml-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('EMAIL');
                      setOtpError('');
                      setGeneralError('');
                    }}
                    className="text-muted-500 hover:text-maroon-800 font-bold transition-colors cursor-pointer hover:underline"
                  >
                    Change Email
                  </button>
                </div>

              </div>
            )}

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
export default Login;
