"use client";
import React, { useState } from 'react';
import { Clock, Plus, CheckCircle2, X } from 'lucide-react';

export default function TimesheetsView({ currentUser, showToast }) {
  const [timesheets, setTimesheets] = useState([
    { id: 'TS-501', staffName: 'Kamanger', hub: 'Hyderabad', weekEnding: '2026-08-28', regularHours: 40, overtimeHours: 6, status: 'Verified by HR', notes: 'Field setup for UC Qasimabad community legal camp.' },
    { id: 'TS-502', staffName: 'Adv Azizullah', hub: 'Sukkur', weekEnding: '2026-08-28', regularHours: 37.5, overtimeHours: 2, status: 'Approved', notes: 'High court hearings and under-trial jail visits.' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regHours, setRegHours] = useState(40);
  const [otHours, setOtHours] = useState(0);
  const [notes, setNotes] = useState('');

  const handleLogHours = (e) => {
    e.preventDefault();
    setTimesheets([{ id: `TS-50${timesheets.length + 1}`, staffName: currentUser.name, hub: currentUser.posting || 'Karachi', weekEnding: new Date().toISOString().split('T')[0], regularHours: regHours, overtimeHours: otHours, status: 'Submitted', notes }, ...timesheets]);
    setIsModalOpen(false);
    setNotes('');
    setOtHours(0);
    showToast('Timesheet hours successfully logged and submitted.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Staff Timesheets & Attendance</h2>
          <p className="text-xs text-slate-500">Track weekly working hours and overtime synced with monthly payroll.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052CC] hover:bg-[#003d99] px-4 py-2 text-xs font-bold text-white shadow-sm transition">
          <Plus className="w-4 h-4" /> <span>+ Log Weekly Hours</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border p-6 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b">
            <tr><th className="py-3 px-4">ID</th><th className="py-3 px-4">Staff & Hub</th><th className="py-3 px-4">Week Ending</th><th className="py-3 px-4">Regular</th><th className="py-3 px-4">Overtime</th><th className="py-3 px-4">Status</th><th className="py-3 px-4 text-right">Notes</th></tr>
          </thead>
          <tbody className="divide-y">
            {timesheets.map(t => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold text-[#0052CC]">{t.id}</td>
                <td className="py-3 px-4"><span className="font-bold text-slate-900">{t.staffName}</span><span className="block text-[10px] text-slate-500">{t.hub}</span></td>
                <td className="py-3 px-4 font-mono">{t.weekEnding}</td>
                <td className="py-3 px-4 font-mono font-bold">{t.regularHours} hrs</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-600">+{t.overtimeHours} hrs</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border">{t.status}</span></td>
                <td className="py-3 px-4 text-right text-slate-500 max-w-xs truncate">{t.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Log Weekly Work Hours</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleLogHours} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Regular Hours</label><input type="number" step="0.5" required value={regHours} onChange={e => setRegHours(parseFloat(e.target.value) || 0)} className="w-full rounded-xl border p-2 text-xs font-bold" /></div>
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Overtime Hours</label><input type="number" step="0.5" value={otHours} onChange={e => setOtHours(parseFloat(e.target.value) || 0)} className="w-full rounded-xl border p-2 text-xs font-bold text-emerald-600" /></div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Activity Summary</label>
                <textarea rows={3} required placeholder="Field work, legal clinics, or administrative outputs..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full rounded-xl border p-2 text-xs resize-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Submit Timesheet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
