"use client";
import React from 'react';
import { Briefcase, Scale, Clock, CheckSquare, Calendar, UserCheck, Users, Sparkles } from 'lucide-react';

export default function DashboardView({ 
  visibleRequests = [], 
  programs = [], 
  dockets = [], 
  currentUser, 
  aiBriefing = "",
  isGeneratingBriefing = false,
  generateAIBriefing = () => {},
  setActiveTab 
}) {
  const pendingCount = visibleRequests.filter(r => r.status?.includes('PENDING')).length;
  const isExecOrAdmin = currentUser.role === 'EXECUTIVE' || currentUser.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* WELCOME BANNER */}
      <div className="bg-[#0052CC] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden space-y-4">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-700 text-blue-100 uppercase tracking-wider">Department • {currentUser.role}</span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/50 text-white uppercase tracking-wider">Hub: {currentUser.posting || 'Karachi HQ'}</span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Welcome back, {currentUser.name}</h2>
            <p className="text-xs md:text-sm text-blue-100 mt-1">PLUS OPS Institutional Operations Portal is fully synchronized. Monitor core programmatic metrics, multi-tier approvals, and staff workflows below.</p>
          </div>
        </div>

        <div className="pt-2 border-t border-blue-600/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-blue-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" /> Click generate to fetch your daily AI operational briefing.
          </p>
          <button 
            onClick={generateAIBriefing}
            disabled={isGeneratingBriefing}
            className="px-4 py-2 bg-white text-[#0052CC] hover:bg-blue-50 text-xs font-bold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {isGeneratingBriefing ? 'Synthesizing...' : '✨ Generate AI Briefing'}
          </button>
        </div>

        {aiBriefing && (
          <div className="p-4 bg-blue-900/50 rounded-2xl border border-blue-400/30 text-xs text-blue-50 space-y-1">
            <p className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">Operational Intelligence Briefing</p>
            <p>{aiBriefing}</p>
          </div>
        )}
      </div>

      {/* QUICK METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => setActiveTab('programs')} className="bg-white p-5 rounded-2xl border shadow-sm hover:border-[#0052CC] transition cursor-pointer space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400">Active Programs</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold"><Briefcase className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{programs.length}</div>
          <span className="text-xs text-[#0052CC] font-semibold flex items-center gap-1">View all grant programs &rarr;</span>
        </div>

        <div onClick={() => setActiveTab('dockets')} className="bg-white p-5 rounded-2xl border shadow-sm hover:border-emerald-600 transition cursor-pointer space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400">Case Dockets</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold"><Scale className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{dockets.length}</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">Review court jurisdictions &rarr;</span>
        </div>

        <div onClick={() => setActiveTab('pending_queue')} className="bg-white p-5 rounded-2xl border shadow-sm hover:border-amber-600 transition cursor-pointer space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400">Pending Approvals</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingCount}</div>
          <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">Inspect approval queue &rarr;</span>
        </div>

        <div onClick={() => setActiveTab('staff_workspace')} className="bg-white p-5 rounded-2xl border shadow-sm hover:border-purple-600 transition cursor-pointer space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400">My Workspace</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold"><CheckSquare className="w-5 h-5" /></div>
          </div>
          <div className="text-base font-bold text-slate-900">Tasks & Leaves</div>
          <span className="text-xs text-purple-600 font-semibold flex items-center gap-1">Open staff portal &rarr;</span>
        </div>
      </div>

      {/* LIVE STAFF PRESENCE & ATTENDANCE CARD */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#0052CC]" />
            <h3 className="font-bold text-sm text-slate-900">Today's Institutional Presence & Leave Status</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Live Synchronized</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" /> Active on Work Today
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Available</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border text-xs">
                <div>
                  <p className="font-bold text-slate-800">Altaf Khoso</p>
                  <p className="text-[10px] text-slate-500">CEO • Karachi HQ</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border text-xs">
                <div>
                  <p className="font-bold text-slate-800">Atif Ali</p>
                  <p className="text-[10px] text-slate-500">Admin & IT Lead • Karachi HQ</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600" /> On Leave Today
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Away</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-xl border text-center text-xs text-slate-400 italic">
                No personnel currently recorded on leave for today. All core hubs operational.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
