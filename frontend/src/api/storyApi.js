import api from './api';

export const storyApi = {
  getSuccessStories: () => api.get('/success-stories/'),
  submitSuccessStory: (data) => {
    if (data instanceof FormData) {
      return api.post('/success-stories/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/success-stories/', data);
  },
};

export default storyApi;
