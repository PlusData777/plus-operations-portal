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
import {
  REQUEST_CATEGORY_LABELS,
  type PortalRequest,
  type RequestCategory,
} from "@/lib/portal-data";
type StaffProfile = {
  name: string;
  email: string;
  department: string;
};

type FormState = {
  category: RequestCategory;
  justification: string;
  leaveType: "Casual" | "Sick" | "Annual" | "Emergency";
  leaveStartDate: string;
  leaveEndDate: string;
  handoverColleagueEmail: string;
  expenseType: "Travel" | "Vendor" | "Office" | "Other";
  amountPkr: string;
  receiptDriveLink: string;
  assetDetails: string;
  requiredByDate: string;
  caseRef: string;
  courtForum: string;
};

const initialForm: FormState = {
  category: "LEAVE",
  justification: "",
  leaveType: "Casual",
  leaveStartDate: "",
  leaveEndDate: "",
  handoverColleagueEmail: "",
  expenseType: "Travel",
  amountPkr: "",
  receiptDriveLink: "",
  assetDetails: "",
  requiredByDate: "",
  caseRef: "",
  courtForum: "",
};

function inclusiveDays(start: string, end: string): number | null {
  if (!start || !end) return null;
  const difference = Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`);
  if (!Number.isFinite(difference) || difference < 0) return null;
  return Math.round(difference / (1000 * 60 * 60 * 24)) + 1;
}

export function StaffPortal({ user }: { user: StaffProfile }) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [roster, setRoster] = useState<RosterMember[]>([]);
  const [requests, setRequests] = useState<PortalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadData() {
    setRefreshing(true);
    try {
      // 1. Fetch Staff Requests
      try {
        const reqRes = await fetch("/api/staff/requests", { cache: "no-store" });
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setRequests(Array.isArray(reqData.requests) ? reqData.requests : []);
        }
      } catch (e) {
        console.warn("Requests load error:", e);
      }

      // 2. Fetch Roster
      const rosterRes = await fetch("/api/roster", { cache: "no-store" });
      if (rosterRes.ok) {
        const rosData = await rosterRes.json();
        const list = Array.isArray(rosData)
          ? rosData
          : rosData.roster || rosData.data || [];
        
        console.log("Roster loaded successfully:", list.length, "members");
        if (Array.isArray(list) && list.length > 0) {
          setRoster(list);
        }
      }
    } catch (err) {
      console.error("Failed to load staff data:", err);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const leaveDays = useMemo(
    () => inclusiveDays(form.leaveStartDate, form.leaveEndDate),
    [form.leaveStartDate, form.leaveEndDate]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSubmitSuccess(null);

    try {
      const payload = {
        ...form,
        staffName: user.name,
        staffEmail: user.email,
        department: user.department,
        leaveDays: leaveDays || 0,
      };

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed. Please check required fields.");
      }

      setSubmitSuccess("Your request was submitted and matrix-routed successfully.");
      setForm(initialForm);
      loadData();
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  // Fallback: If filtering produces an empty list or user is admin, provide all members
  const activeColleagues = useMemo(() => {
    if (!Array.isArray(roster) || roster.length === 0) return [];
    const currentUserEmail = (user?.email || "").trim().toLowerCase();
    
    const filtered = roster.filter((m: any) => {
      const email = String(m.email || "").trim().toLowerCase();
      return email !== currentUserEmail;
    });

    return filtered.length > 0 ? filtered : roster;
  }, [roster, user?.email]);

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-emerald-600" />
            <span>{submitSuccess}</span>
          </div>
          <button onClick={() => setSubmitSuccess(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Submission Form */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <ClipboardPlus className="h-5 w-5 text-indigo-600" />
              New matrix-routed request
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Profile and reviewer routing are enforced automatically.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Request category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(REQUEST_CATEGORY_LABELS) as RequestCategory[]).map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-colors ${
                      form.category === cat
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {REQUEST_CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Leave Fields */}
            {form.category === "LEAVE" && (
              <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Leave type</label>
                  <select
                    value={form.leaveType}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        leaveType: e.target.value as FormState["leaveType"],
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                  >
                    <option value="Casual">Casual</option>
                    <option value="Sick">Sick</option>
                    <option value="Annual">Annual</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Start date</label>
                    <input
                      type="date"
                      value={form.leaveStartDate}
                      onChange={(e) => setForm((prev) => ({ ...prev, leaveStartDate: e.target.value }))}
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">End date</label>
                    <input
                      type="date"
                      value={form.leaveEndDate}
                      onChange={(e) => setForm((prev) => ({ ...prev, leaveEndDate: e.target.value }))}
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                      required
                    />
                  </div>
                </div>

                {leaveDays !== null && (
                  <div className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-2.5 py-1">
                    {leaveDays} {leaveDays === 1 ? "calendar day" : "calendar days"}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Handover colleague
                  </label>
                  <select
                    value={form.handoverColleagueEmail}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, handoverColleagueEmail: e.target.value }))
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                    required
                  >
                    <option value="">Select active colleague ({activeColleagues.length} available)</option>
                    {activeColleagues.map((member: any) => {
                      const displayName =
                        member.name ||
                        member.staffName ||
                        member.fullName ||
                        member.displayName ||
                        (member.email ? member.email.split("@")[0] : "Colleague");
                      const dept = member.department || member.designation || member.role || "";

                      return (
                        <option key={member.email} value={member.email}>
                          {displayName} {dept ? `(${dept})` : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}

            {/* Finance Fields */}
            {form.category === "FINANCE" && (
              <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Expense type</label>
                    <select
                      value={form.expenseType}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          expenseType: e.target.value as FormState["expenseType"],
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800"
                    >
                      <option value="Travel">Travel</option>
                      <option value="Vendor">Vendor</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Amount (PKR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={form.amountPkr}
                      onChange={(e) => setForm((prev) => ({ ...prev, amountPkr: e.target.value }))}
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Receipt Drive Link</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={form.receiptDriveLink}
                    onChange={(e) => setForm((prev) => ({ ...prev, receiptDriveLink: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Procurement Fields */}
            {String(form.category) === "PROCUREMENT" && (
              <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Asset Details</label>
                  <input
                    type="text"
                    placeholder="Asset name / description"
                    value={form.assetDetails}
                    onChange={(e) => setForm((prev) => ({ ...prev, assetDetails: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Required by date</label>
                  <input
                    type="date"
                    value={form.requiredByDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, requiredByDate: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                    required
                  />
                </div>
              </div>
            )}

            {/* Legal Fields */}
            {String(form.category) === "LEGAL" && (
              <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Case reference</label>
                  <input
                    type="text"
                    placeholder="Case title or reference number"
                    value={form.caseRef}
                    onChange={(e) => setForm((prev) => ({ ...prev, caseRef: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Court / Forum</label>
                  <input
                    type="text"
                    placeholder="e.g. High Court / Session Court"
                    value={form.courtForum}
                    onChange={(e) => setForm((prev) => ({ ...prev, courtForum: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Justification and requested action
              </label>
              <textarea
                rows={3}
                placeholder="Provide operational context and required action."
                value={form.justification}
                onChange={(e) => setForm((prev) => ({ ...prev, justification: e.target.value }))}
                className="w-full rounded-md border border-slate-300 bg-white p-2.5 text-xs text-slate-800"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Routing to Matrix...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* Submissions List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" />
              Your submissions
            </h3>
            <button
              onClick={loadData}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
              <ClipboardPlus className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-medium">No requests recorded yet.</p>
              <p className="text-xs text-slate-400">Submit a request using the form on the left.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req, idx) => (
                <div
                  key={req.trackingId || (req as any).rowNumber || idx}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">
                        {(req.category && REQUEST_CATEGORY_LABELS[req.category]) || "Request"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {req.trackingId ? `ID: ${req.trackingId} · ` : ""}
                        {req.category || "General"}
                      </p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  {req.justification && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                      {req.justification}
                    </p>
                  )}

                  <WorkflowStepper request={req} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
