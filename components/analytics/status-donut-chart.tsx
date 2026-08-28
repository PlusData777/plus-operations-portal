"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { StatusSlice } from "@/lib/analytics-data";

export function StatusDonutChart({ data }: { data: StatusSlice[] }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <article className="panel enter p-5 sm:p-6">
      <h2 className="font-bold text-navy">Request Status Breakdown</h2>
      <p className="mt-0.5 text-xs text-slate-500">Distribution across the approval workflow</p>

      <div className="relative mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={90} paddingAngle={2} stroke="none">
              {data.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const slice = payload[0].payload as StatusSlice;
                return (
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lift">
                    <p className="flex items-center gap-1.5 text-xs font-bold text-navy">
                      <span className="h-2 w-2 rounded-full" style={{ background: slice.color }} />
                      {slice.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {slice.value} requests &middot; {((slice.value / total) * 100).toFixed(1)}%
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight text-navy">{total.toLocaleString()}</span>
          <span className="text-xs font-semibold text-slate-400">Total Requests</span>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {data.map((slice) => (
          <li key={slice.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-semibold text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: slice.color }} />
              {slice.name}
            </span>
            <span className="flex items-center gap-2">
              <span className="font-bold text-navy">{slice.value.toLocaleString()}</span>
              <span className="w-11 text-right text-xs text-slate-400">{((slice.value / total) * 100).toFixed(1)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
