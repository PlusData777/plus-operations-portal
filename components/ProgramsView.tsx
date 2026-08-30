"use client";
import React, { useState } from 'react';
import { Briefcase, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProgramsView({ programs, refreshPrograms, showToast }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [donor, setDonor] = useState('');
  const [budget, setBudget] = useState(0);
  const [hub, setHub] = useState('Karachi');

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    if (!name) return;

    const { error } = await supabase.from('programs').insert([{
      name,
      donor_name: donor || 'UNDP / Donor',
      grant_budget: budget || 1000000,
      spent: 0,
      hub,
      status: 'ACTIVE'
    }]);

    if (error) {
      showToast('Error creating program in Supabase.');
    } else {
      showToast('Program successfully created.');
      setIsModalOpen(false);
      setName('');
      setDonor('');
      setBudget(0);
      refreshPrograms();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Programs & Grants Overview</h2>
          <p className="text-xs text-slate-500">Active institutional grants and project initiatives.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052CC] hover:bg-[#003d99] px-4 py-2 text-xs font-bold text-white shadow-sm transition">
          <Plus className="w-4 h-4" /> <span>+ New Program</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border p-12 text-center text-slate-400">
            <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No programs found in Supabase.</p>
            <p className="text-xs mt-1">Click "+ New Program" above to create your first grant project.</p>
          </div>
        ) : (
          programs.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0052CC]">{p.hub} Hub</span>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5">{p.name}</h3>
                  <p className="text-xs text-slate-500">Donor: {p.donor_name}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border">{p.status}</span>
              </div>
              <div className="pt-2 border-t flex justify-between text-xs font-medium text-slate-600">
                <span>Budget: PKR {(Number(p.grant_budget) || 0).toLocaleString()}</span>
                <span className="text-[#c65a28]">Spent: PKR {(Number(p.spent) || 0).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Create New Grant Program</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateProgram} className="space-y-3">
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Program Name</label><input type="text" required placeholder="Sindh Legal Aid Initiative" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border p-2 text-xs" /></div>
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Donor Name</label><input type="text" placeholder="UNDP / i-Care" value={donor} onChange={e => setDonor(e.target.value)} className="w-full rounded-xl border p-2 text-xs" /></div>
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Grant Budget (PKR)</label><input type="number" placeholder="5000000" value={budget || ''} onChange={e => setBudget(parseFloat(e.target.value) || 0)} className="w-full rounded-xl border p-2 text-xs font-bold" /></div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Regional Hub</label>
                <select value={hub} onChange={e => setHub(e.target.value)} className="w-full rounded-xl border p-2 text-xs font-semibold">
                  <option value="Karachi">Karachi HQ</option><option value="Hyderabad">Hyderabad</option><option value="Sukkur">Sukkur</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Create Program</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
