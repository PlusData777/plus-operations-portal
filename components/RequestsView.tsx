"use client";
import React from 'react';
import { Receipt, Plus } from 'lucide-react';

export default function RequestsView({ visibleRequests = [], currentUser, showToast }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Expense Claims & Vouchers</h2>
          <p className="text-xs text-slate-500">Track and review organizational expense claims.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b">
            <tr><th className="py-3 px-4">ID</th><th className="py-3 px-4">Applicant</th><th className="py-3 px-4">Expense Head</th><th className="py-3 px-4">Amount</th><th className="py-3 px-4 text-center">Status</th></tr>
          </thead>
          <tbody className="divide-y">
            {visibleRequests.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-slate-400 italic">No expense claims found.</td></tr>
            ) : (
              visibleRequests.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-[#0052CC]">{r.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.requester_name}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{r.expense_head}</td>
                  <td className="py-3 px-4 font-mono font-bold">PKR {(Number(r.requested_amount) || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-center"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border">{r.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
