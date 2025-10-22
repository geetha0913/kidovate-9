import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    const { state } = JSON.parse(authStorage);
    if (state.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API methods
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const progressAPI = {
  getProgress: (userId) => api.get('/progress', { params: { userId } }),
  updateProgress: (data) => api.post('/progress/update', data),
  getChildren: () => api.get('/progress/children'),
};

export const activitiesAPI = {
  getActivities: (userId, limit) => api.get('/activities', { params: { userId, limit } }),
  logActivity: (data) => api.post('/activities/log', data),
};

export const communityAPI = {
  getPosts: () => api.get('/community/posts'),
  getPendingPosts: () => api.get('/community/posts/pending'),
  createPost: (data) => api.post('/community/posts', data),
  approvePost: (id) => api.patch(`/community/posts/${id}/approve`),
  deletePost: (id) => api.delete(`/community/posts/${id}`),
  reactToPost: (id, emoji) => api.post(`/community/posts/${id}/react`, { emoji }),
  getReactions: (id) => api.get(`/community/posts/${id}/reactions`),
};
