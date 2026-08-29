/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Plus,
  PlusCircle,
  Scale,
  Search,
  Send,
  UserCheck,
  Users,
  X,
  Banknote,
  Wallet,
  ShieldCheck,
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
  attachmentUrl?: string;
}

interface AssignedTask {
  id: string;
  title: string;
  category: string;
  dueDateOrHearing: string;
  venue: string;
  hub: "Karachi" | "Hyderabad" | "Sukkur";
  status: "Pending Action" | "In Progress" | "Completed";
  urgency: "Urgent" | "Standard";
  assigneeEmail: string;
  assigneeName: string;
  assignedByEmail: string;
  assignedByName: string;
  attachmentUrl?: string;
}

interface StaffProfile {
  name: string;
  email: string;
  role: "ADMIN" | "EXECUTIVE" | "HR_ADMIN" | "FINANCE_MGR" | "PROGRAM_MGR" | "LEGAL_STAFF" | "GENERAL_STAFF";
  designation: string;
  department: string;
  accessPin: string;
}

const OFFICIAL_ROSTER: StaffProfile[] = [
  { email: "dataplus.org@gmail.com", name: "Aatif", designation: "Administrator", role: "ADMIN", department: "IT / Systems", accessPin: "9901" },
  { email: "altafkhoso.adv@gmail.com", name: "Altaf Khoso", designation: "CEO", role: "EXECUTIVE", department: "Executive Board", accessPin: "8821" },
  { email: "rizwanapatel.plus@gmail.com", name: "Rizwana Patel", designation: "Chairperson", role: "EXECUTIVE", department: "Executive Board", accessPin: "7732" },
  { email: "ishfaque.mojai@gmail.com", name: "Ashfaq Ali", designation: "HR & Admin Lead", role: "HR_ADMIN", department: "HR & Operations", accessPin: "4412" },
  { email: "japheth.wilson123@gmail.com", name: "Japheth Wilson", designation: "Finance Manager", role: "FINANCE_MGR", department: "Finance", accessPin: "5523" },
  { email: "kamanger110@gmail.com", name: "Kamanger", designation: "Program Manager", role: "PROGRAM_MGR", department: "Programs & Operations", accessPin: "3184" },
  { email: "salmahabibbhutto88@gmail.com", name: "Salma Habib Bhutto", designation: "Program Manager", role: "PROGRAM_MGR", department: "Programs", accessPin: "6634" },
  { email: "advazizullahazizullah@gmail.com", name: "Adv Azizullah", designation: "Legal Associate", role: "LEGAL_STAFF", department: "Legal Aid", accessPin: "2945" },
  { email: "faizthecoach@gmail.com", name: "Faiz", designation: "Field Coordinator", role: "GENERAL_STAFF", department: "Field Ops", accessPin: "5820" },
  { email: "saifrehman.kaloi@gmail.com", name: "Saif Rehman", designation: "Field Coordinator", role: "GENERAL_STAFF", department: "Field Ops", accessPin: "4719" },
  { email: "salaudinlarik1@gmail.com", name: "Salaudin Larik", designation: "Team Member", role: "GENERAL_STAFF", department: "Operations", accessPin: "6291" },
  { email: "imrankhanchang555@gmail.com", name: "Imran Khan Chang", designation: "IT / Program Support", role: "GENERAL_STAFF", department: "Programs", accessPin: "7382" },
  { email: "waseelaqasim60@gmail.com", name: "Waseela Qasim", designation: "Program Associate", role: "GENERAL_STAFF", department: "Programs", accessPin: "3837" },
  { email: "muskandinochanna@gmail.com", name: "Muskan Channa", designation: "Program Associate", role: "GENERAL_STAFF", department: "Programs", accessPin: "4928" },
  { email: "kashee742@gmail.com", name: "Kashif", designation: "Operations Associate", role: "GENERAL_STAFF", department: "Operations", accessPin: "7231" },
  { email: "arkkaloi1@gmail.com", name: "A.R. Kaloi", designation: "Operations Associate", role: "GENERAL_STAFF", department: "Operations", accessPin: "8342" },
];

const INITIAL_PORTFOLIO_TASKS: AssignedTask[] = [
  {
    id: "TSK-801",
    title: "Setup Community Legal Clinic & Distribute Rights Booklets",
    category: "Community Legal Camp",
    dueDateOrHearing: "2026-09-03",
    venue: "UC Sunny Bungalows, Qasimabad",
    hub: "Hyderabad",
    status: "In Progress",
    urgency: "Urgent",
    assigneeEmail: "kamanger110@gmail.com",
    assigneeName: "Kamanger",
    assignedByEmail: "altafkhoso.adv@gmail.com",
    assignedByName: "Altaf Khoso",
  },
  {
    id: "TSK-802",
    title: "Inspect NAVTTC Solar PV & CIT Inmate Training Labs",
    category: "Prison Unit (NAVTTC)",
    dueDateOrHearing: "2026-09-05",
    venue: "Central Prison & Correctional Facility, Sukkur",
    hub: "Sukkur",
    status: "Pending Action",
    urgency: "Standard",
    assigneeEmail: "kamanger110@gmail.com",
    assigneeName: "Kamanger",
    assignedByEmail: "altafkhoso.adv@gmail.com",
    assignedByName: "Altaf Khoso",
  },
  {
    id: "TSK-803",
    title: "Bail Petition Arguments & Case Diary Submission",
    category: "Legal Casework / Court",
    dueDateOrHearing: "2026-09-02",
    venue: "Sessions Court, Sukkur",
    hub: "Sukkur",
    status: "In Progress",
    urgency: "Urgent",
    assigneeEmail: "advazizullahazizullah@gmail.com",
    assigneeName: "Adv Azizullah",
    assignedByEmail: "altafkhoso.adv@gmail.com",
    assignedByName: "Altaf Khoso",
  },
  {
    id: "TSK-804",
    title: "Institutional Quarterly Partner Review & MoU Compliance",
    category: "Operational / Admin Task",
    dueDateOrHearing: "2026-09-10",
    venue: "Head Office Karachi / All Hubs",
    hub: "Karachi",
    status: "In Progress",
    urgency: "Standard",
    assigneeEmail: "ALL",
    assigneeName: "All Staff / Combined Team",
    assignedByEmail: "dataplus.org@gmail.com",
    assignedByName: "Aatif",
  },
];

const OFFICIAL_LOGO_URL =
  "https://grassrootsjusticenetwork.org/wp-content/uploads/2023/12/PLUS-logo-1-768x593.png";

export default function WorkspacePage() {
  const [currentUser, setCurrentUser] = useState<StaffProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Authentication State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // App State
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [tasks, setTasks] = useState<AssignedTask[]>(INITIAL_PORTFOLIO_TASKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainViewTab, setMainViewTab] = useState<"MY_TASKS" | "REQUESTs">("MY_TASKS");
  const [activeRequestFilter, setActiveRequestFilter] = useState<"ALL" | "LEAVE" | "EXPENSE">("ALL");

  // Request Form Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [formType, setFormType] = useState<"Leave" | "Expense">("Leave");
  const [formLeaveCategory, setFormLeaveCategory] = useState("Casual");
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [formEndDate, setFormEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [formDays, setFormDays] = useState(1);
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formExpenseCategory, setFormExpenseCategory] = useState("Travel / Field Fuel & Transport");
  const [formDescription, setFormDescription] = useState("");
  const [formAttachmentUrl, setFormAttachmentUrl] = useState("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Task Creation Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("Community Legal Camp");
  const [customCategoryText, setCustomCategoryText] = useState("");
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split("T")[0]);
  const [taskVenue, setTaskVenue] = useState("");
  const [taskHub, setTaskHub] = useState<"Karachi" | "Hyderabad" | "Sukkur">("Sukkur");
  const [taskUrgency, setTaskUrgency] = useState<"Standard" | "Urgent">("Standard");
  const [taskAssigneeEmail, setTaskAssigneeEmail] = useState("");
  const [taskAttachmentUrl, setTaskAttachmentUrl] = useState("");
  const [submittingTask, setSubmittingTask] = useState(false);
  const [taskFeedback, setTaskFeedback] = useState<{ status: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("plus_user");
      if (stored) {
        const u = JSON.parse(stored);
        const email = (u.email || "").toLowerCase().trim();
        const matched = OFFICIAL_ROSTER.find((s) => s.email.toLowerCase().trim() === email);
        if (matched) {
          setCurrentUser(matched);
        } else {
          localStorage.removeItem("plus_user");
        }
      }
    } catch {
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

    const matchedStaff = OFFICIAL_ROSTER.find((s) => s.email.toLowerCase().trim() === emailClean);

    if (!matchedStaff) {
      setAuthError("Email not found in registered PLUS Roster.");
      setIsAuthenticating(false);
      return;
    }

    if (pinClean !== matchedStaff.accessPin) {
      setAuthError("Invalid Security PIN for this account.");
      setIsAuthenticating(false);
      return;
    }

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

  const isManagerOrAdmin = useMemo(() => {
    if (!currentUser) return false;
    return (
      currentUser.role === "ADMIN" ||
      currentUser.role === "EXECUTIVE" ||
      currentUser.role === "PROGRAM_MGR" ||
      currentUser.role === "HR_ADMIN"
    );
  }, [currentUser]);

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

  const isFinanceUser = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.role === "FINANCE_MGR" || currentUser.email.toLowerCase().trim() === "japheth.wilson123@gmail.com";
  }, [currentUser]);

  async function handleFileUpload(file: File): Promise<string> {
    setIsUploadingFile(true);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "UPLOAD_FILE",
              fileName: `${Date.now()}_${file.name}`,
              mimeType: file.type,
              fileData: reader.result as string,
            }),
          });
          const data = await res.json();
          setIsUploadingFile(false);
          resolve(data.fileUrl || "");
        } catch (err) {
          setIsUploadingFile(false);
          reject(err);
        }
      };
      reader.onerror = (err) => {
        setIsUploadingFile(false);
        reject(err);
      };
    });
  }

  const scopedTasks = useMemo(() => {
    if (!currentUser) return [];
    if (isAdminOrExec) return tasks;

    if (currentUser.role === "PROGRAM_MGR") {
      return tasks.filter(
        (t) =>
          t.assigneeEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim() ||
          t.assigneeEmail === "ALL" ||
          t.assignedByEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
      );
    }

    return tasks.filter(
      (t) =>
        t.assigneeEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim() ||
        t.assigneeEmail === "ALL"
    );
  }, [tasks, currentUser, isAdminOrExec]);

  const scopedRequests = useMemo(() => {
    if (!currentUser) return [];
    if (isAdminOrExec || isFinanceUser) return requests;
    return requests.filter(
      (r) => r.requesterEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
    );
  }, [requests, currentUser, isAdminOrExec, isFinanceUser]);

  const filteredRequests = useMemo(() => {
    return scopedRequests.filter((req) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        req.requesterName?.toLowerCase().includes(q) ||
        req.description?.toLowerCase().includes(q) ||
        req.id?.toLowerCase().includes(q);

      const type = (req.requestType || "").toLowerCase();
      if (activeRequestFilter === "LEAVE") return matchesSearch && type.includes("leave");
      if (activeRequestFilter === "EXPENSE") return matchesSearch && (type.includes("expense") || Number(req.amount) > 0);
      return matchesSearch;
    });
  }, [scopedRequests, searchQuery, activeRequestFilter]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !taskTitle.trim()) return;

    setSubmittingTask(true);
    setTaskFeedback(null);
    const newId = "TSK-" + (tasks.length + 801);

    let targetEmail = currentUser.email;
    let targetName = currentUser.name;

    if (isManagerOrAdmin && taskAssigneeEmail) {
      if (taskAssigneeEmail === "ALL") {
        targetEmail = "ALL";
        targetName = "All Staff / Combined Team";
      } else {
        const found = OFFICIAL_ROSTER.find((r) => r.email === taskAssigneeEmail);
        if (found) {
          targetEmail = found.email;
          targetName = found.name;
        }
      }
    }

    const finalCategory = taskCategory === "Other" ? customCategoryText.trim() || "Other Deliverable" : taskCategory;

    const newTask: AssignedTask = {
      id: newId,
      title: taskTitle,
      category: finalCategory,
      dueDateOrHearing: taskDate,
      venue: taskVenue || "Field Location",
      hub: taskHub,
      status: "Pending Action",
      urgency: taskUrgency,
      assigneeEmail: targetEmail,
      assigneeName: targetName,
      assignedByEmail: currentUser.email,
      assignedByName: currentUser.name,
      attachmentUrl: taskAttachmentUrl,
    };

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CREATE_TASK", task: newTask }),
      });
    } catch (err) {
      console.warn("API broadcast notice:", err);
    }

    setTasks([newTask, ...tasks]);
    setSubmittingTask(false);

    setTaskFeedback({
      status: "success",
      message: `Task assigned successfully! Notification email dispatched to ${targetName} (${targetEmail}).`,
    });

    setTimeout(() => {
      setTaskFeedback(null);
      setIsTaskModalOpen(false);
      setTaskTitle("");
      setTaskVenue("");
      setTaskAttachmentUrl("");
      setCustomCategoryText("");
      setTaskCategory("Community Legal Camp");
      setTaskAssigneeEmail("");
    }, 2000);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !formDescription.trim()) return;

    setSubmittingForm(true);
    const newReqId = "PLUS-" + (requests.length + 101);

    const isKamanger = currentUser.email.toLowerCase().trim() === "kamanger110@gmail.com";
    const assignedApprover = isKamanger ? "altafkhoso.adv@gmail.com" : "ishfaque.mojai@gmail.com";
    const initialStatus = isKamanger ? "Submitted · Routed to CEO" : "Submitted · Pending Tier 1";

    const newRequest: RequestItem = {
      id: newReqId,
      timestamp: new Date().toISOString(),
      requesterEmail: currentUser.email,
      requesterName: currentUser.name,
      requestType: formType,
      leaveCategory: formType === "Leave" ? formLeaveCategory : undefined,
      startDate: formType === "Leave" ? formStartDate : undefined,
      endDate: formType === "Leave" ? formEndDate : undefined,
      days: formType === "Leave" ? formDays : undefined,
      amount: formType === "Expense" ? formAmount : undefined,
      expenseCategory: formType === "Expense" ? formExpenseCategory : undefined,
      description: formDescription,
      status: initialStatus,
      currentApproverEmail: assignedApprover,
      attachmentUrl: formAttachmentUrl,
    };

    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CREATE_REQUEST", request: newRequest }),
      });
    } catch (err) {
      console.warn("Request broadcast notice:", err);
    }

    setRequests([newRequest, ...requests]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsApplyModalOpen(false);
      setFormDescription("");
      setFormAmount(0);
      setFormAttachmentUrl("");
      setSubmittingForm(false);
    }, 1500);
  };

  if (isAuthChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <img src={OFFICIAL_LOGO_URL} alt="PLUS Logo" className="h-16 w-auto animate-pulse" />
      </div>
    );
  }

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
              <p className="mt-1 text-xs text-slate-500">Authorized Personnel Authentication Gate</p>
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
                    placeholder="e.g. kamanger110@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Personal Security PIN
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your assigned 4-digit PIN"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden font-mono"
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
                <span>{isAuthenticating ? "Authenticating..." : "Verify & Access Workspace"}</span>
              </button>
            </form>
          </div>
        </div>
        <footer className="border-t border-slate-200 bg-[#1b365d] py-4 text-center text-[11px] text-slate-300">
          Pakistan Legal United Society · Operations & Legal Aid Hub
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center rounded-xl bg-[#1b365d] p-1.5 shadow-xs">
              <img src={OFFICIAL_LOGO_URL} alt="PLUS Logo" className="h-10 w-auto object-contain" />
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
                Operations, Programs & Governance Hub
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

      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3 space-y-6">
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c65a28] py-3.5 px-4 text-xs font-bold text-white shadow-md transition hover:bg-[#a8491d] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Apply for Leave / Expense</span>
            </button>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
              <span className="block px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Operational Modules
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setMainViewTab("MY_TASKS")}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer ${
                    mainViewTab === "MY_TASKS" ? "bg-[#1b365d] text-white shadow-xs" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 text-[#fad207]" />
                  <span>{isFinanceUser ? "Finance Dashboard" : "My Active Work & Tasks"}</span>
                </button>

                <Link
                  href="/finance"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <span>Finance & Grants Desk</span>
                </Link>

                <Link
                  href="/payroll"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Banknote className="h-4 w-4 text-[#e59a24]" />
                  <span>Payroll & Compensation</span>
                </Link>

                <Link
                  href="/programs"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <HeartHandshake className="h-4 w-4 text-[#c65a28]" />
                  <span>Program Operations</span>
                </Link>

                <Link
                  href="/cases"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Scale className="h-4 w-4 text-[#1b365d]" />
                  <span>Case Load & Docket</span>
                </Link>

                <Link
                  href="/hr"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <UserCheck className="h-4 w-4 text-[#1b365d]" />
                  <span>HR & Appraisals</span>
                </Link>

                <Link
                  href="/timesheets"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Clock className="h-4 w-4 text-[#e59a24]" />
                  <span>Staff Timesheets</span>
                </Link>

                <Link
                  href="/directory"
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Users className="h-4 w-4 text-slate-500" />
                  <span>Staff Directory</span>
                </Link>

                {isAdminOrExec && (
                  <Link
                    href="/analytics"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1b365d] bg-[#1b365d]/5 hover:bg-[#1b365d]/10 transition"
                  >
                    <BarChart3 className="h-4 w-4 text-[#1b365d]" />
                    <span>Executive Analytics</span>
                  </Link>
                )}

                <div className="border-t border-slate-100 my-2 pt-2">
                  <span className="block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Operations Claims
                  </span>
                  <button
                    onClick={() => setMainViewTab("REQUESTs")}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold transition text-left cursor-pointer ${
                      mainViewTab === "REQUESTs" ? "bg-[#1b365d] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 text-[#fad207]" />
                    <span>{isFinanceUser ? "All Staff Expense Claims" : "My Leave & Expense Claims"}</span>
                  </button>
                </div>
              </nav>
            </div>

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
                  <p className="text-base font-bold text-[#1b365d]">5<span className="text-[10px] text-slate-400 font-normal">/5</span></p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Annual</span>
                  <p className="text-base font-bold text-[#1b365d]">5<span className="text-[10px] text-slate-400 font-normal">/5</span></p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-2.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Sick</span>
                  <p className="text-base font-bold text-[#1b365d]">2<span className="text-[10px] text-slate-400 font-normal">/2</span></p>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#c65a28]">
                  {currentUser.role} WORKSPACE · {currentUser.department}
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-[#1b365d]">
                  Welcome back, {currentUser.name}.
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isFinanceUser
                    ? "Financial master ledger, grant allocation burn rates, and expenditure audits."
                    : "Protected deliverable portfolio with Google Drive cloud storage and email dispatch."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!isFinanceUser && (
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1b365d] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#122440] cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-[#fad207]" />
                    <span>{isManagerOrAdmin ? "+ Assign New Task" : "+ Plan Future Task"}</span>
                  </button>
                )}
                <Link
                  href="/timesheets"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
                >
                  <Clock className="h-3.5 w-3.5 text-[#e59a24]" />
                  <span>Log Work Hours</span>
                </Link>
              </div>
            </div>

            {isFinanceUser ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Active Grants</span>
                    <Wallet className="h-4 w-4 text-[#1b365d]" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#1b365d]">3 Grants</p>
                  <span className="text-[10px] text-slate-500">Hyd, Sukkur & Legal</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Payroll Outflow</span>
                    <Banknote className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">PKR 543k</p>
                  <span className="text-[10px] text-slate-500">August 2026 Cycle</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Pending Claims</span>
                    <FileText className="h-4 w-4 text-[#c65a28]" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#c65a28]">{requests.length} Claims</p>
                  <span className="text-[10px] text-slate-500">Awaiting finance review</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Audit Status</span>
                    <ShieldCheck className="h-4 w-4 text-[#1b365d]" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#1b365d]">FBR Ready</p>
                  <span className="text-[10px] text-slate-500">Withholding verified</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Active Tasks</span>
                    <Activity className="h-4 w-4 text-[#1b365d]" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#1b365d]">{scopedTasks.length}</p>
                  <span className="text-[10px] text-slate-500">Visible to your role</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Due This Week</span>
                    <Calendar className="h-4 w-4 text-[#c65a28]" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#c65a28]">
                    {scopedTasks.filter((t) => t.urgency === "Urgent").length} Urgent
                  </p>
                  <span className="text-[10px] text-slate-500">Camps & hearings</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Logged Hours</span>
                    <Clock className="h-4 w-4 text-[#e59a24]" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#e59a24]">37.5 hrs</p>
                  <span className="text-[10px] text-slate-500">Current cycle</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Open Claims</span>
                    <FileText className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">{scopedRequests.length}</p>
                  <span className="text-[10px] text-slate-500">Your claims queue</span>
                </div>
              </div>
            )}

            {isFinanceUser ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Finance & Grant Audit Dashboard (Pending Review)
                  </h3>
                  <Link href="/finance" className="text-xs font-bold text-[#1b365d] hover:underline">
                    View Full Finance Ledger →
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase">Payroll Tier 2 Audit</span>
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">Pending Audit</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">Monthly Staff Compensation (August 2026)</p>
                    <p className="text-xs text-slate-500">Verify grant allocations for NAVTTC and regional legal programs.</p>
                    <Link
                      href="/payroll"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1b365d] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#122440]"
                    >
                      <Banknote className="h-3.5 w-3.5 text-[#fad207]" />
                      <span>Audit Payroll & Grant Balances</span>
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase">Expense Claims Review</span>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Active Queue</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">Field Fuel, Transport & Court Filing Claims</p>
                    <p className="text-xs text-slate-500">Review receipts and reimburse field coordinators across Sindh hubs.</p>
                    <Link
                      href="/finance"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#c65a28] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#a8491d]"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-[#fad207]" />
                      <span>Review Expense Claims</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : mainViewTab === "MY_TASKS" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    My Deliverables & Assigned Operations ({scopedTasks.length})
                  </h3>
                  <span className="text-xs text-slate-500">Protected view with real-time email dispatch</span>
                </div>

                <div className="space-y-3">
                  {scopedTasks.map((task) => {
                    const isCombined = task.assigneeEmail === "ALL";
                    const isDelegatedByMe =
                      task.assignedByEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim() &&
                      task.assigneeEmail.toLowerCase().trim() !== currentUser.email.toLowerCase().trim();

                    return (
                      <div
                        key={task.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-[#1b365d] space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-[#1b365d]">{task.id}</span>
                              <span className="rounded-md bg-[#1b365d]/10 px-2 py-0.5 text-[10px] font-bold text-[#1b365d]">
                                {task.category}
                              </span>
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                {task.hub} Regional
                              </span>
                              {isCombined && (
                                <span className="rounded-md bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-[10px] font-bold">
                                  Combined Team Task
                                </span>
                              )}
                              {isDelegatedByMe && (
                                <span className="rounded-md bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-bold">
                                  Assigned to: {task.assigneeName}
                                </span>
                              )}
                            </div>
                            <h4 className="mt-1 text-sm font-bold text-slate-900">{task.title}</h4>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {task.urgency === "Urgent" && (
                              <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-bold text-[#b82626]">
                                Urgent
                              </span>
                            )}
                            <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                              {task.status}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-[#c65a28]" />
                              <span>{task.venue}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>Target Date: <strong className="text-slate-800">{task.dueDateOrHearing}</strong></span>
                            </div>
                            {task.attachmentUrl && (
                              <a
                                href={task.attachmentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1b365d] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md"
                              >
                                <Paperclip className="h-3 w-3 text-[#c65a28]" />
                                <span>Attached File</span>
                              </a>
                            )}
                          </div>

                          <Link
                            href={task.category.includes("Legal") ? "/cases" : "/programs"}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#1b365d] hover:text-[#c65a28]"
                          >
                            <span>Open Module & Log Output</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search requests by purpose, amount, or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveRequestFilter("ALL")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        activeRequestFilter === "ALL" ? "bg-[#1b365d] text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveRequestFilter("LEAVE")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        activeRequestFilter === "LEAVE" ? "bg-[#1b365d] text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Leave
                    </button>
                    <button
                      onClick={() => setActiveRequestFilter("EXPENSE")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        activeRequestFilter === "EXPENSE" ? "bg-[#1b365d] text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Expenses
                    </button>
                  </div>
                </div>

                {filteredRequests.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-xs text-slate-500">
                    No requests found in the system queue.
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
                              <span className="font-mono text-[11px] font-bold text-[#1b365d]">{req.id}</span>
                              <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                                {req.requestType}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-600">
                                By: {req.requesterName} ({req.requesterEmail})
                              </span>
                            </div>
                            <h4 className="mt-1 text-xs font-bold text-slate-900">{req.description}</h4>
                            {req.attachmentUrl && (
                              <div className="mt-2">
                                <a
                                  href={req.attachmentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1b365d] hover:underline"
                                >
                                  <Paperclip className="h-3 w-3 text-[#c65a28]" />
                                  <span>View Uploaded Receipt / Document</span>
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            {req.amount ? (
                              <span className="text-sm font-bold text-[#1b365d]">PKR {Number(req.amount).toLocaleString("en-PK")}</span>
                            ) : (
                              <span className="text-xs font-bold text-[#1b365d]">{req.days || 1} Day(s) Leave</span>
                            )}
                            <div className="mt-1">
                              <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                                {req.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* TASK CREATION MODAL */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1b365d]">
                  {isManagerOrAdmin ? "Initiate & Assign Deliverable" : "Schedule Future Deliverable / Task"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Created by: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.designation})
                </p>
              </div>
              <button onClick={() => { setIsTaskModalOpen(false); setTaskFeedback(null); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {taskFeedback && (
              <div
                className={`flex items-center gap-2 rounded-xl p-3.5 text-xs font-bold border animate-in fade-in ${
                  taskFeedback.status === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{taskFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Task Title / Deliverable
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct Legal Camp at UC Qasimabad / File Bail Petition"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              {isManagerOrAdmin ? (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1b365d] mb-1">
                    Assign Task To (Team Member)
                  </label>
                  <select
                    value={taskAssigneeEmail}
                    onChange={(e) => setTaskAssigneeEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="">Myself ({currentUser.name})</option>
                    <option value="ALL">★ All Staff / Combined Team Task</option>
                    <optgroup label="Operational Team">
                      {OFFICIAL_ROSTER.filter((s) => s.email !== currentUser.email).map((staff) => (
                        <option key={staff.email} value={staff.email}>
                          {staff.name} — {staff.designation} ({staff.department})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-600">
                  <span>Assignee: <strong>{currentUser.name} (Self-Assigned Task)</strong></span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Community Legal Camp">Community Legal Camp</option>
                    <option value="Prison Unit (NAVTTC)">Prison Unit (NAVTTC)</option>
                    <option value="Legal Casework / Court">Legal Casework / Court</option>
                    <option value="Police Training">Police Training</option>
                    <option value="Operational / Admin Task">Operational / Admin Task</option>
                    <option value="Other">Other (Custom Specified)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Regional Hub
                  </label>
                  <select
                    value={taskHub}
                    onChange={(e) => setTaskHub(e.target.value as "Karachi" | "Hyderabad" | "Sukkur")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Sukkur">Sukkur Regional</option>
                    <option value="Hyderabad">Hyderabad Regional</option>
                    <option value="Karachi">Karachi HO</option>
                  </select>
                </div>
              </div>

              {taskCategory === "Other" && (
                <div className="animate-in fade-in">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#c65a28] mb-1">
                    Specify Custom Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter custom category name (e.g. Advocacy Roundtable / Stakeholder Meeting)"
                    value={customCategoryText}
                    onChange={(e) => setCustomCategoryText(e.target.value)}
                    className="w-full rounded-xl border border-orange-200 bg-orange-50/40 p-2 text-xs font-semibold text-[#1b365d] focus:border-[#c65a28] focus:bg-white focus:outline-hidden"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Priority / Urgency
                  </label>
                  <select
                    value={taskUrgency}
                    onChange={(e) => setTaskUrgency(e.target.value as "Standard" | "Urgent")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Standard">Standard Priority</option>
                    <option value="Urgent">Urgent Due Date</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Location / Venue
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sessions Court Sukkur / Central Jail Hyderabad"
                  value={taskVenue}
                  onChange={(e) => setTaskVenue(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Attach Brief / Document (Saved to Drive)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await handleFileUpload(file);
                      setTaskAttachmentUrl(url);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1b365d] file:text-white hover:file:bg-[#122440] cursor-pointer"
                />
                {isUploadingFile && <span className="text-[10px] text-[#c65a28] font-semibold mt-1 block">Uploading file to Google Drive...</span>}
                {taskAttachmentUrl && <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">✓ File attached & uploaded!</span>}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsTaskModalOpen(false); setTaskFeedback(null); }}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTask || isUploadingFile}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b365d] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#122440] cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5 text-[#fad207]" />
                  <span>{submittingTask ? "Dispatching..." : isManagerOrAdmin ? "Assign & Send Email" : "Schedule Task"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OPERATIONS REQUEST MODAL */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1b365d]">New Operations Request</h3>
                <p className="text-[11px] text-slate-500">
                  Submitting as: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email})
                </p>
              </div>
              <button onClick={() => setIsApplyModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setFormType("Leave")}
                  className={`rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
                    formType === "Leave" ? "bg-white text-[#1b365d] shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Apply for Leave
                </button>
                <button
                  type="button"
                  onClick={() => setFormType("Expense")}
                  className={`rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
                    formType === "Expense" ? "bg-white text-[#1b365d] shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Expense / Reimbursement
                </button>
              </div>

              {formType === "Leave" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Leave Category
                    </label>
                    <select
                      value={formLeaveCategory}
                      onChange={(e) => setFormLeaveCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800 focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    >
                      <option value="Casual">Casual Leave (5 Days Quota)</option>
                      <option value="Annual">Annual Leave (5 Days Quota)</option>
                      <option value="Sick">Sick / Medical Leave (2 Days Quota)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Total Days</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={formDays}
                      onChange={(e) => setFormDays(parseInt(e.target.value) || 1)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Expense Category</label>
                    <select
                      value={formExpenseCategory}
                      onChange={(e) => setFormExpenseCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800 focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    >
                      <option value="Travel / Field Fuel & Transport">Travel / Field Fuel & Transport</option>
                      <option value="Court Filing & Legal Fees">Court Filing & Legal Defense Costs</option>
                      <option value="Office Supplies & Utilities">Office Supplies & Logistics</option>
                      <option value="Community Awareness / Camp">Community Legal Awareness Camp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Amount Requested (PKR)</label>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      placeholder="e.g. 7500"
                      value={formAmount || ""}
                      onChange={(e) => setFormAmount(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-[#1b365d] focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Attach Receipt / Bill (PDF / JPG / PNG)
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          setFormAttachmentUrl(url);
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1b365d] file:text-white hover:file:bg-[#122440] cursor-pointer"
                    />
                    {isUploadingFile && <span className="text-[10px] text-[#c65a28] font-semibold mt-1 block">Uploading receipt to Google Drive...</span>}
                    {formAttachmentUrl && <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">✓ Receipt uploaded!</span>}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Reason & Justification</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the deliverable, field trip, or leave purpose..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden resize-none"
                />
              </div>

              {submitSuccess ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submitted Successfully & Approver Notified via Email!</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingForm || isUploadingFile}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#c65a28] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#a8491d] disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5 text-[#fad207]" />
                    <span>{submittingForm ? "Routing & Notifying..." : "Submit Claim"}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
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
                  <img src={OFFICIAL_LOGO_URL} alt="PLUS Logo" className="h-12 w-auto object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white">Pakistan Legal United Society</h3>
                  <p className="text-[12px] font-bold text-[#fad207]">انصاف سب کا حق ہے</p>
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
                  <span>071-5824119</span>
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
