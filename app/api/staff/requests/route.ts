import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listRequests, listRoster } from "@/lib/webhook";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [allRequests, roster] = await Promise.all([
      listRequests(),
      listRoster(),
    ]);

    const userEmail = user.email.toLowerCase().trim();
    const userRequests = Array.isArray(allRequests)
      ? allRequests.filter((r) => (r.staffEmail || "").toLowerCase().trim() === userEmail)
      : [];

    return NextResponse.json({
      success: true,
      requests: userRequests,
      data: userRequests,
      roster: Array.isArray(roster) ? roster : [],
    });
  } catch (error: any) {
    console.error("Staff requests GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load submissions" },
      { status: 500 }
    );
  }
}
