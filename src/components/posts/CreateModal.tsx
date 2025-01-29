import React, { useState, useRef } from 'react';
import { X, Upload, Image, Video } from 'lucide-react';
import { Post, PostType } from '../../models/post';
import { ContentStatus } from '../../models/challenge';
import Button from '../Button';
import { createPost } from '../../services/post';
import { ID } from 'appwrite';

interface CreateFormData {
  type: PostType;
  caption: string;
  tags: string[];
}

interface CreateModalProps {
  onClose: () => void;
  onCreate: (post: Post) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose, onCreate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<CreateFormData>({
    type: PostType.Image,
    caption: '',
    tags: []
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFileError(null);

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const requiresImage = formData.type === PostType.Image;
    const requiresVideo = formData.type === PostType.Video;

    const isValidType = (requiresImage && isImage) || (requiresVideo && isVideo);
    if (!isValidType) {
      setFileError(`Please select a ${requiresImage ? 'image' : 'video'} file`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async () => {
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!selectedFile) {
      newErrors.file = 'Please select a file';
    } else {
      // Check file size
      const maxSize = formData.type === PostType.Video ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for video, 5MB for image
      if (selectedFile.size > maxSize) {
        newErrors.file = `File size must be less than ${maxSize / (1024 * 1024)}MB`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsUploading(true);

      const post = new Post({
        $id: ID.unique(),
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        userId: '6686dc3f4e295c96caf4',
        countryCode: 'US',
        type: formData.type,
        caption: formData.caption,
        likes: [],
        views: 0,
        status: ContentStatus.Published,
        tags: formData.tags,
        comments: 0
      });

      await createPost(post, selectedFile!);
      onCreate(post);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: 'Failed to create post' });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-surface rounded-lg p-6 max-w-2xl w-full dark:border dark:border-dark-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Post</h3>
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
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, type: e.target.value as PostType }));
                setFileError(null);
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
            >
              <option value={PostType.Image}>Image</option>
              <option value={PostType.Video}>Video</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Caption
            </label>
            <textarea
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
              placeholder="Write a caption..."
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
              placeholder="Enter tags"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {formData.type === PostType.Image ? 'Image' : 'Video'}
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg p-4 text-center cursor-pointer hover:border-[#FD989D] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative group h-48">
                  {formData.type === PostType.Video ? (
                    <video
                      src={previewUrl}
                      className="w-full h-full object-contain rounded-md bg-black"
                      controls
                      controlsList="nodownload"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-md"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  {formData.type === PostType.Video ? (
                    <Video className="w-8 h-8 text-gray-400 mb-2" />
                  ) : (
                    <Image className="w-8 h-8 text-gray-400 mb-2" />
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to upload a {formData.type === PostType.Video ? 'video' : 'image'}
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={formData.type === PostType.Video ? 'video/*' : 'image/*'}
                onChange={handleFileSelect}
              />
              {fileError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {fileError}
                </p>
              )}
              {errors.file && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.file}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {errors.submit && (
            <p className="text-sm text-red-600 dark:text-red-400 mr-auto">
              {errors.submit}
            </p>
          )}
          <button
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-md transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <Button
            text={isUploading ? 'Creating...' : 'Create Post'}
            onClick={handleSubmit}
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateModal;