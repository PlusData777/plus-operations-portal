import { redirect } from "next/navigation";
import { getCurrentUser, isPrivilegedUser } from "@/lib/auth";
import { PortalShell } from "@/components/portal-shell";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  if (!isPrivilegedUser(user)) {
    redirect("/portal");
  }

  return (
    <PortalShell user={user} active="analytics">
      <AnalyticsDashboard />
    </PortalShell>
  );
}
