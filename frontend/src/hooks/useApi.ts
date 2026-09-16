import { useCallback, useEffect, useRef, useState } from 'react';
import { type ApiError } from '../lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

interface UseApiOptions<T> {
  immediate?: boolean;
  fallback?: () => T;
  onData?: (data: T) => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiState<T> & { setData: React.Dispatch<React.SetStateAction<T | null>> } {
  const { immediate = true, onData, fallback } = options;
  const mountedRef = useRef(true);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<ApiError | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      if (mountedRef.current) {
        setData(result);
        onData?.(result);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      if (err && typeof err === 'object' && 'code' in err) {
        setError(err as ApiError);
      } else {
        setError({ code: 'unknown', message: 'An unexpected error occurred.', name: 'ApiError' });
      }
      if (fallback) setData(fallback());
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [fallback, onData]);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) fetch();
    return () => { mountedRef.current = false; };
  }, [immediate]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: fetch, setData };
}