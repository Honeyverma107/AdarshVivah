import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import InterestStatusBadge from '../../components/InterestStatusBadge';
import Button from '../../components/Button';
import { Send, Eye, Loader2, XCircle, MessageSquare, Phone } from 'lucide-react';
import { getSentInterests, cancelInterest } from '../../api/chatApi';

export const SentInterests = () => {
  const navigate = useNavigate();
  const [sentList, setSentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    loadSentInterests();
  }, []);

  const loadSentInterests = async () => {
    setLoading(true);
    try {
      const data = await getSentInterests();
      setSentList(data);
    } catch (err) {
      console.error('Failed to load sent interests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (interestId) => {
    setCancelingId(interestId);
    try {
      await cancelInterest(interestId);
      setSentList((prev) =>
        prev.map((item) => (item.id === interestId ? { ...item, status: 'CANCELLED' } : item))
      );
    } catch (err) {
      console.error('Failed to cancel request:', err);
      alert(err.response?.data?.detail || 'Failed to cancel request.');
    } finally {
      setCancelingId(null);
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
        title="Sent Interests" 
        subtitle="Track the status of express interest connection requests sent by you or your family."
      />

      {loading ? (
        <div className="py-16 text-center text-muted-400 text-xs flex flex-col items-center gap-2 bg-white rounded-3xl border border-rose-100 p-8 shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin text-maroon-600" />
          <span>Loading sent interest requests...</span>
        </div>
      ) : sentList.length === 0 ? (
        <div className="py-16 text-center text-muted-400 text-xs flex flex-col items-center gap-2 bg-white rounded-3xl border border-rose-100 p-8 shadow-xs">
          <Send className="w-10 h-10 text-rose-200" />
          <h4 className="font-serif font-bold text-base text-dark-800">No Sent Requests Yet</h4>
          <p className="text-muted-500 max-w-sm">
            Browse verified profiles and click "Express Interest Now" to send connection requests.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sentList.map((item) => {
            const receiver = item.receiver;
            const receiverName = receiver?.name || receiver?.email || 'User';

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-maroon-700 text-white font-bold text-xl flex items-center justify-center border-2 border-gold-400 shrink-0 shadow-sm">
                    {receiverName.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-dark-800">{receiverName}</h4>
                      <InterestStatusBadge status={item.status} />
                    </div>
                    <p className="text-muted-500 font-medium">
                      Member Email: {receiver?.email}
                    </p>
                    <p className="text-muted-400 text-[11px] italic">
                      Sent on {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                  {item.status === 'PENDING' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={cancelingId === item.id ? Loader2 : XCircle}
                      disabled={cancelingId === item.id}
                      onClick={() => handleCancel(item.id)}
                      className="text-rose-700 hover:bg-rose-50"
                    >
                      {cancelingId === item.id ? 'Canceling...' : 'Cancel Request'}
                    </Button>
                  ) : item.status === 'ACCEPTED' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={MessageSquare}
                      onClick={() => navigate('/messages')}
                    >
                      Message / Call
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold text-muted-500">
                      {item.status}
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

export default SentInterests;
