import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Post } from '../../models/post';
import Button from '../Button';

interface EditFormData {
  caption: string;
  tags: string[];
}

interface EditModalProps {
  post: Post;
  onClose: () => void;
  onUpdate: (post: Post) => void;
}

const EditModal: React.FC<EditModalProps> = ({ post, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<EditFormData>({
    caption: post.caption || '',
    tags: [...post.tags],
  });

  const handleSubmit = () => {
    const updatedPost = new Post({
      ...post,
      caption: formData.caption,
      tags: formData.tags,
    });

    onUpdate(updatedPost);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-surface rounded-lg p-6 max-w-md w-full dark:border dark:border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Post</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Caption
            </label>
            <textarea
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }))}
              className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <Button
            text="Update Post"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default EditModal;