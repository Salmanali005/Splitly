import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { isDark } = useTheme();

  const menuItems = [
  { path: '/dashboard', icon: '▤', label: 'Dashboard' },
  { path: '/trips', icon: '◈', label: 'Trips' },
  { path: '/expenses', icon: '💰', label: 'Expenses' },
  { path: '/members', icon: '◎', label: 'Members' },
  { path: '/balances', icon: '◉', label: 'Balances' },
  { path: '/settlements', icon: '◊', label: 'Settlements' },
  { path: '/invitations', icon: '✉️', label: 'Invitations' },
  { path: '/profile', icon: '○', label: 'Profile' },
];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - slides completely off screen when closed */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full 
        bg-white dark:bg-[#1a1a1a]
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:-translate-x-full'}
        overflow-hidden
        flex flex-col
      `}>
        {/* Header with toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-black dark:text-white">HISAAB</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation - no scrollbar */}
<nav className="px-3 py-4 flex-1 overflow-y-auto scrollbar-hide">
  <div className="space-y-1">
    {menuItems.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
          ${isActive(item.path) 
            ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
          }
        `}
      >
        <span className="text-base flex-shrink-0">{item.icon}</span>
        <span className="whitespace-nowrap">{item.label}</span>
      </Link>
    ))}
  </div>
</nav>

        {/* Bottom section with user and theme toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between px-2 py-2 rounded-xl bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center text-xs font-medium text-white dark:text-black flex-shrink-0">
                JD
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">john@example.com</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Floating toggle button - always visible when sidebar is closed */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </>
  );
};

export default Sidebar;