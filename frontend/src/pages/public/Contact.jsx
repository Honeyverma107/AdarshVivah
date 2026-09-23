import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading';
import Button from '../../components/Button';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        badge="Reach Out To Us"
        title="We are Here to Help Your Family"
        subtitle="Have questions about profile verification, privacy settings, or family membership? Contact our advisory team."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Information */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-rose-200 shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-xl text-dark-800 border-b border-rose-100 pb-3">
            AdarshVivah Support Desk
          </h3>

          <div className="space-y-5 text-xs text-dark-800">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-50 text-maroon-600 rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-dark-800">Head Office</h5>
                <p className="text-muted-500 mt-0.5 leading-relaxed">
                  AdarshVivah Heritage Tower, 8th Floor, BKC, Bandra East, Mumbai, Maharashtra - 400051
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-50 text-gold-600 rounded-xl shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-dark-800">Toll-Free Helpline</h5>
                <p className="text-muted-500 mt-0.5">+91 1800-ADARSH (232774) [Mon-Sat, 9am - 7pm]</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-dark-800">Email Support</h5>
                <p className="text-muted-500 mt-0.5">support@adarshvivah.com / advisory@adarshvivah.com</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-rose-100 bg-rose-50/50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-maroon-700">Need Immediate Assistance?</p>
            <p className="text-[11px] text-muted-500 mt-0.5">
              Our safety officers respond to account verification & reporting inquiries within 2 hours.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-rose-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-dark-800">Message Received!</h3>
              <p className="text-xs text-muted-500 max-w-md mx-auto leading-relaxed">
                Thank you for contacting AdarshVivah. Our match advisor will contact you back on your registered phone number/email shortly.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="secondary" size="sm">
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif font-bold text-xl text-dark-800 mb-4">Send Us a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-800 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Profile Verification">Profile Verification</option>
                    <option value="Family Assisted Membership">Family Assisted Membership</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-800 mb-1">Your Message *</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full bg-cream-50 border border-rose-200 text-xs rounded-xl p-3 focus:ring-2 focus:ring-maroon-600 focus:outline-none"
                ></textarea>
              </div>

              <Button type="submit" variant="primary" size="md" icon={Send} fullWidth>
                Submit Inquiry
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
export default Contact;
