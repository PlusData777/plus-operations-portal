"use client";
import React, { useState } from 'react';
import { Users, Filter, Plus, Search, X } from 'lucide-react';

export default function PartnersView({ showToast }) {
  const [partners, setPartners] = useState([
    { id: 'PTR-01', name: 'National Vocational & Technical Training Commission (NAVTTC)', category: 'Accreditation & Skills', engagementScope: 'Accreditation and certification for prison vocational training units.', mouStatus: 'Active MoU', validThrough: '2027-12-31', focalPerson: 'Regional Directorate Sindh', jointInitiativesCount: 6 },
    { id: 'PTR-02', name: 'Sindh Judicial Academy', category: 'Government & Justice', engagementScope: 'Judicial dialogues, prosecutor sensitization, and bail jurisprudence.', mouStatus: 'Strategic Collaboration', validThrough: '2027-06-30', focalPerson: 'Faculty In-Charge', jointInitiativesCount: 8 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [scope, setScope] = useState('');

  const handleAddPartner = (e) => {
    e.preventDefault();
    if (!name) return;
    setPartners([{ id: `PTR-0${partners.length + 1}`, name, category: 'Government & Justice', engagementScope: scope, mouStatus: 'Active MoU', validThrough: '2027-12-31', focalPerson: 'Focal Desk', jointInitiativesCount: 1 }, ...partners]);
    setIsModalOpen(false);
    setName('');
    setScope('');
    showToast('Institutional partner successfully recorded.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Institutional Partners & Grant Matrix</h2>
          <p className="text-xs text-slate-500">Statutory bodies, judicial training academies, and civil society alliances.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052CC] hover:bg-[#003d99] px-4 py-2 text-xs font-bold text-white shadow-sm transition">
          <Plus className="w-4 h-4" /> <span>+ Add Partner / MoU</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input type="text" placeholder="Search partners by name or mandate..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-xs focus:outline-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partners.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-bold text-[#0052CC]">{p.id} • {p.category}</span>
                <h3 className="font-bold text-sm text-slate-900 mt-0.5">{p.name}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{p.mouStatus}</span>
            </div>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border">{p.engagementScope}</p>
            <div className="flex justify-between text-xs text-slate-500 pt-2 border-t">
              <span>Focal: <strong>{p.focalPerson}</strong></span>
              <span className="text-emerald-600 font-bold">{p.jointInitiativesCount} Joint Projects</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Add Institutional Partner</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddPartner} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Organization Name</label>
                <input type="text" required placeholder="Sindh Judicial Academy" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border p-2 text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Mandate & Scope</label>
                <textarea rows={3} required placeholder="Joint training and judicial dialogues..." value={scope} onChange={e => setScope(e.target.value)} className="w-full rounded-xl border p-2 text-xs resize-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Save Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
