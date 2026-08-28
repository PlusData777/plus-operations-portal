import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const scriptUrl =
    process.env.GOOGLE_MACRO_URL ||
    process.env.APPS_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      { success: false, error: "Apps Script URL is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8", // Ensures Apps Script postData parses cleanly without CORS/preflight failure
      },
      body: JSON.stringify({
        action: "createRequest",
        ...body,
      }),
      redirect: "follow",
    });

    const rawText = await res.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { success: true, message: "Request received", raw: rawText };
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Submission error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to submit request." },
      { status: 500 }
    );
  }
}
