"use client";
import React from 'react';
import { Briefcase, Scale, Receipt, UserCheck, ShieldCheck, Zap, Loader2 } from 'lucide-react';

export default function DashboardView({ visibleRequests, programs, dockets, currentUser, aiBriefing, isGeneratingBriefing, generateAIBriefing }) {
  const isExecutive = currentUser.role === 'EXECUTIVE';
  const isFinance = currentUser.role === 'FINANCE_MGR';
  const isProgram = currentUser.role === 'PROGRAM_MGR';
  const isHr = currentUser.role === 'HR_ADMIN';
  const isStaff = currentUser.role === 'STAFF';

  const totalBudget = programs.reduce((sum, p) => sum + (p.grant_budget || 0), 0);
  const pendingRequestsCount = visibleRequests.filter(r => r.status?.includes('PENDING')).length;

  return (
    <div className="space-y-6">
      {/* ROLE BANNER */}
      <div className="bg-gradient-to-r from-[#0052CC] to-[#003d99] p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-blue-400/35 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-400/30">
            Role: {currentUser.role}
          </span>
          <h2 className="text-2xl font-bold mt-2">Welcome back, {currentUser.name}</h2>
          <p className="text-blue-100 text-sm mt-1">Department: {currentUser.department} | Hub: {currentUser.hub || 'Karachi HQ'}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-right">
          <span className="text-[10px] uppercase text-blue-200 font-semibold block">Authorization Scope</span>
          <span className="text-sm font-bold text-white">{currentUser.approval_scope || 'Standard Operational'}</span>
        </div>
      </div>

      {/* METrics GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">
              {isProgram ? 'Assigned Programs' : 'Active Programs'}
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{programs.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Case Dockets</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{dockets.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Approvals</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{pendingRequestsCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">
              {isFinance ? 'Total Portfolio' : 'User Authority'}
            </span>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {isFinance ? `PKR ${(totalBudget / 1000000).toFixed(1)}M` : currentUser.designation}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            {isExecutive ? <ShieldCheck className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
          </div>
        </div>
      </div>

      {/* AI EXECUTIVE / ROLE BRIEFING */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900">
              {isExecutive ? 'Executive Intelligence Telemetry' : `${currentUser.role} Operational Telemetry`}
            </h3>
          </div>
          <button 
            onClick={generateAIBriefing}
            disabled={isGeneratingBriefing}
            className="flex items-center space-x-2 bg-[#0052CC] hover:bg-[#003d99] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shadow-sm"
          >
            {isGeneratingBriefing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span>Generate Live Briefing</span>
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
          {aiBriefing || `System status nominal. Role-based view active for ${currentUser.name} (${currentUser.role}). All module permissions verified against organizational governance policy.`}
        </div>
      </div>
    </div>
  );
}
