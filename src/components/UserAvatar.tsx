import React, { useState } from 'react';
import UrlHelper from '../url_helper';
import ImagePreview from './ImagePreview';

interface UserAvatarProps {
  userId: string;
  name: string;
  pfpId?: string;
  size?: number;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userId, name, pfpId, size = 40, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!pfpId || imageError) {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    const colorIndex = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const bgColor = colors[colorIndex];

    return (
      <div
        className={`flex items-center justify-center rounded-full text-white font-medium cursor-default ${bgColor} ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {getInitials(name)}
      </div>
    );
  }

  const imageUrl = UrlHelper.getProfileImageURL(pfpId);
  return (
    <>
      <img
        src={imageUrl}
        alt={name}
        className={`rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${className}`}
        style={{ width: size, height: size }}
        onError={() => setImageError(true)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowPreview(true);
        }}
      />
      {showPreview && (
        <ImagePreview
          src={imageUrl}
          alt={name}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

export default UserAvatar;