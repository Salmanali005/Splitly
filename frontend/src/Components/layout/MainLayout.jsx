import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';
import ThemeToggle from '../common/ThemeToggle';

const MainLayout = ({ children }) => {
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-[#0d0d0d] ${isDark ? 'dark' : ''}`}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Mobile header - only shows on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold tracking-tight text-black dark:text-white">HISAAB</h1>
        <ThemeToggle />
      </div>

      {/* Main content - adjusts based on sidebar state */}
      <main className={`
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
        p-4 lg:p-8 pt-16 lg:pt-8
        min-h-screen
      `}>
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;