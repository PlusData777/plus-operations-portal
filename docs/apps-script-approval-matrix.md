# PLUS Programmatic Approval Matrix

The portal derives approval routing on the server from validated category data. Browser submissions cannot select reviewers, tiers, escalation state, or route around the active roster.

| Category | Tier 1 reviewer | Executive escalation | Tier 2 reviewer |
| --- | --- | --- | --- |
| Leave & absence | `ishfaque.mojai@gmail.com` | Duration greater than 3 calendar days | `dataplus.org@gmail.com` |
| Finance & expense | `japheth.wilson123@gmail.com` | Amount greater than 50,000 PKR | `dataplus.org@gmail.com` |
| Legal & field operations | `salmahabibbhutto88@gmail.com` | Budget greater than 50,000 PKR | `dataplus.org@gmail.com` |
| Logistics & operations | `dataplus.org@gmail.com` | Not required | — |

## Required payload fields

All Apps Script workflow actions now include the persisted routing fields: `projectCode`, `durationDays`, `amount`, `requiresExecutive`, `tier1Reviewer`, `tier2Reviewer`, `pendingReviewer`, `workflowStage`, and `deliverableLink`. Existing action-specific fields remain present, including the requester and decision fields for `DECISION`, active roster assignee data for `ASSIGN_TASK`, cancellation reason for `CANCEL_REQUEST`, and task status/remarks for `UPDATE_TASK_STATUS`.

The initial `SUBMIT` action has `workflowStage: "TIER_1_REVIEW"` and identifies the exact Tier 1 reviewer in `pendingReviewer`. A Tier 1 approval for an escalation-required request must persist `workflowStage: "TIER_2_EXECUTIVE"`, keep the request pending, and set `pendingReviewer` to the Executive Board reviewer. A final approval transitions to `workflowStage: "EXECUTION"`; assignment sets the exact executor as `pendingReviewer`; and a completed task transitions to `workflowStage: "COMPLETED"` with a required secure `deliverableLink`.

The `GET` request-list response should return these fields on each record. The Portal retains compatibility with older rows through conservative, server-derived category and routing fallbacks, but live fields are authoritative.

## Deployment verification

After the Apps Script redeployment, a privacy-preserving live list-feed verification returned HTTP 200 with a successful envelope. It found twelve occurrences of every matrix field: `projectCode`, `durationDays`, `amount`, `requiresExecutive`, `tier1Reviewer`, `tier2Reviewer`, `pendingReviewer`, `workflowStage`, and `deliverableLink`. The check reported only field-name counts and did not expose request records, staff data, or the private endpoint.

The administrator then confirmed an authenticated browser test with a finance request above 50,000 PKR. The Tier 1 approval entered the intermediate Executive Clearance state, persisted the reviewer remarks, and returned the updated `pendingReviewer` and workflow-stage fields as expected. No additional automated live mutation was performed.
