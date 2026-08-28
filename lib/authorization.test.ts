import { describe, expect, it } from "vitest";
import { normalizedEmail } from "@/lib/authorization";

describe("email normalization", () => {
  it("normalizes casing and surrounding whitespace before roster matching", () => {
    expect(normalizedEmail("  DataPlus.Org@Gmail.Com ")).toBe("dataplus.org@gmail.com");
  });
});

