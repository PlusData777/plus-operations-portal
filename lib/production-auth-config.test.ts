import { describe, expect, it } from "vitest";
import { isAuthConfigured, isPrivilegedUser } from "@/lib/auth";

describe("production Google authentication configuration", () => {
  it("loads the required server-only OAuth, session, and executive access values", () => {
    expect(isAuthConfigured()).toBe(true);
    expect(process.env.GOOGLE_CLIENT_ID).toMatch(/\.apps\.googleusercontent\.com$/);
    expect(process.env.GOOGLE_CLIENT_SECRET?.length).toBeGreaterThan(20);
    expect(process.env.NEXTAUTH_SECRET?.length).toBeGreaterThan(20);
    expect(process.env.NEXTAUTH_URL).toBe("https://3000-in0b2jphtdmy0o2jx9eqj-58a0a0f9.us3.manus.computer");
  });
  it("allows the configured executive and leaves other authenticated accounts as staff", () => {
    expect(isPrivilegedUser({ role: "ADMIN" })).toBe(true);
    expect(isPrivilegedUser({ role: "EXECUTIVE" })).toBe(true);
    expect(isPrivilegedUser({ role: "GENERAL_STAFF" })).toBe(false);
  });
});
