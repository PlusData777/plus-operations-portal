import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listRoster } from "@/lib/webhook";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roster = await listRoster();
    return NextResponse.json({
      success: true,
      roster: Array.isArray(roster) ? roster : [],
    });
  } catch (error: any) {
    console.error("Staff roster API error:", error);
    return NextResponse.json({ error: error?.message || "Failed to load roster" }, { status: 500 });
  }
}
