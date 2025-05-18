
import axios from 'axios';

// Create an axios instance with default configurations
const apiClient = axios.create({
  // BACKEND INTEGRATION: Replace this URL with your actual backend API URL
  baseURL: 'http://localhost:8080/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include JWT token in requests
apiClient.interceptors.request.use(
  (config) => {
    // BACKEND INTEGRATION: This reads the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (expired tokens, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle 404 Not Found errors
    if (error.response && error.response.status === 404) {
      console.error('Resource not found:', error.config.url);
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error - check if backend server is running');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
