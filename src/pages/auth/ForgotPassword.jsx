import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream-100 to-cream-50">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-rose-200 shadow-xl relative text-center">
        
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-maroon-600 text-white flex items-center justify-center font-bold shadow-md">
            <Heart className="w-5 h-5 fill-gold-400 text-gold-400" />
          </div>
          <span className="font-serif font-bold text-2xl text-maroon-700">Adarsh<span className="text-gold-500">Vivah</span></span>
        </Link>

        {submitted ? (
          <div className="space-y-4 py-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-dark-800">Password Reset Link Sent</h2>
            <p className="text-xs text-muted-500 leading-relaxed">
              We have dispatched a password reset link to <strong className="text-dark-800">{email}</strong>. Please check your email inbox or SMS.
            </p>
            <Link to="/login" className="inline-block pt-2">
              <Button variant="primary" size="md">
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-dark-800">Reset Your Password</h2>
              <p className="text-xs text-muted-500 mt-1">Enter your registered email or mobile number</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-dark-800 mb-1.5 uppercase tracking-wider">
                  Registered Email / Mobile
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aditya.verma@example.com"
                    className="w-full bg-cream-50 border border-rose-200 text-dark-800 text-xs rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" fullWidth>
                Send Password Reset Instructions
              </Button>
            </form>

            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon-600 hover:text-maroon-800">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Log In
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
export default ForgotPassword;
