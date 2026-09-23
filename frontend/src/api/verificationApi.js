import api from './api';

export const verificationApi = {
  getStatus: () => api.get('/verification/'),
  getMe: () => api.get('/verification/me/'),
  submitDocument: (formData) => api.post('/verification/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Admin Portal endpoints
  getAdminVerifications: () => api.get('/verification/admin/list/'),
  getAdminVerificationDetail: (id) => api.get(`/verification/admin/${id}/`),
  approveVerification: (id) => api.post(`/verification/admin/${id}/approve/`),
  rejectVerification: (id, rejectionReason) => api.post(`/verification/admin/${id}/reject/`, { rejection_reason: rejectionReason }),
};

export default verificationApi;
