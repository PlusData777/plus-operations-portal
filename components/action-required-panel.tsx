"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, LoaderCircle, UserCheck } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { WorkflowStepper } from "@/components/workflow-stepper";
import type { PortalRequest } from "@/lib/types";

export function ActionRequiredPanel() {
  const [requests, setRequests] = useState<PortalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { void (async () => { try { const response = await fetch("/api/admin/requests", { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setRequests(Array.isArray(data.actionRequired) ? data.actionRequired : []); } catch (issue) { setError(issue instanceof Error ? issue.message : "Unable to load action items."); } finally { setLoading(false); } })(); }, []);
  return <section className="panel overflow-hidden"><div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6"><div className="rounded-lg bg-amber-100 p-2 text-amber-700"><AlertTriangle size={18} /></div><div><h2 className="font-bold text-navy">Action required by you</h2><p className="mt-1 text-xs text-slate-500">Only requests whose matrix-derived pending reviewer matches your active roster email.</p></div></div>{loading ? <div className="grid min-h-28 place-items-center text-sm text-slate-500"><LoaderCircle className="mr-2 inline animate-spin" size={16} />Loading action items…</div> : error ? <p className="px-5 py-5 text-sm text-crimson">{error}</p> : requests.length === 0 ? <p className="px-5 py-6 text-sm text-slate-500">No approvals are currently awaiting your action.</p> : <div className="divide-y divide-slate-100">{requests.map(request => <article key={request.rowNumber} className="space-y-3 p-5 sm:px-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><p className="font-bold text-navy">{request.requestType}</p><StatusBadge status={request.status} /></div><p className="mt-1 text-xs text-slate-500">{request.trackingId || `Register row ${request.rowNumber}`} · {request.staffName} · Pending reviewer: {request.pendingReviewer}</p></div><a href={`#request-${request.rowNumber}`} className="inline-flex items-center gap-2 rounded-lg border border-navy/20 px-3 py-2 text-xs font-bold text-navy hover:bg-navy/5"><UserCheck size={14} />Review item</a></div><WorkflowStepper request={request} compact /></article>)}</div>}</section>;
}
