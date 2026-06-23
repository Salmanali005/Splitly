import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import Input from '../Components/common/Input';
import Button from '../Components/common/Button';
import { trips } from '../services/api';

const AddTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    start_date: '',
    end_date: '',
    currency: 'USD',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await trips.create({
        name: formData.name,
        destination: formData.destination || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        currency: formData.currency,
        notes: formData.notes || null,
      });
      
      navigate(`/trip/${response.data.id}`);
    } catch (err) {
      console.error('Error creating trip:', err);
      setError(err.response?.data?.detail || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-black dark:text-white tracking-tight">Create New Trip</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Plan your next adventure</p>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 lg:p-8 max-w-xl mx-auto">
        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Trip Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Summer Vacation 2026"
            required
          />

          <Input
            label="Destination"
            type="text"
            name="destination"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="e.g., Bali, Indonesia"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="PKR">PKR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional details..."
              rows="3"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Create Trip
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              size="lg" 
              fullWidth
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddTrip;