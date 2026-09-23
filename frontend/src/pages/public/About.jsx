import React from 'react';
import { Heart, ShieldCheck, Users, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-maroon-700 bg-rose-100 rounded-full border border-rose-200 uppercase tracking-widest">
          About AdarshVivah
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-dark-800 tracking-tight">
          Where Traditions Meet Timeless Connections
        </h1>
        <p className="text-base md:text-lg text-muted-500 leading-relaxed">
          We are dedicated to building India's most trusted, family-assisted matrimonial platform—combining cultural heritage with modern compatibility technology.
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-rose-100 shadow-xs text-center space-y-3">
          <div className="w-14 h-14 bg-rose-50 text-maroon-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-xl text-dark-800">Uncompromising Trust</h3>
          <p className="text-xs text-muted-500 leading-relaxed">
            Every profile undergoes multi-tiered document verification to ensure authentic identities and family backgrounds.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-rose-100 shadow-xs text-center space-y-3">
          <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-xl text-dark-800">Family-Centric Approach</h3>
          <p className="text-xs text-muted-500 leading-relaxed">
            We honor Indian family structures by enabling parent assistance and transparent multi-generational participation.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-rose-100 shadow-xs text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-xl text-dark-800">Intelligent Compatibility</h3>
          <p className="text-xs text-muted-500 leading-relaxed">
            Beyond superficial filters, our preference engine evaluates shared values, lifestyle habits, and educational alignment.
          </p>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="bg-white rounded-3xl border border-rose-200 p-8 md:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-dark-800">Our Founding Vision</h2>
          <p className="text-xs md:text-sm text-muted-500 leading-relaxed">
            AdarshVivah was created with a clear vision: to elevate matrimonial search into a dignified, joyful experience for modern Indian singles and their families.
          </p>
          <div className="space-y-2 pt-2">
            {[
              "Zero tolerance for fake profiles or unverified accounts",
              "Advanced privacy controls protecting user contact information",
              "Dedicated family assistance and customer advisory support",
              "Matrimonial Biodata generation for traditional family exchanges"
            ].map((point, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-dark-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-maroon-600 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-rose-100">
          <img 
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000" 
            alt="Indian Wedding Celebration" 
            className="w-full h-80 object-cover"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-6">
        <Link to="/register">
          <Button variant="primary" size="lg" icon={Heart}>
            Join AdarshVivah Today
          </Button>
        </Link>
      </div>

    </div>
  );
};
export default About;
