import React, { useState } from 'react';
import MainLayout from '../Components/layout/MainLayout';
import Button from '../Components/common/Button';
import Input from '../Components/common/Input';

const Members = () => {
  const [members] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', initials: 'JD' },
    { id: 2, name: 'Alice Smith', email: 'alice@example.com', role: 'Member', initials: 'AS' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Member', initials: 'BJ' },
  ]);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = (e) => {
    e.preventDefault();
    setShowInvite(false);
    setInviteEmail('');
  };

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-black dark:text-white tracking-tight">Members</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage trip members</p>
        </div>
        <Button variant="primary" onClick={() => setShowInvite(true)}>
          Invite Member
        </Button>
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-black dark:text-white tracking-tight mb-4">Invite Member</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@example.com"
                required
              />
              <div className="flex gap-3">
                <Button type="submit" variant="primary" fullWidth>Send Invite</Button>
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowInvite(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <span>Member</span>
            <span>Email</span>
            <span className="text-right">Role</span>
          </div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {members.map((member) => (
            <div key={member.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <div className="grid grid-cols-3 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-black dark:text-white">
                    {member.initials}
                  </div>
                  <span className="font-medium text-black dark:text-white">{member.name}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{member.email}</span>
                <span className={`text-sm text-right font-medium ${member.role === 'Admin' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Members;