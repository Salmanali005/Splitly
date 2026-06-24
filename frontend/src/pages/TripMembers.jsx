import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [invitations, setInvitations] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);

  useEffect(() => {
    if (tripId) {
      fetchData();
    }
  }, [tripId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripRes, membersRes, invitationsRes] = await Promise.all([
        trips.getOne(tripId),
        trips.getMembers(tripId),
        trips.getInvitations ? trips.getInvitations(tripId) : Promise.resolve({ data: [] })
      ]);
      
      setTrip(tripRes.data);
      setMembers(membersRes.data || []);
      
      // Filter out accepted/expired/cancelled invitations
      const pendingInvitations = (invitationsRes.data || []).filter(
        invite => invite.status === 'pending'
      );
      setInvitations(pendingInvitations);
      
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
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send invitation');
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    try {
      if (trips.cancelInvitation) {
        await trips.cancelInvitation(invitationId);
        fetchData();
      }
    } catch (err) {
      setError('Failed to cancel invitation');
    }
  };

  const handleDeleteMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this trip?`)) {
      return;
    }

    setDeletingId(memberId);
    setError('');
    setSuccess('');

    try {
      await trips.removeMember(tripId, memberId);
      setSuccess(`${memberName} has been removed from the trip.`);
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to remove member';
      setError(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const isAdmin = (member) => member?.role === 'admin';

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading members...</p>
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
        .member-item {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .member-item:hover {
          background-color: rgba(0,0,0,0.02);
        }
        .dark .member-item:hover {
          background-color: rgba(255,255,255,0.02);
        }
        .delete-btn {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .member-item:hover .delete-btn {
          opacity: 1;
          transform: scale(1);
        }
        .delete-btn:hover {
          transform: scale(1.15) !important;
          background-color: #fee2e2 !important;
        }
        .dark .delete-btn:hover {
          background-color: #7f1d1d !important;
        }
      `}</style>

      <button 
        onClick={() => navigate('/members')} 
        className="fade-up fade-up-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Members
      </button>

      <div className="fade-up fade-up-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
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
        <div className="fade-up fade-up-2 mb-4 p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="fade-up fade-up-2 mb-4 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10">
          <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-[fadeUp_0.3s_ease_both]">
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

      {/* Pending Invitations - Only show if there are pending ones */}
      {invitations.length > 0 && (
        <div className="fade-up fade-up-2 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 mb-4">
          <h3 className="font-semibold text-black dark:text-white mb-3">Pending Invitations</h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {invitations.map((invite) => (
              <div key={invite.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm text-black dark:text-white">{invite.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sent {new Date(invite.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    Pending
                  </span>
                  <button 
                    onClick={() => handleCancelInvitation(invite.id)}
                    className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="fade-up fade-up-3 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
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
            members.map((member) => {
              const isAdminUser = isAdmin(member);
              const currentUserId = parseInt(localStorage.getItem('user_id') || '0');
              const isCurrentUser = member.user_id === currentUserId;
              const canDelete = !isAdminUser && !isCurrentUser;

              return (
                <div 
                  key={member.id} 
                  className="member-item px-6 py-4 relative"
                  onMouseEnter={() => setHoveredMember(member.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div className="grid grid-cols-3 items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-black dark:text-white flex-shrink-0">
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
                    <div className="flex items-center justify-end gap-3">
                      <span className={`text-sm text-right font-medium ${
                        isAdminUser ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {isAdminUser ? 'Admin' : 'Member'}
                      </span>
                      
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          disabled={deletingId === member.id}
                          className={`delete-btn w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-red-200 dark:border-red-800/30 ${
                            deletingId === member.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Remove member from trip"
                        >
                          {deletingId === member.id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                      )}
                      
                      {(isAdminUser || isCurrentUser) && (
                        <span className="text-gray-300 dark:text-gray-600 text-sm" title={isAdminUser ? 'Admin cannot be removed' : 'You cannot remove yourself'}>
                          🔒
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TripMembers;