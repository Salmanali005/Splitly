import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';

const AuthLayout = ({ children, title, subtitle, footerText, footerLink, footerLinkText }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 ${isDark ? 'dark' : ''}`}>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hisaab</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Split expenses, simplify life</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
          {title && <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{title}</h2>}
          {subtitle && <p className="text-gray-500 dark:text-gray-400 text-center mt-1 text-sm">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footerText && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              {footerText}{' '}
              <Link to={footerLink} className="font-medium text-gray-900 dark:text-white hover:underline">
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;