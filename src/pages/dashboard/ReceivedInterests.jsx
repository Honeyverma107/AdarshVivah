import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import InterestStatusBadge from '../../components/InterestStatusBadge';
import Button from '../../components/Button';
import { CheckCircle2, XCircle, Eye, Inbox, Loader2, MessageSquare, Phone } from 'lucide-react';
import { getReceivedInterests, acceptInterest, rejectInterest } from '../../api/chatApi';

export const ReceivedInterests = () => {
  const navigate = useNavigate();
  const [receivedList, setReceivedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    loadReceivedInterests();
  }, []);

  const loadReceivedInterests = async () => {
    setLoading(true);
    try {
      const data = await getReceivedInterests();
      setReceivedList(data);
    } catch (err) {
      console.error('Failed to load received interests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (interestId) => {
    setActionId(interestId);
    try {
      const updated = await acceptInterest(interestId);
      setReceivedList((prev) =>
        prev.map((item) => (item.id === interestId ? { ...item, status: 'ACCEPTED', conversation_id: updated.conversation_id } : item))
      );
    } catch (err) {
      console.error('Failed to accept proposal:', err);
      alert(err.response?.data?.detail || 'Failed to accept proposal.');
    } finally {
      setActionId(null);
    }
  };

  const handleDecline = async (interestId) => {
    setActionId(interestId);
    try {
      await rejectInterest(interestId);
      setReceivedList((prev) =>
        prev.map((item) => (item.id === interestId ? { ...item, status: 'REJECTED' } : item))
      );
    } catch (err) {
      console.error('Failed to decline proposal:', err);
      alert(err.response?.data?.detail || 'Failed to decline proposal.');
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Received Interests" 
        subtitle="Review proposal interest requests sent to your profile by prospective partners."
      />

      {loading ? (
        <div className="py-16 text-center text-muted-400 text-xs flex flex-col items-center gap-2 bg-white rounded-3xl border border-rose-100 p-8 shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin text-maroon-600" />
          <span>Loading received interest proposals...</span>
        </div>
      ) : receivedList.length === 0 ? (
        <div className="py-16 text-center text-muted-400 text-xs flex flex-col items-center gap-2 bg-white rounded-3xl border border-rose-100 p-8 shadow-xs">
          <Inbox className="w-10 h-10 text-rose-200" />
          <h4 className="font-serif font-bold text-base text-dark-800">No Received Proposals Yet</h4>
          <p className="text-muted-500 max-w-sm">
            When other verified members express interest in your profile, their proposal requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {receivedList.map((item) => {
            const sender = item.sender;
            const senderName = sender?.name || sender?.email || 'User';

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-maroon-700 text-white font-bold text-xl flex items-center justify-center border-2 border-gold-400 shrink-0 shadow-sm">
                    {senderName.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-serif font-bold text-lg text-dark-800">{senderName}</h4>
                      <InterestStatusBadge status={item.status} />
                    </div>
                    <p className="text-muted-600 font-medium">
                      Member Email: {sender?.email}
                    </p>
                    <p className="text-muted-400 text-[10px]">Received on {formatDate(item.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  {item.status === 'PENDING' ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={actionId === item.id ? Loader2 : CheckCircle2}
                        disabled={actionId === item.id}
                        onClick={() => handleAccept(item.id)}
                      >
                        {actionId === item.id ? 'Accepting...' : 'Accept Proposal'}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-700 hover:bg-rose-50"
                        disabled={actionId === item.id}
                        onClick={() => handleDecline(item.id)}
                      >
                        Decline
                      </Button>
                    </>
                  ) : item.status === 'ACCEPTED' ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        icon={MessageSquare}
                        onClick={() => navigate(`/messages?conversation=${item.conversation_id || ''}`)}
                      >
                        Message
                      </Button>

                      <Button
                        variant="gold"
                        size="sm"
                        icon={Phone}
                        onClick={() => navigate(`/messages?conversation=${item.conversation_id || ''}`)}
                      >
                        Voice Call
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                      Proposal Declined
                    </span>
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

export default ReceivedInterests;
