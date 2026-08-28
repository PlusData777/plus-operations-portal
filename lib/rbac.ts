import type { PortalRequest, PortalRole, RosterMember } from "@/lib/types";
import { normalizedEmail } from "@/lib/authorization";

const recognizedRoles = new Set<PortalRole>(["ADMIN", "EXECUTIVE", "HR_ADMIN", "FINANCE_MGR", "PROGRAM_MGR", "GENERAL_STAFF"]);

function text(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}

export function normalizeRoster(data: unknown): RosterMember[] {
  if (!Array.isArray(data)) return [];
  const members = new Map<string, RosterMember>();

  for (const entry of data) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const rawEmail = text(row.email || row.Email || row.staffEmail || row["Staff Email"]);
    const email = rawEmail.toLowerCase().trim();
    if (!email || !email.includes("@")) continue;

    const rawRole = text(row.role || row.Role || "GENERAL_STAFF").toUpperCase();
    const candidate = rawRole as PortalRole;
    const role: PortalRole = recognizedRoles.has(candidate) ? candidate : "GENERAL_STAFF";

    const rawStatus = text(row.status || row.Status || "Active").toLowerCase();
    if (rawStatus && rawStatus !== "active") continue;

    members.set(email, {
      name: text(row.name || row.Name || row.staffName || row["Staff Name"] || email.split("@")[0]),
      email,
      role,
      designation: text(row.designation || row.Designation || role),
      department: text(row.department || row.Department || "Operations"),
      approvalScope: text(row.approvalScope || row.ApprovalScope || row["Approval Scope"] || "General"),
      status: "Active",
    });
  }

  return Array.from(members.values());
}

export function findRosterMember(roster: unknown, email: string): RosterMember | null {
  if (!email) return null;
  const list = Array.isArray(roster) ? normalizeRoster(roster) : [];
  const target = email.toLowerCase().trim();
  return list.find((m) => m.email.toLowerCase().trim() === target) || null;
}      department: text(row.department),
      approvalScope: text(row.approvalScope),
    });
  }

  return [...members.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function findRosterMember(roster: RosterMember[], email?: string | null) {
  if (!email) return null;
  return roster.find(member => member.email === normalizedEmail(email)) ?? null;
}

export function isPrivilegedRole(role: PortalRole) {
  return role !== "GENERAL_STAFF";
}

export function canAssignTasks(role: PortalRole) {
  return role === "ADMIN" || role === "EXECUTIVE";
}

export function roleLabel(role: PortalRole) {
  return ({
    ADMIN: "Administrator",
    EXECUTIVE: "Executive Board",
    HR_ADMIN: "HR & Administration",
    FINANCE_MGR: "Finance",
    PROGRAM_MGR: "Programs",
    GENERAL_STAFF: "General Staff",
  } as const)[role];
}

export function queueLabel(role: PortalRole) {
  return ({
    ADMIN: "All operations requests",
    EXECUTIVE: "Executive Board queue",
    HR_ADMIN: "HR & Administration queue",
    FINANCE_MGR: "Finance queue",
    PROGRAM_MGR: "Programs queue",
    GENERAL_STAFF: "My submissions",
  } as const)[role];
}

function normalizedRequestText(request: PortalRequest) {
  return `${request.department} ${request.requestType} ${request.justification}`.toLowerCase();
}

function isFinancialRequest(request: PortalRequest) {
  return /expense reimbursement|invoice|claim|vendor payment/.test(normalizedRequestText(request));
}

function claimAmount(request: PortalRequest) {
  if (!isFinancialRequest(request)) return 0;
  const match = request.justification.replace(/,/g, "").match(/(?:pkr|rs\.?|rupees?)?\s*(\d{3,})(?:\s*(?:pkr|rs\.?|rupees?))?/i);
  return match ? Number(match[1]) || 0 : 0;
}

function isManagementLevelRequester(request: PortalRequest, roster: RosterMember[]) {
  const requester = findRosterMember(roster, request.staffEmail);
  return Boolean(requester && (requester.role !== "GENERAL_STAFF" || /manager|lead|head|chief|director|administrator/i.test(requester.designation)));
}

function isExecutiveRequest(request: PortalRequest, roster: RosterMember[]) {
  const text = normalizedRequestText(request);
  return request.department.trim().toLowerCase() === "management"
    || (isFinancialRequest(request) && claimAmount(request) > 50_000)
    || (/leave|absence/.test(text) && isManagementLevelRequester(request, roster))
    || /policy|ceo|board/.test(text);
}

function isHrRequest(request: PortalRequest, roster: RosterMember[]) {
  const text = normalizedRequestText(request);
  return !isExecutiveRequest(request, roster) && /leave|absence|attendance|operational|logistic|facilit|suppl|admin/.test(text);
}

function isFinanceRequest(request: PortalRequest) {
  return isFinancialRequest(request) && claimAmount(request) <= 50_000;
}

function isProgramRequest(request: PortalRequest) {
  return /program|field|travel/.test(normalizedRequestText(request));
}

export function filterRequestsForRole(requests: PortalRequest[], role: PortalRole, roster: RosterMember[]) {
  if (role === "ADMIN") return requests;
  if (role === "EXECUTIVE") return requests.filter(request => isExecutiveRequest(request, roster));
  if (role === "HR_ADMIN") return requests.filter(request => isHrRequest(request, roster));
  if (role === "FINANCE_MGR") return requests.filter(isFinanceRequest);
  if (role === "PROGRAM_MGR") return requests.filter(isProgramRequest);
  return [];
}

export function actionRequiredForEmail(requests: PortalRequest[], email: string) {
  const reviewerEmail = normalizedEmail(email);
  return requests.filter(request => normalizedEmail(request.pendingReviewer ?? "") === reviewerEmail && request.status === "Pending");
}

export function canReviewRequest(request: PortalRequest, reviewer: { role: PortalRole; email: string }, roster: RosterMember[]) {
  if (reviewer.role === "ADMIN") return true;
  if (request.pendingReviewer) return normalizedEmail(request.pendingReviewer) === normalizedEmail(reviewer.email);
  return filterRequestsForRole([request], reviewer.role, roster).length === 1;
}
