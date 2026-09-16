import { apiRequest } from '../lib/api';
import type {
  SimulationCompleteResponse,
  SimulationEventPayload,
  SimulationStartResponse,
} from '../types/domain';
import { devScenarioById, DEV_COMPLETE, DEV_START } from './fallback/devData';
import { withDevFallback } from './utils';

export const simulationService = {
  start(scenarioId: string): Promise<SimulationStartResponse> {
    return withDevFallback<SimulationStartResponse>(
      () =>
        apiRequest<SimulationStartResponse>({
          method: 'POST',
          url: '/simulation/start',
          data: { scenario_id: scenarioId },
        }),
      () => {
        const scenario = devScenarioById(scenarioId);
        const attemptId = `dev-attempt-${Date.now()}`;
        return {
          ...DEV_START,
          attempt_id: attemptId,
          scenario_id: scenario?.id ?? scenarioId,
        };
      },
      'simulation.start'
    );
  },

  recordEvent(event: SimulationEventPayload): Promise<{ accepted: boolean }> {
    return withDevFallback<{ accepted: boolean }>(
      () =>
        apiRequest<{ accepted: boolean }>({
          method: 'POST',
          url: '/simulation/behaviour',
          data: event,
        }),
      () => ({ accepted: true }),
      'simulation.behaviour'
    );
  },

  complete(attemptId: string, status: 'completed' | 'failed'): Promise<SimulationCompleteResponse> {
    return withDevFallback<SimulationCompleteResponse>(
      () =>
        apiRequest<SimulationCompleteResponse>({
          method: 'POST',
          url: '/simulation/complete',
          data: { attempt_id: attemptId, status },
        }),
      () => ({ ...DEV_COMPLETE, attempt_id: attemptId, status }),
      'simulation.complete'
    );
  },
};