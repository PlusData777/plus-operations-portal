"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardList, LoaderCircle, RefreshCw, Send, ShieldCheck, UserCheck, UsersRound, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { queueLabel, roleLabel } from "@/lib/rbac";
import type { PortalRole, Kpis, PortalRequest, RequestStatus, RosterMember } from "@/lib/types";

const emptyKpis: Kpis = { total: 0, pending: 0, approved: 0, rejected: 0 };
type Reviewer = { role: PortalRole; name: string; approvalScope: string };
type AssignmentDraft = { assignedToEmail: string; taskNotes: string };

export function ExecutiveCockpit({ user }: { user: Reviewer }) {
  const [requests, setRequests] = useState<PortalRequest[]>([]);
  const [kpis, setKpis] = useState<Kpis>(emptyKpis);
  const [roster, setRoster] = useState<RosterMember[]>([]);
  const [canAssignTasks, setCanAssignTasks] = useState(false);
  const [activeQueueLabel, setActiveQueueLabel] = useState(() => queueLabel(user.role));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [assigning, setAssigning] = useState<number | null>(null);
  const [assignmentRow, setAssignmentRow] = useState<number | null>(null);
  const [assignmentDrafts, setAssignmentDrafts] = useState<Record<number, AssignmentDraft>>({});
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [filter, setFilter] = useState<RequestStatus | "All">("Pending");
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/requests", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRequests(data.requests);
      setKpis(data.kpis);
      setActiveQueueLabel(data.queueLabel || queueLabel(user.role));
      setCanAssignTasks(Boolean(data.canAssignTasks));
      setRoster(Array.isArray(data.roster) ? data.roster : []);
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Unable to load the protected request queue." });
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(() => filter === "All" ? requests : requests.filter(request => request.status === filter), [filter, requests]);
  const cards = [
    { label: "Queue total", value: kpis.total, icon: ClipboardList, tone: "bg-navy/8 text-navy" },
    { label: "Awaiting decision", value: kpis.pending, icon: AlertTriangle, tone: "bg-amber-100 text-amber-700" },
    { label: "Approved", value: kpis.approved, icon: CheckCircle2, tone: "bg-emerald/10 text-emerald" },
    { label: "Rejected", value: kpis.rejected, icon: XCircle, tone: "bg-crimson/10 text-crimson" },
  ];

  function updateAssignmentDraft(rowNumber: number, update: Partial<AssignmentDraft>) {
    setAssignmentDrafts(current => ({ ...current, [rowNumber]: { ...(current[rowNumber] ?? { assignedToEmail: "", taskNotes: "" }), ...update } }));
  }

  async function decide(request: PortalRequest, status: "Approved" | "Rejected") {
    const decisionRemarks = remarks[request.rowNumber]?.trim() ?? "";
    if (!decisionRemarks) {
      setNotice({ kind: "error", text: "Reviewer remarks are required before saving a decision." });
      return;
    }
    setSaving(request.rowNumber);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/requests/${request.rowNumber}/decision`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, decisionRemarks }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRequests(current => current.map(item => item.rowNumber === request.rowNumber ? data.request : item));
      setKpis(current => ({ ...current, pending: current.pending - 1, approved: current.approved + Number(status === "Approved"), rejected: current.rejected + Number(status === "Rejected") }));
      setNotice({ kind: "success", text: "Decision saved. Apps Script has been given the requester details to dispatch the decision email." });
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Unable to save decision." });
    } finally {
      setSaving(null);
    }
  }

  async function assignTask(request: PortalRequest) {
    const draft = assignmentDrafts[request.rowNumber] ?? { assignedToEmail: "", taskNotes: "" };
    const assignee = roster.find(member => member.email === draft.assignedToEmail);
    if (!assignee) {
      setNotice({ kind: "error", text: "Choose an active roster member before assigning a task." });
      return;
    }
    setAssigning(request.rowNumber);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/requests/${request.rowNumber}/assignment`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assignedToEmail: assignee.email, taskNotes: draft.taskNotes }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRequests(current => current.map(item => item.rowNumber === request.rowNumber ? data.request : item));
      setAssignmentRow(null);
      setNotice({ kind: "success", text: `Task assigned to ${assignee.name}. Apps Script recorded the delegation.` });
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Unable to assign this task." });
    } finally {
      setAssigning(null);
    }
  }

  return <div className="space-y-6"><section className="enter"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald">{roleLabel(user.role)}</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy">{activeQueueLabel}.</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">Review only the submissions aligned to your verified roster role. Decisions are protected on the server and saved through the PLUS workflow register.</p>{user.approvalScope && <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-navy/5 px-3 py-2 text-xs font-semibold text-navy"><ShieldCheck size={15} />{user.approvalScope}</p>}</section>{notice && <div role="status" className={`rounded-xl border px-4 py-3 text-sm ${notice.kind === "success" ? "border-emerald/25 bg-emerald/5 text-emerald" : "border-crimson/25 bg-crimson/5 text-crimson"}`}>{notice.text}</div>}<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card, index) => { const Icon = card.icon; return <article key={card.label} className="panel enter p-5" style={{ animationDelay: `${index * 45}ms` }}><div className="flex items-start justify-between"><p className="text-sm font-semibold text-slate-500">{card.label}</p><div className={`rounded-lg p-2 ${card.tone}`}><Icon size={18} /></div></div><p className="mt-5 text-3xl font-extrabold tracking-tight text-navy">{card.value}</p></article>; })}</section>{user.role === "ADMIN" && <section className="panel p-5 sm:p-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-emerald/10 p-2 text-emerald"><UsersRound size={19} /></div><div><h2 className="font-bold text-navy">Active team roster</h2><p className="mt-0.5 text-xs text-slate-500">Live roster records available for administrator task delegation.</p></div></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{roster.map(member => <article key={member.email} className="rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="font-bold text-navy">{member.name}</p><p className="mt-1 text-xs font-semibold text-emerald">{roleLabel(member.role)}</p><p className="mt-2 truncate text-xs text-slate-500">{member.email}</p><p className="mt-1 text-xs text-slate-500">{member.designation || member.department || "Active PLUS staff"}</p></article>)}</div></section>}<section className="panel overflow-hidden"><div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h2 className="font-bold text-navy">{activeQueueLabel}</h2><p className="mt-1 text-xs text-slate-500">Approval and rejection are sent to the protected workflow register.</p></div><div className="flex items-center gap-2"><select aria-label="Filter requests" value={filter} onChange={event => setFilter(event.target.value as typeof filter)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 outline-none focus:border-navy"><option>Pending</option><option>All</option><option>Approved</option><option>Rejected</option></select><button aria-label="Refresh protected request queue" onClick={() => void load()} className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-navy"><RefreshCw size={17} className={loading ? "animate-spin" : ""} /></button></div></div>{loading ? <div className="grid min-h-96 place-items-center text-sm text-slate-500"><LoaderCircle className="mb-3 animate-spin text-navy" size={25} />Loading protected queue…</div> : visible.length === 0 ? <div className="grid min-h-72 place-items-center px-6 text-center"><div><ClipboardList className="mx-auto mb-3 text-slate-300" size={34} /><h3 className="font-bold text-navy">No {filter.toLowerCase()} requests</h3><p className="mt-1 text-sm text-slate-500">New submissions will appear when they match this queue.</p></div></div> : <div className="divide-y divide-slate-100">{visible.map(request => { const draft = assignmentDrafts[request.rowNumber] ?? { assignedToEmail: "", taskNotes: "" }; return <article key={request.rowNumber} className="p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 md:flex-row"><div className="max-w-3xl"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-navy">{request.requestType}</h3><StatusBadge status={request.status} /></div><p className="mt-1 text-xs font-semibold text-slate-500">{request.staffName} · {request.staffEmail} · {request.department} · Submitted {request.timestamp ? new Date(request.timestamp).toLocaleString() : "—"}</p><p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{request.justification}</p>{request.assignedTo && <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald"><UserCheck size={14} />Assigned to: {request.assignedTo}</p>}</div>{request.status === "Pending" ? <div className="w-full shrink-0 md:max-w-sm"><label className="field-label" htmlFor={`remarks-${request.rowNumber}`}>Reviewer remarks</label><textarea id={`remarks-${request.rowNumber}`} className="field-control min-h-24 resize-y" maxLength={1200} value={remarks[request.rowNumber] ?? ""} onChange={event => setRemarks(current => ({ ...current, [request.rowNumber]: event.target.value }))} placeholder="Record the rationale for this decision." /><div className="mt-3 grid grid-cols-2 gap-2"><button disabled={saving === request.rowNumber} onClick={() => void decide(request, "Approved")} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald px-3 py-2.5 text-sm font-bold text-white transition hover:bg-emerald/90 disabled:opacity-60 active:scale-[0.97]"><CheckCircle2 size={16} />Approve</button><button disabled={saving === request.rowNumber} onClick={() => void decide(request, "Rejected")} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-crimson px-3 py-2.5 text-sm font-bold text-white transition hover:bg-crimson/90 disabled:opacity-60 active:scale-[0.97]"><XCircle size={16} />Reject</button></div>{saving === request.rowNumber && <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"><LoaderCircle className="animate-spin" size={13} />Recording decision…</p>}</div> : <div className="w-full shrink-0 rounded-xl bg-slate-50 p-4 text-sm md:max-w-sm"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Reviewer remarks</p><p className="mt-1 whitespace-pre-wrap text-slate-700">{request.remarks || "No additional remarks"}</p><p className="mt-3 text-xs text-slate-500">{request.decisionLog}</p></div>}</div>{canAssignTasks && <div className="mt-5 border-t border-slate-100 pt-4"><button type="button" onClick={() => setAssignmentRow(current => current === request.rowNumber ? null : request.rowNumber)} className="inline-flex items-center gap-2 rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm font-bold text-navy transition hover:bg-navy/5 active:scale-[0.97]"><UserCheck size={16} />Assign task</button>{assignmentRow === request.rowNumber && <form onSubmit={event => { event.preventDefault(); void assignTask(request); }} className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] md:items-end"><label className="block"><span className="field-label">Active team member</span><select required aria-label={`Assignee for request ${request.rowNumber}`} value={draft.assignedToEmail} onChange={event => updateAssignmentDraft(request.rowNumber, { assignedToEmail: event.target.value })} className="field-control"><option value="">Select team member</option>{roster.map(member => <option key={member.email} value={member.email}>{member.name} — {roleLabel(member.role)}</option>)}</select></label><label className="block"><span className="field-label">Task notes (optional)</span><input maxLength={1200} value={draft.taskNotes} onChange={event => updateAssignmentDraft(request.rowNumber, { taskNotes: event.target.value })} className="field-control" placeholder="State the delegated outcome or next action." /></label><button disabled={assigning === request.rowNumber} type="submit" className="inline-flex justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-bold text-white transition hover:bg-navy/90 disabled:opacity-60 active:scale-[0.97]"><Send size={16} />{assigning === request.rowNumber ? "Assigning…" : "Dispatch task"}</button></form>}</div>}</article>; })}</div>}</section></div>;
}
