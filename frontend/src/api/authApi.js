import api from './api';

export const authApi = {
  sendOtp: (email) => api.post('/auth/send-otp/', { email }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp/', { email, otp }),
  googleLogin: (credential) => api.post('/auth/google/', { credential }),
  getMe: () => api.get('/auth/me/'),
  login: (email, password) => api.post('/auth/login/', { email, password }),
  register: (data) => api.post('/auth/register/', data),
};

export default authApi;
