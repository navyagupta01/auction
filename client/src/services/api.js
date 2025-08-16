import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Change to false to prevent CORS issues
});

// **CRITICAL FIX: Use proper axios method format**
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('🔐 Adding auth token to request:', config.url);
    } else {
      console.log('❌ No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('❌ Auth failed, redirecting to login');
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
  create: (formData) => {
    return api({
      method: 'post',
      url: '/auctions',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};
