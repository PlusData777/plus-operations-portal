import Link from "next/link";
import { LayoutDashboard, UserRound, Users, BarChart3, FolderOpen } from "lucide-react";
import { Brand } from "@/components/brand";
import { SignOutButton } from "@/components/auth-buttons";
import type { PortalUser } from "@/lib/auth";
import { isPrivilegedUser } from "@/lib/auth";
import { queueLabel, roleLabel } from "@/lib/rbac";

export function PortalShell({
  children,
  user,
  active,
}: {
  children: React.ReactNode;
  user: PortalUser;
  active: "staff" | "review" | "directory" | "analytics" | "documents";
}) {
  const privileged = isPrivilegedUser(user);

  const staffNav = [
    { href: "/portal", label: "My submissions", icon: UserRound, key: "staff" as const },
    { href: "/directory", label: "Staff Directory", icon: Users, key: "directory" as const },
    { href: "/documents", label: "Document & Policy Hub", icon: FolderOpen, key: "documents" as const },
  ];

  const privilegedNav = [
    { href: "/cockpit", label: queueLabel(user.role), icon: LayoutDashboard, key: "review" as const },
    { href: "/directory", label: "Staff Directory", icon: Users, key: "directory" as const },
    { href: "/documents", label: "Document & Policy Hub", icon: FolderOpen, key: "documents" as const },
    { href: "/analytics", label: "Executive Analytics", icon: BarChart3, key: "analytics" as const },
  ];

  const nav = privileged ? privilegedNav : staffNav;

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Brand />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">
                {roleLabel(user.role)} &middot; {user.email}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-soft space-y-1">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Secure Workspace
              </p>
              <nav className="space-y-1">
                {nav.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.key;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                        isActive
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
