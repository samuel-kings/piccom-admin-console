import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import { account } from '../appwrite';
import { useTheme } from '../contexts/ThemeContext';

interface NavItem {
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/home', label: 'Dashboard' },
  { path: '/users', label: 'Users' },
  { path: '/posts', label: 'Posts' },
  { path: '/challenges', label: 'Challenges' },
  { path: '/feedback', label: 'Feedback' },
  { path: '/reports', label: 'Reports' },
  { path: '/support', label: 'Support' },
  { path: '/blogs', label: 'Blogs' },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUserName(user.name);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
      {/* Top Bar */}
      <header className="bg-white dark:bg-dark-surface dark:border-b dark:border-dark-border shadow-sm fixed w-full z-10 transition-colors">
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Logo size={80} />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Piccom Admin</h1>
          </div>
          <div className="flex items-center gap-6">
            {userName && (
              <span className="text-gray-600 dark:text-gray-300">
                Hi 👋 <span className="font-medium">{userName}</span>
              </span>
            )}
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full transition-colors"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full transition-colors">
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar and Content */}
      <div className="flex pt-[98px]">
        {/* Sidebar Navigation */}
        <nav className="w-64 min-h-[calc(100vh-98px)] bg-white dark:bg-dark-surface dark:border-r dark:border-dark-border shadow-sm fixed transition-colors">
          <ul className="py-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-6 py-3 flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors ${
                    location.pathname === item.path ? 'bg-gray-50 dark:bg-dark-border border-r-4 border-[#FD989D]' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;