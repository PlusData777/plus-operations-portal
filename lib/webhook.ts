import { randomUUID } from "node:crypto";
import type { ProjectCode, RequestCategory, RequestDecision, PortalRequest, CockpitKpis, Kpis, RosterMember, TaskAssignment, TaskStatus, TaskStatusUpdate, WorkflowStage } from "@/lib/types";
import { normalizeRoster } from "@/lib/rbac";
import type { RequestInput } from "@/lib/validation";
import { advanceApprovalRouting, deriveApprovalRouting, type ApprovalRouting } from "@/lib/approval-matrix";

type WebhookEnvelope = { success?: boolean; data?: unknown; roster?: unknown; error?: string };
type WorkflowFields = { projectCode: string; durationDays: number; amount: number; requiresExecutive: boolean; tier1Reviewer: string; tier2Reviewer: string; pendingReviewer: string; workflowStage: WorkflowStage; deliverableLink: string };
type SubmitPayload = WorkflowFields & { action: "SUBMIT"; trackingId: string; category: RequestCategory; staffName: string; staffEmail: string; department: string; requestType: string; justification: string; details: Record<string, string | number | boolean>; requiresFinanceAuditExecutiveClearance: boolean; };
type DecisionPayload = WorkflowFields & { action: "DECISION"; rowNumber: number; decision: string; remarks: string; staffEmail: string; staffName: string; requestType: string; };
type AssignmentPayload = WorkflowFields & TaskAssignment & { action: "ASSIGN_TASK"; rowNumber: number; };
type CancellationPayload = WorkflowFields & { action: "CANCEL_REQUEST"; rowNumber: number; cancellationReason: string; };
type TaskStatusPayload = WorkflowFields & TaskStatusUpdate & { action: "UPDATE_TASK_STATUS"; rowNumber: number; };

function endpoint() {
  const value = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
  if (!value) throw new Error("Google Apps Script Webhook endpoint is not configured.");
  return value;
}

function readText(value: unknown) { return typeof value === "string" || typeof value === "number" ? String(value) : ""; }

function parseCategory(value: unknown, requestType: string): RequestCategory | undefined {
  const category = readText(value).toUpperCase();
  if (["LEAVE", "FINANCE", "PROCUREMENT", "PROGRAM"].includes(category)) return category as RequestCategory;
  if (/leave|absence/i.test(requestType)) return "LEAVE";
  if (/expense|finance|claim/i.test(requestType)) return "FINANCE";
  if (/procurement|logistics|operational support/i.test(requestType)) return "PROCUREMENT";
  if (/program|field|legal/i.test(requestType)) return "PROGRAM";
  return undefined;
}

function parseAmount(value: unknown) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : undefined;
}
function parsePositiveInteger(value: unknown) { const number = Number(value); return Number.isInteger(number) && number >= 0 ? number : undefined; }
function parseBoolean(value: unknown) { return value === true || String(value).toLowerCase() === "true"; }
function parseProjectCode(value: unknown): ProjectCode | undefined { const code = readText(value); return code === "PLUS-LEGAL-AID-2026" || code === "PLUS-SINDH-OPS" || code === "PLUS-COMMUNITY-OUTREACH" || code === "GENERAL-ADMIN" ? code : undefined; }
function parseStage(value: unknown): WorkflowStage | undefined { const stage = readText(value); return stage === "TIER_1_REVIEW" || stage === "TIER_2_EXECUTIVE" || stage === "EXECUTION" || stage === "COMPLETED" || stage === "REJECTED" || stage === "CANCELLED" ? stage : undefined; }
function workflowFields(request: PortalRequest): WorkflowFields {
  const fallback = deriveApprovalRouting({ category: request.category ?? "PROCUREMENT", projectCode: request.projectCode ?? "GENERAL-ADMIN", durationDays: request.durationDays, amount: request.amountPkr });
  return { projectCode: request.projectCode ?? fallback.projectCode, durationDays: request.durationDays ?? fallback.durationDays, amount: request.amountPkr ?? fallback.amount, requiresExecutive: request.requiresExecutive ?? fallback.requiresExecutive, tier1Reviewer: request.tier1Reviewer ?? fallback.tier1Reviewer, tier2Reviewer: request.tier2Reviewer ?? fallback.tier2Reviewer, pendingReviewer: request.pendingReviewer ?? fallback.pendingReviewer, workflowStage: request.workflowStage ?? fallback.workflowStage, deliverableLink: request.deliverableLink ?? "" };
}

export function normalizeWebhookRequests(data: unknown): PortalRequest[] {
  if (!Array.isArray(data)) return [];
  return data.flatMap(item => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const rowNumber = Number(row.rowNumber);
    if (!Number.isInteger(rowNumber) || rowNumber < 2) return [];
    const rawStatus = readText(row.status);
    const status: PortalRequest["status"] = rawStatus === "Approved" || rawStatus === "Rejected" || rawStatus === "Cancelled" ? rawStatus : "Pending";
    const requestType = readText(row.requestType);
    const rawTaskStatus = readText(row.taskStatus);
    const taskStatus: TaskStatus | undefined = rawTaskStatus === "In Progress" || rawTaskStatus === "Completed" || rawTaskStatus === "Needs Clarification" ? rawTaskStatus as TaskStatus : undefined;
    const category = parseCategory(row.category, requestType);
    const projectCode = parseProjectCode(row.projectCode);
    const durationDays = parsePositiveInteger(row.durationDays);
    const amountPkr = parseAmount(row.amountPkr);
    const fallback = category ? deriveApprovalRouting({ category, projectCode: projectCode ?? "GENERAL-ADMIN", durationDays, amount: amountPkr }) : undefined;
    return [{ rowNumber, timestamp: readText(row.timestamp), trackingId: readText(row.trackingId), category, projectCode, staffName: readText(row.staffName), staffEmail: readText(row.staffEmail).trim().toLowerCase(), department: readText(row.department), requestType, justification: readText(row.justification), status, remarks: readText(row.remarks), assignedTo: readText(row.assignedTo), taskStatus, taskRemarks: readText(row.taskRemarks), deliverableLink: readText(row.deliverableLink), cancellationReason: readText(row.cancellationReason), durationDays, amountPkr, requiresExecutive: row.requiresExecutive === undefined ? fallback?.requiresExecutive : parseBoolean(row.requiresExecutive), tier1Reviewer: readText(row.tier1Reviewer) || fallback?.tier1Reviewer, tier2Reviewer: readText(row.tier2Reviewer) || fallback?.tier2Reviewer, pendingReviewer: readText(row.pendingReviewer) || (status === "Pending" ? fallback?.pendingReviewer : ""), workflowStage: parseStage(row.workflowStage) ?? (status === "Cancelled" ? "CANCELLED" : status === "Rejected" ? "REJECTED" : taskStatus === "Completed" ? "COMPLETED" : status === "Approved" ? "EXECUTION" : fallback?.workflowStage), decisionLog: readText(row.decisionLog) }];
  }).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

async function parseResponse(response: Response, allowEmptySuccess = false): Promise<WebhookEnvelope> {
  const raw = await response.text();
  if (!raw.trim() && allowEmptySuccess && response.ok) return { success: true };
  try { return JSON.parse(raw) as WebhookEnvelope; }
  catch { throw new Error("The Webhook returned an unexpected response."); }
}

async function invokeWebhook(payload?: SubmitPayload | DecisionPayload | AssignmentPayload | CancellationPayload | TaskStatusPayload, allowEmptySuccess = false): Promise<WebhookEnvelope> {
  const response = await fetch(endpoint(), payload ? { method: "POST", redirect: "follow", cache: "no-store", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) } : { method: "GET", redirect: "follow", cache: "no-store" });
  const data = await parseResponse(response, allowEmptySuccess);
  if (!response.ok || data.success !== true) throw new Error(data.error || "The Webhook could not complete the request.");
  return data;
}

export async function listRequests() { return normalizeWebhookRequests((await invokeWebhook()).data); }
export async function listRoster(): Promise<RosterMember[]> {
  const url = new URL(endpoint());
  url.searchParams.set("action", "GET_ROSTER");
  const response = await fetch(url, { method: "GET", redirect: "follow", cache: "no-store" });
  const data = await parseResponse(response);
  if (!response.ok || data.success !== true) throw new Error(data.error || "The Webhook could not load the active staff roster.");
  return normalizeRoster(data.roster);
}
function requestType(category: RequestCategory) { return ({ LEAVE: "Leave / Absence Request", FINANCE: "Expense Reimbursement / Claim", PROCUREMENT: "Procurement & Logistics Request", PROGRAM: "Program & Field Operations Request" })[category]; }
function requestDetails(input: RequestInput): Record<string, string | number | boolean> {
  switch (input.category) {
    case "LEAVE": return { projectCode: input.projectCode, leaveType: input.leaveType, leaveStartDate: input.leaveStartDate, leaveEndDate: input.leaveEndDate, handoverColleagueEmail: input.handoverColleagueEmail };
    case "FINANCE": return { projectCode: input.projectCode, expenseType: input.expenseType, amountPkr: input.amountPkr, expenseDate: input.expenseDate, receiptDriveLink: input.receiptDriveLink, paymentPreference: input.paymentPreference };
    case "PROCUREMENT": return { projectCode: input.projectCode, itemDescription: input.itemDescription, quantity: input.quantity, urgencyLevel: input.urgencyLevel, deliveryLocation: input.deliveryLocation };
    case "PROGRAM": return { projectCode: input.projectCode, projectNameOrCode: input.projectNameOrCode, activityLocation: input.activityLocation, budgetEstimatePkr: input.budgetEstimatePkr, transportRequired: input.transportRequired };
  }
}
export function createTrackingId(date = new Date()) { return `PLUS-REQ-${date.getUTCFullYear()}-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`; }
export async function createRequest(input: RequestInput, user: { name: string; email: string; department: string }) {
  const trackingId = createTrackingId();
  const durationDays = input.category === "LEAVE" ? Math.floor((Date.parse(`${input.leaveEndDate}T00:00:00Z`) - Date.parse(`${input.leaveStartDate}T00:00:00Z`)) / 86_400_000) + 1 : 0;
  const amount = input.category === "FINANCE" ? input.amountPkr : input.category === "PROGRAM" ? input.budgetEstimatePkr : 0;
  const routing = deriveApprovalRouting({ category: input.category, projectCode: input.projectCode, durationDays, amount });
  const requiresFinanceAuditExecutiveClearance = input.category === "FINANCE" && routing.requiresExecutive;
  await invokeWebhook({ action: "SUBMIT", trackingId, category: input.category, staffName: user.name.slice(0, 160), staffEmail: user.email, department: user.department || "Other", requestType: requestType(input.category), justification: input.justification, details: requestDetails(input), requiresFinanceAuditExecutiveClearance, ...routing, deliverableLink: "" });
  return { trackingId, requiresFinanceAuditExecutiveClearance, routing };
}
export async function saveDecision(request: PortalRequest, decision: RequestDecision, administratorOverride = false) {
  if (request.status !== "Pending") throw new Error("This request has already received a decision.");
  const transition = advanceApprovalRouting(workflowFields(request) as ApprovalRouting, decision.status, administratorOverride);
  const { resultingStatus, webhookDecision, ...nextWorkflow } = transition;
  await invokeWebhook({ action: "DECISION", rowNumber: request.rowNumber, decision: webhookDecision, remarks: decision.decisionRemarks, staffEmail: request.staffEmail, staffName: request.staffName, requestType: request.requestType, deliverableLink: request.deliverableLink ?? "", ...nextWorkflow });
  return { ...request, ...nextWorkflow, status: resultingStatus, remarks: decision.decisionRemarks };
}
export async function assignTask(request: PortalRequest, assignment: TaskAssignment, assigneeName: string) {
  const workflow = workflowFields(request);
  await invokeWebhook({ action: "ASSIGN_TASK", rowNumber: request.rowNumber, assignedToEmail: assignment.assignedToEmail, taskNotes: assignment.taskNotes, ...workflow, pendingReviewer: assignment.assignedToEmail, workflowStage: "EXECUTION" }, true);
  return { ...request, ...workflow, assignedTo: assignment.assignedToEmail, pendingReviewer: assignment.assignedToEmail, workflowStage: "EXECUTION" as const };
}
export async function cancelRequest(request: PortalRequest, cancellationReason: string) {
  if (request.status !== "Pending") throw new Error("Only requests awaiting review can be cancelled.");
  const workflow = workflowFields(request);
  await invokeWebhook({ action: "CANCEL_REQUEST", rowNumber: request.rowNumber, cancellationReason, ...workflow, pendingReviewer: "", workflowStage: "CANCELLED" });
  return { ...request, ...workflow, status: "Cancelled" as const, pendingReviewer: "", workflowStage: "CANCELLED" as const, cancellationReason, remarks: `Cancelled by requester: ${cancellationReason}` };
}
export async function updateTaskStatus(request: PortalRequest, update: TaskStatusUpdate) {
  const workflow = workflowFields(request);
  const workflowStage = update.taskStatus === "Completed" ? "COMPLETED" as const : "EXECUTION" as const;
  await invokeWebhook({ action: "UPDATE_TASK_STATUS", rowNumber: request.rowNumber, ...workflow, ...update, pendingReviewer: request.assignedTo ?? "", workflowStage });
  return { ...request, ...workflow, taskStatus: update.taskStatus, taskRemarks: update.taskRemarks, deliverableLink: update.deliverableLink, workflowStage };
}
export function calculateKpis(requests: PortalRequest[]): Kpis { return requests.reduce<Kpis>((summary, request) => ({ total: summary.total + 1, pending: summary.pending + Number(request.status === "Pending"), approved: summary.approved + Number(request.status === "Approved"), rejected: summary.rejected + Number(request.status === "Rejected") }), { total: 0, pending: 0, approved: 0, rejected: 0 }); }
function recoveredAmount(request: PortalRequest) {
  if (request.amountPkr !== undefined) return request.amountPkr;
  const match = request.justification.match(/(?:PKR|Rs\.?)[\s:]*([\d,]+(?:\.\d{1,2})?)/i) ?? request.justification.match(/(?:amount|claim)[\s:]*([\d,]+(?:\.\d{1,2})?)/i);
  const value = Number(match?.[1]?.replace(/,/g, ""));
  return Number.isFinite(value) && value >= 0 ? value : 0;
}
export function calculateCockpitKpis(requests: PortalRequest[], now = Date.now()): CockpitKpis {
  const basic = calculateKpis(requests);
  return requests.reduce<CockpitKpis>((summary, request) => {
    const timestamp = Date.parse(request.timestamp);
    return { ...summary, approvalVolumePkr: summary.approvalVolumePkr + (request.status === "Approved" ? recoveredAmount(request) : 0), slaWarnings: summary.slaWarnings + Number(request.status === "Pending" && Number.isFinite(timestamp) && now - timestamp > 48 * 60 * 60 * 1000) };
  }, { ...basic, approvalVolumePkr: 0, slaWarnings: 0 });
}
