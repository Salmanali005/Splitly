import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import Button from '../Components/common/Button';
import { trips } from '../services/api';

const Trips = () => {
  const [loading, setLoading] = useState(true);
  const [tripsList, setTripsList] = useState([]);

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

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">Your Trips</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">All your trips in one place</p>
        </div>
        <Link to="/add-trip">
          <Button variant="primary" size="sm">+ New Trip</Button>
        </Link>
      </div>

      {tripsList.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No trips yet</p>
          <Link to="/add-trip" className="mt-3 inline-block text-sm text-black dark:text-white hover:underline">
            Create your first trip →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tripsList.map((trip) => (
            <Link 
              key={trip.id} 
              to={`/trip/${trip.id}`}
              className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-black dark:text-white text-lg">{trip.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{trip.destination || 'No destination'}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  trip.status === 'active' ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white' :
                  trip.status === 'completed' ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500' :
                  'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {trip.status || 'Planning'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 dark:text-gray-400">👥 {trip.member_count || 0}</span>
                  <span className="text-gray-500 dark:text-gray-400">💰 ${parseFloat(trip.total_expenses || 0).toFixed(2)}</span>
                </div>
                <span className={`font-medium ${
                  trip.user_balance > 0 ? 'text-green-600 dark:text-green-400' :
                  trip.user_balance < 0 ? 'text-red-600 dark:text-red-400' :
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  {trip.user_balance > 0 ? '+' : ''}{trip.user_balance.toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Trips;