import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { User, AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('gamelearn_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.get<User>('/auth/me');
      setUser(response.data);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('gamelearn_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (payload: LoginPayload) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    const { access_token, user: userData } = response.data;
    localStorage.setItem('gamelearn_token', access_token);
    setToken(access_token);
    setUser(userData);
  };

  const register = async (payload: RegisterPayload) => {
    // Register user
    await apiClient.post<User>('/auth/register', payload);
    // Auto login after registration
    await login({
      email_or_username: payload.email,
      password: payload.password,
    });
  };

  const logout = () => {
    localStorage.removeItem('gamelearn_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
