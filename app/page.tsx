"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";

/* Custom PLUS Official Brand Emblem SVG */
function PlusOfficialLogo({ className = "h-10 w-auto", dark = false }: { className?: string; dark?: boolean }) {
  const fgColor = dark ? "#1b365d" : "#ffffff";
  const circleStroke = dark ? "#1b365d" : "#fad207";
  const textMotto = dark ? "#1b365d" : "#fad207";

  return (
    <svg viewBox="0 0 280 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Circular Scales Seal */}
      <circle cx="40" cy="40" r="36" stroke={circleStroke} strokeWidth="2.5" strokeDasharray="3 2" />
      <circle cx="40" cy="40" r="31" stroke={fgColor} strokeWidth="1.5" />
      
      {/* Scales of Justice */}
      <path d="M40 20v40M30 28h20M25 34l5-6 5 6M45 34l5-6 5 6" stroke={fgColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 34c0 3.5 3.5 5 7 5s7-1.5 7-5M43 34c0 3.5 3.5 5 7 5s7-1.5 7-5" stroke={fgColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M34 60h12" stroke={fgColor} strokeWidth="2" strokeLinecap="round" />

      {/* PLUS Acronym Stack */}
      <g fill={fgColor} fontWeight="900" fontFamily="sans-serif">
        <text x="85" y="27" fontSize="16" letterSpacing="0.5">P</text>
        <text x="98" y="27" fontSize="9" fontWeight="700" opacity="0.9">AKISTAN</text>

        <text x="85" y="41" fontSize="16" letterSpacing="0.5">L</text>
        <text x="98" y="41" fontSize="9" fontWeight="700" opacity="0.9">EGAL</text>

        <text x="85" y="55" fontSize="16" letterSpacing="0.5">U</text>
        <text x="98" y="55" fontSize="9" fontWeight="700" opacity="0.9">NITED</text>

        <text x="85" y="69" fontSize="16" letterSpacing="0.5">S</text>
        <text x="98" y="69" fontSize="9" fontWeight="700" opacity="0.9">OCIETY</text>
      </g>

      {/* Urdu Tagline */}
      <text x="175" y="48" fill={textMotto} fontSize="17" fontWeight="bold" fontFamily="serif" direction="rtl">
        انصاف سب کا حق ہے
      </text>
    </svg>
  );
}

interface RequestItem {
  id: string;
  timestamp: string;
  requesterEmail: string;
  requesterName: string;
  requestType: "Leave" | "Expense" | "General";
  leaveCategory?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  amount?: number;
  expenseCategory?: string;
  description: string;
  status: string;
  currentApproverEmail?: string;
  tier1Approved?: boolean;
  tier2Approved?: boolean;
}

interface LeaveBalance {
  casualTotal: number;
  casualUsed: number;
  annualTotal: number;
  annualUsed: number;
  medicalTotal: number;
  medicalUsed: number;
}

export default function WorkspacePage() {
  const [user, setUser] = useState({
    name: "Data Plus",
    email: "dataplus.org@gmail.com",
    role: "ADMIN",
    designation: "Administrator",
  });

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "LEAVE" | "EXPENSE">("ALL");

  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance>({
    casualTotal: 5,
    casualUsed: 0,
    annualTotal: 5,
    annualUsed: 0,
    medicalTotal: 2,
    medicalUsed: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("plus_user");
      if (stored) {
        const u = JSON.parse(stored);
        setUser({
          name: u.name || "Staff Member",
          email: u.email || "dataplus.org@gmail.com",
          role: u.role || "STAFF",
          designation: u.designation || "Operational Team",
        });
      }
    } catch (e) {
      console.warn("Could not parse user session:", e);
    }
  }, []);

  async function fetchLiveRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        if (data.requests && Array.isArray(data.requests)) {
          setRequests(data.requests);
        }
      }
    } catch (e) {
      console.warn("Error loading requests:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLiveRequests();
  }, []);

  const stats = useMemo(() => {
    const totalCount = requests.length;
    const pendingCount = requests.filter(
      (r) =>
        r.status &&
        (r.status.toLowerCase().includes("pending") ||
          r.status.toLowerCase().includes("review"))
    ).length;

    const approvedPkrVolume = requests
      .filter((r) => {
        const st = (r.status || "").toLowerCase();
        return st.includes("approved") && Number(r.amount) > 0;
      })
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const actionRequiredCount = requests.filter((r) => {
      const pendingTo = (r.currentApproverEmail || "").toLowerCase().trim();
      const myEmail = (user.email || "").toLowerCase().trim();
      const st = (r.status || "").toLowerCase();
      return pendingTo === myEmail && !st.includes("approved") && !st.includes("rejected");
    }).length;

    return {
      totalCount,
      pendingCount,
      approvedPkrVolume,
      actionRequiredCount,
    };
  }, [requests, user.email]);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        req.requesterName?.toLowerCase().includes(q) ||
        req.requesterEmail?.toLowerCase().includes(q) ||
        req.description?.toLowerCase().includes(q) ||
        req.id?.toLowerCase().includes(q);

      if (activeTab === "LEAVE") {
        return matchesSearch && req.requestType === "Leave";
      }
      if (activeTab === "EXPENSE") {
        return matchesSearch && req.requestType === "Expense";
      }
      return matchesSearch;
    });
  }, [requests, searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      {/* Top Navbar with Official PLUS Emblem */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-[#1b365d] px-3 py-1.5 shadow-xs">
              <PlusOfficialLogo className="h-9 w-auto" dark={false} />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#1b365d]/10 px-2 py-0.5 text-[10px] font-bold text-[#1b365d]">
                  PLUS OPS
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Operations & Governance Workspace
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <div className="text-xs font-bold text-[#1b365d]">{user.name}</div>
              <div className="text-[11px] font-mono text-slate-500">{user.email}</div>
            </div>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("plus_user");
                  window.location.reload();
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-[#b82626] cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
              <span className="block px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Secure Workspace
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("ALL")}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer ${
                    activeTab === "ALL"
                      ? "bg-[#1b365d] text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 text-[#fad207]" />
                  <span>All Operations Requests</span>
                </button>

                <Link
                  href="/directory"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Users className="h-4 w-4 text-[#c65a28]" />
                  <span>Staff Directory</span>
                </Link>

                <Link
                  href="/timesheets"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Clock className="h-4 w-4 text-[#e59a24]" />
                  <span>Staff Timesheets</span>
                </Link>

                <div className="border-t border-slate-100 my-2 pt-2">
                  <span className="block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Filters
                  </span>
                  <button
                    onClick={() => setActiveTab("LEAVE")}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold transition text-left cursor-pointer ${
                      activeTab === "LEAVE"
                        ? "bg-[#1b365d] text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5 text-[#fad207]" />
                    <span>Leave Applications</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("EXPENSE")}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold transition text-left cursor-pointer ${
                      activeTab === "EXPENSE"
                        ? "bg-[#1b365d] text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-[#fad207]" />
                    <span>Expense Claims</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Leave Balance Overview Widget */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#c65a28]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    My Leave Balance
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#1b365d]">FY 2026</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Casual</span>
                  <p className="text-base font-bold text-[#1b365d]">
                    {leaveBalances.casualTotal - leaveBalances.casualUsed}
                    <span className="text-[10px] text-slate-400 font-normal">/{leaveBalances.casualTotal}</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Annual</span>
                  <p className="text-base font-bold text-[#1b365d]">
                    {leaveBalances.annualTotal - leaveBalances.annualUsed}
                    <span className="text-[10px] text-slate-400 font-normal">/{leaveBalances.annualTotal}</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Sick</span>
                  <p className="text-base font-bold text-[#1b365d]">
                    {leaveBalances.medicalTotal - leaveBalances.medicalUsed}
                    <span className="text-[10px] text-slate-400 font-normal">/{leaveBalances.medicalTotal}</span>
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Workspace Main Stream */}
          <div className="lg:col-span-9 space-y-6">
            {/* Action Required Alert Banner */}
            <div className="rounded-2xl border border-[#fad207]/40 bg-[#fad207]/10 p-5 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#fad207] p-2 text-[#1b365d] shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#1b365d]">
                    Action Required by You
                  </h3>
                  <p className="text-xs text-slate-600">
                    {stats.actionRequiredCount > 0
                      ? `You have ${stats.actionRequiredCount} request(s) awaiting your administrative clearance or review.`
                      : "No approvals are currently awaiting your action."}
                  </p>
                </div>
              </div>
            </div>

            {/* Header Title & Role Badge */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#c65a28]">
                  {user.role} WORKSPACE
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-[#1b365d]">
                  All Requests.
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review requests within your verified roster scope. Decisions are synchronized to the PLUS ledger.
                </p>
              </div>

              <button
                onClick={fetchLiveRequests}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Sync Requests</span>
              </button>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Queue Total</span>
                  <FileText className="h-4 w-4 text-[#1b365d]" />
                </div>
                <p className="mt-2 text-2xl font-bold text-[#1b365d]">{stats.totalCount}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
                  <Clock className="h-4 w-4 text-[#e59a24]" />
                </div>
                <p className="mt-2 text-2xl font-bold text-[#e59a24]">{stats.pendingCount}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Approved PKR</span>
                  <CheckCircle2 className="h-4 w-4 text-[#1b365d]" />
                </div>
                <p className="mt-2 text-xl font-bold text-[#1b365d]">
                  Rs {stats.approvedPkrVolume.toLocaleString("en-PK")}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">&gt;48h Warnings</span>
                  <ShieldAlert className="h-4 w-4 text-[#b82626]" />
                </div>
                <p className="mt-2 text-2xl font-bold text-[#b82626]">0</p>
              </div>
            </div>

            {/* Search and Request Feed */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search requests by name, ID, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Loading verified records from sheet...
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-xs text-slate-500">
                  No active operations requests found matching your filter criteria.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRequests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4 transition hover:border-[#1b365d]/40 hover:bg-white hover:shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-[#1b365d]">
                              {req.id}
                            </span>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                req.requestType === "Expense"
                                  ? "bg-[#e59a24]/15 text-[#c65a28]"
                                  : "bg-[#1b365d]/10 text-[#1b365d]"
                              }`}
                            >
                              {req.requestType}
                            </span>
                          </div>
                          <h4 className="mt-1 text-xs font-bold text-slate-900">
                            {req.requesterName} ({req.requesterEmail})
                          </h4>
                          <p className="mt-1 text-xs text-slate-600">{req.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          {req.amount && Number(req.amount) > 0 ? (
                            <span className="text-sm font-bold text-[#1b365d]">
                              PKR {Number(req.amount).toLocaleString("en-PK")}
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-[#1b365d]">
                              {req.days || 1} Day(s) Leave
                            </span>
                          )}
                          <div className="mt-1">
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                              {req.status || "Submitted"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Branded Footer with Official PLUS Emblem */}
      <footer className="mt-16 border-t border-slate-200 bg-[#1b365d] text-white">
        <div className="border-b border-white/10 bg-[#122440] py-4 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#fad207]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Pakistan Legal United Society · Operations & Legal Aid Hub
              </span>
            </div>
            <div>
              <span className="rounded-lg bg-[#c65a28] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Field Operations Active
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="space-y-4 md:col-span-4">
              <PlusOfficialLogo className="h-14 w-auto" dark={false} />
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Committed to human rights protection, public interest legal aid, and operational transparency across Sindh and Pakistan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:col-span-8">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#fad207] mb-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Head Office (Karachi)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Plot 213, St 4, New Bakhtawar Goth, Block-09, Gulistan-e-Johar
                </p>
                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-mono text-slate-200">
                  <Phone className="h-3 w-3 text-[#fad207]" />
                  <span>021-34011698</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#fad207] mb-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Regional (Hyderabad)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  House B/7 Ground Floor, Street 1, Sunny Bungalows, Qasimabad
                </p>
                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-mono text-slate-200">
                  <Phone className="h-3 w-3 text-[#fad207]" />
                  <span>022-6112571</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#fad207] mb-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Regional (Sukkur)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Women Development Complex, near SRSO, Shikarpur Rd
                </p>
                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-mono text-slate-200">
                  <Phone className="h-3 w-3 text-[#fad207]" />
                  <span>071-5824119</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
            <span>PLUS Governance & Operations Management System</span>
            <span className="font-mono text-[#fad207]">dataplus.org@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
