"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Palmtree,
  Stethoscope,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type LeaveCategoryKey = "casual" | "annual" | "medical";

export interface LeaveBalance {
  /** Stable identifier for the leave category. */
  key: LeaveCategoryKey;
  /** Human-readable label, e.g. "Casual Leave". */
  label: string;
  /** Days still available to the staff member. */
  remaining: number;
  /** Total annual entitlement for the category. */
  total: number;
}

export type HolidayType = "Gazetted" | "Optional";

export interface Holiday {
  /** ISO date string, e.g. "2026-03-23". */
  date: string;
  /** Holiday name, e.g. "Pakistan Day". */
  name: string;
  /** Whether the holiday is gazetted (official) or optional. */
  type: HolidayType;
}

export interface LeaveQuotaCardProps {
  /** Staff member name shown in the header (optional). */
  staffName?: string;
  /** Leave balances; defaults to a representative sample set. */
  balances?: LeaveBalance[];
  /** Upcoming holidays list; defaults to Pakistani public/court holidays. */
  holidays?: Holiday[];
  /** Threshold (in days) below which a low-balance warning shows. Default 2. */
  lowBalanceThreshold?: number;
  /** Optional extra class names for the outer card. */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Defaults                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_BALANCES: LeaveBalance[] = [
  { key: "casual", label: "Casual Leave", remaining: 8, total: 12 },
  { key: "annual", label: "Annual Leave", remaining: 14, total: 20 },
  { key: "medical", label: "Medical / Sick Leave", remaining: 6, total: 8 },
];

const DEFAULT_HOLIDAYS: Holiday[] = [
  { date: "2026-03-23", name: "Pakistan Day", type: "Gazetted" },
  { date: "2026-03-21", name: "Eid-ul-Fitr (Tentative)", type: "Gazetted" },
  { date: "2026-05-01", name: "Labour Day", type: "Gazetted" },
  { date: "2026-05-27", name: "Eid-ul-Azha (Tentative)", type: "Gazetted" },
  { date: "2026-07-10", name: "Court Vacation Begins", type: "Optional" },
  { date: "2026-08-14", name: "Independence Day", type: "Gazetted" },
];

const CATEGORY_META: Record<
  LeaveCategoryKey,
  { icon: LucideIcon; stroke: string; tint: string; iconColor: string }
> = {
  casual: {
    icon: CalendarDays,
    stroke: "stroke-emerald-600",
    tint: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  annual: {
    icon: Palmtree,
    stroke: "stroke-teal-600",
    tint: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  medical: {
    icon: Stethoscope,
    stroke: "stroke-sky-600",
    tint: "bg-sky-50",
    iconColor: "text-sky-600",
  },
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatHolidayDate(iso: string): { day: string; weekday: string } {
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { day: iso, weekday: "" };
  }
  return {
    day: parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    weekday: parsed.toLocaleDateString("en-GB", { weekday: "short" }),
  };
}

/* -------------------------------------------------------------------------- */
/*  Ring indicator                                                            */
/* -------------------------------------------------------------------------- */

function BalanceRing({
  balance,
  lowBalanceThreshold,
}: {
  balance: LeaveBalance;
  lowBalanceThreshold: number;
}) {
  const meta = CATEGORY_META[balance.key];
  const Icon = meta.icon;
  const safeTotal = Math.max(balance.total, 1);
  const remaining = Math.max(Math.min(balance.remaining, safeTotal), 0);
  const used = safeTotal - remaining;
  const fraction = remaining / safeTotal;
  const isLow = remaining < lowBalanceThreshold;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * fraction;

  return (
    <div className="relative flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:shadow-panel">
      {isLow && (
        <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
          <AlertTriangle className="h-3 w-3" />
          Low
        </span>
      )}

      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            strokeWidth="7"
            className="stroke-slate-100"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            className={isLow ? "stroke-amber-500" : meta.stroke}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold leading-none text-slate-900">
            {remaining}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            of {safeTotal}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${meta.tint}`}>
          <Icon className={`h-3.5 w-3.5 ${meta.iconColor}`} />
        </span>
        <h4 className="text-xs font-semibold text-slate-700">{balance.label}</h4>
      </div>
      <p className="mt-1 text-[11px] text-slate-400">
        {used} used &middot; {remaining} left
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function LeaveQuotaCard({
  staffName,
  balances = DEFAULT_BALANCES,
  holidays = DEFAULT_HOLIDAYS,
  lowBalanceThreshold = 2,
  className = "",
}: LeaveQuotaCardProps) {
  const sortedHolidays = [...holidays].sort(
    (a, b) => Date.parse(a.date) - Date.parse(b.date),
  );

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel ${className}`}
      aria-label="Leave balances and upcoming holidays"
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
            <Sparkles className="h-4.5 w-4.5 text-emerald-600" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Leave Balances
            </h3>
            <p className="text-xs text-slate-500">
              {staffName ? `${staffName} · ` : ""}Current fiscal year
            </p>
          </div>
        </div>
        <span className="hidden rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-500 sm:inline">
          Pakistan Legal United Society
        </span>
      </header>

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-5">
        {/* Balances */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {balances.map((balance) => (
              <BalanceRing
                key={balance.key}
                balance={balance}
                lowBalanceThreshold={lowBalanceThreshold}
              />
            ))}
          </div>

          {/* Linear progress summary */}
          <div className="mt-4 space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            {balances.map((balance) => {
              const safeTotal = Math.max(balance.total, 1);
              const remaining = Math.max(Math.min(balance.remaining, safeTotal), 0);
              const pct = Math.round((remaining / safeTotal) * 100);
              const isLow = remaining < lowBalanceThreshold;
              return (
                <div key={balance.key}>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-600">{balance.label}</span>
                    <span className="font-semibold text-slate-500">{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${isLow ? "bg-amber-500" : "bg-emerald-600"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming holidays */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <h4 className="text-sm font-semibold text-slate-900">Upcoming Holidays</h4>
          </div>
          <ul className="space-y-2">
            {sortedHolidays.map((holiday) => {
              const { day, weekday } = formatHolidayDate(holiday.date);
              const isGazetted = holiday.type === "Gazetted";
              return (
                <li
                  key={`${holiday.date}-${holiday.name}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                >
                  <div className="flex w-12 flex-col items-center rounded-lg bg-slate-50 py-1">
                    <span className="text-xs font-bold leading-tight text-slate-900">
                      {day.split(" ")[0]}
                    </span>
                    <span className="text-[10px] uppercase text-slate-400">
                      {day.split(" ")[1]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800">
                      {holiday.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{weekday}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isGazetted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {holiday.type}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default LeaveQuotaCard;
