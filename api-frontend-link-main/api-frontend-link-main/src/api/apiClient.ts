import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Create an axios instance with default configurations
const apiClient = axios.create({
  // BACKEND INTEGRATION: Replace this URL with your actual backend API URL
  baseURL: 'http://localhost:8080/api', 
  timeout: 60000,
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
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show toast notification
      toast({
        variant: 'destructive',
        title: 'Session Expired',
        description: 'Your session has expired. Please log in again.',
      });

      // Redirect to login page
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
    
    // Handle 403 Forbidden errors
    if (error.response && error.response.status === 403) {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You do not have permission to perform this action.',
      });
    }
    
    // Handle 404 Not Found errors
    if (error.response && error.response.status === 404) {
      console.error('Resource not found:', error.config.url);
      toast({
        variant: 'destructive',
        title: 'Not Found',
        description: 'The requested resource was not found.',
      });
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error - check if backend server is running');
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
