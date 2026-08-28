import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listRequests, listRoster } from "@/lib/webhook";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [requests, roster] = await Promise.all([
      listRequests(),
      listRoster(),
    ]);

    // Calculate queue metrics
  const approvedAmount = requests
      .filter((r) => String(r.status || "").toLowerCase() === "approved")
      .reduce((sum, r) => {
        const raw = String(r.amount ?? "").replace(/[^0-9.-]/g, "");
        const num = parseFloat(raw);
        return sum + (Number.isFinite(num) ? num : 0);
      }, 0);
    return NextResponse.json({
      success: true,
      requests,
      roster,
      canAssignTasks: true,
      queueLabel: "All Requests",
      kpis: {
        total,
        pending,
        approvedAmount,
        slaWarnings: 0,
      },
    });
  } catch (error: any) {
    console.error("Failed to load admin requests:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load requests from register" },
      { status: 500 }
    );
  }
}
