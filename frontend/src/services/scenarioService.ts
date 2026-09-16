import { apiRequest } from '../lib/api';
import type { Scenario, ScenarioFilters } from '../types/domain';
import { DEV_SCENARIOS, DEV_RECOMMENDED_SCENARIO, devScenarioById, markDev } from './fallback/devData';
import { withDevFallback } from './utils';

function buildScenarioQuery(filters?: ScenarioFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.skill && filters.skill !== 'all') params.set('skill', filters.skill);
  if (filters.difficulty && filters.difficulty !== 'all') params.set('difficulty', filters.difficulty);
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const scenarioService = {
  listScenarios(filters?: ScenarioFilters): Promise<Scenario[]> {
    return withDevFallback<Scenario[]>(
      () => apiRequest<Scenario[]>({ method: 'GET', url: `/scenarios${buildScenarioQuery(filters)}` }),
      () => {
        let list = DEV_SCENARIOS;
        if (filters?.skill && filters.skill !== 'all') list = list.filter((s) => s.skill_category === filters.skill);
        if (filters?.difficulty && filters.difficulty !== 'all') list = list.filter((s) => s.difficulty_level === filters.difficulty);
        if (filters?.status && filters.status !== 'all') list = list.filter((s) => s.availability === filters.status);
        return markDev(list);
      },
      'scenarios.list'
    );
  },

  getScenario(id: string): Promise<Scenario> {
    return withDevFallback<Scenario>(
      () => apiRequest<Scenario>({ method: 'GET', url: `/scenarios/${encodeURIComponent(id)}` }),
      () => {
        const found = devScenarioById(id);
        if (!found) throw new Error(`Scenario not found in dev fallback: ${id}`);
        return found;
      },
      'scenarios.detail'
    );
  },

  getRecommended(): Promise<Scenario> {
    return withDevFallback<Scenario>(
      () => apiRequest<Scenario>({ method: 'GET', url: '/scenarios/select' }),
      () => DEV_RECOMMENDED_SCENARIO,
      'scenarios.recommended'
    );
  },
};