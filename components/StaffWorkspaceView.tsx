"use client";
import React, { useState } from 'react';
import { CheckSquare, Calendar, Receipt, Clock, Plus, CheckCircle, FileText, Star } from 'lucide-react';

export default function StaffWorkspaceView({ currentUser, requests, leaveRequests, showToast }) {
  // Mock tasks assigned to the current user
  const [tasks, setTasks] = useState([
    { id: 'TSK-101', title: 'Draft Sindh High Court Petition Counter-Affidavit', program: 'Sindh Legal Aid Initiative', status: 'IN_PROGRESS', due_date: '2026-09-02' },
    { id: 'TSK-102', title: 'Compile Monthly Community Outreach Beneficiary Statistics', program: 'UNDP Grant', status: 'PENDING', due_date: '2026-09-05' }
  ]);

  // Mock timesheet logs
  const [timesheets, setTimesheets] = useState([
    { id: 'TS-01', date: '2026-08-28', hours: 8, project: 'Sindh Legal Aid Initiative', description: 'Client consultation & documentation' }
  ]);

  const [activeSubTab, setActiveSubTab] = useState('tasks');

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

  // Filter requisitions for current user
  const myRequests = requests.filter(r => r.requester_email === currentUser.email);
  const myLeaves = leaveRequests.filter(l => l.staff_email === currentUser.email);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Staff Personal Workspace</h2>
          <p className="text-xs text-slate-500">Manage your assigned tasks, leave balances, requisition trackers, and timesheets.</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button onClick={() => setActiveSubTab('tasks')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'tasks' ? 'bg-white text-[#0052CC] shadow-sm' : 'text-slate-600'}`}>My Tasks</button>
          <button onClick={() => setActiveSubTab('leaves')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'leaves' ? 'bg-white text-[#0052CC] shadow-sm' : 'text-slate-600'}`}>Leaves & Balances</button>
          <button onClick={() => setActiveSubTab('requisitions')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'requisitions' ? 'bg-white text-[#0052CC] shadow-sm' : 'text-slate-600'}`}>My Requisitions</button>
          <button onClick={() => setActiveSubTab('timesheets')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'timesheets' ? 'bg-white text-[#0052CC] shadow-sm' : 'text-slate-600'}`}>Timesheets</button>
        </div>
      </div>

      {/* TAB 1: TASKS */}
      {activeSubTab === 'tasks' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-sm text-slate-800 flex items-center"><CheckSquare className="w-4 h-4 text-blue-600 mr-2" /> Assigned Tasks & Deliverables</h3>
            <span className="text-xs bg-blue-50 text-[#0052CC] px-2.5 py-1 rounded-full font-bold">{tasks.filter(t => t.status !== 'COMPLETED').length} Active</span>
          </div>
          <div className="space-y-3">
            {tasks.map(task => (
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

      {/* TAB 2: LEAVES & BALANCES */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs uppercase font-bold text-slate-500">Annual Leave</span>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-2xl font-black text-slate-900">14 Days</span>
                <span className="text-xs text-emerald-600 font-semibold">Balance Available</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Availed: 4 Days | Applied: 0</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs uppercase font-bold text-slate-500">Sick Leave</span>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-2xl font-black text-slate-900">8 Days</span>
                <span className="text-xs text-emerald-600 font-semibold">Balance Available</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Availed: 2 Days | Applied: 0</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs uppercase font-bold text-slate-500">Casual Leave</span>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-2xl font-black text-slate-900">5 Days</span>
                <span className="text-xs text-emerald-600 font-semibold">Balance Available</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Availed: 1 Day | Applied: 1</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-sm text-slate-800 mb-4">My Leave Applications History</h3>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-2">Leave Type</th>
                  <th className="px-4 py-2">Duration</th>
                  <th className="px-4 py-2">Reason</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
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

      {/* TAB 3: REQUISITIONS */}
      {activeSubTab === 'requisitions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center"><Receipt className="w-4 h-4 text-blue-600 mr-2" /> My Submitted Requisitions (Finance, Admin & Asset)</h3>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-4 py-3">ID / Type</th>
                <th className="px-4 py-3">Expense Head</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Current Approver</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {myRequests.map(req => (
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

      {/* TAB 4: TIMESHEETS */}
      {activeSubTab === 'timesheets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center"><Clock className="w-4 h-4 text-blue-600 mr-2" /> Log Timesheet Hours</h3>
            <form onSubmit={handleLogTimesheet} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                <input type="date" name="date" className="w-full border rounded-lg p-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hours Worked</label>
                <input type="number" step="0.5" name="hours" placeholder="8" className="w-full border rounded-lg p-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Project / Grant</label>
                <input type="text" name="project" placeholder="Sindh Legal Aid Initiative" className="w-full border rounded-lg p-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Activity Description</label>
                <textarea name="description" placeholder="Conducted field interviews..." className="w-full border rounded-lg p-2 text-sm" rows={2} required></textarea>
              </div>
              <button type="submit" className="w-full bg-[#0052CC] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#003d99]">Log Hours</button>
            </form>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-sm text-slate-800 mb-4">My Logged Timesheet Entries</h3>
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Hours</th>
                  <th className="px-4 py-2">Project</th>
                  <th className="px-4 py-2">Description</th>
                </tr>
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
