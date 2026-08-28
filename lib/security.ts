export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return;
  try {
    if (new URL(origin).host !== host) throw new Error("Cross-origin request blocked.");
  } catch {
    throw new Error("Cross-origin request blocked.");
  }
}

export function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}
