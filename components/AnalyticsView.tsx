"use client";
import React from 'react';
import { BarChart3, CheckCircle2, Printer } from 'lucide-react';

export default function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Executive Analytics & Donor Governance</h2>
          <p className="text-xs text-slate-500">Audited operational KPIs, NAVTTC prison certifications, and compliance matrix.</p>
        </div>
        <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#c65a28] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#a8491d]">
          <Printer className="w-4 h-4" /> <span>Generate Donor M&E Report</span>
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="border-b pb-4 flex justify-between items-start">
          <div>
            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#0052CC]">STATUTORY PROGRESS & DONOR COMPLIANCE REPORT</span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">Pakistan Legal United Society (PLUS)</h2>
            <p className="text-xs text-[#c65a28] font-bold font-serif">انصاف سب کا حق ہے !</p>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            <p>Period: 2020–2026</p>
            <p>Status: Verified</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border bg-slate-50 p-4"><span className="text-[10px] font-bold uppercase text-slate-400">Total Cases Handled</span><p className="text-2xl font-bold text-[#0052CC] mt-1">3,578</p><span className="text-[11px] text-emerald-600 font-semibold">70% Disposal Rate</span></div>
          <div className="rounded-2xl border bg-slate-50 p-4"><span className="text-[10px] font-bold uppercase text-slate-400">Prison Inmates Trained</span><p className="text-2xl font-bold text-[#e59a24] mt-1">1,715</p><span className="text-[11px] text-slate-500">1,500 NAVTTC Certified</span></div>
          <div className="rounded-2xl border bg-slate-50 p-4"><span className="text-[10px] font-bold uppercase text-slate-400">Community Reached</span><p className="text-2xl font-bold text-[#c65a28] mt-1">9,800+</p><span className="text-[11px] text-slate-500">Legal awareness camps</span></div>
          <div className="rounded-2xl border bg-slate-50 p-4"><span className="text-[10px] font-bold uppercase text-slate-400">Stakeholders Trained</span><p className="text-2xl font-bold text-[#0052CC] mt-1">1,591</p><span className="text-[11px] text-slate-500">Police, Judges & CSOs</span></div>
        </div>
      </div>
    </div>
  );
}
