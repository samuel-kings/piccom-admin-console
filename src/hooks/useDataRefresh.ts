import { useEffect, useCallback } from 'react';
import useStore from '../store/store';

interface UseDataRefreshProps<T> {
  pageState: {
    data: T;
    lastFetched: number;
    isLoading: boolean;
  };
  fetchData: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  dependencies?: any[];
}

export const useDataRefresh = <T>({
  pageState,
  fetchData,
  setLoading,
  dependencies = [],
}: UseDataRefreshProps<T>) => {
  const refreshThreshold = useStore((state) => state.refreshThreshold);

  const shouldRefresh = useCallback(() => {
    const now = Date.now();
    return !pageState.data || now - pageState.lastFetched > refreshThreshold;
  }, [pageState.data, pageState.lastFetched, refreshThreshold]);

  const refresh = useCallback(async () => {
    if (shouldRefresh()) {
      if (!pageState.data) {
        setLoading(true);
      }
      await fetchData();
    }
  }, [fetchData, shouldRefresh, pageState.data, setLoading]);

  // Initial load and dependency changes
  useEffect(() => {
    refresh();
  }, [...dependencies, refresh]);

  // Refresh on tab focus
  useEffect(() => {
    const handleFocus = () => {
      refresh();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refresh]);

  return { refresh };
};