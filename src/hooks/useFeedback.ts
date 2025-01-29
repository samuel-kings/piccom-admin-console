import { fetchFeedback } from '../services/feedback';
import { useDataCache } from './useDataCache';
import type { Feedback } from '../models/feedback';

interface FeedbackData {
  feedback: Feedback[];
  total: number;
}

export const useFeedback = (
  currentPage: number,
  typeFilter: string,
  itemsPerPage: number,
  sortBy: string
) => {
  const { data, isLoading, error, refresh } = useDataCache<FeedbackData>({
    key: `feedback-${currentPage}-${typeFilter}-${sortBy}`,
    fetchData: () => fetchFeedback({ typeFilter, currentPage, itemsPerPage, sortBy }),
    dependencies: [currentPage, typeFilter, itemsPerPage, sortBy]
  });

  return {
    feedback: data?.feedback || [],
    total: data?.total || 0,
    isLoading,
    error,
    refresh
  };
};