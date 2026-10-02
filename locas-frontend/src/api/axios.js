import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('locas_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('locas_token');
      localStorage.removeItem('locas_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/' && window.location.pathname !== '/staff-login') {
        window.location.href = '/login';
      }
    }

    const errorMessage =
      (error.response && error.response.data && (error.response.data.message || error.response.data.error)) ||
      error.message ||
      'Backend Service Unavailable. Please start locas-backend on port 8080.';

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
