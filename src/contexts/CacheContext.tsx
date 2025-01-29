import React, { createContext, useContext, useCallback, useState } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface CacheContextType {
  get: <T>(key: string) => CacheItem<T> | null;
  set: <T>(key: string, data: T) => void;
  clear: (key?: string) => void;
  refreshThreshold: number;
}

const CacheContext = createContext<CacheContextType | null>(null);

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cache, setCache] = useState<Record<string, CacheItem<any>>>({});
  const refreshThreshold = 30000; // 30 seconds

  const get = useCallback(<T,>(key: string): CacheItem<T> | null => {
    return cache[key] || null;
  }, [cache]);

  const set = useCallback(<T,>(key: string, data: T) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now()
      }
    }));
  }, []);

  const clear = useCallback((key?: string) => {
    if (key) {
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
    } else {
      setCache({});
    }
  }, []);

  return (
    <CacheContext.Provider value={{ get, set, clear, refreshThreshold }}>
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};