import type { ProjectCode, RequestCategory, WorkflowStage } from "@/lib/types";

export const APPROVAL_MATRIX = {
  LEAVE: { tier1Reviewer: "ishfaque.mojai@gmail.com", tier2Reviewer: "dataplus.org@gmail.com" },
  FINANCE: { tier1Reviewer: "japheth.wilson123@gmail.com", tier2Reviewer: "dataplus.org@gmail.com" },
  PROGRAM: { tier1Reviewer: "salmahabibbhutto88@gmail.com", tier2Reviewer: "dataplus.org@gmail.com" },
  PROCUREMENT: { tier1Reviewer: "dataplus.org@gmail.com", tier2Reviewer: "" },
} as const;

export type ApprovalRouting = { projectCode: ProjectCode; durationDays: number; amount: number; requiresExecutive: boolean; tier1Reviewer: string; tier2Reviewer: string; pendingReviewer: string; workflowStage: WorkflowStage };

export function deriveApprovalRouting(input: { category: RequestCategory; projectCode: ProjectCode; durationDays?: number; amount?: number }): ApprovalRouting {
  const durationDays = Math.max(0, Math.trunc(input.durationDays ?? 0));
  const amount = Math.max(0, input.amount ?? 0);
  const requiresExecutive = (input.category === "LEAVE" && durationDays > 3) || ((input.category === "FINANCE" || input.category === "PROGRAM") && amount > 50_000);
  const reviewers = APPROVAL_MATRIX[input.category];
  return { projectCode: input.projectCode, durationDays, amount, requiresExecutive, tier1Reviewer: reviewers.tier1Reviewer, tier2Reviewer: requiresExecutive ? reviewers.tier2Reviewer : "", pendingReviewer: reviewers.tier1Reviewer, workflowStage: "TIER_1_REVIEW" };
}

export function advanceApprovalRouting(routing: ApprovalRouting, decision: "Approved" | "Rejected", administratorOverride = false) {
  if (decision === "Rejected") return { ...routing, pendingReviewer: "", workflowStage: "REJECTED" as const, resultingStatus: "Rejected" as const, webhookDecision: "Rejected" };
  if (routing.requiresExecutive && routing.workflowStage === "TIER_1_REVIEW" && !administratorOverride) return { ...routing, pendingReviewer: routing.tier2Reviewer, workflowStage: "TIER_2_EXECUTIVE" as const, resultingStatus: "Pending" as const, webhookDecision: "Tier 1 approved — awaiting Executive Clearance" };
  return { ...routing, pendingReviewer: "", workflowStage: "EXECUTION" as const, resultingStatus: "Approved" as const, webhookDecision: "Approved" };
}
