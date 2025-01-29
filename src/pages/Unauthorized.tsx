import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-dark-surface rounded-lg shadow-lg p-8 text-center dark:border dark:border-dark-border">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Unauthorized Access
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You don't have permission to access this page.
        </p>
        <Button
          text="Sign In"
          onClick={() => navigate('/sign-in')}
        />
      </div>
    </div>
  );
};

export default Unauthorized;