"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Check,
  Copy,
  Filter,
  GitFork,
  Loader2,
  Mail,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
  X,
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

function StaffDrawer({
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
              <>
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
              <div className="space-y-4 animate-in fade-in">
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

          {/* Footer */}
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

const FALLBACK_STAFF: StaffMember[] = [
  {
    email: "dataplus.org@gmail.com",
    name: "Atif Ali",
    designation: "Administrator",
    role: "ADMIN",
    department: "IT / Systems",
    status: "Active",
    tier1Manager: "ishfaque.mojai@gmail.com",
    tier1ExpenseApprover: "japheth.wilson123@gmail.com",
    tier2Approver: "altafkhoso.adv@gmail.com",
  },
  {
    email: "altafkhoso.adv@gmail.com",
    name: "Altaf Khoso",
    designation: "CEO",
    role: "EXECUTIVE",
    department: "Executive Board",
    status: "Active",
  },
  {
    email: "rizwanapatel.plus@gmail.com",
    name: "Rizwana Patel",
    designation: "Chairperson",
    role: "EXECUTIVE",
    department: "Executive Board",
    status: "Active",
  },
  {
    email: "ishfaque.mojai@gmail.com",
    name: "Ashfaq Ali",
    designation: "HR & Admin Lead",
    role: "HR_ADMIN",
    department: "HR & Operations",
    status: "Active",
  },
  {
    email: "salmahabibbhutto88@gmail.com",
    name: "Salma Habib Bhutto",
    designation: "Program Manager",
    role: "PROGRAM_MGR",
    department: "Programs",
    status: "Active",
  },
  {
    email: "japheth.wilson123@gmail.com",
    name: "Japheth Wilson",
    designation: "Finance Manager",
    role: "FINANCE_MGR",
    department: "Finance",
    status: "Active",
  },
  {
    email: "salaudinlarik1@gmail.com",
    name: "Salaudin Larik",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    status: "Active",
  },
  {
    email: "imrankhanchang555@gmail.com",
    name: "Imran Khan Chang",
    designation: "IT / Program Support",
    role: "GENERAL_STAFF",
    department: "Programs",
    status: "Active",
  },
  {
    email: "imranalimallah128@gmail.com",
    name: "Imran Ali",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    status: "Active",
  },
  {
    email: "sadiqimransoomro@gmail.com",
    name: "Imran Sadiq",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    status: "Active",
  },
  {
    email: "faizthecoach@gmail.com",
    name: "Faiz",
    designation: "Field Coordinator",
    role: "GENERAL_STAFF",
    department: "Field Ops",
    status: "Active",
  },
  {
    email: "sajjadkhoso0011@gmail.com",
    name: "Sajjad Khoso",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    status: "Active",
  },
  {
    email: "safiart998@gmail.com",
    name: "Safiullah (TukTuk Art)",
    designation: "Media / Design Support",
    role: "GENERAL_STAFF",
    department: "Communications",
    status: "Active",
  },
  {
    email: "waseelaqasim60@gmail.com",
    name: "Waseela Qasim",
    designation: "Associate",
    role: "GENERAL_STAFF",
    department: "Programs",
    status: "Active",
  },
  {
    email: "muskandinochanna@gmail.com",
    name: "Muskan Channa",
    designation: "Associate",
    role: "GENERAL_STAFF",
    department: "Programs",
    status: "Active",
  },
  {
    email: "kamanger110@gmail.com",
    name: "Kamanger",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    status: "Active",
  },
  {
    email: "aneesabro98@gmail.com",
    name: "Anees Ahmed",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    status: "Active",
  },
  {
    email: "aakashali414@gmail.com",
    name: "Aakash Bhurgri",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    status: "Active",
  },
  {
    email: "advazizullahazizullah@gmail.com",
    name: "Adv Azizullah",
    designation: "Legal Associate",
    role: "LEGAL_STAFF",
    department: "Legal Aid",
    status: "Active",
  },
  {
    email: "saifrehman.kaloi@gmail.com",
    name: "Saif Rehman",
    designation: "Field Coordinator",
    role: "GENERAL_STAFF",
    department: "Field Ops",
    status: "Active",
  },
  {
    email: "kashee742@gmail.com",
    name: "Kashif",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    status: "Active",
  },
  {
    email: "arkkaloi1@gmail.com",
    name: "A.R. Kaloi",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    status: "Active",
  },
];

export default function StaffDirectoryPage() {
  const [staff, setStaff] = useState<StaffMember[]>(FALLBACK_STAFF);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [canEditGovernance, setCanEditGovernance] = useState(false);

  // Check user permissions safely on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("plus_user");
      if (stored) {
        const sessionUser = JSON.parse(stored);
        const email = (sessionUser.email || "").toLowerCase().trim();
        const role = (sessionUser.role || "").toUpperCase();

        const allowedEmails = [
          "dataplus.org@gmail.com",
          "altafkhoso.adv@gmail.com",
          "rizwanapatel.plus@gmail.com",
        ];

        if (role === "ADMIN" || role === "EXECUTIVE" || allowedEmails.includes(email)) {
          setCanEditGovernance(true);
        }
      }
    } catch (e) {
      console.warn("Could not check user permissions:", e);
    }
  }, []);

  async function loadDirectory() {
    setLoading(true);
    try {
      const res = await fetch("/api/directory");
      if (res.ok) {
        const data = await res.json();
        if (data.staff && Array.isArray(data.staff) && data.staff.length > 0) {
          setStaff(data.staff);
        }
      }
    } catch (e) {
      console.warn("Using fallback staff directory data:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDirectory();
  }, []);

  const departments = useMemo(() => {
    const set = new Set<string>();
    staff.forEach((s) => {
      if (s.department) set.add(s.department);
    });
    return ["ALL", ...Array.from(set)];
  }, [staff]);

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesDept =
        selectedDept === "ALL" || member.department === selectedDept;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        member.name?.toLowerCase().includes(q) ||
        member.email?.toLowerCase().includes(q) ||
        member.designation?.toLowerCase().includes(q) ||
        member.department?.toLowerCase().includes(q);

      return matchesDept && matchesSearch;
    });
  }, [staff, selectedDept, searchQuery]);

  const handleOpenDrawer = (member: StaffMember) => {
    setSelectedStaff(member);
    setIsDrawerOpen(true);
  };

  const handleSaveStaff = (updated: StaffMember) => {
    setStaff((prev) =>
      prev.map((s) => (s.email === updated.email ? updated : s))
    );
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">
              Staff & Governance Directory
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Pakistan Legal United Society · Operational Roster & Approval Tiers
          </p>
        </div>

        <button
          onClick={loadDirectory}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Sync Directory
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by staff name, email, or designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-emerald-600 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-emerald-600 focus:outline-hidden"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "ALL" ? "All Departments" : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No personnel records matched your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((member) => (
            <div
              key={member.email}
              onClick={() => handleOpenDrawer(member)}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-emerald-500 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-500">{member.designation}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    (member.status || "Active") === "Active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <UserCheck className="h-2.5 w-2.5" />
                  {member.status || "Active"}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.department}</span>
                </div>
                <div className="flex items-center gap-2 truncate font-mono text-[11px] text-slate-500">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-emerald-600 group-hover:text-emerald-700">
                <span>View Routing & Profile</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-out Governance Drawer with Strict Role Restriction */}
      <StaffDrawer
        staff={selectedStaff}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isAdmin={canEditGovernance}
        allStaff={staff}
        onSave={handleSaveStaff}
      />
    </div>
  );
}
