import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  logout: () => api.post('/auth/logout'),
};

export const auctionAPI = {
  getAll: () => api.get('/auctions'),
  getById: (id) => api.get(`/auctions/${id}`),
  getUserAuctions: () => api.get('/auctions/my'),
  create: (formData) => api.post('/auctions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  endAuction: (id) => api.put(`/auctions/${id}/end`),
  getAuctionAnalytics: (id) => api.get(`/auctions/${id}/analytics`),
};

export const analyticsAPI = {
  getStats: () => api.get('/analytics/stats'),
  getRevenue: () => api.get('/analytics/revenue'),
};
