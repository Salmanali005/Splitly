import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import { trips } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalExpenses: 0,
    totalMembers: 0,
    pendingDebts: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await trips.getAll();
      const tripsList = response.data || [];
      setTripData(tripsList);

      let totalExpenses = 0;
      let totalMembers = 0;

      tripsList.forEach(trip => {
        totalExpenses += parseFloat(trip.total_expenses || 0);
        totalMembers += trip.member_count || 0;
      });

      setStats({
        totalTrips: tripsList.length,
        totalExpenses: totalExpenses.toFixed(2),
        totalMembers: totalMembers,
        pendingDebts: '0',
      });

    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    const num = parseFloat(val || 0);
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}k`;
    return `$${num.toFixed(2)}`;
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading your trips...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button onClick={fetchTrips} className="mt-3 text-sm text-black dark:text-white hover:underline">
            Try again
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.1s; }
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.2s; }
        .fade-up-5 { animation-delay: 0.25s; }
        .stat-card:hover .stat-icon { transform: scale(1.1); }
        .stat-icon { transition: transform 0.2s ease; }
        .trip-row:hover .trip-arrow { transform: translateX(3px); opacity: 1; }
        .trip-arrow { transition: transform 0.2s ease, opacity 0.2s ease; opacity: 0; }
      `}</style>

      {/* Header */}
      <div className="fade-up mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-1">Overview</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-black dark:text-white tracking-tight">Dashboard</h1>
        </div>
        <Link
          to="/add-trip"
          className="flex items-center gap-2 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:opacity-80 transition-opacity"
        >
          <span className="text-lg leading-none">+</span>
          New Trip
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          {
            label: 'Total Trips',
            value: stats.totalTrips,
            sub: 'all time',
            icon: (
              <svg className="stat-icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
              </svg>
            ),
            color: 'text-violet-500 dark:text-violet-400',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            delay: 'fade-up-1',
          },
          {
            label: 'Total Expenses',
            value: formatCurrency(stats.totalExpenses),
            sub: 'across all trips',
            icon: (
              <svg className="stat-icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            ),
            color: 'text-emerald-500 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            delay: 'fade-up-2',
          },
          {
            label: 'Active Members',
            value: stats.totalMembers,
            sub: 'total across trips',
            icon: (
              <svg className="stat-icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            ),
            color: 'text-blue-500 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            delay: 'fade-up-3',
          },
          {
            label: 'Pending Debts',
            value: `$${stats.pendingDebts}`,
            sub: 'to be settled',
            icon: (
              <svg className="stat-icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            ),
            color: 'text-amber-500 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            delay: 'fade-up-4',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`stat-card fade-up ${stat.delay} bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all`}
          >
            <div className={`inline-flex p-2 rounded-xl ${stat.bg} ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-black dark:text-white tracking-tight">{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-medium uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Trips list — takes 2 cols */}
        <div className="fade-up fade-up-4 lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-black dark:text-white">Your Trips</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tripData.length} trip{tripData.length !== 1 ? 's' : ''} total</p>
            </div>
            <Link to="/trips" className="text-xs font-medium text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              View all →
            </Link>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {tripData.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-black dark:text-white mb-1">No trips yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Create your first trip to start splitting expenses</p>
                <Link to="/add-trip" className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:opacity-80 transition-opacity">
                  + Create Trip
                </Link>
              </div>
            ) : (
              tripData.slice(0, 5).map((trip) => (
                <Link
                  key={trip.id}
                  to={`/trip/${trip.id}`}
                  className="trip-row px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${getBgColor(trip.name)}`}>
                      {getInitials(trip.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-black dark:text-white text-sm truncate">{trip.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {trip.destination || 'No destination'} · {trip.member_count || 0} member{trip.member_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-black dark:text-white">
                        ${parseFloat(trip.total_expenses || 0).toFixed(2)}
                      </p>
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${getStatusStyle(trip.status)}`}>
                        {trip.status || 'planning'}
                      </span>
                    </div>
                    <svg className="trip-arrow w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Quick actions */}
          <div className="fade-up fade-up-5 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-black dark:text-white text-sm">Quick Actions</h2>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {[
                {
                  to: '/add-trip',
                  label: 'Create new trip',
                  sub: 'Start splitting expenses',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  ),
                  color: 'bg-black dark:bg-white text-white dark:text-black',
                },
                {
                  to: '/members',
                  label: 'Invite members',
                  sub: 'Add people to your trips',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                    </svg>
                  ),
                  color: 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white',
                },
                {
                  to: '/settlements',
                  label: 'View settlements',
                  sub: 'Check who owes what',
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                  ),
                  color: 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white',
                },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:opacity-80 transition-opacity ${action.color}`}
                >
                  <div className="flex-shrink-0">{action.icon}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-none">{action.label}</p>
                    <p className="text-xs mt-1 opacity-60">{action.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent activity placeholder / summary */}
          <div className="fade-up fade-up-5 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="font-semibold text-black dark:text-white text-sm mb-4">Expense Breakdown</h2>
            {tripData.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">No data yet</p>
            ) : (
              <div className="space-y-3">
                {tripData.slice(0, 4).map((trip, i) => {
                  const maxExpense = Math.max(...tripData.map(t => parseFloat(t.total_expenses || 0)));
                  const pct = maxExpense > 0 ? (parseFloat(trip.total_expenses || 0) / maxExpense) * 100 : 0;
                  const barColors = [
                    'bg-violet-400 dark:bg-violet-500',
                    'bg-blue-400 dark:bg-blue-500',
                    'bg-emerald-400 dark:bg-emerald-500',
                    'bg-amber-400 dark:bg-amber-500',
                  ];
                  return (
                    <div key={trip.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate max-w-[120px]">{trip.name}</span>
                        <span className="text-xs font-semibold text-black dark:text-white ml-2">${parseFloat(trip.total_expenses || 0).toFixed(0)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColors[i % barColors.length]} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;