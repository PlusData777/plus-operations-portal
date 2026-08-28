import { describe, expect, it } from "vitest";
import { actionRequiredForEmail, canAssignTasks, filterRequestsForRole, findRosterMember, normalizeRoster } from "@/lib/rbac";
import type { PortalRequest, RosterMember } from "@/lib/types";

const roster: RosterMember[] = normalizeRoster([
  { email: "admin@plus.org", name: "Admin", role: "ADMIN", designation: "Administrator" },
  { email: "executive@plus.org", name: "Executive", role: "EXECUTIVE", designation: "CEO" },
  { email: "hr@plus.org", name: "HR", role: "HR_ADMIN", designation: "HR Lead" },
  { email: "finance@plus.org", name: "Finance", role: "FINANCE_MGR", designation: "Finance Manager" },
  { email: "program@plus.org", name: "Program", role: "PROGRAM_MGR", designation: "Program Manager" },
]);

function request(rowNumber: number, department: string, requestType: string, justification: string, staffEmail = "staff@plus.org"): PortalRequest {
  return { rowNumber, timestamp: "2026-08-28T00:00:00.000Z", staffName: "Staff", staffEmail, department, requestType, justification, status: "Pending", remarks: "", decisionLog: "" };
}

const requests = [
  request(2, "Management", "Leave / Absence Request", "Board clearance", "executive@plus.org"),
  request(3, "Operations", "Leave / Absence Request", "Two days leave"),
  request(4, "Finance", "Expense Reimbursement / Claim", "45000 PKR for vendor invoice"),
  request(5, "Programs", "Travel & Field Visit Clearance", "Field monitoring visit"),
  request(6, "Finance", "Expense Reimbursement / Claim", "75000 PKR high-value claim"),
];

describe("roster-backed role policy", () => {
  it("treats returned roster presence as active authorization and normalizes role data", () => {
    expect(findRosterMember(roster, "EXECUTIVE@plus.org")?.role).toBe("EXECUTIVE");
    expect(findRosterMember(roster, "unknown@plus.org")).toBeNull();
    expect(normalizeRoster([{ email: "member@plus.org", role: "UNRECOGNIZED" }])[0]?.role).toBe("GENERAL_STAFF");
  });

  it("routes each privileged role to its prescribed protected queue", () => {
    expect(filterRequestsForRole(requests, "ADMIN", roster)).toHaveLength(5);
    expect(filterRequestsForRole(requests, "EXECUTIVE", roster).map(item => item.rowNumber)).toEqual([2, 6]);
    expect(filterRequestsForRole(requests, "HR_ADMIN", roster).map(item => item.rowNumber)).toEqual([3]);
    expect(filterRequestsForRole(requests, "FINANCE_MGR", roster).map(item => item.rowNumber)).toEqual([4]);
    expect(filterRequestsForRole(requests, "PROGRAM_MGR", roster).map(item => item.rowNumber)).toEqual([5]);
    expect(filterRequestsForRole(requests, "GENERAL_STAFF", roster)).toEqual([]);
  });

  it("limits task delegation to Administrators and Executives", () => {
    expect(canAssignTasks("ADMIN")).toBe(true);
    expect(canAssignTasks("EXECUTIVE")).toBe(true);
    expect(canAssignTasks("HR_ADMIN")).toBe(false);
    expect(canAssignTasks("GENERAL_STAFF")).toBe(false);
  });

  it("limits Action Required items to the exact matrix-pending reviewer", () => {
    const matrixRequests = [
      { ...requests[0], pendingReviewer: "finance@plus.org" },
      { ...requests[1], pendingReviewer: "EXECUTIVE@PLUS.ORG" },
      { ...requests[2], status: "Approved" as const, pendingReviewer: "finance@plus.org" },
    ];
    expect(actionRequiredForEmail(matrixRequests, "FINANCE@PLUS.ORG").map(item => item.rowNumber)).toEqual([2]);
    expect(actionRequiredForEmail(matrixRequests, "executive@plus.org").map(item => item.rowNumber)).toEqual([3]);
  });
});
