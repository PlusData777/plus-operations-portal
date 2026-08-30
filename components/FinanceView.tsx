"use client";
import React, { useState, useMemo } from 'react';
import { Wallet, TrendingUp, Banknote, Receipt, Plus, Search, Paperclip, CheckCircle2, X } from 'lucide-react';

export default function FinanceView({ currentUser, showToast }) {
  const [budgets] = useState([
    { id: 'BGT-01', grantCode: 'PLUS-LEGAL-2026', donorName: 'Legal Aid & Rights Coalition', projectTitle: 'Under-Trial Inmate Defense & Legal Clinics', allocatedAmount: 3500000, spentAmount: 1420000, hub: 'All', fiscalYear: '2026-2027', status: 'Active' },
    { id: 'BGT-02', grantCode: 'PLUS-NAVTTC-2026', donorName: 'NAVTTC Skills Program', projectTitle: 'Solar PV & CIT Inmate Vocational Labs', allocatedAmount: 2200000, spentAmount: 890000, hub: 'Sukkur', fiscalYear: '2026-2027', status: 'Active' },
    { id: 'BGT-03', grantCode: 'PLUS-COMM-HYD', donorName: 'Community Justice Initiative', projectTitle: 'Rights Booklets & Mobile Legal Camps', allocatedAmount: 1200000, spentAmount: 430000, hub: 'Hyderabad', fiscalYear: '2026-2027', status: 'Active' },
  ]);

  const [claims, setClaims] = useState([
    { id: 'CLM-901', timestamp: '2026-08-28', claimType: 'Cash Advance', requesterName: 'Kamanger', requesterEmail: 'kamanger110@gmail.com', projectCode: 'PLUS-COMM-HYD', expenseHead: 'Community Legal Camp Logistics & Booklets', hub: 'Hyderabad', requestedAmount: 45000, approvalLevel: 'Level 2 (Finance Mgr)', currentApprover: 'japheth@plus.org', status: 'Pending Finance Mgr', notes: 'Mobilization and printed booklets for UC Qasimabad legal camp.' },
    { id: 'CLM-902', timestamp: '2026-08-27', claimType: 'Reimbursement', requesterName: 'Adv Azizullah', requesterEmail: 'advazizullah@gmail.com', projectCode: 'PLUS-LEGAL-2026', expenseHead: 'Court Defense Filing & Witness Conveyance', hub: 'Sukkur', requestedAmount: 12500, approvedAmount: 12500, approvalLevel: 'Level 1 (Admin)', currentApprover: 'atif@plus.org', status: 'Approved & Disbursed', notes: 'Certified copy filings and high court docket stamp fees.' },
  ]);

  const [filterHub, setFilterHub] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [claimType, setClaimType] = useState('Reimbursement');
  const [selectedGrant, setSelectedGrant] = useState('PLUS-LEGAL-2026');
  const [expenseHead, setExpenseHead] = useState('');
  const [hub, setHub] = useState('Karachi');
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');

  const isExecutiveOrAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'EXECUTIVE';

  const scopedClaims = useMemo(() => {
    if (isExecutiveOrAdmin) return claims;
    return claims.filter(c => c.requesterEmail.toLowerCase() === currentUser.email.toLowerCase());
  }, [claims, currentUser, isExecutiveOrAdmin]);

  const filteredClaims = useMemo(() => {
    return scopedClaims.filter(c => {
      const matchHub = filterHub === 'All' || c.hub === filterHub;
      const matchType = filterType === 'All' || c.claimType === filterType;
      const matchSearch = !searchQuery || c.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) || c.expenseHead.toLowerCase().includes(searchQuery.toLowerCase());
      return matchHub && matchType && matchSearch;
    });
  }, [scopedClaims, filterHub, filterType, searchQuery]);

  const totalAllocated = useMemo(() => budgets.reduce((acc, b) => acc + b.allocatedAmount, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((acc, b) => acc + b.spentAmount, 0), [budgets]);
  const remainingCash = totalAllocated - totalSpent;
  const burnRatePercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    if (!amount || !expenseHead) return;

    const newClaim = {
      id: `CLM-${claims.length + 901}`,
      timestamp: new Date().toISOString().split('T')[0],
      claimType,
      requesterName: currentUser.name,
      requesterEmail: currentUser.email,
      projectCode: selectedGrant,
      expenseHead,
      hub,
      requestedAmount: amount,
      approvalLevel: amount > 75000 ? 'Level 3 (CEO / Exec)' : 'Level 2 (Finance Mgr)',
      currentApprover: amount > 75000 ? 'altafkhoso.adv@gmail.com' : 'japheth@plus.org',
      status: 'Pending Finance Mgr',
      notes,
    };

    setClaims([newClaim, ...claims]);
    setIsModalOpen(false);
    setExpenseHead('');
    setAmount(0);
    setNotes('');
    showToast('Financial claim submitted and routed successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{isExecutiveOrAdmin ? 'Executive Fiscal & Grants Governance' : 'My Financial Claims & Advances'}</h2>
          <p className="text-xs text-slate-500">Active grant allocations, burn rates, and multi-tier voucher approvals.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052CC] hover:bg-[#003d99] px-4 py-2 text-xs font-bold text-white shadow-sm transition">
          <Plus className="w-4 h-4" /> <span>+ New Claim / Cash Advance</span>
        </button>
      </div>

      {isExecutiveOrAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Grants Budget</span>
            <p className="mt-2 text-2xl font-bold text-slate-900">PKR {totalAllocated.toLocaleString()}</p>
            <span className="text-[10px] font-semibold text-emerald-600">3 Active Donor Pillars</span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Utilized / Spent</span>
            <p className="mt-2 text-2xl font-bold text-[#c65a28]">PKR {totalSpent.toLocaleString()}</p>
            <span className="text-[10px] font-semibold text-slate-500">{burnRatePercentage}% Burn Rate</span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Remaining Liquidity</span>
            <p className="mt-2 text-2xl font-bold text-emerald-600">PKR {remainingCash.toLocaleString()}</p>
            <span className="text-[10px] font-semibold text-slate-500">Available across all hubs</span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Claims Queue</span>
            <p className="mt-2 text-2xl font-bold text-amber-600">{claims.filter(c => c.status !== 'Approved & Disbursed').length} In Review</p>
            <span className="text-[10px] font-semibold text-slate-500">Tier 1 to Tier 3 clearance</span>
          </div>
        </div>
      )}

      {/* GRANT PORTFOLIOS */}
      {isExecutiveOrAdmin && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Grant Portfolios & Program Burn Rates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {budgets.map(b => {
              const pct = Math.round((b.spentAmount / b.allocatedAmount) * 100);
              return (
                <div key={b.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-mono text-xs font-bold text-[#0052CC]">{b.grantCode}</span>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border">{b.hub}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{b.projectTitle}</h4>
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Spent: PKR {b.spentAmount.toLocaleString()}</span>
                      <span className="font-bold">{pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-[#0052CC]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CLAIMS TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900">Expense Claims & Vouchers</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input type="text" placeholder="Search voucher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs focus:outline-none" />
            </div>
            {isExecutiveOrAdmin && (
              <select value={filterHub} onChange={e => setFilterHub(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-semibold">
                <option value="All">All Hubs</option><option value="Karachi">Karachi</option><option value="Hyderabad">Hyderabad</option><option value="Sukkur">Sukkur</option>
              </select>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-y">
              <tr><th className="py-3 px-4">ID / Date</th><th className="py-3 px-4">Applicant & Hub</th><th className="py-3 px-4">Grant / Purpose</th><th className="py-3 px-4">Requested</th><th className="py-3 px-4 text-center">Status</th></tr>
            </thead>
            <tbody className="divide-y">
              {filteredClaims.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-[#0052CC]">{c.id}<span className="block text-[10px] text-slate-400 font-normal">{c.timestamp}</span></td>
                  <td className="py-3 px-4"><span className="font-bold text-slate-900">{c.requesterName}</span><span className="block text-[10px] text-slate-500">{c.hub}</span></td>
                  <td className="py-3 px-4"><span className="font-semibold text-slate-800">{c.expenseHead}</span><span className="block text-[10px] text-blue-600 font-mono">{c.projectCode}</span></td>
                  <td className="py-3 px-4 font-mono font-bold">PKR {c.requestedAmount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">New Financial Claim / Cash Advance</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmitClaim} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Grant Project</label>
                <select value={selectedGrant} onChange={e => setSelectedGrant(e.target.value)} className="w-full rounded-xl border p-2 text-xs">
                  {budgets.map(b => <option key={b.grantCode} value={b.grantCode}>{b.grantCode} ({b.hub})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Expense Head / Purpose</label>
                <input type="text" required placeholder="e.g. Legal camp booklets printing" value={expenseHead} onChange={e => setExpenseHead(e.target.value)} className="w-full rounded-xl border p-2 text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Amount Requested (PKR)</label>
                <input type="number" required placeholder="25000" value={amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} className="w-full rounded-xl border p-2 text-xs font-bold" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Justification / Notes</label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="w-full rounded-xl border p-2 text-xs resize-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Submit Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
