import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white border border-gray-300 dark:border-gray-700 overflow-hidden flex-shrink-0"
      aria-label="Toggle theme"
    >
      <div className={`absolute inset-0 transition-all duration-300 ${isDark ? 'bg-black' : 'bg-white'}`} />
      <div className={`absolute top-1 left-1 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center text-[10px] border border-gray-300 dark:border-gray-700 ${isDark ? 'translate-x-5 bg-white text-black' : 'translate-x-0 bg-black text-white'}`}>
        {isDark ? '🌙' : '☀️'}
      </div>
    </button>
  );
};

export default ThemeToggle;