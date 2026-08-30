"use client"; // CRUCIAL: Ensures React hooks work and prevents Server Component errors
import React, { useState, useMemo } from 'react';
import {
  Heart, User, UserCheck, FileText,
  LayoutDashboard, Users, Clock, Calendar, Receipt, CheckSquare, Briefcase, Scale, Activity,
  Zap, Star, Loader2, ArrowLeft, Download, Plus, ArrowRight, Building, Upload, X, CheckCircle
} from 'lucide-react';

const INITIAL_PROFILES = [
  { id: '1', email: 'altafkhoso.adv@gmail.com', name: 'Altaf Khoso', designation: 'CEO', role: 'EXECUTIVE', department: 'Management', approval_scope: 'ALL', status: 'ACTIVE' },
  { id: '2', email: 'atif@plus.org', name: 'Atif Ali', designation: 'Admin', role: 'ADMIN', department: 'IT', approval_scope: 'GLOBAL', status: 'ACTIVE' },
  { id: '3', email: 'ashfaq@plus.org', name: 'Ashfaq Ali', designation: 'HR Lead', role: 'HR_ADMIN', department: 'HR', approval_scope: 'HR', status: 'ACTIVE' },
  { id: '4', email: 'japheth@plus.org', name: 'Japheth Wilson', designation: 'Finance Manager', role: 'FINANCE_MGR', department: 'Finance', approval_scope: 'FINANCE', status: 'ACTIVE' },
  { id: '5', email: 'salma@plus.org', name: 'Salma Habib Bhutto', designation: 'Program Manager', role: 'PROGRAM_MGR', department: 'Programs', approval_scope: 'PROGRAM', status: 'ACTIVE' },
  { id: '6', email: 'staff@plus.org', name: 'General Staff', designation: 'Officer', role: 'STAFF', department: 'Operations', approval_scope: 'NONE', status: 'ACTIVE' }
];

const INITIAL_REQUESTS = [
  { id: 'REQ-001', timestamp: '2026-08-25T10:30:00Z', claim_type: 'Travel Expense', requester_name: 'General Staff', requester_email: 'staff@plus.org', project_code: 'PRG-1', expense_head: 'Transportation', hub: 'Karachi', requested_amount: 15000, approved_amount: 0, approval_level: 1, current_approver: 'japheth@plus.org', status: 'PENDING_L1', notes: 'Field visit transport' }
];

const INITIAL_DOCKETS = [
  { id: 'CASE-2026-001', case_number: 'HC-KHI-442', title: 'Pro-Bono Land Dispute Resolution', client_name: 'Ahmed Ali', court_name: 'High Court Sindh', hearing_date: '2026-09-10', status: 'OPEN', assigned_email: 'salma@plus.org' }
];

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'ACTIVE':
      case 'OPEN':
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING_L1':
      case 'PENDING_L2':
      case 'PENDING_REVIEW': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CLOSING':
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyles()}`}>{status.replace('_', ' ')}</span>;
};

export default function PlusOpsPortal() {
  const [currentUser, setCurrentUser] = useState(INITIAL_PROFILES[5]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profiles] = useState(INITIAL_PROFILES);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [dockets, setDockets] = useState(INITIAL_DOCKETS);
  const [toastMsg, setToastMsg] = useState("");
  
  // Modals state
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isDocketModalOpen, setIsDocketModalOpen] = useState(false);
  const [aiBriefing, setAiBriefing] = useState("");
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const isGlobalAdmin = ['ADMIN', 'EXECUTIVE', 'HR_ADMIN', 'FINANCE_MGR', 'PROGRAM_MGR'].includes(currentUser.role);
  const visibleRequests = useMemo(() => {
    if (isGlobalAdmin) return requests;
    return requests.filter(r => r.requester_email === currentUser.email);
  }, [requests, currentUser, isGlobalAdmin]);

  const generateAIBriefing = () => {
    setIsGeneratingBriefing(true);
    setTimeout(() => {
      setAiBriefing("Executive Briefing (Live): Organizational metrics are stable. Regional field operations, expense claims, and case dockets are fully active.");
      setIsGeneratingBriefing(false);
    }, 1200);
  };

  const handleCreateRequisition = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newReq = {
      id: `REQ-00${requests.length + 1}`,
      timestamp: new Date().toISOString(),
      claim_type: formData.get('claim_type'),
      requester_name: currentUser.name,
      requester_email: currentUser.email,
      project_code: formData.get('project_code') || 'PRG-1',
      expense_head: formData.get('expense_head'),
      hub: formData.get('hub') || 'Karachi',
      requested_amount: parseFloat(formData.get('amount') || 0),
      approved_amount: 0,
      approval_level: 1,
      current_approver: 'japheth@plus.org',
      status: 'PENDING_L1',
      notes: formData.get('notes')
    };
    setRequests([newReq, ...requests]);
    setIsReqModalOpen(false);
    showToast('Requisition submitted and routed for approval.');
  };

  const handleCreateDocket = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newDocket = {
      id: `CASE-2026-00${dockets.length + 1}`,
      case_number: formData.get('case_number'),
      title: formData.get('title'),
      client_name: formData.get('client_name'),
      court_name: formData.get('court_name'),
      hearing_date: formData.get('hearing_date'),
      status: 'OPEN',
      assigned_email: currentUser.email
    };
    setDockets([newDocket, ...dockets]);
    setIsDocketModalOpen(false);
    showToast('New Case Docket registered successfully.');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Pending Approvals</span>
          <div className="text-3xl font-bold text-slate-900 mt-2">{visibleRequests.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Active Case Dockets</span>
          <div className="text-3xl font-bold text-indigo-600 mt-2">{dockets.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Active User Role</span>
          <div className="text-xl font-bold text-slate-800 mt-2">{currentUser.role}</div>
        </div>
      </div>

      <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center"><Zap className="w-5 h-5 mr-2 text-yellow-400" /> AI Executive Briefing</h3>
          <button onClick={generateAIBriefing} disabled={isGeneratingBriefing} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
            {isGeneratingBriefing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Briefing'}
          </button>
        </div>
        <p className="text-indigo-200 text-sm">{aiBriefing || "Click generate to inspect real-time operational telemetry."}</p>
      </div>
    </div>
  );

  const renderStaffRoster = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">Staff Roster & Hierarchy</h2>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold border border-indigo-100">{profiles.length} Active Profiles</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Staff Member</th>
              <th className="px-6 py-3">Designation</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {profiles.map(staff => (
              <tr key={staff.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">{staff.name} <span className="block text-xs font-normal text-slate-400">{staff.email}</span></td>
                <td className="px-6 py-4">{staff.designation}</td>
                <td className="px-6 py-4">{staff.department}</td>
                <td className="px-6 py-4"><span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-bold">{staff.role}</span></td>
                <td className="px-6 py-4 text-center"><StatusBadge status={staff.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Expense Claims & Requisitions</h2>
        <button onClick={() => setIsReqModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
          <Plus className="w-4 h-4" /> <span>New Requisition</span>
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID / Type</th>
                <th className="px-6 py-3">Requester</th>
                <th className="px-6 py-3">Expense Head</th>
                <th className="px-6 py-3">Amount (PKR)</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{req.id} <span className="block text-xs font-normal text-slate-400">{req.claim_type}</span></td>
                  <td className="px-6 py-4">{req.requester_name}</td>
                  <td className="px-6 py-4">{req.expense_head}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">PKR {req.requested_amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center"><StatusBadge status={req.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDockets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Legal Case Dockets</h2>
        <button onClick={() => setIsDocketModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
          <Plus className="w-4 h-4" /> <span>New Case Docket</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dockets.map(d => (
          <div key={d.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100">{d.case_number}</span>
              <StatusBadge status={d.status} />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-1">{d.title}</h3>
            <p className="text-sm text-slate-500 mb-4">Client: {d.client_name} | Court: {d.court_name}</p>
            <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex justify-between">
              <span>Next Hearing: {d.hearing_date}</span>
              <span className="font-semibold text-slate-700">Assigned: {d.assigned_email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roster', label: 'Staff Roster', icon: Users },
    { id: 'programs', label: 'Programs', icon: Briefcase },
    { id: 'dockets', label: 'Case Dockets', icon: Scale },
    { id: 'requests', label: 'Expense & Requisitions', icon: Receipt },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* NEW REQUISITION MODAL */}
      {isReqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">New Financial Requisition</h3>
              <button onClick={() => setIsReqModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateRequisition} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Claim Type</label>
                <select name="claim_type" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 outline-none" required>
                  <option value="Travel Expense">Travel & Field Expense</option>
                  <option value="Legal Aid Logistical">Legal Aid Camp Logistics</option>
                  <option value="Office Supplies">Office Supplies & Utilities</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Expense Head</label>
                  <input type="text" name="expense_head" placeholder="e.g. Transportation" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (PKR)</label>
                  <input type="number" name="amount" placeholder="15000" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hub / Region</label>
                <input type="text" name="hub" defaultValue="Karachi" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description / Notes</label>
                <textarea name="notes" rows={3} placeholder="Provide justification or Google Drive link to scanned receipts..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsReqModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">Submit Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW CASE DOCKET MODAL */}
      {isDocketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Register New Case Docket</h3>
              <button onClick={() => setIsDocketModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateDocket} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Case Number</label>
                  <input type="text" name="case_number" placeholder="HC-KHI-450" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Court Name</label>
                  <input type="text" name="court_name" placeholder="High Court Sindh" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Case Title</label>
                <input type="text" name="title" placeholder="Pro-Bono Civil Suit" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Client Name</label>
                  <input type="text" name="client_name" placeholder="Client Full Name" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Hearing Date</label>
                  <input type="date" name="hearing_date" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsDocketModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">Save Docket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3 text-white">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><Building className="w-5 h-5" /></div>
            <span className="text-xl font-bold tracking-tight">PLUS OPS</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Operations Portal v2.0</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <label className="text-[10px] uppercase text-slate-500 font-bold mb-2 block">Test View As:</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white outline-none" value={currentUser.id} onChange={(e) => setCurrentUser(profiles.find(p => p.id === e.target.value))}>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
          </select>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-semibold text-slate-800 capitalize">{activeTab.replace('_', ' ')}</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsReqModalOpen(true)} className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> <span>New Requisition</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shadow-inner">{currentUser.name.charAt(0)}</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'roster' && renderStaffRoster()}
            {activeTab === 'programs' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Sindh Legal Aid Initiative (UNDP)</h2>
                <p className="text-sm text-slate-600">Budget allocation: PKR 5.0M | Spent: PKR 1.25M</p>
              </div>
            )}
            {activeTab === 'dockets' && renderDockets()}
            {activeTab === 'requests' && renderRequests()}
          </div>
        </div>
      </main>
    </div>
  );
}
