import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LandZM — Verified Land & Property in Zambia",
  description: "Search verified land listings across Zambia. Fight land fraud — every listing shows title deed status.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
