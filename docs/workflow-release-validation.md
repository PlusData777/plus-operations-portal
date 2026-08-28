# PLUS Workflow Release Validation Record

## Completed checks

The portal-side workflow extension has passed 30 automated tests in 13 files, including the new cancellation-reason, assigned-task ownership, task-status validation, Apps Script payload, approved-PKR KPI, and SLA-warning coverage. TypeScript checking, ESLint, and a `NODE_ENV=production` Next.js build passed. The production build contains both new protected routes: `/api/requests/[rowNumber]/cancel` and `/api/tasks/[rowNumber]/status`.

The existing live Apps Script GET and active-roster integration checks passed following the administrator’s confirmation that the extended Apps Script deployment was redeployed. Those checks are non-destructive and confirm the endpoint still follows redirects and provides the expected successful envelopes.

A subsequent privacy-preserving live list-feed read returned HTTP 200 with a successful JSON envelope and found twelve occurrences each of the `taskStatus`, `taskRemarks`, and `cancellationReason` field names. The verification intentionally reported only response status and field-name counts; it did not print request records, staff information, or the private endpoint.

The restarted preview rendered the public entry page cleanly at both desktop and 375-pixel mobile widths. The authenticated Staff Portal and Cockpit cannot be exercised from this unauthenticated review session; no real cancellation or task-status mutation was attempted.

## Authenticated workflow confirmation

Following the Apps Script redeployment, the administrator confirmed direct, authenticated browser validation of both a staff-owned request cancellation while it was in Pending Review and an Assigned to Me task-status update. No additional automated mutation was performed, and the earlier authorized row-12 assignment was not repeated.

The portal enforces the same authorization boundaries independently: it rejects any cancellation where the staff email does not own the current pending request and rejects any task update where the staff email does not exactly match the current assigned email.
