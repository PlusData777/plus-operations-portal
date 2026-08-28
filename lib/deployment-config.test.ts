import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("Next.js deployment artifact configuration", () => {
  it("uses a self-contained standalone server image instead of the inherited Vite dist/public path", () => {
    const config = readFileSync(join(root, "next.config.ts"), "utf8");
    const dockerfilePath = join(root, "Dockerfile");
    expect(config).toContain('output: "standalone"');
    expect(existsSync(dockerfilePath)).toBe(true);

    const dockerfile = readFileSync(dockerfilePath, "utf8");
    expect(dockerfile).toContain('CMD ["node", ".next/standalone/server.js"]');
    expect(dockerfile).toContain("cp -R .next/static .next/standalone/.next/static");
    expect(dockerfile).not.toContain("dist/public");
  });
});

