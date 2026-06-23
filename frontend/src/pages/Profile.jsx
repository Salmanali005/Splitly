import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import Input from '../Components/common/Input';
import Button from '../Components/common/Button';
import { auth } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await auth.getMe();
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await auth.updateProfile({
        name: formData.name,
        phone: formData.phone,
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-black dark:text-white mb-4">Profile Information</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-black dark:bg-white flex items-center justify-center text-2xl font-medium text-white dark:text-black">
              {formData.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-medium text-black dark:text-white">{formData.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />
            <Button type="submit" variant="primary" size="sm" fullWidth loading={saving}>
              Save Changes
            </Button>
          </form>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-black dark:text-white mb-4">Account</h3>
          
          <div className="space-y-4">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <span className="font-medium">Logout</span>
              <p className="text-sm text-red-500 dark:text-red-400/70">Sign out of your account</p>
            </button>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
              <button className="w-full text-left px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                <span className="font-medium">Delete Account</span>
                <p className="text-sm text-red-500 dark:text-red-400/70">Permanently delete your account and all data</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;