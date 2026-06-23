import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import { trips } from '../services/api';

const TripBalances = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [balances, setBalances] = useState([]);
  const [simplifiedDebts, setSimplifiedDebts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tripId) {
      fetchBalances();
    }
  }, [tripId]);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const [tripRes, balancesRes, debtsRes] = await Promise.all([
        trips.getOne(tripId),
        trips.getBalances(tripId),
        trips.getSimplifiedDebts(tripId)
      ]);
      
      setTrip(tripRes.data);
      
      // Ensure balances is always an array
      const balancesData = balancesRes.data || [];
      setBalances(Array.isArray(balancesData) ? balancesData : []);
      
      const debtsData = debtsRes.data || [];
      setSimplifiedDebts(Array.isArray(debtsData) ? debtsData : []);
      
    } catch (err) {
      console.error('Error fetching balances:', err);
      setError('Failed to load balances');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading balances...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !trip) {
    return (
      <MainLayout>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error || 'Trip not found'}</p>
          <button onClick={() => navigate('/balances')} className="mt-3 text-sm text-black dark:text-white hover:underline">
            Back to Balances
          </button>
        </div>
      </MainLayout>
    );
  }

  // Safe calculations - ensure balances is an array
  const balancesArray = Array.isArray(balances) ? balances : [];
  const totalOwed = balancesArray.filter(b => b.balance > 0).reduce((sum, b) => sum + b.balance, 0);
  const totalOwes = balancesArray.filter(b => b.balance < 0).reduce((sum, b) => sum + Math.abs(b.balance), 0);

  return (
    <MainLayout>
      <button onClick={() => navigate('/balances')} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4">
        ← Back to Balances
      </button>

      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">{trip.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">{trip.destination || 'No destination'} • Balance Details</p>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Owed to You</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalOwed.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">You Owe</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">${totalOwes.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 mb-4">
        <h3 className="font-semibold text-black dark:text-white mb-3">Member Balances</h3>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {balancesArray.length === 0 ? (
            <p className="py-4 text-sm text-gray-500 dark:text-gray-400 text-center">No balances yet</p>
          ) : (
            balancesArray.map((member) => (
              <div key={member.member_id || member.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium ${
                    member.balance === 0 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      : member.balance > 0 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {member.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-black dark:text-white">{member.name || 'Unknown'}</span>
                </div>
                <span className={`text-sm font-medium ${
                  member.balance === 0 
                    ? 'text-gray-400 dark:text-gray-500'
                    : member.balance > 0 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                }`}>
                  {member.balance > 0 ? '+' : ''}{member.balance?.toFixed(2) || '0.00'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="font-semibold text-black dark:text-white mb-3">Simplified Debts</h3>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {simplifiedDebts.length === 0 ? (
            <p className="py-4 text-sm text-gray-500 dark:text-gray-400 text-center">All settled! 🎉</p>
          ) : (
            simplifiedDebts.map((debt, index) => (
              <div key={index} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="text-sm text-black dark:text-white">
                    <span className="font-medium">{debt.from_name || 'Unknown'}</span> owes <span className="font-medium">{debt.to_name || 'Unknown'}</span>
                  </p>
                </div>
                <span className="text-sm font-medium text-black dark:text-white">${debt.amount?.toFixed(2) || '0.00'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TripBalances;