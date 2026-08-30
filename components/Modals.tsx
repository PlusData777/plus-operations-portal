"use client";
import React from 'react';
import { X } from 'lucide-react';

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
              <option value="Travel Expense">Travel & Field Visit Per Diem</option>
              <option value="Legal Aid Camp">Legal Aid Camp Logistics & Setup</option>
              <option value="Office Supplies">Office Supplies & Stationery</option>
              <option value="Workshop & Seminar">Training Workshop & Participant Stipend</option>
              <option value="Emergency Communication">Emergency Comm & Fuel Requisition</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Expense Head</label>
              <select name="expense_head" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                <option value="Transportation">Transportation / Fuel</option>
                <option value="Accommodation">Accommodation & Lodging</option>
                <option value="Meals">Per Diem / Meals</option>
                <option value="Venue Hire">Venue & Hall Booking</option>
                <option value="Printing">Printing & Publication</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (PKR)</label>
              <input type="number" name="amount" placeholder="15000" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Justification / Notes</label>
            <textarea name="notes" rows={3} placeholder="Provide activity context or justification..." className="w-full border rounded-lg p-2.5 text-sm" required></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#003d99]">Submit Requisition</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LeaveModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-900">Apply for Staff Leave</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Leave Type</label>
            <select name="leave_type" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
              <option value="Annual Leave">Annual Paid Leave</option>
              <option value="Sick Leave">Sick Leave (Medical)</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Maternity / Paternity">Maternity / Paternity Leave</option>
              <option value="Bereavement Leave">Bereavement Leave</option>
              <option value="Unpaid Leave">Leave Without Pay (LWOP)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
              <input type="date" name="start_date" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
              <input type="date" name="end_date" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Reason / Handover Notes</label>
            <textarea name="reason" rows={3} placeholder="Provide reason and mention staff taking handover..." className="w-full border rounded-lg p-2.5 text-sm" required></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#003d99]">Submit Leave Application</button>
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
              <label className="block text-xs font-semibold text-slate-600 mb-1">Court Jurisdiction</label>
              <select name="court_name" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                <option value="High Court Sindh">High Court Sindh</option>
                <option value="Supreme Court of Pakistan">Supreme Court of Pakistan</option>
                <option value="District & Sessions Court Karachi">District & Sessions Court Karachi</option>
                <option value="District Court Hyderabad">District Court Hyderabad</option>
                <option value="Anti-Terrorism Court">Anti-Terrorism Court</option>
                <option value="Family Court">Family Court</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Case Category / Title</label>
            <select name="title" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
              <option value="Pro-Bono Land Dispute Resolution">Pro-Bono Land Dispute Resolution</option>
              <option value="Illegal Detention & Habeas Corpus">Illegal Detention & Habeas Corpus</option>
              <option value="Women Inheritance & Family Suit">Women Inheritance & Family Suit</option>
              <option value="Labor Rights & Wage Claim">Labor Rights & Wage Claim</option>
              <option value="Juvenile Justice Defense">Juvenile Justice Defense</option>
            </select>
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
            <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#003d99]">Save Docket</button>
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
            <label className="block text-xs font-semibold text-slate-600 mb-1">Target Grant Program</label>
            <select name="program_id" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.donor_name})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Activity Type</label>
            <select name="title" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
              <option value="Prison Legal Aid Clinic">Prison Legal Aid Clinic & Counseling</option>
              <option value="Rural Women Legal Awareness Seminar">Rural Women Legal Awareness Seminar</option>
              <option value="Paralegal Training Workshop">Paralegal Training Workshop</option>
              <option value="Community Fact-Finding Mission">Community Fact-Finding Mission</option>
              <option value="Bar Association Consultation">Bar Association Consultation</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Hub / Venue</label>
              <input type="text" name="venue" placeholder="Central Jail Karachi" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Activity Date</label>
              <input type="date" name="date" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-[10px] font-semibold text-slate-500">Male Reached</label><input type="number" name="male" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-[10px] font-semibold text-emerald-600">Female Reached</label><input type="number" name="female" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-[10px] font-semibold text-amber-600">Transgender</label><input type="number" name="transgender" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] font-semibold text-orange-600">PWDs</label><input type="number" name="pwds" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-[10px] font-semibold text-blue-600">Minorities</label><input type="number" name="minorities" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Outcome Summary</label>
            <textarea name="outcome" rows={2} placeholder="Summarize legal assistance provided or legal resolutions achieved..." className="w-full border rounded-lg p-2.5 text-sm" required></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#003d99]">Save Activity</button>
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
            <input type="text" name="name" placeholder="Sindh Access to Justice Project" className="w-full border rounded-lg p-2.5 text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Donor Agency</label>
              <select name="donor_name" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                <option value="UNDP">UNDP Pakistan</option>
                <option value="Global Fund for Women">Global Fund for Women</option>
                <option value="EU Delegation">European Union Delegation</option>
                <option value="USAID">USAID / JSSP</option>
                <option value="National Endowment for Democracy">National Endowment for Democracy (NED)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Grant Budget (PKR)</label>
              <input type="number" name="budget" placeholder="5000000" className="w-full border rounded-lg p-2.5 text-sm" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label><input type="date" name="start_date" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label><input type="date" name="end_date" className="w-full border rounded-lg p-2.5 text-sm" required /></div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#003d99]">Save Program</button>
          </div>
        </form>
      </div>
    </div>
  );
}
