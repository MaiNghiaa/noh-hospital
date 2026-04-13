// frontend/user/src/services/authService.js
import api from './api';

const authService = {
  register: (data) => api.post('/user/auth/register', data),
  login: (data) => api.post('/user/auth/login', data),
  logout: () => api.post('/user/auth/logout'),
  refresh: () => api.post('/user/auth/refresh'),
  getMe: () => api.get('/user/auth/me'),
  updateProfile: (data) => api.put('/user/auth/profile', data),
  changePassword: (data) => api.put('/user/auth/change-password', data),
};

export default authService;
