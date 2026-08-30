"use client";
import React from 'react';
import { X, Activity } from 'lucide-react';

export function RequisitionModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-900">New Financial Requisition</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Claim Type</label>
            <select name="claim_type" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
              <option value="Travel Expense">Travel & Field Expense</option>
              <option value="Legal Aid Logistical">Legal Aid Camp Logistics</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Expense Head</label>
              <input type="text" name="expense_head" placeholder="Transportation" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (PKR)</label>
              <input type="number" name="amount" placeholder="15000" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
            <textarea name="notes" rows={3} placeholder="Justification..." className="w-full border rounded-lg p-2.5 text-sm"></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white">Submit Requisition</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DocketModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-900">Register Case Docket</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Case Number</label>
              <input type="text" name="case_number" placeholder="HC-KHI-450" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Court Name</label>
              <input type="text" name="court_name" placeholder="High Court Sindh" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Case Title</label>
            <input type="text" name="title" placeholder="Civil Suit" className="w-full border rounded-lg p-2.5 text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Client Name</label>
              <input type="text" name="client_name" placeholder="Client Name" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Hearing Date</label>
              <input type="date" name="hearing_date" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white">Save Docket</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ActivityModal({ isOpen, onClose, onSubmit, programs }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-900">Log Program Activity</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Program</label>
            <select name="program_id" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Activity Title</label>
            <input type="text" name="title" placeholder="Legal Aid Clinic" className="w-full border rounded-lg p-2.5 text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Venue</label>
              <input type="text" name="venue" placeholder="District Bar" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
              <input type="date" name="date" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-[10px] font-semibold text-slate-500">Male</label><input type="number" name="male" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-[10px] font-semibold text-emerald-600">Female</label><input type="number" name="female" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-[10px] font-semibold text-amber-600">Transgender</label><input type="number" name="transgender" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] font-semibold text-orange-600">PWDs</label><input type="number" name="pwds" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-[10px] font-semibold text-blue-600">Minorities</label><input type="number" name="minorities" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Outcome</label>
            <textarea name="outcome" rows={2} placeholder="Summary..." className="w-full border rounded-lg p-2.5 text-sm"></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white">Save Activity</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ProgramModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-900">New Grant Program</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Program Title</label>
            <input type="text" name="name" placeholder="Title" className="w-full border rounded-lg p-2.5 text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Donor</label><input type="text" name="donor_name" placeholder="UNDP" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Budget (PKR)</label><input type="number" name="budget" placeholder="5000000" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label><input type="date" name="start_date" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label><input type="date" name="end_date" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white">Save Program</button>
          </div>
        </form>
      </div>
    </div>
  );
}
