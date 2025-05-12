import axios from 'axios';

const api = axios.create({
  baseURL: 'https://library-ms-bd05.onrender.com/api',
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Token validation errors
      if (error.response.status === 401) {
        // Clear token and redirect to login if token is invalid
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      // Log the error details
      console.error('API Error:', {
        status: error.response.status,
        message: error.response.data.message,
        url: error.config.url
      });
    }
    return Promise.reject(error);
  }
);

export default api; 