import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import Input from '../Components/common/Input';
import Button from '../Components/common/Button';
import { trips, expenses } from '../services/api';

const EditExpense = () => {
  const { tripId, expenseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [trip, setTrip] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paid_by: '',
    category: 'other',
    date: '',
    notes: '',
  });

  useEffect(() => {
    if (tripId && expenseId) {
      fetchData();
    }
  }, [tripId, expenseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripRes, membersRes, expenseRes] = await Promise.all([
        trips.getOne(tripId),
        trips.getMembers(tripId),
        expenses.getOne(expenseId)
      ]);
      
      setTrip(tripRes.data);
      setMembers(membersRes.data || []);
      
      const expense = expenseRes.data;
      setFormData({
        description: expense.description || '',
        amount: expense.amount || '',
        paid_by: expense.paid_by || '',
        category: expense.category || 'other',
        date: expense.date ? expense.date.split('T')[0] : '',
        notes: expense.notes || '',
      });
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load expense data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const amount = parseFloat(formData.amount);
      if (!amount || amount <= 0) {
        setError('Please enter a valid amount');
        setSubmitting(false);
        return;
      }

      await expenses.update(expenseId, {
        description: formData.description,
        amount: amount,
        paid_by: parseInt(formData.paid_by),
        category: formData.category,
        date: formData.date || new Date().toISOString(),
        notes: formData.notes,
      });
      
      navigate(`/trip/${tripId}`);
      
    } catch (err) {
      console.error('Error updating expense:', err);
      setError(err.response?.data?.detail || 'Failed to update expense');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
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
      `}</style>

      <button
        onClick={() => navigate(`/trip/${tripId}`)}
        className="fade-up fade-up-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Trip
      </button>

      <div className="fade-up fade-up-1 mb-6 text-center">
        <p className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-1">Edit Expense</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-black dark:text-white tracking-tight">Edit Expense</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{trip?.name} • Update expense details</p>
      </div>

      <div className="fade-up fade-up-2 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 lg:p-8 max-w-xl mx-auto">
        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Description"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., Dinner at Restaurant"
            required
          />

          <Input
            label={`Amount (${trip?.currency || 'USD'})`}
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Paid By
            </label>
            <select
              value={formData.paid_by}
              onChange={(e) => setFormData({ ...formData, paid_by: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              required
            >
              <option value="">Select who paid</option>
              {members.map((member) => (
                <option key={member.id} value={member.user_id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            >
              <option value="food">🍽️ Food</option>
              <option value="transport">🚗 Transport</option>
              <option value="accommodation">🏨 Accommodation</option>
              <option value="activities">🎯 Activities</option>
              <option value="shopping">🛍️ Shopping</option>
              <option value="other">📌 Other</option>
            </select>
          </div>

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <Input
            label="Notes (Optional)"
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any additional details..."
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" size="md" fullWidth loading={submitting}>
              Update Expense
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => navigate(`/trip/${tripId}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditExpense;