import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  Lock, 
  Users, 
  Sparkles, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  UserPlus,
  Compass,
  Send,
  MessageCircle
} from 'lucide-react';
import Button from '../../components/Button';
import SectionHeading from '../../components/SectionHeading';
import ProfileCard from '../../components/ProfileCard';
import VerifiedBadge from '../../components/VerifiedBadge';
import { MOCK_PROFILES } from '../../data/profiles';
import { MOCK_TESTIMONIALS } from '../../data/testimonials';

export const Home = () => {
  // Search Card Form State
  const [searchState, setSearchState] = useState({
    lookingFor: 'Female',
    ageMin: '23',
    ageMax: '29',
    religion: 'Hindu',
    profession: 'All',
    location: 'All'
  });

  const [searchFeedback, setSearchFeedback] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchFeedback(`Found 120+ verified ${searchState.lookingFor === 'Female' ? 'Bride' : 'Groom'} profiles matching your criteria!`);
    setTimeout(() => {
      const featuredSection = document.getElementById('featured-profiles');
      if (featuredSection) {
        featuredSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  const featuredProfiles = MOCK_PROFILES.slice(0, 6);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-rose-50/40 to-cream-50 pt-12 pb-24">
        
        {/* Subtle Decorative Indian Mandala / Arch Overlay Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-rose-200/50 blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-gold-200/50 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gold-300 shadow-xs text-xs font-semibold text-maroon-700">
                <Sparkles className="w-4 h-4 text-gold-500 fill-gold-400" />
                <span>Where Traditions Meet Timeless Connections</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-dark-800 tracking-tight leading-[1.15]">
                Find a Partner Who Shares Your <span className="text-maroon-600 underline decoration-gold-400 decoration-wavy underline-offset-8">Values</span> & Family Heritage
              </h1>

              <p className="text-base sm:text-lg text-muted-500 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                AdarshVivah is India's premier, family-assisted matrimonial platform. We combine traditional cultural principles with modern preference matching to foster genuine, lifelong marriages.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={UserPlus} className="shadow-lg shadow-maroon-600/20">
                    Create Your Profile
                  </Button>
                </Link>
                <a href="#featured-profiles">
                  <Button variant="gold" size="lg" icon={Search}>
                    Explore Profiles
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-rose-200/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-dark-800">Verified Profiles</h5>
                    <p className="text-[10px] text-muted-500">Manual ID Screening</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-maroon-700 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-dark-800">Secure & Private</h5>
                    <p className="text-[10px] text-muted-500">Strict Photo Controls</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 fill-amber-600 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-dark-800">Meaningful Connections</h5>
                    <p className="text-[10px] text-muted-500">Family-Assisted</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero Image Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative Floral / Gold Ring */}
                <div className="absolute -inset-3 bg-gradient-to-r from-gold-400 via-maroon-600 to-gold-500 rounded-3xl blur-sm opacity-30 transform rotate-2"></div>

                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img 
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000" 
                    alt="Decent Indian Matrimonial Couple" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1000';
                    }}
                    className="w-full h-[460px] object-cover object-top"
                  />
                  
                  {/* Floating Trust Overlay Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-rose-100 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-maroon-600 text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm">
                        AV
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-dark-800">14,850+ Verified Matches</h4>
                        <p className="text-[10px] text-muted-500">Trusted across 40+ Indian Cities</p>
                      </div>
                    </div>
                    <VerifiedBadge text="Authentic" size="xs" />
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SEARCH / MATCH PREVIEW CARD */}
      <section className="-mt-16 relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border-2 border-gold-300 p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-rose-100 pb-4 gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-maroon-600" />
              <h3 className="font-serif font-bold text-lg text-dark-800">Quick Match Search</h3>
            </div>
            <span className="text-xs font-semibold text-gold-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 self-start md:self-auto">
              Filtered by Verified Criteria
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            
            {/* Looking For */}
            <div>
              <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5">
                Looking For
              </label>
              <select
                value={searchState.lookingFor}
                onChange={(e) => setSearchState({ ...searchState, lookingFor: e.target.value })}
                className="w-full bg-cream-50 border border-rose-200 text-dark-800 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none font-medium"
              >
                <option value="Female">Bride (Female)</option>
                <option value="Male">Groom (Male)</option>
              </select>
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5">
                Age Range
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={searchState.ageMin}
                  onChange={(e) => setSearchState({ ...searchState, ageMin: e.target.value })}
                  className="w-full bg-cream-50 border border-rose-200 text-dark-800 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none font-medium"
                >
                  <option value="21">21 Yrs</option>
                  <option value="23">23 Yrs</option>
                  <option value="25">25 Yrs</option>
                  <option value="27">27 Yrs</option>
                </select>
                <select
                  value={searchState.ageMax}
                  onChange={(e) => setSearchState({ ...searchState, ageMax: e.target.value })}
                  className="w-full bg-cream-50 border border-rose-200 text-dark-800 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none font-medium"
                >
                  <option value="28">28 Yrs</option>
                  <option value="30">30 Yrs</option>
                  <option value="33">33 Yrs</option>
                  <option value="35">35 Yrs</option>
                </select>
              </div>
            </div>

            {/* Religion / Community */}
            <div>
              <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5">
                Religion / Community
              </label>
              <select
                value={searchState.religion}
                onChange={(e) => setSearchState({ ...searchState, religion: e.target.value })}
                className="w-full bg-cream-50 border border-rose-200 text-dark-800 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none font-medium"
              >
                <option value="Hindu">Hindu</option>
                <option value="Sikh">Sikh</option>
                <option value="Jain">Jain</option>
                <option value="Christian">Christian</option>
                <option value="Muslim">Muslim</option>
              </select>
            </div>

            {/* Education / Profession */}
            <div>
              <label className="block text-xs font-bold text-dark-800 uppercase tracking-wider mb-1.5">
                Education / Profession
              </label>
              <select
                value={searchState.profession}
                onChange={(e) => setSearchState({ ...searchState, profession: e.target.value })}
                className="w-full bg-cream-50 border border-rose-200 text-dark-800 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none font-medium"
              >
                <option value="All">All Professions</option>
                <option value="Engineering">Engineering / Software</option>
                <option value="Medicine">Doctor / Healthcare</option>
                <option value="Management">MBA / Business Executive</option>
                <option value="Finance">Finance / CA / Banking</option>
                <option value="Civil Services">Civil Services / Defense</option>
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" variant="primary" size="md" fullWidth icon={Search} className="h-[42px]">
                Search Profiles
              </Button>
            </div>

          </form>

          {searchFeedback && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{searchFeedback}</span>
            </div>
          )}
        </div>
      </section>

      {/* 3. WHY CHOOSE ADARSHVIVAH SECTION */}
      <section className="bg-gradient-to-b from-rose-50/60 to-cream-100 py-16 border-y border-rose-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Why Choose AdarshVivah"
            title="Designed for Traditional Indian Matrimony"
            subtitle="Thoughtfully crafted features giving your family complete safety, privacy, and high compatibility."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1: Verified Profiles */}
            <div className="bg-white p-6 rounded-2xl border border-rose-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-dark-800 mb-2">Verified Profiles</h4>
              <p className="text-xs text-muted-500 leading-relaxed mb-4">
                Mandatory identity document checks, verified phone numbers, and background screening to ensure genuine profiles.
              </p>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                100% ID Verified
              </span>
            </div>

            {/* Pillar 2: Smart Compatibility Matching */}
            <div className="bg-white p-6 rounded-2xl border border-rose-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-gold-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-dark-800 mb-2">Smart Compatibility Matching</h4>
              <p className="text-xs text-muted-500 leading-relaxed mb-4">
                Intelligent matching algorithms evaluating lifestyle, education, family values, and traditional expectations.
              </p>
              <span className="text-[11px] font-bold text-gold-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 inline-block">
                Value-Based Compatibility
              </span>
            </div>

            {/* Pillar 3: Privacy & Safety */}
            <div className="bg-white p-6 rounded-2xl border border-rose-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-maroon-600 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-dark-800 mb-2">Privacy & Safety</h4>
              <p className="text-xs text-muted-500 leading-relaxed mb-4">
                Granular photo privacy settings, hidden phone numbers until interest is accepted, and instant blocking controls.
              </p>
              <span className="text-[11px] font-bold text-maroon-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 inline-block">
                Protected Data & Photos
              </span>
            </div>

            {/* Pillar 4: Family-Friendly Experience */}
            <div className="bg-white p-6 rounded-2xl border border-rose-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-dark-800 mb-2">Family-Friendly Experience</h4>
              <p className="text-xs text-muted-500 leading-relaxed mb-4">
                Designed to involve parents and family elders with multi-user access and respectful communication tools.
              </p>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 inline-block">
                Family Portal Supported
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (4-STEP TIMELINE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Simple & Respectful Journey"
          title="How It Works"
          subtitle="Four straightforward steps to find your compatible life partner with complete dignity."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {[
            {
              step: "01",
              title: "Create Your Profile",
              desc: "Detail your background, family values, education, and partner preferences in minutes.",
              icon: UserPlus
            },
            {
              step: "02",
              title: "Discover Compatible Matches",
              desc: "Browse authentic profiles tailored to your location, religion, community, and lifestyle standards.",
              icon: Compass
            },
            {
              step: "03",
              title: "Send Interest",
              desc: "Express interest with respectful connection requests and introductory messages.",
              icon: Send
            },
            {
              step: "04",
              title: "Build a Meaningful Connection",
              desc: "Upon mutual acceptance, unlock verified contact details and involve family for the next steps.",
              icon: MessageCircle
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-rose-100 shadow-xs text-center relative group hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-maroon-600 to-maroon-800 text-white flex items-center justify-center mx-auto mb-4 font-bold shadow-md shadow-maroon-900/10">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="absolute top-4 right-4 text-2xl font-serif font-black text-rose-200">
                  {item.step}
                </span>
                <h4 className="font-serif font-bold text-base text-dark-800 mb-2">{item.title}</h4>
                <p className="text-xs text-muted-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURED PROFILES PREVIEW */}
      <section id="featured-profiles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Handpicked Profiles"
          title="Featured Profiles"
          subtitle="Explore authentic, verified profiles of well-educated professionals seeking meaningful matrimony."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/register">
            <Button variant="outline" size="lg" icon={ArrowRight}>
              Create Profile to View All Matches
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. TRUST AND SAFETY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-900 text-cream-50 rounded-3xl p-8 md:p-12 border-2 border-gold-400 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest bg-dark-800 px-3 py-1 rounded-full border border-dark-700">
                Trust & Safety First
              </span>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
                Built with Privacy, Dignity, and Uncompromised Trust
              </h3>
              <p className="text-sm text-muted-400 leading-relaxed">
                AdarshVivah is built specifically for genuine matrimonial intent. We protect your family's personal details with privacy controls, manual photo screening, and secure data handling.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Mandatory Identity & Government ID Screening",
                  "Privacy-Controlled Connections (No public phone displays)",
                  "Custom Photo Visibility Settings (Visible to accepted profiles)",
                  "Strict Matrimonial Policy (Zero tolerance for dating behavior)"
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-rose-100">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto border border-gold-500/40">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-serif font-bold text-lg text-white">Verification Guarantee</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Every verified badge on AdarshVivah represents authentic identity credentials checked by our safety team.
              </p>
              <Link to="/register">
                <Button variant="gold" size="md" className="mt-2">
                  Create Verified Profile
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 7. SUCCESS STORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Blessed Marriages"
          title="Success Stories"
          subtitle="Inspiring real couples who found their lifetime soulmates through AdarshVivah."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col">
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.names} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800';
                  }}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  {item.badge}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1 text-gold-500 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <h4 className="font-serif font-bold text-lg text-dark-800">{item.names}</h4>
                  <p className="text-xs font-semibold text-maroon-700">{item.weddingDate} • {item.location}</p>
                  <p className="text-xs text-muted-500 italic mt-3 leading-relaxed">
                    "{item.story}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-maroon-700 via-maroon-600 to-maroon-800 text-white rounded-3xl p-10 md:p-14 text-center relative overflow-hidden shadow-xl">
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight leading-tight">
              Begin Your Matrimonial Journey Today
            </h2>
            <p className="text-sm md:text-base text-rose-100 leading-relaxed font-normal">
              Join thousands of families who trust AdarshVivah to find genuine, respectful, and value-aligned life partners.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/register">
                <Button variant="gold" size="lg" icon={UserPlus}>
                  Create Your Profile
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
export default Home;

