"use client";
import React, { useState } from 'react';
import { UserCheck, Trash2, Edit, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function StaffManagementView({ currentUser, showToast, profiles = [], refreshProfiles }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // New staff form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newRole, setNewRole] = useState('STAFF');
  const [newPosting, setNewPosting] = useState('Karachi HQ');
  const [newL1, setNewL1] = useState('Altaf Khoso');
  const [newQuals, setNewQuals] = useState('LL.B');

  const isAdminOrExec = currentUser.role === 'ADMIN' || currentUser.role === 'EXECUTIVE';

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const { error } = await supabase.from('profiles').insert([{
      name: newName,
      email: newEmail,
      designation: newDesignation || 'Officer',
      role: newRole,
      posting: newPosting,
      reports_to: newL1,
      qualifications: newQuals,
      status: 'ACTIVE'
    }]);

    if (error) {
      showToast('Error adding staff profile.');
    } else {
      showToast('Staff member successfully added.');
      setIsAddModalOpen(false);
      setNewName('');
      setNewEmail('');
      refreshProfiles();
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').update({
      name: editingStaff.name,
      designation: editingStaff.designation,
      role: editingStaff.role,
      posting: editingStaff.posting,
      reports_to: editingStaff.reports_to,
      qualifications: editingStaff.qualifications
    }).eq('id', editingStaff.id);

    if (error) {
      showToast('Error updating staff profile.');
    } else {
      showToast('Staff profile successfully updated.');
      setIsEditModalOpen(false);
      refreshProfiles();
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      showToast('Error deleting staff member.');
    } else {
      showToast('Staff member removed.');
      refreshProfiles();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Staff Directory & Management</h2>
          <p className="text-xs text-slate-500">Manage institutional personnel, roles, and reporting lines.</p>
        </div>
        {isAdminOrExec && (
          <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052CC] hover:bg-[#003d99] px-4 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer">
            <Plus className="w-4 h-4" /> <span>+ Add Staff Member</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b">
            <tr><th className="py-3 px-4">Name & Email</th><th className="py-3 px-4">Role & Designation</th><th className="py-3 px-4">Reporting Line</th><th className="py-3 px-4">Posting</th>{isAdminOrExec && <th className="py-3 px-4 text-right">Actions</th>}</tr>
          </thead>
          <tbody className="divide-y">
            {profiles.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="py-3 px-4"><span className="font-bold text-slate-900">{p.name}</span><span className="block text-[10px] text-slate-500">{p.email}</span></td>
                <td className="py-3 px-4"><span className="font-semibold text-slate-800">{p.designation}</span><span className="block text-[10px] text-blue-600 font-mono">{p.role}</span></td>
                <td className="py-3 px-4 text-slate-600">L1: {p.reports_to || 'None'}</td>
                <td className="py-3 px-4 font-medium">{p.posting || 'Karachi HQ'}</td>
                {isAdminOrExec && (
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => { setEditingStaff(p); setIsEditModalOpen(true); }} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer" title="Edit"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteStaff(p.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD STAFF MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Add New Staff Member</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-3">
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Full Name</label><input type="text" required placeholder="Ayesha Khan" value={newName} onChange={e => setNewName(e.target.value)} className="w-full rounded-xl border p-2 text-xs" /></div>
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Email Address</label><input type="email" required placeholder="ayesha@plus.org" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full rounded-xl border p-2 text-xs" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Designation</label><input type="text" placeholder="Legal Officer" value={newDesignation} onChange={e => setNewDesignation(e.target.value)} className="w-full rounded-xl border p-2 text-xs" /></div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Role</label>
                  <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full rounded-xl border p-2 text-xs font-semibold">
                    <option value="EXECUTIVE">EXECUTIVE</option><option value="ADMIN">ADMIN</option><option value="HR_ADMIN">HR_ADMIN</option><option value="FINANCE_MGR">FINANCE_MGR</option><option value="STAFF">STAFF</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Add Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {isEditModalOpen && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Edit Staff Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleUpdateStaff} className="space-y-3">
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Name</label><input type="text" value={editingStaff.name} onChange={e => setEditingStaff({...editingStaff, name: e.target.value})} className="w-full rounded-xl border p-2 text-xs" /></div>
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Designation</label><input type="text" value={editingStaff.designation} onChange={e => setEditingStaff({...editingStaff, designation: e.target.value})} className="w-full rounded-xl border p-2 text-xs" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Role</label>
                  <select value={editingStaff.role} onChange={e => setEditingStaff({...editingStaff, role: e.target.value})} className="w-full rounded-xl border p-2 text-xs font-semibold">
                    <option value="EXECUTIVE">EXECUTIVE</option><option value="ADMIN">ADMIN</option><option value="HR_ADMIN">HR_ADMIN</option><option value="FINANCE_MGR">FINANCE_MGR</option><option value="STAFF">STAFF</option>
                  </select>
                </div>
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Line Manager 1</label><input type="text" value={editingStaff.reports_to || ''} onChange={e => setEditingStaff({...editingStaff, reports_to: e.target.value})} className="w-full rounded-xl border p-2 text-xs" /></div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Update Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
