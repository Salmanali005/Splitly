import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../Components/layout/MainLayout';
import { trips } from '../services/api';

const Members = () => {
  const [loading, setLoading] = useState(true);
  const [allMembers, setAllMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllMembers();
  }, []);

  const fetchAllMembers = async () => {
    try {
      setLoading(true);
      const response = await trips.getAll();
      const tripsList = response.data || [];
      
      const memberPromises = tripsList.map(trip => 
        trips.getMembers(trip.id).then(res => ({
          tripId: trip.id,
          tripName: trip.name,
          tripDestination: trip.destination,
          members: res.data || []
        }))
      );
      
      const results = await Promise.all(memberPromises);
      
      const memberMap = {};
      results.forEach(trip => {
        trip.members.forEach(member => {
          if (!memberMap[member.user_id]) {
            memberMap[member.user_id] = {
              ...member,
              trips: []
            };
          }
          memberMap[member.user_id].trips.push(trip.tripName);
        });
      });
      
      setAllMembers(Object.values(memberMap));
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBgColor = (name) => {
    const colors = [
      'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    ];
    if (!name) return colors[0];
    return colors[name.charCodeAt(0) % colors.length];
  };

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
        .fade-up-4 { animation-delay: 0.2s; }
        .member-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.05); }
        .member-card { transition: all 0.2s ease; }
      `}</style>

      <div className="fade-up fade-up-1 mb-6">
        <p className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-1">People</p>
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">Members</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{allMembers.length} people across your trips</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {allMembers.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-black dark:text-white mb-1">No members yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Create a trip and invite people</p>
          <Link to="/add-trip" className="inline-flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:opacity-80 transition-opacity">
            + Create Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allMembers.map((member, index) => (
            <div
              key={member.user_id}
              className={`member-card fade-up fade-up-${Math.min(index + 2, 4)} bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-5`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${getBgColor(member.name)}`}>
                  {getInitials(member.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black dark:text-white truncate">{member.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {member.trips.slice(0, 2).map((trip, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {trip}
                      </span>
                    ))}
                    {member.trips.length > 2 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        +{member.trips.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Members;