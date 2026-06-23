import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import { trips } from '../services/api';

const TripSettlements = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tripId) {
      fetchSettlements();
    }
  }, [tripId]);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const [tripRes, settlementsRes] = await Promise.all([
        trips.getOne(tripId),
        trips.getSettlements(tripId)
      ]);
      
      setTrip(tripRes.data);
      
      const settlementsData = settlementsRes.data || [];
      setSettlements(Array.isArray(settlementsData) ? settlementsData : []);
      
    } catch (err) {
      console.error('Error fetching settlements:', err);
      setError('Failed to load settlements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading settlements...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !trip) {
    return (
      <MainLayout>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error || 'Trip not found'}</p>
          <button onClick={() => navigate('/settlements')} className="mt-3 text-sm text-black dark:text-white hover:underline">
            Back to Settlements
          </button>
        </div>
      </MainLayout>
    );
  }

  const settlementsArray = Array.isArray(settlements) ? settlements : [];

  return (
    <MainLayout>
      <button onClick={() => navigate('/settlements')} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4">
        ← Back to Settlements
      </button>

      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">{trip.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">{trip.destination || 'No destination'} • Settlement History</p>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {settlementsArray.length === 0 ? (
            <p className="py-8 text-sm text-gray-500 dark:text-gray-400 text-center">No settlements yet</p>
          ) : (
            settlementsArray.map((settlement) => (
              <div key={settlement.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="text-sm text-black dark:text-white">
                    <span className="font-medium">{settlement.from_name || 'Unknown'}</span> paid <span className="font-medium">{settlement.to_name || 'Unknown'}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {settlement.created_at ? new Date(settlement.created_at).toLocaleDateString() : 'Unknown date'}
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-sm font-medium text-black dark:text-white">${parseFloat(settlement.amount || 0).toFixed(2)}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    settlement.status === 'paid' 
                      ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {settlement.status || 'pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TripSettlements;