import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

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
        const response = await api.get('/auth/me/');
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

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login/', { email, password });
      const { access, refresh, user: userData } = response.data;

      // Store tokens and user info
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_info', JSON.stringify(userData));

      setToken(access);
      setUser(userData);

      return { success: true };
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
