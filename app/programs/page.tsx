"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Accessibility,
  Activity,
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  Filter,
  GraduationCap,
  HeartHandshake,
  Layers,
  MapPin,
  Megaphone,
  PhoneCall,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smile,
  Sparkles,
  UserCheck,
  Users,
  X,
} from "lucide-react";

export interface ProgramActivity {
  id: string;
  activityTitle: string;
  category:
    | "Disability Rights & Inclusion"
    | "Prison Rehabilitation (NAVTTC)"
    | "Community Legal Clinic"
    | "Police & Judicial Training"
    | "Child Protection & Anti-Child Marriage"
    | "Grassroots Family Welfare";
  prisonFacility?: string;
  tradeOrTopic?: string;
  regionalHub: "Karachi" | "Hyderabad" | "Sukkur";
  venueOrDistrict: string;
  activityDate: string;
  leadCoordinatorName: string;
  leadCoordinatorEmail: string;
  beneficiariesWomen: number;
  beneficiariesMen: number;
  beneficiariesJuvenile: number;
  beneficiariesPWD: number;
  beneficiariesTransgender: number;
  keyOutputs: string;
  status: "Completed" | "In Progress" | "Planned";
}

const OFFICIAL_FACILITIES = [
  "Central Prison & Correctional Facility, Hyderabad",
  "Women Prison & Correctional Facility, Hyderabad",
  "Central Prison & Correctional Facility, Sukkur",
  "Women Prison & Correctional Facility, Karachi",
  "Youthful Offenders Industrial School (YOIS), Karachi",
  "District Prison & Correctional Facility, Malir, Karachi",
  "Community Venue / Field District",
];

const INITIAL_ACTIVITIES: ProgramActivity[] = [
  {
    id: "PROG-2026-01",
    activityTitle: "NAVTTC Certified Computer IT & Solar PV Training Batch-02",
    category: "Prison Rehabilitation (NAVTTC)",
    prisonFacility: "Central Prison & Correctional Facility, Sukkur",
    tradeOrTopic: "CIT & Solar PV Systems",
    regionalHub: "Sukkur",
    venueOrDistrict: "Central Jail Vocational Center, Sukkur",
    activityDate: "2026-08-26",
    leadCoordinatorName: "Salma Habib Bhutto",
    leadCoordinatorEmail: "salmahabibbhutto88@gmail.com",
    beneficiariesWomen: 0,
    beneficiariesMen: 35,
    beneficiariesJuvenile: 5,
    beneficiariesPWD: 2,
    beneficiariesTransgender: 0,
    keyOutputs: "40 Inmates completed technical modules; certified for post-release employment linkage.",
    status: "Completed",
  },
  {
    id: "PROG-2026-02",
    activityTitle: "Enforcement Advocacy for Mandatory 5% Employment Quota for PWDs",
    category: "Disability Rights & Inclusion",
    tradeOrTopic: "Disability Quota Enforcement & Banking Access",
    regionalHub: "Karachi",
    venueOrDistrict: "Sindh High Court / DEPD Directorate, Karachi",
    activityDate: "2026-08-27",
    leadCoordinatorName: "Altaf Khoso",
    leadCoordinatorEmail: "altafkhoso.adv@gmail.com",
    beneficiariesWomen: 18,
    beneficiariesMen: 27,
    beneficiariesJuvenile: 0,
    beneficiariesPWD: 45,
    beneficiariesTransgender: 2,
    keyOutputs: "Direct follow-up on CP D-2172 compliance with government departments & financial institutions.",
    status: "Completed",
  },
  {
    id: "PROG-2026-03",
    activityTitle: "Investigation Officers Sensitization on JJSA & SGBV Standard Procedures",
    category: "Police & Judicial Training",
    tradeOrTopic: "Juvenile Justice System Act & Remand Guidelines",
    regionalHub: "Hyderabad",
    venueOrDistrict: "Police Training College, Hyderabad",
    activityDate: "2026-08-28",
    leadCoordinatorName: "Ashfaq Ali",
    leadCoordinatorEmail: "ishfaque.mojai@gmail.com",
    beneficiariesWomen: 12,
    beneficiariesMen: 38,
    beneficiariesJuvenile: 0,
    beneficiariesPWD: 0,
    beneficiariesTransgender: 0,
    keyOutputs: "50 Police SHOs and Sub-Inspectors trained on statutory bail and child protection intake protocols.",
    status: "Completed",
  },
];

export default function ProgramOperationsPage() {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const [activities, setActivities] = useState<ProgramActivity[]>(INITIAL_ACTIVITIES);
  const [activeTab, setActiveTab] = useState<"ALL" | ProgramActivity["category"]>("ALL");
  const [selectedHub, setSelectedHub] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<ProgramActivity["category"]>("Disability Rights & Inclusion");
  const [formFacility, setFormFacility] = useState(OFFICIAL_FACILITIES[0]);
  const [formTrade, setFormTrade] = useState("");
  const [formHub, setFormHub] = useState<"Karachi" | "Hyderabad" | "Sukkur">("Sukkur");
  const [formVenue, setFormVenue] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formWomen, setFormWomen] = useState(0);
  const [formMen, setFormMen] = useState(0);
  const [formJuveniles, setFormJuveniles] = useState(0);
  const [formPWD, setFormPWD] = useState(0);
  const [formTransgender, setFormTransgender] = useState(0);
  const [formOutputs, setFormOutputs] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("plus_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Session retrieval failed:", e);
    }
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchesTab = activeTab === "ALL" || act.category === activeTab;
      const matchesHub = selectedHub === "ALL" || act.regionalHub === selectedHub;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        act.activityTitle.toLowerCase().includes(q) ||
        act.venueOrDistrict.toLowerCase().includes(q) ||
        act.leadCoordinatorName.toLowerCase().includes(q) ||
        act.keyOutputs.toLowerCase().includes(q);

      return matchesTab && matchesHub && matchesSearch;
    });
  }, [activities, activeTab, selectedHub, searchQuery]);

  // Aggregate M&E Numbers
  const metrics = useMemo(() => {
    let totalWomen = 0;
    let totalMen = 0;
    let totalJuveniles = 0;
    let totalPWD = 0;
    let totalTransgender = 0;

    activities.forEach((act) => {
      totalWomen += Number(act.beneficiariesWomen) || 0;
      totalMen += Number(act.beneficiariesMen) || 0;
      totalJuveniles += Number(act.beneficiariesJuvenile) || 0;
      totalPWD += Number(act.beneficiariesPWD) || 0;
      totalTransgender += Number(act.beneficiariesTransgender) || 0;
    });

    const totalBeneficiaries = totalWomen + totalMen + totalJuveniles + totalTransgender;
    const prisonSessions = activities.filter((a) => a.category === "Prison Rehabilitation (NAVTTC)").length;
    const disabilityInterventions = activities.filter((a) => a.category === "Disability Rights & Inclusion").length;
    const trainingsDelivered = activities.filter((a) => a.category === "Police & Judicial Training").length;

    return {
      totalBeneficiaries,
      totalWomen,
      totalPWD,
      totalTransgender,
      prisonSessions,
      disabilityInterventions,
      trainingsDelivered,
    };
  }, [activities]);

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !formTitle.trim()) return;

    setSubmitting(true);
    const newActivity: ProgramActivity = {
      id: "PROG-2026-0" + (activities.length + 1),
      activityTitle: formTitle,
      category: formCategory,
      prisonFacility: formCategory === "Prison Rehabilitation (NAVTTC)" ? formFacility : undefined,
      tradeOrTopic: formTrade,
      regionalHub: formHub,
      venueOrDistrict: formVenue,
      activityDate: formDate,
      leadCoordinatorName: currentUser.name,
      leadCoordinatorEmail: currentUser.email,
      beneficiariesWomen: formWomen,
      beneficiariesMen: formMen,
      beneficiariesJuvenile: formJuveniles,
      beneficiariesPWD: formPWD,
      beneficiariesTransgender: formTransgender,
      keyOutputs: formOutputs,
      status: "Completed",
    };

    setTimeout(() => {
      setActivities([newActivity, ...activities]);
      setSubmitting(false);
      setIsModalOpen(false);
      setFormTitle("");
      setFormVenue("");
      setFormTrade("");
      setFormOutputs("");
      setFormWomen(0);
      setFormMen(0);
      setFormJuveniles(0);
      setFormPWD(0);
      setFormTransgender(0);
    }, 400);
  };

  const handleExportCSV = () => {
    const headers = [
      "ID,Activity Title,Category,Hub,Facility/Venue,Date,Lead,Women,Men,Juvenile,PWD,Transgender,Total,Outputs\n",
    ];
    const rows = filteredActivities.map(
      (a) =>
        `"${a.id}","${a.activityTitle}","${a.category}","${a.regionalHub}","${a.prisonFacility || a.venueOrDistrict}","${a.activityDate}","${a.leadCoordinatorName}",${a.beneficiariesWomen},${a.beneficiariesMen},${a.beneficiariesJuvenile},${a.beneficiariesPWD},${a.beneficiariesTransgender},${a.beneficiariesWomen + a.beneficiariesMen + a.beneficiariesJuvenile + a.beneficiariesTransgender},"${a.keyOutputs.replace(/"/g, '""')}"\n`
    );
    const blob = new Blob([headers.join("") + rows.join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PLUS_M&E_Program_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-[#1b365d]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Workspace</span>
          </Link>
          <span className="text-[11px] font-semibold text-slate-400">
            Pakistan Legal United Society · Strategic Program Architecture
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6">
        {/* Title Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-6 w-6 text-[#1b365d]" />
              <h1 className="text-2xl font-bold text-[#1b365d]">Program Operations & Impact Hub</h1>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Field mobilization, NAVTTC prison rehabilitation units, disability inclusion, and stakeholder training logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export M&E Report</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#c65a28] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#a8491d] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Log Program Activity</span>
            </button>
          </div>
        </div>

        {/* Aggregate Impact Dashboard Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Reached</span>
              <Users className="h-4 w-4 text-[#1b365d]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#1b365d]">{metrics.totalBeneficiaries.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500">Beneficiaries engaged</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Disability Rights</span>
              <Accessibility className="h-4 w-4 text-[#c65a28]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#c65a28]">{metrics.totalPWD}</p>
            <span className="text-[10px] text-slate-500">PWDs supported</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Prison Units</span>
              <GraduationCap className="h-4 w-4 text-[#e59a24]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#e59a24]">{metrics.prisonSessions} Batches</p>
            <span className="text-[10px] text-slate-500">Across 6 Sindh prisons</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Women Reached</span>
              <HeartHandshake className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{metrics.totalWomen.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500">Legal protection & counseling</span>
          </div>
        </div>

        {/* Thematic Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === "ALL"
                ? "bg-[#1b365d] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            All Tracks ({activities.length})
          </button>
          <button
            onClick={() => setActiveTab("Disability Rights & Inclusion")}
            className={`rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === "Disability Rights & Inclusion"
                ? "bg-[#1b365d] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Disability Rights (5% Quota)
          </button>
          <button
            onClick={() => setActiveTab("Prison Rehabilitation (NAVTTC)")}
            className={`rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === "Prison Rehabilitation (NAVTTC)"
                ? "bg-[#1b365d] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Prison Vocational (NAVTTC)
          </button>
          <button
            onClick={() => setActiveTab("Police & Judicial Training")}
            className={`rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === "Police & Judicial Training"
                ? "bg-[#1b365d] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Police & Judicial Workshops
          </button>
          <button
            onClick={() => setActiveTab("Child Protection & Anti-Child Marriage")}
            className={`rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === "Child Protection & Anti-Child Marriage"
                ? "bg-[#1b365d] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Child Protection & Anti-Marriage
          </button>
          <button
            onClick={() => setActiveTab("Community Legal Clinic")}
            className={`rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
              activeTab === "Community Legal Clinic"
                ? "bg-[#1b365d] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Community Legal Clinics
          </button>
        </div>

        {/* Search & Hub Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by activity, district, prison facility, or key outputs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#1b365d] focus:outline-hidden"
            >
              <option value="ALL">All Regional Hubs</option>
              <option value="Karachi">Karachi (Head Office)</option>
              <option value="Hyderabad">Hyderabad Regional</option>
              <option value="Sukkur">Sukkur Regional</option>
            </select>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-[#1b365d] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1b365d]">{act.id}</span>
                    <span className="rounded-md bg-[#1b365d]/10 px-2 py-0.5 text-[10px] font-bold text-[#1b365d]">
                      {act.category}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {act.regionalHub}
                    </span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-slate-900">{act.activityTitle}</h3>
                  {act.tradeOrTopic && (
                    <p className="text-xs font-medium text-[#c65a28] mt-0.5">
                      Focus Track: {act.tradeOrTopic}
                    </p>
                  )}
                </div>

                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  {act.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 text-[#c65a28] shrink-0" />
                  <span className="truncate">{act.prisonFacility || act.venueOrDistrict}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Date: <strong className="text-slate-800">{act.activityDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[#1b365d] shrink-0" />
                  <span>Lead: <strong className="text-slate-800">{act.leadCoordinatorName}</strong></span>
                </div>
              </div>

              {/* Beneficiary Breakdown Badge Grid */}
              <div className="rounded-xl bg-[#f8fafc] p-3 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-600 flex-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                    Outputs, Judgments & Milestones
                  </span>
                  {act.keyOutputs}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-mono text-[11px] font-bold bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-emerald-700">♀ {act.beneficiariesWomen} Women</span>
                  <span className="text-slate-700">♂ {act.beneficiariesMen} Men</span>
                  <span className="text-[#c65a28]">♿ {act.beneficiariesPWD} PWD</span>
                  <span className="text-[#e59a24]">★ {act.beneficiariesJuvenile} Youth</span>
                  <span className="text-[#1b365d] border-l border-slate-200 pl-2">
                    Total: {act.beneficiariesWomen + act.beneficiariesMen + act.beneficiariesJuvenile + act.beneficiariesTransgender}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1b365d]">Log Program Deliverable</h3>
                <p className="text-[11px] text-slate-500">Record activity data under PLUS strategic pillars.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Disability Employment Quota Advocacy / Inmate Solar PV Batch"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Pillar / Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Disability Rights & Inclusion">Disability Rights & Inclusion (5% Quota)</option>
                    <option value="Prison Rehabilitation (NAVTTC)">Prison Rehabilitation (NAVTTC)</option>
                    <option value="Police & Judicial Training">Police & Judicial Training</option>
                    <option value="Child Protection & Anti-Child Marriage">Child Protection & Anti-Child Marriage</option>
                    <option value="Community Legal Clinic">Community Legal Clinic</option>
                    <option value="Grassroots Family Welfare">Grassroots Family Welfare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Regional Hub
                  </label>
                  <select
                    value={formHub}
                    onChange={(e) => setFormHub(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Sukkur">Sukkur Regional</option>
                    <option value="Hyderabad">Hyderabad Regional</option>
                    <option value="Karachi">Karachi (Head Office)</option>
                  </select>
                </div>
              </div>

              {formCategory === "Prison Rehabilitation (NAVTTC)" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Correctional Facility (Sindh)
                  </label>
                  <select
                    value={formFacility}
                    onChange={(e) => setFormFacility(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    {OFFICIAL_FACILITIES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Venue / Community Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Qasimabad / Malir Court / SRSO Complex"
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Activity Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Beneficiaries Reached (Gender & Inclusion Disaggregation)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-700 block mb-0.5">Women</span>
                    <input
                      type="number"
                      min="0"
                      value={formWomen}
                      onChange={(e) => setFormWomen(parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-[#1b365d] focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-700 block mb-0.5">Men</span>
                    <input
                      type="number"
                      min="0"
                      value={formMen}
                      onChange={(e) => setFormMen(parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-[#1b365d] focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#c65a28] block mb-0.5">PWDs</span>
                    <input
                      type="number"
                      min="0"
                      value={formPWD}
                      onChange={(e) => setFormPWD(parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-[#1b365d] focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#e59a24] block mb-0.5">Youth/Inmates</span>
                    <input
                      type="number"
                      min="0"
                      value={formJuveniles}
                      onChange={(e) => setFormJuveniles(parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-[#1b365d] focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Key Outputs & Institutional Outcomes
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detail the case outcomes, certifications issued, or policy compliance results..."
                  value={formOutputs}
                  onChange={(e) => setFormOutputs(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#c65a28] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#a8491d] disabled:opacity-50 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? "Saving..." : "Record Activity"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
