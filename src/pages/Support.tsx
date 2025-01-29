import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Filter, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { TicketStatus } from '../models/support';
import { useTickets } from '../hooks/useTickets';
import UserAvatar from '../components/UserAvatar';
import { getProfile } from '../services/profile';

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const itemsPerPage = 25;
  const location = useLocation();

  const {
    tickets,
    total,
    isLoading,
    refresh: loadTickets
  } = useTickets(currentPage, statusFilter, itemsPerPage, sortBy);

  const [userDetails, setUserDetails] = useState<Record<string, { name: string; pfpId?: string }>>({});

  // Refresh tickets when navigating back to this page
  useEffect(() => {
    loadTickets();
  }, [location.pathname, loadTickets]);

  React.useEffect(() => {
    const loadUserDetails = async () => {
      const userIds = tickets.map(t => t.customerId);
      const uniqueUserIds = [...new Set(userIds)];

      const details: Record<string, { name: string; pfpId?: string }> = {};
      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            const profile = await getProfile(userId);
            details[userId] = {
              name: profile.name,
              pfpId: profile.pfpId
            };
          } catch (error) {
            console.error(`Error loading user details for ${userId}:`, error);
          }
        })
      );

      setUserDetails(details);
    };

    if (tickets.length > 0) {
      loadUserDetails();
    }
  }, [tickets]);

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Open:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-2';
      case TicketStatus.Pending:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case TicketStatus.OnHold:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case TicketStatus.Closed:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-98px)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FD989D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / itemsPerPage);
  const showingStart = ((currentPage - 1) * itemsPerPage) + 1;
  const showingEnd = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Support Tickets</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Managing {total} total tickets
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <select
              className="appearance-none bg-white text-gray-900 dark:bg-dark-surface dark:text-white pl-4 pr-10 py-2 border border-gray-300 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="status">Sort by Status</option>
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none bg-white text-gray-900 dark:bg-dark-surface dark:text-white pl-4 pr-10 py-2 border border-gray-300 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
            >
              <option value="all">All Status</option>
              <option value={TicketStatus.Open}>Open</option>
              <option value={TicketStatus.OnHold}>On Hold</option>
              <option value={TicketStatus.Closed}>Closed</option>
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.$id}
            className="bg-white dark:bg-dark-surface rounded-lg shadow-sm p-6 dark:border dark:border-dark-border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/support/${ticket.$id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <UserAvatar
                  userId={ticket.customerId}
                  name={userDetails[ticket.customerId]?.name || 'Loading...'}
                  pfpId={userDetails[ticket.customerId]?.pfpId}
                  size={40}
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {userDetails[ticket.customerId]?.name || 'Loading...'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(ticket.$createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}
              >
                <span>{ticket.status}</span>
                {ticket.isNew && ticket.status === TicketStatus.Open && (
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </span>
            </div>

            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {ticket.title}
            </h4>

            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
              {ticket.lastMessage && ticket.lastMessage.trim() ? (
                (() => {
                  try {
                    const messageData = JSON.parse(ticket.lastMessage);
                    return messageData.message || 'No message content';
                  } catch (error) {
                    return ticket.lastMessage;
                  }
                })()
              ) : (
                'No message available'
              )}
            </p>

            <div className="mt-4 flex items-center gap-2 text-[#FD989D] hover:text-[#fd989d]/80">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">View conversation</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-dark-border">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing {showingStart} to {showingEnd} of {total} tickets
        </p>
        <div className="flex gap-2">
          <button
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#FD989D] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#FD989D] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Support;