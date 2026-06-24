import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import { trips, settlements } from '../services/api';
import { formatCurrency } from '../utils/currency';

const TripBalances = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [simplifiedDebts, setSimplifiedDebts] = useState([]);
  const [balances, setBalances] = useState([]);
  const [settling, setSettling] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (tripId) {
      fetchBalances();
    }
  }, [tripId]);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const [tripRes, debtsRes, balancesRes] = await Promise.all([
        trips.getOne(tripId),
        trips.getSimplifiedDebts(tripId),
        trips.getBalances(tripId)
      ]);
      
      setTrip(tripRes.data);
      setSimplifiedDebts(debtsRes.data || []);
      setBalances(balancesRes.data || []);
      
    } catch (err) {
      console.error('Error fetching balances:', err);
      setError('Failed to load balances');
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async (debt) => {
    if (!window.confirm(`Mark ${debt.from_name} → ${debt.to_name} (${formatCurrency(debt.amount, trip?.currency || 'USD')}) as settled?`)) {
      return;
    }

    setSettling(debt.from_member_id);
    setError('');
    setSuccess('');

    try {
      const settlementRes = await settlements.create(tripId, {
        from_member_id: debt.from_member_id,
        to_member_id: debt.to_member_id,
        amount: debt.amount,
        notes: 'Settled via debt simplification'
      });
      
      const settlementId = settlementRes.data.id;
      await settlements.markPaid(settlementId);
      
      setSuccess(`✅ ${debt.from_name} paid ${debt.to_name} ${formatCurrency(debt.amount, trip?.currency || 'USD')}`);
      
      // Refresh data
      await fetchBalances();
      
    } catch (err) {
      console.error('Error settling debt:', err);
      setError(err.response?.data?.detail || 'Failed to settle debt');
    } finally {
      setSettling(null);
    }
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

  const currency = trip?.currency || 'USD';
  const debtsArray = Array.isArray(simplifiedDebts) ? simplifiedDebts : [];
  const balancesArray = Array.isArray(balances) ? balances : [];
  
  // Calculate totals from simplified debts
  const totalOwed = debtsArray.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalOwes = 0; // You owe is calculated from balances

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
        .settle-btn:hover { transform: scale(1.05); }
        .settle-btn { transition: all 0.2s ease; }
      `}</style>

      <button 
        onClick={() => navigate('/balances')} 
        className="fade-up fade-up-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Balances
      </button>

      <div className="fade-up fade-up-1 mb-6">
        <p className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-1">Trip Balances</p>
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">{trip.name}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{trip.destination || 'No destination'} • Balance Details</p>
      </div>

      {error && (
        <div className="fade-up fade-up-2 mb-4 p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="fade-up fade-up-2 mb-4 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10">
          <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 fade-up fade-up-2">
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-5">
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Total Owed to You</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {debtsArray.length > 0 ? formatCurrency(totalOwed, currency) : formatCurrency(0, currency)}
          </p>
          <p className="text-xs text-emerald-500 dark:text-emerald-400/70 mt-1">From {debtsArray.length} member{debtsArray.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 rounded-2xl p-5">
          <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">You Owe</p>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">{formatCurrency(totalOwes, currency)}</p>
          <p className="text-xs text-rose-500 dark:text-rose-400/70 mt-1">To 0 members</p>
        </div>
      </div>

      <div className="fade-up fade-up-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <h3 className="font-semibold text-black dark:text-white mb-4">Who Owes Whom</h3>
        {debtsArray.length === 0 ? (
          <p className="py-4 text-sm text-gray-500 dark:text-gray-400 text-center">All settled! 🎉</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {debtsArray.map((debt, index) => (
              <div key={index} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="text-sm text-black dark:text-white">
                    <span className="font-semibold">{debt.from_name || 'Unknown'}</span> owes <span className="font-semibold">{debt.to_name || 'Unknown'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-sm font-bold text-black dark:text-white">
                    {formatCurrency(debt.amount, currency)}
                  </span>
                  <button
                    onClick={() => handleSettle(debt)}
                    disabled={settling === debt.from_member_id}
                    className="settle-btn px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {settling === debt.from_member_id ? (
                      <span className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                        Settling...
                      </span>
                    ) : (
                      '💰 Settle'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TripBalances;