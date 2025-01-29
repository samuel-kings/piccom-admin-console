import { fetchTickets } from '../services/support';
import { useDataCache } from './useDataCache';
import type { SupportTicket } from '../models/support';

interface TicketsData {
  tickets: SupportTicket[];
  total: number;
}

export const useTickets = (
  currentPage: number,
  statusFilter: string,
  itemsPerPage: number,
  sortBy: string
) => {
  const { data, isLoading, error, refresh } = useDataCache<TicketsData>({
    key: `tickets-${currentPage}-${statusFilter}-${sortBy}`,
    fetchData: () => fetchTickets({ statusFilter, currentPage, itemsPerPage, sortBy }),
    dependencies: [currentPage, statusFilter, itemsPerPage, sortBy]
  });

  return {
    tickets: data?.tickets || [],
    total: data?.total || 0,
    isLoading,
    error,
    refresh
  };
};