import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "HoCo Weather Channel",
  description: "Howard County school operations, local weather, and student-led weather literacy.",
  icons: {
    icon: "/hoco-weather-channel-logo.png",
    shortcut: "/hoco-weather-channel-logo.png",
    apple: "/hoco-weather-channel-logo.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
