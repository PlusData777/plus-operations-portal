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

  return (
    <div className="space-y-6">
      {/* WELCOME BANNER */}
      <div className="bg-gradient-to-r from-blue-600/80 via-blue-700/80 to-cyan-600/80 backdrop-blur-xl text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 relative overflow-hidden space-y-4">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/15 text-blue-100 border border-white/10 uppercase tracking-wider">Department • {currentUser.role}</span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-500/30 text-white border border-cyan-400/30 uppercase tracking-wider">Hub: {currentUser.posting || 'Karachi HQ'}</span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow">Welcome back, {currentUser.name}</h2>
            <p className="text-xs md:text-sm text-blue-100/90 mt-1">PLUS OPS Institutional Operations Portal is fully synchronized. Monitor core programmatic metrics, multi-tier approvals, and staff workflows below.</p>
          </div>
        </div>

        <div className="pt-3 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-blue-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" /> Click generate to fetch your daily AI operational briefing.
          </p>
          <button 
            onClick={generateAIBriefing}
            disabled={isGeneratingBriefing}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 text-xs font-bold rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50"
          >
            {isGeneratingBriefing ? 'Synthesizing...' : '✨ Generate AI Briefing'}
          </button>
        </div>

        {aiBriefing && (
          <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/15 text-xs text-blue-50 space-y-1 backdrop-blur-md">
            <p className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">Operational Intelligence Briefing</p>
            <p>{aiBriefing}</p>
          </div>
        )}
      </div>

      {/* QUICK METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => setActiveTab('programs')} className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl hover:border-cyan-400/50 hover:bg-white/10 transition cursor-pointer space-y-3 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400">Active Programs</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-bold"><Briefcase className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-bold text-white">{programs.length}</div>
          <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">View all grant programs &rarr;</span>
        </div>

        <div onClick={() => setActiveTab('dockets')} className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl hover:border-emerald-400/50 hover:bg-white/10 transition cursor-pointer space-y-3 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400">Case Dockets</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold"><Scale className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-bold text-white">{dockets.length}</div>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Review court jurisdictions &rarr;</span>
        </div>

        <div onClick={() => setActiveTab('pending_queue')} className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl hover:border-amber-400/50 hover:bg-white/10 transition cursor-pointer space-y-3 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400">Pending Approvals</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-bold text-white">{pendingCount}</div>
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Inspect approval queue &rarr;</span>
        </div>

        <div onClick={() => setActiveTab('staff_workspace')} className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl hover:border-purple-400/50 hover:bg-white/10 transition cursor-pointer space-y-3 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400">My Workspace</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center font-bold"><CheckSquare className="w-5 h-5" /></div>
          </div>
          <div className="text-base font-bold text-white">Tasks & Leaves</div>
          <span className="text-xs text-purple-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Open staff portal &rarr;</span>
        </div>
      </div>

      {/* LIVE STAFF PRESENCE & ATTENDANCE CARD */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Today's Institutional Presence & Leave Status</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">Live Synchronized</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-black/20 rounded-2xl border border-white/10 space-y-3 backdrop-blur-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" /> Active on Work Today
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">Available</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs">
                <div>
                  <p className="font-bold text-white">Altaf Khoso</p>
                  <p className="text-[10px] text-slate-400">CEO • Karachi HQ</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs">
                <div>
                  <p className="font-bold text-white">Atif Ali</p>
                  <p className="text-[10px] text-slate-400">Admin & IT Lead • Karachi HQ</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/20 rounded-2xl border border-white/10 space-y-3 backdrop-blur-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" /> On Leave Today
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">Away</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center text-xs text-slate-400 italic">
                No personnel currently recorded on leave for today. All core hubs operational.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
