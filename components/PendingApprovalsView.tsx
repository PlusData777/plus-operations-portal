"use client";
import React from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PendingApprovalsView({ requests = [], setRequests, currentUser, showToast }) {
  const pendingQueue = requests.filter(r => r.status?.includes('PENDING'));

  const handleApprove = async (id) => {
    const { error } = await supabase.from('requests').update({ status: 'APPROVED' }).eq('id', id);
    if (error) {
      showToast('Error updating approval status.');
    } else {
      showToast('Requisition successfully approved.');
      setRequests(requests.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Pending Approvals Queue</h2>
        <p className="text-xs text-slate-500">Review and authorize financial claims and staff requisitions.</p>
      </div>

      <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
        {pendingQueue.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-8 text-center">No pending approvals require your authorization at this time.</p>
        ) : (
          pendingQueue.map(r => (
            <div key={r.id} className="p-4 bg-slate-50 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#0052CC]">{r.id}</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">{r.hub}</span>
                </div>
                <h4 className="font-bold text-slate-900 mt-1">{r.expense_head}</h4>
                <p className="text-slate-500">Requested by: <strong>{r.requester_name}</strong> (PKR {(Number(r.requested_amount) || 0).toLocaleString()})</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleApprove(r.id)} className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm transition">
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Approve</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
