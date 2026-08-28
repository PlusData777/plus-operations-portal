# PLUS Operations & Approval Portal

This project is a **Next.js App Router** application for Pakistan Legal United Society (PLUS). It uses Google OAuth for identity and the deployed Google Apps Script Web App as its server-side active-roster gate, request-data gateway, task-delegation dispatcher, and `MailApp` decision-email dispatcher. It is designed to deploy on Vercel’s free tier without a paid database.

## Security architecture

| Concern | Implementation |
|---|---|
| Identity | NextAuth.js Google OAuth session using an HTTP-only signed session cookie. |
| Roster-gated sign-in | The Google OAuth `signIn` callback queries `GET_ROSTER` through the server-only Apps Script URL. Presence in the server-filtered roster is the Active authorization criterion; all other Google accounts receive an access-denied message. |
| Role enforcement | Every protected page and API route rechecks the authenticated email against the active roster and uses its server-supplied role. Client navigation is never accepted as authorization. |
| Staff data access | General staff can use only the personal submission route, which filters records by the verified session email. The browser never supplies the email filter. |
| Decision integrity | Only a server-side role-filtered queue route may write an approval or rejection. A decision requires written reviewer remarks and pending status, then passes the requester’s name, email, and request type to Apps Script for MailApp dispatch. |
| Task delegation | Only roster roles `ADMIN` and `EXECUTIVE` may send the validated `ASSIGN_TASK` action. The server verifies that the selected recipient is currently present in the active roster. |
| Webhook access | The Apps Script endpoint is held in a server-only environment variable. The browser calls only the internal `/api` routes, preventing CORS preflights and hiding the endpoint from client bundles. |
| Browser hardening | CSP, clickjacking, MIME sniffing, referrer, and permissions headers are set in `next.config.ts`. |

> The spreadsheet is the source of truth. Do not publish it publicly, and share it only with authorized human operators and the configured service account.

## Local development

Use Node.js 20 or later. Copy the example configuration, add real credentials, install dependencies, and start the development server.

```bash
cp .env.local.example .env.local
pnpm install
pnpm dev
```

Run quality gates before deployment.

```bash
pnpm check
pnpm lint
pnpm test
pnpm build
```

## 1. Configure Google OAuth

Create a Google Cloud project and configure the OAuth consent screen. In **APIs & Services → Credentials**, create an **OAuth client ID** of type **Web application**. In local development, add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. In Vercel production, add `https://YOUR-PROJECT.vercel.app/api/auth/callback/google` and, if applicable, the equivalent URL for your custom domain. Copy the client ID and client secret to `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

The Google OAuth consent screen must permit the staff accounts that will use the portal. If the Google Cloud project is set to **Testing**, add each permitted account as a test user; production use normally requires publishing the consent screen in accordance with Google’s requirements.[1]

### Callback base URL and exact redirect URIs

The portal never hardcodes a callback host in source code. It reads `NEXTAUTH_URL` from the environment as the canonical production fallback, and NextAuth.js can use Vercel’s `VERCEL_URL` when Vercel system environment variables are exposed. Do **not** derive an OAuth callback base from arbitrary request `Host` headers: OAuth redirect origins must remain an explicit trusted set. Google requires full, static redirect URI values, so register each environment that will perform a real sign-in.[6]

| Environment | Configure in the Google OAuth client’s **Authorized redirect URIs** |
|---|---|
| Current Manus sandbox preview | `https://3000-in0b2jphtdmy0o2jx9eqj-58a0a0f9.us3.manus.computer/api/auth/callback/google` |
| Canonical Vercel production | `https://plus-operations.vercel.app/api/auth/callback/google` |

The active Manus preview environment uses `NEXTAUTH_URL=https://3000-in0b2jphtdmy0o2jx9eqj-58a0a0f9.us3.manus.computer`. For Vercel, set the **Production-scoped** value to `NEXTAUTH_URL=https://plus-operations.vercel.app`; do not copy the Manus preview origin into Production. If you create a stable Vercel Preview environment that needs Google sign-in, set a Preview-scoped `NEXTAUTH_URL` to that preview’s stable host and register its exact callback URI separately. Do not use ephemeral deployment URLs for OAuth unless each is explicitly registered.

## 2. Configure the Google Apps Script Webhook

Set `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` to the deployed Web App endpoint. The implementation issues a server-side `GET` with `redirect: "follow"` for the decision register and server-side `POST` operations with `redirect: "follow"` plus the `Content-Type: text/plain;charset=utf-8` header required by the deployed Apps Script interface. The browser never calls Apps Script directly.

| Portal endpoint | Server-to-Webhook operation | Required payload |
|---|---|---|
| `GET /api/requests` | `GET` | The handler receives `{ success: true, data: [...] }` and filters records by the authenticated staff email. |
| `POST /api/requests` | `POST` | `{ action: "SUBMIT", trackingId, category, staffName, staffEmail, department, requestType, justification, details, requiresFinanceAuditExecutiveClearance }`. The server generates `trackingId` and derives identity and department from the active Google roster; clients cannot override them. |
| Google OAuth sign-in | `GET ?action=GET_ROSTER` | Validates that the authenticated email is present in the server-filtered active roster before issuing a session. |
| `GET /api/admin/requests` | `GET` plus `GET ?action=GET_ROSTER` | The handler revalidates the reviewer’s roster role, returns only that role’s protected queue, and returns active roster records only when task delegation is allowed. |
| `POST /api/admin/requests/:rowNumber/decision` | `POST` | `{ action: "DECISION", rowNumber, decision, remarks, staffEmail, staffName, requestType }` |
| `POST /api/admin/requests/:rowNumber/assignment` | `POST` | `{ action: "ASSIGN_TASK", rowNumber, assignedToEmail, taskNotes }`; `assignedToEmail` is required and must identify an active roster member, while `taskNotes` is optional. |

The deployed Apps Script handles Google Sheets access. Ensure its request register is protected operationally and that access to its deployment and underlying spreadsheet remains limited to authorized PLUS administrators.[2]

## 3. Configure roster roles and protected queues

The Apps Script `GET_ROSTER` response is the access-control source of truth. It must return only active members, with each record supplying at least `email`, `name`, and `role`. Any authenticated Google account absent from that response is denied. A returned record with an unrecognized or blank role receives the least-privilege `GENERAL_STAFF` experience.

| Roster role | Portal experience | Protected queue or capability |
|---|---|---|
| `ADMIN` | Decision Cockpit and active team roster overview | All requests; can approve, reject, and assign any request. |
| `EXECUTIVE` | Executive Board Cockpit | Management, Board/CEO, manager-leave, policy, and financial claims above 50,000 PKR; can assign any request. |
| `HR_ADMIN` | HR & Administration Cockpit | General staff leave, attendance, operational, logistics, facility, supply, and administration requests. |
| `FINANCE_MGR` | Finance Cockpit | Expenses, invoices, claims, and vendor payments through 50,000 PKR. |
| `PROGRAM_MGR` | Programs Cockpit | Program activity, field, travel, and clearance requests. |
| `GENERAL_STAFF` | Staff Request Portal | Submit a request and view only personal submissions. |

New category-aware requests include structured details. Finance submissions carry a numeric `amountPkr` in `details` and set `requiresFinanceAuditExecutiveClearance` above 50,000 PKR. Leave requests contain the validated date range and active-roster handover email; procurement and program requests carry their category-specific operational fields. For receipts, the current intake form collects an optional secure Google Drive link rather than uploading file bytes; the Apps Script `SUBMIT` handler should persist the `details` object and tracking ID with the request row.

## 4. Configure Apps Script decision email

Decision email delivery is now owned entirely by the deployed Google Apps Script Web App through `MailApp`. When an executive records a decision, the secure Next.js route passes the verified Webhook record’s `staffEmail`, `staffName`, and `requestType` inside the `DECISION` payload, together with `rowNumber`, `decision`, and `remarks`. No Gmail SMTP, Resend key, Nodemailer dependency, or local mail environment variable is required by this Next.js project.

Configure the sender, email template, and any failure monitoring in the Apps Script deployment. The cockpit confirms that the decision has been saved and handed to Apps Script for dispatch; the Webhook remains the source of truth for its final email behavior.

## 5. Deploy to Vercel free tier

Place the code in a private GitHub repository. In Vercel, choose **Add New → Project**, import the repository, and accept the detected **Next.js** framework preset. The application does not need a database add-on or background worker. Under **Project Settings → Environment Variables**, enter every variable from `.env.local.example`. Add the deployed endpoint as `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` without a `NEXT_PUBLIC_` prefix. Use `NEXTAUTH_URL=https://YOUR-PROJECT.vercel.app` for production and generate a unique `NEXTAUTH_SECRET` with `openssl rand -base64 32`; do not reuse development secrets in production.

After the first deployment, copy the assigned Vercel domain and add `https://YOUR-PROJECT.vercel.app/api/auth/callback/google` to the Google OAuth client’s **Authorized redirect URIs**. Redeploy after modifying Vercel environment variables. Vercel supports deployment of Next.js projects and documents the Git-based project workflow.[5]

### Managed deployment artifact

This project includes a root `Dockerfile` because it replaced an inherited template that expected a Vite `dist/public` directory. The Dockerfile builds the Next.js **standalone** server artifact inside the deployment image and starts `.next/standalone/server.js`; it also copies `.next/static` into that artifact. Keep `output: "standalone"` in `next.config.ts` and retain this Dockerfile when deploying through the managed container workflow.

## Operating checklist

Before inviting users, verify that a Google account absent from `GET_ROSTER` is denied, a returned general-staff account cannot open `/cockpit`, and each privileged role can access only its own queue. Confirm that `ADMIN` and `EXECUTIVE` can delegate a request to an active roster record whereas all other roles receive a 403 response. Confirm that the Webhook GET returns the expected envelopes, that a test submission reaches the spreadsheet, and that Apps Script’s `MailApp` dispatches a test decision email. Keep OAuth credentials and the Webhook configuration strictly in environment variables; never commit them to Git.

## References

[1]: https://developers.google.com/identity/protocols/oauth2 "Google OAuth 2.0 documentation"
[2]: https://developers.google.com/sheets/api "Google Sheets API documentation"
[5]: https://vercel.com/docs/deployments/git "Vercel documentation: Deploying with Git"
[6]: https://next-auth.js.org/deployment "NextAuth.js v4 deployment guidance"
