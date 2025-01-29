import React from 'react';
import { X } from 'lucide-react';

interface TagsModalProps {
  tags: string[];
  onClose: () => void;
}

const TagsModal: React.FC<TagsModalProps> = ({ tags, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-dark-surface rounded-lg p-6 max-w-md w-full dark:border dark:border-dark-border" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Tags</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsModal;