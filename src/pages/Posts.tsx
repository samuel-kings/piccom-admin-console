import React, { useState } from 'react';
import { Post } from '../models/post';
import { ContentStatus } from '../models/challenge';
import { Search, ChevronRight, ChevronLeft, Filter, Plus } from 'lucide-react';
import { updatePost, deletePost } from '../services/post';
import { useToast } from '../contexts/ToastContext';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/posts/PostCard';
import EditModal from '../components/posts/EditModal';
import BanModal from '../components/posts/BanModal';
import CreateModal from '../components/posts/CreateModal';
import Button from '../components/Button';

const Posts: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const {
    posts,
    total,
    isLoading,
    refresh: loadPosts
  } = usePosts(currentPage, searchQuery, statusFilter, itemsPerPage);

  const handleBanPost = async (post: Post, reason: string) => {
    try {
      post.status = ContentStatus.Flagged;
      post.flagReason = reason;
      await updatePost(post);
      showToast('Post has been flagged', 'success');
      setShowBanModal(false);
      await loadPosts();
    } catch (error) {
      console.error('Error flagging post:', error);
      showToast('Failed to flag post', 'error');
    }
  };

  const handleUnbanPost = async (post: Post) => {
    try {
      post.status = ContentStatus.Published;
      post.flagReason = undefined;
      await updatePost(post);
      showToast('Post has been unflagged', 'success');
      await loadPosts();
    } catch (error) {
      console.error('Error unflagging post:', error);
      showToast('Failed to unflag post', 'error');
    }
  };

  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      await updatePost(updatedPost);
      showToast('Post has been updated', 'success');
      setShowEditModal(false);
      await loadPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      showToast('Failed to update post', 'error');
    }
  };

  const handleDeletePost = async (post: Post) => {
    try {
      await deletePost(post);
      showToast('Post has been deleted', 'success');
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Failed to delete post', 'error');
    }
  };

  const handleCreatePost = async (post: Post) => {
    try {
      showToast('Post has been created', 'success');
      setShowCreateModal(false);
      await loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      showToast('Failed to create post', 'error');
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
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Posts</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Managing {total} total posts
          </p>
        </div>
        <Button
          text="Create Post"
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
            placeholder="Search posts by caption..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
            value={searchQuery}
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
        {posts.map((post) => (
          <PostCard
            key={post.$id}
            post={post}
            onBan={(post) => {
              setSelectedPost(post);
              setShowBanModal(true);
            }}
            onEdit={(post) => {
              setSelectedPost(post);
              setShowEditModal(true);
            }}
            onUnban={handleUnbanPost}
            onDelete={handleDeletePost}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-dark-border">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Showing {showingStart} to {showingEnd} of {total} posts
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

      {showEditModal && selectedPost && (
        <EditModal
          post={selectedPost}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdatePost}
        />
      )}
      {showBanModal && selectedPost && (
        <BanModal
          post={selectedPost}
          onClose={() => setShowBanModal(false)}
          onBan={handleBanPost}
        />
      )}
      {showCreateModal && (
        <CreateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePost}
        />
      )}
    </div>
  );
};

export default Posts;