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
} from "lucide-react";

interface StaffCompensation {
  email: string;
  name: string;
  designation: string;
  hub: "Karachi" | "Hyderabad" | "Sukkur";
  baseSalary: number;
  allowance: number;
  taxDeduction: number;
  netPay: number;
  assignedGrant: string;
  status: "Draft" | "Pending HR Review" | "Approved & Disbursed";
}

const OFFICIAL_ROSTER_COMPENSATION: StaffCompensation[] = [
  {
    email: "kamanger110@gmail.com",
    name: "Kamanger",
    designation: "Program Manager",
    hub: "Hyderabad",
    baseSalary: 120000,
    allowance: 15000,
    taxDeduction: 6000,
    netPay: 129000,
    assignedGrant: "PLUS-COMM-HYD",
    status: "Pending HR Review",
  },
  {
    email: "advazizullahazizullah@gmail.com",
    name: "Adv Azizullah",
    designation: "Legal Associate",
    hub: "Sukkur",
    baseSalary: 95000,
    allowance: 10000,
    taxDeduction: 4000,
    netPay: 101000,
    assignedGrant: "PLUS-LEGAL-2026",
    status: "Approved & Disbursed",
  },
  {
    email: "ishfaque.mojai@gmail.com",
    name: "Ashfaq Ali",
    designation: "HR & Admin Lead",
    hub: "Karachi",
    baseSalary: 140000,
    allowance: 20000,
    taxDeduction: 8000,
    netPay: 152000,
    assignedGrant: "PLUS-LEGAL-2026",
    status: "Approved & Disbursed",
  },
  {
    email: "japheth.wilson123@gmail.com",
    name: "Japheth Wilson",
    designation: "Finance Manager",
    hub: "Karachi",
    baseSalary: 150000,
    allowance: 20000,
    taxDeduction: 9000,
    netPay: 161000,
    assignedGrant: "PLUS-NAVTTC-2026",
    status: "Approved & Disbursed",
  },
];

const OFFICIAL_LOGO_URL =
  "https://grassrootsjusticenetwork.org/wp-content/uploads/2023/12/PLUS-logo-1-768x593.png";

export default function PayrollMasterPage() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [payrollRecords, setPayrollRecords] = useState<StaffCompensation[]>(OFFICIAL_ROSTER_COMPENSATION);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHub, setSelectedHub] = useState("All");

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
      "ishfaque.mojai@gmail.com",
      "japheth.wilson123@gmail.com",
    ];
    return (
      currentUser.role === "ADMIN" ||
      currentUser.role === "EXECUTIVE" ||
      currentUser.role === "HR_ADMIN" ||
      currentUser.role === "FINANCE_MGR" ||
      adminExecEmails.includes(currentUser.email.toLowerCase().trim())
    );
  }, [currentUser]);

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
                <span className="text-[11px] font-bold uppercase tracking-wider">Disbursement Status</span>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600">Verified</p>
              <span className="text-[10px] font-semibold text-slate-500">Tier 3 Executive Authorization Ready</span>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Tax Deductions</span>
                <Receipt className="h-4 w-4 text-[#c65a28]" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#c65a28]">PKR 27,000</p>
              <span className="text-[10px] font-semibold text-slate-500">FBR withholding automated</span>
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#1b365d]">
                {isExecutiveOrAdmin ? "Staff Salary Roster & Grant Allocations" : "My Monthly Compensation Records"}
              </h2>
              <p className="text-xs text-slate-500">
                Automated salary computation synced with regional hubs and donor grant codes.
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
                  <th className="py-3 px-4">Hub & Grant</th>
                  <th className="py-3 px-4">Base Salary</th>
                  <th className="py-3 px-4">Allowances</th>
                  <th className="py-3 px-4">Tax Ded.</th>
                  <th className="py-3 px-4">Net Payable</th>
                  <th className="py-3 px-4 text-right">Status / Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayroll.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                      No payroll records found for your account.
                    </td>
                  </tr>
                ) : (
                  filteredPayroll.map((rec) => (
                    <tr key={rec.email} className="hover:bg-slate-50/80 transition">
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
                      <td className="py-3.5 px-4 font-mono">PKR {rec.baseSalary.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-600">+ PKR {rec.allowance.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-red-600">- PKR {rec.taxDeduction.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1b365d] text-sm">
                        PKR {rec.netPay.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            {rec.status}
                          </span>
                          <button
                            onClick={() => alert(`Generating official PDF Payslip for ${rec.name}...`)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#1b365d] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-[#122440] cursor-pointer"
                          >
                            <Download className="h-3 w-3 text-[#fad207]" />
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

      <footer className="mt-16 border-t border-slate-200 bg-[#1b365d] py-4 text-center text-[11px] text-slate-300">
        Pakistan Legal United Society · Automated Payroll & Compensation System
      </footer>
    </div>
  );
}
