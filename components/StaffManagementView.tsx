"use client";
import React, { useState } from 'react';
import { Users, UserPlus, Mail, Building2, Trash2, Star } from 'lucide-react';

export default function StaffManagementView({ profiles, setProfiles, currentUser, showToast }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'EXECUTIVE';

  const handleAddStaff = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newStaff = {
      id: `usr-${Date.now()}`,
      name: fd.get('name'),
      email: fd.get('email'),
      designation: fd.get('designation'),
      role: fd.get('role'),
      department: fd.get('department'),
      reports_to: fd.get('reports_to'),
      second_manager: fd.get('second_manager'),
      project: fd.get('project'),
      qualifications: fd.get('qualifications'),
      posting: fd.get('posting'),
      contract_start: fd.get('contract_start'),
      contract_end: fd.get('contract_end'),
      rating: 4.5,
      status: 'ACTIVE'
    };
    setProfiles([...profiles, newStaff]);
    setIsAddModalOpen(false);
    showToast('Staff member successfully onboarded and synced.');
  };

  const handleRemoveStaff = (id) => {
    if (!isAdmin) {
      showToast('Unauthorized: Only Administrator Atif Ali can remove staff.');
      return;
    }
    setProfiles(profiles.filter(p => p.id !== id));
    showToast('Staff member removed from institutional directory.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Staff Directory & Management</h2>
          <p className="text-xs text-slate-500">Administrator Atif Ali has full institutional control to add or remove staff members.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2 bg-[#0052CC] hover:bg-[#003d99] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <UserPlus className="w-4 h-4" /> <span>Onboard New Staff</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b">
              <tr>
                <th className="px-6 py-3">Staff Name & Email</th>
                <th className="px-6 py-3">Designation / Role</th>
                <th className="px-6 py-3">Reporting Lines</th>
                <th className="px-6 py-3">Posting & Contract</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.map(staff => {
                const l1 = profiles.find(p => p.email === staff.reports_to);
                const l2 = profiles.find(p => p.email === staff.second_manager);
                return (
                  <tr key={staff.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{staff.name}</span>
                      <span className="text-xs text-slate-500 flex items-center mt-0.5"><Mail className="w-3 h-3 mr-1" />{staff.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 block">{staff.designation}</span>
                      <span className="text-[10px] bg-blue-50 text-[#0052CC] px-2 py-0.5 rounded font-bold uppercase">{staff.role}</span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="block font-semibold text-slate-700">L1: {l1 ? l1.name : 'None'}</span>
                      <span className="text-slate-500">L2: {l2 ? l2.name : 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="block font-semibold text-slate-700">{staff.posting}</span>
                      <span className="text-slate-500">{staff.contract_start} to {staff.contract_end}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isAdmin && (
                        <button onClick={() => handleRemoveStaff(staff.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove Staff">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ONBOARD STAFF MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Onboard New Staff Member</h3>
              <button onClick={() => setIsAddModalOpen(false)}><Users className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label><input type="text" name="name" placeholder="Ayesha Khan" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label><input type="email" name="email" placeholder="ayesha@plus.org" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Designation</label><input type="text" name="designation" placeholder="Legal Officer" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
                  <select name="department" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                    <option value="Programs">Programs</option><option value="Operations">Operations</option><option value="Finance">Finance</option><option value="HR">HR</option><option value="IT">IT</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">System Role Access</label>
                  <select name="role" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                    <option value="STAFF">Staff / Officer</option><option value="PROGRAM_MGR">Program Manager</option><option value="FINANCE_MGR">Finance Manager</option><option value="HR_ADMIN">HR Admin</option><option value="ADMIN">System Admin</option><option value="EXECUTIVE">Executive / CEO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">First-Line Manager (L1)</label>
                  <select name="reports_to" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                    {profiles.map(p => <option key={p.email} value={p.email}>{p.name} ({p.role})</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Second-Line Manager (L2)</label>
                  <select name="second_manager" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50">
                    <option value="">None</option>
                    {profiles.map(p => <option key={p.email} value={p.email}>{p.name} ({p.role})</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Project</label><input type="text" name="project" placeholder="Sindh Legal Aid Initiative" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Place of Posting</label><input type="text" name="posting" placeholder="Karachi HQ" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Contract Start</label><input type="date" name="contract_start" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Contract End</label><input type="date" name="contract_end" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Qualifications</label><input type="text" name="qualifications" placeholder="LL.B / Bar-at-Law" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#003d99]">Commit Onboarding</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
