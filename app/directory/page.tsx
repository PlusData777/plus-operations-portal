"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Filter,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { StaffDrawer, type StaffMember } from "@/components/staff-drawer";

// Default fallback list of PLUS team members
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

  // Load latest directory from API
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
      {/* Page Header */}
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

      {/* Filters and Search Bar */}
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

      {/* Staff Grid */}
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

      {/* Slide-out Governance Drawer */}
      <StaffDrawer
        staff={selectedStaff}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isAdmin={true}
        allStaff={staff}
        onSave={handleSaveStaff}
      />
    </div>
  );
}
