import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { startCallApi, updateCallStatusApi } from '../api/chatApi';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { user } = useAuth();

  // Call State: 'IDLE' | 'OUTGOING' | 'RINGING' | 'CONNECTING' | 'CONNECTED' | 'ENDED' | 'REJECTED'
  const [callState, setCallState] = useState('IDLE');
  const [activeCall, setActiveCall] = useState(null); // { callId, conversationId, peerUser }
  const [isMuted, setIsMuted] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);

  const peerConnectionRef = useRef(null);
  const wsRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(new Audio());
  const timerRef = useRef(null);
  const activeCallRef = useRef(activeCall);

  useEffect(() => {
    activeCallRef.current = activeCall;
  }, [activeCall]);

  // Audio element setup
  useEffect(() => {
    remoteAudioRef.current.autoplay = true;
  }, []);

  // Timer logic for CONNECTED call
  useEffect(() => {
    if (callState === 'CONNECTED') {
      setDurationSeconds(0);
      timerRef.current = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Helper: Setup WebRTC PeerConnection
  const createPeerConnection = (conversationId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'ice_candidate',
          candidate: event.candidate,
          conversation_id: conversationId
        }));
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  // Connect Signaling WebSocket
  const connectSignalingWs = (conversationId, onMessageCallback) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const token = localStorage.getItem('access_token');
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? '127.0.0.1:8000' 
      : window.location.host;

    const ws = new WebSocket(`${wsProtocol}//${host}/ws/call/${conversationId}/?token=${token}`);

    ws.onopen = () => {
      console.log('Call signaling WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.sender_id !== user?.id) {
          onMessageCallback(data);
        }
      } catch (err) {
        console.error('Error parsing signaling message:', err);
      }
    };

    ws.onerror = (err) => console.error('Signaling WS error:', err);

    wsRef.current = ws;
    return ws;
  };

  // Helper: Cleanup call media & connections
  const cleanupCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsMuted(false);
  };

  // ACTION: Initiate Call (Caller side)
  const startCall = async (conversationId, peerUser) => {
    try {
      setCallState('OUTGOING');
      setActiveCall({ conversationId, peerUser, isCaller: true });

      // Call REST API to create Call record
      const callData = await startCallApi(conversationId, peerUser.id);
      setActiveCall((prev) => ({ ...prev, callId: callData.id }));

      const pc = createPeerConnection(conversationId);

      // Get local microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Connect Signaling WebSocket
      const ws = connectSignalingWs(conversationId, async (data) => {
        if (data.type === 'call_accepted') {
          setCallState('CONNECTING');
        } else if (data.type === 'call_answer') {
          if (peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
            setCallState('CONNECTED');
          }
        } else if (data.type === 'ice_candidate') {
          if (peerConnectionRef.current && data.candidate) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        } else if (data.type === 'call_rejected') {
          setCallState('REJECTED');
          setTimeout(() => {
            cleanupCall();
            setCallState('IDLE');
            setActiveCall(null);
          }, 2000);
        } else if (data.type === 'call_ended') {
          setCallState('ENDED');
          setTimeout(() => {
            cleanupCall();
            setCallState('IDLE');
            setActiveCall(null);
          }, 1500);
        }
      });

      ws.onopen = async () => {
        // Create Offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        ws.send(JSON.stringify({
          type: 'call_initiated',
          conversation_id: conversationId,
          call_id: callData.id,
          sdp: offer
        }));
      };

    } catch (error) {
      console.error('Failed to start voice call:', error);
      alert('Unable to access microphone or start call. Please check browser permissions.');
      cleanupCall();
      setCallState('IDLE');
      setActiveCall(null);
    }
  };

  // Listen for incoming calls when active in a conversation (or global WS listener)
  const listenForIncomingCalls = (conversationId, currentPeerUser) => {
    return connectSignalingWs(conversationId, async (data) => {
      if (data.type === 'call_initiated') {
        setCallState('RINGING');
        setActiveCall({
          callId: data.call_id,
          conversationId,
          peerUser: currentPeerUser || { id: data.sender_id, name: data.sender_name },
          offerSdp: data.sdp,
          isCaller: false
        });
      } else if (data.type === 'call_cancelled') {
        setCallState('IDLE');
        cleanupCall();
        setActiveCall(null);
      } else if (data.type === 'call_ended') {
        setCallState('ENDED');
        setTimeout(() => {
          cleanupCall();
          setCallState('IDLE');
          setActiveCall(null);
        }, 1500);
      }
    });
  };

  // ACTION: Accept Incoming Call
  const acceptCall = async () => {
    if (!activeCall || !activeCall.offerSdp) return;

    try {
      setCallState('CONNECTING');
      const pc = createPeerConnection(activeCall.conversationId);

      // Get local microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Update backend status to ACCEPTED
      if (activeCall.callId) {
        await updateCallStatusApi(activeCall.callId, 'ACCEPTED');
      }

      // Handle ICE candidates and incoming SDP
      const ws = wsRef.current;

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.sender_id !== user?.id) {
            if (data.type === 'ice_candidate' && data.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            } else if (data.type === 'call_ended') {
              setCallState('ENDED');
              setTimeout(() => {
                cleanupCall();
                setCallState('IDLE');
                setActiveCall(null);
              }, 1500);
            }
          }
        } catch (e) {
          console.error('Error handling WebSocket message in accepted call:', e);
        }
      };

      // Set Remote Description from Caller's offer
      await pc.setRemoteDescription(new RTCSessionDescription(activeCall.offerSdp));

      // Create Answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send Call Answer & Accepted signal
      ws.send(JSON.stringify({
        type: 'call_accepted',
        conversation_id: activeCall.conversationId
      }));

      ws.send(JSON.stringify({
        type: 'call_answer',
        conversation_id: activeCall.conversationId,
        sdp: answer
      }));

      setCallState('CONNECTED');

    } catch (error) {
      console.error('Error accepting call:', error);
      rejectCall();
    }
  };

  // ACTION: Reject Incoming Call
  const rejectCall = async () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeCall) {
      wsRef.current.send(JSON.stringify({
        type: 'call_rejected',
        conversation_id: activeCall.conversationId
      }));
    }
    if (activeCall && activeCall.callId) {
      await updateCallStatusApi(activeCall.callId, 'REJECTED');
    }
    cleanupCall();
    setCallState('IDLE');
    setActiveCall(null);
  };

  // ACTION: End Call
  const endCall = async () => {
    const finalDuration = durationSeconds;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeCall) {
      wsRef.current.send(JSON.stringify({
        type: 'call_ended',
        conversation_id: activeCall.conversationId
      }));
    }
    if (activeCall && activeCall.callId) {
      await updateCallStatusApi(activeCall.callId, 'COMPLETED', finalDuration);
    }
    setCallState('ENDED');
    setTimeout(() => {
      cleanupCall();
      setCallState('IDLE');
      setActiveCall(null);
    }, 1000);
  };

  // ACTION: Toggle Mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  return (
    <CallContext.Provider
      value={{
        callState,
        activeCall,
        isMuted,
        durationSeconds,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        listenForIncomingCalls
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
