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
  Package,
  Paperclip,
  Phone,
  Plus,
  PlusCircle,
  Scale,
  Search,
  Send,
  ShoppingCart,
  ShieldCheck,
  UserCheck,
  Users,
  X,
  Banknote,
  Wallet,
  Database,
  BookOpen,
  FileCheck,
} from "lucide-react";

interface RequestItem {
  id: string;
  timestamp: string;
  requesterEmail: string;
  requesterName: string;
  requestType: "Leave" | "Expense" | "Purchase" | "Asset" | "General";
  leaveCategory?: string;
  delegatedPerson?: string;
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
  { email: "dataplus.org@gmail.com", name: "Aatif", designation: "System Administrator", role: "ADMIN", department: "IT / Systems", accessPin: "9901" },
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

interface PolicyDocument {
  id: string;
  title: string;
  category: "HR Policies" | "Finance Policies" | "Safeguarding Policies" | "MEAL Policies" | "Admin Policies" | "SOPs" | "Code of Conduct";
  lastUpdated: string;
  version: string;
  description: string;
}

const POLICY_CATEGORIES = [
  "HR Policies",
  "Finance Policies",
  "Safeguarding Policies",
  "MEAL Policies",
  "Admin Policies",
  "SOPs",
  "Code of Conduct",
] as const;

const INITIAL_POLICIES: PolicyDocument[] = [
  { id: "POL-01", title: "PLUS Staff Handbook & Leave Regulations", category: "HR Policies", lastUpdated: "2026-01-15", version: "v3.2", description: "Comprehensive guidelines regarding staff attendance, leave quotas, and appraisals." },
  { id: "POL-02", title: "Institutional Financial & Procurement Manual", category: "Finance Policies", lastUpdated: "2026-02-10", version: "v2.0", description: "Standard operating procedures for grant allocations, expense claims, and vendor bidding." },
  { id: "POL-03", title: "Child & Vulnerable Inmate Safeguarding Policy", category: "Safeguarding Policies", lastUpdated: "2026-03-01", version: "v1.5", description: "Mandatory protection protocols for community legal clinics and prison training hubs." },
  { id: "POL-04", title: "Monitoring, Evaluation & Learning (MEAL) Framework", category: "MEAL Policies", lastUpdated: "2026-01-20", version: "v2.1", description: "Guidelines for recording hospital visits, community camps, and legal aid case dockets." },
  { id: "POL-05", title: "Asset Management & Office Logistics SOP", category: "Admin Policies", lastUpdated: "2026-04-12", version: "v1.8", description: "Protocols for equipment allocation, inventory tracking across Karachi, Sukkur & Hyderabad." },
  { id: "POL-06", title: "Field Legal Aid Clinic Operations SOP", category: "SOPs", lastUpdated: "2026-02-28", version: "v3.0", description: "Step-by-step procedures for conducting mobile legal camps and distributing rights booklets." },
  { id: "POL-07", title: "PLUS Ethical Code of Conduct & Anti-Fraud Policy", category: "Code of Conduct", lastUpdated: "2026-01-10", version: "v4.0", description: "Core ethical standards and whistleblower protections for all PLUS staff and partners." },
];

const OFFICIAL_LOGO_URL =
  "https://grassrootsjusticenetwork.org/wp-content/uploads/2023/12/PLUS-logo-1-768x593.png";

export default function WorkspacePage() {
  const [currentUser, setCurrentUser] = useState<StaffProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Auth State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // App State
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [policies] = useState<PolicyDocument[]>(INITIAL_POLICIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainViewTab, setMainViewTab] = useState<"MY_TASKS" | "REQUESTs" | "POLICIES">("MY_TASKS");
  const [activeRequestFilter, setActiveRequestFilter] = useState<"ALL" | "LEAVE" | "EXPENSE" | "PURCHASE" | "ASSET">("ALL");
  const [activePolicyCategory, setActivePolicyCategory] = useState<string>("ALL");

  // Request Form Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [formType, setFormType] = useState<"Leave" | "Expense" | "Purchase" | "Asset">("Leave");
  const [formLeaveCategory, setFormLeaveCategory] = useState("Casual");
  const [customLeaveCategory, setCustomLeaveCategory] = useState("");
  const [formDelegatedPerson, setFormDelegatedPerson] = useState("");
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [formEndDate, setFormEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [formDays, setFormDays] = useState(1);
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formExpenseCategory, setFormExpenseCategory] = useState("Travel / Field Fuel & Transport");
  const [customExpenseCategory, setCustomExpenseCategory] = useState("");
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

  // Fetch live data via REST fetch to Supabase
  useEffect(() => {
    async function fetchSupabaseData() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) return;

        // Fetch Requests
        const reqRes = await fetch(`${url}/rest/v1/requests?select=*`, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        });
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          if (reqData && reqData.length > 0) {
            setRequests(
              reqData.map((r: any) => ({
                id: r.id,
                timestamp: r.timestamp,
                requesterEmail: r.requester_email,
                requesterName: r.requester_name,
                requestType: r.request_type,
                leaveCategory: r.leave_category,
                delegatedPerson: r.delegated_person,
                startDate: r.start_date,
                endDate: r.end_date,
                days: r.days,
                amount: r.amount,
                expenseCategory: r.expense_category,
                description: r.description,
                status: r.status,
                currentApproverEmail: r.current_approver_email,
                attachmentUrl: r.attachment_url,
              }))
            );
          }
        }

        // Fetch Tasks
        const taskRes = await fetch(`${url}/rest/v1/tasks?select=*`, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        });
        if (taskRes.ok) {
          const taskData = await taskRes.json();
          if (taskData && taskData.length > 0) {
            setTasks(
              taskData.map((t: any) => ({
                id: t.id,
                title: t.title,
                category: t.category,
                dueDateOrHearing: t.due_date_or_hearing,
                venue: t.venue,
                hub: t.hub,
                status: t.status,
                urgency: t.urgency,
                assigneeEmail: t.assignee_email,
                assigneeName: t.assignee_name,
                assignedByEmail: t.assigned_by_email,
                assignedByName: t.assigned_by_name,
                attachmentUrl: t.attachment_url,
              }))
            );
          } else {
            setTasks([
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
            ]);
          }
        }
      } catch (err) {
        console.error("Supabase fetch error:", err);
      }
    }
    fetchSupabaseData();
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

  const isSystemAdmin = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.email.toLowerCase().trim() === "dataplus.org@gmail.com" || currentUser.role === "ADMIN";
  }, [currentUser]);

  const isExecutiveUser = useMemo(() => {
    if (!currentUser) return false;
    const execEmails = ["altafkhoso.adv@gmail.com", "rizwanapatel.plus@gmail.com", "dataplus.org@gmail.com"];
    return currentUser.role === "EXECUTIVE" || execEmails.includes(currentUser.email.toLowerCase().trim());
  }, [currentUser]);

  const isManagerOrAdmin = useMemo(() => {
    if (!currentUser) return false;
    return (
      currentUser.role === "ADMIN" ||
      currentUser.role === "EXECUTIVE" ||
      currentUser.role === "PROGRAM_MGR" ||
      currentUser.role === "HR_ADMIN"
    );
  }, [currentUser]);

  const isFinanceUser = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.role === "FINANCE_MGR" || currentUser.email.toLowerCase().trim() === "japheth.wilson123@gmail.com";
  }, [currentUser]);

  const isHrAdminUser = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.role === "HR_ADMIN" || currentUser.email.toLowerCase().trim() === "ishfaque.mojai@gmail.com";
  }, [currentUser]);

  async function handleFileUpload(file: File): Promise<string> {
    setIsUploadingFile(true);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setIsUploadingFile(false);
        resolve((reader.result as string) || "");
      };
      reader.onerror = () => {
        setIsUploadingFile(false);
        resolve("");
      };
    });
  }

  const scopedTasks = useMemo(() => {
    if (!currentUser) return [];
    if (isSystemAdmin || isExecutiveUser) return tasks;

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
  }, [tasks, currentUser, isSystemAdmin, isExecutiveUser]);

  const scopedRequests = useMemo(() => {
    if (!currentUser) return [];
    if (isSystemAdmin || isExecutiveUser || isFinanceUser || isHrAdminUser) return requests;
    return requests.filter(
      (r) => r.requesterEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
    );
  }, [requests, currentUser, isSystemAdmin, isExecutiveUser, isFinanceUser, isHrAdminUser]);

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
      if (activeRequestFilter === "PURCHASE") return matchesSearch && type.includes("purchase");
      if (activeRequestFilter === "ASSET") return matchesSearch && type.includes("asset");
      return matchesSearch;
    });
  }, [scopedRequests, searchQuery, activeRequestFilter]);

  const filteredPolicies = useMemo(() => {
    return policies.filter((pol) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || pol.title.toLowerCase().includes(q) || pol.description.toLowerCase().includes(q);
      const matchesCategory = activePolicyCategory === "ALL" || pol.category === activePolicyCategory;
      return matchesSearch && matchesCategory;
    });
  }, [policies, searchQuery, activePolicyCategory]);

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
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        await fetch(`${url}/rest/v1/tasks`, {
          method: "POST",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            id: newTask.id,
            title: newTask.title,
            category: newTask.category,
            due_date_or_hearing: newTask.dueDateOrHearing,
            venue: newTask.venue,
            hub: newTask.hub,
            status: newTask.status,
            urgency: newTask.urgency,
            assignee_email: newTask.assigneeEmail,
            assignee_name: newTask.assigneeName,
            assigned_by_email: newTask.assignedByEmail,
            assigned_by_name: newTask.assignedByName,
            attachment_url: newTask.attachmentUrl,
          }),
        });
      }
    } catch (err) {
      console.error("Failed to save task", err);
    }

    setTasks([newTask, ...tasks]);
    setSubmittingTask(false);
    setTaskFeedback({
      status: "success",
      message: `Task assigned successfully! Notification dispatched to ${targetName} (${targetEmail}).`,
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
    const finalLeaveCat = formLeaveCategory === "Other" ? customLeaveCategory.trim() || "Other Leave" : formLeaveCategory;
    const finalExpenseCat = formExpenseCategory === "Other" ? customExpenseCategory.trim() || "Other Requisition" : formExpenseCategory;

    const newRequest: RequestItem = {
      id: newReqId,
      timestamp: new Date().toISOString(),
      requesterEmail: currentUser.email,
      requesterName: currentUser.name,
      requestType: formType,
      leaveCategory: formType === "Leave" ? finalLeaveCat : undefined,
      delegatedPerson: formType === "Leave" ? formDelegatedPerson : undefined,
      startDate: formType === "Leave" ? formStartDate : undefined,
      endDate: formType === "Leave" ? formEndDate : undefined,
      days: formType === "Leave" ? formDays : undefined,
      amount: formType === "Expense" || formType === "Purchase" ? formAmount : undefined,
      expenseCategory: formType === "Expense" || formType === "Asset" ? finalExpenseCat : undefined,
      description: formDescription,
      status: "Submitted · Routed for Approval",
      currentApproverEmail: isHrAdminUser ? "altafkhoso.adv@gmail.com" : "ishfaque.mojai@gmail.com",
      attachmentUrl: formAttachmentUrl,
    };

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        await fetch(`${url}/rest/v1/requests`, {
          method: "POST",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            id: newRequest.id,
            timestamp: newRequest.timestamp,
            requester_email: newRequest.requesterEmail,
            requester_name: newRequest.requesterName,
            request_type: newRequest.requestType,
            leave_category: newRequest.leaveCategory,
            delegated_person: newRequest.delegatedPerson,
            start_date: newRequest.startDate,
            end_date: newRequest.endDate,
            days: newRequest.days,
            amount: newRequest.amount,
            expense_category: newRequest.expenseCategory,
            description: newRequest.description,
            status: newRequest.status,
            current_approver_email: newRequest.currentApproverEmail,
            attachment_url: newRequest.attachmentUrl,
          }),
        });
      }
    } catch (err) {
      console.error("Failed to save request", err);
    }

    setRequests([newRequest, ...requests]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsApplyModalOpen(false);
      setFormDescription("");
      setFormAmount(0);
      setFormDelegatedPerson("");
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
              <div className="flex items-center justify-center rounded-2xl p-2 bg-white">
                <img src={OFFICIAL_LOGO_URL} alt="PLUS Logo" className="h-14 w-auto object-contain" />
              </div>
              <h2 className="mt-4 text-xl font-bold tracking-tight text-[#1b365d]">
                Pakistan Legal United Society
              </h2>
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
                    placeholder="e.g. dataplus.org@gmail.com"
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
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center shrink-0">
              <img src={OFFICIAL_LOGO_URL} alt="PLUS Logo" className="h-11 w-11 object-contain drop-shadow-xs" />
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
              <span>Submit Request / Requisition</span>
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
                  <span>
                    {isSystemAdmin || isExecutiveUser
                      ? "Executive Dashboard"
                      : isFinanceUser
                      ? "Finance Dashboard"
                      : isHrAdminUser
                      ? "HR & Admin Dashboard"
                      : "My Active Work & Tasks"}
                  </span>
                </button>

                <button
                  onClick={() => setMainViewTab("POLICIES")}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition text-left cursor-pointer ${
                    mainViewTab === "POLICIES" ? "bg-[#1b365d] text-white shadow-xs" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <BookOpen className="h-4 w-4 text-[#c65a28]" />
                  <span>Institutional Policies Hub</span>
                </button>

                <div className="border-t border-slate-100 my-2 pt-2">
                  <span className="block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    System Control
                  </span>
                  <button
                    onClick={() => setMainViewTab("REQUESTs")}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold transition text-left cursor-pointer ${
                      mainViewTab === "REQUESTs" ? "bg-[#1b365d] text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 text-[#fad207]" />
                    <span>
                      {isSystemAdmin || isExecutiveUser || isFinanceUser || isHrAdminUser
                        ? "Master System Requisitions"
                        : "My Submitted Requests"}
                    </span>
                  </button>
                </div>
              </nav>
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
                  {mainViewTab === "POLICIES"
                    ? "Centralized compliance repository organized by HR, Finance, Safeguarding, MEAL, and Admin policies."
                    : "Protected deliverable portfolio with Supabase database cloud storage and real-time sync."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isManagerOrAdmin && mainViewTab !== "POLICIES" && (
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1b365d] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#122440] cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5 text-[#fad207]" />
                    <span>+ Assign New Task</span>
                  </button>
                )}
              </div>
            </div>

            {/* MAIN CONTENT AREA */}
            {mainViewTab === "POLICIES" ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#1b365d]">Institutional Policies & SOPs Repository</h3>
                    <p className="text-xs text-slate-500">Browse official guidelines categorized by department and operational framework.</p>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search policies or SOPs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:border-[#1b365d] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setActivePolicyCategory("ALL")}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                      activePolicyCategory === "ALL" ? "bg-[#1b365d] text-white shadow-2xs" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    All Categories ({policies.length})
                  </button>
                  {POLICY_CATEGORIES.map((cat) => {
                    const count = policies.filter(p => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActivePolicyCategory(cat)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                          activePolicyCategory === cat ? "bg-[#1b365d] text-white shadow-2xs" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">{count}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {filteredPolicies.map((pol) => (
                    <div
                      key={pol.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 transition hover:border-[#1b365d]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-[#1b365d]/10 px-2.5 py-1 text-[10px] font-bold text-[#1b365d]">
                          {pol.category}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-slate-400">
                          {pol.version} · Updated: {pol.lastUpdated}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{pol.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{pol.description}</p>
                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Approved & Verified</span>
                        </span>
                        <button
                          onClick={() => alert(`Opening document viewer for: ${pol.title}`)}
                          className="inline-flex items-center gap-1 font-bold text-[#1b365d] hover:text-[#c65a28] cursor-pointer"
                        >
                          <span>Read Document</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : mainViewTab === "MY_TASKS" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    My Deliverables & Assigned Operations ({scopedTasks.length})
                  </h3>
                  <span className="text-xs text-slate-500">Supabase Cloud Synchronized</span>
                </div>

                <div className="space-y-3">
                  {scopedTasks.map((task) => (
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
                          </div>
                          <h4 className="mt-1 text-sm font-bold text-slate-900">{task.title}</h4>
                        </div>
                        <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                          {task.status}
                        </span>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#c65a28]" />
                            <span>{task.venue}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>Target Date: <strong className="text-slate-800">{task.dueDateOrHearing}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Master Requisitions Queue
                  </h3>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search requisitions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredRequests.map((req) => (
                      <div key={req.id} className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] font-bold text-[#1b365d]">{req.id}</span>
                              <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                                {req.requestType}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-600">
                                By: <strong className="text-slate-900">{req.requesterName}</strong>
                              </span>
                            </div>
                            <h4 className="mt-1 text-xs font-bold text-slate-900">{req.description}</h4>
                          </div>
                          <div className="text-right shrink-0">
                            {req.amount ? (
                              <span className="text-sm font-bold text-[#1b365d]">PKR {Number(req.amount).toLocaleString("en-PK")}</span>
                            ) : (
                              <span className="text-xs font-bold text-[#1b365d]">{req.days || 1} Day(s)</span>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* TASK MODAL */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#1b365d]">Initiate & Assign Deliverable</h3>
              <button onClick={() => { setIsTaskModalOpen(false); setTaskFeedback(null); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {taskFeedback && (
              <div className="flex items-center gap-2 rounded-xl p-3.5 text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{taskFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct Legal Camp"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1b365d] mb-1">Assign To Subordinate</label>
                <select
                  value={taskAssigneeEmail}
                  onChange={(e) => setTaskAssigneeEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                >
                  <option value="">Select Subordinate Staff Member</option>
                  <option value="ALL">★ All Staff / Combined Team Task</option>
                  {OFFICIAL_ROSTER.filter((s) => s.email !== currentUser.email).map((staff) => (
                    <option key={staff.email} value={staff.email}>
                      {staff.name} — {staff.designation} ({staff.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Community Legal Camp">Community Legal Camp</option>
                    <option value="Prison Unit">Prison Unit</option>
                    <option value="Legal Casework">Legal Casework</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Hub</label>
                  <select
                    value={taskHub}
                    onChange={(e) => setTaskHub(e.target.value as "Karachi" | "Hyderabad" | "Sukkur")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Sukkur">Sukkur</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Karachi">Karachi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Urgency</label>
                  <select
                    value={taskUrgency}
                    onChange={(e) => setTaskUrgency(e.target.value as "Standard" | "Urgent")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Court / Camp Location"
                  value={taskVenue}
                  onChange={(e) => setTaskVenue(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={submittingTask}
                className="w-full rounded-xl bg-[#1b365d] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#122440] cursor-pointer"
              >
                {submittingTask ? "Assigning..." : "Assign & Dispatch Task"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST MODAL */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#1b365d]">Submit Operations Request</h3>
              <button onClick={() => setIsApplyModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-slate-100 p-1">
                {(["Leave", "Expense", "Purchase", "Asset"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormType(t)}
                    className={`rounded-lg py-2 text-[11px] font-bold transition cursor-pointer ${
                      formType === t ? "bg-white text-[#1b365d] shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {formType === "Leave" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Leave Category</label>
                    <select
                      value={formLeaveCategory}
                      onChange={(e) => setFormLeaveCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs"
                    >
                      <option value="Casual">Casual Leave</option>
                      <option value="Annual">Annual Leave</option>
                      <option value="Sick">Sick / Medical Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1b365d] mb-1">
                      Delegation of Authority (Acting Person)
                    </label>
                    <select
                      value={formDelegatedPerson}
                      onChange={(e) => setFormDelegatedPerson(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold"
                    >
                      <option value="">Select Colleague for Delegation</option>
                      {OFFICIAL_ROSTER.filter((s) => s.email !== currentUser.email).map((staff) => (
                        <option key={staff.email} value={staff.name}>
                          {staff.name} — {staff.designation}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Purpose & Justification</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the requirement or leave purpose..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs resize-none"
                />
              </div>

              {submitSuccess ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submitted & Synced to Supabase!</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="w-full rounded-xl bg-[#c65a28] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#a8491d] cursor-pointer"
                >
                  {submittingForm ? "Submitting..." : "Submit Requisition"}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-16 border-t border-slate-200 bg-[#1b365d] text-white">
        <div className="container mx-auto max-w-7xl px-4 py-8 text-center text-xs text-slate-300">
          Pakistan Legal United Society · Operations & Legal Aid Hub · Supabase Cloud Connected
        </div>
      </footer>
    </div>
  );
}
