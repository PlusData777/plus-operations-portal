"use client";

import { useState } from "react";
import {
  X,
  Mail,
  ShieldCheck,
  UserCheck,
  UserX,
  Layers,
  Save,
  Loader2,
  Copy,
  Check,
  Building2,
  Briefcase,
  GitFork,
} from "lucide-react";

export interface StaffMember {
  email: string;
  name: string;
  designation: string;
  role: string;
  department: string;
  status?: "Active" | "Deactivated";
  tier1Manager?: string;
  tier1ExpenseApprover?: string;
  tier2Approver?: string;
  responsibilities?: string;
}

interface StaffDrawerProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  allStaff?: StaffMember[];
  onSave?: (updated: StaffMember) => Promise<void> | void;
}

export function StaffDrawer({
  staff,
  isOpen,
  onClose,
  isAdmin = false,
  allStaff = [],
  onSave,
}: StaffDrawerProps) {
  if (!isOpen || !staff) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState<StaffMember>({
    ...staff,
    status: staff.status || "Active",
    tier1Manager: staff.tier1Manager || "ishfaque.mojai@gmail.com",
    tier1ExpenseApprover: staff.tier1ExpenseApprover || "japheth.wilson123@gmail.com",
    tier2Approver: staff.tier2Approver || "altafkhoso.adv@gmail.com",
    responsibilities:
      staff.responsibilities ||
      "Responsible for departmental deliverables, casework tracking, and administrative compliance under the PLUS operational mandate.",
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(formData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update staff record:", error);
    } finally {
      setSaving(false);
    }
  };

  const activeStaff = allStaff.length > 0 ? allStaff : [formData];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    formData.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {formData.status === "Active" ? (
                    <UserCheck className="h-3 w-3" />
                  ) : (
                    <UserX className="h-3 w-3" />
                  )}
                  {formData.status}
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">
                  {formData.role}
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-slate-900">{formData.name}</h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <span>{formData.designation}</span>
                <span>•</span>
                <span className="font-medium text-slate-700">{formData.department}</span>
              </div>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Contact Details */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact & Identification
              </label>
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-2.5 truncate">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-mono text-slate-700 truncate">
                    {formData.email}
                  </span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 ml-2 shrink-0"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {!isEditing ? (
              /* View Mode */
              <>
                {/* Governance & Routing Summary */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <GitFork className="h-4 w-4 text-slate-600" />
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Approval & Governance Matrix
                    </label>
                  </div>
                  <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Tier 1 · Line Manager (Ops & Leave)
                      </span>
                      <p className="text-xs font-medium text-slate-800 font-mono">
                        {formData.tier1Manager}
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Tier 1 · Expense & Financial Reviewer
                      </span>
                      <p className="text-xs font-medium text-slate-800 font-mono">
                        {formData.tier1ExpenseApprover}
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Tier 2 · Executive Sign-Off
                      </span>
                      <p className="text-xs font-medium text-slate-800 font-mono">
                        {formData.tier2Approver}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mandate & Operational Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Operational Responsibilities
                  </label>
                  <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    {formData.responsibilities}
                  </p>
                </div>
              </>
            ) : (
              /* Admin Edit Mode */
              <div className="space-y-4 animate-in fade-in">
                {/* Status Toggle */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Operational Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Active" | "Deactivated",
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="Active">Active</option>
                    <option value="Deactivated">Deactivated</option>
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                {/* Tier 1 Manager */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Tier 1 · Line Manager
                  </label>
                  <select
                    value={formData.tier1Manager}
                    onChange={(e) =>
                      setFormData({ ...formData, tier1Manager: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-emerald-600 focus:outline-hidden font-mono"
                  >
                    {activeStaff.map((s) => (
                      <option key={s.email} value={s.email}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tier 1 Finance */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Tier 1 · Expense Approver
                  </label>
                  <select
                    value={formData.tier1ExpenseApprover}
                    onChange={(e) =>
                      setFormData({ ...formData, tier1ExpenseApprover: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-emerald-600 focus:outline-hidden font-mono"
                  >
                    {activeStaff.map((s) => (
                      <option key={s.email} value={s.email}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tier 2 Sign-off */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Tier 2 · Final Approver
                  </label>
                  <select
                    value={formData.tier2Approver}
                    onChange={(e) =>
                      setFormData({ ...formData, tier2Approver: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:border-emerald-600 focus:outline-hidden font-mono"
                  >
                    {activeStaff.map((s) => (
                      <option key={s.email} value={s.email}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="border-t border-slate-100 p-6 bg-slate-50/50">
            {!isEditing ? (
              isAdmin ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Edit Staff Governance
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              )
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
