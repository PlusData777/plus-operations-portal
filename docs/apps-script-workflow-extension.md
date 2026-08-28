# PLUS Workflow Extension Contract

The portal now sends all new mutations from server-side route handlers to the configured Apps Script Web App. The private Web App URL remains an environment variable and is never exposed to browsers. Each mutation uses `redirect: "follow"` and `Content-Type: text/plain;charset=utf-8`.

## Required mutation actions

| Action | Required body | Expected successful response |
| --- | --- | --- |
| `CANCEL_REQUEST` | `{ action, rowNumber, cancellationReason }` | JSON envelope: `{ success: true }` |
| `UPDATE_TASK_STATUS` | `{ action, rowNumber, taskStatus, taskRemarks }` | JSON envelope: `{ success: true }` |

`CANCEL_REQUEST` must only change a request that is still awaiting review. The portal independently protects this by reloading the live row and confirming that the authenticated requester owns it before dispatch. Apps Script should preserve the same guard server-side and record the cancellation reason and audit time.

`UPDATE_TASK_STATUS` accepts only `In Progress`, `Completed`, or `Needs Clarification`. The portal independently verifies that the authenticated staff email matches `assignedTo` on the current register row. Apps Script should record the status, remarks, and audit time without changing the approval decision.

## Recommended register-list fields

The existing list feed remains compatible. To unlock complete display and metric fidelity, have Apps Script include the following optional fields on each list record when they are available: `trackingId`, `category`, `amountPkr`, `assignedTo`, `taskStatus`, `taskRemarks`, and `cancellationReason`.

The Cockpit falls back to deterministic request-type parsing for category. Its approved-PKR total uses `amountPkr` when available, with a conservative textual amount fallback only for legacy request rows. It flags only pending requests whose valid register timestamp is more than 48 hours old.

## Security invariants

The browser never communicates with Apps Script directly. The portal derives the requester identity from the active Google/roster session and does not accept staff-email or authority overrides in cancellation or task-update bodies. Both protected routes perform an origin check, schema validation, a fresh live-record lookup, and an ownership comparison before sending a mutation.
