import { PenLine } from "lucide-react";
import { categoryBadgeClass, PKR, type Transaction } from "@/lib/analytics-data";

const DATE_FMT = new Intl.DateTimeFormat("en-PK", { day: "2-digit", month: "short", year: "numeric" });

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <article className="panel enter overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
        <div>
          <h2 className="font-bold text-navy">Recent High-Value Transactions</h2>
          <p className="mt-0.5 text-xs text-slate-500">Disbursements above PKR 400,000 requiring executive sign-off</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-bold sm:px-6">Reference</th>
              <th className="px-5 py-3 font-bold">Category</th>
              <th className="px-5 py-3 font-bold">Date</th>
              <th className="px-5 py-3 text-right font-bold">Amount</th>
              <th className="px-5 py-3 font-bold sm:px-6">Approver</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-slate-50 transition last:border-0 hover:bg-slate-50/60">
                <td className="px-5 py-4 sm:px-6">
                  <p className="font-bold text-navy">{tx.reference}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{tx.description}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${categoryBadgeClass(tx.category)}`}>
                    {tx.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600">{DATE_FMT.format(new Date(tx.date))}</td>
                <td className="px-5 py-4 text-right font-bold tabular-nums text-navy">{PKR.format(tx.amount)}</td>
                <td className="px-5 py-4 sm:px-6">
                  <span className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy/8 text-navy">
                      <PenLine size={13} />
                    </span>
                    <span className="italic text-slate-700" style={{ fontFamily: "Georgia, serif" }}>{tx.approver}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
