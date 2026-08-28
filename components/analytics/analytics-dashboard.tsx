"use client";

import { useState, useEffect, useMemo } from "react";
import { CalendarRange, Download, Loader2 } from "lucide-react";
import { DATE_RANGES, PKR, type DateRange } from "@/lib/analytics-data";
import { MetricCards } from "@/components/analytics/metric-cards";
import { ExpenseTrendChart } from "@/components/analytics/expense-trend-chart";
import { StatusDonutChart } from "@/components/analytics/status-donut-chart";
import { TransactionTable } from "@/components/analytics/transactions-table";

export function AnalyticsDashboard() {
  const [range, setRange] = useState<DateRange>("month");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/requests");
        const json = await res.json();
        if (json.records) setRecords(json.records);
      } catch (err) {
        console.error("Failed to load analytics data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const rangeLabel = DATE_RANGES.find((option) => option.key === range)?.label ?? "";
  function exportReport() {
    const rows: string[] = [];
    rows.push(`PLUS Executive Analytics Report,${rangeLabel}`);
    rows.push("");
    rows.push("Metric,Value,Change");
    snapshot.metrics.forEach((metric) => rows.push(`${metric.label},"${metric.value}",${metric.delta}%`));
    rows.push("");
    rows.push("High-Value Transactions");
    rows.push("Reference,Description,Category,Date,Amount (PKR),Approver,Status");
    snapshot.transactions.forEach((tx) =>
      rows.push(`${tx.reference},"${tx.description}",${tx.category},${tx.date},${PKR.format(tx.amount)},${tx.approver},${tx.status}`),
    );

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `plus-analytics-${range}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <section className="enter flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald">Executive Analytics</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy">Budget &amp; Operations Overview</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Organization-wide approval, expenditure, and field-case performance for Pakistan Legal United Society.
          </p>
        </div>
      </section>

      <section className="enter flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-panel">
          <span className="pl-2 pr-1 text-slate-400">
            <CalendarRange size={16} />
          </span>
          {DATE_RANGES.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setRange(option.key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${range === option.key ? "bg-navy text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-navy"}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={exportReport}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald px-4 py-2.5 text-sm font-bold text-white shadow-panel transition hover:bg-emerald/90"
        >
          <Download size={16} />
          Export Report
        </button>
      </section>

      <MetricCards metrics={snapshot.metrics} />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExpenseTrendChart data={snapshot.expenseTrend} />
        </div>
        <div className="lg:col-span-1">
          <StatusDonutChart data={snapshot.statusBreakdown} />
        </div>
      </section>

      <TransactionsTable transactions={snapshot.transactions} />
    </div>
  );
}
