import React, { useState, useEffect, useRef } from 'react';
import { Phone, ShieldCheck, ArrowLeft, Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCall } from '../../context/CallContext';
import { getMessages, sendMessage, markRead } from '../../api/chatApi';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';

export const ChatWindow = ({ conversation, onBack }) => {
  const { user } = useAuth();
  const { startCall, listenForIncomingCalls } = useCall();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const other = conversation?.other_participant;
  const peerName = other?.name || other?.email || 'User';

  // Listen for incoming call signals while in chat window
  useEffect(() => {
    if (conversation && other) {
      listenForIncomingCalls(conversation.id, other);
    }
  }, [conversation, other]);

  // Load message history on conversation change
  useEffect(() => {
    if (conversation) {
      loadMessages();
    }
  }, [conversation?.id]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getMessages(conversation.id);
      setMessages(data);

      // Mark unread messages as read
      if (conversation.unread_count > 0) {
        await markRead(conversation.id);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  // WebSocket connection for real-time chat
  useEffect(() => {
    if (!conversation) return;

    const token = localStorage.getItem('access_token');
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? '127.0.0.1:8000' 
      : window.location.host;

    const ws = new WebSocket(`${wsProtocol}//${host}/ws/chat/${conversation.id}/?token=${token}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'chat_message') {
          setMessages((prev) => {
            // Avoid duplicate message appending
            if (prev.some((m) => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
          // Mark read if message received while in chat window
          if (data.message.sender_id !== user?.id) {
            markRead(conversation.id);
          }
        } else if (data.type === 'typing_event') {
          if (data.user_id !== user?.id) {
            if (data.action === 'typing_start') {
              setTypingUser(data.user_name);
            } else {
              setTypingUser(null);
            }
          }
        } else if (data.type === 'read_receipt') {
          if (data.reader_id !== user?.id) {
            setMessages((prev) =>
              prev.map((m) => (m.sender_id === user?.id ? { ...m, is_read: true } : m))
            );
          }
        }
      } catch (err) {
        console.error('Error handling chat WebSocket message:', err);
      }
    };

    wsRef.current = ws;

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [conversation?.id, user?.id]);

  const handleSendText = async (text) => {
    try {
      // Optimistic message append
      const tempId = 'temp-' + Date.now();
      const tempMsg = {
        id: tempId,
        conversation_id: conversation.id,
        sender: { id: user.id, name: user.name, email: user.email },
        sender_id: user.id,
        message: text,
        is_read: false,
        created_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, tempMsg]);

      const createdMsg = await sendMessage(conversation.id, text);

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? createdMsg : m))
      );

    } catch (err) {
      console.error('Failed to send message:', err);
      alert(err.response?.data?.detail || 'Failed to send message.');
    }
  };

  const sendTypingSignal = (type) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type }));
    }
  };

  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-cream-50/40 rounded-3xl border border-rose-100">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-maroon-600 flex items-center justify-center mb-4 shadow-sm">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="font-serif font-bold text-lg text-dark-800">Select a Conversation</h3>
        <p className="text-xs text-muted-500 max-w-xs mt-1">
          Choose a verified profile from the list to start messaging or make a voice call.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl border border-rose-100/90 shadow-lg overflow-hidden">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-cream-100 via-rose-50/50 to-white border-b border-rose-100 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-1.5 rounded-full hover:bg-rose-100 text-dark-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="w-10 h-10 rounded-full bg-maroon-700 text-white font-bold text-sm flex items-center justify-center border-2 border-gold-400 shrink-0">
            {peerName.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-bold text-base text-dark-800">{peerName}</h3>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Voice Call Button */}
          <button
            type="button"
            onClick={() => startCall(conversation.id, other)}
            disabled={!conversation.can_call}
            title={conversation.can_call ? "Start Voice Call" : "Calling restricted for this profile"}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-700/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Voice Call</span>
          </button>

        </div>

      </div>

      {/* Messages List Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-cream-50/30 via-white to-cream-50/20">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-400 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-maroon-600" />
            <span>Loading conversation...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-500 space-y-2">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-maroon-600 flex items-center justify-center font-bold text-lg">
              👋
            </div>
            <p className="text-xs font-semibold text-dark-800">No messages yet</p>
            <p className="text-[11px] text-muted-400 max-w-xs">
              Say hello to start building a meaningful connection!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === user?.id}
            />
          ))
        )}

        {typingUser && <TypingIndicator name={typingUser} />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <MessageInput
        onSendMessage={handleSendText}
        onTypingStart={() => sendTypingSignal('typing_start')}
        onTypingStop={() => sendTypingSignal('typing_stop')}
        disabled={loading || !conversation.can_message}
      />

    </div>
  );
};

export default ChatWindow;
