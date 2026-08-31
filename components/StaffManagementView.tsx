"use client";
import React, { useState } from 'react';
import { UserPlus, Edit2, Trash2, X, CheckCircle, Shield, Briefcase, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function StaffManagementView({ currentUser, showToast, profiles = [], refreshProfiles }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    department: 'Program', // Replaced role with Department dropdown options
    posting: 'Karachi HQ',
    reports_to: '',
    line_manager_2: '',
    assigned_project: '',
    contract_start: '',
    contract_end: ''
  });

  const handleOpenAdd = () => {
    setEditingProfile(null);
    setFormData({
      name: '',
      email: '',
      designation: '',
      department: 'Program',
      posting: 'Karachi HQ',
      reports_to: '',
      line_manager_2: '',
      assigned_project: '',
      contract_start: '',
      contract_end: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (profile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      designation: profile.designation || '',
      department: profile.department || profile.role || 'Program',
      posting: profile.posting || 'Karachi HQ',
      reports_to: profile.reports_to || '',
      line_manager_2: profile.line_manager_2 || '',
      assigned_project: profile.assigned_project || '',
      contract_start: profile.contract_start || '',
      contract_end: profile.contract_end || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      email: formData.email,
      designation: formData.designation,
      department: formData.department,
      role: formData.department.toUpperCase(), // Sync role fallback for legacy checks
      posting: formData.posting,
      reports_to: formData.reports_to,
      line_manager_2: formData.line_manager_2,
      assigned_project: formData.assigned_project,
      contract_start: formData.contract_start || null,
      contract_end: formData.contract_end || null
    };

    if (editingProfile) {
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', editingProfile.id);

      if (error) {
        showToast('Error updating staff profile.');
      } else {
        showToast('Staff profile updated successfully.');
        setIsModalOpen(false);
        refreshProfiles();
      }
    } else {
      const { error } = await supabase
        .from('profiles')
        .insert([payload]);

      if (error) {
        showToast('Error adding new staff member.');
      } else {
        showToast('New staff member added successfully.');
        setIsModalOpen(false);
        refreshProfiles();
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) {
        showToast('Error deleting profile.');
      } else {
        showToast('Staff profile removed.');
        refreshProfiles();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Staff Directory & Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage institutional personnel, departmental matrix, contracts, and reporting lines.</p>
        </div>
        {currentUser.role === 'EXECUTIVE' && (
          <button onClick={handleOpenAdd} className="flex items-center space-x-1.5 bg-[#0052CC] hover:bg-[#003d99] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer">
            <UserPlus className="w-4 h-4" /> <span>+ Add Staff Member</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                <th className="p-4">Name & Email</th>
                <th className="p-4">Designation & Dept</th>
                <th className="p-4">Project</th>
                <th className="p-4">Reporting Line</th>
                <th className="p-4">Contract Dates</th>
                <th className="p-4">Posting</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {profiles.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-400">{p.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{p.designation || 'Staff'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-[#0052CC] border border-blue-200">
                      {p.department || p.role || 'Program'}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">
                    {p.assigned_project || <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="p-4 space-y-0.5 text-[11px] text-slate-600">
                    <p><strong className="text-slate-400">L1:</strong> {p.reports_to || 'None'}</p>
                    {p.line_manager_2 && <p><strong className="text-slate-400">L2:</strong> {p.line_manager_2}</p>}
                  </td>
                  <td className="p-4 text-[11px] text-slate-600">
                    <p>{p.contract_start ? `${p.contract_start} to` : 'Start: N/A'}</p>
                    <p className="font-semibold">{p.contract_end || 'End: N/A'}</p>
                  </td>
                  <td className="p-4 text-slate-700">{p.posting || 'Karachi HQ'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(p)} className="p-1.5 rounded-lg bg-blue-50 text-[#0052CC] hover:bg-blue-100 transition cursor-pointer" title="Edit Profile">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {currentUser.role === 'EXECUTIVE' && (
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer" title="Delete Profile">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingProfile ? 'Edit Staff Profile' : 'Add New Staff Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Atif Ali" className="w-full rounded-xl border p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="atif@plus.org" className="w-full rounded-xl border p-2 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Designation</label>
                  <input type="text" required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="e.g. Senior Program Manager" className="w-full rounded-xl border p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Department</label>
                  <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full rounded-xl border p-2 text-xs font-semibold bg-white">
                    <option value="Program">Program</option>
                    <option value="Admin">Admin</option>
                    <option value="Finance">Finance</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Assigned Project</label>
                  <input type="text" value={formData.assigned_project} onChange={e => setFormData({...formData, assigned_project: e.target.value})} placeholder="e.g. JSSP / C2C Karachi" className="w-full rounded-xl border p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Posting / Hub</label>
                  <input type="text" value={formData.posting} onChange={e => setFormData({...formData, posting: e.target.value})} placeholder="Karachi HQ" className="w-full rounded-xl border p-2 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Line Manager 1 (Primary)</label>
                  <input type="text" value={formData.reports_to} onChange={e => setFormData({...formData, reports_to: e.target.value})} placeholder="Manager Name or Email" className="w-full rounded-xl border p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Line Manager 2 (Approver Matrix)</label>
                  <input type="text" value={formData.line_manager_2} onChange={e => setFormData({...formData, line_manager_2: e.target.value})} placeholder="Secondary Reviewer" className="w-full rounded-xl border p-2 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Contract Start Date</label>
                  <input type="date" value={formData.contract_start} onChange={e => setFormData({...formData, contract_start: e.target.value})} className="w-full rounded-xl border p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Contract End Date</label>
                  <input type="date" value={formData.contract_end} onChange={e => setFormData({...formData, contract_end: e.target.value})} className="w-full rounded-xl border p-2 text-xs" />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">
                  {editingProfile ? 'Update Profile' : 'Save Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
