import api from './api';

export const profileApi = {
  getMe: () => api.get('/profiles/me/'),
  createProfile: (data) => api.post('/profiles/', data),
  updateMe: (data) => api.put('/profiles/me/', data),
  getProfiles: (params, config = {}) => api.get('/profiles/', { params, ...config }),
  getProfileById: (id) => api.get(`/profiles/${id}/`),
  toggleShortlist: (profileId) => api.post('/shortlists/', { profile_id: profileId }),
  deleteShortlist: (profileId) => api.delete(`/shortlists/${profileId}/`),
  getShortlists: () => api.get('/shortlists/'),
  getShortlistStatus: (profileId) => api.get(`/shortlists/status/${profileId}/`),

  // Photo API Endpoints
  getPhotos: () => api.get('/photos/'),
  uploadPhoto: (formData) => api.post('/photos/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  replacePhoto: (photoId, formData) => api.put(`/photos/${photoId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePhoto: (photoId) => api.delete(`/photos/${photoId}/`),
  setPrimaryPhoto: (photoId) => api.post(`/photos/${photoId}/make_primary/`),
};

export default profileApi;
