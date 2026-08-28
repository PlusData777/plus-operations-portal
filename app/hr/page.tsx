"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  FileText,
  Filter,
  GraduationCap,
  HeartHandshake,
  LogOut,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Star,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

interface AppraisalRecord {
  id: string;
  staffName: string;
  staffEmail: string;
  department: string;
  reviewPeriod: string;
  caseworkScore: number; // 1-5
  fieldTargetScore: number; // 1-5
  complianceScore: number; // 1-5
  overallRating: "Outstanding" | "Exceeds Expectations" | "Meets Expectations" | "Needs Improvement";
  managerComments: string;
  status: "Self Assessment" | "Line Manager Review" | "Executive Approved";
}

interface ExitClearanceRecord {
  id: string;
  staffName: string;
  staffEmail: string;
  department: string;
  lastWorkingDay: string;
  caseworkHandoverTo: string;
  financeSettled: boolean;
  adminAssetsReturned: boolean;
  digitalAccessRevoked: boolean;
  status: "Clearance In Progress" | "Completed";
}

const INITIAL_APPRAISALS: AppraisalRecord[] = [
  {
    id: "APR-2026-01",
    staffName: "Adv Azizullah",
    staffEmail: "advazizullahazizullah@gmail.com",
    department: "Legal Aid",
    reviewPeriod: "Q1-Q2 2026",
    caseworkScore: 4.8,
    fieldTargetScore: 4.5,
    complianceScore: 5.0,
    overallRating: "Outstanding",
    managerComments: "Exceptional bail disposal rate in Sukkur Sessions Court; timely court diary updates.",
    status: "Executive Approved",
  },
  {
    id: "APR-2026-02",
    staffName: "Kamanger",
    staffEmail: "kamanger110@gmail.com",
    department: "Operations",
    reviewPeriod: "Q1-Q2 2026",
    caseworkScore: 4.2,
    fieldTargetScore: 4.7,
    complianceScore: 4.6,
    overallRating: "Exceeds Expectations",
    managerComments: "Strong field coordination in Sukkur camps and excellent prison center logistics oversight.",
    status: "Executive Approved",
  },
  {
    id: "APR-2026-03",
    staffName: "Saif Rehman",
    staffEmail: "saifrehman.kaloi@gmail.com",
    department: "Field Ops",
    reviewPeriod: "Q1-Q2 2026",
    caseworkScore: 4.0,
    fieldTargetScore: 4.6,
    complianceScore: 4.4,
    overallRating: "Exceeds Expectations",
    managerComments: "Consistently mobilized community rights clinics with high minority inclusion turnout.",
    status: "Line Manager Review",
  },
];

const INITIAL_EXITS: ExitClearanceRecord[] = [
  {
    id: "EXT-2026-01",
    staffName: "Former Field Associate",
    staffEmail: "field.associate@gmail.com",
    department: "Field Ops",
    lastWorkingDay: "2026-07-31",
    caseworkHandoverTo: "Faiz (faizthecoach@gmail.com)",
    financeSettled: true,
    adminAssetsReturned: true,
    digitalAccessRevoked: true,
    status: "Completed",
  },
];

export default function HRLifecyclePage() {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    department: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"APPRAISALS" | "EXIT_CLEARANCE" | "ONBOARDING" | "GRIEVANCES">("APPRAISALS");
  const [appraisals, setAppraisals] = useState<AppraisalRecord[]>(INITIAL_APPRAISALS);
  const [exits, setExits] = useState<ExitClearanceRecord[]>(INITIAL_EXITS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Appraisal Form State
  const [appStaffEmail, setAppStaffEmail] = useState("");
  const [appStaffName, setAppStaffName] = useState("");
  const [appPeriod, setAppPeriod] = useState("Q3 2026");
  const [appCasework, setAppCasework] = useState(4.5);
  const [appField, setAppField] = useState(4.5);
  const [appCompliance, setAppCompliance] = useState(5.0);
  const [appComments, setAppComments] = useState("");

  // Exit Form State
  const [exitStaffName, setExitStaffName] = useState("");
  const [exitStaffEmail, setExitStaffEmail] = useState("");
  const [exitLastDay, setExitLastDay] = useState(new Date().toISOString().split("T")[0]);
  const [exitHandoverTo, setExitHandoverTo] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("plus_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("User session check failed:", e);
    }
  }, []);

  const isHRAdminOrExec = useMemo(() => {
    if (!currentUser) return false;
    const adminEmails = [
      "dataplus.org@gmail.com",
      "altafkhoso.adv@gmail.com",
      "rizwanapatel.plus@gmail.com",
      "ishfaque.mojai@gmail.com",
    ];
    return (
      currentUser.role === "ADMIN" ||
      currentUser.role === "EXECUTIVE" ||
      currentUser.role === "HR_ADMIN" ||
      adminEmails.includes(currentUser.email.toLowerCase().trim())
    );
  }, [currentUser]);

  const handleCreateAppraisal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appStaffName.trim()) return;

    const avg = (appCasework + appField + appCompliance) / 3;
    let rating: AppraisalRecord["overallRating"] = "Meets Expectations";
    if (avg >= 4.7) rating = "Outstanding";
    else if (avg >= 4.0) rating = "Exceeds Expectations";
    else if (avg < 3.0) rating = "Needs Improvement";

    const newRecord: AppraisalRecord = {
      id: "APR-2026-0" + (appraisals.length + 1),
      staffName: appStaffName,
      staffEmail: appStaffEmail || "staff@pluslegalaid.org.pk",
      department: "Operations",
      reviewPeriod: appPeriod,
      caseworkScore: appCasework,
      fieldTargetScore: appField,
      complianceScore: appCompliance,
      overallRating: rating,
      managerComments: appComments,
      status: isHRAdminOrExec ? "Executive Approved" : "Line Manager Review",
    };

    setAppraisals([newRecord, ...appraisals]);
    setIsModalOpen(false);
    setAppStaffName("");
    setAppStaffEmail("");
    setAppComments("");
  };

  const handleCreateExit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitStaffName.trim()) return;

    const newExit: ExitClearanceRecord = {
      id: "EXT-2026-0" + (exits.length + 1),
      staffName: exitStaffName,
      staffEmail: exitStaffEmail,
      department: "Legal / Field",
      lastWorkingDay: exitLastDay,
      caseworkHandoverTo: exitHandoverTo,
      financeSettled: false,
      adminAssetsReturned: false,
      digitalAccessRevoked: false,
      status: "Clearance In Progress",
    };

    setExits([newExit, ...exits]);
    setIsModalOpen(false);
    setExitStaffName("");
    setExitStaffEmail("");
    setExitHandoverTo("");
  };

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
            Pakistan Legal United Society · HR Governance & Staff Lifecycle
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6">
        {/* Title Header & Primary Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-[#1b365d]" />
              <h1 className="text-2xl font-bold text-[#1b365d]">HR Governance & Staff Lifecycle</h1>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Staff performance evaluations, exit handovers, bar licensure verification, and workplace standards.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1b365d] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#122440] cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#fad207]" />
            <span>
              {activeTab === "APPRAISALS"
                ? "+ Start Performance Review"
                : activeTab === "EXIT_CLEARANCE"
                ? "+ Initiate Exit Clearance"
                : "+ New HR Action"}
            </span>
          </button>
        </div>

        {/* HR KPI Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Personnel</span>
            <p className="mt-2 text-2xl font-bold text-[#1b365d]">22 Staff</p>
            <span className="text-[10px] text-slate-500">Active roster across 3 Hubs</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Appraisals Completed</span>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{appraisals.length} Verified</p>
            <span className="text-[10px] text-slate-500">Avg Performance: 4.6 / 5.0</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Exit Handovers</span>
            <p className="mt-2 text-2xl font-bold text-[#e59a24]">{exits.length} Cleared</p>
            <span className="text-[10px] text-slate-500">All case dockets transferred</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Policy Compliance</span>
            <p className="mt-2 text-2xl font-bold text-[#1b365d]">100%</p>
            <span className="text-[10px] text-slate-500">Bar Licensure & SGBV Code</span>
          </div>
        </div>

        {/* Lifecycle Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("APPRAISALS")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === "APPRAISALS"
                ? "bg-[#1b365d] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Award className="h-3.5 w-3.5 text-[#fad207]" />
            <span>Performance Appraisals & KPIs ({appraisals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("EXIT_CLEARANCE")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === "EXIT_CLEARANCE"
                ? "bg-[#1b365d] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <LogOut className="h-3.5 w-3.5 text-[#c65a28]" />
            <span>Exit Clearances & Docket Handover ({exits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("ONBOARDING")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === "ONBOARDING"
                ? "bg-[#1b365d] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Bar Licensure & Compliance Code</span>
          </button>

          <button
            onClick={() => setActiveTab("GRIEVANCES")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === "GRIEVANCES"
                ? "bg-[#1b365d] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-[#b82626]" />
            <span>Workplace Safety & Grievance Desk</span>
          </button>
        </div>

        {/* Tab 1: Performance Appraisals */}
        {activeTab === "APPRAISALS" && (
          <div className="space-y-4">
            {appraisals.map((apr) => (
              <div
                key={apr.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 hover:border-[#1b365d] transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1b365d]">{apr.id}</span>
                      <span className="rounded-md bg-[#1b365d]/10 px-2 py-0.5 text-[10px] font-bold text-[#1b365d]">
                        {apr.reviewPeriod}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        {apr.department}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-slate-900">{apr.staffName}</h3>
                    <p className="text-xs font-mono text-slate-500">{apr.staffEmail}</p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      apr.overallRating === "Outstanding"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-[#1b365d] border border-blue-200"
                    }`}
                  >
                    ★ {apr.overallRating}
                  </span>
                </div>

                {/* Score Disaggregation */}
                <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-xs">
                  <div className="rounded-xl bg-[#f8fafc] p-2.5 border border-slate-100 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Casework & Disposal</span>
                    <span className="font-bold text-[#1b365d] text-sm">{apr.caseworkScore} / 5.0</span>
                  </div>
                  <div className="rounded-xl bg-[#f8fafc] p-2.5 border border-slate-100 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Field / Program Output</span>
                    <span className="font-bold text-[#c65a28] text-sm">{apr.fieldTargetScore} / 5.0</span>
                  </div>
                  <div className="rounded-xl bg-[#f8fafc] p-2.5 border border-slate-100 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Compliance & Punctuality</span>
                    <span className="font-bold text-emerald-600 text-sm">{apr.complianceScore} / 5.0</span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#f8fafc] p-3 text-xs text-slate-600 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Manager Evaluation Notes</span>
                  {apr.managerComments}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Exit Clearances & Handover */}
        {activeTab === "EXIT_CLEARANCE" && (
          <div className="space-y-4">
            {exits.map((ext) => (
              <div
                key={ext.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 hover:border-[#1b365d] transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1b365d]">{ext.id}</span>
                      <span className="rounded-md bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                        Last Day: {ext.lastWorkingDay}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-slate-900">{ext.staffName}</h3>
                    <p className="text-xs font-mono text-slate-500">{ext.staffEmail}</p>
                  </div>

                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                    {ext.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-[#f8fafc] rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Finance Settled: <strong>Verified</strong></span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#f8fafc] rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Assets Returned: <strong>Verified</strong></span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#f8fafc] rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Access Deactivated: <strong>Done</strong></span>
                  </div>
                </div>

                <div className="p-3 bg-[#f8fafc] rounded-xl border border-slate-100 text-xs text-slate-600">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Court Briefs & File Handover</span>
                  Active court dockets and Vakalatnamas transferred to: <strong>{ext.caseworkHandoverTo}</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Onboarding & Statutory Compliance */}
        {activeTab === "ONBOARDING" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Statutory Bar Licensure & Organizational Undertakings
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Sindh Bar Council License Verification</p>
                  <span className="text-[11px] text-slate-500">All panel advocates verified under Sindh Bar Advocates Act.</span>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px]">
                  100% Compliant
                </span>
              </div>

              <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Child Protection & Anti-Harassment Code of Conduct</p>
                  <span className="text-[11px] text-slate-500">Signed undertaking on protection of women and minors in custodial spaces.</span>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px]">
                  All Signed
                </span>
              </div>

              <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Client Confidentiality & Legal Privilege Undertaking</p>
                  <span className="text-[11px] text-slate-500">Strict data protection regarding vulnerable prisoners and bail litigation files.</span>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px]">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Grievance Desk */}
        {activeTab === "GRIEVANCES" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Confidential Workplace & Field Safety Desk
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct submission channel to Executive Leadership (Ashfaq Ali / Altaf Khoso / Rizwana Patel).
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                0 Active Grievances
              </span>
            </div>

            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
              <ShieldCheck className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">All workplace safety protocols are clear.</p>
              <p className="mt-1 text-slate-400">No unresolved field incidents or harassment complaints on record.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Appraisals or Exits */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1b365d]">
                  {activeTab === "APPRAISALS" ? "Record Performance Appraisal" : "Initiate Staff Exit Clearance"}
                </h3>
                <p className="text-[11px] text-slate-500">Official HR Governance Action</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeTab === "APPRAISALS" ? (
              <form onSubmit={handleCreateAppraisal} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Staff Member Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Adv Azizullah"
                      value={appStaffName}
                      onChange={(e) => setAppStaffName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Review Period</label>
                    <select
                      value={appPeriod}
                      onChange={(e) => setAppPeriod(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    >
                      <option value="Q1-Q2 2026">Q1-Q2 2026 (Semi-Annual)</option>
                      <option value="Q3 2026">Q3 2026 (Quarterly)</option>
                      <option value="Annual 2026">Annual Review 2026</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Casework (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={appCasework}
                      onChange={(e) => setAppCasework(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-[#1b365d] focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Field Target (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={appField}
                      onChange={(e) => setAppField(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-[#c65a28] focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Compliance (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={appCompliance}
                      onChange={(e) => setAppCompliance(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-emerald-600 focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Evaluation & Feedback</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Summarize key strengths, case turnaround, and development goals..."
                    value={appComments}
                    onChange={(e) => setAppComments(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b365d] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#122440] cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5 text-[#fad207]" />
                    <span>Save Evaluation</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateExit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Staff Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Departing staff member's name"
                    value={exitStaffName}
                    onChange={(e) => setExitStaffName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Last Working Day</label>
                    <input
                      type="date"
                      required
                      value={exitLastDay}
                      onChange={(e) => setExitLastDay(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Handover Successor</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Faiz / Adv Azizullah"
                      value={exitHandoverTo}
                      onChange={(e) => setExitHandoverTo(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#c65a28] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#a8491d] cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Initiate Clearance</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
