import Link from "next/link";
import { BarChart3, BookOpen, ChevronDown, CloudSun, Handshake, Instagram, MapPinned, Mic2 } from "lucide-react";

type Tab = "dashboard" | "maryland" | "interview" | "instagram" | "student-polls" | "literacy" | "partnerships";

export function PageTabs({ active }: { active: Tab }) {
  const linkClass = (tab: Tab) =>
    [
      "inline-flex shrink-0 items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-bold transition",
      active === tab
        ? "border-bay text-bay"
        : "border-transparent text-slate-500 hover:border-blue-200 hover:text-bay"
    ].join(" ");

  return (
    <nav className="relative z-40 flex flex-wrap gap-1 overflow-visible border-y border-blue-100 bg-white/90 px-1" aria-label="Main sections">
      <Link href="/" className={linkClass("dashboard")}>
        <CloudSun className="h-4 w-4" />
        Dashboard
      </Link>
      <Link href="/maryland-status" className={linkClass("maryland")}>
        <MapPinned className="h-4 w-4" />
        Maryland Status
      </Link>
      <Link href="/interview" className={linkClass("interview")}>
        <Mic2 className="h-4 w-4" />
        Interview
      </Link>
      <Link href="/instagram" className={linkClass("instagram")}>
        <Instagram className="h-4 w-4" />
        Weather Insights
      </Link>
      <Link href="/student-polls" className={linkClass("student-polls")}>
        <BarChart3 className="h-4 w-4" />
        Student Prediction Lab
      </Link>
      <Link href="/weather-literacy" className={linkClass("literacy")}>
        <BookOpen className="h-4 w-4" />
        Weather Literacy
      </Link>
      <details className="group relative">
        <summary className={`${linkClass("partnerships")} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
          <Handshake className="h-4 w-4" />
          Partnerships
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </summary>
        <div className="absolute right-0 top-full z-50 mt-1 min-w-64 border border-blue-100 bg-white p-1 shadow-lg">
          <Link href="/partnerships?partner=hcpss" className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-bay">
            Howard County Public Schools
          </Link>
          <Link href="/partnerships?partner=capital-weather" className="block border-t border-blue-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-bay">
            Capital Weather Gang
          </Link>
        </div>
      </details>
    </nav>
  );
}
