import apiClient from './apiClient';
import { User } from './userService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const data: AuthResponse = response.data;

      if (!data.token) {
        throw new Error('No token received from login');
      }

      if (!data.user?.id || !/^[0-9a-fA-F]{24}$/.test(data.user.id)) {
        throw new Error('Invalid or missing user ID in login response');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  },

  googleLogin: () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('token') !== null;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.id && /^[0-9a-fA-F]{24}$/.test(user.id)) {
        return user;
      }
      console.warn('Invalid user ID in localStorage:', user.id);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return null;
  },

  register: async (userData: FormData): Promise<AuthResponse> => {
    try {
      // Create a new FormData object with the required fields
      const formData = new FormData();
      formData.append('name', `${userData.get('firstName')} ${userData.get('lastName')}`);
      formData.append('username', userData.get('email') as string);
      formData.append('email', userData.get('email') as string);
      formData.append('password', userData.get('password') as string);
      formData.append('age', '18'); // Default age
      formData.append('location', '');
      formData.append('bio', '');

      const response = await apiClient.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // After successful registration, login to get the token
      const loginResponse = await apiClient.post('/auth/login', {
        email: userData.get('email'),
        password: userData.get('password'),
      });

      const data: AuthResponse = {
        token: loginResponse.data.token,
        user: response.data
      };

      if (!data.token) {
        throw new Error('No token received from registration');
      }

      if (!data.user?.id || !/^[0-9a-fA-F]{24}$/.test(data.user.id)) {
        throw new Error('Invalid or missing user ID in registration response');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error.response?.data?.message || error.message || 'Registration failed';
    }
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      await apiClient.post('/auth/password-reset-request', { email });
    } catch (error: any) {
      console.error('Password reset request error:', error);
      throw error.response?.data?.message || error.message || 'Password reset request failed';
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await apiClient.post('/auth/reset-password', { token, newPassword });
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error.response?.data?.message || error.message || 'Password reset failed';
    }
  },
};