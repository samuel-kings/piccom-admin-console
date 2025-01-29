import { useState, useCallback, useEffect } from 'react';
import { useCache } from '../contexts/CacheContext';

interface UseDataCacheOptions<T> {
  key: string;
  fetchData: () => Promise<T>;
  dependencies?: any[];
}

interface UseDataCacheResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDataCache<T>({
  key,
  fetchData,
  dependencies = []
}: UseDataCacheOptions<T>): UseDataCacheResult<T> {
  const { get, set, refreshThreshold } = useCache();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const shouldRefresh = useCallback(() => {
    const cached = get<T>(key);
    if (!cached) return true;
    return Date.now() - cached.timestamp > refreshThreshold;
  }, [get, key, refreshThreshold]);

  const refresh = useCallback(async () => {
    try {
      if (!data) {
        setIsLoading(true);
      }
      const newData = await fetchData();
      set(key, newData);
      setData(newData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, key, set, data]);

  useEffect(() => {
    const cached = get<T>(key);
    if (cached) {
      setData(cached.data);
      setIsLoading(false);
      if (shouldRefresh()) {
        refresh();
      }
    } else {
      refresh();
    }
  }, [...dependencies, key]);

  // Refresh on tab focus
  useEffect(() => {
    const handleFocus = () => {
      if (shouldRefresh()) {
        refresh();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refresh, shouldRefresh]);

  return { data, isLoading, error, refresh };
}