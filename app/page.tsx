"use client";
import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard, Users, Receipt, Briefcase, Scale, Building, Plus, CheckCircle, Menu, X, ArrowLeft, ShieldAlert
} from 'lucide-react';

import DashboardView from '@/components/DashboardView';
import ProgramsView from '@/components/ProgramsView';
import DocketsView from '@/components/DocketsView';
import RosterView from '@/components/RosterView';
import RequestsView from '@/components/RequestsView';
import { RequisitionModal, DocketModal, ActivityModal, ProgramModal } from '@/components/Modals';

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

const INITIAL_PROGRAMS = [
  {
    id: 'PRG-1',
    name: 'Sindh Legal Aid Initiative',
    donor_name: 'UNDP',
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    grant_budget: 5000000,
    spent: 1250000,
    hub: 'Karachi',
    status: 'ACTIVE',
    kpis: [{ id: 'kpi-1', title: 'Pro-bono Legal Consultations', target: 500, achieved: 210, unit: 'cases' }],
    activities: [
      {
        id: 'act-1',
        title: 'Field Mobilization & Prison Legal Aid Clinic',
        venue: 'Central Jail & Community Center Karachi',
        date: '2026-08-15',
        male: 92,
        female: 63,
        transgender: 7,
        pwds: 51,
        minorities: 66,
        outcome: 'Successfully established legal protections and initiated counseling.'
      }
    ]
  },
  {
    id: 'PRG-2',
    name: 'Women Rights Advocacy & Protection Camp',
    donor_name: 'Global Fund for Women',
    start_date: '2026-03-01',
    end_date: '2026-11-30',
    grant_budget: 2000000,
    spent: 850000,
    hub: 'Hyderabad',
    status: 'ACTIVE',
    kpis: [{ id: 'kpi-2', title: 'Legal Awareness Seminars', target: 20, achieved: 12, unit: 'workshops' }],
    activities: [
      {
        id: 'act-2',
        title: 'Rural Women Legal Rights Workshop',
        venue: 'District Council Hall Hyderabad',
        date: '2026-08-20',
        male: 10,
        female: 145,
        transgender: 4,
        pwds: 18,
        minorities: 32,
        outcome: 'Educated rural women on inheritance rights and protection laws.'
      }
    ]
  }
];

const INITIAL_DOCKETS = [
  { id: 'CASE-2026-001', case_number: 'HC-KHI-442', title: 'Pro-Bono Land Dispute Resolution', client_name: 'Ahmed Ali', court_name: 'High Court Sindh', hearing_date: '2026-09-10', status: 'OPEN', assigned_email: 'salma@plus.org' }
];

export default function PlusOpsPortal() {
  const [currentUser, setCurrentUser] = useState(INITIAL_PROFILES[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profiles] = useState(INITIAL_PROFILES);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [dockets, setDockets] = useState(INITIAL_DOCKETS);
  const [toastMsg, setToastMsg] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isDocketModalOpen, setIsDocketModalOpen] = useState(false);
  const [aiBriefing, setAiBriefing] = useState("");
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  // Explicit RBAC Permissions
  const isExecutive = currentUser.role === 'EXECUTIVE';
  const isAdmin = currentUser.role === 'ADMIN';
  const isHrAdmin = currentUser.role === 'HR_ADMIN';
  const isFinanceMgr = currentUser.role === 'FINANCE_MGR';
  const isProgramMgr = currentUser.role === 'PROGRAM_MGR';
  const isStaff = currentUser.role === 'STAFF';

  const canManagePrograms = isExecutive || isProgramMgr || isAdmin;
  const canApproveFinance = isExecutive || isFinanceMgr;
  const canManageUsers = isExecutive || isAdmin || isHrAdmin;

  const visibleRequests = useMemo(() => {
    if (isExecutive || isFinanceMgr || isHrAdmin || isAdmin) return requests;
    return requests.filter(r => r.requester_email === currentUser.email);
  }, [requests, currentUser, isExecutive, isFinanceMgr, isHrAdmin, isAdmin]);

  const generateAIBriefing = () => {
    setIsGeneratingBriefing(true);
    setTimeout(() => {
      setAiBriefing(`Executive Briefing (Role: ${currentUser.role}): All organizational modules operating under strict RBAC governance.`);
      setIsGeneratingBriefing(false);
    }, 1200);
  };

  const handleCreateProgram = (e) => {
    e.preventDefault();
    if (!canManagePrograms) {
      showToast('Permission denied: Insufficient authority to create programs.');
      return;
    }
    const formData = new FormData(e.target);
    const newProgram = {
      id: `PRG-${Date.now()}`,
      name: formData.get('name'),
      donor_name: formData.get('donor_name'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      grant_budget: parseFloat(formData.get('budget') || 0),
      spent: 0,
      hub: 'Karachi',
      status: 'ACTIVE',
      kpis: [],
      activities: []
    };
    setPrograms([newProgram, ...programs]);
    setIsProgramModalOpen(false);
    showToast('New grant program registered successfully.');
  };

  const handleLogActivity = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const progId = formData.get('program_id');
    const newActivity = {
      id: `act-${Date.now()}`,
      title: formData.get('title'),
      venue: formData.get('venue'),
      date: formData.get('date'),
      male: parseInt(formData.get('male') || 0),
      female: parseInt(formData.get('female') || 0),
      transgender: parseInt(formData.get('transgender') || 0),
      pwds: parseInt(formData.get('pwds') || 0),
      minorities: parseInt(formData.get('minorities') || 0),
      outcome: formData.get('outcome')
    };
    setPrograms(programs.map(p => p.id === progId ? { ...p, activities: [newActivity, ...(p.activities || [])] } : p));
    setIsActivityModalOpen(false);
    showToast('Field activity logged successfully.');
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
      project_code: 'PRG-1',
      expense_head: formData.get('expense_head'),
      hub: 'Karachi',
      requested_amount: parseFloat(formData.get('amount') || 0),
      approved_amount: 0,
      approval_level: 1,
      current_approver: 'japheth@plus.org',
      status: 'PENDING_L1',
      notes: formData.get('notes')
    };
    setRequests([newReq, ...requests]);
    setIsReqModalOpen(false);
    showToast('Financial requisition submitted for review.');
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
    showToast('Case docket registered successfully.');
  };

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'programs', label: 'Programs', icon: Briefcase },
    { id: 'dockets', label: 'Case Dockets', icon: Scale },
    { id: 'roster', label: 'Staff Roster', icon: Users },
    { id: 'requests', label: 'Expense Claims', icon: Receipt },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* MODALS */}
      <RequisitionModal isOpen={isReqModalOpen} onClose={() => setIsReqModalOpen(false)} onSubmit={handleCreateRequisition} />
      <DocketModal isOpen={isDocketModalOpen} onClose={() => setIsDocketModalOpen(false)} onSubmit={handleCreateDocket} />
      <ActivityModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} onSubmit={handleLogActivity} programs={programs} />
      <ProgramModal isOpen={isProgramModalOpen} onClose={() => setIsProgramModalOpen(false)} onSubmit={handleCreateProgram} />

      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} bg-[#0052CC] text-blue-100 flex flex-col shadow-xl transition-all duration-300 z-20 shrink-0`}>
        <div className="p-6 border-b border-blue-600 flex justify-between items-center">
          <div className="flex items-center space-x-3 text-white">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-inner"><Building className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold tracking-tight">PLUS OPS</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-blue-200 hover:text-white md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pt-3">
          <span className="text-[10px] bg-blue-700 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">{currentUser.role}</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); setSelectedProgramId(null); }} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-[#003d99] text-white shadow-sm' : 'hover:bg-blue-600/50 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-600 bg-[#0042a6]">
          <label className="text-[10px] uppercase text-blue-200 font-bold mb-2 block">Switch User Role:</label>
          <select className="w-full bg-[#003380] border border-blue-500 rounded p-2 text-xs text-white outline-none font-medium" value={currentUser.id} onChange={(e) => setCurrentUser(profiles.find(p => p.id === e.target.value))}>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
          </select>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-base md:text-lg font-bold text-slate-800 capitalize">
              {selectedProgramId ? 'Program Impact Dashboard' : activeTab.replace('_', ' ')}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {selectedProgramId && (
              <button onClick={() => setSelectedProgramId(null)} className="flex items-center space-x-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors border">
                <ArrowLeft className="w-4 h-4" /> <span>Back to Main Page</span>
              </button>
            )}
            <button onClick={() => setIsReqModalOpen(true)} className="flex items-center space-x-1 bg-[#0052CC] hover:bg-[#003d99] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Requisition</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center font-bold text-sm border border-blue-200" title={currentUser.name}>
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView visibleRequests={visibleRequests} programs={programs} dockets={dockets} currentUser={currentUser} aiBriefing={aiBriefing} isGeneratingBriefing={isGeneratingBriefing} generateAIBriefing={generateAIBriefing} />}
            {activeTab === 'programs' && <ProgramsView programs={programs} selectedProgramId={selectedProgramId} setSelectedProgramId={setSelectedProgramId} setIsActivityModalOpen={setIsActivityModalOpen} setIsProgramModalOpen={setIsProgramModalOpen} isGlobalAdmin={canManagePrograms} />}
            {activeTab === 'dockets' && <DocketsView dockets={dockets} setIsDocketModalOpen={setIsDocketModalOpen} />}
            {activeTab === 'roster' && <RosterView profiles={profiles} currentUser={currentUser} canManageUsers={canManageUsers} />}
            {activeTab === 'requests' && <RequestsView visibleRequests={visibleRequests} setIsReqModalOpen={setIsReqModalOpen} currentUser={currentUser} canApproveFinance={canApproveFinance} />}
          </div>
        </div>
      </main>
    </div>
  );
}
