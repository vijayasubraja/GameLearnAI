import { apiRequest } from '../lib/api';
import type { DashboardPayload, SkillInfo } from '../types/domain';
import { DEV_DASHBOARD, DEV_SKILLS, DEV_FALLBACK_ENABLED } from './fallback/devData';
import { withDevFallback } from './utils';

export const profileService = {
  getDashboard(): Promise<DashboardPayload> {
    return withDevFallback<DashboardPayload>(
      () => apiRequest<DashboardPayload>({ method: 'GET', url: '/profile/dashboard' }),
      () => DEV_DASHBOARD,
      'profile.dashboard'
    );
  },

  getSkills(): Promise<SkillInfo[]> {
    return withDevFallback<SkillInfo[]>(
      () => apiRequest<SkillInfo[]>({ method: 'GET', url: '/skills' }),
      () => DEV_SKILLS,
      'skills'
    );
  },
};

export { DEV_FALLBACK_ENABLED };