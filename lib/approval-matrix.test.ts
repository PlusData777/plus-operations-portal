import { describe, expect, it } from "vitest";
import { advanceApprovalRouting, deriveApprovalRouting } from "@/lib/approval-matrix";

describe("three-tier approval matrix", () => {
  it("routes leave, finance, field, and logistics requests to their correct Tier 1 reviewer", () => {
    expect(deriveApprovalRouting({ category: "LEAVE", projectCode: "GENERAL-ADMIN", durationDays: 2 }).tier1Reviewer).toBe("ishfaque.mojai@gmail.com");
    expect(deriveApprovalRouting({ category: "FINANCE", projectCode: "GENERAL-ADMIN", amount: 10_000 }).tier1Reviewer).toBe("japheth.wilson123@gmail.com");
    expect(deriveApprovalRouting({ category: "PROGRAM", projectCode: "PLUS-LEGAL-AID-2026", amount: 10_000 }).tier1Reviewer).toBe("salmahabibbhutto88@gmail.com");
    expect(deriveApprovalRouting({ category: "PROCUREMENT", projectCode: "GENERAL-ADMIN" }).tier1Reviewer).toBe("dataplus.org@gmail.com");
  });
  it("escalates long leave, high finance, and high field budgets to Executive Clearance", () => {
    expect(deriveApprovalRouting({ category: "LEAVE", projectCode: "GENERAL-ADMIN", durationDays: 4 })).toMatchObject({ requiresExecutive: true, tier2Reviewer: "dataplus.org@gmail.com", pendingReviewer: "ishfaque.mojai@gmail.com" });
    expect(deriveApprovalRouting({ category: "FINANCE", projectCode: "PLUS-SINDH-OPS", amount: 50_001 }).requiresExecutive).toBe(true);
    expect(deriveApprovalRouting({ category: "PROGRAM", projectCode: "PLUS-LEGAL-AID-2026", amount: 50_001 }).requiresExecutive).toBe(true);
  });
  it("moves a tier-one approval to executive clearance before final execution", () => {
    const routing = deriveApprovalRouting({ category: "FINANCE", projectCode: "GENERAL-ADMIN", amount: 75_000 });
    expect(advanceApprovalRouting(routing, "Approved")).toMatchObject({ resultingStatus: "Pending", workflowStage: "TIER_2_EXECUTIVE", pendingReviewer: "dataplus.org@gmail.com" });
    expect(advanceApprovalRouting({ ...routing, workflowStage: "TIER_2_EXECUTIVE", pendingReviewer: "dataplus.org@gmail.com" }, "Approved")).toMatchObject({ resultingStatus: "Approved", workflowStage: "EXECUTION" });
  });
});
