import React from 'react';
import { Star, Heart, MapPin, Calendar, ShieldCheck } from 'lucide-react';

export const SuccessStoryCard = ({ story }) => {
  if (!story) return null;

  const coupleName = story.couple_name || story.coupleName || story.names || 'Happy Couple';
  const marriageDate = story.marriage_date || story.marriageDate || story.weddingDate || 'Recently Married';
  const location = story.location || 'India';
  const storyText = story.story || '';
  const image = story.image_url || story.image || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800';
  const badge = story.badge || 'Verified Marriage';

  return (
    <div className="group bg-white rounded-2xl border border-rose-100/90 hover:border-gold-400/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Image Frame */}
      <div className="h-60 relative overflow-hidden bg-cream-100">
        <img 
          src={image} 
          alt={coupleName} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-dark-900/10 to-transparent" />
        
        {/* Floating Verified Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-700 border border-emerald-200/80 shadow-xs flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{badge}</span>
        </div>

        {/* Floating Heart Accent */}
        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-dark-900/40 backdrop-blur-md flex items-center justify-center text-gold-400 border border-white/20">
          <Heart className="w-4 h-4 fill-gold-400" />
        </div>

        {/* Name overlaid on image bottom */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h4 className="font-serif font-bold text-xl tracking-tight text-white drop-shadow-md">
            {coupleName}
          </h4>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          
          {/* Rating Stars & Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gold-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
              ))}
            </div>
            
            <div className="flex items-center gap-1 text-xs font-semibold text-maroon-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
              <Calendar className="w-3.5 h-3.5 text-maroon-600" />
              <span>{marriageDate.startsWith('Married') ? marriageDate : `Married ${marriageDate}`}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-muted-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
            <span>{location}</span>
          </div>

          {/* Testimonial Quote */}
          <p className="text-xs text-dark-700 leading-relaxed italic bg-cream-50/70 p-3.5 rounded-xl border border-rose-100/60 font-serif">
            "{storyText}"
          </p>

        </div>
      </div>

    </div>
  );
};

export default SuccessStoryCard;
