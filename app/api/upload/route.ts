import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const endpoint = process.env.GOOGLE_SCRIPT_URL || process.env.APPS_SCRIPT_URL;

    if (!endpoint) {
      return NextResponse.json({ success: false, error: "Missing backend endpoint URL" }, { status: 500 });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Upload API route error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
