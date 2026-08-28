import { describe, expect, it } from "vitest";

describe("configured Google Apps Script Webhook", () => {
  it("follows the Apps Script redirect and returns a successful GET envelope", async () => {
    const endpoint = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
    expect(endpoint).toMatch(/^https:\/\/script\.google\.com\/macros\/s\//);
    const response = await fetch(endpoint as string, { method: "GET", redirect: "follow", cache: "no-store" });
    expect(response.ok).toBe(true);
    const data = await response.json() as { success?: boolean; data?: unknown };
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  }, 20_000);
});
