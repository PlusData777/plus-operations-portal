import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listRequests } from "@/lib/webhook";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allRequests = await listRequests();
    const userEmail = user.email.toLowerCase().trim();

    // If Admin/Privileged, show all; otherwise filter by user's email
    const isPrivileged = ["ADMIN", "EXECUTIVE", "HR_ADMIN", "FINANCE_MGR", "PROGRAM_MGR"].includes(
      user.role
    );
    const requests = isPrivileged
      ? allRequests
      : allRequests.filter((r) => (r.staffEmail || "").toLowerCase().trim() === userEmail);

    return NextResponse.json({
      success: true,
      requests,
      data: requests,
    });
  } catch (error: any) {
    console.error("Requests API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load requests" },
      { status: 500 }
    );
  }
}
