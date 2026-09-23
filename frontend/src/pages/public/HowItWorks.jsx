import React from 'react';
import { UserPlus, Compass, Send, MessageCircle, ShieldCheck, FileText, Lock, Sparkles } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Create & Verify Your Profile',
      desc: 'Register for free and complete your basic, personal, educational, and family details. Upload government ID for blue check verification.',
      icon: UserPlus,
      details: ['Government ID Verification', 'Privacy-controlled Photos', 'Family Background Summary']
    },
    {
      num: '02',
      title: 'Discover Compatible Matches',
      desc: 'Browse handpicked profiles aligned with your community, age, location, income, and education preferences. View demo 90%+ preference match insights.',
      icon: Compass,
      details: ['Smart Preference Matching', 'Filter by City & Education', 'Why This Match Insights']
    },
    {
      num: '03',
      title: 'Express Interest & Connect',
      desc: 'Send personalized connection requests. Once accepted, securely communicate and share your official AdarshVivah Matrimonial Biodata.',
      icon: Send,
      details: ['Instant Interest Notifications', 'Biodata PDF Preview', 'Mutual Consent Unlock']
    },
    {
      num: '04',
      title: 'Family Introduction & Matrimony',
      desc: 'Connect families with total peace of mind. Experience traditional Indian matchmaking backed by modern security and privacy.',
      icon: MessageCircle,
      details: ['Family Member Participation', 'Contact Details Unlock', 'Lifetime Guidance Support']
    }
  ];

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        badge="Guided Step-by-Step"
        title="How AdarshVivah Works"
        subtitle="A seamless, secure, and respectful journey from your first profile registration to a blissful wedding day."
      />

      <div className="space-y-12">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div 
              key={idx} 
              className={`bg-white rounded-3xl border border-rose-200 p-8 shadow-xs flex flex-col md:flex-row items-center gap-8 ${
                idx % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-serif font-black text-maroon-600 bg-rose-100 px-3.5 py-1 rounded-2xl border border-rose-200">
                    {step.num}
                  </span>
                  <div className="p-3 bg-amber-50 text-gold-600 rounded-xl border border-amber-200">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-dark-800">{step.title}</h3>
                <p className="text-sm text-muted-500 leading-relaxed">{step.desc}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {step.details.map((item, dIdx) => (
                    <span key={dIdx} className="text-xs bg-cream-50 text-maroon-700 px-3 py-1 rounded-full border border-rose-100 font-medium">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/2 bg-gradient-to-br from-rose-50 to-cream-100 rounded-2xl p-8 border border-rose-200/60 text-center">
                <div className="w-20 h-20 bg-white text-maroon-600 rounded-full flex items-center justify-center mx-auto shadow-md mb-3 border-2 border-gold-300">
                  <Icon className="w-10 h-10" />
                </div>
                <p className="text-xs font-semibold text-dark-800">AdarshVivah Guaranteed Safety</p>
                <p className="text-[11px] text-muted-500 mt-1">100% Confidential & Family Oriented</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white p-10 rounded-3xl text-center space-y-4">
        <h3 className="text-2xl font-serif font-bold">Ready to Start Your Journey?</h3>
        <p className="text-xs md:text-sm text-rose-100 max-w-xl mx-auto">
          Create your verified profile today and connect with compatible partners sharing your traditional values.
        </p>
        <Link to="/register" className="inline-block pt-2">
          <Button variant="gold" size="lg">
            Create Free Profile Now
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default HowItWorks;
