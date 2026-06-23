import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import { trips, settlements as settlementsApi } from '../services/api';

const Settlements = () => {
  const [loading, setLoading] = useState(true);
  const [allSettlements, setAllSettlements] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllSettlements();
  }, []);

  const fetchAllSettlements = async () => {
    try {
      setLoading(true);
      const response = await trips.getAll();
      const tripsList = response.data || [];
      
      const settlementPromises = tripsList.map(trip => 
        settlementsApi.getAll(trip.id).then(res => ({
          tripId: trip.id,
          tripName: trip.name,
          settlements: res.data || []
        }))
      );
      
      const results = await Promise.all(settlementPromises);
      const all = results.flatMap(r => 
        r.settlements.map(s => ({ ...s, tripName: r.tripName, tripId: r.tripId }))
      );
      
      setAllSettlements(all);
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
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading settlements...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const pendingSettlements = allSettlements.filter(s => s.status !== 'paid');
  const completedSettlements = allSettlements.filter(s => s.status === 'paid');

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
        .settlement-item { transition: all 0.2s ease; }
        .settlement-item:hover { transform: translateX(4px); }
      `}</style>

      <div className="fade-up fade-up-1 mb-6">
        <p className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-1">History</p>
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">Settlements</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {pendingSettlements.length} pending · {completedSettlements.length} completed
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {pendingSettlements.length > 0 && (
        <div className="fade-up fade-up-2 mb-6">
          <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Pending Settlements
          </h3>
          <div className="space-y-2">
            {pendingSettlements.map((settlement) => (
              <div key={settlement.id} className="settlement-item bg-white dark:bg-[#1a1a1a] rounded-2xl border border-amber-200 dark:border-amber-900/30 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-black dark:text-white">
                    {settlement.from_name} → {settlement.to_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {settlement.tripName} • {new Date(settlement.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600 dark:text-amber-400">${parseFloat(settlement.amount).toFixed(2)}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedSettlements.length > 0 && (
        <div className="fade-up fade-up-3">
          <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Completed Settlements
          </h3>
          <div className="space-y-2">
            {completedSettlements.map((settlement) => (
              <div key={settlement.id} className="settlement-item bg-white dark:bg-[#1a1a1a] rounded-2xl border border-emerald-200 dark:border-emerald-900/30 p-4 flex items-center justify-between opacity-75">
                <div>
                  <p className="font-medium text-black dark:text-white">
                    {settlement.from_name} → {settlement.to_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {settlement.tripName} • {new Date(settlement.settled_at || settlement.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">${parseFloat(settlement.amount).toFixed(2)}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    ✓ Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allSettlements.length === 0 && (
        <div className="fade-up fade-up-2 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <p className="text-sm font-medium text-black dark:text-white mb-1">No settlements yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Settlements will appear here when someone pays</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Settlements;