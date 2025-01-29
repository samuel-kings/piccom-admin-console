import React, { useState, useRef } from 'react';
import { X, Upload, Image, Video } from 'lucide-react';
import { Challenge, ChallengeType, ContentStatus } from '../../models/challenge';
import Button from '../Button';
import { createChallenge } from '../../services/challenge';
import { ID } from 'appwrite';

interface CreateFormData {
  title: string;
  description: string;
  type: ChallengeType;
  requirements: string;
  prize?: string;
  maxParticipants?: number;
  startDate: string;
  endDate: string;
  tags: string[];
}

interface CreateModalProps {
  onClose: () => void;
  onCreate: (challenge: Challenge) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose, onCreate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<CreateFormData>(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      title: '',
      description: '',
      type: ChallengeType.ImageFromCamera,
      requirements: '',
      startDate: now.toISOString().slice(0, 16),
      endDate: tomorrow.toISOString().slice(0, 16),
      tags: []
    };
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Revoke previous preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFileError(null);

    // Validate file type based on challenge type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const requiresImage = formData.type === ChallengeType.ImageFromCamera || formData.type === ChallengeType.ImageFromGallery;
    const requiresVideo = formData.type === ChallengeType.VideoFromCamera || formData.type === ChallengeType.VideoFromGallery;

    const isValidType = (requiresImage && isImage) || (requiresVideo && isVideo);
    if (!isValidType) {
      setFileError(`Please select a ${requiresImage ? 'image' : 'video'} file`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Cleanup preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async () => {
    // Reset previous errors
    setErrors({});

    // Validate required fields
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    }

    if (formData.tags.length === 0 || (formData.tags.length === 1 && formData.tags[0] === '')) {
      newErrors.tags = 'At least one tag is required';
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const now = new Date();

    if (startDate < now) {
      newErrors.startDate = 'Start date must be in the future';
    }

    if (endDate <= startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!selectedFile) {
      newErrors.file = 'Please select a cover image/video';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsUploading(true);

      const challenge = new Challenge({
        $id: ID.unique(),
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        creatorId: 'admin', // Since this is admin panel
        title: formData.title,
        description: formData.description,
        type: formData.type,
        requirements: formData.requirements,
        prize: formData.prize,
        maxParticipants: formData.maxParticipants,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: ContentStatus.Published,
        tags: formData.tags,
        totalPosts: 0
      });

      await createChallenge(challenge, selectedFile!);
      onCreate(challenge);
    } catch (error) {
      console.error('Error creating challenge:', error);
      if (error instanceof Error) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: 'Failed to create challenge' });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-surface rounded-lg p-6 max-w-2xl w-full dark:border dark:border-dark-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Challenge</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
                placeholder="Enter challenge title"
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
                placeholder="Describe the challenge"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, type: e.target.value as ChallengeType }));
                  setFileError(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
              >
                <option value={ChallengeType.ImageFromCamera}>Image from Camera</option>
                <option value={ChallengeType.ImageFromGallery}>Image from Gallery</option>
                <option value={ChallengeType.VideoFromCamera}>Video from Camera</option>
                <option value={ChallengeType.VideoFromGallery}>Video from Gallery</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Requirements
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
                placeholder="List the challenge requirements"
                required
              />
              {errors.requirements && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.requirements}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prize (optional)
              </label>
              <input
                type="text"
                value={formData.prize || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, prize: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
                placeholder="Enter prize details"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Participants (optional)
              </label>
              <input
                type="number"
                value={formData.maxParticipants || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
                placeholder="Enter maximum participants"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
                required
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
                required
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.endDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma-separated) *
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }))}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
                placeholder="Enter tags (required)"
                required
              />
              {errors.tags && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.tags}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover {formData.type.includes('Video') ? 'Video' : 'Image'}
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg p-4 text-center cursor-pointer hover:border-[#FD989D] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="relative group h-48">
                    {formData.type.includes('Video') ? (
                      <video
                        src={previewUrl}
                        className="w-full h-full object-contain rounded-md bg-black"
                        controls
                        controlsList="nodownload"
                        onLoadedMetadata={(e) => {
                          // Revoke the object URL when the video loads to prevent memory leaks
                          URL.revokeObjectURL(previewUrl);
                          console.log('Video duration:', e.currentTarget.duration);
                        }}
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-md"
                        onLoad={() => {
                          // Revoke the object URL when the image loads
                          URL.revokeObjectURL(previewUrl);
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    {formData.type.includes('Video') ? (
                      <Video className="w-8 h-8 text-gray-400 mb-2" />
                    ) : (
                      <Image className="w-8 h-8 text-gray-400 mb-2" />
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click to upload a {formData.type === ChallengeType.VideoFromCamera || formData.type === ChallengeType.VideoFromGallery ? 'video' : 'image'}
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={formData.type === ChallengeType.VideoFromCamera || formData.type === ChallengeType.VideoFromGallery ? 'video/*' : 'image/*'}
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
            text={isUploading ? 'Creating...' : 'Create Challenge'}
            onClick={handleSubmit}
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateModal;