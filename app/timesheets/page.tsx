"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Filter,
  Layers,
  Plus,
  RefreshCw,
  Scale,
  Send,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";

interface TimesheetEntry {
  id: string;
  date: string;
  staffEmail: string;
  staffName: string;
  department: string;
  hours: number;
  activityCategory: string;
  caseRefOrTask: string;
  notes: string;
  status: "Submitted" | "Verified" | "Rejected";
}

const INITIAL_ENTRIES: TimesheetEntry[] = [
  {
    id: "TS-101",
    date: "2026-08-27",
    staffEmail: "kamanger110@gmail.com",
    staffName: "Kamanger",
    department: "Operations",
    hours: 7.5,
    activityCategory: "Field Outreach & Camp Coordination",
    caseRefOrTask: "Sukkur Legal Aid Camp Logistics",
    notes: "Coordinated community setup and distributed legal aid awareness material.",
    status: "Verified",
  },
  {
    id: "TS-102",
    date: "2026-08-28",
    staffEmail: "advazizullahazizullah@gmail.com",
    staffName: "Adv Azizullah",
    department: "Legal Aid",
    hours: 6.0,
    activityCategory: "Court Appearance & Hearing",
    caseRefOrTask: "Sessions Court Bail Hearing #492/26",
    notes: "Appeared before Additional Sessions Judge for hearing on criminal bail matter.",
    status: "Submitted",
  },
  {
    id: "TS-103",
    date: "2026-08-28",
    staffEmail: "dataplus.org@gmail.com",
    staffName: "Atif Ali",
    department: "IT / Systems",
    hours: 8.0,
    activityCategory: "System & Administrative Governance",
    caseRefOrTask: "Workflow Portal & Google Sheets API Sync",
    notes: "Upgraded RBAC security, dynamic timesheet sync, and regional UI layout.",
    status: "Verified",
  },
];

export default function TimesheetsPage() {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    department: string;
  } | null>(null);

  const [entries, setEntries] = useState<TimesheetEntry[]>(INITIAL_ENTRIES);
  const [loading, setLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [entryHours, setEntryHours] = useState(7.5);
  const [entryCategory, setEntryCategory] = useState("Court Appearance & Hearing");
  const [entryTaskRef, setEntryTaskRef] = useState("");
  const [entryNotes, setEntryNotes] = useState("");
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

  // General Staff view only their own timesheet; Admin/Execs view all
  const visibleEntries = useMemo(() => {
    if (!currentUser) return [];
    let list = isAdminOrExec
      ? entries
      : entries.filter(
          (e) => e.staffEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
        );

    if (selectedDept !== "ALL") {
      list = list.filter((e) => e.department === selectedDept);
    }
    return list;
  }, [entries, currentUser, isAdminOrExec, selectedDept]);

  const totalLoggedHours = useMemo(() => {
    return visibleEntries.reduce((sum, e) => sum + (Number(e.hours) || 0), 0);
  }, [visibleEntries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !entryNotes.trim()) return;

    setSubmitting(true);

    const newEntry: TimesheetEntry = {
      id: "TS-" + (entries.length + 104),
      date: entryDate,
      staffEmail: currentUser.email,
      staffName: currentUser.name,
      department: currentUser.department || "Operations",
      hours: entryHours,
      activityCategory: entryCategory,
      caseRefOrTask: entryTaskRef || "General Operational Support",
      notes: entryNotes,
      status: "Submitted",
    };

    setTimeout(() => {
      setEntries([newEntry, ...entries]);
      setSubmitting(false);
      setIsModalOpen(false);
      setEntryTaskRef("");
      setEntryNotes("");
    }, 400);
  };

  const handleExportCSV = () => {
    const headers = ["ID,Date,Staff Name,Email,Department,Hours,Activity,Task / Case Ref,Notes,Status\n"];
    const rows = visibleEntries.map(
      (e) =>
        `"${e.id}","${e.date}","${e.staffName}","${e.staffEmail}","${e.department}","${e.hours}","${e.activityCategory}","${e.caseRefOrTask}","${e.notes.replace(/"/g, '""')}","${e.status}"\n`
    );
    const blob = new Blob([headers.join("") + rows.join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PLUS_Timesheets_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      {/* Top Navbar */}
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
            Pakistan Legal United Society · Operational Timesheet Registry
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6">
        {/* Title Header & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-[#1b365d]" />
              <h1 className="text-2xl font-bold text-[#1b365d]">Staff Timesheets & Activity Log</h1>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Log daily legal casework, community awareness outreach, and operational support hours.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1b365d] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#122440] cursor-pointer"
            >
              <Plus className="h-4 w-4 text-[#fad207]" />
              <span>+ Log Today&apos;s Hours</span>
            </button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Logged Hours
            </span>
            <p className="mt-2 text-2xl font-bold text-[#1b365d]">{totalLoggedHours.toFixed(1)} hrs</p>
            <span className="text-[11px] text-slate-500">Across verified roster activities</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Logged Entries
            </span>
            <p className="mt-2 text-2xl font-bold text-[#c65a28]">{visibleEntries.length} Records</p>
            <span className="text-[11px] text-slate-500">Activity logs recorded</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active User Scope
            </span>
            <p className="mt-2 text-lg font-bold text-[#1b365d] truncate">
              {currentUser ? currentUser.name : "Staff Member"}
            </p>
            <span className="text-[11px] font-mono text-slate-500 truncate block">
              {currentUser ? currentUser.email : "dataplus.org@gmail.com"}
            </span>
          </div>
        </div>

        {/* Timesheets Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Activity & Work Records
            </h2>

            {isAdminOrExec && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-[#1b365d] focus:outline-hidden"
                >
                  <option value="ALL">All Departments</option>
                  <option value="Legal Aid">Legal Aid</option>
                  <option value="Field Ops">Field Ops</option>
                  <option value="Programs">Programs</option>
                  <option value="Operations">Operations</option>
                  <option value="IT / Systems">IT / Systems</option>
                </select>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-100 bg-[#f8fafc] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Activity Category</th>
                  <th className="py-3 px-4">Task / Case Ref</th>
                  <th className="py-3 px-4">Hours</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {visibleEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-900">{item.date}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{item.staffName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.department}</div>
                    </td>
                    <td className="py-3.5 px-4">{item.activityCategory}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{item.caseRefOrTask}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{item.notes}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1b365d]">{item.hours} hrs</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          item.status === "Verified"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Hours Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1b365d]">Log Daily Activity Hours</h3>
                <p className="text-[11px] text-slate-500">Record tasks completed under PLUS projects.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="14"
                    required
                    value={entryHours}
                    onChange={(e) => setEntryHours(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden font-bold text-[#1b365d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Activity Category
                </label>
                <select
                  value={entryCategory}
                  onChange={(e) => setEntryCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800 focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                >
                  <option value="Court Appearance & Hearing">Court Appearance & Bail Hearing</option>
                  <option value="Legal Petition Drafting">Legal Petition & Bail Drafting</option>
                  <option value="Field Outreach & Camp Coordination">Field Outreach & Camp Coordination</option>
                  <option value="Prison / Police Station Visit">Prison / Police Station Legal Visit</option>
                  <option value="Client Consultation & Intake">Client Consultation & Case Intake</option>
                  <option value="System & Administrative Governance">System & Administrative Support</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Case / Task Reference
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sessions Court Bail #2026/18 or Sukkur Camp"
                  value={entryTaskRef}
                  onChange={(e) => setEntryTaskRef(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Detailed Notes / Summary
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the actions taken and milestones accomplished..."
                  value={entryNotes}
                  onChange={(e) => setEntryNotes(e.target.value)}
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
                  <span>{submitting ? "Recording..." : "Save Timesheet"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
