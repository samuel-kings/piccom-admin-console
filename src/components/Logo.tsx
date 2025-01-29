import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <img
      src="/favicon.svg"
      alt="Piccom Logo"
      className={`w-${size} h-${size} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default Logo;