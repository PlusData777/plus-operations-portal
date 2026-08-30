"use client";
import React, { useState } from 'react';
import { Scale, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DocketsView({ dockets, refreshDockets, showToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [caseNum, setCaseNum] = useState('');
  const [client, setClient] = useState('');
  const [court, setCourt] = useState('District & Sessions Court, Sukkur');

  const handleCreateDocket = async (e) => {
    e.preventDefault();
    if (!title) return;

    const { error } = await supabase.from('dockets').insert([{
      case_number: caseNum || 'Cr. Bail App #492/26',
      title,
      client_name: client || 'Beneficiary',
      court_name: court,
      hearing_date: new Date().toISOString().split('T')[0],
      status: 'OPEN',
      assigned_email: 'advazizullah@gmail.com'
    }]);

    if (error) {
      showToast('Error inserting case docket into Supabase.');
    } else {
      showToast('Case docket successfully logged.');
      setIsModalOpen(false);
      setTitle('');
      setCaseNum('');
      setClient('');
      refreshDockets();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Legal Case Dockets</h2>
          <p className="text-xs text-slate-500">Active litigation files, bail petitions, and court hearings.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052CC] hover:bg-[#003d99] px-4 py-2 text-xs font-bold text-white shadow-sm transition">
          <Plus className="w-4 h-4" /> <span>+ New Case Docket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dockets.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border p-12 text-center text-slate-400">
            <Scale className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No case dockets found in Supabase.</p>
            <p className="text-xs mt-1">Click "+ New Case Docket" above to record your first client case.</p>
          </div>
        ) : (
          dockets.map(d => (
            <div key={d.id} className="bg-white rounded-2xl border p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0052CC]">{d.case_number}</span>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5">{d.title}</h3>
                  <p className="text-xs text-slate-500">Client: {d.client_name}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border">{d.status}</span>
              </div>
              <div className="pt-2 border-t flex justify-between text-xs text-slate-600">
                <span>Court: <strong>{d.court_name}</strong></span>
                <span className="text-[#c65a28] font-mono">Hearing: {d.hearing_date}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Log New Case Docket</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateDocket} className="space-y-3">
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Case Title</label><input type="text" required placeholder="State vs. Ghulam Rasool" value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-xl border p-2 text-xs" /></div>
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">FIR / Case Ref Number</label><input type="text" placeholder="Cr. Bail Application #492/26" value={caseNum} onChange={e => setCaseNum(e.target.value)} className="w-full rounded-xl border p-2 text-xs font-mono" /></div>
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Client Name</label><input type="text" placeholder="Ghulam Rasool" value={client} onChange={e => setClient(e.target.value)} className="w-full rounded-xl border p-2 text-xs" /></div>
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Court Venue</label><input type="text" value={court} onChange={e => setCourt(e.target.value)} className="w-full rounded-xl border p-2 text-xs" /></div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Save Docket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
