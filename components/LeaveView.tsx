"use client";
import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyles()}`}>{status}</span>;
};

export default function LeaveView({ leaveRequests, setLeaveRequests, setIsLeaveModalOpen, currentUser, canApprove }) {
  const handleAction = (id, newStatus) => {
    setLeaveRequests(leaveRequests.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-[#0052CC]" />
          <h2 className="text-xl font-bold text-slate-900">Staff Leave & Attendance Tracking</h2>
        </div>
        <button onClick={() => setIsLeaveModalOpen(true)} className="flex items-center space-x-2 bg-[#0052CC] hover:bg-[#003d99] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> <span>Apply for Leave</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-6 py-3">Staff Name</th>
                <th className="px-6 py-3">Leave Type</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3 text-center">Status</th>
                {canApprove && <th className="px-6 py-3 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaveRequests.map(leave => (
                <tr key={leave.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{leave.staff_name}</td>
                  <td className="px-6 py-4">{leave.leave_type}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-700">{leave.start_date} to {leave.end_date}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{leave.reason}</td>
                  <td className="px-6 py-4 text-center"><StatusBadge status={leave.status} /></td>
                  {canApprove && (
                    <td className="px-6 py-4 text-center space-x-2">
                      <button onClick={() => handleAction(leave.id, 'APPROVED')} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200 hover:bg-emerald-100">
                        Approve
                      </button>
                      <button onClick={() => handleAction(leave.id, 'REJECTED')} className="px-2.5 py-1 bg-red-50 text-red-700 rounded text-xs font-bold border border-red-200 hover:bg-red-100">
                        Reject
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
