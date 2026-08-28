import Link from "next/link";
import { LayoutDashboard, ShieldCheck, UserRound } from "lucide-react";
import { Brand } from "@/components/brand";
import { SignOutButton } from "@/components/auth-buttons";
import type { PortalUser } from "@/lib/auth";
import { isPrivilegedUser } from "@/lib/auth";
import { queueLabel, roleLabel } from "@/lib/rbac";

export function PortalShell({ children, user, active }: { children: React.ReactNode; user: PortalUser; active: "staff" | "review" }) {
  const baseNav = privileged
    ? [{ href: "/cockpit", label: queueLabel(user.role), icon: LayoutDashboard, key: "review" as const }]
    : [{ href: "/portal", label: "My submissions", icon: UserRound, key: "staff" as const }];

  const nav = [
    ...baseNav,
    { href: "/directory", label: "Staff Directory", icon: Users, key: "directory" as const },
  ];

  return <div className="min-h-screen bg-canvas"><header className="border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4"><Brand /><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="max-w-48 truncate text-sm font-bold text-slate-700">{user.name}</p><p className="max-w-48 truncate text-xs text-slate-500">{roleLabel(user.role)} · {user.email}</p></div><SignOutButton /></div></div></header><div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[240px_minmax(0,1fr)]"><aside className="panel h-fit p-3"><p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Secure workspace</p><nav className="space-y-1">{nav.map(item => { const Icon = item.icon; const selected = item.key === active; return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${selected ? "bg-navy text-white shadow-md shadow-navy/20" : "text-slate-600 hover:bg-slate-100 hover:text-navy"}`}><Icon size={17} />{item.label}</Link>; })}</nav><div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500"><ShieldCheck className="mb-2 text-emerald" size={17} /><strong className="block text-slate-700">{roleLabel(user.role)}</strong>{privileged ? user.approvalScope || "Your queue is filtered on the server by your roster role." : "Your submissions are filtered on the server by your verified Google account."}</div></aside><main className="min-w-0">{children}</main></div></div>;
}
