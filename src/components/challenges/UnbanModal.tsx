import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Challenge } from '../../models/challenge';

interface UnbanModalProps {
  challenge: Challenge;
  onClose: () => void;
  onUnban: (challenge: Challenge) => void;
}

const UnbanModal: React.FC<UnbanModalProps> = ({ challenge, onClose, onUnban }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-surface rounded-lg p-6 max-w-md w-full dark:border dark:border-dark-border">
        <div className="flex items-center gap-2 text-green-600 mb-4">
          <AlertCircle className="w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Unban Challenge</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to unban "{challenge.title}"? This action will make the challenge available to users again.
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={() => onUnban(challenge)}
          >
            Unban Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnbanModal;