import type { PortalRequest, PortalRole, RosterMember } from "@/lib/types";
import { normalizedEmail } from "@/lib/authorization";

const recognizedRoles = new Set<PortalRole>([
  "ADMIN",
  "EXECUTIVE",
  "HR_ADMIN",
  "FINANCE_MGR",
  "PROGRAM_MGR",
  "GENERAL_STAFF",
]);

function text(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}

export function isPrivilegedRole(role: PortalRole | string | null | undefined): boolean {
  if (!role) return false;
  const upper = String(role).toUpperCase();
  return upper === "ADMIN" || upper === "EXECUTIVE" || upper === "HR_ADMIN" || upper === "FINANCE_MGR" || upper === "PROGRAM_MGR";
}

export function canAssignTasks(role: PortalRole | string | null | undefined): boolean {
  if (!role) return false;
  const upper = String(role).toUpperCase();
  return upper === "ADMIN" || upper === "EXECUTIVE" || upper === "PROGRAM_MGR";
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
}
