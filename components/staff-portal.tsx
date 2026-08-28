"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardCheck,
  ClipboardPlus,
  FileText,
  LoaderCircle,
  RefreshCw,
  Send,
  X,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { WorkflowStepper } from "@/components/workflow-stepper";
import { LeaveQuotaCard } from "@/components/leave-quota-card";

export type RequestCategory =
  | "OPS"
  | "LEAVE"
  | "EXPENSE"
  | "LEGAL_AID"
  | "PROCUREMENT"
  | "GENERAL";

export const REQUEST_CATEGORY_LABELS: Record<string, string> = {
  OPS: "Operations & Logistics",
  LEAVE: "Leave Request",
  EXPENSE: "Expense Reimbursement",
  LEGAL_AID: "Field Legal Aid Advance",
  PROCUREMENT: "Procurement & Supplies",
  GENERAL: "General Request",
};

export interface PortalRequest {
  id?: string;
  category: string;
  title?: string;
  description?: string;
  justification?: string;
  amount?: string | number;
  status: string;
  timestamp?: string;
  requesterName?: string;
  requesterEmail?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  handoffTo?: string;
  [key: string]: any;
}

export type StaffProfile = {
  name: string;
  email: string;
  role?: string;
  department?: string;
  supervisor?: string;
  status?: string;
};

type FormState = {
  category: RequestCategory;
  amount: string;
  justification: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  handoffTo: string;
};

const initialFormState: FormState = {
  category: "OPS",
  amount: "",
  justification: "",
  leaveType: "Casual",
  startDate: "",
  endDate: "",
  handoffTo: "",
};

export function StaffPortal({ user }: { user?: StaffProfile }) {
  const [requests, setRequests] = useState<PortalRequest[]>([]);
  const [roster, setRoster] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);

  async function loadData() {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [reqRes, dirRes] = await Promise.all([
        fetch("/api/requests"),
        fetch("/api/directory"),
      ]);

      const reqData = await reqRes.json();
      const dirData = await dirRes.json();

      if (reqData.records && Array.isArray(reqData.records)) {
        setRequests(reqData.records);
      }
      if (dirData.staff && Array.isArray(dirData.staff)) {
        setRoster(dirData.staff);
      }
    } catch (err: any) {
      console.error("Data load error:", err);
      setErrorMessage("Could not connect to data repository. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const currentUserEmail = (user?.email || "").trim().toLowerCase();

  const myRequests = useMemo(() => {
    if (!currentUserEmail) return requests;
    return requests.filter(
      (r) => (r.requesterEmail || "").trim().toLowerCase() === currentUserEmail
    );
  }, [requests, currentUserEmail]);

  const handoverColleagues = useMemo(() => {
    const filtered = roster.filter((m) => {
      const email = String(m.email || "").trim().toLowerCase();
      return email !== currentUserEmail;
    });
    return filtered.length > 0 ? filtered : roster;
  }, [roster, currentUserEmail]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSubmitSuccess(null);

    try {
      const payload = {
        ...form,
        requesterName: user?.name || "Staff Member",
        requesterEmail: user?.email || "",
        timestamp: new Date().toISOString(),
      };

      const res = await fetch("/api/requests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || "Submission failed");
      }

      setSubmitSuccess("Your request has been submitted successfully to the review queue.");
      setForm(initialFormState);
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {submitSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-emerald-600" />
            <span>{submitSuccess}</span>
          </div>
          <button onClick={() => setSubmitSuccess(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Leave Quota and Holidays Card */}
      <LeaveQuotaCard staffName={user?.name} />

      {/* Main Form & History Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Request Submission Form */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-slate-900">
              <ClipboardPlus className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold">New Operation Request</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">
                  Request Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as RequestCategory })
                  }
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                >
                  {Object.entries(REQUEST_CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {form.category === "LEAVE" ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500">
                      Leave Type
                    </label>
                    <select
                      value={form.leaveType}
                      onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                      className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Casual">Casual Leave</option>
                      <option value="Annual">Annual Leave</option>
                      <option value="Medical">Medical / Sick Leave</option>
                      <option value="Special">Special Leave</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500">
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500">
                        End Date
                      </label>
                      <input
                        type="date"
                        required
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500">
                      Duty Handover Colleague
                    </label>
                    <select
                      value={form.handoffTo}
                      onChange={(e) => setForm({ ...form, handoffTo: e.target.value })}
                      className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="">Select Colleague...</option>
                      {handoverColleagues.map((colleague) => (
                        <option key={colleague.email} value={colleague.name}>
                          {colleague.name} ({colleague.role || colleague.department || "Staff"})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500">
                    Estimated Amount (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 15000"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">
                  Justification & Details
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide operational context or case reference..."
                  value={form.justification}
                  onChange={(e) => setForm({ ...form, justification: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
              >
                {submitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit for Clearance
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* My Submission History */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900">
                <FileText className="h-5 w-5 text-slate-700" />
                <h2 className="text-lg font-bold">My Activity & Request History</h2>
              </div>
              <button
                onClick={loadData}
                disabled={loading}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Sync
              </button>
            </div>

            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : myRequests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                No requests found. Use the submission form to create your first operation record.
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.map((req, idx) => (
                  <div
                    key={req.id || idx}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700">
                          {req.id || `REQ-${idx + 1}`}
                        </span>
                        <span className="rounded bg-slate-200/60 px-2 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
                          {REQUEST_CATEGORY_LABELS[req.category] || req.category}
                        </span>
                      </div>
                      <StatusBadge status={(req.status || "SUBMITTED") as any} />
                    </div>

                    <p className="mt-2 text-sm text-slate-800">
                      {req.justification || req.description || "Operational request"}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between border-t border-slate-200/50 pt-2 text-xs text-slate-500">
                      <span>{req.timestamp ? new Date(req.timestamp).toLocaleDateString() : "Recent"}</span>
                      {req.amount && (
                        <span className="font-semibold text-slate-900">
                          PKR {parseFloat(String(req.amount).replace(/[^0-9.-]+/g, "") || "0").toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <WorkflowStepper status={(req.status || "SUBMITTED") as any} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
