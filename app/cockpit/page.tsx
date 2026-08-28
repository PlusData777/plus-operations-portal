import { redirect } from "next/navigation";
import { AdvancedExecutiveCockpit } from "@/components/advanced-executive-cockpit";
import { ActionRequiredPanel } from "@/components/action-required-panel";
import { PortalShell } from "@/components/portal-shell";
import { getCurrentUser, isPrivilegedUser } from "@/lib/auth";
export default async function CockpitPage() { const user = await getCurrentUser(); if (!user) redirect("/"); if (!isPrivilegedUser(user)) redirect("/portal"); return <PortalShell user={user} active="review"><div className="space-y-6"><ActionRequiredPanel /><AdvancedExecutiveCockpit user={user} /></div></PortalShell>; }
