import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiError, normalizeApiError } from '../lib/api';
import { authService } from '../services/authService';
import { User, LoginPayload, RegisterPayload } from '../types/auth';

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

const TOKEN_KEY = 'gamelearn_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      const userData = await authService.me();
      setUser(userData);
    } catch (err) {
      // If the token is invalid/expired, clear the session so the guard
      // redirects to login. Network issues keep the cached token and surface
      // via explicit page error states.
      if (normalizeApiError(err).code === 'unauthorized') {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (payload: LoginPayload) => {
    try {
      const response = await authService.login(payload);
      localStorage.setItem(TOKEN_KEY, response.access_token);
      setToken(response.access_token);
      setUser(response.user);
    } catch (err) {
      throw normalizeApiError(err);
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      await authService.register(payload);
      await login({
        email_or_username: payload.email,
        password: payload.password,
      });
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw normalizeApiError(err);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
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