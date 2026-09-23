import React from 'react';

export const TypingIndicator = ({ name }) => {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-500 font-medium py-1 px-3 bg-rose-50/80 rounded-full w-fit animate-pulse border border-rose-100 my-2">
      <span>{name} is typing</span>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-maroon-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-maroon-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-maroon-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default TypingIndicator;
