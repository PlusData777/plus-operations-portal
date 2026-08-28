import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal-shell";
import { MatrixStaffPortal } from "@/components/matrix-staff-portal";
import { getCurrentUser, isPrivilegedUser } from "@/lib/auth";

export default async function PortalPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (isPrivilegedUser(user)) redirect("/cockpit");
  return <PortalShell user={user} active="staff"><MatrixStaffPortal user={{ name: user.name, email: user.email, department: user.department }} /></PortalShell>;
}
