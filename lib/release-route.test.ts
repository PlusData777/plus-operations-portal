import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/release/route";

describe("release verification endpoint", () => {
  it("identifies the approval-matrix release without exposing operational data", async () => {
    const response = await GET();
    await expect(response.json()).resolves.toEqual({
      release: "plus-approval-matrix-2026-08-28",
      features: expect.arrayContaining(["category-aware-intake", "three-tier-approval-matrix", "pending-reviewer-routing", "delivery-evidence"]),
    });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});
