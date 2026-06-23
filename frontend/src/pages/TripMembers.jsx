import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import Button from '../Components/common/Button';
import Input from '../Components/common/Input';
import { trips } from '../services/api';

const TripMembers = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [members, setMembers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (tripId) {
      fetchData();
    }
  }, [tripId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripRes, membersRes] = await Promise.all([
        trips.getOne(tripId),
        trips.getMembers(tripId)
      ]);
      
      setTrip(tripRes.data);
      setMembers(membersRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await trips.invite(tripId, inviteEmail);
      setSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInvite(false);
      fetchData(); // Refresh member list
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send invitation');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading members...</p>
        </div>
      </MainLayout>
    );
  }

  if (error && !trip) {
    return (
      <MainLayout>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button onClick={() => navigate('/members')} className="mt-3 text-sm text-black dark:text-white hover:underline">
            Back to Members
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <button onClick={() => navigate('/members')} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4">
        ← Back to Members
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">{trip?.name || 'Trip Members'}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
            {trip?.destination || 'No destination'} • {members.length} members
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowInvite(true)}>
          + Invite Member
        </Button>
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

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 max-w-md w-full">
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

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <span>Member</span>
            <span>Email</span>
            <span className="text-right">Role</span>
          </div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {members.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No members yet. Invite someone!</p>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="grid grid-cols-3 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-black dark:text-white">
                      {member.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <span className="font-medium text-black dark:text-white">{member.name || 'Unknown'}</span>
                      {member.nickname && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">"{member.nickname}"</p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{member.email}</span>
                  <span className={`text-sm text-right font-medium ${
                    member.role === 'admin' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {member.role || 'Member'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TripMembers;