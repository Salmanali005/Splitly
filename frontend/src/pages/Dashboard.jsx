import React from 'react';
import { useTheme } from '../Components/contexts/ThemeContext';
import ThemeToggle from '../Components/common/ThemeToggle';

const Dashboard = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDark ? 'dark' : ''}`}>
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Hisaab</h1>
            <span className="text-xs text-gray-400 dark:text-gray-500">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back! 👋</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your trips.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Trips</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">$2,450</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Members</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">8</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending Debts</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">$350</p>
          </div>
        </div>

        {/* Recent Trips */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Trips</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <div className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Summer Vacation 2026</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bali, Indonesia • 4 members</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">$1,200</p>
                <p className="text-xs text-green-600 dark:text-green-400">Active</p>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Ski Trip</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Swiss Alps • 6 members</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">$850</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">Planning</p>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Road Trip</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Route 66 • 3 members</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">$420</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;