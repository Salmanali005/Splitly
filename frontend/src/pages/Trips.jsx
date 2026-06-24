import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import Button from '../Components/common/Button';
import { trips } from '../services/api';
import { formatCurrency } from '../utils/currency';

const Trips = () => {
  const [loading, setLoading] = useState(true);
  const [tripsList, setTripsList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
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
        .trip-card:hover .trip-arrow { transform: translateX(3px); opacity: 1; }
        .trip-arrow { transition: transform 0.2s ease, opacity 0.2s ease; opacity: 0; }
        .trip-card { transition: all 0.2s ease; }
        .trip-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.05); }
      `}</style>

      <div className="fade-up fade-up-1 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-1">All Trips</p>
          <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">Your Trips</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{tripsList.length} trip{tripsList.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link to="/add-trip">
          <Button variant="primary" size="sm" className="flex items-center gap-2">
            <span className="text-lg leading-none">+</span>
            New Trip
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {tripsList.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tripsList.map((trip, index) => (
            <Link
              key={trip.id}
              to={`/trip/${trip.id}`}
              className={`trip-card fade-up fade-up-${Math.min(index + 2, 4)} bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${getBgColor(trip.name)}`}>
                    {getInitials(trip.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-black dark:text-white text-base truncate">{trip.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{trip.destination || 'No destination'}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${getStatusStyle(trip.status)}`}>
                  {trip.status || 'planning'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-50 dark:border-gray-800">
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
                    {formatCurrency(trip.total_expenses, trip.currency || 'USD')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {trip.expense_count || 0} expenses
                  </span>
                  <svg className="trip-arrow w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Trips;