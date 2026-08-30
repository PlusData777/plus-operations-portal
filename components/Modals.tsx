"use client";
import React, { useState } from 'react';
import { X, Receipt, Calendar, Briefcase, Shield, Laptop } from 'lucide-react';

export function MasterRequisitionModal({ isOpen, onClose, onSelectType }) {
  if (!isOpen) return null;

  const OPTIONS = [
    { id: 'finance', title: 'Financial Expense Claim', desc: 'Travel per diem, logistics, or operational expenses', icon: Receipt, color: 'bg-blue-50 text-[#0052CC] border-blue-100' },
    { id: 'leave', title: 'Staff Leave Application', desc: 'Annual, sick, casual, or bereavement leave', icon: Calendar, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { id: 'admin', title: 'Admin & Facilities Support', desc: 'Office maintenance, transport, or meeting space booking', icon: Briefcase, color: 'bg-amber-50 text-amber-700 border-amber-100' },
    { id: 'asset', title: 'Asset & IT Requisition', desc: 'Laptop, IT accessories, or equipment allocation', icon: Laptop, color: 'bg-purple-50 text-purple-700 border-purple-100' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Select Requisition Category</h3>
            <p className="text-xs text-slate-500 mt-0.5">Choose the institutional workflow you wish to initiate</p>
          </div>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => onSelectType(opt.id)}
              className="p-4 rounded-xl border text-left hover:shadow-md transition-all flex flex-col justify-between group bg-white hover:border-blue-400"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border ${opt.color}`}>
                <opt.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#0052CC] transition-colors">{opt.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RequisitionModal({ isOpen, onClose, onSubmit, title = "New Financial Requisition", type = "finance" }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {type === 'finance' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Claim Type</label>
                <select name="claim_type" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                  <option value="Travel Expense">Travel & Field Visit Per Diem</option>
                  <option value="Legal Aid Camp">Legal Aid Camp Logistics & Setup</option>
                  <option value="Office Supplies">Office Supplies & Stationery</option>
                  <option value="Workshop & Seminar">Training Workshop Stipend</option>
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
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (PKR)</label>
                  <input type="number" name="amount" placeholder="15000" className="w-full border rounded-lg p-2.5 text-sm" required />
                </div>
              </div>
            </>
          )}

          {type === 'admin' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Support Category</label>
                <select name="claim_type" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                  <option value="Office Maintenance">Office Repair & Maintenance</option>
                  <option value="Transport Booking">Official Vehicle Transport Booking</option>
                  <option value="Event Facility Setup">Conference / Meeting Room Setup</option>
                  <option value="Security Requisition">Security Clearance / Protocol Support</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hub Location</label>
                <select name="expense_head" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                  <option value="Karachi HQ">Karachi Head Office</option>
                  <option value="Hyderabad Hub">Hyderabad Regional Hub</option>
                  <option value="Sukkur Hub">Sukkur Field Office</option>
                </select>
              </div>
            </>
          )}

          {type === 'asset' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Asset Category</label>
                <select name="claim_type" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                  <option value="Laptop / Computer">Laptop / Workstation</option>
                  <option value="Printer & Scanner">Printer / Document Scanner</option>
                  <option value="Mobile Device / Dongle">Internet Dongle & Comm Device</option>
                  <option value="Office Furniture">Ergonomic Chair / Desk</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Priority Level</label>
                <select name="expense_head" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
                  <option value="Standard">Standard Replacement</option>
                  <option value="Urgent Field Need">Urgent Field Operation Need</option>
                  <option value="New Hire Allocation">New Staff Onboarding Allocation</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Justification / Notes</label>
            <textarea name="notes" rows={3} placeholder="Provide activity context or justification..." className="w-full border rounded-lg p-2.5 text-sm" required></textarea>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#0052CC] text-white hover:bg-[#003d99]">Submit Request</button>
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
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Case Category</label>
            <select name="title" className="w-full border rounded-lg p-2.5 text-sm bg-slate-50" required>
              <option value="Pro-Bono Land Dispute Resolution">Pro-Bono Land Dispute Resolution</option>
              <option value="Illegal Detention & Habeas Corpus">Illegal Detention & Habeas Corpus</option>
              <option value="Women Inheritance & Family Suit">Women Inheritance & Family Suit</option>
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
            <div><label className="block text-[10px] font-semibold text-slate-500">Male</label><input type="number" name="male" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-[10px] font-semibold text-emerald-600">Female</label><input type="number" name="female" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-[10px] font-semibold text-amber-600">Transgender</label><input type="number" name="transgender" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] font-semibold text-orange-600">PWDs</label><input type="number" name="pwds" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
            <div><label className="block text-[10px] font-semibold text-blue-600">Minorities</label><input type="number" name="minorities" defaultValue="0" className="w-full border rounded p-2 text-sm" /></div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Outcome Summary</label>
            <textarea name="outcome" rows={2} placeholder="Summarize legal assistance provided..." className="w-full border rounded-lg p-2.5 text-sm" required></textarea>
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
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Budget (PKR)</label>
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
