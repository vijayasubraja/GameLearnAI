import { apiRequest, normalizeApiError } from '../lib/api';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      return await apiRequest<AuthResponse>({
        method: 'POST',
        url: '/auth/login',
        data: payload,
      });
    } catch (err) {
      throw normalizeApiError(err);
    }
  },

  async register(payload: RegisterPayload): Promise<User> {
    try {
      return await apiRequest<User>({
        method: 'POST',
        url: '/auth/register',
        data: payload,
      });
    } catch (err) {
      throw normalizeApiError(err);
    }
  },

  async me(): Promise<User> {
    try {
      return await apiRequest<User>({ method: 'GET', url: '/auth/me' });
    } catch (err) {
      throw normalizeApiError(err);
    }
  },
};