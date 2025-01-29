import React, { useState } from 'react';
import { Video, Ban, Flag, Edit, Trash2 } from 'lucide-react';
import { Post, PostType } from '../../models/post';
import { ContentStatus } from '../../models/challenge';
import UrlHelper from '../../url_helper';
import TagsModal from '../challenges/TagsModal';
import UnbanModal from './UnbanModal';
import DeleteModal from './DeleteModal';
import UserAvatar from '../UserAvatar';
import { getProfile } from '../../services/profile';

interface PostCardProps {
  post: Post;
  onBan: (post: Post) => void;
  onEdit: (post: Post) => void;
  onUnban: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onBan,
  onEdit,
  onUnban,
  onDelete,
}) => {
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [posterName, setPosterName] = useState('');
  const [posterPfp, setPosterPfp] = useState<string | undefined>();

  const statusColors = {
    [ContentStatus.Published]: 'bg-blue-100 text-blue-800',
    [ContentStatus.Draft]: 'bg-gray-100 text-gray-800',
    [ContentStatus.Flagged]: 'bg-red-100 text-red-800',
    [ContentStatus.Trash]: 'bg-gray-100 text-gray-800',
  };

  const MAX_VISIBLE_TAGS = 3;
  const visibleTags = post.tags.slice(0, MAX_VISIBLE_TAGS);
  const remainingTags = post.tags.length - MAX_VISIBLE_TAGS;

  React.useEffect(() => {
    const loadPosterDetails = async () => {
      try {
        const profile = await getProfile(post.userId);
        setPosterName(profile.name);
        setPosterPfp(profile.pfpId);
      } catch (error) {
        console.error('Error loading poster details:', error);
      }
    };
    loadPosterDetails();
  }, [post.userId]);

  const handleShowTags = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTagsModal(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(post);
  };

  return (
    <>
      <a
        href={`https://piccom.web.app/posts/${post.$id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block transform hover:scale-105 transition-transform duration-200"
      >
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm overflow-hidden h-[440px] flex flex-col dark:border dark:border-dark-border transition-colors">
          <div className="relative">
            {post.type === PostType.Image && (
              <img
                src={UrlHelper.getPostImageUrl(post.$id)}
                alt={post.caption || 'Post image'}
                className="w-full h-64 object-cover"
              />
            )}

            {post.type === PostType.Video && (
              <>
                <video
                  src={UrlHelper.getPostVideoUrl(post.$id)}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
                  <Video className="w-5 h-5 text-white" />
                </div>
              </>
            )}
          </div>

          <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <UserAvatar
                  userId={post.userId}
                  name={posterName}
                  pfpId={posterPfp}
                  size={40}
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {posterName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Posted on {new Date(post.$createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusColors[post.status]
                }`}
              >
                {post.status}
              </span>
            </div>

            <div className="space-y-2 mb-4 flex-1">
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                {post.caption || 'No caption provided'}
              </p>
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>❤️ {post.likes.length} likes</span>
                <span>💬 {post.comments} comments</span>
                <span>👁️ {post.views} views</span>
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
                {post.status === ContentStatus.Flagged ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowUnbanModal(true);
                    }}
                    className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                    title="Unflag Post"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onBan(post);
                    }}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Flag Post"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleEditClick}
                  className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Edit Post"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Delete Post"
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
          post={post}
          onClose={() => setShowUnbanModal(false)}
          onUnban={(post) => {
            onUnban(post);
            setShowUnbanModal(false);
          }}
        />
      )}
      {showTagsModal && (
        <TagsModal
          tags={post.tags}
          onClose={() => setShowTagsModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          post={post}
          onClose={() => setShowDeleteModal(false)}
          onDelete={(post) => {
            onDelete(post);
            setShowDeleteModal(false);
          }}
        />
      )}
    </>
  );
};

export default PostCard;