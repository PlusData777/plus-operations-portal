import { Check, CircleDotDashed, UserRoundCheck } from "lucide-react";
import type { PortalRequest } from "@/lib/types";

type Step = { label: string; detail: string; state: "complete" | "current" | "upcoming" };

function workflowFor(request: PortalRequest): { steps: Step[]; holder: string } {
  const stage = request.workflowStage ?? (request.status === "Cancelled" ? "CANCELLED" : request.status === "Rejected" ? "REJECTED" : request.taskStatus === "Completed" ? "COMPLETED" : request.assignedTo ? "EXECUTION" : request.status === "Approved" ? "EXECUTION" : "TIER_1_REVIEW");
  const closed = stage === "REJECTED" || stage === "CANCELLED";
  const isTierOne = stage === "TIER_1_REVIEW";
  const isTierTwo = stage === "TIER_2_EXECUTIVE";
  const executing = stage === "EXECUTION";
  const complete = stage === "COMPLETED";
  const steps: Step[] = [
    { label: "Submitted", detail: "Request recorded", state: "complete" },
    { label: "Tier 1 review", detail: isTierOne ? `With ${request.pendingReviewer || request.tier1Reviewer || "assigned reviewer"}` : "Tier 1 complete", state: isTierOne ? "current" : "complete" },
    { label: "Tier 2 executive clearance", detail: request.requiresExecutive ? (isTierTwo ? `With ${request.pendingReviewer || request.tier2Reviewer || "Executive Board"}` : stage === "TIER_1_REVIEW" ? "Escalates after Tier 1" : "Executive clearance complete") : "Not required by matrix", state: isTierTwo ? "current" : request.requiresExecutive ? "complete" : "upcoming" },
    { label: "Execution", detail: executing ? `With ${request.pendingReviewer || request.assignedTo || "operations desk"}` : complete ? "Execution complete" : "Begins after approval", state: executing ? "current" : complete ? "complete" : "upcoming" },
    { label: "Completed", detail: complete ? "Evidence recorded" : "Awaiting completion", state: complete ? "complete" : "upcoming" },
  ];
  if (closed) return { steps, holder: request.status === "Cancelled" ? "Cancelled by requester" : "Decision closed" };
  if (request.pendingReviewer) return { steps, holder: request.pendingReviewer };
  if (request.assignedTo) return { steps, holder: request.assignedTo };
  return { steps, holder: "Workflow register" };
}

export function WorkflowStepper({ request, compact = false }: { request: PortalRequest; compact?: boolean }) {
  const { steps, holder } = workflowFor(request);
  return <section aria-label="Five-stage approval workflow status" className={`rounded-xl border border-slate-100 bg-slate-50 ${compact ? "p-3" : "p-4"}`}>
    <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">Operational workflow</p><p className="inline-flex items-center gap-1.5 text-xs font-bold text-navy"><UserRoundCheck size={14} />Current holder: {holder}</p></div>
    <ol className="mt-4 grid gap-3 sm:grid-cols-5">
      {steps.map((step, index) => <li key={step.label} className="relative min-w-0 sm:pr-2">
        {index < steps.length - 1 && <span aria-hidden className="absolute left-7 top-3 hidden h-px w-[calc(100%-1rem)] bg-slate-200 sm:block" />}
        <div className="relative flex items-start gap-2.5">
          <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${step.state === "complete" ? "bg-emerald text-white" : step.state === "current" ? "bg-navy text-white" : "bg-white text-slate-400 ring-1 ring-slate-200"}`}>{step.state === "complete" ? <Check size={14} strokeWidth={3} /> : step.state === "current" ? <CircleDotDashed size={14} /> : index + 1}</span>
          <span className="min-w-0"><span className="block text-xs font-bold leading-tight text-navy">{index + 1}. {step.label}</span><span className="mt-1 block text-[11px] leading-tight text-slate-500">{step.detail}</span></span>
        </div>
      </li>)}
    </ol>
  </section>;
}
