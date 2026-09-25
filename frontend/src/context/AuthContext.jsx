import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  // Listen for session expiration events emitted by api.js interceptor
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:session_expired', handleExpired);
    return () => {
      window.removeEventListener('auth:session_expired', handleExpired);
    };
  }, []);

  // Verify stored token on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      const storedRefresh = localStorage.getItem('refresh_token');

      if (!storedToken && !storedRefresh) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        setUser(response.data);
        setToken(localStorage.getItem('access_token') || storedToken);
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Shared token and user persistence helper
  const handleAuthSuccess = async (authData) => {
    const { access, refresh, user: userData } = authData;

    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_info', JSON.stringify(userData));

    setToken(access);
    setUser(userData);

    return userData;
  };

  // Helper to check whether matrimonial Profile exists for logged-in user
  const checkProfileExistence = async () => {
    try {
      await api.get('/profiles/me/');
      return true;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return false;
      }
      // Default to false for non-authenticated or empty profile states
      return false;
    }
  };

  // Send OTP
  const sendOtp = async (email) => {
    try {
      const response = await authApi.sendOtp(email);
      return { success: true, message: response.data?.message || 'OTP sent successfully.' };
    } catch (error) {
      const status = error.response?.status;
      let errorMessage = 'Failed to send verification code. Please try again.';

      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Taking too long to send the code. Please try again.';
      } else if (status === 429) {
        errorMessage = error.response?.data?.detail || 'Too many OTP requests. Please wait before requesting another code.';
      } else if (status === 503 || status === 500) {
        errorMessage = "We couldn't send the verification code right now. Please try again shortly.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.email) {
        errorMessage = Array.isArray(error.response.data.email) ? error.response.data.email[0] : error.response.data.email;
      }
      return { success: false, error: errorMessage, status };
    }
  };

  // Verify OTP
  const verifyOtp = async (email, otp) => {
    try {
      const response = await authApi.verifyOtp(email, otp);
      await handleAuthSuccess(response.data);
      const hasProfile = await checkProfileExistence();
      return { success: true, user: response.data.user, hasProfile };
    } catch (error) {
      const status = error.response?.status;
      let errorMessage = 'Invalid or expired verification code.';

      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Verification request timed out. Please try again.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.otp) {
        errorMessage = Array.isArray(error.response.data.otp) ? error.response.data.otp[0] : error.response.data.otp;
      }
      return { success: false, error: errorMessage, status };
    }
  };

  // Google OAuth Login
  const loginWithGoogle = async (credential) => {
    try {
      const response = await authApi.googleLogin(credential);
      await handleAuthSuccess(response.data);
      const hasProfile = await checkProfileExistence();
      return { success: true, user: response.data.user, hasProfile };
    } catch (error) {
      let errorMessage = 'Google authentication failed. Please try again.';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      return { success: false, error: errorMessage };
    }
  };

  // Legacy/Standard Email + Password Login handler
  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      await handleAuthSuccess(response.data);
      const hasProfile = await checkProfileExistence();
      return { success: true, user: response.data.user, hasProfile };
    } catch (error) {
      let errorMessage = 'Failed to log in. Please try again.';

      if (error.response) {
        const data = error.response.data;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.email && Array.isArray(data.email)) {
          errorMessage = data.email[0];
        } else if (data.password && Array.isArray(data.password)) {
          errorMessage = data.password[0];
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the backend server. Please check your network connection.';
      }

      return { success: false, error: errorMessage };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    sendOtp,
    verifyOtp,
    loginWithGoogle,
    checkProfileExistence,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
