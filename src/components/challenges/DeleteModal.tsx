import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Challenge } from '../../models/challenge';

interface DeleteModalProps {
  challenge: Challenge;
  onClose: () => void;
  onDelete: (challenge: Challenge) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ challenge, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-surface rounded-lg p-6 max-w-md w-full dark:border dark:border-dark-border">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertCircle className="w-5 h-5" />
          <h3 className="text-lg font-semibold dark:text-white">Delete Challenge</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to delete "{challenge.title}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={() => onDelete(challenge)}
          >
            Delete Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;