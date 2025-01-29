import { fetchDashboardStats, type DashboardStats } from '../services/home';
import { useDataCache } from './useDataCache';

export const useDashboard = () => {
  const { data, isLoading, error, refresh } = useDataCache<DashboardStats>({
    key: 'dashboard',
    fetchData: fetchDashboardStats
  });

  return {
    stats: data || {
      totalUsers: 0,
      newUsers: 0,
      totalChallenges: 0,
      newChallenges: 0,
      activeChallenges: 0,
      totalPosts: 0,
      newPosts: 0,
      newReports: 0,
    },
    isLoading,
    error,
    refresh
  };
};