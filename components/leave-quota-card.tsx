"use client";

import { useMemo } from "react";
import { CalendarDays, Palmtree, Stethoscope, Sparkles } from "lucide-react";

export interface LeaveQuotaCardProps {
  staffName?: string;
  userRequests?: Array<{
    category?: string;
    leaveType?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: any;
  }>;
}

const HOLIDAYS_2026 = [
  { date: "21 Mar", day: "Sat", name: "Eid-ul-Fitr (Tentative)", type: "Gazetted" },
  { date: "23 Mar", day: "Mon", name: "Pakistan Day", type: "Gazetted" },
  { date: "01 May", day: "Fri", name: "Labour Day", type: "Gazetted" },
  { date: "27 May", day: "Wed", name: "Eid-ul-Azha (Tentative)", type: "Gazetted" },
  { date: "14 Aug", day: "Fri", name: "Independence Day", type: "Gazetted" },
  { date: "09 Nov", day: "Mon", name: "Iqbal Day", type: "Gazetted" },
  { date: "25 Dec", day: "Fri", name: "Quaid-e-Azam Day / Christmas", type: "Gazetted" },
];

export function LeaveQuotaCard({
  staffName = "Staff Member",
  userRequests = [],
}: LeaveQuotaCardProps) {
  // Compute approved leave deductions dynamically
  const usage = useMemo(() => {
    let casual = 0;
    let annual = 0;
    let medical = 0;

    userRequests.forEach((req) => {
      const isApproved =
        req.status === "APPROVED" ||
        req.status === "EXECUTIVE_APPROVED" ||
        req.status === "LINE_MANAGER_APPROVED";

      if (req.category === "LEAVE" && isApproved) {
        let days = 1;
        if (req.startDate && req.endDate) {
          const start = new Date(req.startDate).getTime();
          const end = new Date(req.endDate).getTime();
          const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          if (diff > 0) days = diff;
        }

        const type = (req.leaveType || "").toLowerCase();
        if (type.includes("casual")) casual += days;
        else if (type.includes("annual")) annual += days;
        else if (type.includes("medical") || type.includes("sick")) medical += days;
      }
    });

    return { casual, annual, medical };
  }, [userRequests]);

  const quotas = [
    {
      title: "Casual Leave",
      total: 5,
      used: usage.casual,
      remaining: Math.max(0, 5 - usage.casual),
      icon: CalendarDays,
      color: "text-amber-600",
      ringColor: "stroke-amber-500",
    },
    {
      title: "Annual Leave",
      total: 5,
      used: usage.annual,
      remaining: Math.max(0, 5 - usage.annual),
      icon: Palmtree,
      color: "text-emerald-600",
      ringColor: "stroke-emerald-500",
    },
    {
      title: "Medical / Sick Leave",
      total: 2,
      used: usage.medical,
      remaining: Math.max(0, 2 - usage.medical),
      icon: Stethoscope,
      color: "text-blue-600",
      ringColor: "stroke-blue-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Leave Balances</h2>
              <p className="text-xs text-slate-500">
                {staffName} · Current fiscal year quota
              </p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Pakistan Legal United Society
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 3 Circular Balance Cards */}
          <div className="space-y-4 lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {quotas.map((q) => {
                const Icon = q.icon;
                const percentage = Math.round((q.remaining / q.total) * 100);

                return (
                  <div
                    key={q.title}
                    className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center transition hover:border-slate-200"
                  >
                    <div className="relative mb-3 flex h-16 w-16 items-center justify-center">
                      <svg className="h-16 w-16 -rotate-90 transform">
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="currentColor"
                          strokeWidth="5"
                          className="text-slate-200"
                          fill="transparent"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="currentColor"
                          strokeWidth="5"
                          strokeDasharray={163.36}
                          strokeDashoffset={163.36 - (163.36 * percentage) / 100}
                          strokeLinecap="round"
                          className={q.ringColor}
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute text-sm font-bold text-slate-800">
                        {q.remaining}
                        <span className="text-[10px] text-slate-400">/{q.total}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Icon className={`h-4 w-4 ${q.color}`} />
                      <span>{q.title}</span>
                    </div>
                    <span className="mt-1 text-[11px] text-slate-500">
                      {q.used} used · {q.remaining} left
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Percentage Bars */}
            <div className="space-y-2 pt-2">
              {quotas.map((q) => (
                <div key={`bar-${q.title}`} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>{q.title}</span>
                    <span>{Math.round((q.remaining / q.total) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        q.remaining === 0 ? "bg-red-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${(q.remaining / q.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 lg:col-span-5">
            <h3 className="mb-3 text-xs font-bold tracking-wider text-slate-700 uppercase">
              Upcoming Holidays
            </h3>
            <div className="space-y-2">
              {HOLIDAYS_2026.slice(0, 4).map((h) => (
                <div
                  key={h.name}
                  className="flex items-center justify-between rounded-lg bg-white p-2.5 text-xs shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-col items-center justify-center rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                      <span>{h.date.split(" ")[0]}</span>
                      <span className="text-[8px] uppercase text-slate-400">{h.date.split(" ")[1]}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{h.name}</p>
                      <p className="text-[10px] text-slate-400">{h.day}</p>
                    </div>
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {h.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
