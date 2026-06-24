import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import { trips } from '../services/api';
import { formatCurrency } from '../utils/currency';

const Balances = () => {
  const [loading, setLoading] = useState(true);
  const [tripsList, setTripsList] = useState([]);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ owedTo: 0, youOwe: 0, settled: 0 });

  useEffect(() => {
    fetchAllTrips();
  }, []);

  const fetchAllTrips = async () => {
    try {
      setLoading(true);
      const response = await trips.getAll();
      const tripsData = response.data || [];
      setTripsList(tripsData);
      
      let owedTo = 0, youOwe = 0, settled = 0;
      tripsData.forEach(trip => {
        if (trip.user_balance > 0) owedTo += trip.user_balance;
        else if (trip.user_balance < 0) youOwe += Math.abs(trip.user_balance);
        else settled++;
      });
      
      setSummary({ owedTo, youOwe, settled });
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load balances');
    } finally {
      setLoading(false);
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading balances...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const defaultCurrency = tripsList[0]?.currency || 'USD';

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
        .balance-row:hover .balance-arrow { transform: translateX(3px); opacity: 1; }
        .balance-arrow { transition: transform 0.2s ease, opacity 0.2s ease; opacity: 0; }
        .balance-row { transition: all 0.2s ease; }
        .balance-row:hover { background-color: rgba(0,0,0,0.02); }
        .dark .balance-row:hover { background-color: rgba(255,255,255,0.03); }
      `}</style>

      <div className="fade-up fade-up-1 mb-6">
        <p className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-1">Financial Overview</p>
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">Balances</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your financial summary across all trips</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="fade-up fade-up-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-5">
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">You're Owed</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(summary.owedTo, defaultCurrency)}</p>
          <p className="text-xs text-emerald-500 dark:text-emerald-400/70 mt-1">From {tripsList.filter(t => t.user_balance > 0).length} trips</p>
        </div>
        <div className="fade-up fade-up-3 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 rounded-2xl p-5">
          <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">You Owe</p>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">{formatCurrency(summary.youOwe, defaultCurrency)}</p>
          <p className="text-xs text-rose-500 dark:text-rose-400/70 mt-1">From {tripsList.filter(t => t.user_balance < 0).length} trips</p>
        </div>
        <div className="fade-up fade-up-4 bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/30 rounded-2xl p-5">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Settled</p>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{summary.settled}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400/70 mt-1">Trips fully settled</p>
        </div>
      </div>

      <div className="fade-up fade-up-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-black dark:text-white">Trip Balances</h2>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
          {tripsList.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-400 dark:text-gray-500">No trips yet</p>
            </div>
          ) : (
            tripsList.map((trip) => (
              <Link
                key={trip.id}
                to={`/trip/${trip.id}/balances`}
                className="balance-row px-6 py-4 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${getBgColor(trip.name)}`}>
                    {getInitials(trip.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-black dark:text-white text-sm truncate">{trip.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{trip.destination || 'No destination'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      trip.user_balance > 0 ? 'text-emerald-600 dark:text-emerald-400' :
                      trip.user_balance < 0 ? 'text-rose-600 dark:text-rose-400' :
                      'text-gray-400 dark:text-gray-500'
                    }`}>
                      {trip.user_balance > 0 ? '+' : ''}{formatCurrency(trip.user_balance, trip.currency || 'USD')}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {trip.member_count || 0} members · {trip.expense_count || 0} expenses
                    </p>
                  </div>
                  <svg className="balance-arrow w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Balances;