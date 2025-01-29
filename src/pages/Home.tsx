import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../appwrite';
import { AppwriteException } from 'appwrite';
import { Users, Flag, Sparkles, FileText } from 'lucide-react';
import { fetchDashboardStats, type DashboardStats } from '../services/home';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    newUsers: 0,
    totalChallenges: 0,
    newChallenges: 0,
    activeChallenges: 0,
    totalPosts: 0,
    newPosts: 0,
    newReports: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
        const stats = await fetchDashboardStats();
        setStats(stats);
      } catch (error) {
        if (error instanceof AppwriteException) {
          if (error.code === 401) {
            console.log("User is not logged in");
            navigate("/sign-in");
            return;
          } else {
            console.log(error);
            navigate("/sign-in");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-98px)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FD989D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, subValue, icon: Icon }: { title: string; value: number; subValue?: string; icon: React.ElementType }) => (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm dark:border dark:border-dark-border transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-3xl font-bold text-[#FD989D]">{value.toLocaleString()}</p>
          {subValue && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subValue}</p>}
        </div>
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <button 
          onClick={async () => {
            try {
              const newStats = await fetchDashboardStats();
              setStats(newStats);
            } catch (error) {
              console.error('Error refreshing stats:', error);
            }
          }}
          className="text-sm text-[#FD989D] hover:text-[#fd989d]/80"
        >
          Refresh Stats
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subValue={`+${stats.newUsers} in last 7 days`}
          icon={Users}
        />
        <StatCard
          title="Active Challenges"
          value={stats.activeChallenges}
          subValue={`+${stats.newChallenges} today`}
          icon={Sparkles}
        />
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          subValue={`+${stats.newPosts} today`}
          icon={FileText}
        />
        <StatCard
          title="New Reports"
          value={stats.newReports}
          subValue="Today"
          icon={Flag}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm dark:border dark:border-dark-border transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Challenge Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Challenges</span>
              <span className="font-semibold dark:text-white">{stats.totalChallenges}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Challenges</span>
              <span className="font-semibold dark:text-white">{stats.activeChallenges}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">New Today</span>
              <span className="font-semibold dark:text-white">{stats.newChallenges}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm dark:border dark:border-dark-border transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Growth</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Users</span>
              <span className="font-semibold dark:text-white">{stats.totalUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">New Users (7 days)</span>
              <span className="font-semibold dark:text-white">{stats.newUsers}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm dark:border dark:border-dark-border transition-colors">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Posts</span>
              <span className="font-semibold dark:text-white">{stats.totalPosts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">New Posts Today</span>
              <span className="font-semibold dark:text-white">{stats.newPosts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">New Reports Today</span>
              <span className="font-semibold dark:text-white">{stats.newReports}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;