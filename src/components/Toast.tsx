import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />
  };

  const backgrounds = {
    success: 'bg-green-500/95 dark:bg-green-600/95 border-green-600/20 dark:border-green-500/20',
    error: 'bg-red-500/95 dark:bg-red-600/95 border-red-600/20 dark:border-red-500/20',
    info: 'bg-blue-500/95 dark:bg-blue-600/95 border-blue-600/20 dark:border-blue-500/20'
  };

  const textColors = {
    success: 'text-white',
    error: 'text-white',
    info: 'text-white'
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${backgrounds[type]} shadow-lg max-w-md w-full animate-slide-in`}>
      {icons[type]}
      <p className={`flex-1 text-sm font-medium ${textColors[type]}`}>{message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <X className={`w-4 h-4 ${textColors[type]}`} />
      </button>
    </div>
  );
};

export default Toast;