import { ArrowDownRight, ArrowUpRight, Banknote, CalendarOff, ClipboardCheck, Scale } from "lucide-react";
import type { Metric } from "@/lib/analytics-data";

const ICONS = [ClipboardCheck, Banknote, Scale, CalendarOff];
const TONES = ["bg-navy/8 text-navy", "bg-emerald/10 text-emerald", "bg-amber-100 text-amber-700", "bg-crimson/10 text-crimson"];

export function MetricCards({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = ICONS[index % ICONS.length];
        const positive = metric.delta >= 0;
        return (
          <article key={metric.label} className="panel enter p-5" style={{ animationDelay: `${index * 45}ms` }}>
            <div className="flex items-start justify-between">
              <p className="text-sm font-semibold text-slate-500">{metric.label}</p>
              <div className={`rounded-lg p-2 ${TONES[index % TONES.length]}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold tracking-tight text-navy">{metric.value}</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-bold ${positive ? "bg-emerald/10 text-emerald" : "bg-crimson/10 text-crimson"}`}>
                {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {Math.abs(metric.delta).toFixed(1)}%
              </span>
              <span className="text-slate-400">{metric.deltaLabel}</span>
            </div>
            <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">{metric.hint}</p>
          </article>
        );
      })}
    </section>
  );
}
