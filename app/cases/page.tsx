"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Gavel,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Send,
  UserCheck,
  Users,
  X,
} from "lucide-react";

export interface LegalCase {
  id: string;
  caseTitle: string;
  caseNumber: string;
  courtName: string;
  regionalHub: "Karachi" | "Hyderabad" | "Sukkur";
  assignedAdvocateEmail: string;
  assignedAdvocateName: string;
  clientName: string;
  caseCategory: "Bail Petition" | "Human Rights Writ" | "Criminal Defense" | "Family / Minor Rights";
  nextHearingDate: string;
  status: "Under Trial" | "Bail Granted" | "Disposed / Acquitted" | "Arguments Pending";
  stageNotes: string;
}

const INITIAL_CASES: LegalCase[] = [
  {
    id: "CASE-2026-01",
    caseTitle: "State vs. Ghulam Rasool",
    caseNumber: "Cr. Bail Application #492/2026",
    courtName: "District & Sessions Court, Sukkur",
    regionalHub: "Sukkur",
    assignedAdvocateEmail: "advazizullahazizullah@gmail.com",
    assignedAdvocateName: "Adv Azizullah",
    clientName: "Ghulam Rasool",
    caseCategory: "Bail Petition",
    nextHearingDate: "2026-09-02",
    status: "Arguments Pending",
    stageNotes: "Notice issued to the state prosecutor. Preparing certified case diaries for hearing.",
  },
  {
    id: "CASE-2026-02",
    caseTitle: "Public Interest Petition on Detention Safeguards",
    caseNumber: "Const. Petition #D-118/2026",
    courtName: "High Court of Sindh (Karachi)",
    regionalHub: "Karachi",
    assignedAdvocateEmail: "altafkhoso.adv@gmail.com",
    assignedAdvocateName: "Altaf Khoso",
    clientName: "Community Beneficiaries",
    caseCategory: "Human Rights Writ",
    nextHearingDate: "2026-09-10",
    status: "Under Trial",
    stageNotes: "Division Bench fixed for preliminary arguments on constitutional compliance.",
  },
  {
    id: "CASE-2026-03",
    caseTitle: "State vs. Ali Nawaz (Under Section 497)",
    caseNumber: "Sessions Trial #88/2026",
    courtName: "District Courts, Hyderabad",
    regionalHub: "Hyderabad",
    assignedAdvocateEmail: "advazizullahazizullah@gmail.com",
    assignedAdvocateName: "Adv Azizullah",
    clientName: "Ali Nawaz",
    caseCategory: "Criminal Defense",
    nextHearingDate: "2026-08-25",
    status: "Bail Granted",
    stageNotes: "Post-arrest bail granted by Sessions Judge upon furnished surety bond.",
  },
];

export default function CaseLoadPage() {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const [cases, setCases] = useState<LegalCase[]>(INITIAL_CASES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHub, setSelectedHub] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formNumber, setFormNumber] = useState("");
  const [formCourt, setFormCourt] = useState("District & Sessions Court, Sukkur");
  const [formHub, setFormHub] = useState<"Karachi" | "Hyderabad" | "Sukkur">("Sukkur");
  const [formClient, setFormClient] = useState("");
  const [formCategory, setFormCategory] = useState<LegalCase["caseCategory"]>("Bail Petition");
  const [formHearingDate, setFormHearingDate] = useState(new Date().toISOString().split("T")[0]);
  const [formNotes, setFormNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("plus_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Session check failed:", e);
    }
  }, []);

  const isAdminOrExec = useMemo(() => {
    if (!currentUser) return false;
    const adminEmails = [
      "dataplus.org@gmail.com",
      "altafkhoso.adv@gmail.com",
      "rizwanapatel.plus@gmail.com",
      "ishfaque.mojai@gmail.com",
      "japheth.wilson123@gmail.com",
    ];
    return (
      currentUser.role === "ADMIN" ||
      currentUser.role === "EXECUTIVE" ||
      adminEmails.includes(currentUser.email.toLowerCase().trim())
    );
  }, [currentUser]);

  // Advocates see their assigned cases; Admins see the total institutional docket
  const visibleCases = useMemo(() => {
    if (!currentUser) return [];
    let list = isAdminOrExec
      ? cases
      : cases.filter(
          (c) => c.assignedAdvocateEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
        );

    if (selectedHub !== "ALL") {
      list = list.filter((c) => c.regionalHub === selectedHub);
    }
    if (selectedStatus !== "ALL") {
      list = list.filter((c) => c.status === selectedStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.caseTitle.toLowerCase().includes(q) ||
          c.caseNumber.toLowerCase().includes(q) ||
          c.clientName.toLowerCase().includes(q) ||
          c.courtName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [cases, currentUser, isAdminOrExec, selectedHub, selectedStatus, searchQuery]);

  // Metric Computations
  const stats = useMemo(() => {
    const total = visibleCases.length;
    const bailsGranted = visibleCases.filter((c) => c.status === "Bail Granted").length;
    const underTrial = visibleCases.filter((c) => c.status === "Under Trial" || c.status === "Arguments Pending").length;
    const disposed = visibleCases.filter((c) => c.status === "Disposed / Acquitted").length;
    return { total, bailsGranted, underTrial, disposed };
  }, [visibleCases]);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !formTitle.trim()) return;

    setSubmitting(true);
    const newCase: LegalCase = {
      id: "CASE-2026-0" + (cases.length + 1),
      caseTitle: formTitle,
      caseNumber: formNumber || "Hearing Pending Numbering",
      courtName: formCourt,
      regionalHub: formHub,
      assignedAdvocateEmail: currentUser.email,
      assignedAdvocateName: currentUser.name,
      clientName: formClient,
      caseCategory: formCategory,
      nextHearingDate: formHearingDate,
      status: "Under Trial",
      stageNotes: formNotes,
    };

    setTimeout(() => {
      setCases([newCase, ...cases]);
      setSubmitting(false);
      setIsModalOpen(false);
      setFormTitle("");
      setFormNumber("");
      setFormClient("");
      setFormNotes("");
    }, 400);
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
            Pakistan Legal United Society · Legal Aid Docket
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6">
        {/* Header Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-[#1b365d]" />
              <h1 className="text-2xl font-bold text-[#1b365d]">Case Load & Defense Docket</h1>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Active legal aid casework, bail applications, constitutional writs, and hearing dates across Sindh.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1b365d] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#122440] cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#fad207]" />
            <span>+ Log New Case Intake</span>
          </button>
        </div>

        {/* Case Load Metrics */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Docket</span>
            <p className="mt-2 text-2xl font-bold text-[#1b365d]">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active / In Trial</span>
            <p className="mt-2 text-2xl font-bold text-[#e59a24]">{stats.underTrial}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Bails Granted</span>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{stats.bailsGranted}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Acquitted / Closed</span>
            <p className="mt-2 text-2xl font-bold text-[#c65a28]">{stats.disposed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by case title, FIR/Bail number, court, or client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#1b365d] focus:outline-hidden"
            >
              <option value="ALL">All Regional Hubs</option>
              <option value="Karachi">Karachi (Head Office)</option>
              <option value="Hyderabad">Hyderabad Regional</option>
              <option value="Sukkur">Sukkur Regional</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#1b365d] focus:outline-hidden"
            >
              <option value="ALL">All Case Stages</option>
              <option value="Under Trial">Under Trial</option>
              <option value="Arguments Pending">Arguments Pending</option>
              <option value="Bail Granted">Bail Granted</option>
              <option value="Disposed / Acquitted">Disposed / Acquitted</option>
            </select>
          </div>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleCases.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 transition hover:border-[#1b365d]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1b365d]">{item.id}</span>
                    <span className="rounded-md bg-[#1b365d]/10 px-2 py-0.5 text-[10px] font-bold text-[#1b365d]">
                      {item.caseCategory}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {item.regionalHub}
                    </span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-slate-900">{item.caseTitle}</h3>
                  <p className="text-xs font-mono text-slate-500">{item.caseNumber}</p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    item.status === "Bail Granted"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : item.status === "Under Trial"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-blue-50 text-[#1b365d] border border-blue-200"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-2.5 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Court Venue</span>
                  <span className="font-semibold text-slate-800">{item.courtName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Assigned Advocate</span>
                  <span className="font-semibold text-slate-800">{item.assignedAdvocateName}</span>
                </div>
              </div>

              <div className="rounded-xl bg-[#f8fafc] p-3 border border-slate-100 text-xs text-slate-600">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Proceedings Summary</span>
                {item.stageNotes}
              </div>

              <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-[#c65a28]" />
                  <span>Next Hearing: <strong className="text-slate-800">{item.nextHearingDate}</strong></span>
                </div>
                <span className="text-[11px] text-[#1b365d]">Client: {item.clientName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Case Intake Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1b365d]">Log New Legal Aid Case Intake</h3>
                <p className="text-[11px] text-slate-500">Add client matter to the active PLUS litigation docket.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Case Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State vs. [Client Name]"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    FIR / Bail / Case Ref #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bail App #512/26"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Client / Beneficiary Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Client Full Name"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Regional Hub
                  </label>
                  <select
                    value={formHub}
                    onChange={(e) => setFormHub(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Sukkur">Sukkur Regional</option>
                    <option value="Hyderabad">Hyderabad Regional</option>
                    <option value="Karachi">Karachi (Head Office)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Case Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Bail Petition">Bail Petition (CrPC 497)</option>
                    <option value="Human Rights Writ">Human Rights / Constitutional Writ</option>
                    <option value="Criminal Defense">Criminal Defense Trial</option>
                    <option value="Family / Minor Rights">Family & Minor Protection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Court Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={formCourt}
                    onChange={(e) => setFormCourt(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Next Hearing Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formHearingDate}
                    onChange={(e) => setFormHearingDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Current Proceedings / Stage Notes
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summarize the defense strategy or current stage of hearings..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
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
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b365d] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#122440] disabled:opacity-50 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 text-[#fad207]" />
                  <span>{submitting ? "Saving..." : "Add to Docket"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
