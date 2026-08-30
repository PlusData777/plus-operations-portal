"use client";
import React, { useState } from 'react';
import { Star, Award, CheckCircle } from 'lucide-react';

export default function AppraisalsView({ currentUser, profiles, showToast }) {
  const [appraisals, setAppraisals] = useState([
    { id: 'APP-01', cycle: '2026 Mid-Year Review', staff_name: 'General Staff', staff_email: 'staff@plus.org', rating: 4.0, objectives: 'Exceeded pro-bono consultation targets by 20%.', current_approver: 'salma@plus.org', status: 'PENDING_L1' }
  ]);

  const handleCreateAppraisal = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const manager = profiles.find(p => p.email === currentUser.reports_to) || { email: 'altafkhoso.adv@gmail.com' };

    const newApp = {
      id: `APP-0${appraisals.length + 1}`,
      cycle: fd.get('cycle'),
      staff_name: currentUser.name,
      staff_email: currentUser.email,
      rating: parseFloat(fd.get('rating')),
      objectives: fd.get('objectives'),
      current_approver: manager.email,
      status: 'PENDING_L1'
    };
    setAppraisals([newApp, ...appraisals]);
    showToast(`Appraisal submitted and routed to manager (${manager.email}) for review.`);
    e.target.reset();
  };

  const handleApprove = (appId) => {
    setAppraisals(appraisals.map(a => {
      if (a.id !== appId) return a;
      if (a.status === 'PENDING_L1') {
        return { ...a, current_approver: 'altafkhoso.adv@gmail.com', status: 'PENDING_L2' };
      }
      return { ...a, current_approver: 'Completed', status: 'APPROVED' };
    }));
    showToast('Appraisal review advanced successfully.');
  };

  const relevantAppraisals = appraisals.filter(a => 
    currentUser.role === 'EXECUTIVE' || 
    a.staff_email === currentUser.email || 
    a.current_approver === currentUser.email
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Staff Performance Appraisals & Routing</h2>
          <p className="text-xs text-slate-500">Appraisals automatically route from staff to L1 managers and CEO Altaf Khoso.</p>
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
          <h3 className="font-bold text-sm text-slate-800 mb-4">Appraisal Queue & Status</h3>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-4 py-2">Cycle & Staff</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Approver</th>
                <th className="px-4 py-2 text-center">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {relevantAppraisals.map(app => {
                const canAction = currentUser.email === app.current_approver || currentUser.role === 'EXECUTIVE';
                return (
                  <tr key={app.id}>
                    <td className="px-4 py-3"><span className="font-bold text-slate-900 block">{app.cycle}</span><span className="text-xs text-slate-500">{app.staff_name}</span></td>
                    <td className="px-4 py-3 font-bold text-amber-600 flex items-center pt-5"><Star className="w-3.5 h-3.5 fill-current mr-1" /> {app.rating} / 5.0</td>
                    <td className="px-4 py-3 text-xs text-blue-600 font-semibold">{app.current_approver}</td>
                    <td className="px-4 py-3 text-center">
                      {canAction && app.status !== 'APPROVED' ? (
                        <button onClick={() => handleApproveAppraisal(app.id)} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-200 hover:bg-emerald-100">
                          Approve Review
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700">{app.status}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
