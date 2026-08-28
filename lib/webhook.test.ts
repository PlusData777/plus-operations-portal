import { describe, expect, it, vi } from "vitest";
import { assignTask, calculateCockpitKpis, calculateKpis, cancelRequest, createRequest, createTrackingId, listRoster, normalizeWebhookRequests, saveDecision, updateTaskStatus } from "@/lib/webhook";

describe("Google Apps Script Webhook adapter", () => {
  const data = [{ rowNumber: 2, timestamp: "2026-08-27T14:25:54.000Z", staffName: "Rizwana", staffEmail: "JURISTRIZWANA@gmail.com", department: "Management", requestType: "Leave / Absence Request", justification: "Leave requirement", status: "Approved", remarks: "Approved by executive", decisionLog: "Notified" }, { rowNumber: 3, timestamp: "2026-08-27T15:00:00.000Z", staffName: "Atif", staffEmail: "atif@example.com", department: "Finance", requestType: "Expense Reimbursement / Claim", justification: "Claim", status: "Unknown", remarks: "", decisionLog: "" }];
  it("normalizes Webhook rows and treats unknown status as pending", () => { const requests = normalizeWebhookRequests(data); expect(requests[0]?.staffEmail).toBe("atif@example.com"); expect(requests[0]?.status).toBe("Pending"); expect(requests[1]?.status).toBe("Approved"); });
  it("calculates decision KPIs from normalized records", () => { expect(calculateKpis(normalizeWebhookRequests(data))).toEqual({ total: 2, pending: 1, approved: 1, rejected: 0 }); });
  it("calculates approved PKR volume and flags pending reviews older than 48 hours", () => {
    const records = normalizeWebhookRequests([{ ...data[0], status: "Approved", amountPkr: 60000 }, { ...data[1], status: "Pending", timestamp: "2026-01-01T00:00:00.000Z" }]);
    expect(calculateCockpitKpis(records, Date.parse("2026-01-04T00:00:00.000Z"))).toMatchObject({ total: 2, approvalVolumePkr: 60000, slaWarnings: 1 });
  });
  it("sends SUBMIT, DECISION, and ASSIGN_TASK payloads as text/plain while following redirects", async () => {
    const previousEndpoint = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
    process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/test/exec";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, data: [] }), { status: 200 }));
    await createRequest({ category: "LEAVE", projectCode: "GENERAL-ADMIN", justification: "Family commitment", leaveType: "Casual", leaveStartDate: "2026-09-01", leaveEndDate: "2026-09-02", handoverColleagueEmail: "handover@plus.org.pk" }, { name: "A Member", email: "member@plus.org.pk", department: "Management" });
    const pending = normalizeWebhookRequests([{ ...data[1], status: "Pending" }])[0]!;
    await saveDecision(pending, { status: "Rejected", decisionRemarks: "Please submit a revised request." });
    await assignTask(pending, { assignedToEmail: "japheth@example.com", taskNotes: "Verify the supporting invoice." }, "Japheth");
    const calls = fetchMock.mock.calls;
    expect(calls).toHaveLength(3);
    expect(calls[0]?.[1]).toMatchObject({ method: "POST", redirect: "follow", headers: { "Content-Type": "text/plain;charset=utf-8" } });
    expect(JSON.parse(String(calls[0]?.[1]?.body))).toMatchObject({ action: "SUBMIT", category: "LEAVE", projectCode: "GENERAL-ADMIN", durationDays: 2, requiresExecutive: false, tier1Reviewer: "ishfaque.mojai@gmail.com", pendingReviewer: "ishfaque.mojai@gmail.com", staffName: "A Member", staffEmail: "member@plus.org.pk", department: "Management", requestType: "Leave / Absence Request", details: { projectCode: "GENERAL-ADMIN", leaveType: "Casual", handoverColleagueEmail: "handover@plus.org.pk" } });
    expect(JSON.parse(String(calls[0]?.[1]?.body)).trackingId).toMatch(/^PLUS-REQ-\d{4}-[A-F0-9]{8}$/);
    expect(JSON.parse(String(calls[1]?.[1]?.body))).toMatchObject({ action: "DECISION", staffEmail: "atif@example.com", staffName: "Atif", requestType: "Expense Reimbursement / Claim" });
    expect(JSON.parse(String(calls[2]?.[1]?.body))).toMatchObject({ action: "ASSIGN_TASK", rowNumber: pending.rowNumber, assignedToEmail: "japheth@example.com", taskNotes: "Verify the supporting invoice.", projectCode: "GENERAL-ADMIN", amount: 0, requiresExecutive: false, workflowStage: "EXECUTION" });
    fetchMock.mockRestore();
    process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL = previousEndpoint;
  });
  it("marks high-value finance submissions for Finance Audit and Executive Board Clearance", async () => {
    const previousEndpoint = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
    process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/test/exec";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true }), { status: 200 }));
    await createRequest({ category: "FINANCE", projectCode: "PLUS-SINDH-OPS", justification: "Conference vendor invoice", expenseType: "Vendor", amountPkr: 75_000, expenseDate: "2026-09-01", receiptDriveLink: "", paymentPreference: "Bank Transfer" }, { name: "A Member", email: "member@plus.org.pk", department: "Finance" });
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({ category: "FINANCE", projectCode: "PLUS-SINDH-OPS", amount: 75_000, requiresExecutive: true, tier2Reviewer: "dataplus.org@gmail.com", requiresFinanceAuditExecutiveClearance: true, details: { projectCode: "PLUS-SINDH-OPS", amountPkr: 75_000, paymentPreference: "Bank Transfer" } });
    fetchMock.mockRestore();
    process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL = previousEndpoint;
  });
  it("generates a stable-format tracking identifier", () => { expect(createTrackingId(new Date("2026-01-15T00:00:00Z"))).toMatch(/^PLUS-REQ-2026-[A-F0-9]{8}$/); });
  it("accepts an empty successful final response for an assignment while retaining its exact payload", async () => {
    const previousEndpoint = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
    process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/test/exec";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(null, { status: 200 }));
    const pending = normalizeWebhookRequests([{ ...data[1], status: "Pending" }])[0]!;
    await expect(assignTask(pending, { assignedToEmail: "japheth@example.com", taskNotes: "" }, "Japheth")).resolves.toMatchObject({ assignedTo: "japheth@example.com", pendingReviewer: "japheth@example.com" });
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({ action: "ASSIGN_TASK", rowNumber: pending.rowNumber, assignedToEmail: "japheth@example.com", taskNotes: "", workflowStage: "EXECUTION" });
    fetchMock.mockRestore();
    process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL = previousEndpoint;
  });
  it("sends cancellation and task-status payloads as redirect-safe text/plain JSON", async () => {
    const previousEndpoint = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
    process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/test/exec";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true }), { status: 200 }));
    const pending = normalizeWebhookRequests([{ ...data[1], status: "Pending", assignedTo: "member@plus.org.pk" }])[0]!;
    await expect(cancelRequest(pending, "No longer required.")).resolves.toMatchObject({ status: "Cancelled" });
    await expect(updateTaskStatus(pending, { taskStatus: "Completed", taskRemarks: "Delivered to the stated location.", deliverableLink: "https://drive.google.com/file/d/evidence" })).resolves.toMatchObject({ taskStatus: "Completed", workflowStage: "COMPLETED" });
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ method: "POST", redirect: "follow", headers: { "Content-Type": "text/plain;charset=utf-8" } });
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({ action: "CANCEL_REQUEST", rowNumber: pending.rowNumber, cancellationReason: "No longer required.", projectCode: "GENERAL-ADMIN", workflowStage: "CANCELLED" });
    expect(JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body))).toMatchObject({ action: "UPDATE_TASK_STATUS", rowNumber: pending.rowNumber, taskStatus: "Completed", taskRemarks: "Delivered to the stated location.", deliverableLink: "https://drive.google.com/file/d/evidence", workflowStage: "COMPLETED" });
    fetchMock.mockRestore();
    process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL = previousEndpoint;
  });
  it("loads and normalizes the server-filtered active roster", async () => {
    const previousEndpoint = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
    process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/test/exec";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, roster: [{ email: " PLUS@EXAMPLE.COM ", name: "PLUS Member", role: "executive", designation: "CEO", department: "Board", approvalScope: "Final approvals" }, { email: "not-an-email", name: "Ignore" }] }), { status: 200 }));
    await expect(listRoster()).resolves.toEqual([{ email: "plus@example.com", name: "PLUS Member", role: "EXECUTIVE", designation: "CEO", department: "Board", approvalScope: "Final approvals" }]);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("action=GET_ROSTER");
    fetchMock.mockRestore();
    process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL = previousEndpoint;
  });
});
