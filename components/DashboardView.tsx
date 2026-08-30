"use client";
import React from 'react';
import { Briefcase, Scale, Receipt, Calendar, ArrowUpRight, Sparkles, Clock, CheckCircle, Users, Activity, Layers, CheckSquare } from 'lucide-react';

export default function DashboardView({ 
  visibleRequests, 
  programs, 
  dockets, 
  currentUser, 
  aiBriefing, 
  isGeneratingBriefing, 
  generateAIBriefing,
  setActiveTab 
}) {
  const activeProgramsCount = programs.filter(p => p.status === 'ACTIVE').length;
  const openDocketsCount = dockets.filter(d => d.status === 'OPEN').length;
  const pendingApprovalsCount = visibleRequests.filter(r => r.status.includes('PENDING')).length;

  const totalBudget = programs.reduce((acc, p) => acc + (p.grant_budget || 0), 0);
  const totalSpent = programs.reduce((acc, p) => acc + (p.spent || 0), 0);

  const isExecutiveOrAdmin = currentUser.role === 'EXECUTIVE' || currentUser.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* WELCOME BANNER & AI BRIEFING */}
      <div className="bg-gradient-to-r from-[#0052CC] to-[#003d99] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-wider bg-blue-500/40 px-3 py-1 rounded-full border border-blue-400/30">
              {currentUser.department} Department • {currentUser.role}
            </span>
            <span className="text-xs uppercase font-bold tracking-wider bg-emerald-500/30 px-3 py-1 rounded-full border border-emerald-400/30">
              Hub: Karachi HQ
            </span>
          </div>
          <h2 className="text-2xl font-black mt-2">Welcome back, {currentUser.name}</h2>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl leading-relaxed">
            PLUS OPS Institutional Operations Portal is fully synchronized. Monitor core programmatic metrics, multi-tier approvals, and staff workflows below.
          </p>

          <div className="mt-5 pt-4 border-t border-blue-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-blue-200">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{aiBriefing || "Click generate to fetch your daily AI operational briefing."}</span>
            </div>
            <button 
              onClick={generateAIBriefing}
              disabled={isGeneratingBriefing}
              className="bg-white text-[#0052CC] hover:bg-blue-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md shrink-0 flex items-center space-x-1.5"
            >
              {isGeneratingBriefing ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isGeneratingBriefing ? 'Synthesizing...' : 'Generate AI Briefing'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('programs')} 
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500">Active Programs</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{activeProgramsCount}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-[#0052CC] rounded-lg flex items-center justify-center group-hover:bg-[#0052CC] group-hover:text-white transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-3 font-semibold flex items-center">
            <span>View all grant programs</span> <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('dockets')} 
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500">Case Dockets</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{openDocketsCount}</h3>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-3 font-semibold flex items-center">
            <span>Review court jurisdictions</span> <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('pending_queue')} 
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500">Pending Approvals</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{pendingApprovalsCount}</h3>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-amber-600 mt-3 font-semibold flex items-center">
            <span>Inspect approval queue</span> <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('staff_workspace')} 
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500">My Workspace</p>
              <h3 className="text-lg font-black text-slate-900 mt-1">Tasks & Leaves</h3>
            </div>
            <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-lg flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-3 font-semibold flex items-center">
            <span>Open staff portal</span> <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </p>
        </div>
      </div>

      {/* EXECUTIVE & ADMIN TELEMETRY STATUS BAR */}
      {isExecutiveOrAdmin && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center">
              <Activity className="w-5 h-5 text-[#0052CC] mr-2" />
              <span>Executive Telemetry & Program Status Bar</span>
            </h3>
            <span className="text-xs bg-blue-50 text-[#0052CC] px-3 py-1 rounded-full font-bold border border-blue-100">Live Sync</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Staff Attendance Widget */}
            <div onClick={() => setActiveTab('roster')} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-slate-500 flex items-center"><Users className="w-4 h-4 mr-1 text-blue-600" /> Staff Attendance</span>
                <span className="text-xs font-semibold text-blue-600">View Roster</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="text-center px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100 flex-1 mr-2">
                  <span className="text-xs text-emerald-600 block font-semibold">On Work</span>
                  <span className="text-lg font-black text-emerald-800">5 Active</span>
                </div>
                <div className="text-center px-4 py-2 bg-amber-50 rounded-lg border border-amber-100 flex-1">
                  <span className="text-xs text-amber-600 block font-semibold">On Leave</span>
                  <span className="text-lg font-black text-amber-800">1 Away</span>
                </div>
              </div>
            </div>

            {/* Current Program KPIs Widget */}
            <div onClick={() => setActiveTab('programs')} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-slate-500 flex items-center"><Layers className="w-4 h-4 mr-1 text-purple-600" /> Program KPIs</span>
                <span className="text-xs font-semibold text-purple-600">{programs.length} Grants</span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Grant Budget Utilization</span>
                  <span>{Math.round((totalSpent / (totalBudget || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#0052CC] h-full rounded-full" style={{ width: `${Math.min(100, (totalSpent / (totalBudget || 1)) * 100)}%` }}></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">PKR {totalSpent.toLocaleString()} disbursed of PKR {totalBudget.toLocaleString()}</p>
              </div>
            </div>

            {/* Upcoming Events Widget */}
            <div onClick={() => setActiveTab('dockets')} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase font-bold text-slate-500 flex items-center"><Calendar className="w-4 h-4 mr-1 text-emerald-600" /> Upcoming Hearings</span>
                <span className="text-xs font-semibold text-emerald-600">High Court Sindh</span>
              </div>
              <div className="mt-3 space-y-2">
                {dockets.slice(0, 1).map(doc => (
                  <div key={doc.id} className="text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900 block">{doc.title}</span>
                    <span className="text-slate-500">Hearing: {doc.hearing_date} ({doc.court_name})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
