import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import { trips } from '../services/api';
import { formatCurrency } from '../utils/currency';

const Expenses = () => {
  const [loading, setLoading] = useState(true);
  const [tripsList, setTripsList] = useState([]);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    fetchAllTrips();
  }, []);

  const fetchAllTrips = async () => {
    try {
      setLoading(true);
      const response = await trips.getAll();
      setTripsList(response.data || []);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBgColor = (name) => {
    const colors = [
      'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    ];
    if (!name) return colors[0];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const totalExpenses = tripsList.reduce((sum, trip) => sum + parseFloat(trip.total_expenses || 0), 0);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading expenses...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.05); }
          50% { box-shadow: 0 8px 40px rgba(0,0,0,0.08); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.19s; }
        .fade-up-4 { animation-delay: 0.26s; }
        .fade-up-5 { animation-delay: 0.33s; }
        .fade-up-6 { animation-delay: 0.40s; }
        .fade-up-7 { animation-delay: 0.47s; }
        .slide-left { animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .expense-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .expense-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
        }
        .expense-card:hover .card-shine {
          opacity: 1;
        }
        .card-shine {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .dark .card-shine {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent);
          background-size: 200% 100%;
        }
        .stat-number {
          animation: countUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.2s;
        }
        .status-badge {
          transition: all 0.3s ease;
        }
        .status-badge:hover {
          transform: scale(1.05);
        }
        .trip-icon {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .expense-card:hover .trip-icon {
          transform: rotate(-8deg) scale(1.1);
        }
        .arrow-icon {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .expense-card:hover .arrow-icon {
          transform: translateX(6px);
          opacity: 1;
        }
        .expense-card .arrow-icon {
          opacity: 0.4;
        }
        .bar-fill {
          transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* Header */}
      <div className="fade-up fade-up-1 mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-1">Tracking</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-black dark:text-white tracking-tight">Expenses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tripsList.length} trips • {totalExpenses.toFixed(0)} total spent</p>
        </div>
        <Link
          to="/add-trip"
          className="group flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:opacity-80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-lg leading-none group-hover:rotate-90 transition-transform duration-300">+</span>
          New Trip
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 animate-[fadeUp_0.4s_ease_both]">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Stats Row */}
      {tripsList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 slide-left">
          {[
            { label: 'Total Trips', value: tripsList.length, icon: '📊', color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' },
            { label: 'Total Expenses', value: `$${totalExpenses.toFixed(0)}`, icon: '💰', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
            { label: 'Avg per Trip', value: `$${(totalExpenses / (tripsList.length || 1)).toFixed(0)}`, icon: '📈', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
            { label: 'Active Trips', value: tripsList.filter(t => t.status === 'active').length, icon: '🔥', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className={`fade-up fade-up-${i + 2} bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-sm`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                  <p className="text-xl font-bold text-black dark:text-white stat-number">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trip Cards */}
      {tripsList.length === 0 ? (
        <div className="fade-up fade-up-3 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-16 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-[float_3s_ease-in-out_infinite]">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-black dark:text-white mb-1">No expenses yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Create a trip to start tracking expenses</p>
          <Link to="/add-trip" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:opacity-80 transition-opacity">
            + Create Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tripsList.map((trip, index) => {
            const maxExpense = Math.max(...tripsList.map(t => parseFloat(t.total_expenses || 0)));
            const pct = maxExpense > 0 ? (parseFloat(trip.total_expenses || 0) / maxExpense) * 100 : 0;
            const barColors = [
              'bg-violet-400 dark:bg-violet-500',
              'bg-blue-400 dark:bg-blue-500',
              'bg-emerald-400 dark:bg-emerald-500',
              'bg-amber-400 dark:bg-amber-500',
              'bg-rose-400 dark:bg-rose-500',
            ];

            return (
              <Link
                key={trip.id}
                to={`/trip/${trip.id}`}
                className={`expense-card fade-up fade-up-${Math.min(index + 3, 7)} bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 relative overflow-hidden cursor-pointer`}
                onMouseEnter={() => setHoveredCard(trip.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-shine" />
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`trip-icon w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${getBgColor(trip.name)}`}>
                      {getInitials(trip.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-black dark:text-white text-base truncate">{trip.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{trip.destination || 'No destination'}</p>
                    </div>
                  </div>
                  <span className={`status-badge text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${getStatusStyle(trip.status)}`}>
                    {trip.status || 'planning'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 dark:text-gray-500">Spent</span>
                    <span className="font-medium text-black dark:text-white">{formatCurrency(trip.total_expenses, trip.currency || 'USD')}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`bar-fill h-full rounded-full ${barColors[index % barColors.length]}`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm pt-1">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                      </svg>
                      {trip.member_count || 0}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {trip.expense_count || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {trip.expense_count || 0} expenses
                    </span>
                    <svg className="arrow-icon w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
};

export default Expenses;