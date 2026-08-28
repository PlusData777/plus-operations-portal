"use client";

import { useState, useEffect, useMemo } from "react";
import { CalendarRange, Download, Loader2 } from "lucide-react";
import { DATE_RANGES, PKR, SNAPSHOTS, type DateRange } from "@/lib/analytics-data";
import { MetricCards } from "@/components/analytics/metric-cards";
import { ExpenseTrendChart } from "@/components/analytics/expense-trend-chart";
import { StatusDonutChart } from "@/components/analytics/status-donut-chart";
import { TransactionsTable } from "@/components/analytics/transactions-table";

export function AnalyticsDashboard() {
  const [range, setRange] = useState<DateRange>("month");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/requests");
        const json = await res.json();
        if (json.records) {
          setRecords(json.records);
        }
      } catch (err) {
        console.error("Failed to load analytics records", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const snapshot = useMemo(() => {
    return SNAPSHOTS[range] ?? SNAPSHOTS.month;
  }, [range]);

  const rangeLabel = DATE_RANGES.find((option) => option.key === range)?.label ?? "";

  const handleExportCSV = () => {
    const rows: string[] = [];
    rows.push(`"Pakistan Legal United Society - Executive Analytics"`);
    rows.push(`"Report Range","${rangeLabel}"`);
    rows.push("");
    rows.push("Metric,Value,Change");
    snapshot.metrics.forEach((metric: any) =>
      rows.push(`"${metric.label}","${metric.value}","${metric.delta}%"`)
    );
    rows.push("");
    rows.push("High-Value Transactions");
    rows.push("Reference,Description,Category,Date,Amount (PKR),Approver,Status");
    snapshot.transactions.forEach((tx: any) =>
      rows.push(
        `"${tx.id}","${tx.description}","${tx.category}","${tx.date}","${tx.amount}","${tx.approver}","${tx.status}"`
      )
    );

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `PLUS_Analytics_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft md:flex-row md:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Executive Analytics
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Budget & Operations Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Organization-wide approval, expenditure, and field-case performance for Pakistan Legal United Society.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {DATE_RANGES.map((option) => (
              <button
                key={option.key}
                onClick={() => setRange(option.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  range === option.key
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-soft">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : (
        <>
          <MetricCards metrics={snapshot.metrics} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ExpenseTrendChart data={snapshot.trend} />
            </div>
            <div className="lg:col-span-4">
              <StatusDonutChart data={snapshot.statusDistribution} />
            </div>
          </div>

          <TransactionsTable transactions={snapshot.transactions} />
        </>
      )}
    </div>
  );
}
