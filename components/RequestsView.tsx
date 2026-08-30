"use client";
import React from 'react';
import { Receipt, Plus, CheckCircle, XCircle } from 'lucide-react';

export default function RequestsView({ visibleRequests, setIsReqModalOpen, currentUser, requests, setRequests, showToast }) {
  const handleApprovalAction = (reqId, actionType) => {
    setRequests(requests.map(r => {
      if (r.id !== reqId) return r;
      if (actionType === 'REJECT') return { ...r, status: 'REJECTED', current_approver: 'Closed' };
      if (r.status === 'PENDING_L1') {
        return { ...r, approval_level: 2, current_approver: 'japheth@plus.org', status: 'PENDING_L2' };
      }
      return { ...r, approved_amount: r.requested_amount, status: 'APPROVED', current_approver: 'Disbursed' };
    }));
    showToast(`Requisition ${actionType === 'REJECT' ? 'Rejected' : 'Advanced & Disbursed'}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Receipt className="w-6 h-6 text-[#0052CC]" />
          <h2 className="text-xl font-bold text-slate-900">Live Expense Claims & Financial Requisitions</h2>
        </div>
        <button onClick={() => setIsReqModalOpen(true)} className="flex items-center space-x-2 bg-[#0052CC] hover:bg-[#003d99] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> <span>New Requisition</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
            <tr><th className="px-6 py-3">ID / Type</th><th className="px-6 py-3">Requester</th><th className="px-6 py-3">Expense Head</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3 text-center">Status</th><th className="px-6 py-3">Current Approver</th><th className="px-6 py-3 text-center">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleRequests.map(req => {
              const canAction = (currentUser.email === req.current_approver || currentUser.role === 'EXECUTIVE') && req.status.includes('PENDING');
              return (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">{req.id} <span className="block text-xs font-normal text-slate-500">{req.claim_type}</span></td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{req.requester_name}</td>
                  <td className="px-6 py-4">{req.expense_head}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">PKR {req.requested_amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">{req.status}</span></td>
                  <td className="px-6 py-4 text-xs font-medium text-blue-600">{req.current_approver}</td>
                  <td className="px-6 py-4 text-center">
                    {canAction ? (
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => handleApprovalAction(req.id, 'APPROVE')} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200 hover:bg-emerald-100">Approve</button>
                        <button onClick={() => handleApprovalAction(req.id, 'REJECT')} className="px-3 py-1 bg-red-50 text-red-700 rounded text-xs font-bold border border-red-200 hover:bg-red-100">Reject</button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">{req.status === 'APPROVED' ? 'Disbursed' : 'Awaiting Approval'}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
