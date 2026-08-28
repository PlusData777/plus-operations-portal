import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { isPrivilegedRole, canAssignTasks, findRosterMember } from "@/lib/rbac";
import type { PortalRole, RosterMember } from "@/lib/types";
import { listRoster } from "@/lib/webhook";

export type PortalUser = {
  name: string;
  email: string;
  role: PortalRole;
  designation: string;
  department: string;
  approvalScope: string;
};

export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXTAUTH_SECRET &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
  );
}

export function isPrivilegedUser(user: PortalUser | null | undefined): boolean {
  if (!user) return false;
  return isPrivilegedRole(user.role);
}

export function canUserAssignTasks(user: PortalUser | null | undefined): boolean {
  if (!user) return false;
  return canAssignTasks(user.role);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/cockpit`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};

export async function getCurrentUser(): Promise<PortalUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const email = session.user.email.toLowerCase().trim();
  const adminList = (process.env.ADMIN_EMAILS || "dataplus.org@gmail.com,kamanger110@gmail.com")
    .toLowerCase()
    .split(",")
    .map((e) => e.trim());

  if (adminList.includes(email)) {
    return {
      name: session.user.name || "Administrator",
      email,
      role: "ADMIN",
      designation: "System Administrator",
      department: "IT / Systems",
      approvalScope: "Full Access / Task Assigner",
    };
  }

  try {
    const roster = await listRoster();
    const member = findRosterMember(roster, email);
    if (member) {
      return {
        name: member.name || session.user.name || "",
        email: member.email,
        role: member.role,
        designation: member.designation,
        department: member.department,
        approvalScope: member.approvalScope,
      };
    }
  } catch (error) {
    console.error("Failed to load user roster details:", error);
  }

  return {
    name: session.user.name || email.split("@")[0],
    email,
    role: "GENERAL_STAFF",
    designation: "Staff Member",
    department: "Operations",
    approvalScope: "General Operations",
  };
}
