import React from 'react';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { LucideCrop as LucideProps } from 'lucide-react';
import { account } from '../appwrite';
import { OAuthProvider } from 'appwrite';

const GoogleIcon: React.FC<LucideProps> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const SignIn: React.FC = () => {
  const handleGoogleSignIn = () => {
    const baseUrl = window.location.origin;
    
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${baseUrl}/verification`,
      `${baseUrl}/sign-in`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-8 dark:border dark:border-dark-border">
        <div className="flex flex-col items-center text-center">
          <Logo size={100} className="mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Piccom Admin</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Sign in to access the admin dashboard</p>
          
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-border w-full">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This is a secure area. Only authorized administrators can access the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;