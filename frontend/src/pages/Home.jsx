import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../Components/contexts/ThemeContext';
import ThemeToggle from '../Components/common/ThemeToggle';
import Button from '../Components/common/Button';
import FeatureCard from '../Components/common/FeatureCard';

const Home = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Hisaab</h1>
            <span className="ml-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">Beta</span>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="secondary" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6">
                🚀 Launching Soon
              </div>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                Split Expenses with{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ease</span>
              </h2>
              <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Track shared expenses, split bills, and settle debts with friends and family. 
                No more spreadsheets, no more arguments.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button variant="primary" size="lg" fullWidth={false}>
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" fullWidth={false}>
                    Sign In
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">
                ✨ No credit card required • Free for up to 10 members
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Everything you need to manage group expenses
            </h3>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Simple, powerful, and designed for groups of all sizes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="✈️"
              title="Trip Management"
              description="Create trips, add members, and track all expenses in one place. Perfect for vacations, road trips, and group events."
              iconBg="bg-blue-50 dark:bg-blue-900/30"
            />
            <FeatureCard 
              icon="💰"
              title="Smart Splitting"
              description="Split expenses equally, by shares, percentages, or custom amounts. Supports multiple currencies and payment methods."
              iconBg="bg-green-50 dark:bg-green-900/30"
            />
            <FeatureCard 
              icon="📊"
              title="Debt Settlement"
              description="See who owes who with simplified debts. Settle up with a single tap and keep track of all payments."
              iconBg="bg-purple-50 dark:bg-purple-900/30"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Trips Created</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">$5M+</div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Expenses Tracked</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">50K+</div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Happy Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">99.9%</div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Settlement Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl px-8 py-16 text-center">
            <h3 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to split expenses?
            </h3>
            <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
              Join thousands of users who already use Hisaab to manage their group expenses.
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button variant="secondary" size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 dark:border-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                © 2026 Hisaab. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <Link to="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Privacy</Link>
                <Link to="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Terms</Link>
                <Link to="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;