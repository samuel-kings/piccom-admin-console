import React, { useEffect, useState } from 'react';
import { Profile } from '../models/profile';
import { fetchProfiles, toggleVerification, toggleAccountStatus } from '../services/profile';
import UserAvatar from '../components/UserAvatar';
import { useToast } from '../contexts/ToastContext';
import { Search, ChevronLeft, ChevronRight, BadgeCheck, ShieldX, Ban, ShieldCheck, AlertCircle, Filter, MoreVertical } from 'lucide-react';

type StatusFilter = 'all' | 'active' | 'suspended';

const Users: React.FC = () => {
  const { showToast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);
  const itemsPerPage = 25;

  const loadProfiles = async () => {
    try {
      const result = await fetchProfiles({
        searchQuery,
        statusFilter,
        currentPage,
        itemsPerPage
      });
      setProfiles(result.profiles);
      setTotalProfiles(result.total);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [searchQuery, statusFilter, currentPage]);

  const handleVerifyUser = async (profile: Profile) => {
    try {
      await toggleVerification(profile);
      showToast(
        `${profile.name} has been ${profile.isVerified ? 'unverified' : 'verified'} successfully`,
        'success'
      );
      setShowVerifyModal(false);
      loadProfiles();
    } catch (error) {
      console.error('Error verifying user:', error);
      showToast('Failed to update verification status', 'error');
    }
  };

  const handleToggleStatus = async (profile: Profile) => {
    try {
      const newStatus = await toggleAccountStatus(profile);
      profile.status = newStatus;
      showToast(
        `${profile.name} has been ${newStatus ? 'reactivated' : 'suspended'} successfully`,
        'success'
      );
      setShowSuspendModal(false);
      loadProfiles();
    } catch (error) {
      console.error('Error toggling user status:', error);
      showToast('Failed to update account status', 'error');
    }
  };

  const VerifyModal: React.FC = () => {
    if (!selectedProfile) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-dark-surface rounded-lg p-6 max-w-md w-full dark:border dark:border-dark-border">
          <div className="flex items-center gap-2 text-blue-600 mb-4">
            <BadgeCheck className="w-5 h-5" />
            <h3 className="text-lg font-semibold dark:text-white">
              {selectedProfile.isVerified ? 'Remove Verification' : 'Verify User'}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {selectedProfile.isVerified
              ? `Are you sure you want to remove verification from ${selectedProfile.name}?`
              : `Are you sure you want to verify ${selectedProfile.name}?`}
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
              onClick={() => setShowVerifyModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => handleVerifyUser(selectedProfile)}
            >
              {selectedProfile.isVerified ? 'Remove Verification' : 'Verify User'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SuspendModal: React.FC = () => {
    if (!selectedProfile) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-dark-surface rounded-lg p-6 max-w-md w-full dark:border dark:border-dark-border">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-lg font-semibold dark:text-white">
              {selectedProfile.status ? 'Suspend User' : 'Reactivate User'}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {selectedProfile.status
              ? `Are you sure you want to suspend ${selectedProfile.name}? They will not be able to access their account.`
              : `Are you sure you want to reactivate ${selectedProfile.name}'s account?`}
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
              onClick={() => setShowSuspendModal(false)}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 ${
                selectedProfile.status ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } text-white rounded-md transition-colors`}
              onClick={() => handleToggleStatus(selectedProfile)}
            >
              {selectedProfile.status ? 'Suspend User' : 'Reactivate User'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MoreMenu: React.FC<{ profile: Profile }> = ({ profile }) => {
    if (showMoreMenu !== profile.$id) return null;

    return (
      <div 
        className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 dark:ring-dark-border z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border"
          onClick={() => {
            setSelectedProfile(profile);
            setShowVerifyModal(true);
            setShowMoreMenu(null);
          }}
        >
          {profile.isVerified ? (
            <ShieldX className="w-4 h-4 mr-3 text-red-500" />
          ) : (
            <ShieldCheck className="w-4 h-4 mr-3 text-blue-500" />
          )}
          {profile.isVerified ? 'Remove Verification' : 'Verify User'}
        </button>
        <button
          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border"
          onClick={() => {
            setSelectedProfile(profile);
            setShowSuspendModal(true);
            setShowMoreMenu(null);
          }}
        >
          {profile.status ? (
            <Ban className="w-4 h-4 mr-3 text-red-500" />
          ) : (
            <ShieldCheck className="w-4 h-4 mr-3 text-green-500" />
          )}
          {profile.status ? 'Suspend User' : 'Reactivate User'}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-98px)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FD989D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalProfiles / itemsPerPage);
  const showingStart = ((currentPage - 1) * itemsPerPage) + 1;
  const showingEnd = Math.min(currentPage * itemsPerPage, totalProfiles);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Managing {totalProfiles} total users
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name or username..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none bg-white text-gray-900 dark:bg-dark-surface dark:text-white pl-4 pr-10 py-2 border border-gray-300 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="suspended">Suspended Users</option>
          </select>
          <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm overflow-hidden dark:border dark:border-dark-border transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-border/50 border-b border-gray-200 dark:border-dark-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">Username</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">Joined</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr 
                  key={profile.$id} 
                  className="border-b border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-colors cursor-pointer"
                  onClick={() => window.open(`https://piccom.web.app/profile/${profile.username}`, '_blank')}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        userId={profile.$id}
                        name={profile.name}
                        pfpId={profile.pfpId}
                        size={40}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">{profile.name}</p>
                          {profile.isVerified && (
                            <BadgeCheck className="w-4 h-4 text-blue-500" />
                          )}
                          {!profile.status && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              Suspended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {profile.following.length} following • {profile.totalFollowers} followers
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{profile.email}</td>
                  <td className="py-3 px-4">
                    <span className="text-gray-600 dark:text-gray-300">@{profile.username}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {new Date(profile.$createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMoreMenu(showMoreMenu === profile.$id ? null : profile.$id);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <MoreMenu profile={profile} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-dark-border">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing {showingStart} to {showingEnd} of {totalProfiles} users
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

      {showVerifyModal && <VerifyModal />}
      {showSuspendModal && <SuspendModal />}
    </div>
  );
};

export default Users;