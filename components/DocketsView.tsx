"use client";
import React from 'react';
import { Plus } from 'lucide-react';

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
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyles()}`}>{status.replace('_', ' ')}</span>;
};

export default function DocketsView({ dockets, setIsDocketModalOpen }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Legal Case Dockets</h2>
        <button onClick={() => setIsDocketModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> <span>New Case Docket</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dockets.map(d => (
          <div key={d.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border">{d.case_number}</span>
              <StatusBadge status={d.status} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-1">{d.title}</h3>
            <p className="text-sm text-slate-500 mb-4">Client: {d.client_name} | Court: {d.court_name}</p>
            <div className="text-xs text-slate-500 border-t pt-3 flex justify-between">
              <span>Next Hearing: {d.hearing_date}</span>
              <span className="font-semibold text-slate-700">Assigned: {d.assigned_email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
