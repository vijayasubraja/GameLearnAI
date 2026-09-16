import { normalizeApiError, type ApiError } from '../lib/api';
import { DEV_FALLBACK_ENABLED } from './fallback/devData';

/**
 * Runs a real API call; if the endpoint is unavailable (network, timeout,
 * 404/405 not-implemented, or server fault) AND dev fallback is explicitly
 * enabled via `VITE_ENABLE_DEV_FALLBACK=true`, returns clearly-marked
 * development preview data instead. Never masks auth or validation failures.
 */
export async function withDevFallback<T extends object>(
  fn: () => Promise<T>,
  fallback: () => T,
  tag: string
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const apiErr = normalizeApiError(err);
    const canFallback =
      apiErr.code === 'network' ||
      apiErr.code === 'timeout' ||
      apiErr.code === 'not_found' ||
      apiErr.code === 'server';

    if (DEV_FALLBACK_ENABLED && canFallback) {
      console.warn(
        `[dev-fallback] ${tag} — backend endpoint unavailable (${apiErr.code}), using marked development preview data.`
      );
      return fallback();
    }
    throw err;
  }
}

export type { ApiError };