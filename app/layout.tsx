import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Price Scraper",
  description: "Scrape SSP and street prices across sources",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, system-ui, Arial, sans-serif", background: "#0b0f17", color: "#e6edf3" }}>{children}</body>
    </html>
  );
}
