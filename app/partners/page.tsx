"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCheck2,
  Filter,
  Handshake,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

export interface PartnerOrganization {
  id: string;
  name: string;
  category: "Government & Justice" | "Accreditation & Skills" | "Donor & Funding" | "Civil Society & Protection";
  engagementScope: string;
  mouStatus: "Active MoU" | "Strategic Collaboration" | "Under Renewal";
  validThrough: string;
  focalPerson: string;
  focalContact: string;
  jointInitiativesCount: number;
}

const INITIAL_PARTNERS: PartnerOrganization[] = [
  {
    id: "PTR-01",
    name: "National Vocational & Technical Training Commission (NAVTTC)",
    category: "Accreditation & Skills",
    engagementScope: "Accreditation, curricula verification, and official certification for prison vocational training units across Sindh correctional facilities.",
    mouStatus: "Active MoU",
    validThrough: "2027-12-31",
    focalPerson: "Regional Directorate Sindh",
    focalContact: "info@navttc.gov.pk",
    jointInitiativesCount: 6,
  },
  {
    id: "PTR-02",
    name: "Department of Empowerment of Persons with Disabilities (DEPD)",
    category: "Government & Justice",
    engagementScope: "Joint advocacy and compliance enforcement for the mandatory 5% employment quota and institutional access for persons with disabilities.",
    mouStatus: "Active MoU",
    validThrough: "2026-12-31",
    focalPerson: "Director Legal & Advocacy",
    focalContact: "depd.sindh@gmail.com",
    jointInitiativesCount: 4,
  },
  {
    id: "PTR-03",
    name: "Sindh Judicial Academy",
    category: "Government & Justice",
    engagementScope: "Judicial dialogues, prosecutor sensitization, and multi-tier training on Juvenile Justice System Act and bail jurisprudence.",
    mouStatus: "Strategic Collaboration",
    validThrough: "2027-06-30",
    focalPerson: "Faculty In-Charge",
    focalContact: "training@sja.gov.pk",
    jointInitiativesCount: 8,
  },
  {
    id: "PTR-04",
    name: "Sindh Charity Commission",
    category: "Donor & Funding",
    engagementScope: "Statutory governance registration, operational compliance, and organizational transparency auditing.",
    mouStatus: "Active MoU",
    validThrough: "2026-12-31",
    focalPerson: "Registration Desk",
    focalContact: "charitycommission@sindh.gov.pk",
    jointInitiativesCount: 1,
  },
  {
    id: "PTR-05",
    name: "Women Development Department (WDD), Govt of Sindh",
    category: "Government & Justice",
    engagementScope: "Operations of the Sukkur Women Development Complex, anti-child marriage enforcement, and SGBV legal aid clinics.",
    mouStatus: "Active MoU",
    validThrough: "2027-12-31",
    focalPerson: "Regional Director Sukkur",
    focalContact: "wdd.sukkur@sindh.gov.pk",
    jointInitiativesCount: 12,
  },
  {
    id: "PTR-06",
    name: "i-Care Fund America",
    category: "Donor & Funding",
    engagementScope: "Grant funding and operational support for prison inmate rehabilitation, vocational supplies, and indigent legal defense.",
    mouStatus: "Active MoU",
    validThrough: "2026-12-31",
    focalPerson: "Programs Coordinator",
    focalContact: "grants@i-care-america.org",
    jointInitiativesCount: 3,
  },
  {
    id: "PTR-07",
    name: "Edhi Foundation",
    category: "Civil Society & Protection",
    engagementScope: "Emergency relief rations, shelter referrals for vulnerable litigation clients, and humanitarian casework support.",
    mouStatus: "Strategic Collaboration",
    validThrough: "Ongoing",
    focalPerson: "Regional Operations Desk",
    focalContact: "support@edhi.org",
    jointInitiativesCount: 15,
  },
  {
    id: "PTR-08",
    name: "Human Rights Commission of Pakistan (HRCP)",
    category: "Civil Society & Protection",
    engagementScope: "Fact-finding joint missions, missing person petitions, and prison condition monitoring visits.",
    mouStatus: "Strategic Collaboration",
    validThrough: "Ongoing",
    focalPerson: "Sindh Chapter Lead",
    focalContact: "hrcp@hrcp-web.org",
    jointInitiativesCount: 9,
  },
];

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerOrganization[]>(INITIAL_PARTNERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<PartnerOrganization["category"]>("Government & Justice");
  const [scope, setScope] = useState("");
  const [mouStatus, setMouStatus] = useState<PartnerOrganization["mouStatus"]>("Active MoU");
  const [validThrough, setValidThrough] = useState("2027-12-31");
  const [focalPerson, setFocalPerson] = useState("");
  const [focalContact, setFocalContact] = useState("");

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchesCat = selectedCategory === "ALL" || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.engagementScope.toLowerCase().includes(q) ||
        p.focalPerson.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [partners, selectedCategory, searchQuery]);

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPartner: PartnerOrganization = {
      id: "PTR-0" + (partners.length + 1),
      name,
      category,
      engagementScope: scope,
      mouStatus,
      validThrough,
      focalPerson,
      focalContact,
      jointInitiativesCount: 1,
    };

    setPartners([newPartner, ...partners]);
    setIsModalOpen(false);
    setName("");
    setScope("");
    setFocalPerson("");
    setFocalContact("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-16">
      {/* Top Header */}
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
            Pakistan Legal United Society · Institutional Collaboration Matrix
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl space-y-6 px-4 pt-6 sm:px-6">
        {/* Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Handshake className="h-6 w-6 text-[#1b365d]" />
              <h1 className="text-2xl font-bold text-[#1b365d]">Institutional Partners & Grant Matrix</h1>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Statutory bodies, judicial training academies, donor partners, and civil society alliances.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1b365d] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#122440] cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#fad207]" />
            <span>+ Add Partner / MoU</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active MoUs</span>
            <p className="mt-2 text-2xl font-bold text-[#1b365d]">{partners.length} Entities</p>
            <span className="text-[10px] text-slate-500">Formally engaged</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Government & Courts</span>
            <p className="mt-2 text-2xl font-bold text-[#c65a28]">
              {partners.filter((p) => p.category === "Government & Justice").length} Bodies
            </p>
            <span className="text-[10px] text-slate-500">Police, SJA, DEPD & WDD</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Donors & Grants</span>
            <p className="mt-2 text-2xl font-bold text-[#e59a24]">
              {partners.filter((p) => p.category === "Donor & Funding").length} Partners
            </p>
            <span className="text-[10px] text-slate-500">Charity Commission & Funds</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Joint Deliverables</span>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {partners.reduce((sum, p) => sum + p.jointInitiativesCount, 0)} Projects
            </p>
            <span className="text-[10px] text-slate-500">Completed initiatives</span>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search partners by name, focal person, or mandate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#1b365d] focus:outline-hidden"
            >
              <option value="ALL">All Categories</option>
              <option value="Government & Justice">Government & Justice</option>
              <option value="Accreditation & Skills">Accreditation & Skills (NAVTTC)</option>
              <option value="Donor & Funding">Donor & Funding</option>
              <option value="Civil Society & Protection">Civil Society & Protection</option>
            </select>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 transition hover:border-[#1b365d]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1b365d]">{partner.id}</span>
                    <span className="rounded-md bg-[#1b365d]/10 px-2 py-0.5 text-[10px] font-bold text-[#1b365d]">
                      {partner.category}
                    </span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-slate-900">{partner.name}</h3>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    partner.mouStatus === "Active MoU"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-blue-50 text-[#1b365d] border border-blue-200"
                  }`}
                >
                  {partner.mouStatus}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-[#f8fafc] p-3 rounded-xl border border-slate-100">
                {partner.engagementScope}
              </p>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Focal Person / Desk</span>
                  <span className="font-semibold text-slate-800">{partner.focalPerson}</span>
                  <span className="text-[11px] font-mono text-slate-500 block truncate">{partner.focalContact}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Validity</span>
                  <span className="font-semibold text-slate-800">{partner.validThrough}</span>
                  <span className="text-[11px] font-bold text-emerald-600 block">
                    {partner.jointInitiativesCount} Joint Initiatives
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#1b365d]">Add Institutional Partner / MoU</h3>
                <p className="text-[11px] text-slate-500">Record collaborative institutional partnerships.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Organization / Entity Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sindh Judicial Academy / NAVTTC"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Government & Justice">Government & Justice</option>
                    <option value="Accreditation & Skills">Accreditation & Skills (NAVTTC)</option>
                    <option value="Donor & Funding">Donor & Funding</option>
                    <option value="Civil Society & Protection">Civil Society & Protection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">MoU Status</label>
                  <select
                    value={mouStatus}
                    onChange={(e) => setMouStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  >
                    <option value="Active MoU">Active MoU</option>
                    <option value="Strategic Collaboration">Strategic Collaboration</option>
                    <option value="Under Renewal">Under Renewal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Mandate & Engagement Scope
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe joint initiatives, legal aid referrals, or certified skills tracks..."
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Focal Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Director Training"
                    value={focalPerson}
                    onChange={(e) => setFocalPerson(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Contact / Email</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@entity.gov.pk"
                    value={focalContact}
                    onChange={(e) => setFocalContact(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs focus:border-[#1b365d] focus:bg-white focus:outline-hidden font-mono"
                  />
                </div>
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
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b365d] py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#122440] cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 text-[#fad207]" />
                  <span>Save Partner Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
