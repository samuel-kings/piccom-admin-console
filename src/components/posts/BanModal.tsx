import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Post } from '../../models/post';

interface BanModalProps {
  post: Post;
  onClose: () => void;
  onBan: (post: Post, reason: string) => void;
}

const BanModal: React.FC<BanModalProps> = ({ post, onClose, onBan }) => {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-surface rounded-lg p-6 max-w-md w-full dark:border dark:border-dark-border">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertCircle className="w-5 h-5" />
          <h3 className="text-lg font-semibold dark:text-white">Flag Post</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to flag this post? This action will make it unavailable to users.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reason for flagging
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for flagging this post..."
            style={{ backgroundColor: 'white' }}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={() => onBan(post, reason)}
          >
            Flag Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanModal;