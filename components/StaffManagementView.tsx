"use client";
import React, { useState, useEffect } from 'react';
import { UserCheck, Trash2, Edit, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function StaffManagementView({ currentUser, showToast }) {
  const [profiles, setProfiles] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setProfiles(data);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const isAdminOrExec = currentUser.role === 'ADMIN' || currentUser.role === 'EXECUTIVE';

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('profiles').update({
      name: editingStaff.name,
      designation: editingStaff.designation,
      role: editingStaff.role,
      posting: editingStaff.posting
    }).eq('id', editingStaff.id);

    if (error) {
      showToast('Error updating staff profile.');
    } else {
      showToast('Staff profile successfully updated.');
      setIsEditModalOpen(false);
      fetchProfiles();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Staff Directory & Management</h2>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b">
            <tr><th className="py-3 px-4">Name & Email</th><th className="py-3 px-4">Role & Designation</th><th className="py-3 px-4">Posting</th>{isAdminOrExec && <th className="py-3 px-4 text-right">Action</th>}</tr>
          </thead>
          <tbody className="divide-y">
            {profiles.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="py-3 px-4"><span className="font-bold text-slate-900">{p.name}</span><span className="block text-[10px] text-slate-500">{p.email}</span></td>
                <td className="py-3 px-4"><span className="font-semibold text-slate-800">{p.designation}</span><span className="block text-[10px] text-blue-600 font-mono">{p.role}</span></td>
                <td className="py-3 px-4 font-medium">{p.posting || 'Karachi HQ'}</td>
                {isAdminOrExec && (
                  <td className="py-3 px-4 text-right space-x-2">
                    <button onClick={() => { setEditingStaff(p); setIsEditModalOpen(true); }} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit className="w-4 h-4" /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Role</label>
                <select value={editingStaff.role} onChange={e => setEditingStaff({...editingStaff, role: e.target.value})} className="w-full rounded-xl border p-2 text-xs">
                  <option value="EXECUTIVE">EXECUTIVE</option><option value="ADMIN">ADMIN</option><option value="HR_ADMIN">HR_ADMIN</option><option value="FINANCE_MGR">FINANCE_MGR</option><option value="STAFF">STAFF</option>
                </select>
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
