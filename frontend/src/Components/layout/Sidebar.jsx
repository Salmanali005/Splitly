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
    { path: '/add-trip', icon: '+', label: 'Add Trip' },
    { path: '/members', icon: '◎', label: 'Members' },
    { path: '/balances', icon: '◉', label: 'Balances' },
    { path: '/settlements', icon: '◊', label: 'Settlements' },
    { path: '/profile', icon: '○', label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full 
        bg-white dark:bg-[#1a1a1a]
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'}
        overflow-hidden
        flex flex-col
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          {isOpen ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2">
                <span className="text-xl font-semibold tracking-tight text-black dark:text-white">HISAAB</span>
              </Link>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="flex items-center justify-center w-full">
                <span className="text-xl font-semibold text-black dark:text-white">H</span>
              </Link>
              <button 
                onClick={() => setIsOpen(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </>
          )}
        </div>

        <nav className="px-3 py-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive(item.path) 
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                  }
                  ${!isOpen && 'justify-center px-2'}
                `}
                title={!isOpen ? item.label : ''}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <span className={`${!isOpen && 'hidden'} whitespace-nowrap`}>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} px-2 py-2 rounded-xl bg-gray-50 dark:bg-gray-900`}>
            <div className={`flex items-center gap-3 ${!isOpen && 'hidden'}`}>
              <div className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center text-xs font-medium text-white dark:text-black flex-shrink-0">
                JD
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">john@example.com</p>
              </div>
            </div>
            <div className={!isOpen ? 'block' : ''}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;