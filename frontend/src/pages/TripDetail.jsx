import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import Button from '../Components/common/Button';
import { trips, expenses } from '../services/api';

const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [members, setMembers] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [balances, setBalances] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'members', label: 'Members' },
    { id: 'balances', label: 'Balances' },
  ];

  useEffect(() => {
    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      const [tripRes, membersRes, expensesRes, balancesRes] = await Promise.all([
        trips.getOne(tripId),
        trips.getMembers(tripId),
        expenses.getAll(tripId),
        trips.getBalances(tripId)
      ]);
      
      setTrip(tripRes.data);
      setMembers(membersRes.data || []);
      setExpensesList(expensesRes.data || []);
      
      // Ensure balances is an array
      const balancesData = balancesRes.data || [];
      setBalances(Array.isArray(balancesData) ? balancesData : []);
      
    } catch (err) {
      console.error('Error fetching trip:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading trip details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!trip) {
    return (
      <MainLayout>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">Trip not found</p>
          <button onClick={() => navigate('/trips')} className="mt-3 text-sm text-black dark:text-white hover:underline">
            Back to Trips
          </button>
        </div>
      </MainLayout>
    );
  }

  const totalExpenses = expensesList.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  
  // Safely find current user's balance - ensure balances is an array
  const balancesArray = Array.isArray(balances) ? balances : [];
  const currentUserBalance = balancesArray.find(b => b.user_id === parseInt(localStorage.getItem('user_id')))?.balance || 0;

  return (
    <MainLayout>
      <button onClick={() => navigate('/trips')} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4">
        ← Back to Trips
      </button>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">{trip.name}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <p className="text-sm text-gray-500 dark:text-gray-400">{trip.destination || 'No destination'}</p>
              {trip.start_date && (
                <>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(trip.start_date).toLocaleDateString()}
                    {trip.end_date && ` - ${new Date(trip.end_date).toLocaleDateString()}`}
                  </p>
                </>
              )}
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                trip.status === 'active' ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white' :
                trip.status === 'completed' ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500' :
                'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                {trip.status || 'Planning'}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to={`/trip/${tripId}/balances`}>
              <Button variant="secondary" size="sm">View Balances</Button>
            </Link>
            <Link to={`/trip/${tripId}/add-expense`}>
              <Button variant="primary" size="sm" >+ Add Expense</Button>
            </Link>
          </div>
        </div>

        <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex-wrap">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spent</p>
            <p className="text-lg font-semibold text-black dark:text-white">${totalExpenses.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Members</p>
            <p className="text-lg font-semibold text-black dark:text-white">{members.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your Balance</p>
            <p className={`text-lg font-semibold ${
              currentUserBalance > 0 ? 'text-green-600 dark:text-green-400' :
              currentUserBalance < 0 ? 'text-red-600 dark:text-red-400' :
              'text-gray-500 dark:text-gray-400'
            }`}>
              {currentUserBalance > 0 ? '+' : ''}{currentUserBalance.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Currency</p>
            <p className="text-lg font-semibold text-black dark:text-white">{trip.currency || 'USD'}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-black dark:text-white">Members ({members.length})</h3>
              <Link to={`/trip/${tripId}/members`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                Manage →
              </Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {members.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-black dark:text-white">
                    {member.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm text-black dark:text-white">{member.name}</span>
                </div>
              ))}
              {members.length > 5 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">+{members.length - 5} more</span>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-black dark:text-white">Recent Expenses</h3>
              <button onClick={() => setActiveTab('expenses')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                View all →
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {expensesList.length === 0 ? (
                <p className="py-4 text-sm text-gray-500 dark:text-gray-400 text-center">No expenses yet. Add your first expense!</p>
              ) : (
                expensesList.slice(0, 3).map((expense) => (
                  <div key={expense.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">{expense.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {expense.payer_name || 'Unknown'} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-black dark:text-white">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {expensesList.length === 0 ? (
              <p className="py-8 text-sm text-gray-500 dark:text-gray-400 text-center">No expenses yet</p>
            ) : (
              expensesList.map((expense) => (
                <div key={expense.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-black dark:text-white">{expense.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {expense.payer_name || 'Unknown'} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-black dark:text-white">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {members.length === 0 ? (
              <p className="py-8 text-sm text-gray-500 dark:text-gray-400 text-center">No members yet</p>
            ) : (
              members.map((member) => (
                <div key={member.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-black dark:text-white">
                      {member.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">{member.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{member.role || 'Member'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Link to={`/trip/${tripId}/members`} className="text-sm text-black dark:text-white hover:underline">
              Manage members →
            </Link>
          </div>
        </div>
      )}

      {/* Balances Tab */}
      {activeTab === 'balances' && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {balancesArray.length === 0 ? (
              <p className="py-8 text-sm text-gray-500 dark:text-gray-400 text-center">No balances yet</p>
            ) : (
              balancesArray.map((member) => (
                <div key={member.member_id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-black dark:text-white">
                      {member.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">{member.name}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    member.balance === 0 ? 'text-gray-400 dark:text-gray-500' :
                    member.balance > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {member.balance > 0 ? '+' : ''}{member.balance?.toFixed(2) || '0.00'}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Link to={`/trip/${tripId}/balances`} className="text-sm text-black dark:text-white hover:underline">
              View full balances →
            </Link>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default TripDetail;