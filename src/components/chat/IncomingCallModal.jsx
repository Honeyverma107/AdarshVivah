import React from 'react';
import { Phone, PhoneOff, User } from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const IncomingCallModal = () => {
  const { callState, activeCall, acceptCall, rejectCall } = useCall();

  if (callState !== 'RINGING' || !activeCall) return null;

  const peerName = activeCall.peerUser?.name || activeCall.peerUser?.email || 'User';

  return (
    <div className="fixed inset-0 z-50 bg-dark-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-maroon-900 to-maroon-950 text-white rounded-3xl p-8 max-w-sm w-full border border-gold-500/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-gold-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-maroon-500/40 rounded-full blur-2xl pointer-events-none" />

        {/* Pulsing Avatar Ring */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gold-400/30 animate-ping pointer-events-none" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gold-400 to-gold-600 p-1 shadow-lg relative z-10 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-maroon-800 flex items-center justify-center text-white font-bold text-2xl border-2 border-white/20">
              {peerName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Caller Info */}
        <div className="space-y-1 relative z-10">
          <h3 className="font-serif font-bold text-2xl text-white tracking-tight">{peerName}</h3>
          <p className="text-xs text-gold-300 font-semibold tracking-wider uppercase animate-pulse">
            Incoming Voice Call...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-8 pt-4 relative z-10">
          
          {/* Decline Button */}
          <button
            onClick={rejectCall}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <PhoneOff className="w-6 h-6" />
            </div>
            <span className="text-xs text-red-200 font-medium">Decline</span>
          </button>

          {/* Accept Button */}
          <button
            onClick={acceptCall}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 transform group-hover:scale-110 transition-transform animate-bounce">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-xs text-emerald-200 font-medium">Accept</span>
          </button>

        </div>

      </div>
    </div>
  );
};

export default IncomingCallModal;
