import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "MemoryNode Next.js Agent",
  description: "Ingest and search with MemoryNode",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0b1222", color: "#e5e7eb" }}>{children}</body>
    </html>
  );
}
