import api from './api';

// Chat APIs
export const getConversations = async () => {
  const response = await api.get('/chat/conversations/');
  return response.data;
};

export const createConversation = async (userId) => {
  const numericId = Number(userId);
  if (!userId || isNaN(numericId) || numericId <= 0 || userId === 'undefined' || userId === 'null') {
    throw new Error('Valid numeric target user_id is required.');
  }
  const response = await api.post('/chat/conversations/', { user_id: numericId });
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await api.get(`/chat/conversations/${conversationId}/messages/`);
  return response.data;
};

export const sendMessage = async (conversationId, messageText) => {
  const response = await api.post(`/chat/conversations/${conversationId}/messages/`, { message: messageText });
  return response.data;
};

export const markRead = async (conversationId) => {
  const response = await api.post(`/chat/conversations/${conversationId}/read/`);
  return response.data;
};

export const getCalls = async () => {
  const response = await api.get('/chat/calls/');
  return response.data;
};

export const startCallApi = async (conversationId, receiverId) => {
  const response = await api.post('/chat/calls/start/', {
    conversation_id: conversationId,
    receiver_id: receiverId
  });
  return response.data;
};

export const updateCallStatusApi = async (callId, status, durationSeconds = 0) => {
  const response = await api.post(`/chat/calls/${callId}/update_status/`, {
    status,
    duration_seconds: durationSeconds
  });
  return response.data;
};

export const getContacts = async () => {
  const response = await api.get('/chat/contacts/');
  return response.data;
};

// Interest & Invitation APIs
export const sendInterest = async (receiverId) => {
  const numericId = Number(receiverId);
  if (!receiverId || isNaN(numericId) || numericId <= 0 || receiverId === 'undefined' || receiverId === 'null') {
    throw new Error('Valid numeric receiver_id is required to send interest.');
  }
  const response = await api.post('/chat/interests/', { receiver_id: numericId });
  return response.data;
};

export const getSentInterests = async () => {
  const response = await api.get('/chat/interests/sent/');
  return response.data;
};

export const getReceivedInterests = async () => {
  const response = await api.get('/chat/interests/received/');
  return response.data;
};

export const getInterestStatus = async (userId) => {
  const numericId = Number(userId);
  if (!userId || isNaN(numericId) || numericId <= 0 || userId === 'undefined' || userId === 'null') {
    return {
      status: 'NONE',
      interest_id: null,
      can_message: false,
      can_call: false,
      conversation_id: null
    };
  }
  const response = await api.get(`/chat/interests/status/?user_id=${numericId}`);
  return response.data;
};

export const acceptInterest = async (interestId) => {
  const response = await api.post(`/chat/interests/${interestId}/accept/`);
  return response.data;
};

export const rejectInterest = async (interestId) => {
  const response = await api.post(`/chat/interests/${interestId}/reject/`);
  return response.data;
};

export const cancelInterest = async (interestId) => {
  const response = await api.post(`/chat/interests/${interestId}/cancel/`);
  return response.data;
};
