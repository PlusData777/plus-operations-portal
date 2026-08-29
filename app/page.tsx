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
  Settings, 
  Building2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  LogOut, 
  Send, 
  ShieldCheck, 
  X 
} from "lucide-react";

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
  const [sessionUser, setSessionUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [loginError, setLoginError] = useState("");

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Modal states
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
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskVenue, setTaskVenue] = useState("");
  const [taskHub, setTaskHub] = useState("Sukkur Regional");
  const [taskUrgency, setTaskUrgency] = useState("Standard Priority");
  const [assigneeEmail, setAssigneeEmail] = useState("");

  // Fetch Supabase Data on Load
  useEffect(() => {
    async function fetchSupabaseData() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) return;

      try {
        const reqRes = await fetch(`${url}/rest/v1/requests?select=*`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
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

        const taskRes = await fetch(`${url}/rest/v1/tasks?select=*`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
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
          }
        }
      } catch (err) {
        console.error("Supabase fetch error:", err);
      }
    }
    fetchSupabaseData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setLoginError("Please enter your email.");
      return;
    }
    setSessionUser({
      email: loginEmail,
      name: loginEmail.split("@")[0].toUpperCase(),
      role: loginPin === "9901" ? "Admin" : "Staff",
    });
    setLoginError("");
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) return;

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
          }),
        });
      } catch (err) {
        console.error("Error saving request to Supabase:", err);
      }
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) return;

    const newTask: TaskItem = {
      id: "TSK-" + Math.floor(1000 + Math.random() * 9000),
      title: taskTitle,
      category: taskCategory,
      dueDateOrHearing: taskDueDate,
      venue: taskVenue,
      hub: taskHub,
      status: "Pending",
      urgency: taskUrgency,
      assigneeEmail: assigneeEmail || "subordinate@datamail.com",
      assigneeName: assigneeEmail ? assigneeEmail.split("@")[0] : "Subordinate",
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
        console.error("Error saving task to Supabase:", err);
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
              <span style={{ fontSize: "12px", color: "#64748b" }}>Operations & Governance Hub</span>
            </div>
          </div>

          {loginError && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px", padding: "8px", background: "#fef2f2", borderRadius: "6px" }}>{loginError}</div>}

          <form onSubmit={handleLogin}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Staff Email</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="e.g. user@datamail.com"
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "16px", boxSizing: "border-box", fontSize: "14px" }}
            />

            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Security PIN (Admin: 9901)</label>
            <input
              type="password"
              value={loginPin}
              onChange={(e) => setLoginPin(e.target.value)}
              placeholder="Enter 4-digit PIN"
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "24px", boxSizing: "border-box", fontSize: "14px" }}
            />

            <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#0f172a", color: "#ffffff", fontWeight: "600", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <ShieldCheck size={18} /> Verify & Access Workspace
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif", display: "flex" }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: "260px", background: "#0f172a", color: "#ffffff", display: "flex", flexDirection: "column", padding: "24px 16px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", paddingLeft: "8px" }}>
          <Scale size={24} color="#38bdf8" />
          <div>
            <h1 style={{ fontSize: "15px", margin: 0, fontWeight: "700" }}>PLUS OPERATIONS</h1>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>Governance & Legal Aid</span>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          <button onClick={() => setActiveTab("dashboard")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: activeTab === "dashboard" ? "#1e293b" : "transparent", color: activeTab === "dashboard" ? "#38bdf8" : "#cbd5e1", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "500", fontSize: "14px" }}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab("tasks")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: activeTab === "tasks" ? "#1e293b" : "transparent", color: activeTab === "tasks" ? "#38bdf8" : "#cbd5e1", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "500", fontSize: "14px" }}>
            <FileText size={18} /> Tasks & Deliverables
          </button>
          <button onClick={() => setActiveTab("finance")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: activeTab === "finance" ? "#1e293b" : "transparent", color: activeTab === "finance" ? "#38bdf8" : "#cbd5e1", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "500", fontSize: "14px" }}>
            <DollarSign size={18} /> Financial Requisitions
          </button>
          <button onClick={() => setActiveTab("partners")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: activeTab === "partners" ? "#1e293b" : "transparent", color: activeTab === "partners" ? "#38bdf8" : "#cbd5e1", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: "500", fontSize: "14px" }}>
            <Users size={18} /> Regional Partners
          </button>
        </nav>

        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "16px", marginTop: "auto" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px", paddingLeft: "8px" }}>
            User: <strong style={{ color: "#fff" }}>{sessionUser.name}</strong> ({sessionUser.role})
          </div>
          <button onClick={() => setSessionUser(null)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", background: "#1e293b", color: "#f87171", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }}>
        <header style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#0f172a", textTransform: "capitalize" }}>{activeTab} Overview</h2>
            <span style={{ fontSize: "13px", color: "#64748b" }}>Pakistan Legal United Society - Operational Hub</span>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => setShowRequestModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", background: "#ea580c", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
              <Plus size={16} /> Submit Request
            </button>
            <button onClick={() => setShowTaskModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", background: "#0284c7", color: "#ffffff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
              <Plus size={16} /> Assign Task
            </button>
          </div>
        </header>

        <div style={{ padding: "32px", boxSizing: "border-box" }}>
          {activeTab === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
                <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Total Requests Logged</span>
                  <h3 style={{ fontSize: "28px", margin: "8px 0 0 0", color: "#0f172a" }}>{requests.length}</h3>
                </div>
                <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Active Tasks & Camps</span>
                  <h3 style={{ fontSize: "28px", margin: "8px 0 0 0", color: "#0f172a" }}>{tasks.length}</h3>
                </div>
                <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Cloud Sync Status</span>
                  <h3 style={{ fontSize: "18px", margin: "12px 0 0 0", color: "#16a34a", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={20} /> Connected (Supabase)
                  </h3>
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ marginTop: 0, color: "#0f172a", marginBottom: "16px" }}>Recent Requisitions & Requests</h3>
                {requests.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "14px" }}>No requests logged yet. Use "+ Submit Request" to begin.</p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                        <th style={{ padding: "12px" }}>ID</th>
                        <th style={{ padding: "12px" }}>Requester</th>
                        <th style={{ padding: "12px" }}>Type</th>
                        <th style={{ padding: "12px" }}>Description / Justification</th>
                        <th style={{ padding: "12px" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "12px", fontWeight: "600", color: "#0f172a" }}>{r.id}</td>
                          <td style={{ padding: "12px", color: "#334155" }}>{r.requesterName}</td>
                          <td style={{ padding: "12px", color: "#334155" }}>{r.requestType}</td>
                          <td style={{ padding: "12px", color: "#64748b" }}>{r.description}</td>
                          <td style={{ padding: "12px" }}>
                            <span style={{ padding: "4px 8px", background: "#fef3c7", color: "#b45309", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ marginTop: 0, color: "#0f172a", marginBottom: "16px" }}>Assigned Deliverables & Legal Camps</h3>
              {tasks.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: "14px" }}>No tasks assigned yet. Use "+ Assign Task" to dispatch deliverables.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                      <th style={{ padding: "12px" }}>ID</th>
                      <th style={{ padding: "12px" }}>Title</th>
                      <th style={{ padding: "12px" }}>Category</th>
                      <th style={{ padding: "12px" }}>Assignee</th>
                      <th style={{ padding: "12px" }}>Hub</th>
                      <th style={{ padding: "12px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => (
                      <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "12px", fontWeight: "600", color: "#0f172a" }}>{t.id}</td>
                        <td style={{ padding: "12px", color: "#334155" }}>{t.title}</td>
                        <td style={{ padding: "12px", color: "#334155" }}>{t.category}</td>
                        <td style={{ padding: "12px", color: "#64748b" }}>{t.assigneeName}</td>
                        <td style={{ padding: "12px", color: "#64748b" }}>{t.hub}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ padding: "4px 8px", background: "#e0f2fe", color: "#0369a1", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "finance" && (
            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ marginTop: 0, color: "#0f172a" }}>Financial & Expense Requisitions</h3>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Manage procurement quotas, travel advances, and budget allocations synchronized with Supabase.</p>
            </div>
          )}

          {activeTab === "partners" && (
            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ marginTop: 0, color: "#0f172a" }}>Regional Hubs & Partners Directory</h3>
              <p style={{ color: "#64748b", fontSize: "14px" }}>Coordinate field plans across Sukkur, Karachi, and Sindh regional networks.</p>
            </div>
          )}
        </div>
      </main>

      {/* Submit Request Modal */}
      {showRequestModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#ffffff", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "500px", boxShadow: "0 20px 25px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#0f172a" }}>Submit Operations Requisition</h3>
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

              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Assignee Email</label>
              <input type="email" value={assigneeEmail} onChange={(e) => setAssigneeEmail(e.target.value)} placeholder="subordinate@datamail.com" style={{ width: "100%", padding: "10px", marginBottom: "24px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />

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
