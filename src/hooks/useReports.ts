import { fetchReports } from '../services/report';
import { useDataCache } from './useDataCache';
import type { Report } from '../models/report';

interface ReportsData {
  reports: Report[];
  total: number;
}

export const useReports = (
  currentPage: number,
  typeFilter: string,
  itemsPerPage: number,
  sortBy: string
) => {
  const { data, isLoading, error, refresh } = useDataCache<ReportsData>({
    key: `reports-${currentPage}-${typeFilter}-${sortBy}`,
    fetchData: () => fetchReports({ typeFilter, currentPage, itemsPerPage, sortBy }),
    dependencies: [currentPage, typeFilter, itemsPerPage, sortBy]
  });

  return {
    reports: data?.reports || [],
    total: data?.total || 0,
    isLoading,
    error,
    refresh
  };
};