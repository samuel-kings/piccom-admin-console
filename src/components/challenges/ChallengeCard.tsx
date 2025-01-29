import React, { useState } from 'react';
import { Video, Ban, Flag, Edit, Trash2 } from 'lucide-react';
import { Challenge, ChallengeType, ContentStatus } from '../../models/challenge';
import UrlHelper from '../../url_helper';
import TagsModal from './TagsModal';
import UnbanModal from './UnbanModal';
import DeleteModal from './DeleteModal';

interface ChallengeCardProps {
  challenge: Challenge;
  onBan: (challenge: Challenge) => void;
  onEdit: (challenge: Challenge) => void;
  onUnban: (challenge: Challenge) => void;
  onDelete: (challenge: Challenge) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onBan,
  onEdit,
  onUnban,
  onDelete
}) => {
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isActive = new Date(challenge.endDate) > new Date();
  const statusColors = {
    [ContentStatus.Published]: 'bg-blue-100 text-blue-800',
    [ContentStatus.Draft]: 'bg-gray-100 text-gray-800',
    [ContentStatus.Flagged]: 'bg-red-100 text-red-800',
    [ContentStatus.Trash]: 'bg-gray-100 text-gray-800',
  };

  const MAX_VISIBLE_TAGS = 3;
  const visibleTags = challenge.tags.slice(0, MAX_VISIBLE_TAGS);
  const remainingTags = challenge.tags.length - MAX_VISIBLE_TAGS;

  const isVideoChallenge = (type: ChallengeType) => {
    return type === ChallengeType.VideoFromCamera || type === ChallengeType.VideoFromGallery;
  };

  const handleShowTags = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTagsModal(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(challenge);
  };

  return (
    <>
      <a 
        href={`https://piccom.web.app/challenges/${challenge.$id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block transform hover:scale-105 transition-transform duration-200"
      >
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm overflow-hidden h-[440px] flex flex-col dark:border dark:border-dark-border transition-colors">
          <div className="relative">
            {/* show image for image challenges */}
          {!isVideoChallenge(challenge.type) && <img
              src={UrlHelper.getChallengeImageUrl(challenge.$id)}
              alt={challenge.title}
              className="w-full h-64 object-cover"
            />}
          
            {/* show video preview */}
          {isVideoChallenge(challenge.type) && (
            <video src={UrlHelper.getChallengeVideoUrl(challenge.$id)} className="w-full h-64 object-cover"></video>
          ) }
            
            {isVideoChallenge(challenge.type) && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
                <Video className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          
          <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{challenge.title}</h3>
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created on {new Date(challenge.$createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isActive ? 'Ends' : 'Ended'} {new Date(challenge.endDate).toLocaleDateString()} at {new Date(challenge.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[challenge.status]}`}>
                  {challenge.status}
                </span>
                {isActive && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4 flex-1">
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                {challenge.description || 'No description provided'}
              </p>
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>👥 {challenge.totalSubs || 0} subscribers</span>
                <span>📝 {challenge.totalPosts} posts</span>
                <span>⏰ {Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days left</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-auto">
              <div className="flex gap-2 items-center">
                {visibleTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-300 text-xs whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
                {remainingTags > 0 && (
                  <button
                    onClick={handleShowTags}
                    className="text-xs font-semibold text-[#FD989D] hover:text-[#fd989d]/80 transition-colors"
                  >
                    +{remainingTags} more
                  </button>
                )}
              </div>
              <div className="flex gap-2 ml-2 flex-shrink-0">
                {challenge.status === ContentStatus.Flagged ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowUnbanModal(true);
                    }}
                    className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                    title="Unban Challenge"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onBan(challenge);
                    }}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Ban Challenge"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleEditClick}
                  className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Edit Challenge"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Delete Challenge"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </a>
      {showUnbanModal && (
        <UnbanModal
          challenge={challenge}
          onClose={() => setShowUnbanModal(false)}
          onUnban={(challenge) => {
            onUnban(challenge);
            setShowUnbanModal(false);
          }}
        />
      )}
      {showTagsModal && (
        <TagsModal
          tags={challenge.tags}
          onClose={() => setShowTagsModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          challenge={challenge}
          onClose={() => setShowDeleteModal(false)}
          onDelete={(challenge) => {
            onDelete(challenge);
            setShowDeleteModal(false);
          }}
        />
      )}
    </>
  );
};

export default ChallengeCard;