import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PortalShell } from "@/components/portal-shell";
import { DocumentsHub } from "@/components/documents-hub";

export default async function DocumentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <PortalShell user={user} active="documents">
      <DocumentsHub />
    </PortalShell>
  );
}
