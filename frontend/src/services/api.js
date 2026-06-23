import axios from 'axios';

// Base URL for your backend
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============ AUTH ============
export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// ============ TRIPS ============
export const trips = {
  getAll: () => api.get('/trips'),
  getOne: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post('/trips', data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  getMembers: (id) => api.get(`/trips/${id}/members`),
  getStatistics: (id) => api.get(`/trips/${id}/statistics`),
  getBalances: (id) => api.get(`/trips/${id}/balances`),
  invite: (id, email) => api.post(`/trips/${id}/invite?email=${email}`),
};

// ============ EXPENSES ============
export const expenses = {
  getAll: (tripId) => api.get(`/trips/${tripId}/expenses`),
  getOne: (id) => api.get(`/expenses/${id}`),
  create: (tripId, data) => api.post(`/trips/${tripId}/expenses`, data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getCategories: () => api.get('/categories'),
  addComment: (id, text) => api.post(`/expenses/${id}/comments?text=${text}`),
  getComments: (id) => api.get(`/expenses/${id}/comments`),
};

// ============ SETTLEMENTS ============
export const settlements = {
  getAll: (tripId) => api.get(`/trips/${tripId}/settlements`),
  create: (tripId, data) => api.post(`/trips/${tripId}/settlements`, data),
  markPaid: (id) => api.put(`/settlements/${id}/paid`),
  getSimplifiedDebts: (tripId) => api.get(`/trips/${tripId}/debts/simplified`),
  getMyDebts: (tripId) => api.get(`/trips/${tripId}/debts/my`),
  autoSettle: (tripId) => api.post(`/trips/${tripId}/settlements/auto`),
  getStatistics: (tripId) => api.get(`/trips/${tripId}/settlements/statistics`),
};

export default api;