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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modals
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [activeReqType, setActiveReqType] = useState('finance');

  // User Dropdown Menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Load user session from local storage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("plus_user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        window.location.href = '/login';
      }
    } catch (e) {
      console.warn("Session retrieval failed:", e);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("plus_user");
    window.location.href = '/login';
  };

  const handleSelectRequisitionType = (type) => {
    setIsMasterModalOpen(false);
    if (type === 'leave') {
      setIsLeaveModalOpen(true);
    } else {
      setActiveReqType(type);
      setIsReqModalOpen(true);
    }
  };

  const handleCreateLeave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newLeave = {
      staff_name: currentUser.name,
      staff_email: currentUser.email,
      leave_type: formData.get('leave_type') || 'Annual Leave',
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      reason: formData.get('reason'),
      status: 'PENDING'
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

  const handleCreateRequisition = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newReq = {
      timestamp: new Date().toISOString(),
      claim_type: activeReqType.toUpperCase(),
      requester_name: currentUser.name,
      requester_email: currentUser.email,
      project_code: 'PRG-1',
      expense_head: formData.get('expense_head') || 'General Requisition',
      hub: currentUser.posting || 'Karachi HQ',
      requested_amount: parseFloat(formData.get('amount') || 10000),
      approval_level: 1,
      current_approver: currentUser.reports_to || 'altafkhoso.adv@gmail.com',
      status: 'PENDING_L1',
      notes: formData.get('notes')
    };

    const { error } = await supabase.from('requests').insert([newReq]);
    if (error) {
      showToast('Error submitting requisition.');
    } else {
      showToast(`${activeReqType.toUpperCase()} requisition submitted successfully.`);
      setIsReqModalOpen(false);
      fetchGlobalData();
    }
  };

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'programs', label: 'Programs', icon: Briefcase },
    { id: 'dockets', label: 'Case Dockets', icon: Scale },
    { id: 'staff_workspace', label: 'My Workspace', icon: CheckSquare },
    { id: 'staff_mgmt', label: 'Staff Directory', icon: UserCheck },
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

      {/* MASTER REQUISITION CASCADE MODAL */}
      {isMasterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Select Requisition Type</h3>
              <button onClick={() => setIsMasterModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleSelectRequisitionType('leave')} className="p-4 border rounded-2xl hover:bg-blue-50 hover:border-[#0052CC] text-left transition">
                <Calendar className="w-6 h-6 text-[#0052CC] mb-2" />
                <h4 className="font-bold text-xs text-slate-900">Leave Application</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Apply for annual or sick leave</p>
              </button>
              <button onClick={() => handleSelectRequisitionType('finance')} className="p-4 border rounded-2xl hover:bg-blue-50 hover:border-[#0052CC] text-left transition">
                <Receipt className="w-6 h-6 text-[#0052CC] mb-2" />
                <h4 className="font-bold text-xs text-slate-900">Financial Claim</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Reimbursements & advances</p>
              </button>
              <button onClick={() => handleSelectRequisitionType('assets')} className="p-4 border rounded-2xl hover:bg-blue-50 hover:border-[#0052CC] text-left transition">
                <Building className="w-6 h-6 text-[#0052CC] mb-2" />
                <h4 className="font-bold text-xs text-slate-900">Asset Requisition</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Equipment & IT gear</p>
              </button>
              <button onClick={() => handleSelectRequisitionType('admin')} className="p-4 border rounded-2xl hover:bg-blue-50 hover:border-[#0052CC] text-left transition">
                <Folder className="w-6 h-6 text-[#0052CC] mb-2" />
                <h4 className="font-bold text-xs text-slate-900">Admin Support</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Logistics & camp support</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SPECIFIC REQUISITION SUBMISSION MODAL */}
      {isReqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 uppercase">New {activeReqType} Requisition</h3>
              <button onClick={() => setIsReqModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateRequisition} className="space-y-3">
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Purpose / Expense Head</label><input type="text" required name="expense_head" placeholder="e.g. Field camp logistics" className="w-full rounded-xl border p-2 text-xs" /></div>
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Amount Requested (PKR)</label><input type="number" required name="amount" placeholder="25000" className="w-full rounded-xl border p-2 text-xs font-bold" /></div>
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Justification Notes</label><textarea rows={3} name="notes" placeholder="Provide details..." className="w-full rounded-xl border p-2 text-xs resize-none" /></div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsReqModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Submit Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAVE APPLICATION MODAL */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Apply for Leave</h3>
              <button onClick={() => setIsLeaveModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateLeave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Leave Type</label>
                <select name="leave_type" className="w-full rounded-xl border p-2 text-xs font-semibold">
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Start Date</label><input type="date" required name="start_date" className="w-full rounded-xl border p-2 text-xs" /></div>
                <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">End Date</label><input type="date" required name="end_date" className="w-full rounded-xl border p-2 text-xs" /></div>
              </div>
              <div><label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Reason</label><textarea rows={3} required name="reason" placeholder="Reason for leave..." className="w-full rounded-xl border p-2 text-xs resize-none" /></div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003d99]">Submit Leave</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
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
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">{isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
            <h1 className="text-base md:text-lg font-bold text-slate-800 capitalize">{activeTab.replace('_', ' ')}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsMasterModalOpen(true)} className="flex items-center space-x-1.5 bg-[#0052CC] hover:bg-[#003d99] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer">
              <Plus className="w-4 h-4 text-amber-300" /> <span>+ New Requisition</span>
            </button>

            {/* USER PROFILE DROPDOWN */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center font-bold text-sm border border-blue-200">
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <span className="block text-xs font-bold text-slate-800 leading-none">{currentUser.name}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 leading-none">{currentUser.email}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-[#0052CC] border border-blue-200">{currentUser.role}</span>
                  </div>
                  <div className="pt-1">
                    <button onClick={() => { setActiveTab('staff_workspace'); setIsUserMenuOpen(false); }} className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <User className="w-4 h-4 text-slate-400" /><span>My Workspace</span>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer">
                      <LogOut className="w-4 h-4 text-red-500" /><span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView visibleRequests={requests} programs={programs} dockets={dockets} currentUser={currentUser} setActiveTab={setActiveTab} />}
            {activeTab === 'programs' && <ProgramsView programs={programs} refreshPrograms={fetchGlobalData} showToast={showToast} />}
            {activeTab === 'dockets' && <DocketsView dockets={dockets} refreshDockets={fetchGlobalData} showToast={showToast} />}
            {activeTab === 'staff_workspace' && <StaffWorkspaceView currentUser={currentUser} requests={requests} showToast={showToast} />}
            {activeTab === 'staff_mgmt' && <StaffManagementView currentUser={currentUser} showToast={showToast} profiles={profiles} refreshProfiles={fetchGlobalData} />}
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
      </main>
    </div>
  );
}
