"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  CreditCard, 
  DollarSign, 
  HeartHandshake, 
  Scale, 
  Users, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Search, 
  LogOut, 
  ShieldCheck, 
  X,
  Briefcase,
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  FolderOpen
} from "lucide-react";

interface ProfileItem {
  id: string;
  email: string;
  name: string;
  role: string;
  designation: string;
  department: string;
  hub: string;
  manager_email?: string;
  access_pin?: string;
}

interface RequestItem {
  id: string;
  timestamp: string;
  requesterEmail: string;
  requesterName: string;
  requestType: string;
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

interface TaskItem {
  id: string;
  title: string;
  category: string;
  dueDateOrHearing: string;
  venue: string;
  hub: string;
  status: string;
  urgency: string;
  assigneeEmail: string;
  assigneeName: string;
  assignedByEmail: string;
  assignedByName: string;
  attachmentUrl?: string;
}

export default function OperationsPortal() {
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [sessionUser, setSessionUser] = useState<ProfileItem | null>(null);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState("kamanger110@gmail.com");
  const [loginPin, setLoginPin] = useState("1234");
  const [loginError, setLoginError] = useState("");

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // New Request Form State
  const [reqType, setReqType] = useState("Leave");
  const [leaveCat, setLeaveCat] = useState("Casual");
  const [delegatedPerson, setDelegatedPerson] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [daysCount, setDaysCount] = useState<number>(1);
  const [amountVal, setAmountVal] = useState<number>(0);
  const [expenseCat, setExpenseCat] = useState("Travel");
  const [description, setDescription] = useState("");

  // New Task Form State
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("Community Legal Camp");
  const [taskDueDate, setTaskDueDate] = useState("2026-08-29");
  const [taskVenue, setTaskVenue] = useState("Sessions Court Sukkur");
  const [taskHub, setTaskHub] = useState("Sukkur Regional");
  const [taskUrgency, setTaskUrgency] = useState("Standard Priority");
  const [assigneeEmail, setAssigneeEmail] = useState("");

  // Supabase Data Load
  useEffect(() => {
    async function loadData() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) return;

      try {
        // 1. Fetch Profiles Roster
        const profRes = await fetch(`${url}/rest/v1/profiles?select=*`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
        });
        if (profRes.ok) {
          const profData = await profRes.json();
          setProfiles(profData);
          const defaultUser = profData.find((p: ProfileItem) => p.email === "kamanger110@gmail.com");
          if (defaultUser) setSessionUser(defaultUser);
        }

        // 2. Fetch Requests
        const reqRes = await fetch(`${url}/rest/v1/requests?select=*`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
        });
        if (reqRes.ok) {
          const reqData = await reqRes.json();
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

        // 3. Fetch Tasks
        const taskRes = await fetch(`${url}/rest/v1/tasks?select=*`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
        });
        if (taskRes.ok) {
          const taskData = await taskRes.json();
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
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    }
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userMatch = profiles.find(
      (p) => p.email.toLowerCase() === loginEmail.toLowerCase() && p.access_pin === loginPin
    );
    if (userMatch) {
      setSessionUser(userMatch);
      setLoginError("");
    } else {
      setLoginError("Invalid email or PIN. Check your staff credentials.");
    }
  };

  // Submit Requisition with Approver Matrix Routing
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) return;

    // Routing Logic
    let approver = sessionUser.manager_email || "dataplus.org@gmail.com";
    if (reqType === "Expense" && amountVal >= 50000) {
      approver = "dataplus.org@gmail.com"; // Escalation above threshold
    }

    const newReq: RequestItem = {
      id: "REQ-" + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString(),
      requesterEmail: sessionUser.email,
      requesterName: sessionUser.name,
      requestType: reqType,
      leaveCategory: reqType === "Leave" ? leaveCat : undefined,
      delegatedPerson: reqType === "Leave" ? delegatedPerson : undefined,
      startDate: reqType === "Leave" ? startDate : undefined,
      endDate: reqType === "Leave" ? endDate : undefined,
      days: reqType === "Leave" ? Number(daysCount) : undefined,
      amount: reqType === "Purchase" || reqType === "Expense" ? Number(amountVal) : undefined,
      expenseCategory: reqType === "Expense" ? expenseCat : undefined,
      description: description,
      status: "Pending Approval",
      currentApproverEmail: approver,
    };

    setRequests([newReq, ...requests]);
    setShowRequestModal(false);
    setDescription("");

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      try {
        await fetch(`${url}/rest/v1/requests`, {
          method: "POST",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            id: newReq.id,
            timestamp: newReq.timestamp,
            requester_email: newReq.requesterEmail,
            requester_name: newReq.requesterName,
            request_type: newReq.requestType,
            leave_category: newReq.leaveCategory,
            delegated_person: newReq.delegatedPerson,
            start_date: newReq.startDate,
            end_date: newReq.endDate,
            days: newReq.days,
            amount: newReq.amount,
            expense_category: newReq.expenseCategory,
            description: newReq.description,
            status: newReq.status,
            current_approver_email: newReq.currentApproverEmail,
          }),
        });
      } catch (err) {
        console.error("Save request error:", err);
      }
    }
  };

  // Update Request Status (Approve / Reject)
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      try {
        await fetch(`${url}/rest/v1/requests?id=eq.${id}`, {
          method: "PATCH",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch (err) {
        console.error("Status update error:", err);
      }
    }
  };

  // Assign Deliverable
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) return;

    const assignedStaff = profiles.find((p) => p.email === assigneeEmail);

    const newTask: TaskItem = {
      id: "TSK-" + Math.floor(1000 + Math.random() * 9000),
      title: taskTitle,
      category: taskCategory,
      dueDateOrHearing: taskDueDate,
      venue: taskVenue,
      hub: taskHub,
      status: "Pending Action",
      urgency: taskUrgency,
      assigneeEmail: assigneeEmail || sessionUser.email,
      assigneeName: assignedStaff ? assignedStaff.name : sessionUser.name,
      assignedByEmail: sessionUser.email,
      assignedByName: sessionUser.name,
    };

    setTasks([newTask, ...tasks]);
    setShowTaskModal(false);
    setTaskTitle("");

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      try {
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
          }),
        });
      } catch (err) {
        console.error("Save task error:", err);
      }
    }
  };

  if (!sessionUser) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0f172a", fontFamily: "sans-serif" }}>
        <div style={{ background: "#ffffff", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", width: "100%", maxWidth: "420px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ background: "#0f172a", padding: "10px", borderRadius: "10px", color: "#fff" }}>
              <Scale size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>Pakistan Legal United Society</h2>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Staff Authentication Portal</span>
            </div>
          </div>

          {loginError && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px", padding: "8px", background: "#fef2f2", borderRadius: "6px" }}>{loginError}</div>}

          <form onSubmit={handleLogin}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Staff Email</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="e.g. kamanger110@gmail.com"
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "16px", boxSizing: "border-box", fontSize: "14px" }}
            />

            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Access PIN</label>
            <input
              type="password"
              value={loginPin}
              onChange={(e) => setLoginPin(e.target.value)}
              placeholder="Enter PIN"
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "24px", boxSizing: "border-box", fontSize: "14px" }}
            />

            <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#0f172a", color: "#ffffff", fontWeight: "600", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <ShieldCheck size={18} /> Authenticate & Access Hub
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter pending approvals where current user is approver
  const pendingApprovalsForMe = requests.filter(
    (r) => r.currentApproverEmail === sessionUser.email && r.status === "Pending Approval"
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      <header style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "#0f172a", padding: "8px", borderRadius: "8px", color: "#fff" }}>
            <Scale size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h1 style={{ fontSize: "16px", margin: 0, color: "#0f172a", fontWeight: "700" }}>Pakistan Legal United Society</h1>
              <span style={{ fontSize: "10px", backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontWeight: "600", color: "#475569" }}>PLUS OPS</span>
            </div>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Operations, Programs & Governance Hub</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{sessionUser.name}</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{sessionUser.designation} ({sessionUser.role})</div>
          </div>
          <button onClick={() => setSessionUser(null)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", color: "#334155" }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Left Sidebar */}
        <aside style={{ width: "260px", background: "#ffffff", borderRight: "1px solid #e2e8f0", padding: "24px 16px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          <div style={{ marginBottom: "24px" }}>
            <button onClick={() => setShowRequestModal(true)} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 12px rgba(234, 88, 12, 0.2)" }}>
              <Plus size={16} /> Submit Request / Requisition
            </button>
          </div>

          <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", paddingLeft: "10px" }}>
            Operational Modules
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <button onClick={() => setActiveTab("tasks")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: activeTab === "tasks" ? "#0f172a" : "transparent", color: activeTab === "tasks" ? "#ffffff" : "#334155", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "500", fontSize: "13px" }}>
              <LayoutDashboard size={16} /> My Active Work & Tasks
            </button>
            <button onClick={() => setActiveTab("approvals")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: activeTab === "approvals" ? "#0f172a" : "transparent", color: activeTab === "approvals" ? "#ffffff" : "#334155", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "500", fontSize: "13px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "12px" }}><CheckCircle2 size={16} /> Approvals Desk</span>
              {pendingApprovalsForMe.length > 0 && <span style={{ background: "#ea580c", color: "#fff", padding: "2px 6px", borderRadius: "10px", fontSize: "10px", fontWeight: "700" }}>{pendingApprovalsForMe.length}</span>}
            </button>
            <button onClick={() => setActiveTab("finance")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: activeTab === "finance" ? "#0f172a" : "transparent", color: activeTab === "finance" ? "#ffffff" : "#334155", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "500", fontSize: "13px" }}>
              <CreditCard size={16} /> Finance & Grants Desk
            </button>
            <button onClick={() => setActiveTab("staff")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: activeTab === "staff" ? "#0f172a" : "transparent", color: activeTab === "staff" ? "#ffffff" : "#334155", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "500", fontSize: "13px" }}>
              <Users size={16} /> Staff Directory
            </button>
            <button onClick={() => setActiveTab("policies")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: activeTab === "policies" ? "#0f172a" : "transparent", color: activeTab === "policies" ? "#ffffff" : "#334155", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "500", fontSize: "13px" }}>
              <FileText size={16} /> Institutional Policies Hub
            </button>
          </nav>
        </aside>

        {/* Dynamic Center Work Area */}
        <main style={{ flex: 1, padding: "32px", boxSizing: "border-box", overflowY: "auto", maxHeight: "calc(100vh - 73px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {sessionUser.department} • {sessionUser.role}
              </span>
              <h2 style={{ fontSize: "24px", margin: "4px 0 2px 0", color: "#0f172a", fontWeight: "800" }}>
                Welcome back, {sessionUser.name}.
              </h2>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                Operating Node: {sessionUser.hub} | Reporting Line: {sessionUser.manager_email || "Institutional Apex"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              {(sessionUser.role === "ADMIN" || sessionUser.role === "PROGRAM_MGR") && (
                <button onClick={() => setShowTaskModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                  <Plus size={16} /> Assign New Task
                </button>
              )}
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
            <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>ACTIVE TASKS</span>
                <Briefcase size={16} color="#0f172a" />
              </div>
              <h3 style={{ fontSize: "28px", margin: 0, color: "#0f172a", fontWeight: "700" }}>{tasks.length}</h3>
              <span style={{ fontSize: "11px", color: "#64748b" }}>Visible to your role</span>
            </div>

            <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#ea580c" }}>PENDING APPROVALS</span>
                <Clock size={16} color="#ea580c" />
              </div>
              <h3 style={{ fontSize: "28px", margin: 0, color: "#ea580c", fontWeight: "700" }}>{pendingApprovalsForMe.length}</h3>
              <span style={{ fontSize: "11px", color: "#64748b" }}>Requires your action</span>
            </div>

            <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>STAFF ROSTER</span>
                <Users size={16} color="#0f172a" />
              </div>
              <h3 style={{ fontSize: "28px", margin: 0, color: "#0f172a", fontWeight: "700" }}>{profiles.length}</h3>
              <span style={{ fontSize: "11px", color: "#64748b" }}>Registered personnel</span>
            </div>

            <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>MY REQUESTS</span>
                <FileText size={16} color="#0f172a" />
              </div>
              <h3 style={{ fontSize: "28px", margin: 0, color: "#0f172a", fontWeight: "700" }}>
                {requests.filter((r) => r.requesterEmail === sessionUser.email).length}
              </h3>
              <span style={{ fontSize: "11px", color: "#64748b" }}>Submitted queue</span>
            </div>
          </div>

          {/* Tab Content Panels */}
          {activeTab === "tasks" && (
            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#0f172a" }}>My Deliverables & Assigned Operations</h3>
              {tasks.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: "14px" }}>No tasks assigned yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {tasks.map((t) => (
                    <div key={t.id} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", background: "#f8fafc" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <strong style={{ color: "#0f172a", fontSize: "14px" }}>{t.id}</strong>
                          <span style={{ fontSize: "11px", background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px", color: "#334155" }}>{t.category}</span>
                          <span style={{ fontSize: "11px", background: "#e0f2fe", padding: "2px 6px", borderRadius: "4px", color: "#0369a1" }}>{t.hub}</span>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: "600", background: "#fef3c7", color: "#b45309", padding: "4px 8px", borderRadius: "6px" }}>
                          {t.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginBottom: "8px" }}>{t.title}</div>
                      <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#64748b" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={13} /> {t.venue}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Calendar size={13} /> Target Date: {t.dueDateOrHearing}</span>
                        <span>Assignee: <strong>{t.assigneeName}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "approvals" && (
            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#0f172a" }}>Requisitions Awaiting Your Approval</h3>
              {pendingApprovalsForMe.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: "14px" }}>No pending requests queued for your approval.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {pendingApprovalsForMe.map((r) => (
                    <div key={r.id} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", background: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong>{r.id}</strong> — <span style={{ color: "#0284c7", fontWeight: "600" }}>{r.requestType}</span> by <strong>{r.requesterName}</strong>
                          <div style={{ fontSize: "13px", color: "#475569", marginTop: "4px" }}>{r.description}</div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleUpdateStatus(r.id, "Approved")} style={{ padding: "6px 12px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" }}>Approve</button>
                          <button onClick={() => handleUpdateStatus(r.id, "Rejected")} style={{ padding: "6px 12px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" }}>Reject</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "staff" && (
            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>Institutional Staff Directory</h3>
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", width: "240px" }}
                />
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                    <th style={{ padding: "10px" }}>Name</th>
                    <th style={{ padding: "10px" }}>Email</th>
                    <th style={{ padding: "10px" }}>Role</th>
                    <th style={{ padding: "10px" }}>Department</th>
                    <th style={{ padding: "10px" }}>Regional Hub</th>
                    <th style={{ padding: "10px" }}>Reports To</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles
                    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px", fontWeight: "600", color: "#0f172a" }}>{p.name}</td>
                        <td style={{ padding: "10px", color: "#475569" }}>{p.email}</td>
                        <td style={{ padding: "10px" }}><span style={{ padding: "2px 6px", background: "#e2e8f0", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>{p.role}</span></td>
                        <td style={{ padding: "10px", color: "#475569" }}>{p.department}</td>
                        <td style={{ padding: "10px", color: "#475569" }}>{p.hub}</td>
                        <td style={{ padding: "10px", color: "#64748b" }}>{p.manager_email || "None"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "policies" && (
            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#0f172a" }}>Institutional Governance Policies Hub</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                <div style={{ padding: "16px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#f8fafc" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>Financial Standard Operating Procedures</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Guidelines for field travel, procurement quotas, per diems, and expense reporting thresholds.</p>
                </div>
                <div style={{ padding: "16px", border: "1px solid #e2e8f0", borderRadius: "8px", background: "#f8fafc" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>Legal Aid & Case Handling Protocol</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Protocols for legal camps, prison legal aid documentation, and confidential case docket recording.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "finance" && (
            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#0f172a" }}>Finance & Grants Desk</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "10px" }}>ID</th>
                    <th style={{ padding: "10px" }}>Requester</th>
                    <th style={{ padding: "10px" }}>Type</th>
                    <th style={{ padding: "10px" }}>Amount (PKR)</th>
                    <th style={{ padding: "10px" }}>Approver</th>
                    <th style={{ padding: "10px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px", fontWeight: "600" }}>{r.id}</td>
                      <td style={{ padding: "10px" }}>{r.requesterName}</td>
                      <td style={{ padding: "10px" }}>{r.requestType}</td>
                      <td style={{ padding: "10px" }}>{r.amount ? `PKR ${r.amount.toLocaleString()}` : "N/A"}</td>
                      <td style={{ padding: "10px", color: "#64748b" }}>{r.currentApproverEmail}</td>
                      <td style={{ padding: "10px" }}><span style={{ padding: "2px 6px", background: "#fef3c7", color: "#b45309", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Submit Request Modal */}
      {showRequestModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#ffffff", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "500px", boxShadow: "0 20px 25px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#0f172a" }}>Submit Operations / Admin Request</h3>
              <button onClick={() => setShowRequestModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateRequest}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Request Type</label>
              <select value={reqType} onChange={(e) => setReqType(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                <option value="Leave">Leave Requisition</option>
                <option value="Expense">Expense Claim</option>
                <option value="Purchase">Purchase Order</option>
                <option value="Asset">Asset Allocation</option>
              </select>

              {(reqType === "Expense" || reqType === "Purchase") && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Amount (PKR)</label>
                  <input type="number" value={amountVal} onChange={(e) => setAmountVal(Number(e.target.value))} required placeholder="e.g. 25000" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
                </div>
              )}

              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Purpose & Justification</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} placeholder="Detail requirements or justifications..." style={{ width: "100%", padding: "10px", marginBottom: "24px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px" }} />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowRequestModal(false)} style={{ padding: "10px 16px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontWeight: "600", color: "#334155" }}>Cancel</button>
                <button type="submit" style={{ padding: "10px 20px", background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Submit Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showTaskModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#ffffff", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "500px", boxShadow: "0 20px 25px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#0f172a" }}>Initiate & Assign Deliverable</h3>
              <button onClick={() => setShowTaskModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateTask}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Task Title / Deliverable</label>
              <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required placeholder="e.g. Conduct Legal Camp at UC Qasimabad" style={{ width: "100%", padding: "10px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />

              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Assignee (From Staff Directory)</label>
              <select value={assigneeEmail} onChange={(e) => setAssigneeEmail(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "24px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                <option value="">Select Staff Member</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.email}>
                    {p.name} — {p.designation} ({p.hub})
                  </option>
                ))}
              </select>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowTaskModal(false)} style={{ padding: "10px 16px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontWeight: "600", color: "#334155" }}>Cancel</button>
                <button type="submit" style={{ padding: "10px 20px", background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Assign & Dispatch Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
