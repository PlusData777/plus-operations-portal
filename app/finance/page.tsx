/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Paperclip,
  PlusCircle,
  Receipt,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";

interface GrantBudget {
  id: string;
  grantCode: string;
  donorName: string;
  projectTitle: string;
  allocatedAmount: number;
  spentAmount: number;
  hub: "Karachi" | "Hyderabad" | "Sukkur" | "All";
  fiscalYear: string;
  status: "Active" | "Closed" | "Pending Review";
}

interface ExpenseClaim {
  id: string;
  timestamp: string;
  claimType: "Reimbursement" | "Cash Advance" | "Vendor Payment";
  requesterName: string;
  requesterEmail: string;
  projectCode: string;
  expenseHead: string;
  hub: "Karachi" | "Hyderabad" | "Sukkur";
  requestedAmount: number;
  approvedAmount?: number;
  receiptUrl?: string;
  approvalLevel: "Level 1 (Admin)" | "Level 2 (Finance Mgr)" | "Level 3 (CEO / Exec)";
  currentApprover: string;
  status: "Pending Level 1" | "Pending Finance Mgr" | "Pending CEO" | "Approved & Disbursed" | "Rejected";
  notes: string;
}

interface StaffProfile {
  name: string;
  email: string;
  role: "ADMIN" | "EXECUTIVE" | "HR_ADMIN" | "FINANCE_MGR" | "PROGRAM_MGR" | "LEGAL_STAFF" | "GENERAL_STAFF";
  designation: string;
  department: string;
  accessPin: string;
}

const INITIAL_BUDGETS: GrantBudget[] = [
  {
    id: "BGT-01",
    grantCode: "PLUS-LEGAL-2026",
    donorName: "Legal Aid & Rights Coalition",
    projectTitle: "Under-Trial Inmate Defense & Legal Clinics",
    allocatedAmount: 3500000,
    spentAmount: 1420000,
    hub: "All",
    fiscalYear: "2026-2027",
    status: "Active",
  },
  {
    id: "BGT-02",
    grantCode: "PLUS-NAVTTC-2026",
    donorName: "NAVTTC Skills Program",
    projectTitle: "Solar PV & CIT Inmate Vocational Labs",
    allocatedAmount: 2200000,
    spentAmount: 890000,
    hub: "Sukkur",
    fiscalYear: "2026-2027",
    status: "Active",
  },
  {
    id: "BGT-03",
    grantCode: "PLUS-COMM-HYD",
    donorName: "Community Justice Initiative",
    projectTitle: "Rights Booklets & Mobile Legal Camps",
    allocatedAmount: 1200000,
    spentAmount: 430000,
    hub: "Hyderabad",
    fiscalYear: "2026-2027",
    status: "Active",
  },
];

const INITIAL_CLAIMS: ExpenseClaim[] = [
  {
    id: "CLM-901",
    timestamp: "2026-08-28",
    claimType: "Cash Advance",
    requesterName: "Kamanger",
    requesterEmail: "kamanger110@gmail.com",
    projectCode: "PLUS-COMM-HYD",
    expenseHead: "Community Legal Camp Logistics & Booklets",
    hub: "Hyderabad",
    requestedAmount: 45000,
    approvalLevel: "Level 2 (Finance Mgr)",
    currentApprover: "japheth.wilson123@gmail.com",
    status: "Pending Finance Mgr",
    notes: "Mobilization, tentage, and printed rights booklets for UC Qasimabad legal camp.",
  },
  {
    id: "CLM-902",
    timestamp: "2026-08-27",
    claimType: "Reimbursement",
    requesterName: "Adv Azizullah",
    requesterEmail: "advazizullahazizullah@gmail.com",
    projectCode: "PLUS-LEGAL-2026",
    expenseHead: "Court Defense Filing & Witness Conveyance",
    hub: "Sukkur",
    requestedAmount: 12500,
    approvedAmount: 12500,
    approvalLevel: "Level 1 (Admin)",
    currentApprover: "dataplus.org@gmail.com",
    status: "Approved & Disbursed",
    notes: "Certified copy filings and high court docket stamp fees.",
  },
  {
    id: "CLM-903",
    timestamp: "2026-08-28",
    claimType: "Vendor Payment",
    requesterName: "Ashfaq Ali",
    requesterEmail: "ishfaque.mojai@gmail.com",
    projectCode: "PLUS-NAVTTC-2026",
    expenseHead: "Solar Training Inverter Toolkits & Components",
    hub: "Sukkur",
    requestedAmount: 120000,
    approvalLevel: "Level 3 (CEO / Exec)",
    currentApprover: "altafkhoso.adv@gmail.com",
    status: "Pending CEO",
    notes: "Batch procurement of 10 solar inverter demonstration benches.",
  },
];

const OFFICIAL_LOGO_URL =
  "https://grassrootsjusticenetwork.org/wp-content/uploads/2023/12/PLUS-logo-1-768x593.png";

export default function FinanceMasterPage() {
  const [currentUser, setCurrentUser] = useState<StaffProfile | null>(null);
  const [budgets] = useState<GrantBudget[]>(INITIAL_BUDGETS);
  const [claims, setClaims] = useState<ExpenseClaim[]>(INITIAL_CLAIMS);
  const [filterHub, setFilterHub] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [claimType, setClaimType] = useState<"Reimbursement" | "Cash Advance" | "Vendor Payment">("Reimbursement");
  const [selectedGrant, setSelectedGrant] = useState("PLUS-LEGAL-2026");
  const [expenseHead, setExpenseHead] = useState("");
  const [hub, setHub] = useState<"Karachi" | "Hyderabad" | "Sukkur">("Sukkur");
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("plus_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, []);

  const isExecutiveOrAdmin = useMemo(() => {
    if (!currentUser) return false;
    const adminExecEmails = [
      "dataplus.org@gmail.com",
      "altafkhoso.adv@gmail.com",
      "rizwanapatel.plus@gmail.com",
    ];
    return (
      currentUser.role === "ADMIN" ||
      currentUser.role === "EXECUTIVE" ||
      adminExecEmails.includes(currentUser.email.toLowerCase().trim())
    );
  }, [currentUser]);

  const scopedClaims = useMemo(() => {
    if (!currentUser) return [];
    if (isExecutiveOrAdmin) return claims;
    return claims.filter(
      (c) => c.requesterEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
    );
  }, [claims, currentUser, isExecutiveOrAdmin]);

  const filteredClaims = useMemo(() => {
    return scopedClaims.filter((c) => {
      const matchHub = filterHub === "All" || c.hub === filterHub;
      const matchType = filterType === "All" || c.claimType === filterType;
      const matchSearch =
        !searchQuery ||
        c.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.expenseHead.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchHub && matchType && matchSearch;
    });
  }, [scopedClaims, filterHub, filterType, searchQuery]);

  const totalAllocated = useMemo(() => budgets.reduce((acc, b) => acc + b.allocatedAmount, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((acc, b) => acc + b.spentAmount, 0), [budgets]);
  const remainingCash = totalAllocated - totalSpent;
  const burnRatePercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  async function handleFileUpload(file: File) {
    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "UPLOAD_FILE",
            fileName: `${Date.now()}_${file.name}`,
            mimeType: file.type,
            fileData: reader.result as string,
          }),
        });
        const data = await res.json();
        setIsUploading(false);
        if (data.fileUrl) setReceiptUrl(data.fileUrl);
      } catch {
        setIsUploading(false);
      }
    };
  }

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !amount || !expenseHead) return;

    setIsSubmitting(true);
    let level: "Level 1 (Admin)" | "Level 2 (Finance Mgr)" | "Level 3 (CEO / Exec)" = "Level 1 (Admin)";
    let approver = "dataplus.org@gmail.com";
    let initStatus: ExpenseClaim["status"] = "Pending Level 1";

    if (amount > 75000) {
      level = "Level 3 (CEO / Exec)";
      approver = "altafkhoso.adv@gmail.com";
      initStatus = "Pending CEO";
    } else if (amount > 15000) {
      level = "Level 2 (Finance Mgr)";
      approver = "japheth.wilson123@gmail.com";
      initStatus = "Pending Finance Mgr";
    }

    const newClaim: ExpenseClaim = {
      id: "CLM-" + (claims.length + 901),
      timestamp: new Date().toISOString().split("T")[0],
      claimType,
      requesterName: currentUser.name,
      requesterEmail: currentUser.email,
      projectCode: selectedGrant,
      expenseHead,
      hub,
      requestedAmount: amount,
      receiptUrl,
      approvalLevel: level,
      currentApprover: approver,
      status: initStatus,
      notes,
    };

    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SUBMIT_FINANCE_CLAIM", claim: newClaim }),
      });
    } catch (e) {
      console.warn("Sync notice:", e);
    }

    setClaims([newClaim, ...claims]);
    setIsSubmitting(false);
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
      setIsModalOpen(false);
      setExpenseHead("");
      setAmount(0);
      setNotes("");
      setReceiptUrl("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-[#1b365d] hover:text-[#c65a28] mr-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Operations Portal</span>
            </Link>
            <div className="h-4 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#1b365d] p-1 shadow-xs">
                <img src={OFFICIAL_LOGO_URL} alt="PLUS Logo" className="h-8 w-auto object-contain" />
              </div>
              <h1 className="text-sm font-bold tracking-tight text-[#1b365d] sm:text-base">
                {isExecutiveOrAdmin ? "Executive Fiscal & Grants Governance" : "My Personal Financial Claims & Advances"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#c65a28] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#a8491d] cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-[#fad207]" />
              <span>+ New Claim / Cash Advance</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 space-y-8">
        {isExecutiveOrAdmin && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Grants Budget</span>
                <Wallet className="h-4 w-4 text-[#1b365d]" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#1b365d]">
                PKR {totalAllocated.toLocaleString()}
              </p>
              <span className="text-[10px] font-semibold text-emerald-600">3 Active Donor Pillars</span>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Utilized / Spent</span>
                <TrendingUp className="h-4 w-4 text-[#c65a28]" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#c65a28]">
                PKR {totalSpent.toLocaleString()}
              </p>
              <span className="text-[10px] font-semibold text-slate-500">{burnRatePercentage}% Burn Rate</span>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Remaining Liquidity</span>
                <Banknote className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600">
                PKR {remainingCash.toLocaleString()}
              </p>
              <span className="text-[10px] font-semibold text-slate-500">Available across all hubs</span>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Pending Claims Queue</span>
                <Receipt className="h-4 w-4 text-[#e59a24]" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#e59a24]">
                {claims.filter((c) => c.status !== "Approved & Disbursed").length} In Review
              </p>
              <span className="text-[10px] font-semibold text-slate-500">Tier 1 to Tier 3 clearance</span>
            </div>
          </div>
        )}

        {isExecutiveOrAdmin && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#1b365d]">Grant Portfolios & Program Burn Rates</h2>
                <p className="text-xs text-slate-500">Active donor projects and regional field allocations</p>
              </div>
              <span className="rounded-full bg-[#1b365d]/10 px-3 py-1 text-[11px] font-bold text-[#1b365d]">
                FY 2026-2027 Ledger
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgets.map((b) => {
                const pct = Math.round((b.spentAmount / b.allocatedAmount) * 100);
                return (
                  <div key={b.id} className="rounded-2xl border border-slate-100 bg-[#f8fafc] p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-[#1b365d]">{b.grantCode}</span>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{b.projectTitle}</h4>
                        <p className="text-[10px] text-slate-500">{b.donorName}</p>
                      </div>
                      <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {b.hub}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Spent: PKR {b.spentAmount.toLocaleString()}</span>
                        <span className="font-bold text-[#1b365d]">{pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full bg-[#1b365d]" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                        <span>Allocated: {b.allocatedAmount.toLocaleString()}</span>
                        <span>Rem: {(b.allocatedAmount - b.spentAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#1b365d]">
                {isExecutiveOrAdmin ? "All Staff Expense Claims & Field Vouchers" : "My Submitted Claims & Cash Advances"}
              </h2>
              <p className="text-xs text-slate-500">
                {isExecutiveOrAdmin ? "Organization-wide financial tracking and approvals" : "Track status of your submitted reimbursement and advance requests"}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search voucher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              {isExecutiveOrAdmin && (
                <select
                  value={filterHub}
                  onChange={(e) => setFilterHub(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-semibold focus:outline-hidden"
                >
                  <option value="All">All Hubs</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Sukkur">Sukkur</option>
                </select>
              )}

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-semibold focus:outline-hidden"
              >
                <option value="All">All Types</option>
                <option value="Reimbursement">Reimbursement</option>
                <option value="Cash Advance">Cash Advance</option>
                <option value="Vendor Payment">Vendor Payment</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#f8fafc] text-[10px] font-bold uppercase tracking-wider text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Voucher ID</th>
                  <th className="py-3 px-4">Applicant & Hub</th>
                  <th className="py-3 px-4">Grant / Purpose</th>
                  <th className="py-3 px-4">Requested</th>
                  <th className="py-3 px-4">Approval Threshold</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Receipt / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                      No financial claims found for your account.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1b365d]">
                        {claim.id}
                        <span className="block text-[10px] font-normal text-slate-400">{claim.timestamp}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{claim.requesterName}</div>
                        <span className="text-[10px] text-slate-500">{claim.hub} Regional</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="rounded-sm bg-[#1b365d]/10 text-[#1b365d] px-1.5 py-0.5 text-[10px] font-bold">
                          {claim.projectCode}
                        </span>
                        <div className="text-xs font-semibold text-slate-800 line-clamp-1 mt-0.5">
                          {claim.expenseHead}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        PKR {claim.requestedAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-bold text-slate-700">{claim.approvalLevel}</span>
                        <span className="block text-[10px] text-slate-400">{claim.currentApprover}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                            claim.status === "Approved & Disbursed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {claim.receiptUrl ? (
                          <a
                            href={claim.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-[#1b365d] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-[#122440]"
                          >
                            <Paperclip className="h-3 w-3 text-[#fad207]" />
                            <span>View Doc</span>
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No File</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1b365d]">New Fiscal Claim / Cash Advance</h3>
                <p className="text-[11px] text-slate-500">Auto-routes to Admin, Finance Mgr, or CEO based on amount</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-3">
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setClaimType("Reimbursement")}
                  className={`rounded-lg py-1.5 text-xs font-bold transition cursor-pointer ${
                    claimType === "Reimbursement" ? "bg-white text-[#1b365d] shadow-2xs" : "text-slate-600"
                  }`}
                >
                  Reimburse
                </button>
                <button
                  type="button"
                  onClick={() => setClaimType("Cash Advance")}
                  className={`rounded-lg py-1.5 text-xs font-bold transition cursor-pointer ${
                    claimType === "Cash Advance" ? "bg-white text-[#1b365d] shadow-2xs" : "text-slate-600"
                  }`}
                >
                  Cash Advance
                </button>
                <button
                  type="button"
                  onClick={() => setClaimType("Vendor Payment")}
                  className={`rounded-lg py-1.5 text-xs font-bold transition cursor-pointer ${
                    claimType === "Vendor Payment" ? "bg-white text-[#1b365d] shadow-2xs" : "text-slate-600"
                  }`}
                >
                  Vendor Direct
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Select Grant Project
                  </label>
                  <select
                    value={selectedGrant}
                    onChange={(e) => setSelectedGrant(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    {budgets.map((b) => (
                      <option key={b.grantCode} value={b.grantCode}>
                        {b.grantCode} ({b.hub})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Regional Hub
                  </label>
                  <select
                    value={hub}
                    onChange={(e) => setHub(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Sukkur">Sukkur Regional</option>
                    <option value="Hyderabad">Hyderabad Regional</option>
                    <option value="Karachi">Karachi Head Office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Expense Head / Activity Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Legal camp booklets printing / Court case filing costs"
                  value={expenseHead}
                  onChange={(e) => setExpenseHead(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Amount Requested (PKR)
                </label>
                <input
                  type="number"
                  min="500"
                  step="100"
                  required
                  placeholder="e.g. 25000"
                  value={amount || ""}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-[#1b365d] focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Attach Voucher / Bill (Saved to Drive)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleFileUpload(file);
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1b365d] file:text-white hover:file:bg-[#122440] cursor-pointer"
                />
                {isUploading && <span className="text-[10px] text-[#c65a28] font-semibold mt-1 block">Uploading to Google Drive...</span>}
                {receiptUrl && <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">✓ Receipt uploaded!</span>}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Operational Justification
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide activity specifics for the audit log..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden resize-none"
                />
              </div>

              {submitSuccess ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Claim Logged & Approver Notified via Automated Email!</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="flex-1 rounded-xl bg-[#c65a28] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#a8491d] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Routing..." : "Submit Claim"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
