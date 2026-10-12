import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-4 w-full max-w-[1600px] border-t border-blue-100 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-bold text-ink">HoCo Weather Channel</p>
          <p className="mt-1 text-sm font-semibold text-bay">By students. For students.</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Local weather, school operations, and environmental news for the Howard County community.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-slate-600">
          <Link href="/weather-literacy" className="hover:text-bay">Weather Literacy</Link>
          <Link href="/briefings" className="hover:text-bay">Weather Briefings</Link>
          <a href="mailto:howardcountyweather@gmail.com" className="inline-flex items-center gap-1.5 hover:text-bay">
            <Mail className="h-4 w-4" /> Email
          </a>
          <a
            href="https://www.instagram.com/hocoweatherchannel/?hl=en"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-bay"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </a>
        </div>
      </div>

      <div className="mt-6 border-t border-blue-100 pt-5 text-xs leading-5 text-slate-500 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <p>© {new Date().getFullYear()} HoCo Weather Channel. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Independent student-led project. Not affiliated with or operated by HCPSS.</p>
      </div>
    </footer>
  );
}
