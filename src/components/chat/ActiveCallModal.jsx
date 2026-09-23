import React from 'react';
import { Mic, MicOff, PhoneOff, Volume2 } from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const ActiveCallModal = () => {
  const { callState, activeCall, isMuted, durationSeconds, toggleMute, endCall } = useCall();

  if (!['OUTGOING', 'CONNECTING', 'CONNECTED', 'ENDED', 'REJECTED'].includes(callState) || !activeCall) {
    return null;
  }

  const formatDuration = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const peerName = activeCall.peerUser?.name || activeCall.peerUser?.email || 'User';

  return (
    <div className="fixed inset-0 z-50 bg-dark-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-maroon-900 via-maroon-950 to-dark-950 text-white rounded-3xl p-8 max-w-sm w-full border border-gold-500/30 shadow-2xl text-center space-y-6 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-maroon-500/30 rounded-full blur-3xl pointer-events-none" />

        {/* User Photo / Initial */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          {callState === 'CONNECTED' && (
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
          )}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gold-400 to-gold-600 p-1 shadow-xl relative z-10 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-maroon-800 flex items-center justify-center text-white font-bold text-2xl border-2 border-white/20">
              {peerName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Status & Peer Name */}
        <div className="space-y-1 relative z-10">
          <h3 className="font-serif font-bold text-2xl text-white tracking-tight">{peerName}</h3>
          
          {callState === 'OUTGOING' && (
            <p className="text-xs text-gold-300 font-semibold tracking-wider uppercase animate-pulse">
              Calling...
            </p>
          )}

          {callState === 'CONNECTING' && (
            <p className="text-xs text-gold-300 font-semibold tracking-wider uppercase animate-pulse">
              Connecting...
            </p>
          )}

          {callState === 'CONNECTED' && (
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                Active Voice Call
              </span>
              <p className="font-mono text-lg font-bold text-cream-100 pt-1">
                {formatDuration(durationSeconds)}
              </p>
            </div>
          )}

          {callState === 'REJECTED' && (
            <p className="text-xs text-red-400 font-bold uppercase tracking-wider">
              Call Declined
            </p>
          )}

          {callState === 'ENDED' && (
            <p className="text-xs text-rose-300 font-bold uppercase tracking-wider">
              Call Ended ({formatDuration(durationSeconds)})
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 pt-4 relative z-10">
          
          {/* Mute / Unmute Button */}
          <button
            type="button"
            onClick={toggleMute}
            disabled={callState !== 'CONNECTED'}
            title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isMuted 
                ? 'bg-amber-500 text-dark-900 shadow-md shadow-amber-500/30' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            } disabled:opacity-50`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={endCall}
            title="End Call"
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transform hover:scale-105 transition-all"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

        </div>

      </div>
    </div>
  );
};

export default ActiveCallModal;
