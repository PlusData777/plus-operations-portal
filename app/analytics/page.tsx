import { Brand } from "@/components/brand";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Brand />
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Executive Dashboard</p>
            <p className="text-xs text-slate-500">Board &amp; Leadership View</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
