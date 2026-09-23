import React, { useState, useEffect } from 'react';
import { Star, Heart, ShieldCheck, Quote } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading';
import Button from '../../components/Button';
import storyApi from '../../api/storyApi';
import { Link } from 'react-router-dom';

export const SuccessStories = () => {
  const [storiesList, setStoriesList] = useState([]);

  useEffect(() => {
    storyApi.getSuccessStories()
      .then((res) => {
        setStoriesList(Array.isArray(res.data) ? res.data : res.data.results || []);
      })
      .catch((err) => console.error('Error loading success stories:', err));
  }, []);

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeading
        badge="Real Unions"
        title="AdarshVivah Success Stories"
        subtitle="Discover heart-warming stories of couples who found mutual respect, love, and traditional matrimony on our platform."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {storiesList.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-rose-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col">
            <div className="h-64 relative">
              <img src={item.image} alt={item.couple_name || item.names} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-emerald-700 border border-emerald-200 shadow-sm">
                ✓ Verified Marriage
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400" />
                  ))}
                </div>
                <h3 className="font-serif font-bold text-xl text-dark-800">{item.couple_name || item.names}</h3>
                <p className="text-xs font-semibold text-maroon-700 bg-rose-50 px-3 py-1 rounded-full inline-block border border-rose-100">
                  {item.marriage_date || item.weddingDate} • {item.location}
                </p>
                <div className="relative pt-2">
                  <Quote className="w-8 h-8 text-rose-200 absolute -top-1 -left-2 -z-0" />
                  <p className="text-xs text-muted-600 italic leading-relaxed relative z-10 pl-2">
                    "{item.story}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Share your story card */}
      <div className="bg-rose-50 rounded-3xl border border-rose-200 p-8 text-center max-w-2xl mx-auto space-y-3">
        <Heart className="w-10 h-10 text-maroon-600 mx-auto fill-maroon-600/20" />
        <h3 className="font-serif font-bold text-xl text-dark-800">Did You Meet Your Life Partner on AdarshVivah?</h3>
        <p className="text-xs text-muted-500">
          We would love to feature your wedding story to inspire thousands of families across India.
        </p>
        <Link to="/contact" className="inline-block pt-2">
          <Button variant="outline" size="sm">
            Submit Your Wedding Story
          </Button>
        </Link>
      </div>

    </div>
  );
};
export default SuccessStories;
