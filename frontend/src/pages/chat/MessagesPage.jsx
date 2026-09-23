import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, Phone, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { getConversations } from '../../api/chatApi';
import ConversationItem from '../../components/chat/ConversationItem';
import ChatWindow from '../../components/chat/ChatWindow';
import CallHistoryView from '../../components/chat/CallHistoryView';
import ContactsModal from '../../components/chat/ContactsModal';
import IncomingCallModal from '../../components/chat/IncomingCallModal';
import ActiveCallModal from '../../components/chat/ActiveCallModal';
import { CallProvider } from '../../context/CallContext';

import { useSearchParams } from 'react-router-dom';

export const MessagesPageContent = () => {
  const [searchParams] = useSearchParams();
  const targetConvId = searchParams.get('conversation');

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'calls'

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
      if (data.length > 0) {
        if (targetConvId) {
          const matched = data.find((c) => String(c.id) === String(targetConvId));
          setSelectedConversation(matched || data[0]);
        } else if (!selectedConversation) {
          setSelectedConversation(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setActiveTab('chats');
    // Update local list if new
    setConversations((prev) => {
      if (prev.some((c) => c.id === conv.id)) return prev;
      return [conv, ...prev];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Global Voice Call Modals */}
      <IncomingCallModal />
      <ActiveCallModal />

      {/* New Contact Modal */}
      <ContactsModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
        onSelectConversation={handleSelectConversation}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[80vh] min-h-[600px]">
        
        {/* LEFT COLUMN: Conversation List & Tab switcher (4 Cols) */}
        <div className={`lg:col-span-4 bg-white rounded-3xl border border-rose-100/90 p-4 shadow-md flex flex-col justify-between h-full ${
          selectedConversation && activeTab === 'chats' ? 'hidden lg:flex' : 'flex'
        }`}>
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
              <h2 className="font-serif font-bold text-xl text-dark-800">Messages & Calls</h2>
              
              <button
                onClick={() => setIsContactsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-maroon-600 hover:bg-maroon-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <MessageSquarePlus className="w-4 h-4 text-gold-400" />
                <span>New Chat</span>
              </button>
            </div>

            {/* Sub Nav Tabs (Chats vs Calls) */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-cream-100 rounded-2xl mb-4 border border-rose-100">
              <button
                onClick={() => setActiveTab('chats')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'chats'
                    ? 'bg-white text-maroon-700 shadow-xs'
                    : 'text-muted-500 hover:text-dark-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Conversations</span>
              </button>

              <button
                onClick={() => setActiveTab('calls')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'calls'
                    ? 'bg-white text-maroon-700 shadow-xs'
                    : 'text-muted-500 hover:text-dark-800'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Logs</span>
              </button>
            </div>

            {/* List Body */}
            {activeTab === 'chats' ? (
              <div className="space-y-2 max-h-[calc(80vh-170px)] overflow-y-auto pr-1">
                {loading ? (
                  <div className="py-12 text-center text-muted-400 text-xs flex flex-col items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-maroon-600" />
                    <span>Loading conversations...</span>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="py-12 text-center text-muted-400 text-xs space-y-3">
                    <p>No conversations found.</p>
                    <button
                      onClick={() => setIsContactsOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gold-400 text-dark-900 font-bold text-xs shadow-xs hover:bg-gold-500 transition-colors"
                    >
                      Start a Conversation
                    </button>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isSelected={selectedConversation?.id === conv.id}
                      onClick={() => setSelectedConversation(conv)}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="max-h-[calc(80vh-170px)] overflow-y-auto">
                <CallHistoryView />
              </div>
            )}
          </div>

          {/* Footer Badge */}
          <div className="pt-3 border-t border-rose-100 text-center">
            <span className="text-[10px] text-muted-400 font-semibold uppercase tracking-widest flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-500" /> Matrimonial End-to-End Encrypted Messaging
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: Selected Chat Window / Call Logs (8 Cols) */}
        <div className={`lg:col-span-8 h-full ${
          !selectedConversation && activeTab === 'chats' ? 'hidden lg:block' : 'block'
        }`}>
          {activeTab === 'chats' ? (
            <ChatWindow
              conversation={selectedConversation}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <CallHistoryView />
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export const MessagesPage = () => (
  <CallProvider>
    <MessagesPageContent />
  </CallProvider>
);

export default MessagesPage;
