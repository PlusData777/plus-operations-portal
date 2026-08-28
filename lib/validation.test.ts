import { describe, expect, it } from "vitest";
import { cancellationSchema, decisionSchema, requestSchema, taskStatusUpdateSchema } from "@/lib/validation";

describe("portal request validation", () => {
  it("accepts and normalizes each category-specific submission", () => {
    const leave = requestSchema.parse({ category: "LEAVE", projectCode: "GENERAL-ADMIN", justification: "  Please approve   leave. ", leaveType: "Casual", leaveStartDate: "2026-09-01", leaveEndDate: "2026-09-03", handoverColleagueEmail: " TEAM@PLUS.ORG " });
    expect(leave).toMatchObject({ category: "LEAVE", justification: "Please approve leave.", handoverColleagueEmail: "team@plus.org" });
    const finance = requestSchema.parse({ category: "FINANCE", projectCode: "PLUS-SINDH-OPS", justification: "Invoice reimbursement", expenseType: "Vendor", amountPkr: "55000", expenseDate: "2026-09-01", receiptDriveLink: "https://drive.google.com/file/d/abc", paymentPreference: "Bank Transfer" });
    expect(finance).toMatchObject({ category: "FINANCE", amountPkr: 55000, paymentPreference: "Bank Transfer" });
    expect(requestSchema.parse({ category: "FINANCE", projectCode: "GENERAL-ADMIN", justification: "Office supplies", expenseType: "Office", amountPkr: 2500, expenseDate: "2026-09-01", paymentPreference: "Cash" })).toMatchObject({ receiptDriveLink: "" });
    const procurement = requestSchema.parse({ category: "PROCUREMENT", projectCode: "GENERAL-ADMIN", justification: "Printer cartridges", itemDescription: "  Printer cartridges ", quantity: "4", urgencyLevel: "Urgent", deliveryLocation: "Head Office" });
    expect(procurement).toMatchObject({ category: "PROCUREMENT", itemDescription: "Printer cartridges", quantity: 4 });
    const program = requestSchema.parse({ category: "PROGRAM", projectCode: "PLUS-LEGAL-AID-2026", justification: "Field clearance", projectNameOrCode: "PLUS-77", activityLocation: "Karachi", budgetEstimatePkr: 10000, transportRequired: true });
    expect(program).toMatchObject({ category: "PROGRAM", transportRequired: true, budgetEstimatePkr: 10000 });
  });
  it("rejects invalid category dates, amounts, and mandatory conditional fields", () => {
    expect(() => requestSchema.parse({ category: "LEAVE", projectCode: "GENERAL-ADMIN", justification: "Leave", leaveType: "Casual", leaveStartDate: "2026-09-03", leaveEndDate: "2026-09-01", handoverColleagueEmail: "team@plus.org" })).toThrow();
    expect(() => requestSchema.parse({ category: "FINANCE", projectCode: "GENERAL-ADMIN", justification: "Expense", expenseType: "Travel", amountPkr: 0, expenseDate: "2026-09-01", receiptDriveLink: "", paymentPreference: "Cash" })).toThrow();
  });
  it("requires a final decision with executive remarks", () => {
    expect(() => decisionSchema.parse({ status: "Pending", decisionRemarks: "Waiting" })).toThrow();
    expect(() => decisionSchema.parse({ status: "Approved", decisionRemarks: "" })).toThrow();
  });
  it("requires a cancellation reason and task-update remarks", () => {
    expect(cancellationSchema.safeParse({ cancellationReason: "" }).success).toBe(false);
    expect(taskStatusUpdateSchema.safeParse({ taskStatus: "Completed", taskRemarks: "Delivered", deliverableLink: "" }).success).toBe(false);
    expect(taskStatusUpdateSchema.safeParse({ taskStatus: "Completed", taskRemarks: "Delivered", deliverableLink: "https://drive.google.com/file/d/evidence" }).success).toBe(true);
  });
});
