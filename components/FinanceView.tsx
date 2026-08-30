"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Wallet, TrendingUp, Banknote, Receipt, Plus, Search, Paperclip, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function FinanceView({ currentUser, showToast }) {
  const [budgets, setBudgets] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterHub, setFilterHub] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [claimType, setClaimType] = useState('Reimbursement');
  const [selectedGrant, setSelectedGrant] = useState('');
  const [expenseHead, setExpenseHead] = useState('');
  const [hub, setHub] = useState('Karachi');
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([
        supabase.from('grants').select('*'),
        supabase.from('requests').select('*').order('timestamp', { ascending: false })
      ]);

      if (bRes.data) setBudgets(bRes.data);
      if (cRes.data) setClaims(cRes.data);
    } catch (e) {
      console.error('Error fetching finance data from Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const isExecutiveOrAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'EXECUTIVE';

  const scopedClaims = useMemo(() => {
    if (isExecutiveOrAdmin) return claims;
    return claims.filter(c => c.requester_email?.toLowerCase() === currentUser.email?.toLowerCase());
  }, [claims, currentUser, isExecutiveOrAdmin]);

  const filteredClaims = useMemo(() => {
    return scopedClaims.filter(c => {
      const matchHub = filterHub === 'All' || c.hub === filterHub;
      const matchSearch = !searchQuery || c.requester_name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.expense_head?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchHub && matchSearch;
    });
  }, [scopedClaims, filterHub, searchQuery]);

  const totalAllocated = useMemo(() => budgets.reduce((acc, b) => acc + (Number(b.allocated_amount) || 0), 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((acc, b) => acc + (Number(b.spent_amount) || 0), 0), [budgets]);
  const remainingCash = totalAllocated - totalSpent;
  const burnRatePercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!amount || !expenseHead) return;

    const newClaim = {
      timestamp: new Date().toISOString(),
      claim_type: claimType,
      requester_name: currentUser.name,
      requester_email: currentUser.email,
      project_code: selectedGrant || 'GENERAL',
      expense_head: expenseHead,
      hub,
      requested_amount: amount,
      approval_level: amount > 75000 ? 3 : 2,
      current_approver: amount > 75000 ? 'altafkhoso.adv@gmail.com' : 'japheth@plus.org',
      status: 'PENDING_L1',
      notes,
    };

    const { error } = await supabase.from('requests').insert([newClaim]);
    if (error) {
      showToast('Error submitting claim to Supabase.');
      console.error(error);
    } else {
      showToast('Financial claim successfully saved to Supabase database.');
      setIsModalOpen(false);
      setExpenseHead('');
      setAmount(0);
      setNotes('');
      fetchFinanceData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{isExecutiveOrAdmin ? 'Executive Fiscal & Grants Governance' : 'My Financial Claims & Advances'}</h2>
          <p className="text-xs text-slate-500">Live Supabase Database synchronized grant allocations and voucher approvals.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchFinanceData} className="p-2 bg-white border rounded-xl hover:bg-slate-50" title="Sync">
            <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052CC] hover:bg-[#003d99] px-4 py-2 text-xs font-bold text-white shadow-sm transition">
            <Plus className="w-4 h-4" /> <span>+ New Claim</span>
          </button>
        </div>
      </div>

      {isExecutiveOrAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Grants Budget</span>
            <p className="mt-2 text-2xl font-bold text-slate-900">PKR {totalAllocated.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Utilized / Spent</span>
            <p className="mt-2 text-2xl font-bold text-[#c65a28]">PKR {totalSpent.toLocaleString()}</p>
            <span className="text-[10px] font-semibold text-slate-500">{burnRatePercentage}% Burn Rate</span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Remaining Liquidity</span>
            <p className="mt-2 text-2xl font-bold text-emerald-600">PKR {remainingCash.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Requests</span>
            <p className="mt-2 text-2xl font-bold text-amber-600">{claims.filter(c => c.status?.includes('PENDING')).length} In Review</p>
          </div>
        </div>
      )}

      {/* GRANT PORTFOLIOS */}
      {isExecutiveOrAdmin && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Grant Portfolios & Program Burn Rates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {budgets.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No grant budgets found in Supabase.</p>
            ) : (
              budgets.map(b => {
                const spent = Number(b.spent_amount) || 0;
                const allocated = Number(b.allocated_amount) || 1;
                const pct = Math.round((spent / allocated) * 100);
                return (
                  <div key={b.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-mono text-xs font-bold text-[#0052CC]">{b.grant_code}</span>
                      <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border">{b.hub}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">{b.project_title}</h4>
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Spent: PKR {spent.toLocaleString()}</span>
                        <span className="font-bold">{pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full bg-[#0052CC]" style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CLAIMS TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900">Live Supabase Expense Claims</h3>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search claims..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs focus:outline-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b">
              <tr><th className="py-3 px-4">ID</th><th className="py-3 px-4">Applicant & Hub</th><th className="py-3 px-4">Expense Head</th><th className="py-3 px-4">Requested</th><th className="py-3 px-4 text-center">Status</th></tr>
            </thead>
            <tbody className="divide-y">
              {filteredClaims.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400 italic">No financial claims recorded in Supabase.</td></tr>
              ) : (
                filteredClaims.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#0052CC]">{c.id}</td>
                    <td className="py-3 px-4"><span className="font-bold text-slate-900">{c.requester_name}</span><span className="block text-[10px] text-slate-500">{c.hub}</span></td>
                    <td className="py-3 px-4"><span className="font-semibold text-slate-800">{c.expense_head}</span></td>
                    <td className="py-3 px-4 font-mono font-bold">PKR {(Number(c.requested_amount) || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">{c.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">New Financial Claim (Supabase)</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmitClaim} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Expense Head / Purpose</label>
                <input type="text" required placeholder="e.g. Legal camp logistics" value={expenseHead} onChange={e => setExpenseHead(e.target.value)} className="w-full rounded-xl border p-2 text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Amount Requested (PKR)</label>
                <input type="number" required placeholder="25000" value={amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} className="w-full rounded-xl border p-2 text-xs font-bold" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Notes</label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} className="w-full rounded-xl border p-2 text-xs resize-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Commit to Supabase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
