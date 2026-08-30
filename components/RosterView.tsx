"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Loader2 } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'ACTIVE':
      case 'OPEN':
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING_L1':
      case 'PENDING_L2':
      case 'PENDING_REVIEW': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CLOSING':
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyles()}`}>{status?.replace('_', ' ')}</span>;
};

export default function RosterView() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      if (data) {
        setProfiles(data);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm text-slate-500 font-medium">Loading live staff roster from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Staff Roster & Hierarchy</h2>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold border border-indigo-100">
          {profiles.length} Active Profiles
        </span>
      </div>
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-red-100">
          Database connection error: {error}.
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
            <tr>
              <th className="px-6 py-3">Staff Member</th>
              <th className="px-6 py-3">Designation</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Hub</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {profiles.map((staff) => (
              <tr key={staff.id || staff.email} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {staff.name} 
                  <span className="block text-xs font-normal text-slate-400">{staff.email}</span>
                </td>
                <td className="px-6 py-4">{staff.designation}</td>
                <td className="px-6 py-4">{staff.department}</td>
                <td className="px-6 py-4">{staff.hub || 'Karachi'}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-bold">{staff.role}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={staff.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
