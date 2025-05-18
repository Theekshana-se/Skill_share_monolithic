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
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  googleLogin: () => {},
});

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

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authService.login({ email, password });
      if (!response.user?.id || !/^[0-9a-fA-F]{24}$/.test(response.user.id)) {
        throw new Error('Invalid user ID from login response');
      }
      setUser(response.user);
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
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    window.location.href = '/login';
  };

  const googleLogin = () => {
    toast({
      title: 'Not Implemented',
      description: 'Google login is not yet available.',
      variant: 'destructive',
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};