"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  FolderOpen,
  ExternalLink,
  Search,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

type PolicyCategory =
  | "HR & Conduct"
  | "Finance & Accounts"
  | "Field & Legal SOPs"
  | "Templates & Forms";

type FileType = "PDF" | "DOCX" | "Spreadsheet";

type Policy = {
  id: string;
  title: string;
  category: PolicyCategory;
  description: string;
  fileType: FileType;
  lastUpdated: string;
  driveUrl: string;
};

// Root Google Drive folder for the organization.
// Replace with the actual shared folder link.
const ROOT_DRIVE_URL = "https://drive.google.com/drive/folders/REPLACE_WITH_ROOT_FOLDER_ID";

// ---------------------------------------------------------------------------
// POLICIES: Replace each `driveUrl` with the real Google Drive sharing link.
// ---------------------------------------------------------------------------
const POLICIES: Policy[] = [
  {
    id: "hr-employee-handbook",
    title: "Employee Handbook & Code of Conduct",
    category: "HR & Conduct",
    description:
      "Comprehensive guide covering workplace ethics, disciplinary procedures, dress code, and organizational values.",
    fileType: "PDF",
    lastUpdated: "2026-07-14",
    driveUrl: "https://drive.google.com/file/d/REPLACE_HR_HANDBOOK/view",
  },
  {
    id: "hr-leave-policy",
    title: "Leave & Attendance Policy",
    category: "HR & Conduct",
    description:
      "Annual, casual, sick, and unpaid leave entitlements with the attendance and clock-in requirements for all staff.",
    fileType: "PDF",
    lastUpdated: "2026-06-02",
    driveUrl: "https://drive.google.com/file/d/REPLACE_LEAVE_POLICY/view",
  },
  {
    id: "hr-anti-harassment",
    title: "Anti-Harassment & Grievance Procedure",
    category: "HR & Conduct",
    description:
      "Reporting channels, investigation steps, and protections for raising workplace grievances and misconduct.",
    fileType: "DOCX",
    lastUpdated: "2026-05-20",
    driveUrl: "https://drive.google.com/file/d/REPLACE_ANTI_HARASSMENT/view",
  },
  {
    id: "fin-expense-policy",
    title: "Expense Reimbursement Policy",
    category: "Finance & Accounts",
    description:
      "Approval matrix, eligible expense categories, and receipt requirements for staff reimbursements.",
    fileType: "PDF",
    lastUpdated: "2026-08-01",
    driveUrl: "https://drive.google.com/file/d/REPLACE_EXPENSE_POLICY/view",
  },
  {
    id: "fin-budget-tracker",
    title: "Departmental Budget Tracker",
    category: "Finance & Accounts",
    description:
      "Live spreadsheet tracking quarterly allocations, commitments, and remaining balances per department.",
    fileType: "Spreadsheet",
    lastUpdated: "2026-08-22",
    driveUrl: "https://docs.google.com/spreadsheets/d/REPLACE_BUDGET_TRACKER/edit",
  },
  {
    id: "fin-procurement-sop",
    title: "Procurement & Vendor Payment SOP",
    category: "Finance & Accounts",
    description:
      "Vendor onboarding, quotation comparison, purchase authorization, and payment release workflow.",
    fileType: "PDF",
    lastUpdated: "2026-07-05",
    driveUrl: "https://drive.google.com/file/d/REPLACE_PROCUREMENT_SOP/view",
  },
  {
    id: "field-case-intake",
    title: "Legal Case Intake SOP",
    category: "Field & Legal SOPs",
    description:
      "Step-by-step procedure for registering new legal cases, client verification, and documentation standards.",
    fileType: "PDF",
    lastUpdated: "2026-06-28",
    driveUrl: "https://drive.google.com/file/d/REPLACE_CASE_INTAKE/view",
  },
  {
    id: "field-visit-protocol",
    title: "Field Visit & Safety Protocol",
    category: "Field & Legal SOPs",
    description:
      "Safety checklist, travel authorization, and reporting requirements for staff conducting field operations.",
    fileType: "DOCX",
    lastUpdated: "2026-05-11",
    driveUrl: "https://drive.google.com/file/d/REPLACE_FIELD_PROTOCOL/view",
  },
  {
    id: "field-data-privacy",
    title: "Client Data Privacy & Confidentiality SOP",
    category: "Field & Legal SOPs",
    description:
      "Handling, storage, and disclosure rules for sensitive client and case data in line with legal obligations.",
    fileType: "PDF",
    lastUpdated: "2026-07-19",
    driveUrl: "https://drive.google.com/file/d/REPLACE_DATA_PRIVACY/view",
  },
  {
    id: "tpl-leave-form",
    title: "Leave Application Form",
    category: "Templates & Forms",
    description:
      "Standardized template for submitting leave requests with line-manager and HR sign-off sections.",
    fileType: "DOCX",
    lastUpdated: "2026-04-30",
    driveUrl: "https://drive.google.com/file/d/REPLACE_LEAVE_FORM/view",
  },
  {
    id: "tpl-expense-claim",
    title: "Expense Claim Sheet",
    category: "Templates & Forms",
    description:
      "Ready-to-use spreadsheet for itemizing expenses, attaching receipts, and calculating claim totals.",
    fileType: "Spreadsheet",
    lastUpdated: "2026-08-10",
    driveUrl: "https://docs.google.com/spreadsheets/d/REPLACE_EXPENSE_CLAIM/edit",
  },
  {
    id: "tpl-incident-report",
    title: "Incident Report Template",
    category: "Templates & Forms",
    description:
      "Structured form for documenting field incidents, witnesses, and immediate corrective actions taken.",
    fileType: "PDF",
    lastUpdated: "2026-06-15",
    driveUrl: "https://drive.google.com/file/d/REPLACE_INCIDENT_REPORT/view",
  },
];

const CATEGORIES: ("All" | PolicyCategory)[] = [
  "All",
  "HR & Conduct",
  "Finance & Accounts",
  "Field & Legal SOPs",
  "Templates & Forms",
];

const CATEGORY_STYLES: Record<PolicyCategory, string> = {
  "HR & Conduct": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Finance & Accounts": "bg-amber-50 text-amber-700 border-amber-200",
  "Field & Legal SOPs": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Templates & Forms": "bg-slate-100 text-slate-600 border-slate-200",
};

const FILE_STYLES: Record<FileType, string> = {
  PDF: "bg-rose-50 text-rose-700 border-rose-200",
  DOCX: "bg-sky-50 text-sky-700 border-sky-200",
  Spreadsheet: "bg-teal-50 text-teal-700 border-teal-200",
};

function FileIcon({ type }: { type: FileType }) {
  if (type === "Spreadsheet") return <FileSpreadsheet className="h-3.5 w-3.5" />;
  return <FileText className="h-3.5 w-3.5" />;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DocumentsHub() {
  const [activeCategory, setActiveCategory] = useState<"All" | PolicyCategory>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return POLICIES.filter((p) => {
      const matchCategory = activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, query]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-panel sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 text-balance">
              Document &amp; Policy Hub
            </h1>
            <p className="text-xs text-slate-500">
              Central library of policies, SOPs, and templates for Pakistan Legal United Society.
            </p>
          </div>
        </div>
        <a
          href={ROOT_DRIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <FolderOpen className="h-4 w-4" />
          Open Organization Drive Folder
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Filter & Search controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative lg:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FileText className="mx-auto mb-2 h-10 w-10 text-slate-300" />
          <p className="text-base font-semibold text-slate-700">No documents found</p>
          <p className="mt-1 text-xs text-slate-400">
            Try a different category or adjust your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${CATEGORY_STYLES[doc.category]}`}
                  >
                    {doc.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${FILE_STYLES[doc.fileType]}`}
                  >
                    <FileIcon type={doc.fileType} />
                    {doc.fileType}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold leading-snug text-slate-900 text-pretty">
                    {doc.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    {doc.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-400">
                  Last updated {formatDate(doc.lastUpdated)}
                </span>
                <a
                  href={doc.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
                >
                  Open Document
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
