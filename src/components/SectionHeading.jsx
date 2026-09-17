import React from 'react';

export const SectionHeading = ({ 
  title, 
  subtitle, 
  badge, 
  centered = true, 
  className = "" 
}) => {
  return (
    <div className={`mb-10 ${centered ? 'text-center max-w-2xl mx-auto' : ''} ${className}`}>
      {badge && (
        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-maroon-700 uppercase bg-rose-100 rounded-full border border-rose-200">
          {badge}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-dark-800 tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base md:text-lg text-muted-500 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};
export default SectionHeading;
