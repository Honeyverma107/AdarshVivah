import React from 'react';
import { ShieldCheck, PhoneCall } from 'lucide-react';

export const ConversationItem = ({ conversation, isSelected, onClick }) => {
  const other = conversation.other_participant;
  const latest = conversation.latest_message;
  const unread = conversation.unread_count || 0;

  const peerName = other?.name || other?.email || 'User';

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex items-center justify-between gap-3 ${
        isSelected
          ? 'bg-maroon-600 text-white border-maroon-600 shadow-md shadow-maroon-900/10'
          : 'bg-white hover:bg-rose-50/70 border-rose-100 text-dark-800'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        
        {/* Avatar / Initial */}
        <div className="relative shrink-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
            isSelected ? 'bg-maroon-800 text-gold-400 border-gold-400' : 'bg-maroon-700 text-cream-50 border-gold-400/80'
          }`}>
            {peerName.charAt(0).toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Online" />
        </div>

        {/* Content */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className={`font-bold text-xs sm:text-sm truncate ${isSelected ? 'text-white' : 'text-dark-800'}`}>
              {peerName}
            </h4>
            <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-gold-400' : 'text-emerald-600'}`} />
          </div>

          <p className={`text-xs truncate mt-0.5 font-medium ${
            isSelected ? 'text-rose-100' : 'text-muted-500'
          }`}>
            {latest ? latest.message : 'No messages yet'}
          </p>
        </div>

      </div>

      {/* Timestamp & Unread Badge */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className={`text-[10px] font-medium ${isSelected ? 'text-rose-200' : 'text-muted-400'}`}>
          {latest ? formatTime(latest.created_at) : ''}
        </span>

        {unread > 0 && (
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
            isSelected ? 'bg-gold-400 text-dark-900' : 'bg-maroon-600 text-white shadow-xs'
          }`}>
            {unread}
          </span>
        )}
      </div>

    </div>
  );
};

export default ConversationItem;
