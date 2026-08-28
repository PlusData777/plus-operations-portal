import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { isAuthConfigured } from "@/lib/auth";

export const metadata: Metadata = { title: "PLUS Operations & Approval Portal", description: "Secure internal request submission and executive approval workflow for Pakistan Legal United Society." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><Providers authEnabled={isAuthConfigured()}>{children}</Providers></body></html>; }
