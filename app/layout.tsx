import React from "react";

export const metadata = {
  title: "Pakistan Legal United Society - Operations Hub",
  description: "Operations, Programs & Governance Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#f8fafc" }}>
        {children}
      </body>
    </html>
  );
}
