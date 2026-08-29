/* eslint-disable @next/next/no-img-element */
"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  PlusCircle,
  Search,
  UserCheck,
  X,
} from "lucide-react";

interface TimesheetRecord {
  id: string;
  staffName: string;
  staffEmail: string;
  hub: "Karachi" | "Hyderabad" | "Sukkur";
  weekEnding: string;
  regularHours: number;
  overtimeHours: number;
  status: "Submitted" | "Verified by HR" | "Approved";
  notes: string;
}

const INITIAL_TIMESHEETS: TimesheetRecord[] = [
  {
    id: "TS-501",
    staffName: "Kamanger",
    staffEmail: "kamanger110@gmail.com",
    hub: "Hyderabad",
    weekEnding: "2026-08-28",
    regularHours: 40,
    overtimeHours: 6,
    status: "Verified by HR",
    notes: "Field setup for UC Qasimabad community legal camp.",
  },
  {
    id: "TS-502",
    staffName: "Adv Azizullah",
    staffEmail: "advazizullahazizullah@gmail.com",
    hub: "Sukkur",
    weekEnding: "2026-08-28",
    regularHours: 37.5,
    overtimeHours: 2,
    status: "Approved",
    notes: "High court hearings and under-trial jail visits.",
  },
];

const OFFICIAL_LOGO_URL =
  "https://grassrootsjusticenetwork.org/wp-content/uploads/2023/12/PLUS-logo-1-768x593.png";

export default function TimesheetsPage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [timesheets, setTimesheets] = useState<TimesheetRecord[]>(INITIAL_TIMESHEETS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [regHours, setRegHours] = useState(40);
  const [otHours, setOtHours] = useState(0);
  const [weekEnd, setWeekEnd] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("plus_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, []);

  const isExecutiveOrAdmin = useMemo(() => {
    if (!currentUser) return false;
    const adminExecEmails = [
      "dataplus.org@gmail.com",
      "altafkhoso.adv@gmail.com",
      "rizwanapatel.plus@gmail.com",
      "ishfaque.mojai@gmail.com",
      "japheth.wilson123@gmail.com",
    ];
    return (
      currentUser.role === "ADMIN" ||
      currentUser.role === "EXECUTIVE" ||
      currentUser.role === "HR_ADMIN" ||
      adminExecEmails.includes(currentUser.email.toLowerCase().trim())
    );
  }, [currentUser]);

  const scopedTimesheets = useMemo(() => {
    if (!currentUser) return [];
    if (isExecutiveOrAdmin) return timesheets;
    return timesheets.filter(
      (t) => t.staffEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
    );
  }, [timesheets, currentUser, isExecutiveOrAdmin]);

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSubmitting(true);
    const newRecord: TimesheetRecord = {
      id: "TS-" + (timesheets.length + 501),
      staffName: currentUser.name,
      staffEmail: currentUser.email,
      hub: "Sukkur", // Default or user hub
      weekEnding: weekEnd,
      regularHours: Number(regHours),
      overtimeHours: Number(otHours),
      status: "Submitted",
      notes,
    };

    setTimesheets([newRecord, ...timesheets]);
    setSubmitting(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setIsModalOpen(false);
      setNotes("");
      setOtHours(0);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-[#1b365d] hover:text-[#c65a28] mr-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Operations Portal</span>
            </Link>
            <div className="h-4 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#1b365d] p-1 shadow-xs">
                <img src={OFFICIAL_LOGO_URL} alt="PLUS Logo" className="h-8 w-auto object-contain" />
              </div>
              <h1 className="text-sm font-bold tracking-tight text-[#1b365d] sm:text-base">
                Staff Timesheets & Attendance Synchronization
              </h1>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#c65a28] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#a8491d] cursor-pointer"
          >
            <PlusCircle className="h-4 w-4 text-[#fad207]" />
            <span>+ Log Weekly Hours</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-[#1b365d]">Attendance & Overtime Ledger</h2>
              <p className="text-xs text-slate-500">Synced directly with payroll calculations for monthly disbursement.</p>
            </div>
            <span className="rounded-full bg-[#1b365d]/10 px-3 py-1 text-[11px] font-bold text-[#1b365d]">
              Active Cycle: August 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#f8fafc] text-[10px] font-bold uppercase tracking-wider text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Timesheet ID</th>
                  <th className="py-3 px-4">Staff Member & Hub</th>
                  <th className="py-3 px-4">Week Ending</th>
                  <th className="py-3 px-4">Regular Hours</th>
                  <th className="py-3 px-4">Overtime</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Activity Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scopedTimesheets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                      No timesheets logged for your account.
                    </td>
                  </tr>
                ) : (
                  scopedTimesheets.map((ts) => (
                    <tr key={ts.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1b365d]">{ts.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{ts.staffName}</div>
                        <span className="text-[10px] text-slate-500">{ts.hub} Regional</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{ts.weekEnding}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{ts.regularHours} hrs</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">+{ts.overtimeHours} hrs</td>
                      <td className="py-3.5 px-4">
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          {ts.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600 max-w-xs truncate">
                        {ts.notes}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1b365d]">Log Weekly Work Hours</h3>
                <p className="text-[11px] text-slate-500">Syncs with HR attendance & payroll.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleLogHours} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Week Ending Date
                </label>
                <input
                  type="date"
                  required
                  value={weekEnd}
                  onChange={(e) => setWeekEnd(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Regular Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={regHours}
                    onChange={(e) => setRegHours(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-[#1b365d]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Overtime Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={otHours}
                    onChange={(e) => setOtHours(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Task & Field Activity Summary
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize field work, legal clinics, or administrative outputs..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden resize-none"
                />
              </div>

              {success ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Timesheet Logged Successfully!</span>
                </div>
              ) : (
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
                    className="flex-1 rounded-xl bg-[#c65a28] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#a8491d] disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Submitting..." : "Submit Timesheet"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <footer className="mt-16 border-t border-slate-200 bg-[#1b365d] py-4 text-center text-[11px] text-slate-300">
        Pakistan Legal United Society · Staff Attendance & Timesheets Module
      </footer>
    </div>
  );
}
