import { describe, expect, it } from "vitest";
import { resolveAuthOrigin } from "@/lib/auth-origin";

describe("trusted authentication origin resolution", () => {
  it("prefers an explicit canonical NextAuth URL", () => {
    expect(resolveAuthOrigin({ NEXTAUTH_URL: "https://plus-operations.vercel.app/", VERCEL_URL: "preview.example.vercel.app" })).toBe("https://plus-operations.vercel.app");
  });
  it("uses the Vercel deployment host when no canonical URL is configured", () => {
    expect(resolveAuthOrigin({ VERCEL_URL: "plus-operations-git-main.vercel.app" })).toBe("https://plus-operations-git-main.vercel.app");
  });
  it("rejects malformed and insecure configured origins", () => {
    expect(resolveAuthOrigin({ NEXTAUTH_URL: "http://untrusted.example" })).toBeUndefined();
    expect(resolveAuthOrigin({ NEXTAUTH_URL: "not a url" })).toBeUndefined();
  });
});
