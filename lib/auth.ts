import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { normalizedEmail } from "@/lib/authorization";
import { resolveAuthOrigin } from "@/lib/auth-origin";
import { canAssignTasks, findRosterMember, isPrivilegedRole } from "@/lib/rbac";
import type { PortalRole, RosterMember } from "@/lib/types";
import { listRoster } from "@/lib/webhook";

export type PortalUser = { name: string; email: string; role: PortalRole; designation: string; department: string; approvalScope: string };

export function isAuthConfigured() {
  return Boolean(process.env.NEXTAUTH_SECRET && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export const authOptions: NextAuthOptions = {
  providers: [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID ?? "", clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "" })],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/", error: "/" },
  callbacks: {
 async signIn({ profile, user }) {
      const email = (profile?.email || user?.email || "").toLowerCase().trim();
      if (!email) return false;

      const adminList = (process.env.ADMIN_EMAILS || "dataplus.org@gmail.com,kamanger110@gmail.com")
        .toLowerCase()
        .split(",")
        .map((e) => e.trim());

      // 1. Direct admin bypass
      if (adminList.includes(email)) {
        return true;
      }

      // 2. Staff roster lookup
      try {
        const roster = await listRoster();
        return Boolean(findRosterMember(roster, email));
      } catch (error) {
        console.error("Unable to verify the active PLUS roster during sign-in", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      const trustedOrigin = resolveAuthOrigin() ?? baseUrl;
      if (url.startsWith("/")) return `${trustedOrigin}${url}`;
      try { return new URL(url).origin === trustedOrigin ? url : trustedOrigin; }
      catch { return trustedOrigin; }
    }
  }
};

export async function getCurrentUser() {
  if (!isAuthConfigured()) return null;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ? normalizedEmail(session.user.email) : null;
  if (!email) return null;
  try {
    const rosterMember = findRosterMember(await listRoster(), email);
    if (!rosterMember) return null;
    return { ...rosterMember, name: rosterMember.name || session?.user?.name?.trim() || email };
  } catch (error) {
    console.error("Unable to verify the active PLUS roster for the current session", error);
    return null;
  }
}

export function isPrivilegedUser(user: Pick<PortalUser, "role">) {
  return isPrivilegedRole(user.role);
}

export function canCurrentUserAssignTasks(user: Pick<PortalUser, "role">) {
  return canAssignTasks(user.role);
}

export async function getCurrentPrivilegedUser() {
  const user = await getCurrentUser();
  return user && isPrivilegedUser(user) ? user : null;
}
