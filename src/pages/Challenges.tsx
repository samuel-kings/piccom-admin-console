import React, { useState } from 'react';
import { ContentStatus } from '../models/challenge';
import { Plus, Filter, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../components/Button';
import { updateChallenge, deleteChallenge } from '../services/challenge';
import { useToast } from '../contexts/ToastContext';
import { useChallenges } from '../hooks/useChallenges';
import CreateModal from '../components/challenges/CreateModal';
import ChallengeCard from '../components/challenges/ChallengeCard';
import EditModal from '../components/challenges/EditModal';
import BanModal from '../components/challenges/BanModal';

const Challenges: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const {
    challenges,
    total,
    isLoading,
    refresh: loadChallenges
  } = useChallenges(currentPage, searchQuery, statusFilter, itemsPerPage);

  const handleBanChallenge = async (challenge: Challenge, reason: string) => {
    try {
      challenge.status = ContentStatus.Flagged;
      challenge.flagReason = reason;
      await updateChallenge(challenge);
      showToast(`Challenge "${challenge.title}" has been banned`, 'success');
      setShowBanModal(false);
      await loadChallenges();
    } catch (error) {
      console.error('Error banning challenge:', error);
      showToast('Failed to ban challenge', 'error');
    }
  };

  const handleUnbanChallenge = async (challenge: Challenge) => {
    try {
      challenge.status = ContentStatus.Published;
      challenge.flagReason = undefined;
      await updateChallenge(challenge);
      showToast(`Challenge "${challenge.title}" has been unbanned`, 'success');
      await loadChallenges();
    } catch (error) {
      console.error('Error unbanning challenge:', error);
      showToast('Failed to unban challenge', 'error');
    }
  };

  const handleUpdateChallenge = async (updatedChallenge: Challenge) => {
    try {
      await updateChallenge(updatedChallenge);
      showToast(`Challenge "${updatedChallenge.title}" has been updated`, 'success');
      setShowEditModal(false);
      await loadChallenges();
    } catch (error) {
      console.error('Error updating challenge:', error);
      showToast('Failed to update challenge', 'error');
    }
  };

  const handleCreateChallenge = async (challenge: Challenge) => {
    try {
      showToast(`Challenge "${challenge.title}" has been created`, 'success');
      setShowCreateModal(false);
      await loadChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
      showToast('Failed to create challenge', 'error');
    }
  };

  const handleDeleteChallenge = async (challenge: Challenge) => {
    try {
      await deleteChallenge(challenge);
      showToast(`Challenge "${challenge.title}" has been deleted`, 'success');
      await loadChallenges();
    } catch (error) {
      console.error('Error deleting challenge:', error);
      showToast('Failed to delete challenge', 'error');
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Challenges</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Managing {total} total challenges
          </p>
        </div>
        <Button
          text="Create Challenge"
          className="flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search challenges..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
            value={searchQuery || ''}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none bg-white text-gray-900 dark:bg-dark-surface dark:text-white pl-4 pr-10 py-2 border border-gray-300 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'all')}
          >
            <option value="all">All Status</option>
            <option value={ContentStatus.Published}>Published</option>
            <option value={ContentStatus.Draft}>Draft</option>
            <option value={ContentStatus.Flagged}>Flagged</option>
            <option value={ContentStatus.Trash}>Trash</option>
          </select>
          <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.$id}
            challenge={challenge}
            onBan={(challenge) => {
              setSelectedChallenge(challenge);
              setShowBanModal(true);
            }}
            onEdit={(challenge) => {
              setSelectedChallenge(challenge);
              setShowEditModal(true);
            }}
            onUnban={handleUnbanChallenge}
            onDelete={handleDeleteChallenge}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-dark-border">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing {showingStart} to {showingEnd} of {total} challenges
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

      {showEditModal && selectedChallenge && (
        <EditModal
          challenge={selectedChallenge}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateChallenge}
        />
      )}
      {showBanModal && selectedChallenge && (
        <BanModal
          challenge={selectedChallenge}
          onClose={() => setShowBanModal(false)}
          onBan={handleBanChallenge}
        />
      )}
      {showCreateModal && (
        <CreateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateChallenge}
        />
      )}
    </div>
  );
};

export default Challenges;