import React, { useState, useEffect } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Loader2, User } from 'lucide-react';
import { getCalls } from '../../api/chatApi';

export const CallHistoryView = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCallHistory();
  }, []);

  const loadCallHistory = async () => {
    setLoading(true);
    try {
      const data = await getCalls();
      setCalls(data);
    } catch (err) {
      console.error('Failed to load call history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (totalSecs) => {
    if (!totalSecs) return '0s';
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-maroon-700" />
          <h3 className="font-serif font-bold text-lg text-dark-800">Voice Call History</h3>
        </div>
        <button
          onClick={loadCallHistory}
          className="text-xs font-semibold text-maroon-700 hover:underline"
        >
          Refresh Log
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-400 text-xs flex flex-col items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-maroon-600" />
          <span>Fetching call records...</span>
        </div>
      ) : calls.length === 0 ? (
        <div className="py-12 text-center text-muted-400 text-xs flex flex-col items-center gap-2">
          <Clock className="w-8 h-8 text-rose-200" />
          <span>No voice call history found.</span>
        </div>
      ) : (
        <div className="divide-y divide-rose-100">
          {calls.map((call) => {
            const peer = call.other_user;
            const peerName = peer?.name || peer?.email || 'User';
            const isOutgoing = call.direction === 'OUTGOING';

            return (
              <div key={call.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-maroon-700 text-white font-bold text-xs flex items-center justify-center border border-gold-400 shrink-0">
                    {peerName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-dark-800">{peerName}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-muted-500 mt-0.5">
                      <span className="flex items-center gap-1 font-medium">
                        {isOutgoing ? (
                          <PhoneOutgoing className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <PhoneIncoming className="w-3 h-3 text-blue-600" />
                        )}
                        {isOutgoing ? 'Outgoing Call' : 'Incoming Call'}
                      </span>
                      <span>•</span>
                      <span>{formatDate(call.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    call.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : call.status === 'ACCEPTED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {call.status}
                  </span>
                  {call.duration_seconds > 0 && (
                    <p className="text-[11px] font-mono text-muted-500 font-semibold mt-1">
                      {formatDuration(call.duration_seconds)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CallHistoryView;
