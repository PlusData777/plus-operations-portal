"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardList, Download, LoaderCircle, Printer, RefreshCw, Search, Send, ShieldCheck, UserCheck, UsersRound, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { WorkflowStepper } from "@/components/workflow-stepper";
import { queueLabel, roleLabel } from "@/lib/rbac";
import { REQUEST_CATEGORIES, REQUEST_CATEGORY_LABELS, type CockpitKpis, type PortalRole, type PortalRequest, type RequestCategory, type RequestStatus, type RosterMember } from "@/lib/types";

type Reviewer = { role: PortalRole; name: string; approvalScope: string };
type AssignmentDraft = { assignedToEmail: string; taskNotes: string };
type Tab = "queue" | "roster";
const emptyKpis: CockpitKpis = { total: 0, pending: 0, approved: 0, rejected: 0, approvalVolumePkr: 0, slaWarnings: 0 };

function requestCategory(request: PortalRequest): RequestCategory | "OTHER" {
  if (request.category) return request.category;
  if (/leave|absence/i.test(request.requestType)) return "LEAVE";
  if (/expense|finance|claim/i.test(request.requestType)) return "FINANCE";
  if (/procurement|logistics|operational support/i.test(request.requestType)) return "PROCUREMENT";
  if (/program|field|legal/i.test(request.requestType)) return "PROGRAM";
  return "OTHER";
}
function csvCell(value: unknown) { const text = String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }
function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character); }
function pkr(value: number) { return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(value); }

export function AdvancedExecutiveCockpit({ user }: { user: Reviewer }) {
  const [requests, setRequests] = useState<PortalRequest[]>([]);
  const [kpis, setKpis] = useState<CockpitKpis>(emptyKpis);
  const [roster, setRoster] = useState<RosterMember[]>([]);
  const [canAssignTasks, setCanAssignTasks] = useState(false);
  const [queueName, setQueueName] = useState(() => queueLabel(user.role));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [assigning, setAssigning] = useState<number | null>(null);
  const [assignmentRow, setAssignmentRow] = useState<number | null>(null);
  const [assignmentDrafts, setAssignmentDrafts] = useState<Record<number, AssignmentDraft>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "All">("Pending");
  const [categoryFilter, setCategoryFilter] = useState<RequestCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("queue");
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/requests", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRequests(Array.isArray(data.requests) ? data.requests : []);
      setKpis(data.kpis ?? emptyKpis);
      setQueueName(data.queueLabel || queueLabel(user.role));
      setCanAssignTasks(Boolean(data.canAssignTasks));
      setRoster(Array.isArray(data.roster) ? data.roster : []);
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Unable to load the protected request queue." });
    } finally { setLoading(false); }
  }, [user.role]);
  useEffect(() => { void load(); }, [load]);

  const visible = useMemo(() => requests.filter(request => {
    const category = requestCategory(request);
    const date = request.timestamp ? new Date(request.timestamp).toISOString().slice(0, 10) : "";
    const content = `${request.trackingId ?? ""} ${request.staffName} ${request.staffEmail} ${request.requestType} ${request.justification}`.toLowerCase();
    return (statusFilter === "All" || request.status === statusFilter) && (categoryFilter === "All" || category === categoryFilter) && (!search.trim() || content.includes(search.trim().toLowerCase())) && (!startDate || date >= startDate) && (!endDate || date <= endDate);
  }), [categoryFilter, endDate, requests, search, startDate, statusFilter]);

  const cards = [
    { label: "Queue total", value: kpis.total, icon: ClipboardList, tone: "bg-navy/8 text-navy" },
    { label: "Pending reviews", value: kpis.pending, icon: AlertTriangle, tone: "bg-amber-100 text-amber-700" },
    { label: "Approved PKR volume", value: pkr(kpis.approvalVolumePkr), icon: CheckCircle2, tone: "bg-emerald/10 text-emerald" },
    { label: ">48h SLA warnings", value: kpis.slaWarnings, icon: AlertTriangle, tone: "bg-crimson/10 text-crimson" },
  ];
  function setAssignment(row: number, update: Partial<AssignmentDraft>) { setAssignmentDrafts(current => ({ ...current, [row]: { ...(current[row] ?? { assignedToEmail: "", taskNotes: "" }), ...update } })); }
  async function decide(request: PortalRequest, status: "Approved" | "Rejected") {
    const decisionRemarks = remarks[request.rowNumber]?.trim() ?? "";
    if (!decisionRemarks) { setNotice({ kind: "error", text: "Reviewer remarks are required before saving a decision." }); return; }
    setSaving(request.rowNumber); setNotice(null);
    try {
      const response = await fetch(`/api/admin/requests/${request.rowNumber}/decision`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, decisionRemarks }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setRequests(current => current.map(item => item.rowNumber === request.rowNumber ? data.request : item));
      setKpis(current => ({ ...current, pending: Math.max(0, current.pending - 1), approved: current.approved + Number(status === "Approved"), rejected: current.rejected + Number(status === "Rejected") }));
      setNotice({ kind: "success", text: "Decision saved and sent to the PLUS workflow register." });
    } catch (error) { setNotice({ kind: "error", text: error instanceof Error ? error.message : "Unable to save decision." }); } finally { setSaving(null); }
  }
  async function assignTask(request: PortalRequest) {
    const draft = assignmentDrafts[request.rowNumber] ?? { assignedToEmail: "", taskNotes: "" };
    const assignee = roster.find(member => member.email === draft.assignedToEmail);
    if (!assignee) { setNotice({ kind: "error", text: "Choose an active roster member before assigning a task." }); return; }
    setAssigning(request.rowNumber); setNotice(null);
    try {
      const response = await fetch(`/api/admin/requests/${request.rowNumber}/assignment`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assignedToEmail: assignee.email, taskNotes: draft.taskNotes }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setRequests(current => current.map(item => item.rowNumber === request.rowNumber ? data.request : item)); setAssignmentRow(null);
      setNotice({ kind: "success", text: `Task assigned to ${assignee.name}.` });
    } catch (error) { setNotice({ kind: "error", text: error instanceof Error ? error.message : "Unable to assign this task." }); } finally { setAssigning(null); }
  }
  function exportCsv() {
    const headings = ["Tracking ID", "Row", "Submitted", "Requester", "Email", "Department", "Category", "Request type", "Status", "Amount PKR", "Assigned to", "Remarks"];
    const rows = visible.map(item => [item.trackingId || "", item.rowNumber, item.timestamp, item.staffName, item.staffEmail, item.department, requestCategory(item), item.requestType, item.status, item.amountPkr ?? "", item.assignedTo ?? "", item.remarks]);
    const url = URL.createObjectURL(new Blob([[headings, ...rows].map(row => row.map(csvCell).join(",")).join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `plus-approval-queue-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
  }
  function printVoucher(request: PortalRequest) {
    const popup = window.open("", "_blank", "width=850,height=900");
    if (!popup) { setNotice({ kind: "error", text: "Your browser blocked the print window. Allow pop-ups and try again." }); return; }
    popup.document.write(`<!doctype html><html><head><title>PLUS Approval Voucher</title><style>body{font-family:Arial,sans-serif;color:#1d3557;padding:42px;max-width:760px;margin:auto}header{display:flex;justify-content:space-between;border-bottom:3px solid #1d3557;padding-bottom:20px}h1{font-size:24px;margin:0}small{color:#475569}dl{display:grid;grid-template-columns:180px 1fr;gap:12px 18px;margin-top:32px}dt{font-weight:700;color:#334155}dd{margin:0;white-space:pre-wrap}.stamp{margin-top:36px;border:2px solid #16a34a;color:#16a34a;display:inline-block;padding:9px 14px;font-weight:700;letter-spacing:.08em}@media print{body{padding:20px}}</style></head><body><header><div><h1>Pakistan Legal United Society</h1><small>Operations & Approval Portal · Approval Voucher</small></div><strong>APPROVED</strong></header><dl><dt>Tracking ID</dt><dd>${escapeHtml(request.trackingId || `PLUS-ROW-${request.rowNumber}`)}</dd><dt>Requester</dt><dd>${escapeHtml(request.staffName)} (${escapeHtml(request.staffEmail)})</dd><dt>Department</dt><dd>${escapeHtml(request.department)}</dd><dt>Request type</dt><dd>${escapeHtml(request.requestType)}</dd><dt>Submitted</dt><dd>${escapeHtml(request.timestamp ? new Date(request.timestamp).toLocaleString() : "—")}</dd><dt>Justification</dt><dd>${escapeHtml(request.justification)}</dd><dt>Decision remarks</dt><dd>${escapeHtml(request.remarks || "No additional remarks")}</dd></dl><div class="stamp">APPROVED FOR OPERATIONAL PROCESSING</div><script>window.onload=()=>window.print();<\/script></body></html>`);
    popup.document.close();
  }

  return <div className="space-y-6"><section className="enter"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald">{roleLabel(user.role)}</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy">{queueName}.</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">Review requests within your verified roster scope. Decisions and assignments are re-authorized on the server before reaching the PLUS workflow register.</p>{user.approvalScope && <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-navy/5 px-3 py-2 text-xs font-semibold text-navy"><ShieldCheck size={15} />{user.approvalScope}</p>}</section>{notice && <div role="status" className={`rounded-xl border px-4 py-3 text-sm ${notice.kind === "success" ? "border-emerald/25 bg-emerald/5 text-emerald" : "border-crimson/25 bg-crimson/5 text-crimson"}`}>{notice.text}</div>}<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card, index) => { const Icon = card.icon; return <article key={card.label} className="panel enter p-5" style={{ animationDelay: `${index * 45}ms` }}><div className="flex items-start justify-between"><p className="text-sm font-semibold text-slate-500">{card.label}</p><div className={`rounded-lg p-2 ${card.tone}`}><Icon size={18} /></div></div><p className="mt-5 text-2xl font-extrabold tracking-tight text-navy">{card.value}</p>{card.label === "Approved PKR volume" && <p className="mt-1 text-[11px] text-slate-500">Reported request amounts</p>}</article>; })}</section><section className="panel overflow-hidden"><div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="flex gap-2"><button type="button" onClick={() => setActiveTab("queue")} className={`rounded-lg px-3 py-2 text-sm font-bold ${activeTab === "queue" ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-100"}`}>Approval queue</button><button type="button" onClick={() => setActiveTab("roster")} className={`rounded-lg px-3 py-2 text-sm font-bold ${activeTab === "roster" ? "bg-navy text-white" : "text-slate-600 hover:bg-slate-100"}`}>Staff roster</button></div><div className="flex gap-2"><button type="button" onClick={exportCsv} disabled={activeTab !== "queue" || visible.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-navy disabled:opacity-50"><Download size={16} />Export CSV</button><button aria-label="Refresh protected request queue" onClick={() => void load()} className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-navy"><RefreshCw size={17} className={loading ? "animate-spin" : ""} /></button></div></div>{activeTab === "roster" ? <div className="p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><div className="rounded-lg bg-emerald/10 p-2 text-emerald"><UsersRound size={19} /></div><div><h2 className="font-bold text-navy">Active team roster</h2><p className="mt-0.5 text-xs text-slate-500">Read-only active staff roles from the protected roster feed.</p></div></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{roster.map(member => <article key={member.email} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="font-bold text-navy">{member.name}</p><p className="mt-1 text-xs font-semibold text-emerald">{roleLabel(member.role)}</p><p className="mt-2 truncate text-xs text-slate-500">{member.email}</p><p className="mt-1 text-xs text-slate-500">{member.designation || member.department || "Active PLUS staff"}</p></article>)}</div></div> : <><div className="border-b border-slate-100 px-5 py-5 sm:px-6"><div className="flex flex-col gap-3 lg:flex-row"><label className="relative block flex-1"><span className="sr-only">Search requests</span><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input value={search} onChange={event => setSearch(event.target.value)} className="field-control pl-9" placeholder="Search tracking ID, requester, email, or request text" /></label><select aria-label="Filter by status" value={statusFilter} onChange={event => setStatusFilter(event.target.value as typeof statusFilter)} className="field-control lg:max-w-40"><option value="Pending">Pending</option><option value="All">All statuses</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option><option value="Cancelled">Cancelled</option></select><select aria-label="Filter by category" value={categoryFilter} onChange={event => setCategoryFilter(event.target.value as typeof categoryFilter)} className="field-control lg:max-w-56"><option value="All">All categories</option>{REQUEST_CATEGORIES.map(category => <option key={category} value={category}>{REQUEST_CATEGORY_LABELS[category]}</option>)}</select><input aria-label="Start date" type="date" value={startDate} onChange={event => setStartDate(event.target.value)} className="field-control lg:max-w-44" /><input aria-label="End date" type="date" value={endDate} onChange={event => setEndDate(event.target.value)} className="field-control lg:max-w-44" /></div><p className="mt-3 text-xs text-slate-500">Showing {visible.length} of {requests.length} requests in your protected queue.</p></div>{loading ? <div className="grid min-h-96 place-items-center text-sm text-slate-500"><LoaderCircle className="mb-3 animate-spin text-navy" size={25} />Loading protected queue…</div> : visible.length === 0 ? <div className="grid min-h-72 place-items-center px-6 text-center"><div><ClipboardList className="mx-auto mb-3 text-slate-300" size={34} /><h3 className="font-bold text-navy">No matching requests</h3><p className="mt-1 text-sm text-slate-500">Adjust the search or filters to inspect another part of the queue.</p></div></div> : <div className="divide-y divide-slate-100">{visible.map(request => { const draft = assignmentDrafts[request.rowNumber] ?? { assignedToEmail: "", taskNotes: "" }; const category = requestCategory(request); return <article key={request.rowNumber} className="space-y-5 p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 md:flex-row"><div className="max-w-3xl"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-navy">{request.requestType}</h3><StatusBadge status={request.status} /><span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{category === "OTHER" ? "Other" : REQUEST_CATEGORY_LABELS[category]}</span></div><p className="mt-1 text-xs font-semibold text-slate-500">{request.staffName} · {request.staffEmail} · {request.department} · Submitted {request.timestamp ? new Date(request.timestamp).toLocaleString() : "—"}</p>{request.trackingId && <p className="mt-2 font-mono text-[11px] font-bold text-navy">{request.trackingId}</p>}<p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{request.justification}</p></div>{request.status === "Pending" ? <div className="w-full shrink-0 md:max-w-sm"><label className="field-label" htmlFor={`remarks-${request.rowNumber}`}>Reviewer remarks</label><textarea id={`remarks-${request.rowNumber}`} className="field-control min-h-24 resize-y" maxLength={1200} value={remarks[request.rowNumber] ?? ""} onChange={event => setRemarks(current => ({ ...current, [request.rowNumber]: event.target.value }))} placeholder="Record the rationale for this decision." /><div className="mt-3 grid grid-cols-2 gap-2"><button disabled={saving === request.rowNumber} onClick={() => void decide(request, "Approved")} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald px-3 py-2.5 text-sm font-bold text-white transition hover:bg-emerald/90 disabled:opacity-60 active:scale-[0.97]"><CheckCircle2 size={16} />Approve</button><button disabled={saving === request.rowNumber} onClick={() => void decide(request, "Rejected")} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-crimson px-3 py-2.5 text-sm font-bold text-white transition hover:bg-crimson/90 disabled:opacity-60 active:scale-[0.97]"><XCircle size={16} />Reject</button></div></div> : <div className="w-full shrink-0 rounded-xl bg-slate-50 p-4 text-sm md:max-w-sm"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Workflow remarks</p><p className="mt-1 whitespace-pre-wrap text-slate-700">{request.remarks || request.cancellationReason || "No additional remarks"}</p>{request.status === "Approved" && <button type="button" onClick={() => printVoucher(request)} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald/30 bg-white px-3 py-2 text-xs font-bold text-emerald transition hover:bg-emerald/5"><Printer size={14} />Print approval voucher</button>}</div>}</div><WorkflowStepper request={request} />{canAssignTasks && request.status !== "Cancelled" && <div className="border-t border-slate-100 pt-4"><button type="button" onClick={() => setAssignmentRow(current => current === request.rowNumber ? null : request.rowNumber)} className="inline-flex items-center gap-2 rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm font-bold text-navy transition hover:bg-navy/5 active:scale-[0.97]"><UserCheck size={16} />Assign task</button>{assignmentRow === request.rowNumber && <form onSubmit={event => { event.preventDefault(); void assignTask(request); }} className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] md:items-end"><label className="block"><span className="field-label">Active team member</span><select required aria-label={`Assignee for request ${request.rowNumber}`} value={draft.assignedToEmail} onChange={event => setAssignment(request.rowNumber, { assignedToEmail: event.target.value })} className="field-control"><option value="">Select team member</option>{roster.map(member => <option key={member.email} value={member.email}>{member.name} — {roleLabel(member.role)}</option>)}</select></label><label className="block"><span className="field-label">Task notes (optional)</span><input maxLength={1200} value={draft.taskNotes} onChange={event => setAssignment(request.rowNumber, { taskNotes: event.target.value })} className="field-control" placeholder="State the delegated outcome or next action." /></label><button disabled={assigning === request.rowNumber} type="submit" className="inline-flex justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-navy/90 disabled:opacity-60 active:scale-[0.97]"><Send size={16} />{assigning === request.rowNumber ? "Assigning…" : "Dispatch task"}</button></form>}</div>}</article>; })}</div>}</>}</section></div>;
}
