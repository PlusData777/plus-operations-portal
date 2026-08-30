"use client";
import React from 'react';
import { Clock, CheckCircle, XCircle, Receipt, Calendar } from 'lucide-react';

export default function PendingApprovalsView({ 
  requests, 
  setRequests, 
  leaveRequests, 
  setLeaveRequests, 
  currentUser, 
  showToast 
}) {
  // Filter all items that are pending and require attention
  const pendingRequests = requests.filter(r => r.status.includes('PENDING'));
  const pendingLeaves = leaveRequests.filter(l => l.status === 'PENDING');

  const handleApproveReq = (reqId) => {
    setRequests(requests.map(r => {
      if (r.id !== reqId) return r;
      if (r.status === 'PENDING_L1') {
        return { ...r, approval_level: 2, current_approver: 'japheth@plus.org', status: 'PENDING_L2' };
      } else {
        return { ...r, approved_amount: r.requested_amount, status: 'APPROVED', current_approver: 'Disbursed' };
      }
    }));
    showToast('Requisition approved and advanced.');
  };

  const handleRejectReq = (reqId) => {
    setRequests(requests.map(r => r.id === reqId ? { ...r, status: 'REJECTED', current_approver: 'Closed' } : r));
    showToast('Requisition rejected.');
  };

  const handleApproveLeave = (leaveId) => {
    setLeaveRequests(leaveRequests.map(l => l.id === leaveId ? { ...l, status: 'APPROVED' } : l));
    showToast('Leave request approved.');
  };

  const handleRejectLeave = (leaveId) => {
    setLeaveRequests(leaveRequests.map(l => l.id === leaveId ? { ...l, status: 'REJECTED' } : l));
    showToast('Leave request rejected.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Clock className="w-6 h-6 text-[#0052CC]" />
        <h2 className="text-xl font-bold text-slate-900">Pending Approvals Queue</h2>
      </div>

      {/* FINANCIAL REQUISITIONS PENDING */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex items-center space-x-2">
          <Receipt className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-800">Pending Financial & Expense Requisitions ({pendingRequests.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-6 py-3">ID / Type</th>
                <th className="px-6 py-3">Requester</th>
                <th className="px-6 py-3">Expense Head</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Current Approver</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingRequests.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-6 text-center text-slate-400 italic">No pending requisitions in queue.</td></tr>
              ) : (
                pendingRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{req.id} <span className="block text-xs font-normal text-slate-500">{req.claim_type}</span></td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{req.requester_name}</td>
                    <td className="px-6 py-4">{req.expense_head}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">PKR {req.requested_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs font-medium text-blue-600">{req.current_approver}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button onClick={() => handleApproveReq(req.id)} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200 hover:bg-emerald-100">
                        Approve
                      </button>
                      <button onClick={() => handleRejectReq(req.id)} className="px-3 py-1 bg-red-50 text-red-700 rounded text-xs font-bold border border-red-200 hover:bg-red-100">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEAVE APPLICATIONS PENDING */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-800">Pending Staff Leave Applications ({pendingLeaves.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-6 py-3">Staff Name</th>
                <th className="px-6 py-3">Leave Type</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingLeaves.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-6 text-center text-slate-400 italic">No pending leave applications.</td></tr>
              ) : (
                pendingLeaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{leave.staff_name}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{leave.leave_type}</td>
                    <td className="px-6 py-4 text-xs font-medium">{leave.start_date} to {leave.end_date}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{leave.reason}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button onClick={() => handleApproveLeave(leave.id)} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200 hover:bg-emerald-100">
                        Approve
                      </button>
                      <button onClick={() => handleRejectLeave(leave.id)} className="px-3 py-1 bg-red-50 text-red-700 rounded text-xs font-bold border border-red-200 hover:bg-red-100">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
