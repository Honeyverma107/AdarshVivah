import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

export const MessageBubble = ({ message, isOwn }) => {
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const senderName = message.sender?.name || message.sender?.email || 'User';

  return (
    <div className={`flex items-end gap-2 my-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      
      {/* Received Avatar */}
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-maroon-700 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-gold-400/80 shadow-xs mb-1">
          {senderName.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Bubble Box */}
      <div className={`max-w-[78%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
        isOwn
          ? 'bg-gradient-to-r from-maroon-700 to-maroon-800 text-cream-50 rounded-br-none font-normal'
          : 'bg-white text-dark-800 border border-rose-200/80 rounded-bl-none font-normal'
      }`}>
        
        {/* Message Text */}
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.message}</p>

        {/* Footer Timestamp & Status */}
        <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 font-medium ${
          isOwn ? 'text-rose-200' : 'text-muted-400'
        }`}>
          <span>{formatTime(message.created_at)}</span>

          {isOwn && (
            message.is_read ? (
              <CheckCheck className="w-3.5 h-3.5 text-gold-400" title="Read" />
            ) : (
              <Check className="w-3.5 h-3.5 text-rose-200" title="Sent" />
            )
          )}
        </div>

      </div>

    </div>
  );
};

export default MessageBubble;
