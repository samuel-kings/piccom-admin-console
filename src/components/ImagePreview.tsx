import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="relative max-w-3xl w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default ImagePreview;