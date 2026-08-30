"use client";
import React from 'react';
import { Heart, FileText, ArrowLeft, Download, Plus, ArrowRight, Building } from 'lucide-react';

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

export default function ProgramsView({ 
  programs, 
  selectedProgramId, 
  setSelectedProgramId, 
  setIsActivityModalOpen, 
  setIsProgramModalOpen, 
  isGlobalAdmin 
}) {
  const calculateDurationProgress = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    if (today < startDate) return 0;
    if (today > endDate) return 100;
    return Math.min(100, Math.max(0, ((today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100));
  };

  if (selectedProgramId) {
    const p = programs.find(prog => prog.id === selectedProgramId);
    if (!p) return null;
    const male = p.activities?.reduce((sum, a) => sum + a.male, 0) || 0;
    const female = p.activities?.reduce((sum, a) => sum + a.female, 0) || 0;
    const trans = p.activities?.reduce((sum, a) => sum + a.transgender, 0) || 0;
    const pwds = p.activities?.reduce((sum, a) => sum + a.pwds, 0) || 0;
    const minorities = p.activities?.reduce((sum, a) => sum + a.minorities, 0) || 0;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => setSelectedProgramId(null)} className="flex items-center text-slate-500 hover:text-indigo-600 font-semibold text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programs
          </button>
          <button onClick={() => window.print()} className="flex items-center space-x-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
            <Download className="w-4 h-4" /> <span>Export PDF</span>
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{p.name} ({p.donor_name})</h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Reached</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{male + female + trans}</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-600 uppercase">Women</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{female}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-600 uppercase">Transgender</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">{trans}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <span className="text-xs font-bold text-blue-700 uppercase">Minorities</span>
              <div className="text-2xl font-bold text-blue-700 mt-1">{minorities}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <span className="text-xs font-bold text-orange-700 uppercase">PWDs</span>
              <div className="text-2xl font-bold text-orange-700 mt-1">{pwds}</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Logged Activities</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-3">Date & Venue</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {p.activities?.map(a => (
                  <tr key={a.id}>
                    <td className="px-4 py-3 font-semibold">{a.date} <span className="block text-xs font-normal text-slate-400">{a.venue}</span></td>
                    <td className="px-4 py-3">{a.title}</td>
                    <td className="px-4 py-3 text-center font-bold text-indigo-600">{a.male + a.female + a.transgender}</td>
                    <td className="px-4 py-3 text-xs">{a.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Programs & Grants Overview</h1>
        <div className="flex space-x-3">
          <button onClick={() => setIsActivityModalOpen(true)} className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> <span>Log Activity</span>
          </button>
          {isGlobalAdmin && (
            <button onClick={() => setIsProgramModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Plus className="w-4 h-4" /> <span>New Program</span>
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map(p => {
          const durationPct = calculateDurationProgress(p.start_date, p.end_date);
          return (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{p.name}</h3>
                    <p className="text-sm text-slate-500"><Building className="w-3.5 h-3.5 inline mr-1" /> {p.donor_name}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${durationPct}%` }}></div>
                </div>
                <span className="text-xs text-slate-400">Time Elapsed: {durationPct.toFixed(0)}%</span>
              </div>
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">PKR {(p.grant_budget / 1000000).toFixed(1)}M</span>
                <button onClick={() => setSelectedProgramId(p.id)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  Open Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
