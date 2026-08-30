"use client";
import React from 'react';
import { Receipt, Plus, CheckCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PENDING_L1': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PENDING_L2': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyles()}`}>{status.replace('_', ' ')}</span>;
};

export default function RequestsView({ visibleRequests, setIsReqModalOpen, currentUser, canApproveFinance, requests, setRequests, showToast }) {
  
  const handleApprovalAction = (reqId, actionType) => {
    const targetReq = requests.find(r => r.id === reqId);
    if (!targetReq) return;

    let updatedRequests = requests.map(r => {
      if (r.id !== reqId) return r;

      if (actionType === 'REJECT') {
        return { ...r, status: 'REJECTED', current_approver: 'Closed' };
      }

      if (r.status === 'PENDING_L1') {
        // L1 Approved -> Move to L2 (Finance Manager: japheth@plus.org)
        return {
          ...r,
          approval_level: 2,
          current_approver: 'japheth@plus.org',
          status: 'PENDING_L2'
        };
      } else if (r.status === 'PENDING_L2') {
        // L2 Approved by Finance -> Fully Approved
        return {
          ...r,
          approved_amount: r.requested_amount,
          status: 'APPROVED',
          current_approver: 'Disbursed'
        };
      }
      return r;
    });

    setRequests(updatedRequests);
    showToast(`Requisition ${actionType === 'REJECT' ? 'Rejected' : 'Advanced to next approval tier'}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Receipt className="w-6 h-6 text-[#0052CC]" />
          <h2 className="text-xl font-bold text-slate-900">Expense Claims & Financial Requisitions</h2>
        </div>
        <button onClick={() => setIsReqModalOpen(true)} className="flex items-center space-x-2 bg-[#0052CC] hover:bg-[#003d99] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> <span>New Requisition</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-6 py-3">ID / Type</th>
                <th className="px-6 py-3">Requester</th>
                <th className="px-6 py-3">Expense Head</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3">Current Approver</th>
                <th className="px-6 py-3 text-center">Action / Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRequests.map(req => {
                const isMyTurnToApprove = (currentUser.email === req.current_approver) || currentUser.role === 'EXECUTIVE';
                const canTakeAction = isMyTurnToApprove && req.status !== 'APPROVED' && req.status !== 'REJECTED';

                return (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{req.id}</span>
                      <span className="text-xs text-slate-500">{req.claim_type}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{req.requester_name}</td>
                    <td className="px-6 py-4">{req.expense_head}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">PKR {req.requested_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center"><StatusBadge status={req.status} /></td>
                    <td className="px-6 py-4 text-xs font-medium text-blue-600">{req.current_approver}</td>
                    <td className="px-6 py-4 text-center">
                      {canTakeAction ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleApprovalAction(req.id, 'APPROVE')} 
                            className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200 hover:bg-emerald-100 flex items-center space-x-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            <span>{req.status === 'PENDING_L1' ? 'Approve L1' : 'Approve & Disburse'}</span>
                          </button>
                          <button 
                            onClick={() => handleApprovalAction(req.id, 'REJECT')} 
                            className="px-3 py-1 bg-red-50 text-red-700 rounded text-xs font-bold border border-red-200 hover:bg-red-100 flex items-center space-x-1"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          {req.status === 'APPROVED' ? 'Completed' : `Awaiting ${req.current_approvers || req.current_approver}`}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
