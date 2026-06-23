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

      // Calculate stats from real data
      let totalExpenses = 0;
      let totalMembers = 0;
      let pendingDebts = 0;

      tripsList.forEach(trip => {
        totalExpenses += parseFloat(trip.total_expenses || 0);
        totalMembers += trip.member_count || 0;
        // You can calculate pending debts if you have that data
      });

      setStats({
        totalTrips: tripsList.length,
        totalExpenses: totalExpenses.toFixed(2),
        totalMembers: totalMembers,
        pendingDebts: '$0', // Will be calculated from balances
      });

    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading your trips...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchTrips}
            className="mt-3 text-sm text-black dark:text-white hover:underline"
          >
            Try Again
          </button>
        </div>
      </MainLayout>
    );
  }

  const statCards = [
    { label: 'Total Trips', value: stats.totalTrips, icon: '▤' },
    { label: 'Total Expenses', value: `$${stats.totalExpenses}`, icon: '◈' },
    { label: 'Active Members', value: stats.totalMembers, icon: '◎' },
    { label: 'Pending Debts', value: stats.pendingDebts, icon: '◉' },
  ];

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-black dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Overview of your trips and expenses</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-black dark:text-white mt-1">{stat.value}</p>
              </div>
              <span className="text-2xl text-gray-400 dark:text-gray-600">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link to="/add-trip" className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all hover:-translate-y-0.5 group">
          <div className="flex items-center gap-4">
            <span className="text-3xl text-gray-400 group-hover:text-black dark:group-hover:text-white">+</span>
            <div>
              <h3 className="font-semibold text-lg text-black dark:text-white">Create New Trip</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Start splitting expenses with your group</p>
            </div>
          </div>
        </Link>
        <Link to="/members" className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all hover:-translate-y-0.5 group">
          <div className="flex items-center gap-4">
            <span className="text-3xl text-gray-400 group-hover:text-black dark:group-hover:text-white">◎</span>
            <div>
              <h3 className="font-semibold text-lg text-black dark:text-white">Invite Members</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add friends to your trips</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-semibold text-black dark:text-white">Your Trips</h3>
          <Link to="/trips" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">View all →</Link>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {tripData.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No trips yet. Create your first trip!</p>
              <Link to="/add-trip" className="mt-2 inline-block text-sm text-black dark:text-white hover:underline">
                Create Trip →
              </Link>
            </div>
          ) : (
            tripData.slice(0, 3).map((trip) => (
              <Link 
                key={trip.id} 
                to={`/trip/${trip.id}`}
                className="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-medium text-black dark:text-white">{trip.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {trip.destination || 'No destination'} • {trip.member_count || 0} members
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <p className="text-sm font-medium text-black dark:text-white">
                    ${parseFloat(trip.total_expenses || 0).toFixed(2)}
                  </p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    trip.status === 'active' ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white' :
                    trip.status === 'completed' ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {trip.status || 'Planning'}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;