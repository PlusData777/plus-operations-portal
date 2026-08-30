"use client";
import React, { useState } from 'react';
import { Star, Award, CheckCircle, FileText } from 'lucide-react';

export default function AppraisalsView({ currentUser, showToast }) {
  const [appraisals, setAppraisals] = useState([
    { id: 'APP-01', cycle: '2026 Mid-Year Review', staff_name: currentUser.name, rating: '4.8 / 5.0', status: 'SUBMITTED', objectives: 'Exceeded pro-bono case targets by 20%.' }
  ]);

  const handleCreateAppraisal = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newApp = {
      id: `APP-0${appraisals.length + 1}`,
      cycle: fd.get('cycle'),
      staff_name: currentUser.name,
      rating: `${fd.get('rating')} / 5.0`,
      status: 'PENDING_MANAGER_REVIEW',
      objectives: fd.get('objectives')
    };
    setAppraisals([newApp, ...appraisals]);
    showToast('Performance appraisal submitted successfully.');
    e.target.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Staff Performance Appraisals</h2>
          <p className="text-xs text-slate-500">Quarterly and annual performance goal setting, reviews, and manager feedback.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center"><Award className="w-4 h-4 text-amber-500 mr-2" /> Submit Appraisal Review</h3>
          <form onSubmit={handleCreateAppraisal} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Appraisal Cycle</label>
              <select name="cycle" className="w-full border rounded-lg p-2 text-sm bg-slate-50" required>
                <option value="2026 Mid-Year Review">2026 Mid-Year Review</option>
                <option value="2026 Annual Evaluation">2026 Annual Evaluation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Self-Assessment Rating (1 to 5)</label>
              <input type="number" step="0.1" max="5" min="1" name="rating" placeholder="4.5" className="w-full border rounded-lg p-2 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Key Achievements & Objectives</label>
              <textarea name="objectives" placeholder="Summarize your institutional impact..." className="w-full border rounded-lg p-2 text-sm" rows={3} required></textarea>
            </div>
            <button type="submit" className="w-full bg-[#0052CC] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#003d99]">Submit Appraisal</button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-sm text-slate-800 mb-4">Appraisal History & Status</h3>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-4 py-2">Cycle</th>
                <th className="px-4 py-2">Staff Member</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Objectives / Feedback</th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appraisals.map(app => (
                <tr key={app.id}>
                  <td className="px-4 py-3 font-bold text-slate-900">{app.cycle}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{app.staff_name}</td>
                  <td className="px-4 py-3 font-bold text-amber-600 flex items-center"><Star className="w-3.5 h-3.5 fill-current mr-1" /> {app.rating}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{app.objectives}</td>
                  <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">{app.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
