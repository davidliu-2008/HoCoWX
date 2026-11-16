import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PageScrollReveal } from "@/components/PageScrollReveal";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "HoCo Weather Channel",
  description: "Howard County school operations, local weather, and student-led weather literacy.",
  icons: {
    icon: "/hoco-weather-channel-icon.png",
    shortcut: "/hoco-weather-channel-icon.png",
    apple: "/hoco-weather-channel-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
        <PageScrollReveal />
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
