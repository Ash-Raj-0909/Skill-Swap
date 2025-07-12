import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { authAPI, LoginResponse, SignupResponse } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      // Try to get user profile with the stored token
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success && response.data) {
        const userData = response.data;
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          isAdmin: userData.email === 'admin@skillswap.com' // You can adjust this logic
        });
      } else {
        // Token might be invalid, clear it
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        const loginData = response.data as LoginResponse;
        
        // Store the token
        localStorage.setItem('authToken', loginData.access_token);
        
        // Set user data
        setUser({
          id: loginData.user.id,
          name: loginData.user.name,
          email: loginData.user.email,
          isAdmin: loginData.user.email === 'admin@skillswap.com'
        });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.signup({ name, email, password });
      
      if (response.success && response.data) {
        // Signup successful - user needs to login separately
        // Some backends auto-login after signup, adjust as needed
        console.log('Signup successful:', response.data);
      } else {
        throw new Error(response.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authAPI.logout(); // This clears localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};