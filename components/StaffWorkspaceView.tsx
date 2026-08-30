"use client";
import React, { useState } from 'react';
import { CheckSquare, Calendar, Clock, Award, User, Building } from 'lucide-react';

export default function StaffWorkspaceView({ currentUser, requests = [], showToast }) {
  const [activeTab, setActiveTab] = useState('profile');

  const myRequests = requests.filter(r => r.requester_email?.toLowerCase() === currentUser.email?.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center font-bold text-xl border border-blue-200">
            {currentUser.name ? currentUser.name.charAt(0) : 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
            <p className="text-xs text-slate-500">{currentUser.designation || 'Staff'} • {currentUser.posting || 'Karachi HQ'}</p>
            <p className="text-[11px] font-mono text-blue-600 mt-0.5">{currentUser.email}</p>
          </div>
        </div>
        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-[#0052CC] border border-blue-200">★ 5.0 / 5.0</span>
      </div>

      <div className="flex gap-2 border-b pb-3 text-xs font-semibold">
        <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-xl transition ${activeTab === 'profile' ? 'bg-[#0052CC] text-white shadow-sm' : 'bg-white border text-slate-600'}`}>Profile Details</button>
        <button onClick={() => setActiveTab('tasks')} className={`px-4 py-2 rounded-xl transition ${activeTab === 'tasks' ? 'bg-[#0052CC] text-white shadow-sm' : 'bg-white border text-slate-600'}`}>My Tasks</button>
        <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 rounded-xl transition ${activeTab === 'requests' ? 'bg-[#0052CC] text-white shadow-sm' : 'bg-white border text-slate-600'}`}>My Requisitions ({myRequests.length})</button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Organizational Reporting & Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Line Manager 1 (L1)</span>
              <span className="font-bold text-slate-800">{currentUser.reports_to || 'Altaf Khoso'}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Line Manager 2 (L2)</span>
              <span className="font-bold text-slate-800">{currentUser.second_manager || 'Japheth Wilson'}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border md:col-span-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Professional Qualifications</span>
              <span className="font-bold text-slate-800">{currentUser.qualifications || 'LL.B / High Court Advocate'}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Assigned Operational Tasks</h3>
          <div className="p-3.5 bg-slate-50 rounded-xl border flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-800">Review quarterly grant expenditure reports</p>
              <span className="text-[11px] text-slate-500">Due: Sep 05, 2026 • Priority: High</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">Pending</span>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800">My Submitted Requisitions</h3>
          {myRequests.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">No requisitions submitted under your account yet.</p>
          ) : (
            <div className="space-y-2">
              {myRequests.map(r => (
                <div key={r.id} className="p-3 bg-slate-50 rounded-xl border flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#0052CC]">{r.id}</span>
                    <p className="font-semibold text-slate-800">{r.expense_head}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border">{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
