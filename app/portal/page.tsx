import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listRequests } from "@/lib/webhook";
import { PortalShell } from "@/components/portal-shell";
import { StaffPortal } from "@/components/staff-portal";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const allRequests = await listRequests();
  const userEmail = (user.email || "").toLowerCase().trim();
  const userRequests = Array.isArray(allRequests)
    ? allRequests.filter((r) => (r.staffEmail || "").toLowerCase().trim() === userEmail)
    : [];

  return (
    <PortalShell user={user} active="portal">
      <StaffPortal user={user} />
    </PortalShell>
  );
}
