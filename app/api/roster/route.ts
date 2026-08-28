import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const scriptUrl =
    process.env.GOOGLE_MACRO_URL ||
    process.env.APPS_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      { success: false, error: "Apps Script URL not configured in environment variables." },
      { status: 500 }
    );
  }

  try {
    const url = new URL(scriptUrl);
    url.searchParams.set("action", "roster");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      redirect: "follow", // Follow Apps Script redirects
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching roster from Apps Script:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch roster." },
      { status: 500 }
    );
  }
}
