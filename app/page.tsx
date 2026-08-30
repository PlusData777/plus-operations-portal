"use client";
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Receipt, Briefcase, Scale, Building, Plus, CheckCircle, Menu, X, Calendar, Folder, UserCheck, Clock, CheckSquare, Award, BarChart3, HeartHandshake
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
  const [currentUser, setCurrentUser] = useState({ id: '1', email: 'altafkhoso.adv@gmail.com', name: 'Altaf Khoso', designation: 'CEO', role: 'EXECUTIVE', posting: 'Karachi HQ' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [programs, setPrograms] = useState([]);
  const [dockets, setDockets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const fetchGlobalData = async () => {
    try {
      const [pRes, dRes, rRes, lRes] = await Promise.all([
        supabase.from('programs').select('*'),
        supabase.from('dockets').select('*'),
        supabase.from('requests').select('*'),
        supabase.from('leave_requests').select('*')
      ]);
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
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">{isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
            <h1 className="text-base md:text-lg font-bold text-slate-800 capitalize">{activeTab.replace('_', ' ')}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsLeaveModalOpen(true)} className="flex items-center space-x-1 bg-[#0052CC] hover:bg-[#003d99] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"><Plus className="w-4 h-4" /> <span>Apply for Leave</span></button>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center font-bold text-sm border border-blue-200" title={currentUser.name}>{currentUser.name.charAt(0)}</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView visibleRequests={requests} programs={programs} dockets={dockets} currentUser={currentUser} setActiveTab={setActiveTab} />}
            {activeTab === 'programs' && <ProgramsView programs={programs} refreshPrograms={fetchGlobalData} showToast={showToast} />}
            {activeTab === 'dockets' && <DocketsView dockets={dockets} refreshDockets={fetchGlobalData} showToast={showToast} />}
            {activeTab === 'staff_workspace' && <StaffWorkspaceView currentUser={currentUser} requests={requests} showToast={showToast} />}
            {activeTab === 'staff_mgmt' && <StaffManagementView currentUser={currentUser} showToast={showToast} />}
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
