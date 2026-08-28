"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DEPARTMENTS, formatCompactPKR, PKR, type ExpensePoint } from "@/lib/analytics-data";

type Mode = "bar" | "line";

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lift">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <ul className="space-y-1">
        {payload.map((row) => (
          <li key={row.name} className="flex items-center justify-between gap-6 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full" style={{ background: row.color }} />
              {row.name}
            </span>
            <span className="font-bold text-navy">{PKR.format(row.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExpenseTrendChart({ data }: { data: ExpensePoint[] }) {
  const [mode, setMode] = useState<Mode>("bar");

  return (
    <article className="panel enter p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-navy">Monthly Expense Trend</h2>
          <p className="mt-0.5 text-xs text-slate-500">Disbursements by department (PKR)</p>
        </div>
        <div className="flex rounded-lg border border-slate-200 p-0.5">
          {(["bar", "line"] as Mode[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={`rounded-md px-3 py-1 text-xs font-bold capitalize transition ${mode === option ? "bg-navy text-white" : "text-slate-500 hover:text-navy"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        {DEPARTMENTS.map((dept) => (
          <span key={dept.key} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: dept.color }} />
            {dept.key}
          </span>
        ))}
      </div>

      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {mode === "bar" ? (
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={formatCompactPKR} width={48} />
              <Tooltip cursor={{ fill: "rgba(29,53,87,0.05)" }} content={<ChartTooltip />} />
              {DEPARTMENTS.map((dept) => (
                <Bar key={dept.key} dataKey={dept.key} fill={dept.color} radius={[4, 4, 0, 0]} maxBarSize={26} />
              ))}
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={formatCompactPKR} width={48} />
              <Tooltip content={<ChartTooltip />} />
              {DEPARTMENTS.map((dept) => (
                <Line key={dept.key} type="monotone" dataKey={dept.key} stroke={dept.color} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </article>
  );
}
