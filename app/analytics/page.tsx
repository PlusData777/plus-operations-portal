"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  PieChart,
  RefreshCw,
  Scale,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

export default function ExecutiveAnalyticsPage() {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("plus_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Session retrieval failed:", e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      {/* Top Header */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-[#1b365d]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Workspace</span>
          </Link>
          <span className="text-[11px] font-semibold text-slate-400">
            Pakistan Legal United Society · Board Analytics
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6">
        {/* Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-[#1b365d]" />
              <h1 className="text-2xl font-bold text-[#1b365d]">
                Executive Analytics & Governance
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              High-level operational budget burn, leave distribution, and casework turnaround metrics.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1b365d] px-3.5 py-1 text-xs font-bold text-[#fad207]">
            <ShieldCheck className="h-4 w-4" />
            Executive Access Verified
          </span>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Budget Spend (YTD)
            </span>
            <p className="mt-2 text-2xl font-bold text-[#1b365d]">Rs 845,000</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <span>↑ 12% within target range</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Average Approval Time
            </span>
            <p className="mt-2 text-2xl font-bold text-[#e59a24]">14.2 hrs</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <span>SLA Target: &lt; 24 hrs</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Operational Roster
            </span>
            <p className="mt-2 text-2xl font-bold text-[#1b365d]">22 Personnel</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
              <span>Across 3 Regional Hubs</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Casework Defense Volume
            </span>
            <p className="mt-2 text-2xl font-bold text-[#c65a28]">138 Cases</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <span>91% Resolution Rate</span>
            </div>
          </div>
        </div>

        {/* Breakdown Panels */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Departmental Expense Burn */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Expense Allocation by Department (PKR)
            </h2>
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Legal Aid & Public Interest Litigation</span>
                  <span className="font-mono">Rs 410,000 (48.5%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-[#1b365d]" style={{ width: "48.5%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Field Outreach & Awareness Camps</span>
                  <span className="font-mono">Rs 235,000 (27.8%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-[#c65a28]" style={{ width: "27.8%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>HR & Office Administrative Operations</span>
                  <span className="font-mono">Rs 140,000 (16.5%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-[#e59a24]" style={{ width: "16.5%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Media, Communications & Design</span>
                  <span className="font-mono">Rs 60,000 (7.2%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald-600" style={{ width: "7.2%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Regional Hub Breakdown */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Regional Operations Hubs
            </h2>
            <div className="space-y-3 pt-2">
              <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-3 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-800">Karachi Head Office</p>
                  <span className="text-[10px] text-slate-500">12 Staff Members</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#1b365d]">54% Load</span>
              </div>

              <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-3 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-800">Hyderabad Regional</p>
                  <span className="text-[10px] text-slate-500">6 Staff Members</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#c65a28]">28% Load</span>
              </div>

              <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-3 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-800">Sukkur Regional</p>
                  <span className="text-[10px] text-slate-500">4 Staff Members</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#e59a24]">18% Load</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
