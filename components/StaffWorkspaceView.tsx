"use client";
import React, { useState } from 'react';
import { CheckSquare, Calendar, Receipt, Clock, Star, Building2, User, FileText, CheckCircle } from 'lucide-react';

export default function StaffWorkspaceView({ currentUser, requests, leaveRequests, showToast, profiles }) {
  const [tasks, setTasks] = useState([
    { id: 'TSK-101', title: 'Draft Sindh High Court Petition Counter-Affidavit', program: 'Sindh Legal Aid Initiative', status: 'IN_PROGRESS', due_date: '2026-09-02', assigned_to: currentUser.email },
    { id: 'TSK-102', title: 'Compile Monthly Community Outreach Beneficiary Statistics', program: 'UNDP Grant', status: 'PENDING', due_date: '2026-09-05', assigned_to: currentUser.email }
  ]);

  const [timesheets, setTimesheets] = useState([
    { id: 'TS-01', date: '2026-08-28', hours: 8, project: 'Sindh Legal Aid Initiative', description: 'Client consultation & documentation' }
  ]);

  const [activeSubTab, setActiveSubTab] = useState('profile');

  // Find managers
  const firstManager = profiles.find(p => p.email === currentUser.reports_to);
  const secondManager = profiles.find(p => p.email === currentUser.second_manager);

  // Filter tasks assigned to current user or globally assigned
  const myTasks = tasks.filter(t => t.assigned_to === currentUser.email || t.assigned_to === 'ALL');
  const myRequisitions = requests.filter(r => r.requester_email === currentUser.email);
  const myLeaves = leaveRequests.filter(l => l.staff_email === currentUser.email);

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: t.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED' } : t));
    showToast('Task status updated successfully.');
  };

  const handleLogTimesheet = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newEntry = {
      id: `TS-0${timesheets.length + 1}`,
      date: fd.get('date'),
      hours: parseFloat(fd.get('hours')),
      project: fd.get('project'),
      description: fd.get('description')
    };
    setTimesheets([newEntry, ...timesheets]);
    showToast('Timesheet hours logged successfully.');
    e.target.reset();
  };

  // Render Star Rating Strip
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.round(rating || 0);
    return (
      <div className="flex items-center space-x-1">
        {[...Array(totalStars)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < filledStars ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} 
          />
        ))}
        <span className="text-xs font-bold text-slate-700 ml-1">({rating} / 5.0)</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER PROFILE STRIP */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-[#0052CC] flex items-center justify-center font-black text-2xl border border-blue-200">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              {renderStars(currentUser.rating)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser.designation} • {currentUser.department} Department</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setActiveSubTab('profile')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'profile' ? 'bg-white text-[#0052CC] shadow-sm' : 'text-slate-600'}`}>Profile Details</button>
          <button onClick={() => setActiveSubTab('tasks')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'tasks' ? 'bg-white text-[#0052CC] shadow-sm' : 'text-slate-600'}`}>My Tasks</button>
          <button onClick={() => setActiveSubTab('leaves')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'leaves' ? 'bg-white text-[#0052CC] shadow-sm' : 'text-slate-600'}`}>Leaves & Balances</button>
          <button onClick={() => setActiveSubTab('requisitions')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'requisitions' ? 'bg-white text-[#0052CC] shadow-sm' : 'text-slate-600'}`}>Requisitions</button>
          <button onClick={() => setActiveSubTab('timesheets')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'timesheets' ? 'bg-white text-[#0052CC] shadow-sm' : 'text-slate-600'}`}>Timesheets</button>
        </div>
      </div>

      {/* SUB-TAB 1: PROFILE DETAILS & CONTRACT */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b pb-2 flex items-center"><User className="w-4 h-4 text-[#0052CC] mr-2" /> Institutional Designation & Reporting</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">First-Line Manager</span>
                <span className="font-bold text-slate-800">{firstManager ? firstManager.name : 'None (Executive)'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Second-Line Manager</span>
                <span className="font-bold text-slate-800">{secondManager ? secondManager.name : 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Assigned Project</span>
                <span className="font-bold text-slate-800">{currentUser.project || 'General Operations'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Place of Posting</span>
                <span className="font-bold text-slate-800">{currentUser.posting || 'Karachi HQ'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b pb-2 flex items-center"><FileText className="w-4 h-4 text-[#0052CC] mr-2" /> Qualifications & Contract Term</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Professional Qualifications</span>
                <span className="font-bold text-slate-800">{currentUser.qualifications || 'Standard Institutional Certification'}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-400 block">Contract Start Date</span>
                  <span className="font-bold text-slate-800">{currentUser.contract_start || '2025-01-01'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contract End Date</span>
                  <span className="font-bold text-slate-800">{currentUser.contract_end || '2027-12-31'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TASKS */}
      {activeSubTab === 'tasks' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-sm text-slate-800 flex items-center"><CheckSquare className="w-4 h-4 text-blue-600 mr-2" /> Assigned Tasks & Deliverables</h3>
            <span className="text-xs bg-blue-50 text-[#0052CC] px-2.5 py-1 rounded-full font-bold">{myTasks.filter(t => t.status !== 'COMPLETED').length} Active</span>
          </div>
          <div className="space-y-3">
            {myTasks.map(task => (
              <div key={task.id} className={`p-4 rounded-xl border flex items-center justify-between ${task.status === 'COMPLETED' ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-blue-200 shadow-sm'}`}>
                <div className="flex items-start space-x-3">
                  <input type="checkbox" checked={task.status === 'COMPLETED'} onChange={() => handleToggleTask(task.id)} className="mt-1 w-4 h-4 rounded text-[#0052CC]" />
                  <div>
                    <h4 className={`font-bold text-sm ${task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-900'}`}>{task.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Program: {task.program} • Due: {task.due_date}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{task.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LEAVES & BALANCES */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs uppercase font-bold text-slate-500">Annual Leave</span>
              <div className="flex justify-between items-baseline mt-2"><span className="text-2xl font-black text-slate-900">14 Days</span><span className="text-xs text-emerald-600 font-semibold">Available</span></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs uppercase font-bold text-slate-500">Sick Leave</span>
              <div className="flex justify-between items-baseline mt-2"><span className="text-2xl font-black text-slate-900">8 Days</span><span className="text-xs text-emerald-600 font-semibold">Available</span></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs uppercase font-bold text-slate-500">Casual Leave</span>
              <div className="flex justify-between items-baseline mt-2"><span className="text-2xl font-black text-slate-900">5 Days</span><span className="text-xs text-emerald-600 font-semibold">Available</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-sm text-slate-800 mb-4">My Leave Applications History</h3>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
                <tr><th className="px-4 py-2">Leave Type</th><th className="px-4 py-2">Duration</th><th className="px-4 py-2">Reason</th><th className="px-4 py-2 text-center">Status</th></tr>
              </thead>
              <tbody className="divide-y">
                {myLeaves.map(l => (
                  <tr key={l.id}>
                    <td className="px-4 py-3 font-semibold text-slate-800">{l.leave_type}</td>
                    <td className="px-4 py-3 text-xs">{l.start_date} to {l.end_date}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{l.reason}</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: REQUISITIONS */}
      {activeSubTab === 'requisitions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center"><Receipt className="w-4 h-4 text-blue-600 mr-2" /> My Submitted Requisitions (Finance, Admin & Assets)</h3>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr><th className="px-4 py-3">ID / Type</th><th className="px-4 py-3">Expense Head</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Current Approver</th><th className="px-4 py-3 text-center">Status</th></tr>
            </thead>
            <tbody className="divide-y">
              {myRequisitions.map(req => (
                <tr key={req.id}>
                  <td className="px-4 py-3 font-bold text-slate-900">{req.id} <span className="block text-xs font-normal text-slate-500">{req.claim_type}</span></td>
                  <td className="px-4 py-3">{req.expense_head}</td>
                  <td className="px-4 py-3 font-bold">PKR {req.requested_amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-medium text-blue-600">{req.current_approver}</td>
                  <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">{req.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUB-TAB 5: TIMESHEETS */}
      {activeSubTab === 'timesheets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center"><Clock className="w-4 h-4 text-blue-600 mr-2" /> Log Timesheet Hours</h3>
            <form onSubmit={handleLogTimesheet} className="space-y-4">
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Date</label><input type="date" name="date" className="w-full border rounded-lg p-2 text-sm" required /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Hours Worked</label><input type="number" step="0.5" name="hours" placeholder="8" className="w-full border rounded-lg p-2 text-sm" required /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Project / Grant</label><input type="text" name="project" placeholder="Sindh Legal Aid Initiative" className="w-full border rounded-lg p-2 text-sm" required /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Activity Description</label><textarea name="description" placeholder="Conducted field interviews..." className="w-full border rounded-lg p-2 text-sm" rows={2} required></textarea></div>
              <button type="submit" className="w-full bg-[#0052CC] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#003d99]">Log Hours</button>
            </form>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-sm text-slate-800 mb-4">My Logged Timesheet Entries</h3>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
                <tr><th className="px-4 py-2">Date</th><th className="px-4 py-2">Hours</th><th className="px-4 py-2">Project</th><th className="px-4 py-2">Description</th></tr>
              </thead>
              <tbody className="divide-y">
                {timesheets.map(ts => (
                  <tr key={ts.id}>
                    <td className="px-4 py-3 font-semibold">{ts.date}</td>
                    <td className="px-4 py-3 font-bold text-[#0052CC]">{ts.hours} hrs</td>
                    <td className="px-4 py-3 text-xs">{ts.project}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{ts.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
