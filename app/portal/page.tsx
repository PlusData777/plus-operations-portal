import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listRequests, listRoster } from "@/lib/webhook";
import { PortalShell } from "@/components/portal-shell";
import { StaffPortal } from "@/components/staff-portal"; // or MatrixStaffPortal depending on your component name

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const [allRequests, roster] = await Promise.all([
    listRequests(),
    listRoster(),
  ]);

  const userEmail = (user.email || "").toLowerCase().trim();
  const userRequests = Array.isArray(allRequests)
    ? allRequests.filter((r) => (r.staffEmail || "").toLowerCase().trim() === userEmail)
    : [];

  return (
    <PortalShell user={user}>
      <StaffPortal
        user={user}
        initialRequests={userRequests}
        roster={Array.isArray(roster) ? roster : []}
      />
    </PortalShell>
  );
}
