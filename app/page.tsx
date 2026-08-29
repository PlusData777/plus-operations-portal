"client";

import React, { useState, useEffect } from "react";

// Types for Data Roster
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

    // Save locally
    setRequests([newReq, ...requests]);
    setShowRequestModal(false);
    setDescription("");

    // Push to Supabase
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", fontFamily: "sans-serif" }}>
        <form onSubmit={handleLogin} style={{ background: "#ffffff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" }}>
          <h2 style={{ marginBottom: "8px", color: "#0f172a" }}>Pakistan Legal United Society</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Operations & Legal Aid Hub</p>
          
          {loginError && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{loginError}</div>}

          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Staff Email</label>
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="e.g. user@datamail.com"
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "16px", boxSizing: "border-box" }}
          />

          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>Security PIN (Admin: 9901)</label>
          <input
            type="password"
            value={loginPin}
            onChange={(e) => setLoginPin(e.target.value)}
            placeholder="Enter 4-digit PIN"
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "24px", boxSizing: "border-box" }}
          />

          <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#0f172a", color: "#ffffff", fontWeight: "600", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Verify & Access Workspace
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      <header style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "18px", margin: 0, color: "#0f172a" }}>Pakistan Legal United Society</h1>
          <span style={{ fontSize: "12px", color: "#64748b" }}>Logged in as: {sessionUser.name} ({sessionUser.role})</span>
        </div>
        <button onClick={() => setSessionUser(null)} style={{ padding: "6px 14px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
          Sign Out
        </button>
      </header>

      {/* Main Content Area */}
      <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <button onClick={() => setActiveTab("dashboard")} style={{ padding: "10px 20px", background: activeTab === "dashboard" ? "#0f172a" : "#ffffff", color: activeTab === "dashboard" ? "#ffffff" : "#334155", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            Dashboard Requests
          </button>
          <button onClick={() => setActiveTab("tasks")} style={{ padding: "10px 20px", background: activeTab === "tasks" ? "#0f172a" : "#ffffff", color: activeTab === "tasks" ? "#ffffff" : "#334155", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            Tasks & Deliverables
          </button>
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            <button onClick={() => setShowRequestModal(true)} style={{ padding: "10px 16px", background: "#ea580c", color: "#ffffff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
              + Submit Request
            </button>
            <button onClick={() => setShowTaskModal(true)} style={{ padding: "10px 16px", background: "#0284c7", color: "#ffffff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
              + Assign Task
            </button>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ marginTop: 0, color: "#0f172a" }}>Active Requests & Requisitions</h3>
            {requests.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "14px" }}>No requests found. Click "+ Submit Request" to create one.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "10px" }}>ID</th>
                    <th style={{ padding: "10px" }}>Requester</th>
                    <th style={{ padding: "10px" }}>Type</th>
                    <th style={{ padding: "10px" }}>Description</th>
                    <th style={{ padding: "10px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px", fontWeight: "600" }}>{r.id}</td>
                      <td style={{ padding: "10px" }}>{r.requesterName}</td>
                      <td style={{ padding: "10px" }}>{r.requestType}</td>
                      <td style={{ padding: "10px" }}>{r.description}</td>
                      <td style={{ padding: "10px" }}><span style={{ padding: "4px 8px", background: "#fef3c7", color: "#b45309", borderRadius: "4px", fontSize: "12px" }}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "tasks" && (
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ marginTop: 0, color: "#0f172a" }}>Tasks & Deliverables Log</h3>
            {tasks.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "14px" }}>No tasks assigned yet. Click "+ Assign Task" to create one.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "10px" }}>ID</th>
                    <th style={{ padding: "10px" }}>Title</th>
                    <th style={{ padding: "10px" }}>Category</th>
                    <th style={{ padding: "10px" }}>Assignee</th>
                    <th style={{ padding: "10px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px", fontWeight: "600" }}>{t.id}</td>
                      <td style={{ padding: "10px" }}>{t.title}</td>
                      <td style={{ padding: "10px" }}>{t.category}</td>
                      <td style={{ padding: "10px" }}>{t.assigneeName}</td>
                      <td style={{ padding: "10px" }}><span style={{ padding: "4px 8px", background: "#e0f2fe", color: "#0369a1", borderRadius: "4px", fontSize: "12px" }}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#ffffff", padding: "32px", borderRadius: "12px", width: "100%", maxWidth: "500px" }}>
            <h3 style={{ marginTop: 0 }}>Submit Requisition</h3>
            <form onSubmit={handleCreateRequest}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Request Type</label>
              <select value={reqType} onChange={(e) => setReqType(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "16px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                <option value="Leave">Leave</option>
                <option value="Expense">Expense</option>
                <option value="Purchase">Purchase</option>
                <option value="Asset">Asset</option>
              </select>

              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Purpose & Justification</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} placeholder="Provide justification..." />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowRequestModal(false)} style={{ padding: "10px 16px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "10px 16px", background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Submit Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#ffffff", padding: "32px", borderRadius: "12px", width: "100%", maxWidth: "500px" }}>
            <h3 style={{ marginTop: 0 }}>Assign Deliverable</h3>
            <form onSubmit={handleCreateTask}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Task Title</label>
              <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required placeholder="e.g. Conduct Legal Camp" style={{ width: "100%", padding: "10px", marginBottom: "16px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />

              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>Assignee Email</label>
              <input type="email" value={assigneeEmail} onChange={(e) => setAssigneeEmail(e.target.value)} placeholder="subordinate@datamail.com" style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowTaskModal(false)} style={{ padding: "10px 16px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "10px 16px", background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Assign & Dispatch Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
