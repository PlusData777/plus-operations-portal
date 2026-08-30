"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Scale, Loader2 } from 'lucide-react';

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

export default function DocketsView({ setIsDocketModalOpen }) {
  const [dockets, setDockets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDockets();
  }, []);

  const fetchDockets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dockets')
        .select('*')
        .order('hearing_date', { ascending: true });

      if (error) throw error;
      if (data) {
        setDockets(data);
      }
    } catch (err) {
      console.error('Error fetching dockets:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm text-slate-500 font-medium">Loading live case dockets from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Scale className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Legal Case Dockets</h2>
        </div>
        <button onClick={() => setIsDocketModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> <span>New Case Docket</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm border border-red-100 rounded-lg">
          Database error: {error}.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dockets.map(d => (
          <div key={d.id || d.case_number} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100">{d.case_number}</span>
              <StatusBadge status={d.status} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-1">{d.title}</h3>
            <p className="text-sm text-slate-500 mb-4">Client: {d.client_name} | Court: {d.court_name}</p>
            <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex justify-between items-center">
              <span>Next Hearing: <strong className="text-slate-700">{d.hearing_date}</strong></span>
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{d.assigned_email || 'Assigned Counsel'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
