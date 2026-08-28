"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  Copy,
  DollarSign,
  FileText,
  Filter,
  LayoutGrid,
  Mail,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Table as TableIcon,
  User,
  Users,
  X,
} from "lucide-react";

type StaffMember = {
  name: string;
  email: string;
  designation?: string;
  role?: string;
  department?: string;
  lineManager?: string;
  financeApprover?: string;
  tier2Approver?: string;
  responsibilities?: string;
  status?: string;
};

export default function DirectoryPage() {
  const [roster, setRoster] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  async function loadRoster() {
    setLoading(true);
    try {
      const res = await fetch("/api/roster", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.roster || data.data || [];
        setRoster(list);
      }
    } catch (err) {
      console.error("Failed to load directory roster:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoster();
  }, []);

  const departments = useMemo(() => {
    const set = new Set<string>();
    roster.forEach((m) => {
      if (m.department) set.add(m.department);
    });
    return ["ALL", ...Array.from(set)];
  }, [roster]);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return roster.filter((m) => {
      const matchDept = selectedDept === "ALL" || m.department === selectedDept;
      const matchSearch =
        !q ||
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.designation && m.designation.toLowerCase().includes(q)) ||
        (m.department && m.department.toLowerCase().includes(q));
      return matchDept && matchSearch;
    });
  }, [roster, searchQuery, selectedDept]);

  function copyToClipboard(email: string) {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  }

  function getInitials(name: string) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/portal"
                className="flex items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Staff Directory & Governance Matrix
                </h1>
                <p className="text-xs text-slate-500">
                  Contact details, departmental hierarchy, and matrix approval routing.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    viewMode === "cards"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Cards ({filteredMembers.length})
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    viewMode === "table"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <TableIcon className="h-3.5 w-3.5" />
                  Table
                </button>
              </div>

              <button
                onClick={loadRoster}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, role, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "ALL" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-slate-300 mb-3" />
            <p className="text-sm font-medium">Loading organization directory...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-400">
            <User className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="text-base font-semibold text-slate-700">No staff members found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or department filter.
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMembers.map((member) => (
              <div
                key={member.email}
                onClick={() => setSelectedMember(member)}
                className="group relative cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-slate-400 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600 transition">
                        {member.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {member.designation || member.role || "Team Member"}
                      </p>
                    </div>
                  </div>
                  {member.department && (
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
                      {member.department}
                    </span>
                  )}
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="text-[11px] text-slate-500">Reports to:</span>
                    <span className="truncate font-medium text-slate-700">
                      {member.lineManager || "Executive / CEO"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <span>Click for matrix routing</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Line Manager (Tier 1)</th>
                  <th className="px-4 py-3">Finance Approver</th>
                  <th className="px-4 py-3">Tier 2 Sign-Off</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.email}
                    onClick={() => setSelectedMember(member)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{member.name}</div>
                      <div className="text-slate-400 text-[11px]">{member.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{member.department || "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{member.lineManager || "Default Admin"}</td>
                    <td className="px-4 py-3 text-slate-700">{member.financeApprover || "Finance Lead"}</td>
                    <td className="px-4 py-3 text-slate-700">{member.tier2Approver || "CEO / Exec"}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile & Matrix Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-base font-bold text-white">
                  {getInitials(selectedMember.name)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedMember.name}</h2>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    {selectedMember.designation || "Staff Member"} · {selectedMember.department || "General"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Contact Information
              </h4>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-slate-800">{selectedMember.email}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedMember.email)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
                >
                  {copiedEmail === selectedMember.email ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Approval Routing Matrix */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Reporting & Financial Approvals Matrix
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-700 uppercase">
                    <User className="h-3 w-3" />
                    Tier 1 Ops / Leave
                  </div>
                  <div className="font-semibold text-slate-900 mt-1 truncate">
                    {selectedMember.lineManager || "Line Manager"}
                  </div>
                </div>

                <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 uppercase">
                    <DollarSign className="h-3 w-3" />
                    Tier 1 Expense
                  </div>
                  <div className="font-semibold text-slate-900 mt-1 truncate">
                    {selectedMember.financeApprover || "Finance Lead"}
                  </div>
                </div>

                <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-3">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-purple-700 uppercase">
                    <ShieldCheck className="h-3 w-3" />
                    Tier 2 Sign-Off
                  </div>
                  <div className="font-semibold text-slate-900 mt-1 truncate">
                    {selectedMember.tier2Approver || "Executive / CEO"}
                  </div>
                </div>
              </div>
            </div>

            {/* Core Responsibilities */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Core Responsibilities & Operations Notes
              </h4>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 leading-relaxed">
                {selectedMember.responsibilities ||
                  "Standard organizational responsibilities aligned with department scope and designated field objectives."}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMember(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
