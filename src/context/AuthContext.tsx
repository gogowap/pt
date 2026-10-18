import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiClient } from '../lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (...roles: ('admin' | 'operator' | 'viewer')[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('innodesk_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('innodesk_token');
      if (storedToken) {
        const res = await ApiClient.get<{ user: User }>('/api/auth/me');
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          ApiClient.removeToken();
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await ApiClient.post<{ token: string; user: User }>('/api/auth/login', {
      email,
      password,
    });

    if (res.success && res.token && res.user) {
      ApiClient.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true };
    }

    return { success: false, error: res.error || 'Login gagal.' };
  };

  const logout = async () => {
    try {
      await ApiClient.post('/api/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      ApiClient.removeToken();
      setToken(null);
      setUser(null);
    }
  };

  const hasRole = (...roles: ('admin' | 'operator' | 'viewer')[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, hasRole }}>
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
