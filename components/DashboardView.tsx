"use client";
import React from 'react';
import { Zap, Loader2 } from 'lucide-react';

export default function DashboardView({ visibleRequests, programs, dockets, currentUser, aiBriefing, isGeneratingBriefing, generateAIBriefing }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Active Programs</span>
          <div className="text-3xl font-bold text-indigo-600 mt-2">{programs.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Active Dockets</span>
          <div className="text-3xl font-bold text-slate-900 mt-2">{dockets.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Pending Approvals</span>
          <div className="text-3xl font-bold text-amber-600 mt-2">{visibleRequests.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Active User Role</span>
          <div className="text-lg font-bold text-slate-800 mt-2">{currentUser.role}</div>
        </div>
      </div>

      <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center"><Zap className="w-5 h-5 mr-2 text-yellow-400" /> AI Executive Briefing</h3>
          <button onClick={generateAIBriefing} disabled={isGeneratingBriefing} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
            {isGeneratingBriefing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Briefing'}
          </button>
        </div>
        <p className="text-indigo-200 text-sm">{aiBriefing || "Click generate to inspect real-time organizational telemetry."}</p>
      </div>
    </div>
  );
}
