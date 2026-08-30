import type { Metadata } from "next";
import "./globals.css"; // CRUCIAL: This line tells Next.js to inject Tailwind into the DOM

export const metadata: Metadata = {
  title: "PLUS OPS Portal",
  description: "Pakistan Legal United Society Operations Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
