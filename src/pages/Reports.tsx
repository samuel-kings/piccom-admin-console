import React, { useState } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReportType } from '../models/report';
import { useReports } from '../hooks/useReports';
import UserAvatar from '../components/UserAvatar';
import { getProfile } from '../services/profile';

const Reports: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<ReportType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const itemsPerPage = 25;

  const {
    reports,
    total,
    isLoading,
  } = useReports(currentPage, typeFilter, itemsPerPage, sortBy);

  const [userDetails, setUserDetails] = useState<Record<string, { name: string; pfpId?: string }>>({});

  React.useEffect(() => {
    const loadUserDetails = async () => {
      const userIds = reports.map(r => r.userId);
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

    if (reports.length > 0) {
      loadUserDetails();
    }
  }, [reports]);

  const getResourceUrl = (type: ReportType, resourceId: string) => {
    switch (type) {
      case ReportType.Challenge:
        return `https://piccom.web.app/challenges/${resourceId}`;
      case ReportType.Post:
        return `https://piccom.web.app/posts/${resourceId}`;
      case ReportType.PostComment:
        return `https://piccom.web.app/posts/${resourceId}`;
      case ReportType.User:
        return `https://piccom.web.app/profile/${resourceId}`;
      default:
        return '#';
    }
  };

  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case ReportType.Challenge:
        return 'Challenge Report';
      case ReportType.Post:
        return 'Post Report';
      case ReportType.PostComment:
        return 'Comment Report';
      case ReportType.User:
        return 'User Report';
      default:
        return 'Report';
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Reports</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Managing {total} total reports</p>
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
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <div className="relative">
            <select
              className="appearance-none bg-white text-gray-900 dark:bg-dark-surface dark:text-white pl-4 pr-10 py-2 border border-gray-300 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ReportType | 'all')}
            >
              <option value="all">All Types</option>
              <option value={ReportType.Challenge}>Challenges</option>
              <option value={ReportType.Post}>Posts</option>
              <option value={ReportType.PostComment}>Comments</option>
              <option value={ReportType.User}>Users</option>
            </select>
            <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {reports.map((report) => (
          <a
            key={report.resourceId}
            href={getResourceUrl(report.type, report.resourceId)}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white dark:bg-dark-surface rounded-lg shadow-sm p-6 dark:border dark:border-dark-border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <UserAvatar
                  userId={report.userId}
                  name={userDetails[report.userId]?.name || 'Loading...'}
                  pfpId={userDetails[report.userId]?.pfpId}
                  size={40}
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {userDetails[report.userId]?.name || 'Loading...'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reported a {report.type}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  report.type === ReportType.Challenge
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    : report.type === ReportType.Post
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : report.type === ReportType.PostComment
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                }`}
              >
                {getReportTypeLabel(report.type)}
              </span>
            </div>

            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {report.title}
            </h4>

            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {report.message}
            </p>

            <div className="mt-4 text-sm text-[#FD989D] hover:text-[#fd989d]/80">
              View reported {report.type.toLowerCase()} →
            </div>
          </a>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-dark-border">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing {showingStart} to {showingEnd} of {total} reports
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

export default Reports;