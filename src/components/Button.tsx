import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const Button: React.FC<ButtonProps> = ({ text, className = '', ...props }) => {
  return (
    <button
      className={`bg-[#FD989D] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;