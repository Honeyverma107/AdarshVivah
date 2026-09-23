import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/token/refresh'
];

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to attach JWT Authorization Bearer token ONLY to protected endpoints
api.interceptors.request.use(
  (config) => {
    const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url && config.url.includes(url));
    if (!isPublic) {
      const token = localStorage.getItem('access_token');
      if (token) {
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${token}`);
        } else if (config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          config.headers = { Authorization: `Bearer ${token}` };
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle automatic JWT token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const isPublic = PUBLIC_ENDPOINTS.some((url) => originalRequest.url && originalRequest.url.includes(url));

    if (error.response.status === 401 && !originalRequest._retry && !isPublic) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
              originalRequest.headers.set('Authorization', `Bearer ${token}`);
            } else if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        isRefreshing = false;
        handleSessionExpiration();
        return Promise.reject(error);
      }

      try {
        const refreshRes = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        if (refreshRes.status === 200 && refreshRes.data.access) {
          const newAccessToken = refreshRes.data.access;
          localStorage.setItem('access_token', newAccessToken);

          if (originalRequest.headers && typeof originalRequest.headers.set === 'function') {
            originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
          } else if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          isRefreshing = false;
          return api(originalRequest);
        } else {
          throw new Error('Invalid refresh response structure');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        handleSessionExpiration();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

function handleSessionExpiration() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_info');

  window.dispatchEvent(new CustomEvent('auth:session_expired'));

  if (window.location.pathname !== '/login') {
    window.location.href = '/login?session_expired=true';
  }
}

export default api;
