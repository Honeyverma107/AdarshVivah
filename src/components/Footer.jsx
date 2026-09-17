import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Lock, Phone, Mail, MapPin, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-dark-900 text-cream-50 pt-16 pb-12 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-dark-700">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-900 shadow-md">
                <Heart className="w-5 h-5 fill-dark-900" />
              </div>
              <div>
                <span className="font-serif font-bold text-2xl tracking-tight text-white block">
                  Adarsh<span className="text-gold-400">Vivah</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-rose-200 tracking-widest block -mt-1">
                  Where Traditions Meet Timeless Connections
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-400 leading-relaxed max-w-sm">
              AdarshVivah is India's premier, family-assisted matrimonial platform dedicated to helping individuals find compatible life partners rooted in shared values, mutual respect, and cultural traditions.
            </p>

            <div className="flex items-center gap-4 text-xs text-rose-200 pt-2">
              <span className="flex items-center gap-1.5 bg-dark-800 px-3 py-1.5 rounded-full border border-dark-700">
                <ShieldCheck className="w-4 h-4 text-gold-400" /> 100% Verified Profiles
              </span>
              <span className="flex items-center gap-1.5 bg-dark-800 px-3 py-1.5 rounded-full border border-dark-700">
                <Lock className="w-4 h-4 text-gold-400" /> Strict Privacy
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-base text-gold-400 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-muted-400">
              <li><Link to="/profiles" className="hover:text-white transition-colors">Browse Profiles</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About AdarshVivah</Link></li>
              <li><Link to="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register Free</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors text-gold-400 font-medium">Admin Demo Portal</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="font-serif font-bold text-base text-gold-400 mb-4">Support & Legal</h4>
            <ul className="space-y-2.5 text-sm text-muted-400">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Safety Guidelines</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">FAQ & Help Center</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif font-bold text-base text-gold-400 mb-4">Get In Touch</h4>
            <div className="space-y-3 text-sm text-muted-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <span>AdarshVivah Heritage Tower, BKC, Mumbai, Maharashtra - 400051</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+91 1800-ADARSH (232774)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>support@adarshvivah.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {['FB', 'IG', 'X', 'LN'].map((label, idx) => (
                <a
                  key={idx}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-8 h-8 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-xs font-bold text-muted-400 hover:text-gold-400 hover:border-gold-400 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-500 gap-4">
          <p>© {new Date().getFullYear()} AdarshVivah Matrimonial Services Pvt. Ltd. All rights reserved.</p>
          <p className="italic">Frontend Proof of Concept Demonstration Version</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
