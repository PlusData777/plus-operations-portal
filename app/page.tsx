"use client";
export const dynamic = 'force-dynamic';
import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard, Users, Receipt, Briefcase, Scale, Building, Plus, CheckCircle, Menu, X, ArrowLeft, Calendar, Folder, UserCheck, Clock, CheckSquare, Award, BarChart3, HeartHandshake
} from 'lucide-react';

import DashboardView from '@/components/DashboardView';
import ProgramsView from '@/components/ProgramsView';
import DocketsView from '@/components/DocketsView';
import RosterView from '@/components/RosterView';
import RequestsView from '@/components/RequestsView';
import LeaveView from '@/components/LeaveView';
import PolicyView from '@/components/PolicyView';
import StaffManagementView from '@/components/StaffManagementView';
import PendingApprovalsView from '@/components/PendingApprovalsView';
import StaffWorkspaceView from '@/components/StaffWorkspaceView';
import AppraisalsView from '@/components/AppraisalsView';
import FinanceView from '@/components/FinanceView';
import HRView from '@/components/HRView';
import PartnersView from '@/components/PartnersView';
import TimesheetsView from '@/components/TimesheetsView';
import AnalyticsView from '@/components/AnalyticsView';

import { MasterRequisitionModal, RequisitionModal, DocketModal, ActivityModal, ProgramModal, LeaveModal } from '@/components/Modals';

const INITIAL_PROFILES = [
  { id: '1', email: 'altafkhoso.adv@gmail.com', name: 'Altaf Khoso', designation: 'CEO', role: 'EXECUTIVE', department: 'Management', reports_to: null, second_manager: null, project: 'All Management', qualifications: 'LL.M / Supreme Court Advocate', posting: 'Karachi HQ', contract_start: '2024-01-01', contract_end: '2028-12-31', rating: 5.0, status: 'ACTIVE' },
  { id: '2', email: 'atif@plus.org', name: 'Atif Ali', designation: 'Admin & IT Lead', role: 'ADMIN', department: 'IT', reports_to: 'altafkhoso.adv@gmail.com', second_manager: null, project: 'Institutional Operations', qualifications: 'B.Sc Computer Science', posting: 'Karachi HQ', contract_start: '2025-01-01', contract_end: '2027-12-31', rating: 4.8, status: 'ACTIVE' },
  { id: '3', email: 'ashfaq@plus.org', name: 'Ashfaq Ali', designation: 'HR Lead', role: 'HR_ADMIN', department: 'HR', reports_to: 'altafkhoso.adv@gmail.com', second_manager: null, project: 'HR & Governance', qualifications: 'MBA HR', posting: 'Karachi HQ', contract_start: '2025-03-01', contract_end: '2027-03-01', rating: 4.6, status: 'ACTIVE' },
  { id: '4', email: 'japheth@plus.org', name: 'Japheth Wilson', designation: 'Finance Manager', role: 'FINANCE_MGR', department: 'Finance', reports_to: 'altafkhoso.adv@gmail.com', second_manager: null, project: 'UNDP Grant & Accounts', qualifications: 'ACCA / M.Com', posting: 'Karachi HQ', contract_start: '2024-06-01', contract_end: '2027-06-01', rating: 4.7, status: 'ACTIVE' },
  { id: '5', email: 'salma@plus.org', name: 'Salma Habib Bhutto', designation: 'Program Manager', role: 'PROGRAM_MGR', department: 'Programs', reports_to: 'altafkhoso.adv@gmail.com', second_manager: 'japheth@plus.org', project: 'Sindh Legal Aid Initiative', qualifications: 'LL.B / Bar-at-Law', posting: 'Hyderabad Hub', contract_start: '2024-01-15', contract_end: '2026-12-31', rating: 4.9, status: 'ACTIVE' },
  { id: '6', email: 'staff@plus.org', name: 'General Staff', designation: 'Operations Officer', role: 'STAFF', department: 'Operations', reports_to: 'salma@plus.org', second_manager: 'japheth@plus.org', project: 'Sindh Legal Aid Initiative', qualifications: 'B.A / Public Administration', posting: 'Karachi HQ', contract_start: '2025-05-01', contract_end: '2027-05-01', rating: 4.0, status: 'ACTIVE' }
];

export default function PlusOpsPortal() {
  const [currentUser, setCurrentUser] = useState(INITIAL_PROFILES[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [requests, setRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [dockets, setDockets] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [activeReqType, setActiveReqType] = useState('finance');
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("plus_user", JSON.stringify(currentUser));
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'programs', label: 'Programs', icon: Briefcase },
    { id: 'dockets', label: 'Case Dockets', icon: Scale },
    { id: 'staff_workspace', label: 'My Workspace', icon: CheckSquare },
    { id: 'staff_mgmt', label: 'Staff Directory', icon: UserCheck },
    { id: 'roster', label: 'Staff Roster', icon: Users },
    { id: 'pending_queue', label: 'Pending Approvals', icon: Clock },
    { id: 'appraisals', label: 'Appraisals', icon: Award },
    { id: 'requests', label: 'Expense Claims', icon: Receipt },
    { id: 'leave', label: 'Leave Requests', icon: Calendar },
    { id: 'policy', label: 'Policy Folders', icon: Folder },
    { id: 'analytics', label: 'Executive Analytics', icon: BarChart3 },
    { id: 'finance', label: 'Finance & Grants', icon: Building },
    { id: 'hr', label: 'HR Lifecycle & Exits', icon: UserCheck },
    { id: 'partners', label: 'Partners & MoUs', icon: HeartHandshake },
    { id: 'timesheets', label: 'Staff Timesheets', icon: Clock },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} bg-[#0052CC] text-blue-100 flex flex-col shadow-xl transition-all duration-300 z-20 shrink-0`}>
        <div className="p-6 border-b border-blue-600 flex justify-between items-center">
          <div className="flex items-center space-x-3 text-white">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-inner"><Building className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold tracking-tight">PLUS OPS</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-blue-200 hover:text-white md:hidden"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 pt-3"><span className="text-[10px] bg-blue-700 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">{currentUser.role}</span></div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-[#003d99] text-white shadow-sm' : 'hover:bg-blue-600/50 hover:text-white'}`}
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

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">{isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
            <h1 className="text-base md:text-lg font-bold text-slate-800 capitalize">{activeTab.replace('_', ' ')}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsMasterModalOpen(true)} className="flex items-center space-x-1 bg-[#0052CC] hover:bg-[#003d99] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"><Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Requisition</span></button>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center font-bold text-sm border border-blue-200" title={currentUser.name}>{currentUser.name.charAt(0)}</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView visibleRequests={requests} programs={programs} dockets={dockets} currentUser={currentUser} setActiveTab={setActiveTab} />}
            {activeTab === 'staff_workspace' && <StaffWorkspaceView currentUser={currentUser} requests={requests} leaveRequests={leaveRequests} showToast={showToast} profiles={profiles} />}
            {activeTab === 'staff_mgmt' && <StaffManagementView profiles={profiles} setProfiles={setProfiles} currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'roster' && <RosterView profiles={profiles} currentUser={currentUser} />}
            {activeTab === 'pending_queue' && <PendingApprovalsView requests={requests} setRequests={setRequests} leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests} currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'appraisals' && <AppraisalsView currentUser={currentUser} profiles={profiles} showToast={showToast} />}
            {activeTab === 'requests' && <RequestsView visibleRequests={requests} setIsReqModalOpen={() => setIsMasterModalOpen(true)} currentUser={currentUser} requests={requests} setRequests={setRequests} showToast={showToast} />}
            {activeTab === 'leave' && <LeaveView leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests} setIsLeaveModalOpen={() => setIsMasterModalOpen(true)} currentUser={currentUser} />}
            {activeTab === 'policy' && <PolicyView />}
            {activeTab === 'finance' && <FinanceView currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'hr' && <HRView currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'partners' && <PartnersView showToast={showToast} />}
            {activeTab === 'timesheets' && <TimesheetsView currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'analytics' && <AnalyticsView />}
          </div>
        </div>
      </main>
    </div>
  );
}
