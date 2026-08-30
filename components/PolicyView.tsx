"use client";
import React from 'react';
import { Folder, FileText, Download, ExternalLink } from 'lucide-react';

const POLICIES = [
  { id: 'pol-1', title: 'PLUS Operations & Financial Manual 2026', category: 'Finance & Operations', version: 'v2.4', date: '2026-01-15', link: '#' },
  { id: 'pol-2', title: 'HR Policy & Code of Conduct', category: 'Human Resources', version: 'v3.0', date: '2025-11-10', link: '#' },
  { id: 'pol-3', title: 'Gender Equality & Social Inclusion (GESI) Guidelines', category: 'Programs', version: 'v1.8', date: '2026-02-01', link: '#' },
  { id: 'pol-4', title: 'Procurement & Sub-Grantee Terms of Reference (TOR)', category: 'Legal & Compliance', version: 'v2.1', date: '2026-04-12', link: '#' }
];

export default function PolicyView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Folder className="w-6 h-6 text-[#0052CC]" />
        <h2 className="text-xl font-bold text-slate-900">Policy Folders & Institutional Guidelines</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {POLICIES.map(pol => (
          <div key={pol.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-[#0052CC] bg-blue-50 px-2.5 py-1 rounded border border-blue-100">{pol.category}</span>
                <span className="text-xs font-semibold text-slate-400">{pol.version}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{pol.title}</h3>
              <p className="text-xs text-slate-500">Last Revised: {pol.date}</p>
            </div>
            <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
              <span className="text-xs font-medium text-slate-600">Secure Institutional Document</span>
              <a href={pol.link} className="flex items-center space-x-1 text-xs font-bold text-[#0052CC] hover:underline bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                <Download className="w-3.5 h-3.5 mr-1" /> <span>Download PDF</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
