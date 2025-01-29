import { fetchProfiles } from '../services/profile';
import { useDataCache } from './useDataCache';
import type { Profile } from '../models/profile';

interface UsersData {
  profiles: Profile[];
  total: number;
}

export const useUsers = (
  currentPage: number,
  searchQuery: string,
  statusFilter: string,
  itemsPerPage: number
) => {
  const { data, isLoading, error, refresh } = useDataCache<UsersData>({
    key: `users-${currentPage}-${searchQuery}-${statusFilter}`,
    fetchData: () => fetchProfiles({ searchQuery, statusFilter, currentPage, itemsPerPage }),
    dependencies: [currentPage, searchQuery, statusFilter, itemsPerPage]
  });

  return {
    profiles: data?.profiles || [],
    total: data?.total || 0,
    isLoading,
    error,
    refresh
  };
};