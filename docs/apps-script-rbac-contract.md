# PLUS Apps Script RBAC Contract

The portal treats presence in the server-filtered `GET_ROSTER` response as confirmation that a Google account is active and eligible to sign in. The roster response is expected to contain a successful envelope with a `roster` array. Each roster record provides `email`, `name`, `designation`, `role`, `department`, and `approvalScope`.

The known application roles are `ADMIN`, `EXECUTIVE`, `HR_ADMIN`, `FINANCE_MGR`, and `PROGRAM_MGR`. An authenticated email that is not in the server-filtered roster must be denied. A roster member with no recognized privileged role is treated as `GENERAL_STAFF`.

The deployed roster was rechecked on 2026-08-28 and maps `dataplus.org@gmail.com` to `ADMIN` with full access, task-delegation, and user-management scope. The application derives this privilege directly from the live roster record rather than from a hard-coded email override.

For `ADMIN` and `EXECUTIVE` users, the cockpit requests the roster through its protected queue API on initial load and whenever the reviewer refreshes the queue. The Assign Task selector renders every normalized record returned from that live, server-filtered roster; it contains no hard-coded assignee list. New active Staff_Roster entries therefore become available to privileged reviewers without a portal code change.

The request-list response is a successful envelope with a `data` array. Requests contain `rowNumber`, requester fields, `department`, `requestType`, `justification`, `status`, `remarks`, `decisionLog`, and may contain `assignedTo`. The current list does not expose a structured amount or requester-management-level field; queue routing must therefore use the declared department and request type, with deterministic text parsing only for high-value claim signals.

The privileged assignment mutation is sent to the Web App through the server-only adapter using the text/plain JSON contract requested by the administrator: `{ action: "ASSIGN_TASK", rowNumber, assignedToEmail, taskNotes }`. The portal rejects an empty or malformed `assignedToEmail`, checks it against the active roster server-side, and accepts an empty `taskNotes` value. The final redirected response must either return successful JSON or be an empty HTTP 200 response; non-empty non-JSON responses remain errors and are not reported as saved.

The former Web App URL returned a G12 status-validation error during task assignment and is superseded. The definitive endpoint was revalidated on row 12 with the exact assignment payload: it returned HTTP 200 with an empty final body and persisted the task notes in column H, the assignee email in column I, and the assignment timestamp in column J. No subsequent verification call targets the superseded endpoint.
