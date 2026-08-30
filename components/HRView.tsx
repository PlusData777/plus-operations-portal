"use client";
import React, { useState } from 'react';
import { UserCheck, Award, LogOut, FileCheck2, ShieldAlert, Plus, X, Send, CheckCircle2 } from 'lucide-react';

export default function HRView({ currentUser, showToast }) {
  const [activeTab, setActiveTab] = useState('APPRAISALS');
  const [appraisals, setAppraisals] = useState([
    { id: 'APR-01', staffName: 'Adv Azizullah', reviewPeriod: 'Q1-Q2 2026', caseworkScore: 4.8, fieldTargetScore: 4.5, complianceScore: 5.0, overallRating: 'Outstanding', managerComments: 'Exceptional bail disposal rate in Sukkur Sessions Court.' },
    { id: 'APR-02', staffName: 'Kamanger', reviewPeriod: 'Q1-Q2 2026', caseworkScore: 4.2, fieldTargetScore: 4.7, complianceScore: 4.6, overallRating: 'Exceeds Expectations', managerComments: 'Strong field coordination in Sukkur camps.' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [comments, setComments] = useState('');

  const handleSaveAppraisal = (e) => {
    e.preventDefault();
    if (!staffName) return;
    setAppraisals([{ id: `APR-0${appraisals.length + 1}`, staffName, reviewPeriod: 'Q3 2026', caseworkScore: 4.5, fieldTargetScore: 4.5, complianceScore: 4.8, overallRating: 'Exceeds Expectations', managerComments: comments }, ...appraisals]);
    setIsModalOpen(false);
    setStaffName('');
    setComments('');
    showToast('Performance appraisal recorded successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">HR Governance & Staff Lifecycle</h2>
          <p className="text-xs text-slate-500">Performance evaluations, exit handovers, and bar licensure compliance.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052CC] hover:bg-[#003d99] px-4 py-2 text-xs font-bold text-white shadow-sm transition">
          <Plus className="w-4 h-4" /> <span>+ New HR Review</span>
        </button>
      </div>

      <div className="flex gap-2 border-b pb-3 text-xs font-semibold">
        <button onClick={() => setActiveTab('APPRAISALS')} className={`px-4 py-2 rounded-xl transition ${activeTab === 'APPRAISALS' ? 'bg-[#0052CC] text-white shadow-sm' : 'bg-white border text-slate-600'}`}>Performance Appraisals</button>
        <button onClick={() => setActiveTab('COMPLIANCE')} className={`px-4 py-2 rounded-xl transition ${activeTab === 'COMPLIANCE' ? 'bg-[#0052CC] text-white shadow-sm' : 'bg-white border text-slate-600'}`}>Bar Licensure & Undertakings</button>
      </div>

      {activeTab === 'APPRAISALS' && (
        <div className="space-y-4">
          {appraisals.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0052CC]">{a.id} • {a.reviewPeriod}</span>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5">{a.staffName}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">★ {a.overallRating}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center text-xs">
                <div><span className="text-[10px] uppercase text-slate-400 block">Casework</span><span className="font-bold text-[#0052CC]">{a.caseworkScore} / 5.0</span></div>
                <div><span className="text-[10px] uppercase text-slate-400 block">Field Target</span><span className="font-bold text-[#c65a28]">{a.fieldTargetScore} / 5.0</span></div>
                <div><span className="text-[10px] uppercase text-slate-400 block">Compliance</span><span className="font-bold text-emerald-600">{a.complianceScore} / 5.0</span></div>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border"><strong>Manager Notes:</strong> {a.managerComments}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'COMPLIANCE' && (
        <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Statutory Compliance Undertakings</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border flex justify-between items-center">
              <span>Sindh Bar Council License Verification for Panel Advocates</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">100% Compliant</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border flex justify-between items-center">
              <span>Child Protection & Anti-Harassment Code of Conduct</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">All Signed</span>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Record Performance Review</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveAppraisal} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Staff Name</label>
                <input type="text" required placeholder="Ayesha Khan" value={staffName} onChange={e => setStaffName(e.target.value)} className="w-full rounded-xl border p-2 text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Evaluation & Feedback</label>
                <textarea rows={3} placeholder="Summarize key achievements..." value={comments} onChange={e => setComments(e.target.value)} className="w-full rounded-xl border p-2 text-xs resize-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Save Evaluation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
