import React, { useState } from 'react';
import MainLayout from '../Components/layout/MainLayout';
import Input from '../Components/common/Input';
import Button from '../Components/common/Button';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Profile Information */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-black dark:text-white mb-4">Profile Information</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-black dark:bg-white flex items-center justify-center text-2xl font-medium text-white dark:text-black">
              JD
            </div>
            <div>
              <p className="font-medium text-black dark:text-white">{formData.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
              <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Change photo</button>
            </div>
          </div>

          <div className="space-y-3.5">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Button variant="primary" size="sm" fullWidth>Save Changes</Button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="font-semibold text-black dark:text-white mb-4">Change Password</h3>
          <div className="space-y-3.5">
            <Input
              label="Current Password"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="••••••••"
            />
            <Input
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              placeholder="••••••••"
              helper="Must be at least 8 characters"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
            />
            <Button variant="primary" size="sm" fullWidth>Update Password</Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-red-200 dark:border-red-900/30 p-5">
        <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">Danger Zone</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Permanently delete your account and all data</p>
        <Button variant="secondary" size="sm" className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
          Delete Account
        </Button>
      </div>
    </MainLayout>
  );
};

export default Profile;