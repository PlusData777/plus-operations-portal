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
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyles()}`}>{status?.replace('_', ' ')}</span>;
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
    const male = p.activities?.reduce((sum, a) => sum + (a.male || 0), 0) || 0;
    const female = p.activities?.reduce((sum, a) => sum + (a.female || 0), 0) || 0;
    const trans = p.activities?.reduce((sum, a) => sum + (a.transgender || 0), 0) || 0;
    const pwds = p.activities?.reduce((sum, a) => sum + (a.pwds || 0), 0) || 0;
    const minorities = p.activities?.reduce((sum, a) => sum + (a.minorities || 0), 0) || 0;
    const totalReached = male + female + trans;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => setSelectedProgramId(null)} className="flex items-center text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programs
          </button>
          <button onClick={() => window.print()} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> <span>Export PDF</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">{p.donor_name} Grant</span>
              <h1 className="text-2xl font-bold text-slate-900 mt-2 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-indigo-600" /> {p.name}
              </h1>
            </div>
            <button onClick={() => setIsActivityModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> <span>Log Activity</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Reached</span>
              <span className="text-3xl font-bold text-slate-900 mt-2">{totalReached}</span>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-emerald-600 uppercase">Women</span>
              <span className="text-3xl font-bold text-emerald-600 mt-2">{female}</span>
            </div>
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-amber-600 uppercase">Transgender</span>
              <span className="text-3xl font-bold text-amber-600 mt-2">{trans}</span>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-blue-700 uppercase">Minorities</span>
              <span className="text-3xl font-bold text-blue-700 mt-2">{minorities}</span>
            </div>
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-orange-700 uppercase">PWDs</span>
              <span className="text-3xl font-bold text-orange-700 mt-2">{pwds}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Logged Field Activities & Outreach
          </h3>
          {p.activities && p.activities.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Date & Venue</th>
                    <th className="px-4 py-3">Activity Title</th>
                    <th className="px-4 py-3 text-center">Total Reached</th>
                    <th className="px-4 py-3 text-center">PWD / Minorities</th>
                    <th className="px-4 py-3">Outcome Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {p.activities.map(act => (
                    <tr key={act.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">
                        {act.date} 
                        <span className="block text-xs font-normal text-slate-400">{act.venue}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{act.title}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                          {(act.male || 0) + (act.female || 0) + (act.transgender || 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-slate-600 font-medium">{act.pwds || 0} / {act.minorities || 0}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{act.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-500 font-medium">No activities logged yet for this program.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Programs & Grants Overview</h1>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button onClick={() => setIsActivityModalOpen(true)} className="flex justify-center items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> <span>Log Activity</span>
          </button>
          {isGlobalAdmin && (
            <button onClick={() => setIsProgramModalOpen(true)} className="flex justify-center items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> <span>New Program</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map(p => {
          const durationPct = calculateDurationProgress(p.start_date, p.end_date);
          return (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{p.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center">
                      <Building className="w-3.5 h-3.5 mr-1 text-slate-400" /> {p.donor_name}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="space-y-4 mb-2">
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Time Elapsed</span>
                      <span>{durationPct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${durationPct}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                <div className="text-sm">
                  <span className="block text-slate-400 text-[10px] uppercase font-bold">Grant Budget</span>
                  <span className="font-bold text-slate-800">PKR {(Number(p.grant_budget || 0) / 1000000).toFixed(1)}M</span>
                </div>
                <button onClick={() => setSelectedProgramId(p.id)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
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
