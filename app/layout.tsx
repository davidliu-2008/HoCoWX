import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HCPSS Operations + Weather",
  description: "Unofficial Howard County school operations and weather prediction dashboard."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
