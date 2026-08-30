"use client";
import React, { useState, useEffect } from 'react';
import { UserCheck, Award, Plus, X, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function HRView({ currentUser, showToast }) {
  const [activeTab, setActiveTab] = useState('APPRAISALS');
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [comments, setComments] = useState('');

  const fetchHRData = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('appraisals').select('*');
      if (data) setAppraisals(data);
    } catch (e) {
      console.error('Error fetching HR data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRData();
  }, []);

  const handleSaveAppraisal = async (e) => {
    e.preventDefault();
    if (!staffName) return;

    const newApp = {
      staff_name: staffName,
      staff_email: 'staff@plus.org',
      department: 'Operations',
      review_period: 'Q3 2026',
      casework_score: 4.5,
      field_target_score: 4.6,
      compliance_score: 4.8,
      overall_rating: 'Exceeds Expectations',
      manager_comments: comments,
      status: 'Executive Approved'
    };

    const { error } = await supabase.from('appraisals').insert([newApp]);
    if (error) {
      showToast('Error saving appraisal to Supabase.');
    } else {
      showToast('Performance review successfully saved to Supabase.');
      setIsModalOpen(false);
      setStaffName('');
      setComments('');
      fetchHRData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">HR Governance & Staff Lifecycle (Supabase Live)</h2>
          <p className="text-xs text-slate-500">Real-time performance evaluations and compliance records.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchHRData} className="p-2 bg-white border rounded-xl hover:bg-slate-50"><RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} /></button>
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052CC] hover:bg-[#003d99] px-4 py-2 text-xs font-bold text-white shadow-sm transition">
            <Plus className="w-4 h-4" /> <span>+ New Review</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {appraisals.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No appraisals found in Supabase database.</p>
        ) : (
          appraisals.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0052CC]">{a.review_period}</span>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5">{a.staff_name}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">★ {a.overall_rating}</span>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border"><strong>Manager Notes:</strong> {a.manager_comments}</p>
            </div>
          ))
        )}
      </div>

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
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Comments</label>
                <textarea rows={3} placeholder="Evaluation notes..." value={comments} onChange={e => setComments(e.target.value)} className="w-full rounded-xl border p-2 text-xs resize-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Commit to Supabase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
