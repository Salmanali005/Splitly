import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-500"
    >
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
      <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center text-sm bg-white shadow-md ${isDark ? 'translate-x-6' : 'translate-x-0'}`}>
        {isDark ? '🌙' : '☀️'}
      </div>
    </button>
  );
};

export default ThemeToggle;