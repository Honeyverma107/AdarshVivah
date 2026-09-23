import api from './api';

export const adminApi = {
  getAdminStats: () => api.get('/admin/stats/'),
  getAdminUsers: () => api.get('/admin/users/'),
  toggleUserVerify: (userId) => api.patch(`/admin/users/${userId}/verify/`),
};

export default adminApi;
