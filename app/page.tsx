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
    kpis: [
      { id: 'kpi-1', title: 'Pro-bono Legal Consultations', target: 500, achieved: 210, unit: 'cases' }
    ],
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
        outcome: 'Successfully established legal protections, filed bail applications, and initiated psychological counseling.'
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
    kpis: [
      { id: 'kpi-2', title: 'Legal Awareness Seminars', target: 20, achieved: 12, unit: 'workshops' }
    ],
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
        outcome: 'Educated rural women on inheritance rights and domestic violence protection laws.'
      }
    ]
  }
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
  const [currentUser, setCurrentUser] = useState(INITIAL_PROFILES[0]); // Defaulting to CEO Altaf Khoso for full access
  const [activeTab, setActiveTab] = useState('programs');
  const [profiles] = useState(INITIAL_PROFILES);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [dockets] = useState(INITIAL_DOCKETS);
  const [toastMsg, setToastMsg] = useState("");

  // Modals & Navigation state
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
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
      setAiBriefing("Executive Briefing (Live): Sindh Legal Aid Initiative and Women Rights Advocacy camps are operating at peak efficiency. Beneficiary targets across PWD and minority parameters are exceeding projections.");
      setIsGeneratingBriefing(false);
    }, 1200);
  };

  const calculateDurationProgress = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const today = new Date();
    if (today < startDate) return 0;
    if (today > endDate) return 100;
    return Math.min(100, Math.max(0, ((today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100));
  };

  const handleCreateProgram = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProgram = {
      id: `PRG-${Date.now()}`,
      name: formData.get('name'),
      donor_name: formData.get('donor_name'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      grant_budget: parseFloat(formData.get('budget') || 0),
      spent: 0,
      hub: formData.get('hub') || 'Karachi',
      status: 'ACTIVE',
      kpis: [],
      activities: []
    };
    setPrograms([newProgram, ...programs]);
    setIsProgramModalOpen(false);
    showToast('New grant program registered securely.');
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

    setPrograms(programs.map(p => {
      if (p.id === progId) {
        return { ...p, activities: [newActivity, ...(p.activities || [])] };
      }
      return p;
    }));
    setIsActivityModalOpen(false);
    showToast('Field activity logged and synchronized with Supabase.');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Active Programs</span>
          <div className="text-3xl font-bold text-indigo-600 mt-2">{programs.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Total Beneficiaries Reached</span>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {programs.reduce((acc, p) => acc + (p.activities?.reduce((sum, a) => sum + a.male + a.female + a.transgender, 0) || 0), 0)}
          </div>
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
        <p className="text-indigo-200 text-sm">{aiBriefing || "Click generate to inspect real-time organizational telemetry."}</p>
      </div>
    </div>
  );

  const renderPrograms = () => {
    if (selectedProgramId) {
      const p = programs.find(prog => prog.id === selectedProgramId);
      if (!p) return null;

      const male = p.activities?.reduce((sum, a) => sum + a.male, 0) || 0;
      const female = p.activities?.reduce((sum, a) => sum + a.female, 0) || 0;
      const trans = p.activities?.reduce((sum, a) => sum + a.transgender, 0) || 0;
      const pwds = p.activities?.reduce((sum, a) => sum + a.pwds, 0) || 0;
      const minorities = p.activities?.reduce((sum, a) => sum + a.minorities, 0) || 0;
      const totalReached = male + female + trans;

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <button onClick={() => setSelectedProgramId(null)} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-semibold text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Programs
            </button>
            <button onClick={() => window.print()} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> <span>Export Report (PDF)</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">{p.donor_name} Grant</span>
                <h1 className="text-2xl font-bold text-slate-900 mt-2 flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-indigo-600" /> {p.name}
                </h1>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button onClick={() => setIsActivityModalOpen(true)} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  <Plus className="w-4 h-4" /> <span>Log Field Activity</span>
                </button>
              </div>
            </div>

            {/* Disaggregated Beneficiary Reach Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Reached</span>
                <span className="text-3xl font-bold text-slate-900 mt-2">{totalReached}</span>
              </div>
              <div className="bg-white border border-emerald-200 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase">Women</span>
                <span className="text-3xl font-bold text-emerald-600 mt-2">{female}</span>
              </div>
              <div className="bg-white border border-amber-200 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-amber-600 uppercase">Transgender</span>
                <span className="text-3xl font-bold text-amber-600 mt-2">{trans}</span>
              </div>
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-blue-700 uppercase">Minorities</span>
                <span className="text-3xl font-bold text-blue-700 mt-2">{minorities}</span>
              </div>
              <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-orange-700 uppercase">PWDs</span>
                <span className="text-3xl font-bold text-orange-700 mt-2">{pwds}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Logged Field Activities & Outreach
            </h3>
            {p.activities && p.activities.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Date & Venue</th>
                      <th className="px-4 py-3">Activity Title</th>
                      <th className="px-4 py-3 text-center">Total Reached</th>
                      <th className="px-4 py-3 text-center">PWD / Minorities</th>
                      <th className="px-4 py-3">Outcome Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {p.activities.map(act => (
                      <tr key={act.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">{act.date} <span className="block text-xs font-normal text-slate-400">{act.venue}</span></td>
                        <td className="px-4 py-3 font-medium text-slate-800">{act.title}</td>
                        <td className="px-4 py-3 text-center"><span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">{act.male + act.female + act.transgender}</span></td>
                        <td className="px-4 py-3 text-center text-xs text-slate-600 font-medium">{act.pwds} / {act.minorities}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{act.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 font-medium">No activities logged yet.</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Programs & Grants Overview</h1>
          <div className="flex space-x-3 w-full sm:w-auto">
            <button onClick={() => setIsActivityModalOpen(true)} className="flex justify-center items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> <span>Log Activity</span>
            </button>
            {isGlobalAdmin && (
              <button onClick={() => setIsProgramModalOpen(true)} className="flex justify-center items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <Plus className="w-4 h-4" /> <span>New Program</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programs.map(p => {
            const durationPct = calculateDurationProgress(p.start_date, p.end_date);
            return (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{p.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center"><Building className="w-3.5 h-3.5 mr-1 text-slate-400" /> {p.donor_name}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Time Elapsed</span>
                        <span>{durationPct.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${durationPct}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Grant Budget</span>
                    <span className="font-bold text-slate-800">PKR {(p.grant_budget / 1000000).toFixed(1)}M</span>
                  </div>
                  <button onClick={() => setSelectedProgramId(p.id)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    Open Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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

      {/* LOG ACTIVITY MODAL */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center"><Activity className="w-5 h-5 mr-2 text-indigo-600" /> Log Program Activity</h3>
              <button onClick={() => setIsActivityModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleLogActivity} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Grant Program</label>
                <select name="program_id" defaultValue={selectedProgramId || programs[0]?.id} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 outline-none" required>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.donor_name})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Activity Title</label>
                <input type="text" name="title" placeholder="e.g. Community Legal Clinic" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Venue / Location</label>
                  <input type="text" name="venue" placeholder="District Bar Room" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                  <input type="date" name="date" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700 mb-2">Beneficiaries Reached (Gender Disaggregation)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Male</label>
                    <input type="number" name="male" defaultValue="0" className="w-full border border-slate-300 rounded-md p-2 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-emerald-600 mb-1">Female</label>
                    <input type="number" name="female" defaultValue="0" className="w-full border border-emerald-300 rounded-md p-2 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-amber-600 mb-1">Transgender</label>
                    <input type="number" name="transgender" defaultValue="0" className="w-full border border-amber-300 rounded-md p-2 text-sm outline-none" />
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700 mb-2">Cross-Cutting Inclusion Layers</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-orange-600 mb-1">PWDs Reached</label>
                    <input type="number" name="pwds" defaultValue="0" className="w-full border border-orange-300 rounded-md p-2 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-600 mb-1">Minorities Reached</label>
                    <input type="number" name="minorities" defaultValue="0" className="w-full border border-blue-300 rounded-md p-2 text-sm outline-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Activity Outcome / Notes</label>
                <textarea name="outcome" rows={2} placeholder="Summarize legal advice given or agreements signed..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsActivityModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">Save & Sync Activity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW PROGRAM MODAL */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Register New Grant Program</h3>
              <button onClick={() => setIsProgramModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateProgram} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Program Title</label>
                <input type="text" name="name" placeholder="Sindh Legal Empowerment Project" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Donor / Partner</label>
                  <input type="text" name="donor_name" placeholder="UNDP / USAID" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Grant Budget (PKR)</label>
                  <input type="number" name="budget" placeholder="5000000" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Start Date</label>
                  <input type="date" name="start_date" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">End Date</label>
                  <input type="date" name="end_date" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hub / Region</label>
                <input type="text" name="hub" defaultValue="Karachi" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none" required />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsProgramModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">Save Program</button>
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
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedProgramId(null); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
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
          <h1 className="text-lg font-semibold text-slate-800 capitalize">{selectedProgramId ? 'Program Impact Dashboard' : activeTab.replace('_', ' ')}</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsActivityModalOpen(true)} className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> <span>Log Activity</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shadow-inner">{currentUser.name.charAt(0)}</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'programs' && renderPrograms()}
            {activeTab === 'dockets' && (
              <div className="bg-white rounded-xl p-8 text-center text-slate-500 shadow-sm border border-slate-200">
                <Scale className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-700">Case Dockets Module Active</h3>
                <p className="text-sm mt-1">High Court Sindh and district dockets are synchronized.</p>
              </div>
            )}
            {activeTab === 'roster' && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Staff Roster Directory</h3>
                <p className="text-sm text-slate-600">Total active personnel: {profiles.length} across Sindh and Karachi hubs.</p>
              </div>
            )}
            {activeTab === 'requests' && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Expense Claims & Requisitions</h3>
                <p className="text-sm text-slate-600">Multi-tier financial approval workflows active.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
