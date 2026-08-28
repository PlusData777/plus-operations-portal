import { NextResponse } from "next/server";

export async function GET() {
  try {
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (GOOGLE_SCRIPT_URL) {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=GET_CASES`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ cases: data.cases || [] });
      }
    }
    return NextResponse.json({ cases: [] });
  } catch (error) {
    return NextResponse.json({ cases: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (GOOGLE_SCRIPT_URL) {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
