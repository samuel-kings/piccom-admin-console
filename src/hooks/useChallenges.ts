import { fetchChallenges } from '../services/challenge';
import { useDataCache } from './useDataCache';
import type { Challenge } from '../models/challenge';

interface ChallengesData {
  challenges: Challenge[];
  total: number;
}

export const useChallenges = (
  currentPage: number,
  searchQuery: string,
  statusFilter: string,
  itemsPerPage: number
) => {
  const { data, isLoading, error, refresh } = useDataCache<ChallengesData>({
    key: `challenges-${currentPage}-${searchQuery}-${statusFilter}`,
    fetchData: () => fetchChallenges({ searchQuery, statusFilter, currentPage, itemsPerPage }),
    dependencies: [currentPage, searchQuery, statusFilter, itemsPerPage]
  });

  return {
    challenges: data?.challenges || [],
    total: data?.total || 0,
    isLoading,
    error,
    refresh
  };
};