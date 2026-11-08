import Link from "next/link";
import { Instagram, Mail, Podcast } from "lucide-react";

const footerLinks = [
  { href: "/predictions", label: "Predictions" },
  { href: "/maryland-status", label: "School Status" },
  { href: "/weather-literacy", label: "Weather Literacy" },
  { href: "/about", label: "About" },
  { href: "/partnerships", label: "Partnerships" }
];

export function SiteFooter() {
  return (
    <footer className="mt-4 bg-navy px-4 py-10 text-white sm:px-6">
      <div className="mx-auto grid w-full max-w-[1440px] gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-2xl font-black">HoCo Weather Channel</p>
          <p className="mt-2 text-lg font-bold text-blue-200">By students. For students.</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">Local weather, school operations, and environmental news for Maryland students and families.</p>
        </div>
        <div className="space-y-5">
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-blue-100" aria-label="Footer navigation">
            {footerLinks.map((link) => <Link key={link.href} href={link.href} className="hover:text-white">{link.label}</Link>)}
          </nav>
          <div className="flex gap-2 lg:justify-end">
            <a href="mailto:howardcountyweather@gmail.com" className="footer-icon-button" aria-label="Email"><Mail className="h-4 w-4" /></a>
            <a href="https://www.instagram.com/hocoweatherchannel/?hl=en" target="_blank" rel="noreferrer" className="footer-icon-button" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a href="https://open.spotify.com/show/1lq3ulTfGtY46EsGSm6VXl?si=fbfb99f380c848d5" target="_blank" rel="noreferrer" className="footer-icon-button" aria-label="Podcast"><Podcast className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 flex w-full max-w-[1440px] flex-col gap-2 border-t border-white/15 pt-5 text-xs leading-5 text-blue-200 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} HoCo Weather Channel. All rights reserved.</p>
        <p>Student-led weather service and formal HCPSS partner.</p>
      </div>
    </footer>
  );
}
