/* eslint-disable @next/next/no-img-element */
"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Lock,
  PlusCircle,
  Receipt,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  Wallet,
  X,
  Eye,
  AlertCircle,
} from "lucide-react";

interface StaffCompensation {
  id: string;
  email: string;
  name: string;
  designation: string;
  hub: "Karachi" | "Hyderabad" | "Sukkur";
  baseSalary: number;
  allowance: number;
  taxDeduction: number;
  netPay: number;
  assignedGrant: string;
  approvalStage: "Pending HR Review" | "Pending Finance Audit" | "Pending CEO Approval" | "Approved & Disbursed";
  currentApprover: string;
}

interface GrantBudgetSummary {
  grantCode: string;
  allocatedAmount: number;
  spentAmount: number;
}

const TEST_ADMIN_EMAIL = "dataplus.org@gmail.com";

const INITIAL_GRANT_BUDGETS: GrantBudgetSummary[] = [
  { grantCode: "PLUS-COMM-HYD", allocatedAmount: 1200000, spentAmount: 430000 },
  { grantCode: "PLUS-LEGAL-2026", allocatedAmount: 3500000, spentAmount: 1420000 },
  { grantCode: "PLUS-NAVTTC-2026", allocatedAmount: 2200000, spentAmount: 890000 },
];

const INITIAL_PAYROLL_RECORDS: StaffCompensation[] = [
  {
    id: "PAY-901",
    email: "kamanger110@gmail.com",
    name: "Kamanger",
    designation: "Program Manager",
    hub: "Hyderabad",
    baseSalary: 120000,
    allowance: 15000,
    taxDeduction: 6000,
    netPay: 129000,
    assignedGrant: "PLUS-COMM-HYD",
    approvalStage: "Pending HR Review",
    currentApprover: TEST_ADMIN_EMAIL,
  },
  {
    id: "PAY-902",
    email: "advazizullahazizullah@gmail.com",
    name: "Adv Azizullah",
    designation: "Legal Associate",
    hub: "Sukkur",
    baseSalary: 95000,
    allowance: 10000,
    taxDeduction: 4000,
    netPay: 101000,
    assignedGrant: "PLUS-LEGAL-2026",
    approvalStage: "Approved & Disbursed",
    currentApprover: TEST_ADMIN_EMAIL,
  },
  {
    id: "PAY-903",
    email: "ishfaque.mojai@gmail.com",
    name: "Ashfaq Ali",
    designation: "HR & Admin Lead",
    hub: "Karachi",
    baseSalary: 140000,
    allowance: 20000,
    taxDeduction: 8000,
    netPay: 152000,
    assignedGrant: "PLUS-LEGAL-2026",
    approvalStage: "Approved & Disbursed",
    currentApprover: TEST_ADMIN_EMAIL,
  },
  {
    id: "PAY-904",
    email: "japheth.wilson123@gmail.com",
    name: "Japheth Wilson",
    designation: "Finance Manager",
    hub: "Karachi",
    baseSalary: 150000,
    allowance: 20000,
    taxDeduction: 9000,
    netPay: 161000,
    assignedGrant: "PLUS-NAVTTC-2026",
    approvalStage: "Pending Finance Audit",
    currentApprover: TEST_ADMIN_EMAIL,
  },
];

const OFFICIAL_LOGO_URL =
  "https://grassrootsjusticenetwork.org/wp-content/uploads/2023/12/PLUS-logo-1-768x593.png";

export default function PayrollMasterPage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [payrollRecords, setPayrollRecords] = useState<StaffCompensation[]>(INITIAL_PAYROLL_RECORDS);
  const [grantBudgets, setGrantBudgets] = useState<GrantBudgetSummary[]>(INITIAL_GRANT_BUDGETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHub, setSelectedHub] = useState("All");
  
  const [auditRecord, setAuditRecord] = useState<StaffCompensation | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<StaffCompensation | null>(null);

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
    const email = (currentUser.email || "").toLowerCase().trim();
    return (
      currentUser.role === "ADMIN" ||
      currentUser.role === "EXECUTIVE" ||
      currentUser.role === "HR_ADMIN" ||
      currentUser.role === "FINANCE_MGR" ||
      email === TEST_ADMIN_EMAIL
    );
  }, [currentUser]);

  // Compute live liquidity for the audited grant
  const auditedGrantData = useMemo(() => {
    if (!auditRecord) return null;
    const grant = grantBudgets.find((b) => b.grantCode === auditRecord.assignedGrant);
    if (!grant) return { allocated: 0, spent: 0, remaining: 0, sufficient: false };
    const remaining = grant.allocatedAmount - grant.spentAmount;
    const sufficient = remaining >= auditRecord.netPay;
    return { allocated: grant.allocatedAmount, spent: grant.spentAmount, remaining, sufficient };
  }, [auditRecord, grantBudgets]);

  const handleAdvanceApproval = async (id: string) => {
    const targetRecord = payrollRecords.find((r) => r.id === id);
    if (!targetRecord) return;

    // Verify liquidity check before proceeding
    const grant = grantBudgets.find((b) => b.grantCode === targetRecord.assignedGrant);
    if (grant && grant.allocatedAmount - grant.spentAmount < targetRecord.netPay) {
      alert("Error: Insufficient grant liquidity to approve this payroll disbursement.");
      return;
    }

    // Deduct from grant spent amount upon final approval or tier progress
    setGrantBudgets((prev) =>
      prev.map((g) => {
        if (g.grantCode === targetRecord.assignedGrant) {
          return { ...g, spentAmount: g.spentAmount + targetRecord.netPay };
        }
        return g;
      })
    );

    setPayrollRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== id) return rec;

        if (rec.approvalStage === "Pending HR Review") {
          return {
            ...rec,
            approvalStage: "Pending Finance Audit",
            currentApprover: TEST_ADMIN_EMAIL,
          };
        }
        if (rec.approvalStage === "Pending Finance Audit") {
          return {
            ...rec,
            approvalStage: "Pending CEO Approval",
            currentApprover: TEST_ADMIN_EMAIL,
          };
        }
        if (rec.approvalStage === "Pending CEO Approval") {
          return {
            ...rec,
            approvalStage: "Approved & Disbursed",
            currentApprover: "Disbursed via Bank Roster",
          };
        }
        return rec;
      })
    );

    setAuditRecord(null);

    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SYNC_PAYROLL_LEDGER", recordId: id }),
      });
    } catch (e) {
      console.warn("Ledger sync notice:", e);
    }
  };

  const handleDownloadPdf = (rec: StaffCompensation) => {
    const textContent = `
========================================
PAKISTAN LEGAL UNITED SOCIETY (PLUS)
Official Salary Statement & Payslip
========================================
Staff Member : ${rec.name}
Designation  : ${rec.designation}
Hub & Grant  : ${rec.hub} Hub (${rec.assignedGrant})
Approval     : ${rec.approvalStage}
----------------------------------------
Base Salary  : PKR ${rec.baseSalary.toLocaleString()}
Allowances   : + PKR ${rec.allowance.toLocaleString()}
Tax Deduction: - PKR ${rec.taxDeduction.toLocaleString()}
----------------------------------------
NET PAYABLE  : PKR ${rec.netPay.toLocaleString()}
========================================
Generated via PLUS Operations Portal
    `.trim();

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Payslip_${rec.name.replace(/\s+/g, "_")}_${rec.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSelectedPayslip(null);
  };

  const filteredPayroll = useMemo(() => {
    return payrollRecords.filter((rec) => {
      const matchHub = selectedHub === "All" || rec.hub === selectedHub;
      const matchSearch =
        !searchQuery ||
        rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.assignedGrant.toLowerCase().includes(searchQuery.toLowerCase());

      if (!isExecutiveOrAdmin) {
        return matchHub && matchSearch && rec.email.toLowerCase().trim() === currentUser?.email?.toLowerCase().trim();
      }
      return matchHub && matchSearch;
    });
  }, [payrollRecords, selectedHub, searchQuery, isExecutiveOrAdmin, currentUser]);

  const totalMonthlyPayroll = useMemo(() => payrollRecords.reduce((acc, r) => acc + r.netPay, 0), [payrollRecords]);

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
                {isExecutiveOrAdmin ? "Payroll & Compensation Governance Suite" : "My Payslips & Salary Statements"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 space-y-8">
        {isExecutiveOrAdmin && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Monthly Outflow</span>
                <Banknote className="h-4 w-4 text-[#1b365d]" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#1b365d]">
                PKR {totalMonthlyPayroll.toLocaleString()}
              </p>
              <span className="text-[10px] font-semibold text-emerald-600">Active roster payroll cycle</span>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Testing Approver</span>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-2 text-sm font-mono font-bold text-slate-800">{TEST_ADMIN_EMAIL}</p>
              <span className="text-[10px] font-semibold text-slate-500">HR, Finance & CEO Unified</span>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Tax Withholdings</span>
                <Receipt className="h-4 w-4 text-[#c65a28]" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#c65a28]">PKR 27,000</p>
              <span className="text-[10px] font-semibold text-slate-500">FBR compliant brackets</span>
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#1b365d]">
                {isExecutiveOrAdmin ? "Staff Salary Roster & Approval Queue" : "My Monthly Compensation Records"}
              </h2>
              <p className="text-xs text-slate-500">
                Click <strong>"Audit Details"</strong> to verify live grant balances and budget liquidity before approving.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              {isExecutiveOrAdmin && (
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-semibold focus:outline-hidden"
                >
                  <option value="All">All Hubs</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Sukkur">Sukkur</option>
                </select>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#f8fafc] text-[10px] font-bold uppercase tracking-wider text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Grant / Hub</th>
                  <th className="py-3 px-4">Net Payable</th>
                  <th className="py-3 px-4">Authorization Stage</th>
                  <th className="py-3 px-4 text-right">Audit & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayroll.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 italic">
                      No payroll records found for your account.
                    </td>
                  </tr>
                ) : (
                  filteredPayroll.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {rec.name}
                        <span className="block text-[10px] font-normal text-slate-500">{rec.designation}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="rounded-sm bg-[#1b365d]/10 text-[#1b365d] px-1.5 py-0.5 text-[10px] font-bold">
                          {rec.assignedGrant}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">{rec.hub} Regional</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1b365d] text-sm">
                        PKR {rec.netPay.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                            rec.approvalStage === "Approved & Disbursed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {rec.approvalStage}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">Approver: {rec.currentApprover}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isExecutiveOrAdmin && rec.approvalStage !== "Approved & Disbursed" && (
                            <button
                              onClick={() => setAuditRecord(rec)}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#1b365d] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-[#122440] cursor-pointer"
                            >
                              <Eye className="h-3 w-3 text-[#fad207]" />
                              <span>Audit Details</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedPayslip(rec)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-xs hover:bg-slate-50 cursor-pointer"
                          >
                            <Download className="h-3 w-3 text-[#c65a28]" />
                            <span>Payslip</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* AUDIT & LIQUIDITY VERIFICATION MODAL */}
      {auditRecord && auditedGrantData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#1b365d] p-2 text-white">
                  <ShieldCheck className="h-5 w-5 text-[#fad207]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1b365d]">Grant Liquidity & Audit Verification</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Stage: {auditRecord.approvalStage}</p>
                </div>
              </div>
              <button onClick={() => setAuditRecord(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Staff Member</span>
                  <strong className="text-slate-900 text-sm">{auditRecord.name}</strong>
                  <span className="block text-slate-500">{auditRecord.designation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Grant Budget Check</span>
                  <strong className="text-[#1b365d] font-mono">{auditRecord.assignedGrant}</strong>
                  <span className={`block font-semibold mt-0.5 ${auditedGrantData.sufficient ? "text-emerald-600" : "text-red-600"}`}>
                    {auditedGrantData.sufficient ? "✓ Sufficient Grant Liquidity" : "✕ Insufficient Grant Balance"}
                  </span>
                </div>
              </div>

              {/* LIVE GRANT BALANCE BREAKDOWN */}
              <div className="rounded-xl border border-slate-100 p-4 space-y-2 bg-[#f8fafc]">
                <span className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider">Live Donor Grant Ledger Check</span>
                <div className="flex justify-between text-slate-600">
                  <span>Total Grant Allocation:</span>
                  <span className="font-mono font-bold text-slate-800">PKR {auditedGrantData.allocated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Already Spent / Committed:</span>
                  <span className="font-mono font-bold text-slate-800">PKR {auditedGrantData.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-1.5">
                  <span>Available Remaining Balance:</span>
                  <span className="font-mono font-bold text-[#1b365d]">PKR {auditedGrantData.remaining.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>This Payroll Outflow:</span>
                  <span className="font-mono font-bold text-amber-600">- PKR {auditRecord.netPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 border-y border-slate-100 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Salary</span>
                  <span className="font-mono font-bold text-slate-900">PKR {auditRecord.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Allowances</span>
                  <span className="font-mono font-bold text-emerald-600">+ PKR {auditRecord.allowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">FBR Tax Withholding</span>
                  <span className="font-mono font-bold text-red-600">- PKR {auditRecord.taxDeduction.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center rounded-xl bg-[#1b365d]/5 p-4 border border-[#1b365d]/10">
                <div>
                  <span className="text-[11px] font-bold text-[#1b365d] uppercase">Net Payable Outflow</span>
                  <span className="block text-[10px] text-slate-500">Verified against donor budget</span>
                </div>
                <span className="font-mono text-lg font-bold text-[#1b365d]">
                  PKR {auditRecord.netPay.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setAuditRecord(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAdvanceApproval(auditRecord.id)}
                disabled={!auditedGrantData.sufficient}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4 text-[#fad207]" />
                <span>Verify & Approve Tier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYSLIP DOWNLOAD MODAL */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img src={OFFICIAL_LOGO_URL} alt="PLUS Logo" className="h-10 w-auto object-contain" />
                <div>
                  <h3 className="text-sm font-bold text-[#1b365d]">Pakistan Legal United Society</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Official Salary Statement & Payslip</p>
                </div>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Staff Member</span>
                  <strong className="text-slate-900 text-sm">{selectedPayslip.name}</strong>
                  <span className="block text-slate-500">{selectedPayslip.designation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Regional Hub & Grant</span>
                  <strong className="text-[#1b365d]">{selectedPayslip.hub} Hub</strong>
                  <span className="block font-mono text-slate-600">{selectedPayslip.assignedGrant}</span>
                </div>
              </div>

              <div className="space-y-2 border-y border-slate-100 py-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Salary</span>
                  <span className="font-mono font-bold text-slate-900">PKR {selectedPayslip.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Allowances (Field / Medical)</span>
                  <span className="font-mono font-bold text-emerald-600">+ PKR {selectedPayslip.allowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax Deduction (FBR Withholding)</span>
                  <span className="font-mono font-bold text-red-600">- PKR {selectedPayslip.taxDeduction.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center rounded-xl bg-[#1b365d]/5 p-4 border border-[#1b365d]/10">
                <div>
                  <span className="text-[11px] font-bold text-[#1b365d] uppercase">Net Payable Salary</span>
                  <span className="block text-[10px] text-slate-500">Status: {selectedPayslip.approvalStage}</span>
                </div>
                <span className="font-mono text-lg font-bold text-[#1b365d]">
                  PKR {selectedPayslip.netPay.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedPayslip(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadPdf(selectedPayslip)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#c65a28] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#a8491d] cursor-pointer"
              >
                <Download className="h-4 w-4 text-[#fad207]" />
                <span>Download Statement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 border-t border-slate-200 bg-[#1b365d] py-4 text-center text-[11px] text-slate-300">
        Pakistan Legal United Society · Multi-Tier Audit & Payroll Governance System
      </footer>
    </div>
  );
}
