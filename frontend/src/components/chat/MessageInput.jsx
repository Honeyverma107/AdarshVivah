import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';

export const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop, disabled }) => {
  const [text, setText] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);

    if (onTypingStart) {
      onTypingStart();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingStop) {
        onTypingStop();
      }
    }, 1500);
  };

  const handleSend = () => {
    if (!text.trim() || disabled) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (onTypingStop) {
      onTypingStop();
    }

    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-white border-t border-rose-100 flex items-center gap-2">
      <div className="relative flex-1">
        <textarea
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          className="w-full bg-cream-50 text-dark-800 text-xs sm:text-sm rounded-2xl pl-4 pr-10 py-2.5 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-maroon-600/20 focus:border-maroon-600 resize-none font-medium max-h-24"
        />
      </div>

      <button
        type="button"
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="w-11 h-11 rounded-2xl bg-gradient-to-br from-maroon-600 to-maroon-800 hover:from-maroon-700 hover:to-maroon-900 text-white flex items-center justify-center shadow-md shadow-maroon-900/20 disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95 transition-all shrink-0"
      >
        <Send className="w-4 h-4 text-gold-400" />
      </button>
    </div>
  );
};

export default MessageInput;
