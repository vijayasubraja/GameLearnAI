import { apiRequest } from '../lib/api';
import type { PerformanceResult, ProgressHistoryPayload } from '../types/domain';
import { DEV_PROGRESS, devResultFor } from './fallback/devData';
import { withDevFallback } from './utils';

export const performanceService = {
  getResult(attemptId: string): Promise<PerformanceResult> {
    // NOTE: result construction in dev mode requires scenario + events context,
    // which lives in the simulation session. See dev simulation flow.
    return withDevFallback<PerformanceResult>(
      () =>
        apiRequest<PerformanceResult>({
          method: 'GET',
          url: `/performance/attempts/${encodeURIComponent(attemptId)}`,
        }),
      () => {
        throw new Error(`No standalone dev result for attempt ${attemptId}; render via the simulation flow.`);
      },
      'performance.result'
    );
  },

  getProgress(): Promise<ProgressHistoryPayload> {
    return withDevFallback<ProgressHistoryPayload>(
      () => apiRequest<ProgressHistoryPayload>({ method: 'GET', url: '/progress/history' }),
      () => DEV_PROGRESS,
      'progress.history'
    );
  },
};

export { devResultFor };