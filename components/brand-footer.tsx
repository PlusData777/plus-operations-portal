"use client";

import { Building2, MapPin, Phone, Scale } from "lucide-react";

export function BrandFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-[#1b365d] text-white">
      {/* Top Quick Action Banner */}
      <div className="border-b border-white/10 bg-[#122440] py-4 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#fad207]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Pakistan Legal United Society · Operations & Legal Aid Hub
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#c65a28] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              Field Operations Active
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Logo & Org Identity */}
          <div className="space-y-3 md:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fad207] text-[#1b365d] font-bold shadow-md">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white">
                  Pakistan Legal United Society
                </h3>
                <p className="text-[12px] font-bold text-[#fad207] font-serif">
                  انصاف سب کا حق ہے
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Committed to human rights protection, public interest legal aid, and operational transparency across Sindh and Pakistan.
            </p>
          </div>

          {/* Regional Hubs Matrix */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:col-span-8">
            {/* Karachi */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#fad207] mb-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>Head Office (Karachi)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Plot 213, St 4, New Bakhtawar Goth, Block-09, Gulistan-e-Johar
              </p>
              <div className="mt-2.5 flex items-center gap-1 text-[11px] font-mono text-slate-200">
                <Phone className="h-3 w-3 text-[#fad207]" />
                <span>021-34011698</span>
              </div>
            </div>

            {/* Hyderabad */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#fad207] mb-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>Regional (Hyderabad)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                House B/7 Ground Floor, Street 1, Sunny Bungalows, Qasimabad
              </p>
              <div className="mt-2.5 flex items-center gap-1 text-[11px] font-mono text-slate-200">
                <Phone className="h-3 w-3 text-[#fad207]" />
                <span>022-6112571</span>
              </div>
            </div>

            {/* Sukkur */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#fad207] mb-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>Regional (Sukkur)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Women Development Complex, near SRSO, Shikarpur Rd
              </p>
              <div className="mt-2.5 flex items-center gap-1 text-[11px] font-mono text-slate-200">
                <Phone className="h-3 w-3 text-[#fad207]" />
                <span>071-5824119</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <span>PLUS Governance & Operations Management System</span>
          <span className="font-mono text-[#fad207]">dataplus.org@gmail.com</span>
        </div>
      </div>
    </footer>
  );
}
