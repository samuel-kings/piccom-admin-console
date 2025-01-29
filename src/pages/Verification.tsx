import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite';

const Verification: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await account.get();

        // check if user is an admin
        if (user.labels.includes('admin')) {
          console.log('User is an admin');
          navigate('/home');
        } else {
          console.log('User is not an admin');
          navigate('/unauthorized');
        }
      } catch (error) {
        console.log(error);
        alert('An error occurred. Please try again.');
        navigate('/sign-in');
      }
    };

    getUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#FD989D] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Verifying your account...</p>
      </div>
    </div>
  );
};

export default Verification;