"use client";
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Receipt, Briefcase, Scale, Building, Plus, CheckCircle, Menu, X, Calendar, Folder, UserCheck, Clock, CheckSquare, Award, BarChart3, HeartHandshake, LogOut, ChevronDown, User
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

import DashboardView from '@/components/DashboardView';
import ProgramsView from '@/components/ProgramsView';
import DocketsView from '@/components/DocketsView';
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
import PolicyAssistant from '@/components/PolicyAssistant';

export default function PlusOpsPortal() {
  const [currentUser, setCurrentUser] = useState({
    id: '1',
    email: 'altafkhoso.adv@gmail.com',
    name: 'Altaf Khoso',
    designation: 'CEO',
    role: 'EXECUTIVE',
    posting: 'Karachi HQ',
    reports_to: 'None',
    second_manager: 'N/A',
    qualifications: 'LL.M / Supreme Court Advocate'
  });

  const [profiles, setProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [programs, setPrograms] = useState([]);
  const [dockets, setDockets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [activeReqType, setActiveReqType] = useState('finance');

  // User Dropdown Menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("plus_user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        window.location.href = '/login';
      }
    } catch (e) {
      window.location.href = '/login';
    }
  }, []);

  const fetchGlobalData = async () => {
    try {
      const [profRes, pRes, dRes, rRes, lRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('programs').select('*'),
        supabase.from('dockets').select('*'),
        supabase.from('requests').select('*'),
        supabase.from('leave_requests').select('*')
      ]);
      if (profRes.data && profRes.data.length > 0) setProfiles(profRes.data);
      if (pRes.data) setPrograms(pRes.data);
      if (dRes.data) setDockets(dRes.data);
      if (rRes.data) setRequests(rRes.data);
      if (lRes.data) setLeaveRequests(lRes.data);
    } catch (e) {
      console.error('Data fetch error:', e);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("plus_user");
    window.location.href = '/login';
  };

  const handleSelectRequisitionType = (type: string) => {
    setIsMasterModalOpen(false);
    if (type === 'leave') {
      setIsLeaveModalOpen(true);
    } else {
      setActiveReqType(type);
      setIsReqModalOpen(true);
    }
  };

  const handleCreateLeave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLeave = {
      staff_name: currentUser.name,
      staff_email: currentUser.email,
      department: (currentUser as any).department || currentUser.role || 'Program',
      hub: currentUser.posting || 'Karachi HQ',
      project_code: (currentUser as any).assigned_project || 'General Grant',
      leave_type: formData.get('leave_type') || 'Annual Leave',
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      reason: formData.get('reason'),
      current_approver: currentUser.reports_to || 'altafkhoso.adv@gmail.com',
      status: 'PENDING_L1'
    };

    const { error } = await supabase.from('leave_requests').insert([newLeave]);
    if (error) {
      showToast('Error submitting leave application.');
    } else {
      showToast('Leave application submitted successfully.');
      setIsLeaveModalOpen(false);
      fetchGlobalData();
    }
  };

  const handleCreateRequisition = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newReq = {
      timestamp: new Date().toISOString(),
      claim_type: activeReqType.toUpperCase(),
      requester_name: currentUser.name,
      requester_email: currentUser.email,
      department: (currentUser as any).department || currentUser.role || 'Program',
      hub: currentUser.posting || 'Karachi HQ',
      project_code: (currentUser as any).assigned_project || 'General Grant',
      expense_head: formData.get('expense_head') || 'General Requisition',
      requested_amount: parseFloat((formData.get('amount') as string) || '10000'),
      approval_level: 1,
      current_approver: currentUser.reports_to || 'altafkhoso.adv@gmail.com',
      status: 'PENDING_L1',
      notes: formData.get('notes')
    };

    const { error } = await supabase.from('requests').insert([newReq]);
    if (error) {
      showToast('Error submitting requisition.');
    } else {
      showToast(`${activeReqType.toUpperCase()} requisition submitted.`);
      setIsReqModalOpen(false);
      fetchGlobalData();
    }
  };

  const isAuthorizedStaffManager = 
    currentUser.email === 'atif@plus.org' || 
    currentUser.email === 'altafkhoso.adv@gmail.com' ||
    currentUser.name === 'Atif Ali' ||
    currentUser.name === 'Altaf Khoso';

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'programs', label: 'Programs', icon: Briefcase },
    { id: 'dockets', label: 'Case Dockets', icon: Scale },
    { id: 'staff_workspace', label: 'My Workspace', icon: CheckSquare },
    ...(isAuthorizedStaffManager ? [{ id: 'staff_mgmt', label: 'Staff Directory', icon: UserCheck }] : []),
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
    <div className="flex h-screen w-screen overflow-hidden font-sans relative bg-gradient-to-br from-slate-950 via-[#0a192f] to-slate-900 text-slate-100">
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[140px] pointer-events-none" />

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900/80 backdrop-blur-xl border border-white/20 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMsg}</span>
        </div>
      )}

      {/* MASTER REQUISITION MODAL */}
      {isMasterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900/70 border border-white/20 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white">Select Requisition Type</h3>
              <button onClick={() => setIsMasterModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'leave', label: 'Leave', desc: 'Apply for leave', icon: Calendar },
                { id: 'finance', label: 'Claim', desc: 'Reimbursement', icon: Receipt },
                { id: 'assets', label: 'Asset', desc: 'Equipment & IT', icon: Building },
                { id: 'admin', label: 'Admin', desc: 'Logistics support', icon: Folder },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelectRequisitionType(item.id)}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 rounded-2xl text-left transition duration-200 cursor-pointer"
                >
                  <item.icon className="w-5 h-5 text-cyan-400 mb-1.5" />
                  <h4 className="font-bold text-xs text-white">{item.label}</h4>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REQUISITION SUBMISSION MODAL */}
      {isReqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900/70 border border-white/20 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white uppercase">New {activeReqType} Requisition</h3>
              <button onClick={() => setIsReqModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleCreateRequisition} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Purpose / Head</label>
                <input type="text" required name="expense_head" placeholder="e.g. Field camp logistics" className="w-full rounded-xl bg-white/5 border border-white/15 p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Amount Requested (PKR)</label>
                <input type="number" required name="amount" placeholder="25000" className="w-full rounded-xl bg-white/5 border border-white/15 p-2 text-xs font-bold text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Justification Notes</label>
                <textarea rows={3} name="notes" placeholder="Provide details..." className="w-full rounded-xl bg-white/5 border border-white/15 p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsReqModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold shadow-lg cursor-pointer">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAVE MODAL */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-slate-900/70 border border-white/20 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white">Apply for Leave</h3>
              <button onClick={() => setIsLeaveModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleCreateLeave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Leave Type</label>
                <select name="leave_type" className="w-full rounded-xl bg-slate-800 border border-white/15 p-2 text-xs text-white">
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Start Date</label>
                  <input type="date" required name="start_date" className="w-full rounded-xl bg-slate-800 border border-white/15 p-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">End Date</label>
                  <input type="date" required name="end_date" className="w-full rounded-xl bg-slate-800 border border-white/15 p-2 text-xs text-white" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Reason</label>
                <textarea rows={3} required name="reason" placeholder="Reason for leave..." className="w-full rounded-xl bg-white/5 border border-white/15 p-2 text-xs text-white placeholder-slate-500 resize-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold shadow-lg cursor-pointer">Submit Leave</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" />
      )}

      {/* FROSTED GLASS SIDEBAR */}
      <aside className={`fixed md:static inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-white/5 backdrop-blur-2xl border-r border-white/10 flex flex-col shadow-2xl transition-transform duration-300 z-40 w-64 shrink-0`}>
        <div className="p-5 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center p-1 backdrop-blur-md">
              <img src="https://grassrootsjusticenetwork.org/wp-content/uploads/2023/12/PLUS-logo-1.png" alt="PLUS" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white drop-shadow">PLUS OPS</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white md:hidden"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 pt-3">
          <span className="text-[10px] bg-blue-500/20 text-cyan-300 border border-cyan-400/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{currentUser.role}</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-blue-600/60 to-cyan-500/40 text-white border border-white/20 shadow-md backdrop-blur-md' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        {/* FROSTED HEADER */}
        <header className="h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-8 shrink-0 z-10">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 md:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm md:text-base font-bold text-white capitalize drop-shadow-sm">{activeTab.replace('_', ' ')}</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsMasterModalOpen(true)} className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold border border-white/20 shadow-md">
              <Plus className="w-3.5 h-3.5 text-cyan-200" />
              <span>New Requisition</span>
            </button>

            {/* USER PROFILE */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 p-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="hidden lg:block text-left pr-1">
                  <span className="block text-xs font-bold text-slate-200 leading-tight">{currentUser.name}</span>
                  <span className="block text-[10px] text-slate-400 leading-tight">{currentUser.email}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/90 border border-white/20 backdrop-blur-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <div className="pt-1">
                    <button onClick={() => { setActiveTab('staff_workspace'); setIsUserMenuOpen(false); }} className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-white/10">
                      <User className="w-3.5 h-3.5" /><span>My Workspace</span>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10">
                      <LogOut className="w-3.5 h-3.5" /><span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ACTIVE TAB CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10">
          <div className="max-w-6xl mx-auto backdrop-blur-sm rounded-3xl bg-white/[0.02] border border-white/[0.05] p-2 md:p-4 shadow-2xl">
            {activeTab === 'dashboard' && <DashboardView visibleRequests={requests} programs={programs} dockets={dockets} currentUser={currentUser} setActiveTab={setActiveTab} />}
            {activeTab === 'programs' && <ProgramsView programs={programs} refreshPrograms={fetchGlobalData} showToast={showToast} />}
            {activeTab === 'dockets' && <DocketsView dockets={dockets} refreshDockets={fetchGlobalData} showToast={showToast} />}
            {activeTab === 'staff_workspace' && <StaffWorkspaceView currentUser={currentUser} requests={requests} showToast={showToast} />}
            {activeTab === 'staff_mgmt' && isAuthorizedStaffManager && <StaffManagementView currentUser={currentUser} showToast={showToast} profiles={profiles} refreshProfiles={fetchGlobalData} />}
            {activeTab === 'pending_queue' && <PendingApprovalsView requests={requests} setRequests={setRequests} currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'appraisals' && <AppraisalsView currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'requests' && <RequestsView visibleRequests={requests} currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'leave' && <LeaveView leaveRequests={leaveRequests} currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'policy' && <PolicyView />}
            {activeTab === 'finance' && <FinanceView currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'hr' && <HRView currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'partners' && <PartnersView showToast={showToast} />}
            {activeTab === 'timesheets' && <TimesheetsView currentUser={currentUser} showToast={showToast} />}
            {activeTab === 'analytics' && <AnalyticsView />}
          </div>
        </div>

        {/* ALWAYS-PRESENT APNA OPS FLOATING AGENT */}
        <PolicyAssistant />
      </main>
    </div>
  );
}
