import { afterEach, describe, expect, it, vi } from "vitest";
import { isAuthConfigured } from "@/lib/auth";

describe("authentication configuration", () => {
  afterEach(() => { vi.unstubAllEnvs(); });
  it("requires a session secret and both Google OAuth credentials", () => {
    vi.stubEnv("NEXTAUTH_SECRET", "");
    vi.stubEnv("GOOGLE_CLIENT_ID", "client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "client-secret");
    vi.stubEnv("NEXTAUTH_URL", "");
    expect(isAuthConfigured()).toBe(false);
    vi.stubEnv("NEXTAUTH_SECRET", "session-secret");
    expect(isAuthConfigured()).toBe(true);
  });
});
