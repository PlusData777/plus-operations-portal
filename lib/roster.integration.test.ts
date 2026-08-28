import { describe, expect, it } from "vitest";

describe("configured Apps Script roster endpoint", () => {
  it("returns a successful server-filtered roster response", async () => {
    const endpoint = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
    expect(endpoint).toBeTruthy();

    const url = new URL(endpoint as string);
    url.searchParams.set("action", "GET_ROSTER");

    const response = await fetch(url, { redirect: "follow", cache: "no-store" });
    const body = await response.json() as { success?: unknown; roster?: Array<{ email?: unknown; name?: unknown; role?: unknown }> };

    expect(response.ok).toBe(true);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.roster)).toBe(true);
    expect(body.roster?.length).toBeGreaterThanOrEqual(20);
    expect(body.roster?.every(member => typeof member.email === "string" && typeof member.name === "string" && typeof member.role === "string")).toBe(true);
    expect(body.roster).toContainEqual(expect.objectContaining({ email: "dataplus.org@gmail.com", role: "ADMIN" }));
    expect(body.roster?.some(member => member.email === "plusdata.org@gmail.com" && member.role === "ADMIN")).toBe(false);
  }, 15_000);
});
