import api from './api';

export const storyApi = {
  getSuccessStories: () => api.get('/success-stories/'),
  submitSuccessStory: (data) => api.post('/success-stories/', data),
};

export default storyApi;
