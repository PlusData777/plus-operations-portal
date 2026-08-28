import { describe, expect, it } from "vitest";
import { assignedRequests, canCancelRequest, canUpdateAssignedTask, personalRequests } from "@/lib/request-access";
import type { PortalRequest } from "@/lib/types";

const item = (staffEmail: string): PortalRequest => ({ rowNumber: 2, timestamp: "2026-08-27T10:00:00.000Z", staffName: "Member", staffEmail, department: "Management", requestType: "Leave / Absence Request", justification: "Details", status: "Pending", remarks: "", decisionLog: "" });
 describe("staff request access", () => {
  it("returns only requests belonging to the authenticated email", () => { const requests = personalRequests([item("other@plus.org.pk"), item("Staff@PLUS.org.pk")], "staff@plus.org.pk"); expect(requests).toHaveLength(1); expect(requests[0]?.staffEmail).toBe("Staff@PLUS.org.pk"); });
  it("filters assignments and protects cancellation or task updates by active email", () => {
    const pending = { ...item("member@plus.org.pk"), rowNumber: 3, assignedTo: "member@plus.org.pk" };
    const approved = { ...item("other@plus.org.pk"), rowNumber: 4, status: "Approved" as const, assignedTo: "other@plus.org.pk" };
    expect(assignedRequests([pending, approved], "MEMBER@plus.org.pk")).toHaveLength(1);
    expect(canCancelRequest(pending, "member@plus.org.pk")).toBe(true);
    expect(canCancelRequest(approved, "other@plus.org.pk")).toBe(false);
    expect(canUpdateAssignedTask(pending, "member@plus.org.pk")).toBe(true);
    expect(canUpdateAssignedTask(pending, "other@plus.org.pk")).toBe(false);
  });
 });
