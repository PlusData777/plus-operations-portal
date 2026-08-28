type AuthEnvironment = Partial<Pick<NodeJS.ProcessEnv, "NEXTAUTH_URL" | "VERCEL_URL">>;

function asTrustedHttpsOrigin(value?: string) {
  if (!value) return undefined;
  try {
    const candidate = value.includes("://") ? value : `https://${value}`;
    const url = new URL(candidate);
    return url.protocol === "https:" ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

/** Resolves only configured environment origins; request headers are never trusted for OAuth redirects. */
export function resolveAuthOrigin(environment: AuthEnvironment = process.env) {
  return asTrustedHttpsOrigin(environment.NEXTAUTH_URL) ?? asTrustedHttpsOrigin(environment.VERCEL_URL);
}
