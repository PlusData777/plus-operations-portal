"use client";
import React, { useState } from 'react';
import { Users, UserPlus, Shield, Mail, Building2, UserCheck } from 'lucide-react';

export default function StaffManagementView({ profiles, setProfiles, canManageUsers, showToast }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddStaff = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStaff = {
      id: `usr-${Date.now()}`,
      name: formData.get('name'),
      email: formData.get('email'),
      designation: formData.get('designation'),
      role: formData.get('role'),
      department: formData.get('department'),
      reports_to: formData.get('reports_to'),
      status: 'ACTIVE'
    };
    setProfiles([...profiles, newStaff]);
    setIsAddModalOpen(false);
    showToast('New staff member added successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-[#0052CC]" />
          <h2 className="text-xl font-bold text-slate-900">Staff Directory & Management</h2>
        </div>
        {canManageUsers && (
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="flex items-center space-x-2 bg-[#0052CC] hover:bg-[#003d99] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> <span>Add Staff Member</span>
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
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Reports To (L1 Manager)</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.map(staff => {
                const manager = profiles.find(p => p.email === staff.reports_to);
                return (
                  <tr key={staff.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{staff.name}</span>
                      <span className="text-xs text-slate-500 flex items-center mt-0.5"><Mail className="w-3 h-3 mr-1" />{staff.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 block">{staff.designation}</span>
                      <span className="text-[10px] bg-blue-50 text-[#0052CC] px-2 py-0.5 rounded font-bold border border-blue-100 uppercase">{staff.role}</span>
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-1.5 pt-6">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{staff.department}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {manager ? manager.name : <span className="text-slate-400 italic">None (Executive Board)</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        {staff.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STAFF MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Onboard New Staff Member</h3>
              <button onClick={() => setIsAddModalOpen(false)}><Users className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input type="text" name="name" placeholder="Muhammad Ali" className="w-full border rounded-lg p-2.5 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                  <input type="email" name="email" placeholder="ali@plus.org" className="w-full border rounded-lg p-2.5 text-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Designation</label>
                  <input type="text" name="designation" placeholder="Legal Officer" className="w-full border rounded-lg p-2.5 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
                  <select name="department" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                    <option value="Programs">Programs</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">System Role Access</label>
                  <select name="role" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                    <option value="STAFF">Staff / Officer</option>
                    <option value="PROGRAM_MGR">Program Manager</option>
                    <option value="FINANCE_MGR">Finance Manager</option>
                    <option value="HR_ADMIN">HR Admin</option>
                    <option value="ADMIN">System Admin</option>
                    <option value="EXECUTIVE">Executive / CEO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Reports To (L1 Manager)</label>
                  <select name="reports_to" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                    {profiles.map(p => <option key={p.email} value={p.email}>{p.name} ({p.role})</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#003d99]">Save Staff Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
