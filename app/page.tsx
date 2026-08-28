"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  XCircle,
} from "lucide-react";

interface RequestItem {
  id: string;
  timestamp: string;
  requesterEmail: string;
  requesterName: string;
  requestType: "Leave" | "Expense" | "General";
  leaveCategory?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  amount?: number;
  expenseCategory?: string;
  description: string;
  status: string;
  currentApproverEmail?: string;
  tier1Approved?: boolean;
  tier2Approved?: boolean;
}

interface StaffProfile {
  name: string;
  email: string;
  role: string;
  designation: string;
  department: string;
  accessPin?: string;
}

const OFFICIAL_ROSTER: StaffProfile[] = [
  {
    email: "dataplus.org@gmail.com",
    name: "Atif Ali",
    designation: "Administrator",
    role: "ADMIN",
    department: "IT / Systems",
    accessPin: "9900",
  },
  {
    email: "altafkhoso.adv@gmail.com",
    name: "Altaf Khoso",
    designation: "CEO",
    role: "EXECUTIVE",
    department: "Executive Board",
    accessPin: "9900",
  },
  {
    email: "rizwanapatel.plus@gmail.com",
    name: "Rizwana Patel",
    designation: "Chairperson",
    role: "EXECUTIVE",
    department: "Executive Board",
    accessPin: "9900",
  },
  {
    email: "ishfaque.mojai@gmail.com",
    name: "Ashfaq Ali",
    designation: "HR & Admin Lead",
    role: "HR_ADMIN",
    department: "HR & Operations",
    accessPin: "2026",
  },
  {
    email: "japheth.wilson123@gmail.com",
    name: "Japheth Wilson",
    designation: "Finance Manager",
    role: "FINANCE_MGR",
    department: "Finance",
    accessPin: "2026",
  },
  {
    email: "salmahabibbhutto88@gmail.com",
    name: "Salma Habib Bhutto",
    designation: "Program Manager",
    role: "PROGRAM_MGR",
    department: "Programs",
    accessPin: "2026",
  },
  {
    email: "kamanger110@gmail.com",
    name: "Kamanger",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    accessPin: "2026",
  },
  {
    email: "faizthecoach@gmail.com",
    name: "Faiz",
    designation: "Field Coordinator",
    role: "GENERAL_STAFF",
    department: "Field Ops",
    accessPin: "2026",
  },
  {
    email: "advazizullahazizullah@gmail.com",
    name: "Adv Azizullah",
    designation: "Legal Associate",
    role: "LEGAL_STAFF",
    department: "Legal Aid",
    accessPin: "2026",
  },
  {
    email: "saifrehman.kaloi@gmail.com",
    name: "Saif Rehman",
    designation: "Field Coordinator",
    role: "GENERAL_STAFF",
    department: "Field Ops",
    accessPin: "2026",
  },
  {
    email: "salaudinlarik1@gmail.com",
    name: "Salaudin Larik",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    accessPin: "2026",
  },
  {
    email: "imrankhanchang555@gmail.com",
    name: "Imran Khan Chang",
    designation: "IT / Program Support",
    role: "GENERAL_STAFF",
    department: "Programs",
    accessPin: "2026",
  },
  {
    email: "imranalimallah128@gmail.com",
    name: "Imran Ali",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    accessPin: "2026",
  },
  {
    email: "sadiqimransoomro@gmail.com",
    name: "Imran Sadiq",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    accessPin: "2026",
  },
  {
    email: "sajjadkhoso0011@gmail.com",
    name: "Sajjad Khoso",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    accessPin: "2026",
  },
  {
    email: "safiart998@gmail.com",
    name: "Safiullah (TukTuk Art)",
    designation: "Media Support",
    role: "GENERAL_STAFF",
    department: "Communications",
    accessPin: "2026",
  },
  {
    email: "waseelaqasim60@gmail.com",
    name: "Waseela Qasim",
    designation: "Associate",
    role: "GENERAL_STAFF",
    department: "Programs",
    accessPin: "2026",
  },
  {
    email: "muskandinochanna@gmail.com",
    name: "Muskan Channa",
    designation: "Associate",
    role: "GENERAL_STAFF",
    department: "Programs",
    accessPin: "2026",
  },
  {
    email: "aneesabro98@gmail.com",
    name: "Anees Ahmed",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    accessPin: "2026",
  },
  {
    email: "aakashali414@gmail.com",
    name: "Aakash Bhurgri",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    accessPin: "2026",
  },
  {
    email: "kashee742@gmail.com",
    name: "Kashif",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    accessPin: "2026",
  },
  {
    email: "arkkaloi1@gmail.com",
    name: "A.R. Kaloi",
    designation: "Team Member",
    role: "GENERAL_STAFF",
    department: "Operations",
    accessPin: "2026",
  },
];

const OFFICIAL_LOGO_URL =
  "https://grassrootsjusticenetwork.org/wp-content/uploads/2023/12/PLUS-logo-1-768x593.png";

export default function WorkspacePage() {
  const [currentUser, setCurrentUser] = useState<StaffProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // Auth Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // App State
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "LEAVE" | "EXPENSE">("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Load verified session
  useEffect(() => {
    try {
      const stored = localStorage.getItem("plus_user");
      if (stored) {
        const u = JSON.parse(stored);
        const email = (u.email || "").toLowerCase().trim();
        const matched = OFFICIAL_ROSTER.find(
          (s) => s.email.toLowerCase().trim() === email
        );

        if (matched) {
          setCurrentUser(matched);
        } else {
          localStorage.removeItem("plus_user");
        }
      }
    } catch (e) {
      console.warn("Session check failed:", e);
      localStorage.removeItem("plus_user");
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    const emailClean = loginEmail.toLowerCase().trim();
    const pinClean = loginPin.trim();

    if (!emailClean || !pinClean) {
      setAuthError("Both email and security PIN are required.");
      setIsAuthenticating(false);
      return;
    }

    const matchedStaff = OFFICIAL_ROSTER.find(
      (s) => s.email.toLowerCase().trim() === emailClean
    );

    if (!matchedStaff) {
      setAuthError("Email address is not registered in the PLUS Roster.");
      setIsAuthenticating(false);
      return;
    }

    // PIN Authentication Check (Specific PIN, Global Staff PIN 2026, or Master 9900)
    const validPin = matchedStaff.accessPin || "2026";
    if (pinClean !== validPin && pinClean !== "9900" && pinClean !== "2026") {
      setAuthError("Invalid Security PIN. Please contact System Administrator.");
      setIsAuthenticating(false);
      return;
    }

    // Success: Store Session & Authorize
    localStorage.setItem("plus_user", JSON.stringify(matchedStaff));
    setCurrentUser(matchedStaff);
    setLoginEmail("");
    setLoginPin("");
    setIsAuthenticating(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("plus_user");
    sessionStorage.clear();
    setCurrentUser(null);
    setLoginEmail("");
    setLoginPin("");
    setAuthError("");
  };

  // Determine true administrative privileges
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

  async function fetchLiveRequests() {
    setLoading(true);
    try {
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        if (data.requests && Array.isArray(data.requests)) {
          setRequests(data.requests);
        }
      }
    } catch (e) {
      console.warn("Error loading requests:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchLiveRequests();
    }
  }, [currentUser]);

  const handleAction = async (requestId: string, action: "APPROVE" | "REJECT") => {
    if (!currentUser) return;
    setProcessingId(requestId);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_STATUS",
          requestId,
          status: action === "APPROVE" ? "Approved" : "Rejected",
          reviewerEmail: currentUser.email,
        }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId
              ? { ...r, status: action === "APPROVE" ? "Approved" : "Rejected" }
              : r
          )
        );
      }
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const stats = useMemo(() => {
    if (!currentUser) {
      return { totalCount: 0, pendingCount: 0, approvedPkrVolume: 0, actionList: [] };
    }

    const totalCount = requests.length;
    const pendingCount = requests.filter(
      (r) =>
        r.status &&
        (r.status.toLowerCase().includes("pending") ||
          r.status.toLowerCase().includes("review") ||
          r.status.toLowerCase().includes("submitted"))
    ).length;

    const approvedPkrVolume = requests
      .filter((r) => {
        const st = (r.status || "").toLowerCase();
        return st.includes("approved") && Number(r.amount) > 0;
      })
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const actionList = requests.filter((r) => {
      const pendingTo = (r.currentApproverEmail || "").toLowerCase().trim();
      const myEmail = currentUser.email.toLowerCase().trim();
      const st = (r.status || "").toLowerCase();
      const isPending = !st.includes("approved") && !st.includes("rejected");
      return (isAdminOrExec || pendingTo === myEmail) && isPending;
    });

    return {
      totalCount,
      pendingCount,
      approvedPkrVolume,
      actionList,
    };
  }, [requests, currentUser, isAdminOrExec]);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        req.requesterName?.toLowerCase().includes(q) ||
        req.requesterEmail?.toLowerCase().includes(q) ||
        req.description?.toLowerCase().includes(q) ||
        req.id?.toLowerCase().includes(q);

      const type = (req.requestType || "").toLowerCase();
      const desc = (req.description || "").toLowerCase();
      const isLeave = type.includes("leave") || desc.includes("leave");
      const isExpense = type.includes("expense") || Number(req.amount) > 0;

      if (activeTab === "LEAVE") {
        return matchesSearch && isLeave;
      }
      if (activeTab === "EXPENSE") {
        return matchesSearch && isExpense;
      }
      return matchesSearch;
    });
  }, [requests, searchQuery, activeTab]);

  if (isAuthChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <img src={OFFICIAL_LOGO_URL} alt="PLUS Logo" className="h-16 w-auto animate-pulse" />
          <p className="text-xs font-bold text-[#1b365d]">Verifying Security Credentials...</p>
        </div>
      </div>
    );
  }

  // Strictly Enforced Login Screen
  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-[#f8fafc] text-slate-900">
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center rounded-2xl bg-[#1b365d] p-3 shadow-md">
                <img src={OFFICIAL_LOGO_URL} alt="PLUS Logo" className="h-14 w-auto object-contain" />
              </div>
              <h2 className="mt-4 text-xl font-bold tracking-tight text-[#1b365d]">
                Pakistan Legal United Society
              </h2>
              <p className="text-xs font-bold text-[#c65a28] font-serif">انصاف سب کا حق ہے</p>
              <p className="mt-1 text-xs text-slate-500">
                Authorized Personnel Authentication Gate
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="mt-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Registered Staff Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Security Access PIN
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter assigned PIN"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {authError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b365d] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#122440] disabled:opacity-50 cursor-pointer"
              >
                <LogIn className="h-4 w-4 text-[#fad207]" />
                <span>{isAuthenticating ? "Verifying..." : "Verify & Access Workspace"}</span>
              </button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-4 text-center">
              <span className="text-[11px] text-slate-400">
                Staff PIN default: <code className="font-mono text-slate-600">2026</code> · Admin Key: <code className="font-mono text-slate-600">9900</code>
              </span>
            </div>
          </div>
        </div>

        <footer className="border-t border-slate-200 bg-[#1b365d] py-4 text-center text-[11px] text-slate-300">
          Pakistan Legal United Society · Operational & Approval System
        </footer>
      </div>
    );
  }

  // Render Secure Dashboard
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center rounded-xl bg-[#1b365d] p-1.5 shadow-xs">
              <img
                src={OFFICIAL_LOGO_URL}
                alt="Pakistan Legal United Society Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-[#1b365d] sm:text-base">
                  Pakistan Legal United Society
                </h1>
                <span className="rounded-md bg-[#1b365d]/10 px-2 py-0.5 text-[10px] font-bold text-[#1b365d]">
                  PLUS OPS
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Operations, Governance & Multi-Tier Approval Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <div className="text-xs font-bold text-[#1b365d]">{currentUser.name}</div>
              <div className="text-[11px] font-mono text-slate-500">{currentUser.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-red-50 hover:border-red-200 hover:text-[#b82626] cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
              <span className="block px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Secure Workspace
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("ALL")}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer ${
                    activeTab === "ALL"
                      ? "bg-[#1b365d] text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 text-[#fad207]" />
                  <span>All Operations Requests</span>
                </button>

                <Link
                  href="/directory"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Users className="h-4 w-4 text-[#c65a28]" />
                  <span>Staff Directory</span>
                </Link>

                <Link
                  href="/timesheets"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Clock className="h-4 w-4 text-[#e59a24]" />
                  <span>Staff Timesheets</span>
                </Link>

                {/* Quick Filters */}
                <div className="border-t border-slate-100 my-2 pt-2">
                  <span className="block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Filters
                  </span>
                  <button
                    onClick={() => setActiveTab("LEAVE")}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold transition text-left cursor-pointer ${
                      activeTab === "LEAVE"
                        ? "bg-[#1b365d] text-white font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5 text-[#fad207]" />
                    <span>Leave Applications</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("EXPENSE")}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold transition text-left cursor-pointer ${
                      activeTab === "EXPENSE"
                        ? "bg-[#1b365d] text-white font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-[#c65a28]" />
                    <span>Expense Claims</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Leave Balance Overview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#c65a28]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    My Leave Balance
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#1b365d]">FY 2026</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Casual</span>
                  <p className="text-base font-bold text-[#1b365d]">
                    5<span className="text-[10px] text-slate-400 font-normal">/5</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Annual</span>
                  <p className="text-base font-bold text-[#1b365d]">
                    5<span className="text-[10px] text-slate-400 font-normal">/5</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Sick</span>
                  <p className="text-base font-bold text-[#1b365d]">
                    2<span className="text-[10px] text-slate-400 font-normal">/2</span>
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Workspace Main Stream */}
          <div className="lg:col-span-9 space-y-6">
            {/* Executive & Admin Action Required Desk */}
            <div className="rounded-2xl border border-[#fad207]/60 bg-[#fad207]/15 p-5 shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-[#fad207] p-2 text-[#1b365d] shrink-0 mt-0.5 shadow-xs">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1b365d]">
                      Action Required by You ({stats.actionList.length})
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {stats.actionList.length > 0
                        ? `You have pending authorization authority over ${stats.actionList.length} request(s).`
                        : "No approvals are currently awaiting your action."}
                    </p>
                  </div>
                </div>

                {isAdminOrExec && (
                  <span className="rounded-full bg-[#1b365d] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#fad207]">
                    Executive Privileges
                  </span>
                )}
              </div>

              {/* Actionable Request Items */}
              {stats.actionList.length > 0 && (
                <div className="mt-4 space-y-2.5 pt-3 border-t border-[#fad207]/40">
                  {stats.actionList.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-white p-3.5 shadow-2xs border border-slate-200"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#1b365d]">
                            {item.id}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {item.requesterName}
                          </span>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                            {item.requestType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleAction(item.id, "REJECT")}
                          disabled={processingId === item.id}
                          className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-[#b82626] hover:bg-red-100 cursor-pointer disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "APPROVE")}
                          disabled={processingId === item.id}
                          className="inline-flex items-center gap-1 rounded-xl bg-[#1b365d] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#122440] shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#fad207]" />
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Role View Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#c65a28]">
                  {currentUser.role} WORKSPACE · {currentUser.department}
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-[#1b365d]">
                  {activeTab === "LEAVE"
                    ? "Leave Applications."
                    : activeTab === "EXPENSE"
                    ? "Expense Claims."
                    : "All Operations Requests."}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reviewing operational roster activities and verified sheet records.
                </p>
              </div>

              <button
                onClick={fetchLiveRequests}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Sync Requests</span>
              </button>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Queue Total</span>
                  <FileText className="h-4 w-4 text-[#1b365d]" />
                </div>
                <p className="mt-2 text-2xl font-bold text-[#1b365d]">{stats.totalCount}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
                  <Clock className="h-4 w-4 text-[#e59a24]" />
                </div>
                <p className="mt-2 text-2xl font-bold text-[#e59a24]">{stats.pendingCount}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Approved PKR</span>
                  <CheckCircle2 className="h-4 w-4 text-[#1b365d]" />
                </div>
                <p className="mt-2 text-xl font-bold text-[#1b365d]">
                  Rs {stats.approvedPkrVolume.toLocaleString("en-PK")}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-bold uppercase tracking-wider">&gt;48h Warnings</span>
                  <ShieldAlert className="h-4 w-4 text-[#b82626]" />
                </div>
                <p className="mt-2 text-2xl font-bold text-[#b82626]">0</p>
              </div>
            </div>

            {/* Search and Request Feed */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search requests by staff name, ID, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Loading verified records from sheet...
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-xs text-slate-500">
                  No active operations requests found matching your filter criteria.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRequests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4 transition hover:border-[#1b365d]/40 hover:bg-white hover:shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-[#1b365d]">
                              {req.id}
                            </span>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                req.requestType === "Expense"
                                  ? "bg-[#e59a24]/15 text-[#c65a28]"
                                  : "bg-[#1b365d]/10 text-[#1b365d]"
                              }`}
                            >
                              {req.requestType}
                            </span>
                          </div>
                          <h4 className="mt-1 text-xs font-bold text-slate-900">
                            {req.requesterName} ({req.requesterEmail})
                          </h4>
                          <p className="mt-1 text-xs text-slate-600">{req.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          {req.amount && Number(req.amount) > 0 ? (
                            <span className="text-sm font-bold text-[#1b365d]">
                              PKR {Number(req.amount).toLocaleString("en-PK")}
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-[#1b365d]">
                              {req.days || 1} Day(s) Leave
                            </span>
                          )}
                          <div className="mt-1">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                (req.status || "").toLowerCase().includes("approved")
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : (req.status || "").toLowerCase().includes("rejected")
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {req.status || "Submitted"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Branded Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-[#1b365d] text-white">
        <div className="border-b border-white/10 bg-[#122440] py-4 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#fad207]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Pakistan Legal United Society · Operations & Legal Aid Hub
              </span>
            </div>
            <div>
              <span className="rounded-lg bg-[#c65a28] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Field Operations Active
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="space-y-4 md:col-span-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#1b365d] p-1.5 border border-white/10 shadow-md inline-block">
                  <img
                    src={OFFICIAL_LOGO_URL}
                    alt="Pakistan Legal United Society Logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white">
                    Pakistan Legal United Society
                  </h3>
                  <p className="text-[12px] font-bold text-[#fad207]">
                    انصاف سب کا حق ہے
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Committed to human rights protection, public interest legal aid, and operational transparency across Sindh and Pakistan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:col-span-8">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#fad207] mb-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Head Office (Karachi)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Plot 213, St 4, New Bakhtawar Goth, Block-09, Gulistan-e-Johar
                </p>
                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-mono text-slate-200">
                  <Phone className="h-3 w-3 text-[#fad207]" />
                  <span>021-34011698</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#fad207] mb-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Regional (Hyderabad)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  House B/7 Ground Floor, Street 1, Sunny Bungalows, Qasimabad
                </p>
                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-mono text-slate-200">
                  <Phone className="h-3 w-3 text-[#fad207]" />
                  <span>022-6112571</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#fad207] mb-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Regional (Sukkur)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Women Development Complex, near SRSO, Shikarpur Rd
                </p>
                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-mono text-slate-200">
                  <Phone className="h-3 w-3 text-[#fad207]" />
                  <span>071-5824119</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
            <span>PLUS Governance & Operations Management System</span>
            <span className="font-mono text-[#fad207]">dataplus.org@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
