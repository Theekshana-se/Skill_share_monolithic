import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, AuthResponse } from '@/api/authService';
import { User } from '@/api/userService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: () => void;
  setUser: (user: User) => void;
  loginWithToken: (token: string) => void;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load user from localStorage
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      if (!currentUser.id || !/^[0-9a-fA-F]{24}$/.test(currentUser.id)) {
        console.warn('Invalid user ID in localStorage:', currentUser.id);
        authService.logout();
      } else {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const loginWithToken = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  // Helper to set user and persist to localStorage
  const setUserAndPersist = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authService.login({ email, password });
      if (!response.user?.id || !/^[0-9a-fA-F]{24}$/.test(response.user.id)) {
        throw new Error('Invalid user ID from login response');
      }
      setUserAndPersist(response.user);
      setIsAuthenticated(true);
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: typeof error === 'string' ? error : 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    window.location.href = '/login';
  };

  const googleLogin = () => {
    try {
      authService.googleLogin();
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: 'Google Login Failed',
        description: 'Could not initiate Google login. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);

      const response = await authService.register(formData);
      setUserAndPersist(response.user);
      setIsAuthenticated(true);
      toast({
        title: 'Registration Successful',
        description: 'Welcome to our platform!',
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: typeof error === 'string' ? error : 'Could not create your account. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    googleLogin,
    setUser: setUserAndPersist,
    loginWithToken,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};