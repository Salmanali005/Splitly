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
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
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
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.2s; }
        .profile-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .profile-card:hover {
          transform: translateY(-2px);
        }
        .avatar-ring {
          transition: all 0.3s ease;
        }
        .avatar-ring:hover {
          transform: scale(1.05);
        }
      `}</style>

      <div className="fade-up fade-up-1 mb-6">
        <p className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-1">Account</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-black dark:text-white tracking-tight">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card - 2 columns */}
        <div className="fade-up fade-up-2 lg:col-span-2 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 profile-card">
          <div className="flex items-center gap-5 mb-6">
            <div className="avatar-ring relative">
              <div className="w-20 h-20 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-3xl font-medium text-white dark:text-black">
                {formData.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1a1a1a] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-xl font-semibold text-black dark:text-white">{formData.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
              <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                {user?.role || 'User'}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="cursor-not-allowed rounded-lg"
              />
            </div>

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" size="md" loading={saving}>
                Save Changes
              </Button>
              <Button type="button" variant="secondary" size="md" onClick={() => {
                setFormData({
                  name: user?.name || '',
                  phone: user?.phone || '',
                  email: user?.email || '',
                });
              }}>
                Reset
              </Button>
            </div>
          </form>
        </div>

        {/* Side Actions - 1 column */}
        <div className="fade-up fade-up-3 space-y-4">
          {/* Account Actions */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 profile-card">
            <h3 className="font-semibold text-black dark:text-white mb-4 text-sm">Account</h3>
            
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-xl border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <div>
                  <p className="font-medium">Logout</p>
                  <p className="text-sm text-rose-500 dark:text-rose-400/70">Sign out of your account</p>
                </div>
              </div>
            </button>

            <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4">
              <button className="w-full text-left px-4 py-3 rounded-xl border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-rose-500 dark:text-rose-400/70">Permanently delete your account</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 profile-card">
            <h3 className="font-semibold text-black dark:text-white mb-3 text-sm">Account Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Member since</span>
                <span className="text-black dark:text-white font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Active
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500 dark:text-gray-400">Account ID</span>
                <span className="text-black dark:text-white font-mono text-xs">#{user?.id || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;