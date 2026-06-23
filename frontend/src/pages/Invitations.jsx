import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import Button from '../Components/common/Button';
import { invitations } from '../services/api';

const Invitations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await invitations.getMyInvitations();
      setInvites(response.data || []);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      setError('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (token, id) => {
    setProcessingId(id);
    setError('');
    setSuccess('');
    try {
      await invitations.accept(token);
      setSuccess('Invitation accepted! You are now a member of the trip.');
      await fetchInvitations();
      setTimeout(() => navigate('/trips'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to accept invitation');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (token, id) => {
    setProcessingId(id);
    setError('');
    setSuccess('');
    try {
      await invitations.decline(token);
      setSuccess('Invitation declined.');
      await fetchInvitations();
    } catch (err) {
      setError('Failed to decline invitation');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading invitations...</p>
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
        .invite-card { transition: all 0.2s ease; }
        .invite-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.05); }
        .status-pending { background: #fef3c7; color: #92400e; }
        .dark .status-pending { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
        .status-accepted { background: #d1fae5; color: #065f46; }
        .dark .status-accepted { background: rgba(52, 211, 153, 0.15); color: #34d399; }
        .status-expired { background: #fee2e2; color: #991b1b; }
        .dark .status-expired { background: rgba(239, 68, 68, 0.15); color: #f87171; }
      `}</style>

      <div className="fade-up fade-up-1 mb-6">
        <p className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-1">Inbox</p>
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">Invitations</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {invites.length} invitation{invites.length !== 1 ? 's' : ''} pending
        </p>
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

      {invites.length === 0 ? (
        <div className="fade-up fade-up-2 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <p className="text-sm font-medium text-black dark:text-white mb-1">No pending invitations</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">When someone invites you to a trip, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invites.map((invite, index) => (
            <div
              key={invite.id}
              className={`invite-card fade-up fade-up-${Math.min(index + 2, 3)} bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-5`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-lg">
                    ✉️
                  </div>
                  <div>
                    <p className="font-semibold text-black dark:text-white text-sm">
                      Join <span className="font-bold">{invite.trip_name}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      From: {invite.inviter_name}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  invite.status === 'pending' ? 'status-pending' :
                  invite.status === 'accepted' ? 'status-accepted' :
                  'status-expired'
                }`}>
                  {invite.status || 'pending'}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📍 {invite.destination || 'No destination'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Sent: {new Date(invite.created_at).toLocaleDateString()}
                </p>
                {invite.expires_at && (
                  <p className="text-xs text-amber-500 dark:text-amber-400">
                    ⏳ Expires: {new Date(invite.expires_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {invite.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAccept(invite.token, invite.id)}
                    loading={processingId === invite.id}
                    className="flex-1"
                  >
                    Accept
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDecline(invite.token, invite.id)}
                    loading={processingId === invite.id}
                    className="flex-1"
                  >
                    Decline
                  </Button>
                </div>
              )}

              {invite.status === 'accepted' && (
                <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ You have joined this trip
                </div>
              )}

              {invite.status === 'expired' && (
                <div className="text-sm text-red-500 dark:text-red-400 font-medium">
                  This invitation has expired
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Invitations;