"use client";

import { useState, useEffect, useMemo } from "react";
import { Download, Loader2 } from "lucide-react";
import { MetricCards } from "@/components/analytics/metric-cards";
import { ExpenseTrendChart } from "@/components/analytics/expense-trend-chart";
import { StatusDonutChart } from "@/components/analytics/status-donut-chart";
import { TransactionsTable } from "@/components/analytics/transactions-table";

export function AnalyticsDashboard() {
  const [range, setRange] = useState<"month" | "30d" | "ytd">("month");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/requests");
        const json = await res.json();
        if (json.records && Array.isArray(json.records)) {
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

  // Compute live metrics from Google Sheets records
  const analytics = useMemo(() => {
    // 1. Pending reviews
    const pendingCount = records.filter(
      (r) =>
        r.status?.toUpperCase().includes("PENDING") ||
        r.status?.toUpperCase().includes("SUBMITTED") ||
        r.status?.toUpperCase().includes("TIER")
    ).length;

    // 2. Approved total expense (PKR)
    const approvedExpenses = records
      .filter((r) => r.status?.toUpperCase() === "APPROVED")
      .reduce((sum, r) => {
        const num = parseFloat(String(r.amount || "").replace(/[^0-9.-]+/g, ""));
        return sum + (isNaN(num) ? 0 : num);
      }, 0);

    // 3. Field & Legal cases count
    const activeCases = records.filter(
      (r) =>
        r.category?.toLowerCase().includes("legal") ||
        r.category?.toLowerCase().includes("field")
    ).length;

    // 4. Staff on leave count
    const leaveCount = records.filter(
      (r) =>
        r.category?.toLowerCase().includes("leave") &&
        r.status?.toUpperCase() === "APPROVED"
    ).length;

    const metrics = [
      {
        label: "Approvals Pending",
        value: String(pendingCount),
        subtext: "Across active reviewer queues",
        icon: "clipboard",
      },
      {
        label: "Expenses Processed",
        value: `Rs ${approvedExpenses.toLocaleString()}`,
        subtext: `${records.filter((r) => r.status?.toUpperCase() === "APPROVED").length} approved records`,
        icon: "cash",
      },
      {
        label: "Active Field Cases",
        value: String(activeCases),
        subtext: "Legal & operations records",
        icon: "scale",
      },
      {
        label: "Staff on Leave",
        value: String(leaveCount),
        subtext: "Approved leave submissions",
        icon: "user-minus",
      },
    ];

    // Status breakdown distribution
    const statusCounts: Record<string, number> = {
      Approved: 0,
      "Tier 1 Review": 0,
      "Tier 2 Review": 0,
      Rejected: 0,
    };

    records.forEach((r) => {
      const s = (r.status || "").toUpperCase();
      if (s === "APPROVED") statusCounts["Approved"]++;
      else if (s.includes("TIER 1") || s === "SUBMITTED") statusCounts["Tier 1 Review"]++;
      else if (s.includes("TIER 2")) statusCounts["Tier 2 Review"]++;
      else if (s === "REJECTED") statusCounts["Rejected"]++;
    });

    const statusDistribution = Object.entries(statusCounts).map(([name, count]) => ({
      name,
      value: count,
    }));

    // Real transactions
    const transactions = records.slice(0, 10).map((r) => ({
      id: r.id || "REQ",
      description: r.justification || r.title || r.category || "Operations Request",
      category: r.category || "General",
      date: r.timestamp ? new Date(r.timestamp).toLocaleDateString() : "Recent",
      amount: r.amount ? `Rs ${parseFloat(String(r.amount).replace(/[^0-9.-]+/g, "") || "0").toLocaleString()}` : "-",
      approver: r.requesterName || r.requesterEmail || "Staff",
      status: r.status || "Submitted",
    }));

    return { metrics, statusDistribution, transactions };
  }, [records]);

  const handleExportCSV = () => {
    const rows: string[] = [];
    rows.push(`"Pakistan Legal United Society - Executive Analytics"`);
    rows.push(`"Generated At","${new Date().toLocaleString()}"`);
    rows.push("");
    rows.push("Reference,Requester,Category,Amount,Status,Timestamp");
    records.forEach((r) => {
      rows.push(
        `"${r.id || ""}","${r.requesterName || r.requesterEmail || ""}","${r.category || ""}","${r.amount || 0}","${r.status || ""}","${r.timestamp || ""}"`
      );
    });

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `PLUS_Live_Analytics.csv`);
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
            Live Operations & Budget Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Live synchronization with Pakistan Legal United Society Google Sheets datastore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Download className="h-4 w-4" />
            Export Live CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-soft">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : (
        <>
          <MetricCards metrics={analytics.metrics as any} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-12">
              <StatusDonutChart data={analytics.statusDistribution as any} />
            </div>
          </div>

          <TransactionsTable transactions={analytics.transactions as any} />
        </>
      )}
    </div>
  );
}
