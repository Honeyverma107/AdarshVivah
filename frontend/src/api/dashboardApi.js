import api from './api';

export const dashboardApi = {
  getDashboardStats: () => api.get('/dashboard/'),
};

export default dashboardApi;
