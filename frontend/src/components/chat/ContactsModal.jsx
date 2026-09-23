import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, ShieldCheck, Loader2 } from 'lucide-react';
import { getContacts, createConversation } from '../../api/chatApi';

export const ContactsModal = ({ isOpen, onClose, onSelectConversation }) => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [creatingId, setCreatingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (user) => {
    setCreatingId(user.id);
    try {
      const conv = await createConversation(user.id);
      onSelectConversation(conv);
      onClose();
    } catch (err) {
      console.error('Failed to create conversation:', err);
      alert(err.response?.data?.detail || 'Failed to start conversation.');
    } finally {
      setCreatingId(null);
    }
  };

  if (!isOpen) return null;

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-dark-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-rose-200 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-maroon-700" />
            <h3 className="font-serif font-bold text-lg text-dark-800">New Message</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-50 text-muted-500 hover:text-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-muted-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified members..."
            className="w-full bg-cream-50 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-maroon-600/20 focus:border-maroon-600"
          />
        </div>

        {/* Contacts List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="py-8 text-center text-muted-400 text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-maroon-600" />
              <span>Loading verified profiles...</span>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="py-8 text-center text-muted-400 text-xs">
              No matching profiles found.
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleStartChat(contact)}
                className="p-3 rounded-2xl border border-rose-100 hover:border-maroon-300 bg-cream-50/50 hover:bg-rose-50/50 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-maroon-700 text-white font-bold text-sm flex items-center justify-center border-2 border-gold-400">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-dark-800 group-hover:text-maroon-700 transition-colors">
                        {contact.name}
                      </h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-muted-500">{contact.email}</p>
                  </div>
                </div>

                {creatingId === contact.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-maroon-600" />
                ) : (
                  <span className="text-xs font-semibold text-maroon-700 group-hover:underline">
                    Chat →
                  </span>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default ContactsModal;
