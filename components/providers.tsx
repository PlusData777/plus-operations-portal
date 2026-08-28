"use client";
import { SessionProvider } from "next-auth/react";
export function Providers({ children, authEnabled }: { children: React.ReactNode; authEnabled: boolean }) { return authEnabled ? <SessionProvider>{children}</SessionProvider> : <>{children}</>; }
