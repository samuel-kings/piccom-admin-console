import React, { useState } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { FeedbackType } from '../models/feedback';
import { useFeedback } from '../hooks/useFeedback';
import UserAvatar from '../components/UserAvatar';
import { getProfile } from '../services/profile';

const Feedback: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<FeedbackType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const itemsPerPage = 25;

  const {
    feedback,
    total,
    isLoading,
  } = useFeedback(currentPage, typeFilter, itemsPerPage, sortBy);

  const [userDetails, setUserDetails] = useState<Record<string, { name: string; pfpId?: string }>>({});

  React.useEffect(() => {
    const loadUserDetails = async () => {
      const userIds = feedback
        .filter(f => f.userId)
        .map(f => f.userId!);

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

    if (feedback.length > 0) {
      loadUserDetails();
    }
  }, [feedback]);

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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">User Feedback</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Managing {total} total feedback entries
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
              <option value="type">Sort by Type</option>
              <option value="rating">Sort by Rating</option>
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none bg-white text-gray-900 dark:bg-dark-surface dark:text-white pl-4 pr-10 py-2 border border-gray-300 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as FeedbackType | 'all')}
            >
              <option value="all">All Types</option>
              <option value={FeedbackType.Feedback}>General Feedback</option>
              <option value={FeedbackType.DeactivationReason}>Deactivation Reasons</option>
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {feedback.map((item) => (
          <div
            key={item.$id}
            className="bg-white dark:bg-dark-surface rounded-lg shadow-sm p-6 dark:border dark:border-dark-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {item.userId ? (
                  <>
                    <UserAvatar
                      userId={item.userId}
                      name={userDetails[item.userId]?.name || 'Loading...'}
                      pfpId={userDetails[item.userId]?.pfpId}
                      size={40}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {userDetails[item.userId]?.name || 'Loading...'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.$createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Anonymous User</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.$createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.type === FeedbackType.Feedback
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                }`}
              >
                {item.type === FeedbackType.Feedback ? 'Feedback' : 'Deactivation Reason'}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {item.message}
            </p>

            {item.rating !== undefined && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rating:
                </span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= item.rating!
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-dark-border">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing {showingStart} to {showingEnd} of {total} feedback entries
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

export default Feedback;